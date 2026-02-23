import { useState } from 'react';
import { Search, X } from 'lucide-react';

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

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative mb-6 group">
      <Search
        size={14}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity duration-300"
      />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Buscar por titulo, tag ou tema..."
        className="w-full font-mono text-xs pl-10 pr-10 py-4 bg-black/[0.02] border-0 border-b border-black/10 focus:border-black/30 focus:bg-white focus:outline-none transition-all duration-300 placeholder:opacity-30"
        aria-label="Buscar conteudo"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Limpar busca"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default ContentSearch;
