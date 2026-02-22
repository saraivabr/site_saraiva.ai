import { useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { getAllContent, getFeatured, searchContent } from '@/lib/content';
import { CATEGORIES } from '@/types/content';
import CategoryNav from '@/components/content/CategoryNav';
import ContentSearch from '@/components/content/ContentSearch';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';
import { ArrowRight } from 'lucide-react';

const Footer = lazy(() => import('@/components/Footer'));

const Conteudo = () => {
  const [query, setQuery] = useState('');
  const allContent = useMemo(() => getAllContent(), []);
  const featured = useMemo(() => getFeatured().slice(0, 3), []);
  const filtered = useMemo(() => query ? searchContent(query) : allContent, [query, allContent]);
  const isSearching = query.length > 0;

  return (
    <div className="min-h-screen pt-20">
      <SEOHead
        title="Conteudo sobre IA"
        description="Artigos, tutoriais, reviews de ferramentas, templates de prompts e analises sobre Inteligencia Artificial para empreendedores brasileiros."
        url="/conteudo"
      />
      <main id="main-content">
        {/* Hero Section */}
        <section className="border-b border-black/10">
          <div className="container-max py-16 sm:py-20 md:py-24">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest opacity-40 mb-6">
              Saraiva.AI / Conteudo
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-6" style={{ letterSpacing: '-0.03em' }}>
              Inteligencia<br />
              Artificial<br />
              <span className="opacity-30">sem enrolacao.</span>
            </h1>
            <p className="font-mono text-sm opacity-50 max-w-lg">
              Artigos, tutoriais, ferramentas e analises para quem quer usar IA de verdade.
              Conteudo direto, pratico, feito para empreendedores brasileiros.
            </p>
            <div className="flex items-center gap-4 mt-8 font-mono text-xs opacity-40">
              <span>{allContent.length} artigos</span>
              <span className="opacity-30">·</span>
              <span>6 categorias</span>
              <span className="opacity-30">·</span>
              <span>atualizado diariamente</span>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {!isSearching && featured.length > 0 && (
          <section className="border-b border-black/10">
            <div className="container-max py-12 sm:py-16">
              <h2 className="font-mono text-xs uppercase tracking-widest opacity-40 mb-8">Destaques</h2>
              <div className="grid md:grid-cols-3 gap-px bg-black/10">
                {featured.map((item, i) => (
                  <Link
                    key={item.meta.slug}
                    to={`/conteudo/${item.meta.category}/${item.meta.slug}`}
                    className={`group bg-white p-6 sm:p-8 hover:bg-black/[0.02] transition-all duration-500 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  >
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-30 block mb-4">
                      {CATEGORIES.find(c => c.id === item.meta.category)?.label}
                    </span>
                    <h3 className={`font-black leading-[1.1] mb-3 group-hover:opacity-60 transition-opacity duration-300 ${
                      i === 0 ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-xl'
                    }`} style={{ letterSpacing: '-0.02em' }}>
                      {item.meta.title}
                    </h3>
                    <p className={`font-mono opacity-50 mb-4 line-clamp-2 ${i === 0 ? 'text-sm' : 'text-xs'}`}>
                      {item.meta.description}
                    </p>
                    <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-wider opacity-40 group-hover:opacity-80 transition-opacity">
                      Ler artigo <ArrowRight size={10} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Quick Access */}
        {!isSearching && (
          <section className="border-b border-black/10">
            <div className="container-max py-12 sm:py-16">
              <h2 className="font-mono text-xs uppercase tracking-widest opacity-40 mb-8">Explorar por categoria</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-black/10">
                {CATEGORIES.map(cat => {
                  const count = allContent.filter(item => item.meta.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      to={`/conteudo/${cat.id}`}
                      className="group bg-white p-5 sm:p-6 hover:bg-black hover:text-white transition-all duration-300 text-center"
                    >
                      <span className="text-2xl block mb-3">{cat.icon}</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                        {cat.label}
                      </span>
                      <span className="font-mono text-[0.6rem] opacity-40 group-hover:opacity-60">
                        {count} {count === 1 ? 'artigo' : 'artigos'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* All Content */}
        <section>
          <div className="container-max py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="font-mono text-xs uppercase tracking-widest opacity-40">
                {isSearching ? `Resultados para "${query}"` : 'Todos os artigos'}
              </h2>
              <span className="font-mono text-[0.6rem] opacity-30">
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>
            <ContentSearch onSearch={setQuery} />
            <CategoryNav />
            <ContentGrid items={filtered} />
          </div>
        </section>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Conteudo;
