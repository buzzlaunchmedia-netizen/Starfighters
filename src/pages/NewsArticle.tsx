import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useNewsArticle } from '@/hooks/useCommunity';
export default function NewsArticle() {
  const { id } = useParams();
  const { data: article, isLoading, error, refetch } = useNewsArticle(id);
  return <><Header /><main className="px-6 md:px-16 py-12">
    <Link to="/news" className="inline-flex items-center gap-3 min-h-11 text-muted-foreground hover:text-accent mb-8"><ArrowLeft size={18} />Back to news</Link>
    {isLoading ? <p>Loading story…</p> : error ? <section className="panel"><h1 className="text-2xl">Unable to load this story</h1><p className="text-muted-foreground mt-3">Please try again shortly.</p><button className="btn-secondary mt-5" onClick={() => refetch()}>Retry</button></section> : !article ? <section className="panel"><h1 className="text-3xl font-semibold">Story unavailable</h1><p className="text-muted-foreground mt-4">This story has not been published or is no longer available.</p></section> :
      <article className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16">
        <aside><span className="eyebrow text-primary">STARFIGHTERS NEWS</span><p className="text-muted-foreground mt-4"><time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p><p className="text-muted-foreground mt-6">Stories from our boxing community. Train. Grow. Compete. Achieve.</p></aside>
        <div className="max-w-4xl"><h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">{article.title}</h1>
          {article.image_url && <img src={article.image_url} alt={article.title} className="w-full aspect-[16/9] object-cover rounded-2xl mt-8" />}
          <div className="mt-8 space-y-6 text-lg">{article.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap break-words">{paragraph}</p>)}</div>
        </div>
      </article>}
  </main><Footer /></>;
}
