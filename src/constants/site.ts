import type { ContentGroup, PageContent, SiteSection } from '@/types/site';
export const DEFAULT_CONTENT: PageContent = {
  heroTitle: 'We have\nto fight', heroInviteTitle: 'A new way to live\nthe boxing experience.',
  heroInviteText: 'No experience needed. Just the drive to grow.', heroButton: 'Join the community',
  heroTagline: 'One community.', heroEmphasis: 'All heart.',
  communityTitle: 'Different paths.\nOne fighting spirit.',
  communityDescription: 'For FUPRE student fighters, community members, volunteers, and everyone who believes in showing up for something bigger.',
  aboutTitle: 'Talent gets you started.\nDiscipline takes you further.', aboutHighlight: 'Community keeps you going.',
  aboutDescription: "We're creating opportunities to train, develop, and grow together.",
  updatesTitle: 'Stay in the loop.', updatesLabel: 'FROM OUR CORNER',
  newsTitle: 'Inside Starfighters.', newsDescription: 'News, training stories, and the people moving our community forward.',
  pollsTitle: 'Your voice. Our next move.', pollsDescription: 'Help shape what happens next. Every member gets one vote.',
  footerTitle: 'Outside the ring.\nStill in your corner.', footerLabel: "LET'S BUILD SOMETHING STRONGER",
  seoTitle: 'STARFIGHTERS — Boxing Community', seoDescription: 'Train. Grow. Compete. Achieve. Join the Starfighters boxing community and find your corner.',
};
export const DEFAULT_SECTIONS: SiteSection[] = ['community', 'news', 'updates', 'polls'].map(id => ({ id: id as SiteSection['id'], enabled: true }));
export const SECTION_LABELS = { community: 'Community & about', news: 'News', updates: 'Announcements & events', polls: 'Community polls' };
export const CONTENT_GROUPS: ContentGroup[] = [
  { title: 'Hero & registration invitation', fields: [
    { key: 'heroTitle', label: 'Hero headline (use two lines)', max: 55, multiline: true },
    { key: 'heroInviteTitle', label: 'Invitation headline', max: 100, multiline: true },
    { key: 'heroInviteText', label: 'Invitation description', max: 150 },
    { key: 'heroButton', label: 'Registration button label', max: 32 },
    { key: 'heroTagline', label: 'Community tagline', max: 35 }, { key: 'heroEmphasis', label: 'Highlighted tagline', max: 24 },
  ] },
  { title: 'Community & about', fields: [
    { key: 'communityTitle', label: 'Community headline', max: 120, multiline: true },
    { key: 'communityDescription', label: 'Community introduction', max: 700, multiline: true },
    { key: 'aboutTitle', label: 'About headline', max: 160, multiline: true },
    { key: 'aboutHighlight', label: 'Highlighted about line', max: 100 },
    { key: 'aboutDescription', label: 'About description (eligibility notice stays visible)', max: 700, multiline: true },
  ] },
  { title: 'News, updates & polls', fields: [
    { key: 'newsTitle', label: 'News section headline', max: 120 }, { key: 'newsDescription', label: 'News introduction', max: 500, multiline: true },
    { key: 'updatesLabel', label: 'Updates section label', max: 60 }, { key: 'updatesTitle', label: 'Updates headline', max: 120 },
    { key: 'pollsTitle', label: 'Polls headline', max: 120 }, { key: 'pollsDescription', label: 'Polls introduction', max: 500, multiline: true },
  ] },
  { title: 'Footer & browser information', fields: [
    { key: 'footerLabel', label: 'Footer label', max: 80 }, { key: 'footerTitle', label: 'Footer headline', max: 120, multiline: true },
    { key: 'seoTitle', label: 'Browser page title', max: 100 }, { key: 'seoDescription', label: 'Page description', max: 320, multiline: true },
  ] },
];
export function getPageContent(content?: Partial<PageContent>): PageContent { return { ...DEFAULT_CONTENT, ...content }; }
export function getSections(sections?: SiteSection[]): SiteSection[] { return sections?.length ? sections : DEFAULT_SECTIONS; }
