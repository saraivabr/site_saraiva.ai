import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Terminal, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Template } from "@/data/templates";
import { typeConfig, categoryLabels, formatDownloads } from "@/data/templates";

export type ViewMode = "grid" | "list" | "compact";

interface TemplateCardProps {
  template: Template;
  index: number;
  viewMode: ViewMode;
}

const TemplateCard = ({ template, index, viewMode }: TemplateCardProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[template.type];

  const copyCommand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(template.installCommand);
    setCopied(true);
    toast.success("Comando copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const CompatBadges = () => (
    <div className="flex items-center gap-1">
      {template.compatibility.claude && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary mono" title="Claude Code">C</span>
      )}
      {template.compatibility.gemini && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary mono" title="Gemini CLI">G</span>
      )}
      {template.compatibility.cursor && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary mono" title="Cursor">Cu</span>
      )}
      {template.compatibility.windsurf && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary mono" title="Windsurf">W</span>
      )}
    </div>
  );

  // ─── GRID VIEW ───
  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        layout
      >
        <Link
          to={`/templates/${template.slug}`}
          className="group block p-5 rounded-xl border border-border card-hover relative overflow-hidden h-full"
        >
          {template.featured && (
            <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-bl-lg">
              ★ Featured
            </div>
          )}

          {/* Emoji + Type badge centered */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {config.emoji}
            </div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${config.color}`}>
              {config.label}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 text-center mb-4">
            {template.description}
          </p>

          {/* Install command */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 mb-3">
            <Terminal className="w-3 h-3 text-primary shrink-0" />
            <code className="text-[10px] mono text-muted-foreground flex-1 truncate">
              {template.installCommand}
            </code>
            <button
              onClick={copyCommand}
              className="p-1 rounded hover:bg-muted transition-colors shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="mono px-2 py-0.5 rounded-md bg-secondary">{categoryLabels[template.category]}</span>
              <span className="inline-flex items-center gap-1 mono">
                <Download className="w-3 h-3" />
                {formatDownloads(template.downloads)}
              </span>
            </div>
            <CompatBadges />
          </div>
        </Link>
      </motion.div>
    );
  }

  // ─── LIST VIEW ───
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: index * 0.02 }}
        layout
      >
        <Link
          to={`/templates/${template.slug}`}
          className="group block p-5 rounded-xl border border-border card-hover relative overflow-hidden"
        >
          {template.featured && (
            <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-bl-lg">
              ★ Featured
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
              {config.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {template.name}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {template.description}
              </p>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 mb-3">
                <Terminal className="w-3 h-3 text-primary shrink-0" />
                <code className="text-[11px] mono text-muted-foreground flex-1 truncate">
                  {template.installCommand}
                </code>
                <button onClick={copyCommand} className="p-1 rounded hover:bg-muted transition-colors shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="mono px-2 py-0.5 rounded-md bg-secondary">{categoryLabels[template.category]}</span>
                <span className="inline-flex items-center gap-1 mono">
                  <Download className="w-3 h-3" />
                  {formatDownloads(template.downloads)}
                </span>
                <div className="ml-auto"><CompatBadges /></div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-3" />
          </div>
        </Link>
      </motion.div>
    );
  }

  // ─── COMPACT VIEW ───
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.015 }}
      layout
    >
      <div className="group rounded-lg border border-border overflow-hidden card-hover">
        {/* Clickable row */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-lg shrink-0">{config.emoji}</span>
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate flex-1">
            {template.name}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider ${config.color} shrink-0`}>
            {config.label}
          </span>
          <span className="text-[10px] mono text-muted-foreground shrink-0 hidden sm:inline-flex items-center gap-1">
            <Download className="w-3 h-3" />
            {formatDownloads(template.downloads)}
          </span>
          <CompatBadges />
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </motion.div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{template.description}</p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 mb-2">
                  <Terminal className="w-3 h-3 text-primary shrink-0" />
                  <code className="text-[10px] mono text-muted-foreground flex-1 truncate">
                    {template.installCommand}
                  </code>
                  <button onClick={copyCommand} className="p-1 rounded hover:bg-muted transition-colors shrink-0">
                    {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-muted-foreground px-2 py-0.5 rounded bg-secondary">
                    {categoryLabels[template.category]}
                  </span>
                  <Link
                    to={`/templates/${template.slug}`}
                    className="text-[10px] text-primary hover:underline mono"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
