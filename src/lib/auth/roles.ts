import { eq } from 'drizzle-orm';
import { createD1DrizzleClient, loadDb } from '../db/d1Store';
import { users } from '../db/schema';
import type { RuntimeEnv } from '../server/runtimeEnv';

/** Read the authoritative role on every privileged request, not a browser flag or cached session. */
export async function hasAdminRole(userId: string, env: RuntimeEnv): Promise<boolean> {
  if (!env.DB) return loadDb().users.some(user => user.id === userId && user.role === 'admin');
  const rows = await createD1DrizzleClient(env.DB).select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
  return rows[0]?.role === 'admin';
}
