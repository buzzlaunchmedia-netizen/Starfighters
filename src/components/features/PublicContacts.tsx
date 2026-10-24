import { ArrowUpRight } from 'lucide-react';
import SocialIcon from '@/components/features/SocialIcon';
import { contactError, detectPlatform } from '@/lib/contacts';
import type { ContactLink } from '@/types/community';
interface Props { links: ContactLink[]; }
export default function PublicContacts({ links }: Props) {
  const visible = links.filter(link => link.enabled && !contactError(link.url, link.platform || 'auto'));
  return <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 md:pt-8 min-w-0">
    {visible.map((link, index) => {
      const platform = link.platform && link.platform !== 'auto' ? link.platform : detectPlatform(link.url);
      const external = link.url.startsWith('https://');
      const number = platform === 'whatsapp' ? new URL(link.url).pathname.replace('/', '') : '';
      return <a key={`${link.url}-${index}`} href={link.url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-4 min-h-16 py-4 px-5 bg-card border border-border rounded-xl hover:text-accent hover:-translate-y-0.5 focus-visible:text-accent">
        <SocialIcon platform={platform} className="shrink-0" /><span className="min-w-0 flex-1"><span className="block font-medium break-words">{link.label}</span>
          {number && /^[1-9]\d{7,14}$/.test(number) && <span className="block text-sm text-muted-foreground mt-1">+{number}</span>}</span>
        {external && <ArrowUpRight size={18} className="shrink-0" />}
      </a>;
    })}
  </div>;
}
