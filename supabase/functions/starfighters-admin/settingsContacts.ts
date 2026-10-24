const domains: Record<string, string[]> = {
  whatsapp: ['wa.me', 'whatsapp.com'], instagram: ['instagram.com'], facebook: ['facebook.com', 'fb.com'],
  tiktok: ['tiktok.com'], x: ['x.com', 'twitter.com'], youtube: ['youtube.com', 'youtu.be'], telegram: ['t.me', 'telegram.me'],
};
export function validateContacts(input: unknown) {
  if (!Array.isArray(input) || input.length > 30) throw new Error('Maximum 30 public contacts');
  return input.map(link => {
    if (!link || typeof link !== 'object') throw new Error('Invalid contact');
    if (typeof link.label !== 'string' || !link.label.trim() || link.label.length > 80 || typeof link.url !== 'string' || link.url.length > 2048 || typeof link.enabled !== 'boolean') throw new Error('Invalid contact details');
    const platform = link.platform || 'auto';
    if (!['auto', 'website', 'email', 'phone', ...Object.keys(domains)].includes(platform)) throw new Error('Unsupported platform');
    let value = link.url.trim();
    if (platform === 'email' && !value.startsWith('mailto:')) value = `mailto:${value}`;
    if (platform === 'phone' && !value.startsWith('tel:')) value = `tel:${value}`;
    if (platform === 'whatsapp' && !value.startsWith('https://')) value = `https://wa.me/${value.replace(/[\s()+-]/g, '').replace(/^00/, '')}`;
    if (value.startsWith('tel:')) value = `tel:+${value.slice(4).replace(/[\s()+-]/g, '').replace(/^00/, '')}`;
    if (/^https:\/\/(www\.)?wa\.me\//.test(value)) value = value.replace(/(wa\.me\/)([^?]+)/, (_m: string, prefix: string, number: string) => prefix + number.replace(/[\s()+-]/g, '').replace(/^00/, ''));
    const url = new URL(value);
    if (!['https:', 'mailto:', 'tel:'].includes(url.protocol) || url.username || url.password) throw new Error('Unsafe contact URL');
    const host = url.hostname.toLowerCase();
    if (url.protocol === 'tel:' && (!/^\+[1-9]\d{7,14}$/.test(url.pathname) || !['auto', 'phone'].includes(platform))) throw new Error('Invalid international phone');
    if (url.protocol === 'mailto:' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.pathname) || !['auto', 'email'].includes(platform))) throw new Error('Invalid email');
    if (domains[platform] && !domains[platform].some(domain => host === domain || host.endsWith(`.${domain}`))) throw new Error('Contact platform and URL do not match');
    if (['phone', 'email'].includes(platform) && url.protocol === 'https:') throw new Error('Invalid contact protocol');
    const whatsapp = ['wa.me', 'whatsapp.com'].some(domain => host === domain || host.endsWith(`.${domain}`));
    if (whatsapp && !((host === 'wa.me' && /^\/[1-9]\d{7,14}$/.test(url.pathname)) || /^[1-9]\d{7,14}$/.test(url.searchParams.get('phone') || ''))) throw new Error('Invalid WhatsApp international number');
    return { label: link.label.trim(), url: url.href, enabled: link.enabled, platform };
  });
}
