# Personal promotions

Admin UI: `/es-ar/admin/promos` and `/en-us/admin/promos`. The account page shows the link to administrators. Authorization reads `users.role` from D1 for every admin request. New accounts default to `user`; clients cannot assign their own role. Bootstrap an administrator only after checking the existing account and verified email, using a one-time parameterized database update. Never put an email allowlist in application code.

Invitations are bound to a verified recipient email and can be redeemed once. Discounts are integer percentages from 10 through 100. Duration is 1–6 calendar months; `PROMO_MAX_MONTHS` may lower the limit but cannot exceed six. Invitation expiry controls acceptance; the discount deadline is fixed at acceptance and cannot be extended by resuming checkout. The six-month limit applies to each invitation, not the customer's lifetime. New-customer-only eligibility defaults on. Existing active/pending subscriptions cannot be replaced through promo checkout.

The recipient sees the discounted price, duration, full recurring price and explicit consent checkbox. Accepted price and terms version are stored. Codes are random; links use a URL fragment to avoid placing codes in ordinary server request logs. Admins can copy links, revoke unused invitations and inspect audit events. Delivery by email is not implemented.

## Billing rollout

Production promo redemption remains disabled unless `PROMO_LIVE_BILLING_ENABLED=true`. Creating and reviewing invitations does not require enabling billing. Automated tests mock Mercado Pago and do not establish provider account compatibility.

Partial discounts create a monthly subscription with a provider-side end date at the promo deadline. After the final discounted charge, reconciliation changes the next amount to full price and removes the end date, then reads the subscription back to verify both. This account's support for clearing `auto_recurring.end_date` with null MUST be verified before enabling live billing. If transition fails, the safety cutoff remains and the invitation requires attention; uninterrupted full-price renewal is not guaranteed until this integration is confirmed.

A 100% discount schedules the first full-price charge at the promo deadline instead of requesting a zero-amount payment. Test provider acceptance of the future start date and cancellation during the free period before activation.

Deploy the app with `npm run deploy`. Deploy the separate reconciliation Worker with `npm run promo:deploy`; it runs every ten minutes against the same D1 database. Configure its Mercado Pago access token separately using Wrangler secrets. Set the live-billing flag on BOTH Workers only after provider verification, updating `wrangler.promo.jsonc` as needed. Keep the existing signed webhook configured for subscription preapproval and authorized-payment notifications. Do not enable the app flag without an operational scheduler.

Verify partial and 100% offers, final discounted invoice, full-price renewal, cancellation, rejected payment, duplicate/out-of-order webhooks and transition failures with the actual provider account. Verify server-side entitlement expiry at the deadline. Observe `promo_reconciliation_failed` logs and invitations in `attention` state. An uncertain checkout creation is not automatically retried because the provider might already have created the subscription; inspect the provider before resolving it manually.

## Checks

`npm run lint`, `npm test`, `npm run build:worker`, and `npm run promo:deploy:check`.

The promo suite uses isolated SQLite and mocked provider responses to cover eligibility, role checks, duration/discount constraints, consent, concurrent redemption, checkout resumption, schedule verification and price-transition failures.
