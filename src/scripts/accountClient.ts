import { Locale } from '../math/core/types';
import { saveLocalGameState } from './playClient';

export function initAccountPage(): void {
  const root = document.getElementById('account-page-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;

  const guestView = document.getElementById('account-guest-view');
  const challengeView = document.getElementById('account-2fa-challenge-view');
  const loggedInView = document.getElementById('account-loggedin-view');
  const statusBanner = document.getElementById('account-status-banner');

  let pending2faToken = '';

  function showBanner(msg: string, kind: 'sky' | 'emerald' | 'amber' | 'rose' = 'sky') {
    if (!statusBanner) return;
    statusBanner.style.display = 'block';
    statusBanner.className = `callout ${
      kind === 'emerald'
        ? 'callout-emerald'
        : kind === 'amber'
          ? 'callout-amber'
          : kind === 'rose'
            ? 'callout-rose'
            : ''
    } text-sm`;
    statusBanner.textContent = msg;
  }

  function applyAuthResponse(data: Record<string, any>) {
    if (data.requiresTwoFactor && data.pending2faToken) {
      pending2faToken = String(data.pending2faToken);
      if (guestView) guestView.style.display = 'none';
      if (loggedInView) loggedInView.style.display = 'none';
      if (challengeView) challengeView.style.display = 'block';

      const emailEl = document.getElementById('challenge-2fa-email');
      const devTotpBox = document.getElementById('challenge-2fa-dev-totp');
      if (emailEl) emailEl.textContent = String(data.email || '');
      if (devTotpBox && data.devCurrentTotpCode) {
        devTotpBox.style.display = 'block';
        devTotpBox.textContent =
          locale === 'es-AR'
            ? `[MODO DESARROLLO — Código TOTP actual]: ${data.devCurrentTotpCode}`
            : `[DEV TOTP HELPER — Current 6-digit code]: ${data.devCurrentTotpCode}`;
      }
      showBanner(
        locale === 'es-AR'
          ? 'Ingresá tu código 2FA de 6 dígitos o un código de recuperación para completar el acceso.'
          : 'Enter your 6-digit 2FA code or a recovery backup code to finish signing in.',
        'amber'
      );
      return;
    }

    if (data.token && data.user) {
      window.localStorage.setItem('mundoki_token', String(data.token));
      window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
      window.localStorage.setItem(
        'mundoki_premium',
        data.isPremiumEntitled ? 'true' : 'false'
      );
      if (data.gameState) {
        saveLocalGameState(data.gameState);
      }
      const headerLink = document.getElementById('header-account-link');
      if (headerLink && data.user.name) {
        headerLink.textContent = String(data.user.name);
      }
      renderLoggedInState(data.user, Boolean(data.isPremiumEntitled));
      showBanner(
        locale === 'es-AR'
          ? `¡Sesión iniciada correctamente como ${data.user.email}!`
          : `Signed in as ${data.user.email}!`,
        'emerald'
      );
    }
  }

  function renderLoggedInState(user: Record<string, any>, isPremium: boolean) {
    const adminLink = document.getElementById('account-admin-promos');
    if (adminLink) adminLink.hidden = user.role !== 'admin';
    const promoLink = document.getElementById('account-return-promo');
    if (promoLink) promoLink.hidden = !sessionStorage.getItem('mundoki_invite');
    if (guestView) guestView.style.display = 'none';
    if (challengeView) challengeView.style.display = 'none';
    if (loggedInView) loggedInView.style.display = 'block';

    const nameEl = document.getElementById('user-profile-name');
    const emailEl = document.getElementById('user-profile-email');
    const methodsEl = document.getElementById('user-profile-methods');
    const tierEl = document.getElementById('user-profile-tier');
    const twoFactorStatusEl = document.getElementById('user-2fa-status-badge');
    const btnStart2fa = document.getElementById('btn-start-2fa-setup');
    const btnDisable2fa = document.getElementById('btn-disable-2fa');
    const setup2faPanel = document.getElementById('panel-2fa-setup');

    if (nameEl) nameEl.textContent = String(user.name || '');
    if (emailEl) emailEl.textContent = String(user.email || '');
    if (methodsEl) {
      const methods = Array.isArray(user.authMethods) ? user.authMethods.join(', ') : 'password';
      methodsEl.textContent = methods;
    }
    if (tierEl) {
      tierEl.textContent = isPremium ? 'Premium Activo ✓' : locale === 'es-AR' ? 'Demo Gratis' : 'Free Demo';
    }

    const tfEnabled = Boolean(user.twoFactorEnabled);
    if (twoFactorStatusEl) {
      twoFactorStatusEl.textContent = tfEnabled
        ? locale === 'es-AR'
          ? '2FA Activo (Protegido con TOTP)'
          : '2FA Enabled (TOTP Protected)'
        : locale === 'es-AR'
          ? '2FA Desactivado'
          : '2FA Disabled';
    }
    if (btnStart2fa) btnStart2fa.style.display = tfEnabled ? 'none' : 'inline-flex';
    if (btnDisable2fa) btnDisable2fa.style.display = tfEnabled ? 'inline-flex' : 'none';
    if (setup2faPanel && tfEnabled) setup2faPanel.style.display = 'none';
  }

  // Check existing session on mount
  const existingToken = window.localStorage.getItem('mundoki_token');
  if (existingToken) {
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${existingToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.authenticated && data.user) {
          window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
          window.localStorage.setItem(
            'mundoki_premium',
            data.isPremiumEntitled ? 'true' : 'false'
          );
          renderLoggedInState(data.user, Boolean(data.isPremiumEntitled));
        }
      })
      .catch(() => {});
  }

  // Check for ?magic_token= in URL
  const urlParams = new URLSearchParams(window.location.search);
  const magicTokenParam = urlParams.get('magic_token');
  if (magicTokenParam) {
    window.history.replaceState({}, '', window.location.pathname);
    fetch('/api/auth/magic-link/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: magicTokenParam, locale }),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) {
          showBanner(d.error || 'Magic link verification failed.', 'rose');
          return;
        }
        applyAuthResponse(d);
      })
      .catch(() => {});
  }

  // Listen for OAuth popup postMessage
  window.addEventListener('message', (event: MessageEvent) => {
    const payload = event.data;
    if (!payload || typeof payload !== 'object') return;
    if (payload.type === 'OAUTH_AUTH_SUCCESS') {
      applyAuthResponse(payload);
    } else if (payload.type === 'OAUTH_AUTH_ERROR') {
      showBanner(String(payload.error || 'OAuth authentication failed.'), 'rose');
    }
  });

  // Auth mode tabs (SignIn / SignUp / MagicLink)
  let authMode: 'signin' | 'signup' | 'magic' = 'signin';
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('[data-auth-tab]');
  const passwordSection = document.getElementById('auth-password-section');
  const magicSection = document.getElementById('auth-magic-section');
  const nameGroup = document.getElementById('auth-name-group');
  const submitPasswordBtn = document.getElementById('btn-submit-password-auth');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      authMode = (btn.dataset.authTab || 'signin') as 'signin' | 'signup' | 'magic';
      tabBtns.forEach((b) => {
        b.className =
          b.dataset.authTab === authMode ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
      });
      if (passwordSection) passwordSection.style.display = authMode === 'magic' ? 'none' : 'block';
      if (magicSection) magicSection.style.display = authMode === 'magic' ? 'block' : 'none';
      if (nameGroup) nameGroup.style.display = authMode === 'signup' ? 'block' : 'none';
      if (submitPasswordBtn) {
        submitPasswordBtn.textContent =
          authMode === 'signup'
            ? locale === 'es-AR'
              ? 'Crear Cuenta'
              : 'Create Account'
            : locale === 'es-AR'
              ? 'Iniciar Sesión'
              : 'Sign In';
      }
    });
  });

  // Email + Password submit
  const passwordForm = document.getElementById('form-password-auth') as HTMLFormElement | null;
  passwordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('input-auth-email') as HTMLInputElement)?.value || '';
    const password =
      (document.getElementById('input-auth-password') as HTMLInputElement)?.value || '';
    const name = (document.getElementById('input-auth-name') as HTMLInputElement)?.value || '';

    const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(data.error || 'Authentication error.', 'rose');
      return;
    }
    applyAuthResponse(data);
  });

  // Magic Link request & instant verify
  const magicForm = document.getElementById('form-magic-link') as HTMLFormElement | null;
  const magicDevBox = document.getElementById('magic-dev-outbox');
  magicForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('input-magic-email') as HTMLInputElement)?.value || '';
    const res = await fetch('/api/auth/magic-link/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(data.error || 'Could not send magic link.', 'rose');
      return;
    }
    showBanner(data.message, 'emerald');
    if (data.magicToken && magicDevBox) {
      magicDevBox.style.display = 'block';
      magicDevBox.innerHTML = `
        <div class="font-bold text-sm">${
          locale === 'es-AR'
            ? 'Enlace Mágico de Desarrollo Listo (15 min):'
            : 'Development Magic Link Ready (15 min):'
        }</div>
        <div class="text-xs text-mono" style="word-break:break-all;margin:6px 0;">${data.magicUrl}</div>
        <button type="button" class="btn btn-emerald btn-sm" id="btn-verify-magic-now" data-token="${data.magicToken}">
          ${locale === 'es-AR' ? 'Abrir Enlace Mágico e Iniciar Sesión Ahora' : 'Open Magic Link & Sign In Now'}
        </button>
      `;
      document.getElementById('btn-verify-magic-now')?.addEventListener('click', async (ev) => {
        const tok = (ev.currentTarget as HTMLButtonElement).dataset.token || '';
        const vRes = await fetch('/api/auth/magic-link/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tok, locale }),
        });
        const vData = await vRes.json();
        if (!vRes.ok) {
          showBanner(vData.error || 'Invalid magic link.', 'rose');
          return;
        }
        applyAuthResponse(vData);
      });
    }
  });

  // OAuth 2.0 Provider buttons (Google, Facebook & Apple)
  const oauthProviderLabels: Record<'google' | 'facebook' | 'apple', string> = {
    google: 'Google OAuth 2.0',
    facebook: 'Facebook OAuth 2.0',
    apple: 'Apple Sign In',
  };
  const oauthDevSandbox = document.getElementById('oauth-dev-sandbox');
  document.querySelectorAll<HTMLButtonElement>('[data-oauth-provider]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const raw = btn.dataset.oauthProvider;
      const provider: 'google' | 'facebook' | 'apple' =
        raw === 'facebook' || raw === 'apple' ? raw : 'google';
      const res = await fetch(
        `/api/auth/oauth/url?provider=${encodeURIComponent(provider)}&locale=${encodeURIComponent(locale)}`
      );
      const data = await res.json();
      if (data.configured && data.url) {
        window.open(data.url, 'mundoki_oauth_popup', 'width=560,height=680');
      } else {
        showBanner(data.notice || 'OAuth provider in development mode.', 'amber');
        if (oauthDevSandbox) {
          oauthDevSandbox.style.display = 'block';
          oauthDevSandbox.dataset.selectedProvider = provider;
          const providerLabel = document.getElementById('oauth-sandbox-provider-label');
          if (providerLabel) {
            providerLabel.textContent = oauthProviderLabels[provider];
          }
        }
      }
    });
  });

  document.getElementById('btn-confirm-dev-oauth')?.addEventListener('click', async () => {
    const raw = oauthDevSandbox?.dataset.selectedProvider;
    const provider: 'google' | 'facebook' | 'apple' =
      raw === 'facebook' || raw === 'apple' ? raw : 'google';
    const email =
      (document.getElementById('input-dev-oauth-email') as HTMLInputElement)?.value ||
      `explorador.${provider}@mundoki.edu.ar`;
    const res = await fetch('/api/auth/oauth/dev-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email, locale }),
    });
    const data = await res.json();
    if (res.ok) {
      applyAuthResponse(data);
    }
  });

  // 2FA Login Challenge form
  const challengeForm = document.getElementById('form-2fa-challenge') as HTMLFormElement | null;
  challengeForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code =
      (document.getElementById('input-2fa-challenge-code') as HTMLInputElement)?.value || '';
    const res = await fetch('/api/auth/2fa/verify-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pending2faToken, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(data.error || 'Invalid 2FA code.', 'rose');
      return;
    }
    applyAuthResponse(data);
  });

  document.getElementById('btn-cancel-2fa-challenge')?.addEventListener('click', () => {
    pending2faToken = '';
    if (challengeView) challengeView.style.display = 'none';
    if (guestView) guestView.style.display = 'block';
  });

  // 2FA Setup / Enable / Disable for authenticated user
  document.getElementById('btn-start-2fa-setup')?.addEventListener('click', async () => {
    const token = window.localStorage.getItem('mundoki_token') || '';
    const res = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(locale === 'es-AR'
        ? 'No se pudo iniciar la configuración. Si 2FA ya está activo, desactivalo primero con tu autenticador.'
        : 'Could not start setup. If 2FA is already active, disable it with your authenticator first.', 'rose');
      return;
    }

    const panel = document.getElementById('panel-2fa-setup');
    const secretEl = document.getElementById('totp-setup-secret');
    const uriEl = document.getElementById('totp-setup-uri');
    const devCodeEl = document.getElementById('totp-setup-dev-code');
    const codeInput = document.getElementById('input-totp-verify-code') as HTMLInputElement | null;
    const backupListEl = document.getElementById('totp-backup-codes-list');

    if (panel) panel.style.display = 'block';
    if (secretEl) secretEl.textContent = String(data.secret || '');
    if (uriEl) uriEl.textContent = String(data.otpauthUri || '');
    if (devCodeEl) {
      const devCallout = devCodeEl.closest('.callout') as HTMLElement | null;
      if (data.devCurrentTotpCode) {
        devCodeEl.textContent = String(data.devCurrentTotpCode);
        if (devCallout) devCallout.style.display = 'block';
      } else if (devCallout) {
        devCallout.style.display = 'none';
      }
    }
    if (codeInput && data.devCurrentTotpCode) {
      codeInput.value = String(data.devCurrentTotpCode);
    }
    if (backupListEl && Array.isArray(data.backupCodes)) {
      backupListEl.innerHTML = data.backupCodes
        .map((c: string) => `<code class="card-subtle text-mono text-xs">${c}</code>`)
        .join(' ');
    }
  });

  document.getElementById('form-enable-2fa')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('mundoki_token') || '';
    const code =
      (document.getElementById('input-totp-verify-code') as HTMLInputElement)?.value || '';
    const res = await fetch('/api/auth/2fa/enable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(data.error || 'Invalid 6-digit TOTP code.', 'rose');
      return;
    }
    if (data.user) {
      window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
      renderLoggedInState(
        data.user,
        window.localStorage.getItem('mundoki_premium') === 'true'
      );
    }
    showBanner(
      locale === 'es-AR'
        ? '¡Autenticación de Dos Factores (2FA · TOTP) activada con éxito!'
        : 'Two-Factor Authentication (2FA · TOTP) enabled!',
      'emerald'
    );
  });

  document.getElementById('btn-disable-2fa')?.addEventListener('click', async () => {
    const code = window.prompt(locale === 'es-AR' ? 'Ingresá el código de 6 dígitos de tu autenticador para desactivar 2FA.' : 'Enter the 6-digit authenticator code to disable 2FA.');
    if (!code) return;
    const token = window.localStorage.getItem('mundoki_token') || '';
    const res = await fetch('/api/auth/2fa/disable', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      showBanner(locale === 'es-AR' ? 'Código inválido o demasiados intentos. Volvé a intentarlo en cinco minutos.' : 'Invalid code or too many attempts. Try again in five minutes.', 'rose');
      return;
    }
    if (data.user) {
      window.localStorage.setItem('mundoki_user', JSON.stringify(data.user));
      renderLoggedInState(
        data.user,
        window.localStorage.getItem('mundoki_premium') === 'true'
      );
      showBanner(
        locale === 'es-AR' ? '2FA desactivado.' : '2FA disabled.',
        'amber'
      );
    }
  });

  // Sign out
  document.getElementById('btn-sign-out')?.addEventListener('click', async () => {
    const token = window.localStorage.getItem('mundoki_token') || '';
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    window.localStorage.removeItem('mundoki_token');
    window.localStorage.removeItem('mundoki_user');
    window.localStorage.removeItem('mundoki_premium');
    if (loggedInView) loggedInView.style.display = 'none';
    if (guestView) guestView.style.display = 'block';
    const headerLink = document.getElementById('header-account-link');
    if (headerLink) {
      headerLink.textContent = locale === 'es-AR' ? 'Familia' : 'Parents';
    }
    showBanner(
      locale === 'es-AR' ? 'Sesión cerrada.' : 'Signed out.',
      'sky'
    );
  });
}
