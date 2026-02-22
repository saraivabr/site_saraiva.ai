import { useState, useMemo, lazy, Suspense } from 'react';
import { getAllContent, searchContent } from '@/lib/content';
import CategoryNav from '@/components/content/CategoryNav';
import ContentSearch from '@/components/content/ContentSearch';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';

const Footer = lazy(() => import('@/components/Footer'));

const Conteudo = () => {
  const [query, setQuery] = useState('');
  const allContent = useMemo(() => getAllContent(), []);
  const filtered = useMemo(() => query ? searchContent(query) : allContent, [query, allContent]);

  return (
    <div className="min-h-screen pt-20">
      <SEOHead
        title="Conteúdo sobre IA"
        description="Artigos, tutoriais, reviews de ferramentas, templates de prompts e análises sobre Inteligência Artificial para empreendedores brasileiros."
        url="/conteudo"
      />
      <main id="main-content" className="container-max section-spacing">
        <div className="mb-12">
          <h1 className="font-mono text-2xl sm:text-3xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
            Conteúdo sobre IA
          </h1>
          <p className="font-mono text-sm opacity-60 max-w-xl">
            Tudo que você precisa saber sobre Inteligência Artificial para transformar seu negócio. Artigos, tutoriais, ferramentas e análises — sem enrolação.
          </p>
        </div>

        <ContentSearch onSearch={setQuery} />
        <CategoryNav />
        <ContentGrid items={filtered} />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Conteudo;
