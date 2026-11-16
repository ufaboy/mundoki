import type { RuntimeEnv } from '../server/runtimeEnv';

export const PROMO_HARD_MAX_MONTHS = 6;
export const PROMO_TERMS_VERSION = 'personal-promo-v1';

export class PromoError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}

export function maxPromoMonths(env: RuntimeEnv): number {
  const value = Number(env.PROMO_MAX_MONTHS || PROMO_HARD_MAX_MONTHS);
  return Number.isInteger(value) && value >= 1 ? Math.min(value, PROMO_HARD_MAX_MONTHS) : PROMO_HARD_MAX_MONTHS;
}

export function addCalendarMonths(start: string, months: number): string {
  const date = new Date(start);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString();
}

export function normalizePromoCode(value: unknown): string {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function validateInvite(input: Record<string, unknown>, env: RuntimeEnv, now = new Date()): {
  recipientEmail: string; discountPercent: number; durationMonths: number; expiresAt: string;
  label: string; newCustomersOnly: boolean;
} {
  const recipientEmail = String(input.recipientEmail || '').trim().toLowerCase();
  const discountPercent = Number(input.discountPercent);
  const durationMonths = Number(input.durationMonths);
  const expires = new Date(String(input.expiresAt || ''));
  const label = String(input.label || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail) || recipientEmail.length > 254) throw new PromoError('invalid_email');
  if (!Number.isInteger(discountPercent) || discountPercent < 10 || discountPercent > 100) throw new PromoError('invalid_discount');
  if (!Number.isInteger(durationMonths) || durationMonths < 1 || durationMonths > maxPromoMonths(env)) throw new PromoError('invalid_duration');
  if (!Number.isFinite(expires.getTime()) || expires <= now) throw new PromoError('invalid_expiry');
  if (label.length > 120) throw new PromoError('invalid_label');
  return { recipientEmail, discountPercent, durationMonths, expiresAt: expires.toISOString(), label,
    newCustomersOnly: input.newCustomersOnly !== false };
}

export function promoPrice(base: number, percent: number): number {
  if (!Number.isFinite(base) || base <= 0) throw new PromoError('invalid_price', 503);
  return Math.round(base * (100 - percent)) / 100;
}
