import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { json } from '../_shared/cors.ts';
import { handleAdmin } from './operations.ts';
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(v => v.toString(16).padStart(2, '0')).join('');
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return json({});
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') || '';
    const { data: { user }, error } = await db.auth.getUser(jwt);
    if (error || !user) return json({ error: 'Sign in to your administrator account first.' }, 401);
    const { data: role } = await db.from('sf_admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (!role) return json({ error: 'This account has not been authorized as an administrator. The owner must configure access in Cloud.' }, 403);
    const body = await req.json();
    if (body.action === 'login') {
      const { count, error: countError } = await db.from('sf_login_attempts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('success', false).gte('created_at', new Date(Date.now() - 15 * 60000).toISOString());
      if (countError) throw countError;
      if ((count || 0) >= 5) return json({ error: 'Too many attempts. Try again after 15 minutes.' }, 429);
      const secret = Deno.env.get('STARFIGHTERS_ADMIN_PASSKEY');
      if (!secret) return json({ error: 'Administrator passkey is not configured.' }, 503);
      const success = typeof body.passkey === 'string' && await hash(body.passkey) === await hash(secret);
      const { error: attemptError } = await db.from('sf_login_attempts').insert({ user_id: user.id, success });
      if (attemptError) throw attemptError;
      if (!success) return json({ error: 'Incorrect passkey.' }, 403);
      const token = crypto.randomUUID() + crypto.randomUUID();
      const expires_at = new Date(Date.now() + 3600000).toISOString();
      const { error: sessionError } = await db.from('sf_admin_sessions').insert({ user_id: user.id, token_hash: await hash(token), expires_at });
      if (sessionError) throw sessionError;
      await db.from('sf_audit').insert({ actor: user.id, action: 'admin_session_started' });
      return json({ token, expires_at });
    }
    if (typeof body.adminToken !== 'string') return json({ error: 'Administrator access required.' }, 403);
    const { data: session, error: sessionError } = await db.from('sf_admin_sessions').select('id').eq('user_id', user.id).eq('token_hash', await hash(body.adminToken)).eq('revoked', false).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (sessionError || !session) return json({ error: 'Administrator session expired. Unlock access again.' }, 403);
    if (body.action === 'logout') {
      const { error } = await db.from('sf_admin_sessions').update({ revoked: true }).eq('id', session.id);
      if (error) throw error;
      await db.from('sf_audit').insert({ actor: user.id, action: 'admin_session_ended' });
      return json({ ok: true });
    }
    return json(await handleAdmin(db, user.id, body));
  } catch (error) {
    console.error('Starfighters admin operation failed:', error instanceof Error ? error.message : 'operation error');
    return json({ error: 'Unable to complete this operation. Check the submitted information and try again.' }, 400);
  }
});
