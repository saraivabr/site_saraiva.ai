import { useMemo, lazy, Suspense } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getByCategory } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';
import CategoryNav from '@/components/content/CategoryNav';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';
import { ArrowLeft } from 'lucide-react';

const Footer = lazy(() => import('@/components/Footer'));

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const catInfo = CATEGORIES.find(c => c.id === category);

  const items = useMemo(() => {
    if (!category) return [];
    return getByCategory(category as Category);
  }, [category]);

  if (!catInfo) {
    return <Navigate to="/conteudo" replace />;
  }

  return (
    <div className="min-h-screen pt-20">
      <SEOHead
        title={`${catInfo.label} — IA para Negocios`}
        description={catInfo.description}
        url={`/conteudo/${category}`}
      />
      <main id="main-content">
        {/* Category Hero */}
        <section className="border-b border-black/[0.06]">
          <div className="container-max py-16 sm:py-20">
            <Link
              to="/conteudo"
              className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ArrowLeft size={12} />
              Todos os artigos
            </Link>

            <div className="flex items-start gap-4">
              <span className="text-4xl sm:text-5xl">{catInfo.icon}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[0.95] mb-3" style={{ letterSpacing: '-0.03em' }}>
                  {catInfo.label}
                </h1>
                <p className="font-mono text-sm opacity-60 max-w-lg">
                  {catInfo.description}
                </p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest opacity-60 mt-4">
                  {items.length} {items.length === 1 ? 'artigo' : 'artigos'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="container-max py-12 sm:py-16">
            <CategoryNav />
            <ContentGrid items={items} />
          </div>
        </section>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
