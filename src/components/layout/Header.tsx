import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useCommunity';
import { getSections } from '@/constants/site';
import { useHashScroll } from '@/hooks/useHashScroll';
interface Props { hero?: boolean; }
interface NavLink { label: string; href: string; }
export default function Header({ hero = false }: Props) {
  useHashScroll();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useSettings();
  const links: NavLink[] = getSections(data?.sections).filter(section => section.enabled).flatMap(section => {
    if (section.id === 'community') return [{ label: 'Community', href: '/#community' }, { label: 'About us', href: '/#about' }];
    if (section.id === 'news') return [{ label: 'News', href: '/#news' }];
    if (section.id === 'updates') return [{ label: 'Updates', href: '/#updates' }];
    return [{ label: 'The ring', href: '/polls' }];
  });
  const account = { label: user ? 'My dashboard' : 'Sign in', href: user ? '/dashboard' : '/login' };
  return <header className={hero ? 'hero-nav' : 'relative flex items-center justify-between py-5 px-6 md:px-12 border-b border-border bg-background'}>
    <Brand /><nav className="hidden lg:flex items-center gap-5 text-sm">{links.map(link => <Link key={link.href} className="inline-flex items-center min-h-11 hover:text-primary hover:-translate-y-0.5" to={link.href}>{link.label}</Link>)}</nav>
    <div className="flex items-center gap-2"><Link to={account.href} className="hidden sm:block text-sm px-3 py-3 hover:text-primary">{account.label}</Link><Link to="/#contact" className="btn-secondary !border-0 !text-primary hidden lg:flex !px-5">Contact<span className="w-2 h-2 rounded-full bg-primary ml-2" /></Link><button onClick={() => setOpen(!open)} className="lg:hidden p-3 hover:text-accent" aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={22} /> : <Menu size={22} />}</button></div>
    {open && <nav id="mobile-navigation" className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-2xl p-4 flex flex-col lg:hidden">{[...links, account, { label: 'Contact', href: '/#contact' }].map(link => <Link key={link.href} className="p-3 min-h-11 hover:text-accent" to={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight className="float-right" size={18} /></Link>)}</nav>}
  </header>;
}
