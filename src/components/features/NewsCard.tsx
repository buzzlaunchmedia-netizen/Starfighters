import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Announcement } from '@/types/community';
interface Props { article: Announcement; featured?: boolean; }
export default function NewsCard({ article, featured = false }: Props) {
  return <article className={`group bg-card border border-border rounded-2xl overflow-hidden ${featured ? 'lg:row-span-2' : ''}`}>
    {article.image_url && <Link to={`/news/${article.id}`} className="block overflow-hidden" aria-label={`Read ${article.title}`}>
      <img loading="lazy" src={article.image_url} alt={article.title} className={`w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] ${featured ? 'aspect-[16/9]' : 'aspect-[21/9]'}`} />
    </Link>}
    <div className={featured ? 'p-8' : 'p-6'}>
      <p className="eyebrow text-accent">{featured ? 'FEATURED STORY' : 'COMMUNITY NEWS'}</p>
      <h3 className={`${featured ? 'text-3xl md:text-4xl' : 'text-2xl'} font-semibold mt-4 leading-tight`}><Link className="inline-block min-h-11 hover:text-accent" to={`/news/${article.id}`}>{article.title}</Link></h3>
      <p className="text-muted-foreground mt-4 line-clamp-3">{article.content}</p>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6"><time dateTime={article.created_at} className="text-sm text-muted-foreground">{new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
        <Link to={`/news/${article.id}`} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold hover:text-accent">Read story<ArrowUpRight size={18} /></Link></div>
    </div>
  </article>;
}
