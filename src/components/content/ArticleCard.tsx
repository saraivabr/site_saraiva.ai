import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { ContentItem } from '@/types/content';
import { CATEGORIES } from '@/types/content';

interface ArticleCardProps {
  item: ContentItem;
  featured?: boolean;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
};

const ArticleCard = ({ item, featured = false }: ArticleCardProps) => {
  const { meta } = item;
  const catInfo = CATEGORIES.find(c => c.id === meta.category);

  const readingTime = Math.max(3, Math.ceil(item.content.split(/\s+/).length / 200));

  return (
    <Link
      to={`/conteudo/${meta.category}/${meta.slug}`}
      className={`group relative block bg-white transition-all duration-500 ease-out ${
        featured
          ? 'border border-black/10 hover:border-black/40 p-8 sm:p-10'
          : 'border border-black/[0.06] hover:border-black/20 p-6'
      }`}
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Category + Date + Reading time */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-40">
          {catInfo?.icon} {catInfo?.label}
        </span>
        <span className="opacity-10">|</span>
        <time className="font-mono text-[0.6rem] opacity-30" dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </time>
        <span className="opacity-10">|</span>
        <span className="font-mono text-[0.6rem] opacity-30">{readingTime} min</span>
      </div>

      {/* Title */}
      <h3 className={`font-black leading-[1.15] mb-3 group-hover:opacity-60 transition-opacity duration-300 ${
        featured ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
      }`} style={{ letterSpacing: '-0.01em' }}>
        {meta.title}
      </h3>

      {/* Description */}
      <p className={`font-mono opacity-45 line-clamp-2 mb-5 ${featured ? 'text-sm' : 'text-xs'}`}>
        {meta.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {meta.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="font-mono text-[0.55rem] uppercase tracking-widest bg-black/[0.04] px-2.5 py-1 group-hover:bg-black/[0.08] transition-colors duration-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta badges (rating, difficulty, pricing) */}
      {meta.category === 'ferramentas' && meta.rating && (
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/[0.06]">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < (meta.rating || 0) ? 'bg-black' : 'bg-black/10'
                }`}
              />
            ))}
          </div>
          {meta.pricing && (
            <span className="font-mono text-[0.55rem] uppercase tracking-widest opacity-40">
              {meta.pricing}
            </span>
          )}
        </div>
      )}

      {meta.category === 'tutoriais' && meta.difficulty && (
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-black/[0.06]">
          <div className="flex gap-0.5">
            {['iniciante', 'intermediario', 'avancado'].map((level, i) => (
              <div
                key={level}
                className={`w-5 h-1 ${
                  i <= ['iniciante', 'intermediario', 'avancado'].indexOf(meta.difficulty || '')
                    ? 'bg-black'
                    : 'bg-black/10'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[0.55rem] uppercase tracking-widest opacity-40">
            {DIFFICULTY_LABELS[meta.difficulty] || meta.difficulty}
          </span>
        </div>
      )}

      {/* Read arrow */}
      <ArrowUpRight
        size={14}
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0"
      />
    </Link>
  );
};

export default ArticleCard;
