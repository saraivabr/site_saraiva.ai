import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";

interface DirectoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_pt: string | null;
  category: string;
  install_command?: string | null;
  usage_count?: number;
  tags?: string[];
  model?: string;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  skills: { label: "Skills", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)" },
  agents: { label: "Agents", color: "#3b82f6", bgColor: "rgba(59,130,246,0.08)" },
  commands: { label: "Commands", color: "#10b981", bgColor: "rgba(16,185,129,0.08)" },
  mcps: { label: "MCPs", color: "#06b6d4", bgColor: "rgba(6,182,212,0.08)" },
  hooks: { label: "Hooks", color: "#8b5cf6", bgColor: "rgba(139,92,246,0.08)" },
  settings: { label: "Settings", color: "#ec4899", bgColor: "rgba(236,72,153,0.08)" },
};

const typeIcons: Record<string, JSX.Element> = {
  skills: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  agents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M9 17h6"/></svg>,
  commands: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  mcps: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4 4 4-4"/></svg>,
  hooks: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

export default function Home() {
  const [activeType, setActiveType] = useState("skills");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("downloads");

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      return res.json() as Promise<Record<string, number>>;
    },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["home-items", activeType, search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/${activeType}?${params}`);
      return res.json() as Promise<DirectoryItem[]>;
    },
  });

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-home"],
    queryFn: async () => {
      const types = ["skills", "agents", "mcps"];
      const results = await Promise.all(
        types.map(async (t) => {
          const res = await fetch(`/api/${t}`);
          const data = await res.json();
          return data.slice(0, 1).map((i: any) => ({ ...i, _type: t }));
        })
      );
      return results.flat();
    },
  });

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(cats).sort()];
  }, [items]);

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    if (sort === "name") sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return sorted;
  }, [items, sort]);

  const paginatedItems = sortedItems.slice(0, 24);
  const cfg = typeConfig[activeType] || typeConfig.skills;
  const icon = typeIcons[activeType];

  const getDesc = (item: DirectoryItem) => item.description_pt || item.description || "";

  return (
    <>
      <SEOHead />

      {/* Sticky header with search */}
      <header className="sticky top-0 z-20 bg-surface-0/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-6 h-12">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] rounded-md text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] transition-colors w-full max-w-sm">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span>Buscar...</span>
            <kbd className="hidden sm:inline-flex ml-auto items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono border border-[var(--color-border)] rounded text-[var(--color-text-tertiary)]">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>
      </header>

      {/* Featured section */}
      {featured.length > 0 && (
        <section className="px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Destaques</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map((item: any) => {
              const tc = typeConfig[item._type];
              return (
                <Link
                  key={item.slug}
                  to={`/directory/${item._type}/${item.slug}`}
                  className="group flex items-center gap-3 p-3 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: tc?.bgColor, color: tc?.color }}
                  >
                    {item.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-tertiary)]">
                        {tc?.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-tertiary)] mt-0.5 truncate">
                      {getDesc(item)}
                    </p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Type tabs + filters */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setActiveType(key); setCategory("all"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors ${
                activeType === key
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              <span className="w-4 h-4" style={{ color: cfg.color }}>{typeIcons[key]}</span>
              {cfg.label}
              <span className="text-[11px] tabular-nums text-[var(--color-text-tertiary)]">{stats?.[key] || ""}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + filters row */}
      <div className="flex items-center gap-2 px-6 py-3">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-44 bg-white/[0.04] border-none rounded-lg text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] pl-8 pr-3 py-1.5 outline-none focus:bg-white/[0.08] focus:ring-1 focus:ring-white/10 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
        </div>
      </div>

      {/* Results count */}
      <div className="px-6 pb-2">
        <span className="text-[11px] text-[var(--color-text-tertiary)]">{items.length} resultados</span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-6 pb-6">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-[var(--color-surface-2)] animate-pulse" />
          ))
        ) : (
          paginatedItems.map((item) => (
            <Link
              key={item.slug}
              to={`/directory/${activeType}/${item.slug}`}
              className="group flex items-start gap-3 p-4 rounded-xl bg-[#111111] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-[#151515] transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
              >
                <span className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <p className="text-[12px] text-[var(--color-text-tertiary)] line-clamp-2 mt-1 leading-relaxed">
                  {getDesc(item)}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[var(--color-text-tertiary)]">
                    {item.category}
                  </span>
                  {item.usage_count != null && item.usage_count > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                      {item.usage_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
