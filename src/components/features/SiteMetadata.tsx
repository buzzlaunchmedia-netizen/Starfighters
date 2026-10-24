import { useEffect } from 'react';
import { useSettings } from '@/hooks/useCommunity';
import { getPageContent } from '@/constants/site';
export default function SiteMetadata() {
  const { data } = useSettings();
  useEffect(() => {
    if (!data) return;
    const content = getPageContent(data.page_content);
    document.title = content.seoTitle;
    const setMeta = (selector: string, value: string) => { document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value); };
    setMeta('meta[name="description"]', content.seoDescription);
    setMeta('meta[property="og:title"]', content.seoTitle);
    setMeta('meta[property="og:description"]', content.seoDescription);
    setMeta('meta[name="twitter:title"]', content.seoTitle);
    setMeta('meta[name="twitter:description"]', content.seoDescription);
    const favicon = data.favicon_url || '';
    for (const rel of ['icon', 'apple-touch-icon']) {
      const existing = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!favicon || !favicon.startsWith('https://')) { existing?.remove(); continue; }
      const link = existing || document.createElement('link');
      link.rel = rel; link.href = favicon; link.removeAttribute('type');
      if (!existing) document.head.appendChild(link);
    }
  }, [data]);
  return null;
}
