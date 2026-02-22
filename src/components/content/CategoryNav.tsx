import { Link, useParams } from 'react-router-dom';
import { CATEGORIES } from '@/types/content';

const CategoryNav = () => {
  const { category } = useParams();

  return (
    <nav className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide" aria-label="Categorias de conteudo">
      <div className="flex gap-1.5 min-w-max pb-2">
        <Link
          to="/conteudo"
          className={`font-mono text-[0.65rem] uppercase tracking-widest px-4 py-2.5 transition-all duration-300 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
            !category
              ? 'bg-accent text-accent-foreground'
              : 'bg-black/[0.03] hover:bg-black/[0.08] opacity-60 hover:opacity-100'
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={`/conteudo/${cat.id}`}
            className={`font-mono text-[0.65rem] uppercase tracking-widest px-4 py-2.5 transition-all duration-300 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              category === cat.id
                ? 'bg-accent text-accent-foreground'
                : 'bg-black/[0.03] hover:bg-black/[0.08] opacity-60 hover:opacity-100'
            }`}
          >
            {cat.icon} {cat.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
