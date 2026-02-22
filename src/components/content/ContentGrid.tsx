import type { ContentItem } from '@/types/content';
import ArticleCard from './ArticleCard';

interface ContentGridProps {
  items: ContentItem[];
  columns?: 2 | 3;
}

const ContentGrid = ({ items, columns = 3 }: ContentGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-30 mb-2">
          Nenhum resultado
        </p>
        <p className="font-mono text-sm opacity-50">
          Tente buscar por outro termo ou explore as categorias.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-px bg-black/[0.06] ${
      columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
    }`}>
      {items.map((item, i) => (
        <ArticleCard
          key={`${item.meta.category}-${item.meta.slug}`}
          item={item}
          featured={i === 0 && columns === 3}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
