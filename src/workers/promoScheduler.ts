import { getRuntimeEnv } from '../lib/server/runtimeEnv';
import { reconcilePromos } from '../lib/promos/billing';

// Separate Worker keeps Astro's supported server entrypoint intact.
export default {
  async scheduled() {
    const result = await reconcilePromos(await getRuntimeEnv());
    console.info(JSON.stringify({ event: 'promo_reconciliation', ...result }));
    if (result.failed) throw new Error('Some promo subscriptions need reconciliation');
  },
  async fetch() { return new Response('Not found', { status: 404 }); },
};
