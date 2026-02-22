import type { ContentItem } from '@/types/content';
import ArticleCard from './ArticleCard';

interface ContentGridProps {
  items: ContentItem[];
  columns?: 2 | 3;
}

const ContentGrid = ({ items, columns = 3 }: ContentGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-mono text-sm opacity-50">Nenhum conteúdo encontrado.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map(item => (
        <ArticleCard key={`${item.meta.category}-${item.meta.slug}`} item={item} />
      ))}
    </div>
  );
};

export default ContentGrid;
