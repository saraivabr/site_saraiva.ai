import { useState } from 'react';
import { Search } from 'lucide-react';

interface ContentSearchProps {
  onSearch: (query: string) => void;
}

const ContentSearch = ({ onSearch }: ContentSearchProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-6">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Buscar conteúdo..."
        className="w-full font-mono text-sm pl-10 pr-4 py-3 border border-black/10 focus:border-black/30 focus:outline-none transition-all duration-300"
        aria-label="Buscar conteúdo"
      />
    </div>
  );
};

export default ContentSearch;
