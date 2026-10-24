export type ContactPlatform = 'auto' | 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' | 'x' | 'youtube' | 'telegram' | 'email' | 'phone' | 'website';
export type SectionId = 'community' | 'news' | 'updates' | 'polls';
export interface SiteSection { id: SectionId; enabled: boolean; }
export interface PageContent {
  heroTitle: string; heroInviteTitle: string; heroInviteText: string; heroButton: string;
  heroTagline: string; heroEmphasis: string; communityTitle: string; communityDescription: string;
  aboutTitle: string; aboutHighlight: string; aboutDescription: string;
  updatesTitle: string; updatesLabel: string; newsTitle: string; newsDescription: string;
  pollsTitle: string; pollsDescription: string; footerTitle: string; footerLabel: string;
  seoTitle: string; seoDescription: string;
}
export interface ContentField { key: keyof PageContent; label: string; max: number; multiline?: boolean; }
export interface ContentGroup { title: string; fields: ContentField[]; }
