import { Link } from 'react-router-dom';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { useAnnouncements, useSettings } from '@/hooks/useCommunity';
import { getPageContent } from '@/constants/site';
import NewsCard from '@/components/features/NewsCard';
interface Props { archive?: boolean; }
export default function NewsSection({ archive = false }: Props) {
  const { data, isLoading, error, refetch } = useAnnouncements();
  const { data: settings } = useSettings();
  const content = getPageContent(settings?.page_content);
  const news = data?.filter(article => article.kind === 'news') || [];
  const visible = archive ? news : news.slice(0, 5);
  const Heading = archive ? 'h1' : 'h2';
  return <section id="news" className="px-6 md:px-16 py-16 border-t border-border">
    <div className="flex flex-wrap justify-between items-end gap-6 mb-10"><div><span className="eyebrow text-primary">THE STARFIGHTERS JOURNAL</span>
      <Heading className="section-title mt-4">{content.newsTitle}</Heading><p className="text-muted-foreground mt-4 max-w-2xl">{content.newsDescription}</p></div>
      {!archive && news.length > 5 && <Link className="btn-secondary" to="/news">All news<ArrowUpRight size={18} /></Link>}
    </div>
    {isLoading ? <p className="text-muted-foreground">Loading news…</p> : error ? <div className="panel"><p>News is temporarily unavailable.</p><button className="btn-secondary mt-4" onClick={() => refetch()}>Retry</button></div> : visible.length ?
      <div className="grid lg:grid-cols-2 gap-6 items-start">{visible.map((article, index) => <NewsCard key={article.id} article={article} featured={index === 0} />)}</div> :
      <div className="panel flex gap-6 items-center"><Newspaper size={32} className="text-accent shrink-0" /><div><h3 className="text-xl font-semibold">Our next story starts here.</h3><p className="text-muted-foreground mt-2">Official Starfighters news will appear here when published.</p></div></div>}
  </section>;
}
