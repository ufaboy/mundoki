import { Locale } from '../math/core/types';

export function initPremiumPage(): void {
  const root = document.getElementById('premium-page-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const statusBox = document.getElementById('premium-status-box');
  const webhookPanel = document.getElementById('premium-dev-webhook-panel');
  const activeBadge = document.getElementById('premium-current-state');
  const btnCancel = document.getElementById('btn-cancel-subscription');

  function showMessage(msg: string, kind: 'emerald' | 'amber' | 'rose' = 'amber') {
    if (!statusBox) return;
    statusBox.style.display = 'block';
    statusBox.className = `callout callout-${kind} text-sm`;
    statusBox.textContent = msg;
  }

  function updateEntitlementUi(isEntitled: boolean, subStatus?: string) {
    window.localStorage.setItem('mundoki_premium', isEntitled ? 'true' : 'false');
    if (activeBadge) {
      activeBadge.textContent = isEntitled
        ? locale === 'es-AR'
          ? 'Suscripción Premium Activa (Verificada en Servidor)'
          : 'Active Premium Subscription (Server-Verified)'
        : subStatus === 'pending'
          ? locale === 'es-AR'
            ? 'Suscripción Pendiente de Webhook'
            : 'Subscription Pending Webhook'
          : locale === 'es-AR'
            ? 'Plan Actual: Demo Gratis'
            : 'Current Plan: Free Demo';
    }
    if (btnCancel) {
      btnCancel.style.display = isEntitled ? 'inline-flex' : 'none';
    }
  }

  // Check current server entitlement on mount
  const token = window.localStorage.getItem('mundoki_token');
  if (token) {
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.authenticated) {
          updateEntitlementUi(Boolean(data.isPremiumEntitled), data.subscription?.status);
        }
      })
      .catch(() => {});
  }

  // Subscribe button
  document.getElementById('btn-start-checkout')?.addEventListener('click', async () => {
    const authToken = window.localStorage.getItem('mundoki_token');
    if (!authToken) {
      showMessage(
        locale === 'es-AR'
          ? 'Por favor iniciá sesión o creá una cuenta antes de suscribirte.'
          : 'Please sign in or create an account before subscribing.',
        'amber'
      );
      return;
    }

    const adultCheck = document.getElementById('checkbox-adult-confirm') as HTMLInputElement | null;
    if (!adultCheck?.checked) {
      showMessage(
        locale === 'es-AR'
          ? 'Una persona adulta responsable debe confirmar la casilla de autorización.'
          : 'An adult account holder must check the authorization confirmation box.',
        'rose'
      );
      return;
    }

    const res = await fetch('/api/subscriptions/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ adultConfirmed: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      showMessage(data.error || 'Checkout error.', 'rose');
      return;
    }

    showMessage(data.notice, 'amber');
    updateEntitlementUi(false, 'pending');
    if (data.mode === 'development_mock' && webhookPanel) {
      webhookPanel.style.display = 'block';
    } else if (data.initPointUrl) {
      window.location.href = data.initPointUrl;
    }
  });

  // Simulate verified Mercado Pago webhook in dev mode
  document.getElementById('btn-simulate-mp-webhook')?.addEventListener('click', async () => {
    const rawUser = window.localStorage.getItem('mundoki_user');
    if (!rawUser) return;
    const user = JSON.parse(rawUser);
    const eventId = `mp_evt_${Date.now()}`;

    const res = await fetch('/api/webhooks/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('mundoki_token') || ''}` },
      body: JSON.stringify({
        eventId,
        userId: user.id,
        action: 'subscription_authorized',
        signature: 'dev_verified_webhook_sig',
      }),
    });
    const data = await res.json();
    if (res.ok && data.isPremiumEntitled) {
      updateEntitlementUi(true, 'active');
      if (webhookPanel) webhookPanel.style.display = 'none';
      showMessage(
        locale === 'es-AR'
          ? '✓ Webhook de Mercado Pago verificado idempotentemente. ¡Suscripción Premium activa en el servidor!'
          : '✓ Mercado Pago webhook verified idempotently. Server-side Premium entitlement is now active!',
        'emerald'
      );
    }
  });

  // Cancel active subscription
  btnCancel?.addEventListener('click', async () => {
    const authToken = window.localStorage.getItem('mundoki_token');
    if (!authToken) return;
    const res = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      updateEntitlementUi(false, 'cancelled');
      showMessage(
        locale === 'es-AR' ? 'Suscripción cancelada.' : 'Subscription cancelled.',
        'amber'
      );
    } else {
      showMessage(locale === 'es-AR'
        ? 'No pudimos confirmar la cancelación. Volvé a intentarlo.'
        : 'We could not confirm cancellation. Please try again.', 'rose');
    }
  });
}
