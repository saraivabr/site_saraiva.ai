import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";

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

interface StackEntry {
  item: DirectoryItem;
  itemType: string;
}

// ─── Config ──────────────────────────────────────────────
const ITEMS_PER_PAGE = 24;

const typeConfig: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  subtitle: string;
}> = {
  skills:   { label: "Skills",    color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)", subtitle: "Habilidades especializadas para estender o Claude Code" },
  agents:   { label: "Agents",    color: "#3b82f6", bgColor: "rgba(59,130,246,0.08)", subtitle: "Agentes autonomos para tarefas complexas" },
  commands: { label: "Commands",  color: "#10b981", bgColor: "rgba(16,185,129,0.08)", subtitle: "Comandos slash para automatizar workflows" },
  mcps:     { label: "MCPs",      color: "#06b6d4", bgColor: "rgba(6,182,212,0.08)",  subtitle: "Servidores MCP para conectar APIs e servicos" },
  hooks:    { label: "Hooks",     color: "#8b5cf6", bgColor: "rgba(139,92,246,0.08)", subtitle: "Hooks para interceptar eventos e automatizar acoes" },
  settings: { label: "Settings",  color: "#ec4899", bgColor: "rgba(236,72,153,0.08)", subtitle: "Configuracoes otimizadas para diferentes ambientes" },
};

const typeIcons: Record<string, JSX.Element> = {
  skills: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  agents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M9 17h6"/></svg>,
  commands: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  mcps: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4 4 4-4"/></svg>,
  hooks: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

// Clean up bad description_pt
const getDescription = (item: DirectoryItem): string => {
  const pt = item.description_pt;
  if (pt && !pt.startsWith("Agente de ") && !pt.startsWith("Skill para ") && !pt.startsWith("Comando de ")) {
    return pt;
  }
  return item.description?.slice(0, 160) || "";
};

// ─── Component ───────────────────────────────────────────
const DirectoryPage = () => {
  const { type = "skills" } = useParams<{ type: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("downloads");
  const [stack, setStack] = useState<StackEntry[]>([]);
  const [stackOpen, setStackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"config" | "commands">("config");
  const { isPro, isLoggedIn, login } = useAuth();
  const FREE_STACK_LIMIT = 3;

  const config = typeConfig[type] || typeConfig.skills;
  const icon = typeIcons[type];

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

  // Sorted items
  const sortedItems = useMemo(() => {
    const sorted = [...items];
    if (sort === "name") sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return sorted;
  }, [items, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(
    () => sortedItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedItems, page]
  );

  // Stack
  const toggleStack = (item: DirectoryItem, overrideType?: string) => {
    const t = overrideType || type;
    const isRemoving = stack.find((s) => s.item.slug === item.slug && s.itemType === t);
    if (isRemoving) {
      setStack((prev) => prev.filter((s) => !(s.item.slug === item.slug && s.itemType === t)));
    } else {
      // Free users limited to 3 items
      if (!isPro && stack.length >= FREE_STACK_LIMIT) {
        return; // gate will show in sidebar
      }
      setStack((prev) => [...prev, { item, itemType: t }]);
    }
  };
  const isInStack = (slug: string) => stack.some((s) => s.item.slug === slug && s.itemType === type);

  const generateStackConfig = (entries: StackEntry[]): string => {
    const grouped: Record<string, StackEntry[]> = {};
    entries.forEach((e) => {
      if (!grouped[e.itemType]) grouped[e.itemType] = [];
      grouped[e.itemType].push(e);
    });

    const sections: string[] = [];

    if (grouped.mcps) {
      const mcpConfig: Record<string, any> = {};
      grouped.mcps.forEach(({ item }) => {
        if (item.install_command) {
          const parts = item.install_command.trim().split(/\s+/);
          mcpConfig[item.slug] = { command: parts[0], args: parts.slice(1) };
        } else {
          mcpConfig[item.slug] = { command: "npx", args: [item.slug] };
        }
      });
      sections.push(`// .mcp.json\n${JSON.stringify({ mcpServers: mcpConfig }, null, 2)}`);
    }

    if (grouped.skills) {
      const lines = grouped.skills.map(({ item }) => `- ${item.name}: ${item.description_pt || item.description || ""}`);
      sections.push(`// Adicionar ao CLAUDE.md\n# Skills\n${lines.join("\n")}`);
    }

    if (grouped.agents) {
      const lines = grouped.agents.map(({ item }) => `## ${item.name}\nModelo: ${item.model || "sonnet"}\nDescricao: ${item.description_pt || item.description || ""}`);
      sections.push(`// Configuracao de Agents\n${lines.join("\n\n")}`);
    }

    if (grouped.hooks) {
      const hookConfig: Record<string, any> = {};
      grouped.hooks.forEach(({ item }) => {
        hookConfig[item.slug] = { event: item.category || "PostToolUse", command: item.name };
      });
      sections.push(`// hooks em settings.json\n${JSON.stringify({ hooks: hookConfig }, null, 2)}`);
    }

    if (grouped.settings) {
      const settingsConfig: Record<string, any> = {};
      grouped.settings.forEach(({ item }) => {
        settingsConfig[item.slug] = item.description_pt || item.description || true;
      });
      sections.push(`// settings.json\n${JSON.stringify(settingsConfig, null, 2)}`);
    }

    if (grouped.commands) {
      const lines = grouped.commands.map(({ item }) => `/${item.slug} — ${item.description_pt || item.description || ""}`);
      sections.push(`// Comandos disponiveis\n${lines.join("\n")}`);
    }

    return sections.join("\n\n---\n\n");
  };

  return (
    <>
      <SEOHead title={config.label} description={config.subtitle} path={`/directory/${type}`} />

      {/* Sticky header with search */}
      <header className="sticky top-0 z-20 bg-surface-0/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.bgColor, color: config.color }}>
              <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
            </div>
            <h1 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{config.label}</h1>
          </div>
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={`Buscar ${config.label.toLowerCase()}...`}
              className="w-56 bg-white/[0.04] border border-[var(--color-border)] rounded-md text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] pl-8 pr-3 py-1.5 outline-none focus:bg-white/[0.08] focus:ring-1 focus:ring-white/10 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex">
        {/* Left column - main content */}
        <div className="flex-1 min-w-0">
          {/* Category filter + sort row */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--color-border)]">
            <select
              value={activeCategory}
              onChange={(e) => { setActiveCategory(e.target.value); setPage(1); }}
              className="bg-white/[0.04] border-none rounded-lg text-[12px] text-[var(--color-text-secondary)] px-2.5 py-1.5 outline-none focus:bg-white/[0.08] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "all" ? "Todas categorias" : cat}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white/[0.04] border-none rounded-lg text-[12px] text-[var(--color-text-secondary)] px-2.5 py-1.5 outline-none focus:bg-white/[0.08] cursor-pointer"
              >
                <option value="downloads">Popular</option>
                <option value="name">A-Z</option>
              </select>
              {stack.length > 0 && (
                <button
                  onClick={() => setStackOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-amber-500/15 text-amber-400"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  Stack ({stack.length})
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between px-6 py-2">
            <span className="text-[11px] text-[var(--color-text-tertiary)] tabular-nums">
              {items.length} resultado{items.length !== 1 ? "s" : ""}
              {totalPages > 1 && <span className="ml-2">· Pagina {page} de {totalPages}</span>}
            </span>
          </div>

          {/* Cards grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-6 pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-[var(--color-surface-2)] animate-pulse" />
              ))
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => {
                const inStack = isInStack(item.slug);
                return (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.4) }}
                    className={`group relative flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
                      inStack
                        ? "bg-amber-500/[0.04] border border-amber-500/30"
                        : "bg-[#111111] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-[#151515]"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: config.bgColor, color: config.color }}
                    >
                      <span className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/directory/${type}/${item.slug}`}
                        className="card-glow text-[13px] font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[12px] text-[var(--color-text-tertiary)] line-clamp-2 mt-1 leading-relaxed">
                        {getDescription(item)}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[var(--color-text-tertiary)]">
                          {item.category}
                        </span>
                        {item.model && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            item.model === "opus" ? "bg-violet-500/10 text-violet-400" :
                            item.model === "sonnet" ? "bg-sky-500/10 text-sky-400" :
                            "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {item.model}
                          </span>
                        )}
                        {item.install_command && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                            instalavel
                          </span>
                        )}
                        {item.usage_count != null && item.usage_count > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                            {item.usage_count.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Add to stack button */}
                    <button
                      onClick={() => toggleStack(item)}
                      title={!isPro && stack.length >= FREE_STACK_LIMIT && !isInStack(item.slug) ? "Limite do plano free (3 itens)" : inStack ? "Remover do stack" : "Adicionar ao stack"}
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        inStack
                          ? "bg-amber-500 text-black"
                          : !isPro && stack.length >= FREE_STACK_LIMIT
                            ? "bg-transparent border border-[#2a2a2a] text-[var(--color-text-tertiary)] opacity-30 cursor-not-allowed"
                            : "bg-transparent border border-[#2a2a2a] text-[var(--color-text-tertiary)] hover:border-[#3a3a3a] hover:text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {inStack ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      )}
                    </button>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <p className="text-[13px] text-[var(--color-text-secondary)]">Nenhum resultado encontrado</p>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">Tente ajustar os filtros ou busca</p>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 px-6 pb-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
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
                    className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                      page === pageNum
                        ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)]"
                        : "border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ─── STACK BUILDER SIDEBAR (Desktop) ─── */}
        <div className="hidden lg:block w-72 shrink-0 pr-6 pt-3">
          <div className="sticky top-16">
            <div className="rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Stack Builder</h3>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">
                      {stack.length === 0
                        ? "Nenhum item selecionado"
                        : <>{stack.length}{!isPro && ` / ${FREE_STACK_LIMIT}`} item{stack.length !== 1 ? "s" : ""}</>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                {stack.length > 0 ? (
                  <>
                    {/* Items list */}
                    <div className="space-y-1 mb-3 max-h-52 overflow-y-auto">
                      {stack.map((entry) => {
                        const tc = typeConfig[entry.itemType] || typeConfig.skills;
                        return (
                          <div
                            key={`${entry.itemType}-${entry.item.slug}`}
                            className="card-glow flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-[var(--color-border)] group/item"
                          >
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold"
                              style={{ backgroundColor: tc.bgColor, color: tc.color }}
                            >
                              {entry.item.name?.charAt(0)}
                            </div>
                            <span className="flex-1 truncate text-[11px] font-medium text-[var(--color-text-primary)]">
                              {entry.item.name}
                            </span>
                            <span className="text-[9px] text-[var(--color-text-tertiary)]">
                              {entry.itemType}
                            </span>
                            <button
                              onClick={() => toggleStack(entry.item, entry.itemType)}
                              className="text-[var(--color-text-tertiary)] hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Free limit gate */}
                    {!isPro && stack.length >= FREE_STACK_LIMIT && (
                      <div className="mb-3 p-3 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/20">
                        <p className="text-[11px] font-medium text-[#5e6ad2] mb-1.5">
                          Limite do plano gratuito
                        </p>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] leading-relaxed mb-2.5">
                          O plano free permite até {FREE_STACK_LIMIT} itens no stack. Faça upgrade para Pro para stacks ilimitados + salvar na nuvem.
                        </p>
                        <Link
                          to="/pricing"
                          className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#5e6ad2] text-white hover:bg-[#4e5ac2] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Upgrade para Pro
                        </Link>
                      </div>
                    )}

                    {/* Config tabs */}
                    {(() => {
                      const configText = generateStackConfig(stack);
                      const commands = stack
                        .filter((s) => s.item.install_command)
                        .map((s) => s.item.install_command)
                        .join("\n");
                      return (
                        <div className="mb-3">
                          <div className="flex gap-1 mb-2">
                            <button
                              onClick={() => setActiveTab("config")}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                                activeTab === "config" ? "bg-amber-500/15 text-amber-400" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                              }`}
                            >
                              Configuracao
                            </button>
                            {commands && (
                              <button
                                onClick={() => setActiveTab("commands")}
                                className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                                  activeTab === "commands" ? "bg-amber-500/15 text-amber-400" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                                }`}
                              >
                                Comandos
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <pre className="text-[10px] p-3 rounded-lg bg-[#0a0a0a] text-amber-400/90 overflow-x-auto whitespace-pre-wrap break-all max-h-48 font-mono leading-relaxed">
                              {activeTab === "config" ? configText : commands}
                            </pre>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activeTab === "config" ? configText : commands);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              {copied ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Export button - Pro only */}
                    <div className="mb-3">
                      {isPro ? (
                        <button
                          onClick={() => {
                            const configText = generateStackConfig(stack);
                            const blob = new Blob([configText], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "claude-stack-config.json";
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Exportar configuração
                        </button>
                      ) : (
                        <Link
                          to="/pricing"
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-tertiary)] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                          Exportar (Pro)
                        </Link>
                      )}
                    </div>

                    {/* Clear button */}
                    <button
                      onClick={() => setStack([])}
                      className="w-full text-[11px] text-[var(--color-text-tertiary)] hover:text-red-400 transition-colors py-1.5 rounded-lg hover:bg-red-500/5"
                    >
                      Limpar stack
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-dashed border-[var(--color-border)] flex items-center justify-center mx-auto mb-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] leading-relaxed">
                      Selecione componentes para gerar<br />sua configuracao completa
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-1)] rounded-t-2xl border-t border-[var(--color-border)] max-h-[80vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Stack Builder</h3>
                  <button onClick={() => setStackOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-text-tertiary)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {stack.length > 0 ? (
                  <>
                    <div className="space-y-1.5 mb-4">
                      {stack.map((entry) => {
                        const tc = typeConfig[entry.itemType] || typeConfig.skills;
                        return (
                          <div key={`${entry.itemType}-${entry.item.slug}`} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-[var(--color-border)]">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] font-bold"
                              style={{ backgroundColor: tc.bgColor, color: tc.color }}
                            >
                              {entry.item.name?.charAt(0)}
                            </div>
                            <span className="flex-1 text-[12px] font-medium text-[var(--color-text-primary)] truncate">{entry.item.name}</span>
                            <span className="text-[10px] text-[var(--color-text-tertiary)]">{entry.itemType}</span>
                            <button onClick={() => toggleStack(entry.item, entry.itemType)} className="text-[var(--color-text-tertiary)] hover:text-red-400">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {(() => {
                      const configText = generateStackConfig(stack);
                      const commands = stack
                        .filter((s) => s.item.install_command)
                        .map((s) => s.item.install_command)
                        .join("\n");
                      return (
                        <div className="mb-4">
                          <div className="flex gap-1 mb-2">
                            <button
                              onClick={() => setActiveTab("config")}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                activeTab === "config" ? "bg-amber-500/15 text-amber-400" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                              }`}
                            >
                              Configuracao
                            </button>
                            {commands && (
                              <button
                                onClick={() => setActiveTab("commands")}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                  activeTab === "commands" ? "bg-amber-500/15 text-amber-400" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                                }`}
                              >
                                Comandos
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <pre className="text-[11px] p-3 rounded-lg bg-[#0a0a0a] text-amber-400/90 overflow-x-auto whitespace-pre-wrap break-all max-h-48 font-mono leading-relaxed">
                              {activeTab === "config" ? configText : commands}
                            </pre>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activeTab === "config" ? configText : commands);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              {copied ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <p className="text-center text-[var(--color-text-tertiary)] text-[12px] py-8">Stack vazio</p>
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
          className="lg:hidden fixed bottom-6 right-6 z-40 h-12 px-4 rounded-full bg-amber-500 text-black shadow-xl shadow-amber-500/25 flex items-center gap-2 font-semibold text-[13px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Stack ({stack.length})
        </motion.button>
      )}
    </>
  );
};

export default DirectoryPage;
