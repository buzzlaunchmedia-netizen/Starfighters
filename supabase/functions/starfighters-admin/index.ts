import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { json } from '../_shared/cors.ts';
import { handleAdmin, type Body } from './operations.ts';
const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
const hash = async (value: string) => Array.from(await digest(value)).map(v => v.toString(16).padStart(2, '0')).join('');
async function matchesPin(value: string, secret: string) {
  const [candidate, expected] = await Promise.all([digest(value), digest(secret)]);
  return candidate.reduce((difference, byte, i) => difference | (byte ^ expected[i]), 0) === 0;
}
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return json({});
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json() as Body;
    if (!body || typeof body !== 'object' || typeof body.action !== 'string') return json({ error: 'Invalid request.' }, 400);
    if (body.action === 'login') {
      const secret = Deno.env.get('STARFIGHTERS_ADMIN_PASSKEY');
      if (!secret) return json({ error: 'Administrator PIN is not configured.' }, 503);
      // Hash source identifiers with the server secret; never store raw addresses or PINs.
      // A global transactional ceiling also limits attempts if forwarded addresses are varied.
      const source = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
      const { data: allowed, error: rateError } = await db.rpc('sf_reserve_pin_attempt', { source_hash: await hash(`${secret}:${source}`) });
      if (rateError) throw rateError;
      if (!allowed) return json({ error: 'Too many PIN attempts. Wait 15 minutes and try again.' }, 429);
      if (typeof body.passkey !== 'string' || !/^\d{6}$/.test(body.passkey) || !await matchesPin(body.passkey, secret)) return json({ error: 'Incorrect administrator PIN.' }, 403);
      const token = crypto.randomUUID() + crypto.randomUUID();
      const expires_at = new Date(Date.now() + 3600000).toISOString();
      const { data: session, error: sessionError } = await db.from('sf_pin_admin_sessions').insert({ token_hash: await hash(token), expires_at }).select('id').single();
      if (sessionError) throw sessionError;
      const { error: auditError } = await db.from('sf_pin_admin_audit').insert({ session_id: session.id, action: 'admin_session_started' });
      if (auditError) throw auditError;
      return json({ token, expires_at });
    }
    if (typeof body.adminToken !== 'string' || body.adminToken.length !== 72) return json({ error: 'Administrator PIN access required.' }, 401);
    const { data: session, error: sessionError } = await db.from('sf_pin_admin_sessions').select('id').eq('token_hash', await hash(body.adminToken)).eq('revoked', false).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (sessionError) throw sessionError;
    if (!session) return json({ error: 'Administrator session expired. Enter your PIN again.' }, 401);
    if (body.action === 'logout') {
      const { error: revokeError } = await db.from('sf_pin_admin_sessions').update({ revoked: true }).eq('id', session.id);
      if (revokeError) throw revokeError;
      const { error: auditError } = await db.from('sf_pin_admin_audit').insert({ session_id: session.id, action: 'admin_session_ended' });
      if (auditError) throw auditError;
      return json({ ok: true });
    }
    return json(await handleAdmin(db, session.id, body));
  } catch {
    console.error('Starfighters administrator operation failed.');
    return json({ error: 'Unable to complete this operation. Check the submitted information and try again.' }, 400);
  }
});
