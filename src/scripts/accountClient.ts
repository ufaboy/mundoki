import { Locale } from '../math/core/types';
import { saveLocalGameState } from './gameStateStorage';

type AuthMode = 'signin' | 'signup';
type BannerKind = 'ok' | 'error' | 'info';
type Json = Record<string, any>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;
const MAGIC_RESEND_SECONDS = 30;

const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;

const show = (el: HTMLElement | null, visible: boolean) => {
  if (el) el.hidden = !visible;
};

const sessionToken = () => window.localStorage.getItem('mundoki_token') || '';

function sanitizeNextPath(nextParam: string | null): string {
  const raw = nextParam || '';
  return /^\/(?!\/)[\w\-/.%]*$/.test(raw) ? raw : '';
}

function updateHeaderName(label: string) {
  const headerLink = byId('header-account-link');
  if (headerLink && label) headerLink.textContent = label;
}

async function postJson(url: string, body: unknown, token?: string): Promise<{ ok: boolean; status: number; data: Json }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers, body: JSON.stringify(body ?? {}) });
  const data = (await res.json().catch(() => ({}))) as Json;
  return { ok: res.ok, status: res.status, data };
}

function createHelpers(locale: Locale) {
  const L = (es: string, en: string) => (locale === 'es-AR' ? es : en);
  const banner = byId('account-status-banner');

  function showBanner(message: string, kind: BannerKind = 'info') {
    if (!banner) return;
    const kindClass = kind === 'ok' ? 'mk-feedback--correct' : kind === 'error' ? 'mk-feedback--retry' : 'mk-feedback--hint';
    banner.className = `mk-feedback ${kindClass}`;
    const text = banner.querySelector('.mk-feedback__text');
    if (text) text.textContent = message;
    banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  /** Runs a request with the button locked, and turns network failures into one message. */
  async function withBusy(btn: HTMLButtonElement | null, work: () => Promise<void>) {
    if (btn?.disabled) return;
    if (btn) btn.disabled = true;
    try {
      await work();
    } catch {
      showBanner(L('No hay conexión. Probá de nuevo en un momento.', 'No connection. Try again in a moment.'), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  return { L, showBanner, hideBanner, withBusy };
}

// ============================================================================
// Login page (/es-ar/login/, /en-us/login/)
// ============================================================================

export function initLoginPage(): void {
  const root = byId('login-page-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const accountUrl = root.dataset.accountUrl || (locale === 'en-US' ? '/en-us/account/' : '/es-ar/cuenta/');
  const { L, showBanner, hideBanner, withBusy } = createHelpers(locale);

  const guestView = byId('account-guest-view');
  const challengeView = byId('account-2fa-challenge-view');
  const emailInput = byId<HTMLInputElement>('input-auth-email');
  const passwordInput = byId<HTMLInputElement>('input-auth-password');
  const signupPasswordInput = byId<HTMLInputElement>('input-auth-signup-password');
  const passwordLabel = byId<HTMLLabelElement>('label-auth-password');
  const nameInput = byId<HTMLInputElement>('input-auth-name');
  const emailError = byId('auth-email-error');
  const passwordError = byId('auth-password-error');
  const submitBtn = byId<HTMLButtonElement>('btn-submit-password-auth');
  const magicBtn = byId<HTMLButtonElement>('btn-send-magic-link');
  const magicDevBox = byId('magic-dev-outbox');

  const returnPath = sanitizeNextPath(new URLSearchParams(window.location.search).get('next'));

  let authMode: AuthMode = 'signin';
  let pending2faToken = '';
  let devMagicToken = '';

  function setFieldError(input: HTMLInputElement | null, errorEl: HTMLElement | null, message: string) {
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
  }

  const activePasswordInput = () => (authMode === 'signup' ? signupPasswordInput : passwordInput);

  function clearFieldErrors() {
    setFieldError(emailInput, emailError, '');
    setFieldError(passwordInput, passwordError, '');
    setFieldError(signupPasswordInput, passwordError, '');
  }

  function validEmail(): string | null {
    const email = (emailInput?.value || '').trim();
    if (!EMAIL_PATTERN.test(email)) {
      setFieldError(
        emailInput,
        emailError,
        email ? L('Revisá el correo: falta algo.', 'Check the email: something is missing.') : L('Escribí tu correo.', 'Enter your email.')
      );
      emailInput?.focus();
      return null;
    }
    setFieldError(emailInput, emailError, '');
    return email;
  }

  function showLoginView(view: 'guest' | 'challenge') {
    show(guestView, view === 'guest');
    show(challengeView, view === 'challenge');
  }

  function setMode(mode: AuthMode) {
    authMode = mode;
    document.querySelectorAll<HTMLButtonElement>('[data-auth-tab]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.authTab === mode));
    });
    const signup = mode === 'signup';
    show(byId('auth-name-group'), signup);
    show(byId('auth-password-hint'), signup);
    show(byId('auth-magic-block'), !signup);
    if (!signup) show(magicDevBox, Boolean(devMagicToken));
    else show(magicDevBox, false);
    if (passwordInput) {
      passwordInput.hidden = signup;
      passwordInput.disabled = signup;
    }
    if (signupPasswordInput) {
      signupPasswordInput.hidden = !signup;
      signupPasswordInput.disabled = !signup;
    }
    passwordLabel?.setAttribute('for', signup ? 'input-auth-signup-password' : 'input-auth-password');
    if (submitBtn) submitBtn.textContent = signup ? L('Crear cuenta', 'Create account') : L('Entrar', 'Sign in');
    clearFieldErrors();
    hideBanner();
  }

  function applyAuthResponse(data: Json) {
    if (data.requiresTwoFactor && data.pending2faToken) {
      pending2faToken = String(data.pending2faToken);
      showLoginView('challenge');
      hideBanner();
      const emailEl = byId('challenge-2fa-email');
      if (emailEl) emailEl.textContent = String(data.email || '');
      const devTotp = byId('challenge-2fa-dev-totp');
      if (devTotp) {
        devTotp.textContent = data.devCurrentTotpCode
          ? L(`Modo desarrollo — código actual: ${data.devCurrentTotpCode}`, `Development mode — current code: ${data.devCurrentTotpCode}`)
          : '';
        devTotp.hidden = !data.devCurrentTotpCode;
      }
      byId<HTMLInputElement>('input-2fa-challenge-code')?.focus();
      return;
    }

    if (data.token && data.user) {
      window.localStorage.setItem('mundoki_token', String(data.token));
      window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
      window.localStorage.setItem('mundoki_premium', data.isPremiumEntitled ? 'true' : 'false');
      if (data.gameState) saveLocalGameState(data.gameState);
      updateHeaderName(String(data.user.name || ''));
      window.location.assign(returnPath || accountUrl);
    }
  }

  // ---------- Magic link: opened from the email (?magic_token=) ----------

  async function verifyMagicToken(token: string) {
    const { ok, data } = await postJson('/api/auth/magic-link/verify', { token, locale });
    if (!ok) {
      showBanner(
        L('Este enlace ya no sirve: venció o ya se usó. Pedí uno nuevo.', 'This link no longer works: it expired or was already used. Ask for a new one.'),
        'error'
      );
      return;
    }
    applyAuthResponse(data);
  }

  const magicTokenParam = new URLSearchParams(window.location.search).get('magic_token');
  if (magicTokenParam) {
    window.history.replaceState({}, '', window.location.pathname);
    verifyMagicToken(magicTokenParam).catch(() => {});
  }

  // ---------- Sign in / create account ----------

  document.querySelectorAll<HTMLButtonElement>('[data-auth-tab]').forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.authTab === 'signup' ? 'signup' : 'signin'));
  });

  byId('btn-toggle-password')?.addEventListener('click', (event) => {
    const btn = event.currentTarget as HTMLButtonElement;
    const current = activePasswordInput();
    if (!current) return;
    const reveal = current.type === 'password';
    if (passwordInput) passwordInput.type = reveal ? 'text' : 'password';
    if (signupPasswordInput) signupPasswordInput.type = reveal ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(reveal));
    btn.textContent = reveal ? L('Ocultar', 'Hide') : L('Mostrar', 'Show');
  });

  emailInput?.addEventListener('input', () => {
    if (emailInput.getAttribute('aria-invalid') === 'true') setFieldError(emailInput, emailError, '');
  });
  [passwordInput, signupPasswordInput].forEach((input) => {
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setFieldError(input, passwordError, '');
    });
  });

  byId<HTMLFormElement>('form-password-auth')?.addEventListener('submit', (event) => {
    event.preventDefault();
    hideBanner();
    const email = validEmail();
    if (!email) return;
    const currentPasswordInput = activePasswordInput();
    const password = currentPasswordInput?.value || '';
    if (password.length < MIN_PASSWORD) {
      setFieldError(
        currentPasswordInput,
        passwordError,
        password ? L('La contraseña tiene que tener 6 letras o números como mínimo.', 'The password needs at least 6 letters or numbers.') : L('Escribí tu contraseña.', 'Enter your password.')
      );
      currentPasswordInput?.focus();
      return;
    }

    withBusy(submitBtn, async () => {
      const signup = authMode === 'signup';
      const { ok, status, data } = await postJson(signup ? '/api/auth/signup' : '/api/auth/signin', {
        email,
        password,
        name: (nameInput?.value || '').trim(),
        locale,
      });
      if (!ok) {
        if (!signup) {
          showBanner(L('El correo o la contraseña no coinciden.', 'The email or password does not match.'), 'error');
        } else if (status === 409) {
          showBanner(
            L('Ya hay una cuenta con este correo. Entrá con tu contraseña o con un enlace al correo.', 'There is already an account with this email. Sign in with your password or an email link.'),
            'error'
          );
        } else {
          showBanner(L('No pudimos crear la cuenta. Revisá los datos y probá de nuevo.', 'We could not create the account. Check the details and try again.'), 'error');
        }
        return;
      }
      applyAuthResponse(data);
    });
  });

  // ---------- Magic link: request from the sign-in form ----------

  function lockMagicButton() {
    if (!magicBtn) return;
    let left = MAGIC_RESEND_SECONDS;
    magicBtn.disabled = true;
    magicBtn.setAttribute('aria-disabled', 'true');
    magicBtn.title = L('Podés pedir otro enlace en unos segundos.', 'You can ask for another link in a few seconds.');
    const timer = window.setInterval(() => {
      left -= 1;
      if (left > 0) return;
      window.clearInterval(timer);
      magicBtn.disabled = false;
      magicBtn.removeAttribute('aria-disabled');
      magicBtn.removeAttribute('title');
    }, 1000);
  }

  magicBtn?.addEventListener('click', () => {
    hideBanner();
    setFieldError(activePasswordInput(), passwordError, '');
    const email = validEmail();
    if (!email) return;

    let sent = false;
    withBusy(magicBtn, async () => {
      const { ok, data } = await postJson('/api/auth/magic-link/request', { email, locale });
      if (!ok) {
        showBanner(String(data.error || L('No pudimos enviar el enlace. Entrá con tu contraseña.', 'We could not send the link. Sign in with your password.')), 'error');
        return;
      }
      sent = true;
      showBanner(String(data.message || ''), 'ok');
      devMagicToken = String(data.magicToken || '');
      show(magicDevBox, Boolean(devMagicToken));
    }).then(() => {
      if (sent) lockMagicButton();
    });
  });

  byId<HTMLButtonElement>('btn-verify-magic-now')?.addEventListener('click', (event) => {
    if (!devMagicToken) return;
    withBusy(event.currentTarget as HTMLButtonElement, () => verifyMagicToken(devMagicToken));
  });

  // ---------- OAuth (section hidden until providers are configured) ----------

  type OAuthProvider = 'google' | 'facebook' | 'apple';
  const asProvider = (raw?: string): OAuthProvider => (raw === 'facebook' || raw === 'apple' ? raw : 'google');
  const oauthDevSandbox = byId('oauth-dev-sandbox');

  window.addEventListener('message', (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    const payload = event.data;
    if (!payload || typeof payload !== 'object') return;
    if (payload.type === 'OAUTH_AUTH_SUCCESS') applyAuthResponse(payload);
    else if (payload.type === 'OAUTH_AUTH_ERROR') showBanner(L('No se pudo entrar con esa cuenta.', 'Could not sign in with that account.'), 'error');
  });

  document.querySelectorAll<HTMLButtonElement>('[data-oauth-provider]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const provider = asProvider(btn.dataset.oauthProvider);
      const res = await fetch(`/api/auth/oauth/url?provider=${encodeURIComponent(provider)}&locale=${encodeURIComponent(locale)}`);
      const data = (await res.json()) as Json;
      if (data.configured && data.url) {
        window.open(data.url, 'mundoki_oauth_popup', 'width=560,height=680');
      } else if (oauthDevSandbox) {
        oauthDevSandbox.hidden = false;
        oauthDevSandbox.dataset.selectedProvider = provider;
        const label = byId('oauth-sandbox-provider-label');
        if (label) label.textContent = btn.textContent?.trim() || provider;
      }
    });
  });

  byId('btn-confirm-dev-oauth')?.addEventListener('click', async () => {
    const provider = asProvider(oauthDevSandbox?.dataset.selectedProvider);
    const email = byId<HTMLInputElement>('input-dev-oauth-email')?.value || `explorador.${provider}@mundoki.edu.ar`;
    const { ok, data } = await postJson('/api/auth/oauth/dev-simulate', { provider, email, locale });
    if (ok) applyAuthResponse(data);
  });

  // ---------- Second step at sign-in ----------

  byId<HTMLFormElement>('form-2fa-challenge')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const btn = (event.currentTarget as HTMLFormElement).querySelector<HTMLButtonElement>('button[type="submit"]');
    const code = (byId<HTMLInputElement>('input-2fa-challenge-code')?.value || '').trim();
    if (!code) return;
    withBusy(btn, async () => {
      const { ok, data } = await postJson('/api/auth/2fa/verify-challenge', { pending2faToken, code });
      if (!ok) {
        // The server allows one try per sign-in, so a wrong code means starting the sign-in again.
        pending2faToken = '';
        const codeInput = byId<HTMLInputElement>('input-2fa-challenge-code');
        if (codeInput) codeInput.value = '';
        showLoginView('guest');
        showBanner(
          L('El código no sirvió. Volvé a entrar y escribí el código que muestra la app en ese momento.', 'That code did not work. Sign in again and enter the code the app shows at that moment.'),
          'error'
        );
        return;
      }
      applyAuthResponse(data);
    });
  });

  byId('btn-cancel-2fa-challenge')?.addEventListener('click', () => {
    pending2faToken = '';
    hideBanner();
    showLoginView('guest');
  });
}

// ============================================================================
// Account page (/es-ar/cuenta/, /en-us/account/) — authenticated users only
// ============================================================================

export function initAccountPage(): void {
  const root = byId('account-page-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const loginUrl = root.dataset.loginUrl || (locale === 'en-US' ? '/en-us/login/' : '/es-ar/login/');
  const { L, showBanner, hideBanner, withBusy } = createHelpers(locale);

  const returnPath = sanitizeNextPath(new URLSearchParams(window.location.search).get('next'));

  function renderLoggedInState(user: Json, isPremium: boolean) {
    const isAdmin = user.role === 'admin';
    const hasInvite = Boolean(sessionStorage.getItem('mundoki_invite'));
    show(byId('account-admin-promos'), isAdmin);
    show(byId('account-admin-promo'), isAdmin);
    show(byId('account-return-promo'), hasInvite);
    const returnLink = byId<HTMLAnchorElement>('account-return-next');
    if (returnLink && returnPath) returnLink.href = returnPath;
    show(returnLink, Boolean(returnPath));
    show(byId('account-extra-links'), isAdmin || hasInvite || Boolean(returnPath));

    const roleLabelEl = byId('user-profile-role-label');
    if (roleLabelEl) {
      roleLabelEl.textContent = isAdmin ? L('Cuenta de administrador', 'Admin account') : L('Cuenta de la familia', 'Family account');
    }
    const name = String(user.name || '').trim();
    const nameEl = byId('user-profile-name');
    if (nameEl) nameEl.textContent = name ? L(`¡Hola, ${name}!`, `Hi, ${name}!`) : L('¡Hola!', 'Hi!');
    const emailEl = byId('user-profile-email');
    if (emailEl) emailEl.textContent = String(user.email || '');

    const tierChip = byId('user-profile-tier');
    if (tierChip) {
      tierChip.textContent = isPremium ? 'Premium' : L('Gratis', 'Free');
      tierChip.className = isPremium ? 'mk-chip mk-chip--grape' : 'mk-chip';
    }
    const tierText = byId('user-profile-tier-text');
    if (tierText) {
      tierText.textContent = isPremium
        ? L('Tienen todos los mundos y lecciones abiertos.', 'All worlds and lessons are open for your family.')
        : L('Con Premium se abren todos los mundos y lecciones.', 'Premium opens every world and lesson.');
    }
    const tierLink = byId('user-profile-tier-link');
    if (tierLink) tierLink.textContent = isPremium ? L('Ver mi plan', 'See my plan') : L('Conocer Premium', 'See Premium');

    const tfEnabled = Boolean(user.twoFactorEnabled);
    const tfBadge = byId('user-2fa-status-badge');
    if (tfBadge) {
      tfBadge.textContent = tfEnabled ? L('activada', 'on') : L('desactivada', 'off');
      tfBadge.className = tfEnabled ? 'mk-chip mk-chip--leaf' : 'mk-chip';
    }
    show(byId('btn-start-2fa-setup'), !tfEnabled);
    show(byId('form-disable-2fa'), tfEnabled);
    if (tfEnabled) show(byId('panel-2fa-setup'), false);
  }

  // Hydrate client-side invite / ?next= links immediately, then keep session state in sync.
  const hasInvite = Boolean(sessionStorage.getItem('mundoki_invite'));
  if (hasInvite || returnPath) {
    show(byId('account-return-promo'), hasInvite);
    const returnLink = byId<HTMLAnchorElement>('account-return-next');
    if (returnLink && returnPath) returnLink.href = returnPath;
    show(returnLink, Boolean(returnPath));
    show(byId('account-extra-links'), true);
  }

  fetch('/api/auth/me', {
    credentials: 'same-origin',
    headers: sessionToken() ? { Authorization: `Bearer ${sessionToken()}` } : {},
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data && data.authenticated && data.user) {
        window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
        window.localStorage.setItem('mundoki_premium', data.isPremiumEntitled ? 'true' : 'false');
        updateHeaderName(String(data.user.name || ''));
        renderLoggedInState(data.user, Boolean(data.isPremiumEntitled));
      } else if (data && !data.authenticated) {
        window.localStorage.removeItem('mundoki_token');
        window.localStorage.removeItem('mundoki_user');
        window.localStorage.removeItem('mundoki_premium');
        window.location.replace(loginUrl);
      }
    })
    .catch(() => {});

  // ---------- Two-step verification: turn on / off ----------

  function storeUpdatedUser(user: Json) {
    window.localStorage.setItem('mundoki_user', JSON.stringify(user));
    renderLoggedInState(user, window.localStorage.getItem('mundoki_premium') === 'true');
  }

  byId<HTMLButtonElement>('btn-start-2fa-setup')?.addEventListener('click', (event) => {
    withBusy(event.currentTarget as HTMLButtonElement, async () => {
      const { ok, data } = await postJson('/api/auth/2fa/setup', {}, sessionToken());
      if (!ok) {
        showBanner(L('No pudimos empezar. Recargá la página y probá de nuevo.', 'We could not start. Reload the page and try again.'), 'error');
        return;
      }
      hideBanner();
      const panel = byId('panel-2fa-setup');
      const secretEl = byId('totp-setup-secret');
      if (secretEl) secretEl.textContent = String(data.secret || '').replace(/(.{4})(?=.)/g, '$1 ');
      const uriLink = byId<HTMLAnchorElement>('totp-setup-uri');
      if (uriLink) {
        uriLink.href = String(data.otpauthUri || '#');
        uriLink.hidden = !data.otpauthUri;
      }
      const codesEl = byId('totp-backup-codes-list');
      if (codesEl) {
        codesEl.replaceChildren(
          ...(Array.isArray(data.backupCodes) ? data.backupCodes : []).map((code: string) => {
            const li = document.createElement('li');
            li.textContent = String(code);
            return li;
          })
        );
      }
      const devCode = byId('totp-setup-dev-code');
      if (devCode) {
        devCode.textContent = data.devCurrentTotpCode
          ? L(`Modo desarrollo — código actual: ${data.devCurrentTotpCode}`, `Development mode — current code: ${data.devCurrentTotpCode}`)
          : '';
        devCode.hidden = !data.devCurrentTotpCode;
      }
      show(panel, true);
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  byId<HTMLFormElement>('form-enable-2fa')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const btn = (event.currentTarget as HTMLFormElement).querySelector<HTMLButtonElement>('button[type="submit"]');
    const input = byId<HTMLInputElement>('input-totp-verify-code');
    withBusy(btn, async () => {
      const { ok, data } = await postJson('/api/auth/2fa/enable', { code: (input?.value || '').trim() }, sessionToken());
      if (!ok) {
        showBanner(L('El código no sirve. Escribí el que muestra la app ahora.', 'That code does not work. Enter the one the app shows right now.'), 'error');
        return;
      }
      if (input) input.value = '';
      if (data.user) storeUpdatedUser(data.user);
      showBanner(L('Listo: la verificación en dos pasos está activada.', 'Done: two-step verification is on.'), 'ok');
    });
  });

  byId<HTMLFormElement>('form-disable-2fa')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const btn = byId<HTMLButtonElement>('btn-disable-2fa');
    const input = byId<HTMLInputElement>('input-2fa-disable-code');
    withBusy(btn, async () => {
      const { ok, data } = await postJson('/api/auth/2fa/disable', { code: (input?.value || '').trim() }, sessionToken());
      if (!ok) {
        showBanner(
          L('El código no sirve o hubo muchos intentos. Probá de nuevo en cinco minutos.', 'That code does not work, or there were too many tries. Try again in five minutes.'),
          'error'
        );
        return;
      }
      if (input) input.value = '';
      if (data.user) storeUpdatedUser(data.user);
      showBanner(L('La verificación en dos pasos está desactivada.', 'Two-step verification is off.'), 'info');
    });
  });

  // ---------- Sign out ----------

  byId<HTMLButtonElement>('btn-sign-out')?.addEventListener('click', (event) => {
    withBusy(event.currentTarget as HTMLButtonElement, async () => {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: sessionToken() ? { Authorization: `Bearer ${sessionToken()}` } : {},
      }).catch(() => {});
      window.localStorage.removeItem('mundoki_token');
      window.localStorage.removeItem('mundoki_user');
      window.localStorage.removeItem('mundoki_premium');
      updateHeaderName(L('Familia', 'Parents'));
      window.location.assign(loginUrl);
    });
  });
}
