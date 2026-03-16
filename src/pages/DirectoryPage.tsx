import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Copy, Check, ChevronRight, Package, Blocks, Terminal, Server, Settings, Webhook, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

const typeConfig: Record<string, { title: string; subtitle: string; icon: any; color: string }> = {
  skills: { title: "Skills", subtitle: "Habilidades especializadas para Claude Code", icon: Blocks, color: "text-violet-500" },
  agents: { title: "Agents", subtitle: "Agentes autônomos para tarefas complexas", icon: Package, color: "text-blue-500" },
  commands: { title: "Commands", subtitle: "Comandos slash para fluxos de trabalho", icon: Terminal, color: "text-green-500" },
  mcps: { title: "MCPs", subtitle: "Servidores MCP para estender capacidades", icon: Server, color: "text-teal-500" },
  hooks: { title: "Hooks", subtitle: "Hooks para automação de eventos", icon: Webhook, color: "text-orange-500" },
  settings: { title: "Settings", subtitle: "Configurações otimizadas para diferentes contextos", icon: Settings, color: "text-pink-500" },
};

const DirectoryPage = () => {
  const { type = "skills" } = useParams<{ type: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [stack, setStack] = useState<DirectoryItem[]>([]);
  const [showStack, setShowStack] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(cats).sort()];
  }, [items]);

  const toggleStack = (item: DirectoryItem) => {
    setStack((prev) =>
      prev.find((s) => s.slug === item.slug)
        ? prev.filter((s) => s.slug !== item.slug)
        : [...prev, item]
    );
  };

  const isInStack = (slug: string) => stack.some((s) => s.slug === slug);

  const installCommand = useMemo(() => {
    const mcpItems = stack.filter((s) => s.install_command);
    if (mcpItems.length === 0) return "";
    // For MCPs, generate individual install commands
    return mcpItems.map((s) => s.install_command).join("\n");
  }, [stack]);

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mono">
                Diretório
              </span>
            </div>
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl gradient-text glow-text mb-4">
              {config.title}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              {config.subtitle}
            </p>
          </motion.div>

          {/* Type Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(typeConfig).map(([key, cfg]) => {
              const TypeIcon = cfg.icon;
              return (
                <Link
                  key={key}
                  to={`/directory/${key}`}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all mono ${
                    type === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <TypeIcon className="w-3 h-3" />
                  {cfg.title}
                </Link>
              );
            })}
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Buscar ${config.title.toLowerCase()}...`}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all mono ${
                      activeCategory === cat
                        ? "text-primary-foreground bg-primary"
                        : "text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "Todos" : cat.replace(/-/g, " ")}
                  </button>
                ))}
              </div>

              {/* Count */}
              <p className="text-xs text-muted-foreground mono mb-4">
                {items.length} resultado{items.length !== 1 ? "s" : ""}
              </p>

              {/* Grid */}
              {isLoading ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-secondary animate-pulse" />
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id || item.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
                      className={`group relative p-4 rounded-xl border transition-all bg-card shadow-sm ${
                        isInStack(item.slug)
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                          <span className={`text-sm font-bold ${config.color}`}>
                            {item.name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate mb-0.5">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                            {item.description_pt || item.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                              {item.category}
                            </span>
                            {item.model && (
                              <span className="text-[10px] mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                {item.model}
                              </span>
                            )}
                            {item.deploy_type && (
                              <span className="text-[10px] mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                {item.deploy_type}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStack(item)}
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isInStack(item.slug)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {isInStack(item.slug) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
                </div>
              )}
            </div>

            {/* Stack Builder Sidebar - Desktop */}
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Stack Builder</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {stack.length} item{stack.length !== 1 ? "s" : ""} selecionado{stack.length !== 1 ? "s" : ""}
                </p>

                {stack.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                      {stack.map((item) => (
                        <div
                          key={item.slug}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary text-xs"
                        >
                          <span className="flex-1 truncate font-medium text-foreground">
                            {item.name}
                          </span>
                          <button
                            onClick={() => toggleStack(item)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {installCommand && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mono mb-1.5">
                          Comando de instalação
                        </p>
                        <div className="relative">
                          <pre className="text-[11px] p-3 rounded-lg bg-secondary text-foreground overflow-x-auto whitespace-pre-wrap break-all max-h-32 mono">
                            {installCommand}
                          </pre>
                          <button
                            onClick={copyCommand}
                            className="absolute top-2 right-2 p-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setStack([])}
                      className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
                    >
                      Limpar stack
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground/60 text-center py-6">
                    Clique no + para adicionar itens ao stack
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Stack FAB */}
          {stack.length > 0 && (
            <button
              onClick={() => setShowStack(!showStack)}
              className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            >
              <span className="text-sm font-bold">{stack.length}</span>
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
