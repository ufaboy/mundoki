import type { Locale } from '../math/core/types';
import { promoText } from '../i18n/promos';

export function initPromoClient() {
  const root = document.getElementById('promo-redeem');
  if (!root) return;
  const locale = root.dataset.locale as Locale;
  const tr = (key: string) => promoText(locale, key);
  const code = document.getElementById('promo-code') as HTMLInputElement;
  const consent = document.getElementById('promo-consent') as HTMLInputElement;
  const accept = document.getElementById('promo-accept') as HTMLButtonElement;
  const review = document.getElementById('promo-review') as HTMLButtonElement;
  const summary = document.getElementById('promo-summary')!;
  const status = document.getElementById('promo-status')!;
  let quote: { fullAmountArs: number; discountedAmountArs: number; durationMonths: number; discountPercent: number; termsVersion: string } | null = null;
  const invited = new URLSearchParams(location.hash.slice(1)).get('promo');
  if (invited) {
    sessionStorage.setItem('mundoki_invite', invited);
    history.replaceState(null, '', location.pathname + location.search);
  }
  code.value = sessionStorage.getItem('mundoki_invite') || '';
  // Invited families land with the code filled in, so open the (normally folded) code box.
  if (code.value && root instanceof HTMLDetailsElement) root.open = true;
  function invalidate() { quote = null; consent.checked = false; accept.disabled = true; summary.textContent = ''; }
  code.addEventListener('input', invalidate);
  consent.addEventListener('change', () => { accept.disabled = !quote || !consent.checked; });
  async function api(path: string, body: unknown) {
    const token = localStorage.getItem('mundoki_token');
    if (!token) throw new Error('sign_in');
    const response = await fetch(`/api/promos/${path}?locale=${locale}`, { method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'request_failed');
    return data;
  }
  review.addEventListener('click', async () => {
    invalidate(); review.disabled = true; status.textContent = tr('loading');
    sessionStorage.setItem('mundoki_invite', code.value.trim());
    try {
      const data = await api('quote', { code: code.value }); quote = data.promo;
      const price = (amount: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'ARS' }).format(amount);
      summary.textContent = locale === 'es-AR'
        ? `${quote.discountPercent}% de descuento: ${price(quote.discountedAmountArs)} por mes durante ${quote.durationMonths} meses desde la aceptación. Después, ${price(quote.fullAmountArs)} por mes automáticamente, hasta que canceles.`
        : `${quote.discountPercent}% off: ${price(quote.discountedAmountArs)} per month for ${quote.durationMonths} months from acceptance. Then ${price(quote.fullAmountArs)} per month automatically until you cancel.`;
      status.textContent = '';
    } catch (error) { status.textContent = tr(error instanceof Error ? error.message : 'request_failed'); }
    finally { review.disabled = false; }
  });
  accept.addEventListener('click', async () => {
    if (!quote || !consent.checked) return;
    accept.disabled = true; review.disabled = true; code.disabled = true; status.textContent = tr('loading');
    try {
      const data = await api('redeem', { code: code.value, adultConfirmed: true, termsVersion: quote.termsVersion, fullAmountArs: quote.fullAmountArs });
      if (data.initPointUrl) location.assign(data.initPointUrl);
      else {
        status.textContent = locale === 'es-AR' ? 'Checkout de prueba creado. Usá el simulador de pago para activarlo.' : 'Test checkout created. Use the payment simulator to activate it.';
        const panel = document.getElementById('premium-dev-webhook-panel'); if (panel) panel.hidden = false;
      }
    } catch (error) { status.textContent = tr(error instanceof Error ? error.message : 'request_failed'); }
    finally { review.disabled = false; code.disabled = false; accept.disabled = !consent.checked; }
  });
}
