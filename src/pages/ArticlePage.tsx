import { useMemo, lazy, Suspense } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getBySlug, getRelated } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';
import ArticleRenderer from '@/components/content/ArticleRenderer';
import TableOfContents from '@/components/content/TableOfContents';
import ShareButtons from '@/components/content/ShareButtons';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';
import { ArrowLeft } from 'lucide-react';

const Footer = lazy(() => import('@/components/Footer'));

const ArticlePage = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const catInfo = CATEGORIES.find(c => c.id === category);

  const item = useMemo(() => {
    if (!category || !slug) return undefined;
    return getBySlug(category as Category, slug);
  }, [category, slug]);

  const related = useMemo(() => {
    if (!item) return [];
    return getRelated(item, 3);
  }, [item]);

  if (!catInfo || !item) {
    return <Navigate to="/conteudo" replace />;
  }

  const { meta, content } = item;

  return (
    <div className="min-h-screen pt-20">
      <SEOHead
        title={meta.title}
        description={meta.description}
        url={`/conteudo/${meta.category}/${meta.slug}`}
        image={meta.image}
        type="article"
        publishedTime={meta.date}
        tags={meta.tags}
      />
      <main id="main-content" className="container-max py-12 sm:py-16">
        <Link
          to={`/conteudo/${meta.category}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft size={14} />
          {catInfo.label}
        </Link>

        <div className="flex gap-12">
          <article className="flex-1 min-w-0">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider opacity-50">
                  {catInfo.icon} {catInfo.label}
                </span>
                <span className="opacity-20">·</span>
                <time className="font-mono text-[0.65rem] opacity-50" dateTime={meta.date}>
                  {new Date(meta.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                {meta.difficulty && (
                  <>
                    <span className="opacity-20">·</span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider bg-black/5 px-2 py-0.5">
                      {meta.difficulty}
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-mono text-xl sm:text-2xl md:text-3xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
                {meta.title}
              </h1>

              <p className="font-mono text-sm opacity-60 mb-6">
                {meta.description}
              </p>

              {meta.image && (
                <div className="aspect-video mb-6 overflow-hidden bg-black/5">
                  <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-6">
                {meta.tags.map(tag => (
                  <span key={tag} className="font-mono text-[0.6rem] uppercase tracking-wider bg-black/5 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>

              {meta.category === 'ferramentas' && meta.rating && (
                <div className="flex items-center gap-4 mb-6 p-4 border border-black/10">
                  <div>
                    <span className="font-mono text-xs opacity-50 block">Rating</span>
                    <span className="font-mono text-lg font-bold">{meta.rating}/5</span>
                  </div>
                  {meta.pricing && (
                    <div>
                      <span className="font-mono text-xs opacity-50 block">Preço</span>
                      <span className="font-mono text-sm font-bold uppercase">{meta.pricing}</span>
                    </div>
                  )}
                </div>
              )}
            </header>

            <ArticleRenderer content={content} />

            <div className="mt-12 pt-8 border-t border-black/10">
              <ShareButtons title={meta.title} />
            </div>

            {meta.source && (
              <div className="mt-6">
                <a
                  href={meta.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs opacity-50 hover:opacity-100 transition-opacity underline underline-offset-2"
                >
                  Fonte original
                </a>
              </div>
            )}
          </article>

          <aside className="hidden xl:block w-56 flex-shrink-0">
            <TableOfContents content={content} />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-black/10">
            <h2 className="font-mono text-lg font-bold mb-8">Conteúdo relacionado</h2>
            <ContentGrid items={related} columns={3} />
          </section>
        )}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default ArticlePage;
