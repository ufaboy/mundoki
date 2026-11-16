import crypto from 'node:crypto';
import { StoredSubscription } from '../db/d1Store';
import { RuntimeEnv } from '../server/runtimeEnv';

export interface MercadoPagoSubscription {
  id: string;
  external_reference: string;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled' | 'canceled';
  next_payment_date?: string;
  last_modified: string;
  auto_recurring: { currency_id: string; transaction_amount: number; start_date?: string; end_date?: string | null };
  summarized?: { charged_quantity?: number };
}

export async function subscriptionIdForInvoice(env: RuntimeEnv, invoiceId: string): Promise<string> {
  const token = env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('Mercado Pago is not configured');
  const response = await fetch(`https://api.mercadopago.com/authorized_payments/${encodeURIComponent(invoiceId)}`, {
    headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Could not verify invoice');
  const invoice = await response.json() as { id?: string | number; preapproval_id?: string };
  if (String(invoice.id) !== invoiceId || !invoice.preapproval_id) throw new Error('Invalid invoice');
  return invoice.preapproval_id;
}

export async function requestMercadoPagoSubscription(env: RuntimeEnv, id: string, cancel = false): Promise<MercadoPagoSubscription> {
  const token = env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('Mercado Pago is not configured');
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(id)}`, {
    method: cancel ? 'PUT' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(cancel ? { body: JSON.stringify({ status: 'cancelled' }) } : {}),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Mercado Pago returned ${response.status}`);
  const data = await response.json() as MercadoPagoSubscription;
  if (data.id !== id || !data.external_reference || !Number.isFinite(Date.parse(data.last_modified))) {
    throw new Error('Invalid Mercado Pago subscription');
  }
  return data;
}

export interface MercadoPagoCheckoutResult {
  mode: 'live_mercadopago' | 'development_mock';
  initPointUrl: string | null;
  subscription: StoredSubscription;
  notice: string;
}

/**
 * Minimal payment-provider interface for Mercado Pago recurring subscriptions in ARS.
 * - Uses live Mercado Pago `/preapproval` API when `MP_ACCESS_TOKEN` or `MERCADOPAGO_ACCESS_TOKEN` is configured.
 * - Falls back to an explicitly labeled development mock when live credentials are absent.
 */
export async function initiateMercadoPagoSubscription(params: {
  userId: string;
  userEmail: string;
  backUrl: string;
  monthlyArs?: number;
  idempotencyKey?: string;
  promo?: { id: string; discountPercent: number; end: string; fullAmount: number };
  env?: RuntimeEnv;
}): Promise<MercadoPagoCheckoutResult> {
  const mpAccessToken =
    params.env?.MERCADOPAGO_ACCESS_TOKEN ||
    params.env?.MP_ACCESS_TOKEN ||
    (typeof process !== 'undefined'
      ? process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN
      : undefined);
  const envMonthlyArs =
    params.env?.PREMIUM_MONTHLY_ARS ||
    (typeof process !== 'undefined' ? process.env.PREMIUM_MONTHLY_ARS : undefined);
  const amountArs = params.monthlyArs || Number(envMonthlyArs) || 4500;
  const now = new Date().toISOString();

  if (mpAccessToken && mpAccessToken.trim() !== '') {
    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
        ...((params.idempotencyKey || params.promo?.id) ? { 'X-Idempotency-Key': params.idempotencyKey || params.promo!.id } : {}),
      },
      body: JSON.stringify({
        reason: params.promo
          ? `Mundoki: ${params.promo.discountPercent}% hasta ${params.promo.end.slice(0, 10)}; luego ARS ${params.promo.fullAmount}/mes`
          : 'Mundoki Suscripción Mensual Premium',
        external_reference: params.userId,
        payer_email: params.userEmail,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: amountArs,
          currency_id: 'ARS',
          ...(params.promo ? params.promo.discountPercent === 100
            ? { start_date: params.promo.end } : { end_date: params.promo.end } : {}),
        },
        back_url: params.backUrl,
        status: 'pending',
      }),
    });

    if (!response.ok) {
      throw new Error(`Mercado Pago API returned status ${response.status}`);
    }

    const mpData = (await response.json()) as { id: string; init_point: string; auto_recurring?: MercadoPagoSubscription['auto_recurring'] };
    if (!mpData.id || !mpData.init_point) throw new Error('Invalid provider checkout');
    if (params.promo) {
      const date = params.promo.discountPercent === 100 ? mpData.auto_recurring?.start_date : mpData.auto_recurring?.end_date;
      if (!date || Date.parse(date) !== Date.parse(params.promo.end)) {
        await requestMercadoPagoSubscription(params.env || {}, mpData.id, true);
        throw new Error('Provider did not confirm promo deadline');
      }
    }
    const subscription: StoredSubscription = {
      id: `sub_${crypto.randomBytes(8).toString('hex')}`,
      userId: params.userId,
      provider: 'mercadopago',
      providerSubscriptionId: mpData.id,
      planCode: 'monthly_ars',
      currency: 'ARS',
      amountArs,
      status: 'pending',
      currentPeriodEnd: null,
      isDevMock: false,
      updatedAt: now,
    };

    return {
      mode: 'live_mercadopago',
      initPointUrl: mpData.init_point,
      subscription,
      notice: 'Redirigiendo al checkout oficial de Mercado Pago.',
    };
  }

  const mockSubId = `mp_dev_preapproval_${crypto.randomBytes(6).toString('hex')}`;
  const subscription: StoredSubscription = {
    id: `sub_${crypto.randomBytes(8).toString('hex')}`,
    userId: params.userId,
    provider: 'mercadopago',
    providerSubscriptionId: mockSubId,
    planCode: 'monthly_ars',
    currency: 'ARS',
    amountArs,
    status: 'pending',
    currentPeriodEnd: null,
    isDevMock: true,
    updatedAt: now,
  };

  return {
    mode: 'development_mock',
    initPointUrl: null,
    subscription,
    notice:
      '[MODO DESARROLLO / MOCK]: MERCADOPAGO_ACCESS_TOKEN no está configurado. La suscripción quedó en estado "pending". Simulá el webhook verificado de Mercado Pago para activar el acceso Premium.',
  };
}
