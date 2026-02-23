import { motion } from "framer-motion";
import {
  Megaphone, Palette, Zap, ShoppingCart, Code2, Database,
  FileText, Bot, Globe, GraduationCap, TrendingUp, GitCompare,
  Lightbulb, Briefcase, Rocket, Brain, PenTool, BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface Subcategory {
  value: string;
  label: string;
  icon: LucideIcon;
}

const allTab: Subcategory = { value: "all", label: "Tudo", icon: Globe };

const subcategoriesMap: Record<string, Subcategory[]> = {
  tool: [
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
  prompt: [
    { value: "marketing", label: "Marketing", icon: Megaphone },
    { value: "código", label: "Dev", icon: Code2 },
    { value: "conteúdo", label: "Conteúdo", icon: FileText },
    { value: "vendas", label: "Vendas", icon: ShoppingCart },
    { value: "design", label: "Design", icon: Palette },
    { value: "dados", label: "Dados", icon: Database },
    { value: "educação", label: "Educação", icon: GraduationCap },
    { value: "produtividade", label: "Produtividade", icon: Zap },
  ],
  analysis: [
    { value: "tendências", label: "Tendências", icon: TrendingUp },
    { value: "comparativo", label: "Comparativos", icon: GitCompare },
    { value: "estratégia", label: "Estratégia", icon: Lightbulb },
    { value: "mercado", label: "Mercado", icon: BarChart3 },
  ],
  thought: [
    { value: "carreira", label: "Carreira", icon: Briefcase },
    { value: "futuro", label: "Futuro", icon: Rocket },
    { value: "mindset", label: "Mindset", icon: Brain },
    { value: "produtividade", label: "Produtividade", icon: Zap },
    { value: "design", label: "Design", icon: PenTool },
  ],
};

interface SubcategoryTabsProps {
  category: string;
  active: string;
  onChange: (value: string) => void;
}

const SubcategoryTabs = ({ category, active, onChange }: SubcategoryTabsProps) => {
  const subs = subcategoriesMap[category];
  if (!subs) return null;

  const tabs = [allTab, ...subs];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(tab.value)}
            className={`
              relative flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg
              transition-all duration-200 mono uppercase tracking-wider
              ${isActive
                ? "text-primary-foreground bg-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted border border-transparent hover:border-border"
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="subcategory-active"
                className="absolute inset-0 rounded-lg bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default SubcategoryTabs;
