import { motion } from "framer-motion";
import { Wrench, Sparkles, Server, Package, BarChart3 } from "lucide-react";
import type { ExploreTab } from "@/hooks/useExploreSearch";

const tabs: { value: ExploreTab; label: string; icon: typeof Wrench }[] = [
  { value: "tools", label: "AI Tools", icon: Wrench },
  { value: "prompts", label: "Prompts", icon: Sparkles },
  { value: "mcps", label: "MCPs", icon: Server },
  { value: "templates", label: "Templates", icon: Package },
  { value: "analysis", label: "Análises", icon: BarChart3 },
];

interface ExploreTabBarProps {
  active: ExploreTab;
  onChange: (tab: ExploreTab) => void;
}

const ExploreTabBar = ({ active, onChange }: ExploreTabBarProps) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="explore-tab-active"
                className="absolute inset-0 rounded-lg bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ExploreTabBar;
