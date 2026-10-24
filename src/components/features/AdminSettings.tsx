import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { SiteSettings } from '@/types/community';
import { useAdminAction } from '@/hooks/useAdmin';
import BrandingEditor from '@/components/forms/BrandingEditor';
import WebsiteContentEditor from '@/components/forms/WebsiteContentEditor';
import ContactEditor from '@/components/forms/ContactEditor';
import FeaturedEditor from '@/components/forms/FeaturedEditor';
interface Props { settings: SiteSettings; }
const TABS = [{ id: 'content', label: 'Page copy & layout' }, { id: 'branding', label: 'Branding & favicon' }, { id: 'contacts', label: 'Socials & WhatsApp' }, { id: 'featured', label: 'Featured profiles' }];
export default function AdminSettings({ settings }: Props) {
  const [tab, setTab] = useState('content');
  const save = useAdminAction('settings');
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><span className="eyebrow text-primary">YOUR WEBSITE. YOUR CONTROL.</span><h1 className="text-4xl font-semibold mt-4">Website editor</h1><p className="text-muted-foreground mt-3 max-w-2xl">Edit public headlines, section order, imagery, favicon, and official contacts. Publish news under News & updates.</p></div><Link to="/" target="_blank" rel="noopener noreferrer" className="btn-secondary"><ExternalLink size={18} />View public site</Link></div>
    <nav aria-label="Website editor sections" className="flex gap-2 overflow-x-auto pb-2">{TABS.map(item => <button key={item.id} onClick={() => setTab(item.id)} aria-current={tab === item.id ? 'page' : undefined} className={`btn whitespace-nowrap ${tab === item.id ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:opacity-80'}`}>{item.label}</button>)}</nav>
    {tab === 'content' && <WebsiteContentEditor key={JSON.stringify([settings.page_content, settings.sections])} settings={settings} />}
    {tab === 'branding' && <BrandingEditor key={JSON.stringify([settings.logo_url, settings.hero_url, settings.favicon_url, settings.contact_instructions])} settings={settings} />}
    {tab === 'contacts' && <ContactEditor key={JSON.stringify(settings.links)} links={settings.links} pending={save.isPending} onChange={links => save.mutate({ payload: { links } })} />}
    {tab === 'featured' && <FeaturedEditor key={JSON.stringify(settings.featured)} featured={settings.featured} onChange={featured => save.mutate({ payload: { featured } })} />}
    <p className="text-sm text-muted-foreground">Saved changes refresh on public pages within 30 seconds. Each editor publishes independently without overwriting other settings.</p>
  </div>;
}
