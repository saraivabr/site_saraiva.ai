import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Wrench, BarChart3, Brain } from "lucide-react";
import type { Content } from "@/hooks/useContents";

const categoryConfig = {
  prompt: { icon: Sparkles, label: "Prompt" },
  tool: { icon: Wrench, label: "Ferramenta" },
  analysis: { icon: BarChart3, label: "Análise" },
  thought: { icon: Brain, label: "Pensamento" },
};

interface ContentCardProps {
  content: Content;
  index: number;
}

const ContentCard = ({ content, index }: ContentCardProps) => {
  const config = categoryConfig[content.category];
  const Icon = config.icon;
  const imageUrl = content.image_url;
  const pricing = content.pricing;
  const isTool = content.category === "tool";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/content/${content.id}`}
        className="group block p-6 rounded-xl border border-border card-hover bg-card shadow-sm"
      >
        <div className="flex items-start gap-4">
          {/* Logo for tools */}
          {isTool && imageUrl && (
            <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border bg-background flex items-center justify-center">
              <img src={imageUrl} alt={content.title} className="w-full h-full object-contain p-1.5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mono">
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </div>
              {content.featured && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary glow-text">
                  ★ Destaque
                </span>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors duration-200">
              {content.title}
            </h3>

            {content.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {content.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap items-center">
                {pricing && isTool && (
                  <span className="mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {pricing}
                  </span>
                )}
                {content.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ContentCard;
