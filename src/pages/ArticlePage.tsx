import { useMemo, lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getBySlug, getRelated } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';
import ArticleRenderer from '@/components/content/ArticleRenderer';
import TableOfContents from '@/components/content/TableOfContents';
import ShareButtons from '@/components/content/ShareButtons';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';
import { ArrowLeft, Clock, User, MessageCircle } from 'lucide-react';

const Footer = lazy(() => import('@/components/Footer'));

const DIFFICULTY_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
};

const WHATSAPP_NUMBER = '5511999999999';

const buildWhatsAppUrl = (articleTitle: string) => {
  const text = encodeURIComponent(
    `Oi! Acabei de ler "${articleTitle}" no Saraiva.AI e quero saber como aplicar IA no meu negócio.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};

/** Splits markdown content roughly in half at a paragraph boundary. */
const splitContentAtMiddle = (content: string): [string, string] => {
  const lines = content.split('\n');
  const midPoint = Math.floor(lines.length / 2);
  // Find the nearest empty line (paragraph break) around the midpoint
  let splitIndex = midPoint;
  for (let offset = 0; offset < 20; offset++) {
    if (midPoint + offset < lines.length && lines[midPoint + offset].trim() === '') {
      splitIndex = midPoint + offset;
      break;
    }
    if (midPoint - offset >= 0 && lines[midPoint - offset].trim() === '') {
      splitIndex = midPoint - offset;
      break;
    }
  }
  return [lines.slice(0, splitIndex).join('\n'), lines.slice(splitIndex).join('\n')];
};

/** Inline CTA banner inserted mid-article. */
const InlineCtaBanner = ({ articleTitle }: { articleTitle: string }) => (
  <a
    href={buildWhatsAppUrl(articleTitle)}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-3 my-10 py-4 px-6 bg-black/[0.03] border-l-2 border-black hover:bg-black hover:text-white transition-all duration-300 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
  >
    <MessageCircle size={18} className="flex-shrink-0 opacity-60 group-hover:opacity-100" />
    <span className="font-mono text-[0.7rem] sm:text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">
      Quer implementar isso? Fale conosco
    </span>
  </a>
);

/** Scroll-triggered visibility hook using IntersectionObserver. */
const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

/** Prominent WhatsApp CTA block at the end of the article. */
const ArticleWhatsAppCta = ({ articleTitle }: { articleTitle: string }) => {
  const { ref, isVisible } = useInView(0.3);

  return (
    <div
      ref={ref}
      className={`mt-14 bg-black text-white p-8 sm:p-10 md:p-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <p className="font-mono text-[0.6rem] uppercase tracking-widest opacity-60 mb-4">
        Proximo passo
      </p>
      <h3
        className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4"
        style={{ letterSpacing: '-0.02em' }}
      >
        Gostou deste conteudo?
      </h3>
      <p className="font-mono text-xs sm:text-sm opacity-60 leading-relaxed mb-8 max-w-lg">
        Converse com a Saraiva.AI e descubra como a IA pode transformar seu negocio
      </p>
      <a
        href={buildWhatsAppUrl(articleTitle)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-white text-black font-mono font-bold text-sm sm:text-base uppercase tracking-wider px-8 py-4 hover:opacity-90 transition-opacity duration-300 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <MessageCircle size={18} />
        Falar no WhatsApp
      </a>
    </div>
  );
};

const ArticlePageSkeleton = () => (
  <div className="min-h-screen pt-20 animate-pulse">
    {/* Breadcrumb skeleton */}
    <div className="border-b border-black/[0.06]">
      <div className="container-max py-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 bg-black/5 rounded" />
          <div className="h-3 w-3 bg-black/5 rounded" />
          <div className="h-3 w-20 bg-black/5 rounded" />
        </div>
      </div>
    </div>
    {/* Header skeleton */}
    <div className="border-b border-black/[0.06]">
      <div className="container-max py-12 sm:py-16 md:py-20 max-w-4xl">
        <div className="h-4 w-32 bg-black/5 rounded mb-8" />
        <div className="flex gap-3 mb-6">
          <div className="h-6 w-24 bg-black/5 rounded" />
          <div className="h-6 w-20 bg-black/5 rounded" />
        </div>
        <div className="h-10 w-3/4 bg-black/5 rounded mb-4" />
        <div className="h-10 w-1/2 bg-black/5 rounded mb-6" />
        <div className="h-4 w-full bg-black/5 rounded mb-2 max-w-2xl" />
        <div className="h-4 w-2/3 bg-black/5 rounded mb-8 max-w-2xl" />
        <div className="flex gap-4">
          <div className="h-3 w-20 bg-black/5 rounded" />
          <div className="h-3 w-28 bg-black/5 rounded" />
          <div className="h-3 w-24 bg-black/5 rounded" />
        </div>
      </div>
    </div>
    {/* Body skeleton */}
    <div className="container-max py-12 sm:py-16">
      <div className="flex gap-16 max-w-4xl">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-5/6 bg-black/5 rounded" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-3/4 bg-black/5 rounded" />
          <div className="h-8 w-0 my-2" />
          <div className="h-6 w-2/5 bg-black/5 rounded" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-4/5 bg-black/5 rounded" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-2/3 bg-black/5 rounded" />
          <div className="h-8 w-0 my-2" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-5/6 bg-black/5 rounded" />
          <div className="h-4 w-3/4 bg-black/5 rounded" />
        </div>
        <div className="hidden xl:block w-52 flex-shrink-0 space-y-3">
          <div className="h-3 w-24 bg-black/5 rounded" />
          <div className="h-3 w-36 bg-black/5 rounded" />
          <div className="h-3 w-28 bg-black/5 rounded" />
          <div className="h-3 w-32 bg-black/5 rounded" />
          <div className="h-3 w-20 bg-black/5 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const ArticlePage = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const catInfo = CATEGORIES.find(c => c.id === category);
  const [ready, setReady] = useState(false);

  const item = useMemo(() => {
    if (!category || !slug) return undefined;
    return getBySlug(category as Category, slug);
  }, [category, slug]);

  const related = useMemo(() => {
    if (!item) return [];
    return getRelated(item, 3);
  }, [item]);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!catInfo || !item) {
    return <Navigate to="/conteudo" replace />;
  }

  if (!ready) {
    return <ArticlePageSkeleton />;
  }

  const { meta, content } = item;
  const readingTime = Math.max(3, Math.ceil(content.split(/\s+/).length / 200));
  const isLongArticle = content.split(/\s+/).length > 400;
  const [contentFirstHalf, contentSecondHalf] = useMemo(
    () => (isLongArticle ? splitContentAtMiddle(content) : [content, '']),
    [content, isLongArticle]
  );

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
            <nav className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest opacity-60" aria-label="Breadcrumb">
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
              className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
            <p className="font-mono text-sm sm:text-base opacity-60 mb-8 max-w-2xl leading-relaxed">
              {meta.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 flex-wrap font-mono text-[0.65rem] opacity-60">
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
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-60 block mb-1">Nota</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">{meta.rating}</span>
                    <span className="text-sm opacity-60">/5</span>
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
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-60 block mb-1">Modelo</span>
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
          {/* Mobile Table of Contents */}
          <details className="xl:hidden max-w-4xl mb-8 border border-black/10 bg-black/[0.02]">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest opacity-60 px-5 py-4 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
              Indice do artigo
            </summary>
            <div className="px-5 pb-4">
              <TableOfContents content={content} />
            </div>
          </details>

          <div className="flex gap-16 max-w-4xl">
            <article className="flex-1 min-w-0">
              <ArticleRenderer content={contentFirstHalf} />

              {/* Inline CTA - shown mid-article for long content */}
              {isLongArticle && (
                <>
                  <InlineCtaBanner articleTitle={meta.title} />
                  <ArticleRenderer content={contentSecondHalf} />
                </>
              )}

              {/* WhatsApp CTA block */}
              <ArticleWhatsAppCta articleTitle={meta.title} />

              {/* Share + Source */}
              <div className="mt-14 pt-8 border-t border-black/10 space-y-6">
                <ShareButtons title={meta.title} />

                {meta.source && meta.source.length > 0 && (
                  <a
                    href={meta.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-mono text-[0.6rem] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4 decoration-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
                  <p className="font-mono text-[0.65rem] opacity-60 leading-relaxed">
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
              <h2 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-8">
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
