import type { Locale } from '../math/core/types';
import { promoText } from '../i18n/promos';

export function initPromoCampaignAdmin() {
  const root = document.getElementById('promo-campaign-admin');
  if (!root) return;

  const locale = root.dataset.locale as Locale;
  const tr = (key: string) => promoText(locale, key);
  const message = document.getElementById('promo-campaign-message')!;
  const campaignForm = document.getElementById('promo-campaign-create') as HTMLFormElement;
  const directForm = document.getElementById('promo-direct-create') as HTMLFormElement;
  const list = document.getElementById('promo-campaign-list')!;

  const defaultExpiry = new Date(Date.now() + 30 * 86400000);
  const defaultLocalIso = new Date(defaultExpiry.getTime() - defaultExpiry.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  [campaignForm, directForm].forEach((form) => {
    const expiry = form.elements.namedItem('expiresAt') as HTMLInputElement | null;
    if (expiry) expiry.value = defaultLocalIso;
  });

  const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString(locale) : '—');

  async function api(method = 'GET', body?: unknown) {
    const response = await fetch('/api/admin/promo', {
      method,
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mundoki_token') || ''}`,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) {
      message.textContent = tr(data.error);
      throw new Error(data.error);
    }
    return data;
  }

  function campaignStatus(c: { active: boolean; activationsCount: number; maxActivations: number; expiresAt: string }) {
    if (!c.active) return tr('campaignDisabled');
    if (Date.parse(c.expiresAt) <= Date.now()) return tr('campaignExpired');
    if (c.activationsCount >= c.maxActivations) return tr('campaignLimitReached');
    return tr('campaignActive');
  }

  async function refresh() {
    const data = await api();
    const maxMonths = String(data.maxMonths || 6);
    [campaignForm, directForm].forEach((form) => {
      const monthsInput = form.elements.namedItem('durationMonths') as HTMLInputElement | null;
      if (monthsInput) monthsInput.max = maxMonths;
    });

    list.replaceChildren();
    if (!data.campaigns?.length) {
      message.textContent ||= tr('emptyCampaigns');
      return;
    }

    for (const c of data.campaigns) {
      const row = document.createElement('tr');
      const cells = [
        c.code,
        `${c.discountPercent}% · ${c.durationMonths} ${tr('monthsShort')}`,
        `${c.activationsCount} / ${c.maxActivations}`,
        formatDate(c.expiresAt),
        campaignStatus(c),
      ];
      for (const text of cells) {
        const td = document.createElement('td');
        td.textContent = text;
        row.append(td);
      }
      const actions = document.createElement('td');
      const addButton = (label: string, handler: () => Promise<void>) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn-outline btn-sm';
        b.textContent = label;
        b.addEventListener('click', async () => {
          b.disabled = true;
          try {
            await handler();
          } catch {
            message.textContent ||= tr('request_failed');
          } finally {
            b.disabled = false;
          }
        });
        actions.append(b);
      };
      addButton(tr('copy'), async () => {
        const url = `${location.origin}/${locale.toLowerCase()}/premium#promo=${encodeURIComponent(c.code)}`;
        try {
          await navigator.clipboard.writeText(url);
          message.textContent = tr('copied');
        } catch {
          message.textContent = url;
        }
      });
      addButton(tr(c.active ? 'disable' : 'enable'), async () => {
        await api('PATCH', { id: c.id, active: !c.active });
        await refresh();
      });
      row.append(actions);
      list.append(row);
    }
  }

  campaignForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = campaignForm.querySelector('button')!;
    button.disabled = true;
    message.textContent = '';
    const fields = new FormData(campaignForm);
    try {
      await api('POST', {
        mode: 'campaign',
        code: fields.get('code'),
        label: fields.get('label'),
        discountPercent: Number(fields.get('discountPercent')),
        durationMonths: Number(fields.get('durationMonths')),
        maxActivations: Number(fields.get('maxActivations')),
        expiresAt: new Date(String(fields.get('expiresAt'))).toISOString(),
        newCustomersOnly: fields.has('newCustomersOnly'),
      });
      campaignForm.reset();
      (campaignForm.elements.namedItem('maxActivations') as HTMLInputElement).value = '10';
      (campaignForm.elements.namedItem('discountPercent') as HTMLInputElement).value = '50';
      (campaignForm.elements.namedItem('durationMonths') as HTMLInputElement).value = '1';
      (campaignForm.elements.namedItem('expiresAt') as HTMLInputElement).value = defaultLocalIso;
      (campaignForm.elements.namedItem('newCustomersOnly') as HTMLInputElement).checked = true;
      await refresh();
    } catch {
      message.textContent ||= tr('request_failed');
    } finally {
      button.disabled = false;
    }
  });

  directForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = directForm.querySelector('button')!;
    button.disabled = true;
    message.textContent = '';
    const fields = new FormData(directForm);
    try {
      const { invite } = await api('POST', {
        mode: 'direct',
        recipientEmail: fields.get('recipientEmail'),
        label: fields.get('label'),
        discountPercent: Number(fields.get('discountPercent')),
        durationMonths: Number(fields.get('durationMonths')),
        expiresAt: new Date(String(fields.get('expiresAt'))).toISOString(),
        newCustomersOnly: fields.has('newCustomersOnly'),
      });
      directForm.reset();
      (directForm.elements.namedItem('discountPercent') as HTMLInputElement).value = '50';
      (directForm.elements.namedItem('durationMonths') as HTMLInputElement).value = '1';
      (directForm.elements.namedItem('expiresAt') as HTMLInputElement).value = defaultLocalIso;
      (directForm.elements.namedItem('newCustomersOnly') as HTMLInputElement).checked = true;
      message.textContent = `${invite.recipientEmail}: ${invite.code}`;
    } catch {
      message.textContent ||= tr('request_failed');
    } finally {
      button.disabled = false;
    }
  });

  void refresh().catch(() => {
    message.textContent ||= tr('request_failed');
  });
}
