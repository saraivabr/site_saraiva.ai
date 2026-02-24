import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { trackSearch, getPopularSearches } from "@/lib/analytics";
import { useDebounce } from "@/hooks/useDebounce";

interface ExploreSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  category?: string;
}

const ExploreSearch = ({ 
  value, 
  onChange, 
  placeholder = "Buscar ferramentas, prompts, MCPs...",
  category 
}: ExploreSearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ query: string; count: number }>>([]);
  
  // Debounce search to avoid excessive queries
  const debouncedSearch = useDebounce(value, 300);

  // Track search after debounce
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 2) {
      trackSearch(debouncedSearch, category);
    }
  }, [debouncedSearch, category]);

  // Load popular searches when input is focused
  const handleFocus = () => {
    const popular = getPopularSearches(5);
    if (popular.length > 0) {
      setSuggestions(popular);
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSelectSuggestion = (query: string) => {
    onChange(query);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
      />
      
      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20">
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground px-2">Buscas populares</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.query}
                onClick={() => handleSelectSuggestion(suggestion.query)}
                className="w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors flex items-center gap-3 group"
              >
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-foreground flex-1">{suggestion.query}</span>
                <span className="text-xs text-muted-foreground">{suggestion.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSearch;
