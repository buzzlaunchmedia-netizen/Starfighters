import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter, FaWhatsapp, FaYoutube, FaTelegram } from 'react-icons/fa6';
import { Globe, Mail, Phone } from 'lucide-react';
import type { IconType } from 'react-icons';
import type { ContactPlatform } from '@/types/site';
interface Props { platform: ContactPlatform; className?: string; }
const BRAND_ICONS: Partial<Record<ContactPlatform, IconType>> = { facebook: FaFacebookF, instagram: FaInstagram, tiktok: FaTiktok, x: FaXTwitter, whatsapp: FaWhatsapp, youtube: FaYoutube, telegram: FaTelegram };
export default function SocialIcon({ platform, className }: Props) {
  const BrandIcon = BRAND_ICONS[platform];
  if (BrandIcon) return <BrandIcon size={22} className={className} aria-hidden="true" focusable="false" />;
  const Icon = platform === 'email' ? Mail : platform === 'phone' ? Phone : Globe;
  return <Icon size={22} className={className} aria-hidden="true" />;
}
