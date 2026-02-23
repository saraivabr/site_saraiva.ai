import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Server, Globe, Monitor, Zap, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import McpCard from "@/components/McpCard";
import { useMcpServers, type McpCategory, type McpDeployType } from "@/hooks/useMcpServers";

const categories: { value: McpCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "search", label: "Busca" },
  { value: "productivity", label: "Produtividade" },
  { value: "development", label: "Desenvolvimento" },
  { value: "communication", label: "Comunicação" },
  { value: "data", label: "Dados" },
  { value: "design", label: "Design" },
  { value: "ai", label: "IA" },
  { value: "storage", label: "Storage" },
  { value: "automation", label: "Automação" },
];

const deployTypes: { value: McpDeployType | "all"; label: string; icon: typeof Globe }[] = [
  { value: "all", label: "Todos", icon: Filter },
  { value: "remote", label: "Remote", icon: Globe },
  { value: "local", label: "Local", icon: Monitor },
];

const McpDirectory = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<McpCategory | "all">("all");
  const [activeDeployType, setActiveDeployType] = useState<McpDeployType | "all">("all");

  const { data: servers, isLoading } = useMcpServers({
    category: activeCategory === "all" ? undefined : activeCategory,
    deployType: activeDeployType === "all" ? undefined : activeDeployType,
    search: search || undefined,
  });

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
              <Server className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mono">
                Diretório de MCPs
              </span>
            </div>
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-2">
              Central de
            </h1>
            <h2 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl gradient-text glow-text mb-6">
              MCPs
            </h2>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              Descubra, compare e conecte MCPs curados para estender seu agente de IA. 
              Auth, credenciais e manutenção incluídos.
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
                placeholder="Buscar MCPs por nome ou descrição..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
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
            </div>

            {/* Deploy type filter */}
            <div className="flex gap-1.5 sm:ml-auto">
              {deployTypes.map((dt) => (
                <button
                  key={dt.value}
                  onClick={() => setActiveDeployType(dt.value)}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all mono ${
                    activeDeployType === dt.value
                      ? "text-primary-foreground bg-primary"
                      : "text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <dt.icon className="w-3 h-3" />
                  {dt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          {servers && (
            <p className="text-xs text-muted-foreground mono mb-6">
              {servers.length} MCP{servers.length !== 1 ? "s" : ""} encontrado{servers.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 rounded-xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : servers && servers.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {servers.map((server, i) => (
                <McpCard key={server.id} server={server} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Server className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum MCP encontrado.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default McpDirectory;
