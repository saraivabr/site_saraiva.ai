import { Search } from "lucide-react";

interface ExploreSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ExploreSearch = ({ value, onChange, placeholder = "Buscar ferramentas, prompts, MCPs..." }: ExploreSearchProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
      />
    </div>
  );
};

export default ExploreSearch;
