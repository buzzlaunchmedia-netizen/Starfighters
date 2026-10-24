import { z } from 'zod';
import type { ContactPlatform } from '@/types/site';
export const CONTACT_PLATFORMS: { value: ContactPlatform; label: string }[] = [
  { value: 'auto', label: 'Detect from link' }, { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' }, { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' }, { value: 'x', label: 'X' },
  { value: 'youtube', label: 'YouTube' }, { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'website', label: 'Other website' },
];
const DOMAINS: Partial<Record<ContactPlatform, string[]>> = {
  whatsapp: ['wa.me', 'whatsapp.com'], instagram: ['instagram.com'], facebook: ['facebook.com', 'fb.com'],
  tiktok: ['tiktok.com'], x: ['x.com', 'twitter.com'], youtube: ['youtube.com', 'youtu.be'], telegram: ['t.me', 'telegram.me'],
};
export function detectPlatform(url: string): ContactPlatform {
  if (url.startsWith('mailto:')) return 'email';
  if (url.startsWith('tel:')) return 'phone';
  if (!z.string().url().safeParse(url).success) return 'website';
  const host = new URL(url).hostname.toLowerCase();
  return (Object.keys(DOMAINS) as ContactPlatform[]).find(key => DOMAINS[key]?.some(domain => host === domain || host.endsWith(`.${domain}`))) || 'website';
}
export function normalizeContact(input: string, platform: ContactPlatform): string {
  let value = input.trim();
  if (platform === 'email' && !value.startsWith('mailto:')) value = `mailto:${value}`;
  if (platform === 'phone' && !value.startsWith('tel:')) value = `tel:${value}`;
  if (platform === 'whatsapp' && !/^https:\/\//.test(value)) value = `https://wa.me/${value.replace(/[\s()+-]/g, '').replace(/^00/, '')}`;
  if (value.startsWith('tel:')) value = `tel:+${value.slice(4).replace(/[\s()+-]/g, '').replace(/^00/, '')}`;
  if (/^https:\/\/(www\.)?wa\.me\//.test(value)) value = value.replace(/(wa\.me\/)([^?]+)/, (_match: string, prefix: string, number: string) => prefix + number.replace(/[\s()+-]/g, '').replace(/^00/, ''));
  return value;
}
export function contactError(url: string, platform: ContactPlatform): string | null {
  if (url.startsWith('tel:')) return /^tel:\+[1-9]\d{7,14}$/.test(url) && ['auto', 'phone'].includes(platform) ? null : 'Use an international phone number with its country code.';
  if (url.startsWith('mailto:')) return z.string().email().safeParse(url.slice(7)).success && ['auto', 'email'].includes(platform) ? null : 'Enter a valid public email address.';
  if (!z.string().url().safeParse(url).success || !url.startsWith('https://')) return 'Use a complete HTTPS website or social-profile URL.';
  const parsed = new URL(url);
  if (parsed.username || parsed.password) return 'Links must not contain login credentials.';
  const detected = detectPlatform(url);
  if (platform !== 'auto' && platform !== 'website' && platform !== detected) return `Enter a valid ${CONTACT_PLATFORMS.find(item => item.value === platform)?.label} link.`;
  if (detected === 'whatsapp' && !((parsed.hostname === 'wa.me' && /^\/[1-9]\d{7,14}$/.test(parsed.pathname)) || /^[1-9]\d{7,14}$/.test(parsed.searchParams.get('phone') || ''))) return 'Use a WhatsApp number with its country code, for example +234 followed by the number without its leading zero.';
  return null;
}
export const contactSchema = z.object({ links: z.array(z.object({
  label: z.string().trim().min(1, 'Enter a public label.').max(80),
  platform: z.enum(['auto', 'whatsapp', 'instagram', 'facebook', 'tiktok', 'x', 'youtube', 'telegram', 'email', 'phone', 'website']).default('auto'),
  url: z.string().trim().min(1, 'Enter a contact value.').max(2048), enabled: z.boolean(),
}).superRefine((link, context) => {
  const error = contactError(normalizeContact(link.url, link.platform), link.platform);
  if (error) context.addIssue({ code: z.ZodIssueCode.custom, path: ['url'], message: error });
})).max(30) });
export type ContactValues = z.infer<typeof contactSchema>;
