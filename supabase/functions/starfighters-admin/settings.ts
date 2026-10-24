import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateContacts } from './settingsContacts.ts';
const contentLimits: Record<string, number> = {
  heroTitle: 55, heroInviteTitle: 100, heroInviteText: 150, heroButton: 32, heroTagline: 35, heroEmphasis: 24,
  communityTitle: 120, communityDescription: 700, aboutTitle: 160, aboutHighlight: 100, aboutDescription: 700,
  updatesTitle: 120, updatesLabel: 60, newsTitle: 120, newsDescription: 500,
  pollsTitle: 120, pollsDescription: 500, footerTitle: 120, footerLabel: 80, seoTitle: 100, seoDescription: 320,
};
function safeImage(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2048) throw new Error('Invalid image URL');
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Images require a public HTTPS URL');
  return url.href;
}
export async function saveSettings(db: SupabaseClient, payload: Record<string, unknown>) {
  const values: Record<string, unknown> = {};
  for (const key of ['logo_url', 'hero_url', 'favicon_url']) if (key in payload) values[key] = safeImage(payload[key]);
  if ('contact_instructions' in payload) {
    if (typeof payload.contact_instructions !== 'string' || payload.contact_instructions.length > 2000) throw new Error('Invalid contact instructions');
    values.contact_instructions = payload.contact_instructions.trim();
  }
  if ('links' in payload) values.links = validateContacts(payload.links);
  if ('featured' in payload) {
    if (!Array.isArray(payload.featured) || payload.featured.length > 6) throw new Error('Maximum six featured profiles');
    values.featured = payload.featured.map(person => {
      if (!person || typeof person !== 'object' || typeof person.name !== 'string' || !person.name.trim() || person.name.length > 120 || typeof person.role !== 'string' || person.role.length > 200) throw new Error('Invalid featured profile');
      const image = safeImage(person.image);
      if (!image) throw new Error('A profile image is required');
      return { name: person.name.trim(), role: person.role.trim(), image };
    });
  }
  if ('page_content' in payload) {
    if (!payload.page_content || typeof payload.page_content !== 'object' || Array.isArray(payload.page_content)) throw new Error('Invalid site content');
    const content = payload.page_content as Record<string, unknown>;
    const filtered: Record<string, string> = {};
    for (const [key, value] of Object.entries(content)) {
      if (!(key in contentLimits) || typeof value !== 'string' || !value.trim() || value.length > contentLimits[key]) throw new Error('Invalid page text');
      filtered[key] = value.trim();
    }
    values.page_content = filtered;
  }
  if ('sections' in payload) {
    const allowed = ['community', 'news', 'updates', 'polls'];
    if (!Array.isArray(payload.sections) || payload.sections.length !== allowed.length) throw new Error('Invalid sections');
    const ids = new Set<string>();
    values.sections = payload.sections.map(section => {
      if (!section || typeof section !== 'object' || !allowed.includes(section.id) || typeof section.enabled !== 'boolean' || ids.has(section.id)) throw new Error('Invalid section settings');
      ids.add(section.id); return { id: section.id, enabled: section.enabled };
    });
  }
  if (!Object.keys(values).length) throw new Error('No settings supplied');
  const { error } = await db.from('sf_settings').update(values).eq('id', 1);
  if (error) throw error;
  return { ok: true };
}
