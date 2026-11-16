import type { Locale } from '../math/core/types';
import { promoText } from '../i18n/promos';

export function initPromoAdmin() {
  const root = document.getElementById('promo-admin');
  if (!root) return;
  const locale = root.dataset.locale as Locale;
  const tr = (key: string) => promoText(locale, key);
  const message = document.getElementById('promo-admin-message')!;
  const form = document.getElementById('promo-create') as HTMLFormElement;
  const expiry = form.elements.namedItem('expiresAt') as HTMLInputElement;
  const defaultExpiry = new Date(Date.now() + 30 * 86400000);
  expiry.value = new Date(defaultExpiry.getTime() - defaultExpiry.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const date = (value: string | null) => value ? new Date(value).toLocaleString(locale) : '—';
  async function api(method = 'GET', body?: unknown, suffix = '') {
    const response = await fetch(`/api/admin/promos${suffix}`, { method,
      headers: { Authorization: `Bearer ${localStorage.getItem('mundoki_token') || ''}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await response.json();
    if (!response.ok) {
      message.textContent = tr(data.error) + (data.currentUserId ? ` ID: ${data.currentUserId}` : '');
      throw new Error(data.error);
    }
    return data;
  }
  async function refresh() {
    const data = await api();
    document.getElementById('promo-admin-signin')!.hidden = true;
    document.getElementById('promo-admin-content')!.hidden = false;
    document.getElementById('promo-billing-warning')!.hidden = data.liveBillingEnabled;
    (form.elements.namedItem('durationMonths') as HTMLInputElement).max = String(data.maxMonths);
    const list = document.getElementById('promo-invite-list')!;
    list.replaceChildren();
    if (!data.invites.length) { message.textContent = tr('empty'); return; }
    for (const invite of data.invites) {
      const row = document.createElement('tr');
      for (const text of [invite.recipientEmail, `${invite.discountPercent}% · ${invite.durationMonths} ${tr('monthsShort')}`, date(invite.expiresAt), date(invite.promoEndsAt), tr(invite.state)]) {
        const cell = document.createElement('td'); cell.textContent = text; row.append(cell);
      }
      const actions = document.createElement('td');
      const button = (label: string, handler: () => Promise<void>) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-outline btn-sm'; b.textContent = tr(label);
        b.addEventListener('click', async () => { b.disabled = true; try { await handler(); } catch { message.textContent ||= tr('request_failed'); } finally { b.disabled = false; } }); actions.append(b);
      };
      if (invite.state === 'issued') {
        button('copy', async () => {
          const url = `${location.origin}/${locale.toLowerCase()}/premium#promo=${encodeURIComponent(invite.code)}`;
          try { await navigator.clipboard.writeText(url); message.textContent = tr('copied'); }
          catch { message.textContent = url; }
        });
        button('revoke', async () => { await api('PATCH', { id: invite.id }); await refresh(); });
      }
      button('history', async () => {
        const { events } = await api('GET', undefined, `?id=${encodeURIComponent(invite.id)}`);
        document.getElementById('promo-history')!.hidden = false;
        const history = document.getElementById('promo-history-events')!; history.replaceChildren();
        for (const event of events) { const li = document.createElement('li'); li.textContent = `${date(event.createdAt)} · ${tr(event.action)}${event.detail ? ` · ${tr(event.detail)}` : ''}`; history.append(li); }
      });
      row.append(actions); list.append(row);
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector('button')!; button.disabled = true; message.textContent = '';
    const fields = new FormData(form);
    try {
      await api('POST', { recipientEmail: fields.get('recipientEmail'), label: fields.get('label'),
        discountPercent: Number(fields.get('discountPercent')), durationMonths: Number(fields.get('durationMonths')),
        expiresAt: new Date(String(fields.get('expiresAt'))).toISOString(), newCustomersOnly: fields.has('newCustomersOnly') });
      await refresh();
    } catch { message.textContent ||= tr('request_failed'); } finally { button.disabled = false; }
  });
  void refresh().catch(() => { message.textContent ||= tr('request_failed'); });
}
