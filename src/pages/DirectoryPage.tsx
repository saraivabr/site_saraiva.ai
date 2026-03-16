import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, X, Copy, Check, Package, Blocks, Terminal,
  Server, Settings, Webhook, ChevronLeft, ChevronRight,
  Layers, Sparkles, ArrowRight, ShoppingCart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Types ───────────────────────────────────────────────
interface DirectoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_pt: string | null;
  category: string;
  install_command?: string | null;
  deploy_type?: string;
  usage_count?: number;
  featured?: boolean;
  verified?: boolean;
  tags?: string[];
  tools?: string[];
  model?: string;
  env_vars?: string[];
}

// ─── Config ──────────────────────────────────────────────
const ITEMS_PER_PAGE = 24;

const typeConfig: Record<string, {
  title: string;
  subtitle: string;
  icon: any;
  accent: string;
  accentBg: string;
  count: string;
}> = {
  skills:   { title: "Skills",    subtitle: "Habilidades especializadas para estender o Claude Code com conhecimento e capacidades únicas", icon: Blocks,   accent: "text-amber-400",  accentBg: "bg-amber-400",  count: "672" },
  agents:   { title: "Agents",    subtitle: "Agentes autônomos que executam tarefas complexas de forma independente com diferentes modelos", icon: Package,  accent: "text-sky-400",    accentBg: "bg-sky-400",    count: "412" },
  commands: { title: "Commands",  subtitle: "Comandos slash prontos para automatizar fluxos de trabalho e acelerar o desenvolvimento",      icon: Terminal, accent: "text-emerald-400",accentBg: "bg-emerald-400",count: "283" },
  mcps:     { title: "MCPs",      subtitle: "Servidores MCP para conectar APIs externas, bancos de dados e serviços ao Claude Code",        icon: Server,   accent: "text-teal-400",   accentBg: "bg-teal-400",   count: "67"  },
  hooks:    { title: "Hooks",     subtitle: "Hooks para interceptar eventos e automatizar ações no ciclo de vida do desenvolvimento",       icon: Webhook,  accent: "text-orange-400", accentBg: "bg-orange-400", count: "51"  },
  settings: { title: "Settings",  subtitle: "Configurações otimizadas para diferentes ambientes, modelos e fluxos de trabalho",             icon: Settings, accent: "text-rose-400",   accentBg: "bg-rose-400",   count: "67"  },
};

// Generate a stable color from a string
const stringToColor = (str: string): string => {
  const colors = [
    "from-amber-500 to-orange-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-green-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-teal-500 to-cyan-600",
    "from-fuchsia-500 to-purple-600",
    "from-lime-500 to-green-600",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Clean up bad description_pt (remove "Agente de X: Name." prefix patterns)
const getDescription = (item: DirectoryItem): string => {
  const pt = item.description_pt;
  if (pt && !pt.startsWith("Agente de ") && !pt.startsWith("Skill para ") && !pt.startsWith("Comando de ")) {
    return pt;
  }
  // Fall back to English description, capped
  return item.description?.slice(0, 160) || "";
};

// ─── Component ───────────────────────────────────────────
const DirectoryPage = () => {
  const { type = "skills" } = useParams<{ type: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [stack, setStack] = useState<DirectoryItem[]>([]);
  const [stackOpen, setStackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);

  // Reset page when filters change
  const resetFilters = () => setPage(1);

  const config = typeConfig[type] || typeConfig.skills;
  const Icon = config.icon;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["directory", type, activeCategory, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (search) params.set("search", search);
      const res = await fetch(`/api/${type}?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<DirectoryItem[]>;
    },
  });

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(cats).sort()];
  }, [items]);

  // Pagination
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(
    () => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [items, page]
  );

  // Stack
  const toggleStack = (item: DirectoryItem) => {
    setStack((prev) =>
      prev.find((s) => s.slug === item.slug)
        ? prev.filter((s) => s.slug !== item.slug)
        : [...prev, item]
    );
  };
  const isInStack = (slug: string) => stack.some((s) => s.slug === slug);

  const installCommand = useMemo(() => {
    const withCmd = stack.filter((s) => s.install_command);
    if (withCmd.length === 0) return "";
    return withCmd.map((s) => s.install_command).join("\n");
  }, [stack]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ─── DARK HERO HEADER ─── */}
      <section className="relative bg-[#0a0a0a] pt-24 pb-8 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,204,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Yellow glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          {/* Type tabs */}
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(typeConfig).map(([key, cfg]) => {
              const TypeIcon = cfg.icon;
              const isActive = type === key;
              return (
                <Link
                  key={key}
                  to={`/directory/${key}`}
                  onClick={resetFilters}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#0a0a0a] shadow-lg shadow-white/10"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <TypeIcon className="w-4 h-4" />
                  {cfg.title}
                  <span className={`text-xs tabular-nums ${isActive ? "text-[#0a0a0a]/50" : "text-white/30"}`}>
                    {cfg.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Title */}
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none mb-3">
              {config.title}
              <span className={`${config.accent} ml-3`}>.</span>
            </h1>
            <p className="text-white/40 text-base max-w-xl leading-relaxed">
              {config.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Buscar entre ${items.length || "..."} ${config.title.toLowerCase()}...`}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/40 transition-all"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 capitalize ${
                    activeCategory === cat
                      ? "bg-[#0a0a0a] text-white shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {cat === "all" ? "Todos" : cat.replace(/-/g, " ")}
                </button>
              ))}
            </div>

            {/* Results count + pagination info */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-muted-foreground tabular-nums">
                {items.length} resultado{items.length !== 1 ? "s" : ""}
                {totalPages > 1 && <span className="ml-2">· Página {page} de {totalPages}</span>}
              </p>
              {stack.length > 0 && (
                <button
                  onClick={() => setStackOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-400 text-[#0a0a0a]"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Stack ({stack.length})
                </button>
              )}
            </div>

            {/* ─── GRID ─── */}
            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />
                ))}
              </div>
            ) : paginatedItems.length > 0 ? (
              <motion.div
                key={`${type}-${page}-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedItems.map((item, i) => {
                  const inStack = isInStack(item.slug);
                  const gradient = stringToColor(item.category || item.name);
                  return (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                        inStack
                          ? "border-amber-400/60 bg-amber-400/[0.03] shadow-[0_0_0_1px_rgba(255,204,0,0.15)]"
                          : "border-border bg-card hover:border-foreground/15 hover:shadow-lg hover:shadow-black/5"
                      }`}
                    >
                      {/* Top accent line */}
                      <div className={`h-0.5 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                      <div className="p-5">
                        <div className="flex items-start gap-3.5">
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                            <span className="text-white text-sm font-bold drop-shadow">
                              {item.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/directory/${type}/${item.slug}`}
                              className="text-sm font-semibold text-foreground truncate group-hover:text-amber-600 transition-colors block"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                              {getDescription(item)}
                            </p>
                          </div>

                          {/* Add button */}
                          <button
                            onClick={() => toggleStack(item)}
                            className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                              inStack
                                ? "bg-amber-400 text-[#0a0a0a] shadow-md shadow-amber-400/20"
                                : "bg-transparent border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                            }`}
                          >
                            {inStack ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Tags row */}
                        <div className="flex items-center gap-1.5 mt-3.5 flex-wrap">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-foreground/5 text-muted-foreground capitalize">
                            {item.category?.replace(/-/g, " ")}
                          </span>
                          {item.model && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              item.model === "opus" ? "bg-violet-500/10 text-violet-600" :
                              item.model === "sonnet" ? "bg-sky-500/10 text-sky-600" :
                              "bg-emerald-500/10 text-emerald-600"
                            }`}>
                              {item.model}
                            </span>
                          )}
                          {item.deploy_type && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-foreground/5 text-muted-foreground">
                              {item.deploy_type}
                            </span>
                          )}
                          {item.install_command && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700">
                              instalável
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground font-medium">Nenhum resultado encontrado</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tente ajustar os filtros ou busca</p>
              </div>
            )}

            {/* ─── PAGINATION ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                        page === pageNum
                          ? "bg-[#0a0a0a] text-white shadow-sm"
                          : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ─── STACK BUILDER SIDEBAR (Desktop) ─── */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Header */}
                <div className="bg-[#0a0a0a] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[#0a0a0a]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Stack Builder</h3>
                      <p className="text-[11px] text-white/40">
                        {stack.length === 0
                          ? "Nenhum item selecionado"
                          : `${stack.length} item${stack.length > 1 ? "s" : ""} no stack`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {stack.length > 0 ? (
                    <>
                      {/* Items list */}
                      <div className="space-y-1.5 mb-4 max-h-52 overflow-y-auto">
                        {stack.map((item) => (
                          <motion.div
                            key={item.slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-foreground/[0.03] border border-border/50 group/item"
                          >
                            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${stringToColor(item.category || item.name)} flex items-center justify-center shrink-0`}>
                              <span className="text-white text-[10px] font-bold">{item.name?.charAt(0)}</span>
                            </div>
                            <span className="flex-1 truncate text-xs font-medium text-foreground">
                              {item.name}
                            </span>
                            <button
                              onClick={() => toggleStack(item)}
                              className="text-muted-foreground/40 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Install command */}
                      {installCommand && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Comando
                            </span>
                            <button
                              onClick={copyToClipboard}
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              {copied ? <><Check className="w-3 h-3" /> Copiado!</> : <><Copy className="w-3 h-3" /> Copiar</>}
                            </button>
                          </div>
                          <pre className="text-[11px] p-3 rounded-xl bg-[#0a0a0a] text-amber-400/90 overflow-x-auto whitespace-pre-wrap break-all max-h-28 font-mono leading-relaxed">
                            {installCommand}
                          </pre>
                        </div>
                      )}

                      {/* Actions */}
                      <button
                        onClick={() => setStack([])}
                        className="w-full text-xs text-muted-foreground hover:text-red-500 transition-colors py-2 rounded-xl hover:bg-red-500/5"
                      >
                        Limpar stack
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/[0.03] border border-dashed border-border flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs text-muted-foreground/60 leading-relaxed">
                        Clique no <strong className="text-muted-foreground">+</strong> nos cards para<br />montar seu stack
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── MOBILE STACK DRAWER ─── */}
      <AnimatePresence>
        {stackOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStackOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl border-t border-border max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold">Stack Builder</h3>
                  <button onClick={() => setStackOpen(false)} className="p-2 rounded-xl hover:bg-secondary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {stack.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {stack.map((item) => (
                        <div key={item.slug} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                          <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
                          <button onClick={() => toggleStack(item)} className="text-muted-foreground hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {installCommand && (
                      <button
                        onClick={copyToClipboard}
                        className="w-full py-3 rounded-xl bg-amber-400 text-[#0a0a0a] font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar comando</>}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Stack vazio</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MOBILE FAB ─── */}
      {stack.length > 0 && !stackOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setStackOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 h-14 px-5 rounded-full bg-amber-400 text-[#0a0a0a] shadow-xl shadow-amber-400/25 flex items-center gap-2 font-bold text-sm"
        >
          <Layers className="w-4 h-4" />
          Stack ({stack.length})
        </motion.button>
      )}

      <Footer />
    </div>
  );
};

export default DirectoryPage;
