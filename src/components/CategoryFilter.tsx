import type { ContentCategory } from "@/hooks/useContents";

const categories: { value: ContentCategory | "all"; label: string }[] = [
  { value: "all", label: "Tudo" },
  { value: "prompt", label: "Prompts" },
  { value: "tool", label: "Ferramentas" },
  { value: "analysis", label: "Análises" },
  { value: "thought", label: "Pensamentos" },
];

interface CategoryFilterProps {
  active: ContentCategory | "all";
  onChange: (category: ContentCategory | "all") => void;
}

const CategoryFilter = ({ active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-200 mono ${
            active === cat.value
              ? "text-primary-foreground bg-primary"
              : "text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
