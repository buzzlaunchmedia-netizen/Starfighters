import { Link } from 'react-router-dom';
import Brand from '@/components/layout/Brand';
import FooterSponsor from '@/components/features/FooterSponsor';
import PublicContacts from '@/components/features/PublicContacts';
import { useSettings } from '@/hooks/useCommunity';
import { getPageContent } from '@/constants/site';
export default function Footer() {
  const { data, error } = useSettings();
  const content = getPageContent(data?.page_content);
  return <footer id="contact" className="px-6 md:px-16 pt-16 pb-8 border-t border-border">
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-16">
      <div><span className="eyebrow text-primary">{content.footerLabel}</span><h2 className="text-4xl md:text-6xl mt-4 mb-6 tracking-tight whitespace-pre-line">{content.footerTitle}</h2><p className="text-muted-foreground max-w-md">{data?.contact_instructions || 'Official contact details will appear here when published by the Starfighters team.'}</p></div>
      <div><PublicContacts links={data?.links || []} />{error && <p className="text-muted-foreground mt-4">Contact details are temporarily unavailable.</p>}</div>
    </div>
    <FooterSponsor />
    <div className="flex flex-wrap gap-6 items-center justify-between mt-8 pt-8 border-t border-border"><Brand /><p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Starfighters. Built on discipline.</p><Link to="/privacy" className="inline-flex items-center min-h-11 text-sm text-muted-foreground hover:text-accent">Privacy</Link></div>
  </footer>;
}
