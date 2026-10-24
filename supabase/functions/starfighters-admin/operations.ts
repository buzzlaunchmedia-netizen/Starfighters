import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
export interface Body { action: string; id?: string; payload?: Record<string, unknown>; file?: string; mime?: string; passkey?: string; adminToken?: string; }
async function all(db: SupabaseClient, table: string) {
  const rows = []; let start = 0;
  while (true) { const { data, error } = await db.from(table).select('*').range(start, start + 999); if (error) throw error; rows.push(...data); if (data.length < 1000) return rows; start += 1000; }
}
export async function handleAdmin(db: SupabaseClient, actor: string, body: Body) {
  const p = body.payload || {};
  const audit = async (action: string, record_id?: string) => { const { error } = await db.from('sf_pin_admin_audit').insert({ session_id: actor, action, record_id }); if (error) throw error; };
  if (body.action === 'overview') {
    const [members, polls, votes, announcements, legacyAudit, accounts, pinAudit] = await Promise.all(['sf_members','sf_polls','sf_votes','sf_announcements','sf_audit','user_profiles','sf_pin_admin_audit'].map(table => all(db, table)));
    const auditLog = [...legacyAudit, ...pinAudit.map(entry => ({ id: entry.id, actor: 'PIN administrator', action: entry.action, record_id: entry.record_id, created_at: entry.created_at }))];
    const { data: settings, error } = await db.from('sf_settings').select('*').single(); if (error) throw error;
    return { members, polls, votes, announcements, auditLog, settings, accounts: accounts.map(a => ({ id: a.id, created_at: a.created_at })) };
  }
  if (body.action === 'review') {
    if (!['pending','approved','declined','follow-up','archived'].includes(String(p.status))) throw new Error('Invalid status');
    const { error } = await db.from('sf_members').update({ status: p.status, notes: String(p.notes || '').slice(0, 4000), reviewed_by: null, reviewed_admin_session_id: actor, reviewed_at: new Date().toISOString() }).eq('id', body.id); if (error) throw error;
    await audit('registration_' + p.status, body.id); return { ok: true };
  }
  if (body.action === 'announcement') {
    if (!String(p.title || '').trim() || !String(p.content || '').trim()) throw new Error('Content required');
    const values = { title: String(p.title).slice(0,200), content: String(p.content).slice(0,10000), kind: p.kind === 'event' ? 'event' : 'announcement', event_date: p.event_date || null, published: p.published === true };
    const { error } = body.id ? await db.from('sf_announcements').update(values).eq('id', body.id) : await db.from('sf_announcements').insert(values); if (error) throw error;
    await audit('announcement_saved', body.id); return { ok: true };
  }
  if (body.action === 'poll') {
    if (!String(p.title || '').trim() || !['open','scheduled','closed','archived'].includes(String(p.status))) throw new Error('Invalid poll');
    const values = { title: String(p.title).slice(0,200), description: String(p.description || '').slice(0,2000), status: p.status, results_visibility: p.results_visibility || 'after-vote', opens_at: p.opens_at || null, closes_at: p.closes_at || null };
    if (body.id) { const { error } = await db.from('sf_polls').update(values).eq('id', body.id); if (error) throw error; }
    else {
      const options = Array.isArray(p.options) ? p.options.map(String).map(s => s.trim()).filter(Boolean) : [];
      if (options.length < 2 || options.length > 10 || new Set(options).size !== options.length) throw new Error('Provide 2–10 distinct options');
      const { data, error } = await db.from('sf_polls').insert(values).select('id').single(); if (error) throw error;
      const { error: optionError } = await db.from('sf_options').insert(options.map(label => ({ poll_id: data.id, label: label.slice(0,200) }))); if (optionError) throw optionError;
    }
    await audit('poll_saved_' + p.status, body.id); return { ok: true };
  }
  if (body.action === 'settings') {
    const links = Array.isArray(p.links) ? p.links : [];
    for (const link of links) { if (!link || typeof link !== 'object') throw new Error('Invalid link'); const l = link as Record<string,unknown>; const u = new URL(String(l.url)); if (!['https:','mailto:','tel:'].includes(u.protocol)) throw new Error('Unsafe URL'); if (u.protocol==='tel:' && !/^\+?[0-9]{7,15}$/.test(u.pathname)) throw new Error('Invalid phone'); if (u.protocol==='mailto:' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.pathname)) throw new Error('Invalid email'); }
    for (const key of ['hero_url','logo_url']) { if (p[key] && !String(p[key]).startsWith('https://')) throw new Error('Images require HTTPS'); }
    const featured = Array.isArray(p.featured) ? p.featured : [];
    if (featured.length > 6) throw new Error('Maximum six featured profiles');
    for (const person of featured) { if (!person || typeof person !== 'object' || !(person as Record<string,unknown>).name || !String((person as Record<string,unknown>).image).startsWith('https://')) throw new Error('Featured profiles need a name and HTTPS image'); }
    const { error } = await db.from('sf_settings').update({ links, featured, logo_url: p.logo_url || '', hero_url: p.hero_url || '', contact_instructions: String(p.contact_instructions || '').slice(0,2000) }).eq('id',1); if (error) throw error;
    await audit('public_settings_changed'); return { ok: true };
  }
  if (body.action === 'upload') {
    if (!body.file || !['image/jpeg','image/png','image/webp'].includes(body.mime || '')) throw new Error('Unsupported image');
    const bytes = Uint8Array.from(atob(body.file), c => c.charCodeAt(0)); if (bytes.length > 5242880) throw new Error('Image exceeds 5 MB');
    const path = `${crypto.randomUUID()}.${body.mime === 'image/png' ? 'png' : body.mime === 'image/webp' ? 'webp' : 'jpg'}`;
    const { error } = await db.storage.from('sf-brand').upload(path, bytes, { contentType: body.mime }); if (error) throw error;
    await audit('brand_asset_uploaded'); return { url: db.storage.from('sf-brand').getPublicUrl(path).data.publicUrl };
  }
  if (body.action === 'export') { await audit('authorized_export_' + String(p.type || 'report').slice(0,40)); return { ok: true }; }
  throw new Error('Unknown action');
}
