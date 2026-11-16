import type { APIRoute } from 'astro';
import {
  getAuthenticatedSessionUser,
  getGameStateFromStore,
  getGameStateRevision,
  jsonResponse,
  saveGameStateInStore,
} from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  let body: { slot?: 'hat' | 'suit' | 'accessory'; itemId?: string | null } = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const slot = body.slot;
  const itemId = body.itemId ?? null;
  const revision = await getGameStateRevision(user.id, env);
  const state = await getGameStateFromStore(user.id, env);

  if (slot === 'hat' || slot === 'suit' || slot === 'accessory') {
    if (itemId === null || state.unlockedCosmetics.includes(itemId)) {
      state.equippedCosmetics[slot] = itemId;
      try {
        await saveGameStateInStore(user.id, state, env, [], revision);
      } catch {
        return jsonResponse({ error: 'Progress changed. Retry your selection.' }, 409);
      }
    }
  }

  return jsonResponse({ gameState: state });
};
