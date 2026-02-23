import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Wrench, BarChart3, Server, Package } from "lucide-react";
import type { ExploreCardData } from "@/hooks/useExploreSearch";
import { typeConfig } from "@/data/templates";

function getCardProps(item: ExploreCardData) {
  switch (item.type) {
    case "content": {
      const c = item.data;
      const iconMap = { prompt: Sparkles, tool: Wrench, analysis: BarChart3, thought: BarChart3 };
      const gradientMap = {
        tool: "from-violet-100/80 to-indigo-100/80",
        prompt: "from-amber-50/80 to-orange-100/80",
        analysis: "from-slate-100/80 to-blue-100/80",
        thought: "from-slate-100/80 to-blue-100/80",
      };
      return {
        href: `/content/${c.id}`,
        title: c.title,
        description: c.description ?? "",
        imageUrl: c.image_url,
        tags: c.tags?.slice(0, 2) ?? [],
        badge: c.category === "tool" && c.pricing ? c.pricing : null,
        typeIcon: iconMap[c.category] ?? Sparkles,
        typeLabel: c.category === "tool" ? "Ferramenta" : c.category === "prompt" ? "Prompt" : "Análise",
        featured: c.featured,
        gradient: gradientMap[c.category] ?? "from-slate-100/80 to-blue-100/80",
      };
    }
    case "mcp": {
      const m = item.data;
      return {
        href: `/mcps/${m.slug}`,
        title: m.name,
        description: m.description ?? "",
        imageUrl: m.icon_url,
        tags: m.tags?.slice(0, 2) ?? [],
        badge: m.verified ? "Verified" : null,
        typeIcon: Server,
        typeLabel: "MCP Server",
        featured: m.featured,
        gradient: "from-emerald-50/80 to-teal-100/80",
      };
    }
    case "template": {
      const t = item.data;
      const config = typeConfig[t.type];
      return {
        href: `/templates/${t.slug}`,
        title: t.name,
        description: t.description,
        imageUrl: null,
        tags: [config.label, t.category].slice(0, 2),
        badge: null,
        typeIcon: Package,
        typeLabel: "Template",
        featured: t.featured ?? false,
        emoji: config.emoji,
        gradient: "from-rose-50/80 to-pink-100/80",
      };
    }
  }
}

interface ExploreCardProps {
  item: ExploreCardData;
  index: number;
}

const ExploreCard = ({ item, index }: ExploreCardProps) => {
  const props = getCardProps(item);
  const Icon = props.typeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        to={props.href}
        className="group block rounded-xl border border-border overflow-hidden card-hover bg-card shadow-sm"
      >
        {/* Image area */}
        <div className={`relative h-36 bg-gradient-to-br ${props.gradient} flex items-center justify-center overflow-hidden`}>
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt={props.title}
              className="w-16 h-16 object-contain rounded-xl"
            />
          ) : (
            <span className="text-4xl">
              {"emoji" in props && props.emoji ? props.emoji : <Icon className="w-10 h-10 text-primary/40" />}
            </span>
          )}
          {props.badge && (
            <span className="absolute top-3 right-3 mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/20 text-primary backdrop-blur-sm">
              {props.badge}
            </span>
          )}
          {props.featured && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-primary glow-text">
              ★
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            <Icon className="w-3 h-3" />
            {props.typeLabel}
          </span>
          <h3 className="text-sm font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {props.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {props.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {props.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-primary transition-colors shrink-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ExploreCard;
