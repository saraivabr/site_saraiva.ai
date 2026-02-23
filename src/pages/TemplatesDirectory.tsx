import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, Package, Filter, Download, Copy, LayoutGrid, List, Rows3 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TemplateCard, { type ViewMode } from "@/components/TemplateCard";
import {
  templates,
  typeConfig,
  categoryLabels,
  type TemplateType,
  type TemplateCategory,
} from "@/data/templates";

const types: { value: TemplateType | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "Todos", emoji: "📦" },
  { value: "skill", label: "Skills", emoji: "🎨" },
  { value: "agent", label: "Agents", emoji: "🤖" },
  { value: "command", label: "Commands", emoji: "⚡" },
  { value: "hook", label: "Hooks", emoji: "🪝" },
  { value: "mcp", label: "MCPs", emoji: "🔌" },
];

const allCategories = Object.entries(categoryLabels).map(([value, label]) => ({
  value: value as TemplateCategory,
  label,
}));

const TemplatesDirectory = () => {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<TemplateType | "all">("all");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (activeType !== "all" && t.type !== activeType) return false;
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.downloads - a.downloads);
  }, [search, activeType, activeCategory]);

  // Build combined install command for all filtered items
  const combinedCommand = useMemo(() => {
    if (filtered.length === 0) return "";
    const flags = filtered.map((t) => {
      const typeFlag = `--${t.type}=`;
      const path = t.installCommand.split(`--${t.type}=`)[1]?.split(" ")[0] || t.slug;
      return `${typeFlag}${path}`;
    });
    return `npx claude-code-templates@latest ${flags.join(" ")} --yes`;
  }, [filtered]);

  const copyAll = () => {
    if (combinedCommand) {
      navigator.clipboard.writeText(combinedCommand);
      toast.success(`Comando com ${filtered.length} templates copiado!`);
    }
  };

  // Categories that exist in current type filter
  const availableCategories = useMemo(() => {
    const pool = activeType === "all" ? templates : templates.filter((t) => t.type === activeType);
    const cats = new Set(pool.map((t) => t.category));
    return allCategories.filter((c) => cats.has(c.value));
  }, [activeType]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mono">
                Claude Code Templates
              </span>
            </div>
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-2">
              Templates &
            </h1>
            <h2 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl gradient-text glow-text mb-6">
              Skills
            </h2>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              Skills, agents, commands e hooks prontos para turbinar seu Claude Code.
              Copie o comando e instale em segundos.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar templates por nome ou descrição..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Type filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-1.5 mb-4"
          >
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setActiveType(t.value);
                  setActiveCategory("all");
                }}
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all mono ${
                  activeType === t.value
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap gap-1.5 mb-8"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all mono ${
                activeCategory === "all"
                  ? "text-primary-foreground bg-primary"
                  : "text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground"
              }`}
            >
              Todas categorias
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all mono ${
                  activeCategory === cat.value
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Results count + view toggle + copy all */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <p className="text-xs text-muted-foreground mono shrink-0">
              {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border">
              {([
                { mode: "grid" as ViewMode, icon: LayoutGrid, label: "Grid" },
                { mode: "list" as ViewMode, icon: List, label: "Lista" },
                { mode: "compact" as ViewMode, icon: Rows3, label: "Compacto" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {filtered.length > 1 && (
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 text-xs mono text-primary hover:text-primary/80 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar todos ({filtered.length})</span>
              </button>
            )}
          </div>

          {/* Template cards */}
          <LayoutGroup>
            {filtered.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    : viewMode === "list"
                    ? "grid gap-3 md:grid-cols-2"
                    : "flex flex-col gap-1.5"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((template, i) => (
                    <TemplateCard key={template.id} template={template} index={i} viewMode={viewMode} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum template encontrado.</p>
              </div>
            )}
          </LayoutGroup>

          {/* Combined command section */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 rounded-xl border border-border bg-secondary/30"
            >
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
                Comando Combinado — Instalar todos de uma vez
              </h3>
              <div className="p-4 rounded-lg bg-background border border-border overflow-x-auto">
                <code className="text-xs mono text-foreground whitespace-pre-wrap break-all">
                  {combinedCommand}
                </code>
              </div>
              <button
                onClick={copyAll}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copiar Comando
              </button>

              {/* Multi-model info */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Claude Code", file: ".claude/", status: "✅ Nativo" },
                  { name: "Gemini CLI", file: "GEMINI.md", status: "📋 Manual" },
                  { name: "Cursor", file: ".cursor/rules/", status: "📋 Manual" },
                  { name: "Windsurf", file: ".windsurfrules", status: "📋 Manual" },
                ].map((model) => (
                  <div key={model.name} className="p-3 rounded-lg bg-secondary border border-border">
                    <p className="text-xs font-semibold text-foreground">{model.name}</p>
                    <p className="text-[10px] mono text-muted-foreground">{model.file}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{model.status}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesDirectory;
