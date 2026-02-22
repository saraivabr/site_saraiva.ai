import { useMemo, lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getByCategory } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';
import CategoryNav from '@/components/content/CategoryNav';
import ContentGrid from '@/components/content/ContentGrid';
import SEOHead from '@/components/content/SEOHead';

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
        title={`${catInfo.label} — IA para Negócios`}
        description={catInfo.description}
        url={`/conteudo/${category}`}
      />
      <main id="main-content" className="container-max section-spacing">
        <div className="mb-12">
          <h1 className="font-mono text-2xl sm:text-3xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
            {catInfo.icon} {catInfo.label}
          </h1>
          <p className="font-mono text-sm opacity-60">
            {catInfo.description}
          </p>
        </div>

        <CategoryNav />
        <ContentGrid items={items} />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
