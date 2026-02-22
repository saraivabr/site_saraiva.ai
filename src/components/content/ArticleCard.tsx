import { Link } from 'react-router-dom';
import type { ContentItem } from '@/types/content';

interface ArticleCardProps {
  item: ContentItem;
}

const ArticleCard = ({ item }: ArticleCardProps) => {
  const { meta } = item;

  return (
    <Link
      to={`/conteudo/${meta.category}/${meta.slug}`}
      className="group block border border-black/10 p-6 hover:border-black/30 transition-all duration-300"
    >
      {meta.image && (
        <div className="aspect-video mb-4 overflow-hidden bg-black/5">
          <img
            src={meta.image}
            alt={meta.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-wider opacity-50">
          {meta.category}
        </span>
        <span className="opacity-20">·</span>
        <time className="font-mono text-[0.65rem] opacity-50" dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString('pt-BR')}
        </time>
      </div>

      <h3 className="font-mono text-sm font-bold mb-2 group-hover:opacity-70 transition-opacity duration-300 line-clamp-2">
        {meta.title}
      </h3>

      <p className="font-mono text-xs opacity-60 line-clamp-2 mb-3">
        {meta.description}
      </p>

      <div className="flex flex-wrap gap-1">
        {meta.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="font-mono text-[0.6rem] uppercase tracking-wider bg-black/5 px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      {meta.category === 'ferramentas' && meta.rating && (
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-xs font-bold">{meta.rating}/5</span>
          {meta.pricing && (
            <span className="font-mono text-[0.6rem] uppercase tracking-wider bg-black/5 px-2 py-0.5">
              {meta.pricing}
            </span>
          )}
        </div>
      )}

      {meta.category === 'tutoriais' && meta.difficulty && (
        <div className="mt-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-wider bg-black/5 px-2 py-0.5">
            {meta.difficulty}
          </span>
        </div>
      )}
    </Link>
  );
};

export default ArticleCard;
