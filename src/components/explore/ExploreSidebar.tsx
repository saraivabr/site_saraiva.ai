import { motion } from "framer-motion";
import {
  Megaphone, Palette, Zap, ShoppingCart, Code2, Database,
  FileText, Bot, TrendingUp, GraduationCap, Globe,
  GitCompare, Lightbulb, BarChart3, Search, Briefcase,
  MessageSquare, HardDrive, Server, Cpu, type LucideIcon,
} from "lucide-react";
import type { ExploreTab } from "@/hooks/useExploreSearch";

interface CategoryItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

const allCategory: CategoryItem = { value: "all", label: "Tudo", icon: Globe };

const categoriesMap: Record<ExploreTab, CategoryItem[]> = {
  tools: [
    { value: "marketing", label: "Marketing", icon: Megaphone },
    { value: "design", label: "Design", icon: Palette },
    { value: "produtividade", label: "Produtividade", icon: Zap },
    { value: "vendas", label: "Vendas", icon: ShoppingCart },
    { value: "código", label: "Dev", icon: Code2 },
    { value: "dados", label: "Dados", icon: Database },
    { value: "conteúdo", label: "Conteúdo", icon: FileText },
    { value: "automação", label: "Automação", icon: Bot },
    { value: "seo", label: "SEO", icon: TrendingUp },
    { value: "social-media", label: "Social", icon: Megaphone },
  ],
  prompts: [
    { value: "copywriting", label: "Copywriting", icon: FileText },
    { value: "código", label: "Coding", icon: Code2 },
    { value: "marketing", label: "Marketing", icon: Megaphone },
    { value: "educação", label: "Educação", icon: GraduationCap },
    { value: "conteúdo", label: "Criativo", icon: Palette },
    { value: "vendas", label: "Negócios", icon: ShoppingCart },
    { value: "dados", label: "Análise", icon: Database },
    { value: "produtividade", label: "Produtividade", icon: Zap },
  ],
  mcps: [
    { value: "search", label: "Search", icon: Search },
    { value: "productivity", label: "Productivity", icon: Zap },
    { value: "development", label: "Development", icon: Code2 },
    { value: "communication", label: "Communication", icon: MessageSquare },
    { value: "data", label: "Data", icon: Database },
    { value: "design", label: "Design", icon: Palette },
    { value: "ai", label: "AI", icon: Cpu },
    { value: "storage", label: "Storage", icon: HardDrive },
    { value: "automation", label: "Automation", icon: Bot },
  ],
  templates: [
    { value: "development", label: "Desenvolvimento", icon: Code2 },
    { value: "creative-design", label: "Design Criativo", icon: Palette },
    { value: "web-development", label: "Web Dev", icon: Globe },
    { value: "document-processing", label: "Documentos", icon: FileText },
    { value: "productivity", label: "Produtividade", icon: Zap },
    { value: "enterprise-communication", label: "Enterprise", icon: MessageSquare },
    { value: "ai-research", label: "IA & Pesquisa", icon: Cpu },
    { value: "database", label: "Database", icon: Database },
  ],
  analysis: [
    { value: "tendências", label: "Tendências", icon: TrendingUp },
    { value: "comparativo", label: "Comparativo", icon: GitCompare },
    { value: "estratégia", label: "Estratégia", icon: Lightbulb },
    { value: "mercado", label: "Mercado", icon: BarChart3 },
  ],
};

const pricingOptions = [
  { value: "all", label: "Todos" },
  { value: "Free", label: "Free" },
  { value: "Freemium", label: "Freemium" },
  { value: "Paid", label: "Paid" },
];

interface ExploreSidebarProps {
  tab: ExploreTab;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPricing: string;
  onPricingChange: (p: string) => void;
}

const ExploreSidebar = ({
  tab,
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
}: ExploreSidebarProps) => {
  const categories = [allCategory, ...(categoriesMap[tab] ?? [])];

  return (
    <aside className="w-60 shrink-0 space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mono">
          Categorias
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "tools" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mono">
            Preço
          </h3>
          <div className="flex flex-col gap-1">
            {pricingOptions.map((opt) => {
              const isActive = selectedPricing === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onPricingChange(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    isActive
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </aside>
  );
};

export default ExploreSidebar;
