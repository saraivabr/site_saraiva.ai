import { Link, useParams } from 'react-router-dom';
import { CATEGORIES } from '@/types/content';

const CategoryNav = () => {
  const { category } = useParams();

  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Categorias de conteúdo">
      <Link
        to="/conteudo"
        className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all duration-300 ${
          !category
            ? 'bg-black text-white border-black'
            : 'border-black/10 hover:border-black/30'
        }`}
      >
        Todos
      </Link>
      {CATEGORIES.map(cat => (
        <Link
          key={cat.id}
          to={`/conteudo/${cat.id}`}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all duration-300 ${
            category === cat.id
              ? 'bg-black text-white border-black'
              : 'border-black/10 hover:border-black/30'
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
};

export default CategoryNav;
