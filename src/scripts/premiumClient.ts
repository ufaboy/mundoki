// Premium page: shows the family's plan, starts Mercado Pago checkout for an
// adult, cancels an active subscription. Access itself is granted only by the
// server after Mercado Pago's signed confirmation (webhook).
import { Locale } from '../math/core/types';

type Kind = 'ok' | 'error' | 'info';

export function initPremiumPage(): void {
  const root = document.getElementById('premium-page-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const L = (es: string, en: string) => (locale === 'es-AR' ? es : en);
  const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const statusBox = byId('premium-status-box');
  const badge = byId('premium-current-state');
  const btnCheckout = byId<HTMLButtonElement>('btn-start-checkout');
  const btnCancel = byId<HTMLButtonElement>('btn-cancel-subscription');
  const checkoutBlock = byId('premium-checkout-block');
  const webhookPanel = byId('premium-dev-webhook-panel');
  const adultCheck = byId<HTMLInputElement>('checkbox-adult-confirm');
  const token = () => window.localStorage.getItem('mundoki_token') || '';

  function showMessage(message: string, kind: Kind = 'info') {
    if (!statusBox) return;
    statusBox.className = `mk-feedback ${kind === 'ok' ? 'mk-feedback--correct' : kind === 'error' ? 'mk-feedback--retry' : 'mk-feedback--hint'}`;
    const text = statusBox.querySelector('.mk-feedback__text');
    if (text) text.textContent = message;
    statusBox.hidden = false;
  }

  /** Shows the plan the server confirmed: subscribe for free/cancelled, cancel for active. */
  function updateEntitlementUi(isEntitled: boolean, subStatus?: string) {
    window.localStorage.setItem('mundoki_premium', isEntitled ? 'true' : 'false');
    if (badge) {
      badge.textContent = isEntitled
        ? L('Tu familia tiene Premium ✓', 'Your family has Premium ✓')
        : subStatus === 'pending'
          ? L('Esperando la confirmación del pago', 'Waiting for payment confirmation')
          : 'Mundoki Premium';
    }
    if (checkoutBlock) checkoutBlock.hidden = isEntitled;
    if (btnCancel) btnCancel.hidden = !isEntitled;
    root!.classList.toggle('is-premium', isEntitled);
  }

  const signedIn = Boolean(token());
  const signInHint = byId('premium-signin-hint');
  if (signInHint) signInHint.hidden = signedIn;

  if (signedIn) {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.authenticated) updateEntitlementUi(Boolean(data.isPremiumEntitled), data.subscription?.status);
      })
      .catch(() => {});
  }

  async function withBusy(btn: HTMLButtonElement | null, work: () => Promise<void>) {
    if (btn?.disabled) return;
    if (btn) btn.disabled = true;
    try {
      await work();
    } catch {
      showMessage(L('No hay conexión. Probá de nuevo en un momento.', 'No connection. Try again in a moment.'), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  btnCheckout?.addEventListener('click', () => {
    if (!token()) {
      showMessage(
        L('Primero entrá o creá la cuenta de la familia; después volvé acá para suscribirte.', 'First sign in or create the family account, then come back here to subscribe.'),
        'info'
      );
      statusBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!adultCheck?.checked) {
      showMessage(L('Marcá la casilla: el pago lo gestiona una persona adulta.', 'Tick the box: an adult manages the payment.'), 'error');
      adultCheck?.focus();
      return;
    }

    withBusy(btnCheckout, async () => {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ adultConfirmed: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMessage(L('No pudimos abrir Mercado Pago. Probá de nuevo en un momento.', 'We could not open Mercado Pago. Try again in a moment.'), 'error');
        return;
      }
      updateEntitlementUi(false, 'pending');
      if (statusBox) statusBox.hidden = true;
      if (data.initPointUrl && data.mode !== 'development_mock') {
        showMessage(L('Te llevamos a Mercado Pago…', 'Taking you to Mercado Pago…'), 'info');
        window.location.href = data.initPointUrl;
      } else if (webhookPanel) {
        webhookPanel.hidden = false;
      }
    });
  });

  // Local development only: send the signed confirmation Mercado Pago would send.
  byId<HTMLButtonElement>('btn-simulate-mp-webhook')?.addEventListener('click', (event) => {
    const rawUser = window.localStorage.getItem('mundoki_user');
    if (!rawUser) return;
    const user = JSON.parse(rawUser);
    withBusy(event.currentTarget as HTMLButtonElement, async () => {
      const res = await fetch('/api/webhooks/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          eventId: `mp_evt_${Date.now()}`,
          userId: user.id,
          action: 'subscription_authorized',
          signature: 'dev_verified_webhook_sig',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.isPremiumEntitled) {
        updateEntitlementUi(true, 'active');
        if (webhookPanel) webhookPanel.hidden = true;
        showMessage(L('¡Listo! Tu familia ya tiene Premium.', 'Done! Your family now has Premium.'), 'ok');
      }
    });
  });

  btnCancel?.addEventListener('click', () => {
    const sure = window.confirm(
      L('¿Cancelar Premium? No se harán más cobros y Premium termina ahora. Las estrellas quedan guardadas.', 'Cancel Premium? No more charges will be made and Premium ends now. Stars stay saved.')
    );
    if (!sure) return;
    withBusy(btnCancel, async () => {
      const res = await fetch('/api/subscriptions/cancel', { method: 'POST', headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) {
        updateEntitlementUi(false, 'cancelled');
        showMessage(L('La suscripción está cancelada. No se harán más cobros.', 'The subscription is cancelled. No more charges will be made.'), 'info');
      } else {
        showMessage(L('No pudimos confirmar la cancelación. Probá de nuevo.', 'We could not confirm the cancellation. Please try again.'), 'error');
      }
    });
  });
}
