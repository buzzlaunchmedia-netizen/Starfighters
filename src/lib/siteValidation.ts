import { z } from 'zod';
import { CONTENT_GROUPS } from '@/constants/site';
import type { PageContent } from '@/types/site';
const fields = Object.fromEntries(CONTENT_GROUPS.flatMap(group => group.fields.map(field => [field.key, z.string().trim().min(1, 'Enter text for this field.').max(field.max, `Use at most ${field.max} characters.`)]))) as Record<keyof PageContent, z.ZodString>;
export const websiteContentSchema = z.object({
  page_content: z.object(fields),
  sections: z.array(z.object({ id: z.enum(['community', 'news', 'updates', 'polls']), enabled: z.boolean() })).length(4).refine(values => new Set(values.map(item => item.id)).size === 4, 'Each section must appear once.'),
});
export type WebsiteContentValues = z.infer<typeof websiteContentSchema>;
const imageUrl = z.union([z.literal(''), z.string().url().startsWith('https://')]);
export const brandingSchema = z.object({ logo_url: imageUrl, hero_url: imageUrl, favicon_url: imageUrl, contact_instructions: z.string().trim().max(2000) });
export type BrandingValues = z.infer<typeof brandingSchema>;
export const publicationSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title.').max(200), content: z.string().trim().min(1, 'Enter publication content.').max(10000),
  kind: z.enum(['announcement', 'event', 'news']), event_date: z.string().refine(value => !value || Number.isFinite(Date.parse(`${value}Z`)), 'Enter a valid date.'),
  image_url: imageUrl, published: z.boolean(),
});
export type PublicationValues = z.infer<typeof publicationSchema>;
