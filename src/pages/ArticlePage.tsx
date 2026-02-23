import { useMemo, lazy, Suspense } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getBySlug, getRelated } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';
import ArticleRenderer from '@/components/content/ArticleRenderer';
import TableOfContents from '@/components/content/TableOfContents';
import ShareButtons from '@/components/content/ShareButtons';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';
import { ArrowLeft, Clock, User } from 'lucide-react';

const Footer = lazy(() => import('@/components/Footer'));

const DIFFICULTY_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
};

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
  const readingTime = Math.max(3, Math.ceil(content.split(/\s+/).length / 200));

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
      <main id="main-content">
        {/* Breadcrumb bar */}
        <div className="border-b border-black/[0.06]">
          <div className="container-max py-4">
            <nav className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest opacity-40" aria-label="Breadcrumb">
              <Link to="/conteudo" className="hover:opacity-100 transition-opacity">Conteudo</Link>
              <span>/</span>
              <Link to={`/conteudo/${meta.category}`} className="hover:opacity-100 transition-opacity">{catInfo.label}</Link>
              <span>/</span>
              <span className="opacity-70 truncate max-w-[200px]">{meta.title}</span>
            </nav>
          </div>
        </div>

        {/* Article header */}
        <div className="border-b border-black/[0.06]">
          <div className="container-max py-12 sm:py-16 md:py-20 max-w-4xl">
            <Link
              to={`/conteudo/${meta.category}`}
              className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest opacity-30 hover:opacity-70 transition-opacity mb-8"
            >
              <ArrowLeft size={12} />
              Voltar para {catInfo.label}
            </Link>

            {/* Category badge */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest bg-black text-white px-3 py-1.5">
                {catInfo.icon} {catInfo.label}
              </span>
              {meta.difficulty && (
                <span className="font-mono text-[0.6rem] uppercase tracking-widest bg-black/[0.06] px-3 py-1.5">
                  {DIFFICULTY_LABELS[meta.difficulty] || meta.difficulty}
                </span>
              )}
              {meta.featured && (
                <span className="font-mono text-[0.6rem] uppercase tracking-widest bg-black/[0.06] px-3 py-1.5">
                  Destaque
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.05] mb-6" style={{ letterSpacing: '-0.03em' }}>
              {meta.title}
            </h1>

            {/* Description */}
            <p className="font-mono text-sm sm:text-base opacity-50 mb-8 max-w-2xl leading-relaxed">
              {meta.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 flex-wrap font-mono text-[0.65rem] opacity-40">
              <span className="inline-flex items-center gap-1.5">
                <User size={12} />
                {meta.author}
              </span>
              <span className="opacity-30">|</span>
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
              <span className="opacity-30">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {readingTime} min de leitura
              </span>
            </div>

            {/* Rating box for tools */}
            {meta.category === 'ferramentas' && meta.rating && (
              <div className="flex items-center gap-6 mt-8 p-5 bg-black/[0.02] border-l-2 border-black">
                <div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-40 block mb-1">Nota</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">{meta.rating}</span>
                    <span className="text-sm opacity-40">/5</span>
                    <div className="flex gap-0.5 ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < (meta.rating || 0) ? 'bg-black' : 'bg-black/10'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {meta.pricing && (
                  <>
                    <div className="w-px h-10 bg-black/10" />
                    <div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-40 block mb-1">Modelo</span>
                      <span className="font-mono text-sm font-bold uppercase">{meta.pricing}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-8">
              {meta.tags.map(tag => (
                <span key={tag} className="font-mono text-[0.55rem] uppercase tracking-widest bg-black/[0.04] px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="container-max py-12 sm:py-16">
          <div className="flex gap-16 max-w-4xl">
            <article className="flex-1 min-w-0">
              <ArticleRenderer content={content} />

              {/* Share + Source */}
              <div className="mt-14 pt-8 border-t border-black/10 space-y-6">
                <ShareButtons title={meta.title} />

                {meta.source && meta.source.length > 0 && (
                  <a
                    href={meta.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-mono text-[0.6rem] uppercase tracking-widest opacity-30 hover:opacity-70 transition-opacity underline underline-offset-4 decoration-black/20"
                  >
                    Ver fonte original
                  </a>
                )}
              </div>

              {/* Author card */}
              <div className="mt-12 p-6 bg-black/[0.02] flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono text-sm font-bold flex-shrink-0">
                  S
                </div>
                <div>
                  <span className="font-mono text-xs font-bold block mb-1">Saraiva</span>
                  <p className="font-mono text-[0.65rem] opacity-50 leading-relaxed">
                    Especialista em IA aplicada a negocios. Ajudo empreendedores a parar de estudar e comecar a lucrar com inteligencia artificial.
                  </p>
                </div>
              </div>
            </article>

            <aside className="hidden xl:block w-52 flex-shrink-0">
              <TableOfContents content={content} />
            </aside>
          </div>
        </div>

        {/* Related content */}
        {related.length > 0 && (
          <section className="border-t border-black/[0.06]">
            <div className="container-max py-12 sm:py-16">
              <h2 className="font-mono text-xs uppercase tracking-widest opacity-40 mb-8">
                Conteudo relacionado
              </h2>
              <ContentGrid items={related} columns={3} />
            </div>
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
