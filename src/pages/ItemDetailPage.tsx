import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Terminal, Tag, Wrench, Key, Server, Package, Blocks, Settings, Webhook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const typeIcons: Record<string, any> = {
  skills: Blocks, agents: Package, commands: Terminal, mcps: Server, hooks: Webhook, settings: Settings,
};

const typeLabels: Record<string, string> = {
  skills: "Skills", agents: "Agents", commands: "Commands", mcps: "MCPs", hooks: "Hooks", settings: "Settings",
};

const ItemDetailPage = () => {
  const { type = "skills", slug = "" } = useParams<{ type: string; slug: string }>();
  const [copied, setCopied] = useState(false);
  const Icon = typeIcons[type] || Blocks;

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["item", type, slug],
    queryFn: async () => {
      const res = await fetch(`/api/${type}/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const copyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Choose best description
  const description = item?.description_pt &&
    !item.description_pt.startsWith("Agente de ") &&
    !item.description_pt.startsWith("Skill para ") &&
    !item.description_pt.startsWith("Comando de ")
    ? item.description_pt
    : item?.description;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 text-center px-6">
          <h1 className="text-2xl font-bold mb-4">Item não encontrado</h1>
          <Link to={`/directory/${type}`} className="text-amber-600 hover:underline">
            Voltar para {typeLabels[type] || "Diretório"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Dark header */}
      <section className="relative bg-[#0a0a0a] pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,204,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12">
          <Link
            to={`/directory/${type}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para {typeLabels[type] || "Diretório"}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-[#0a0a0a]" />
              </div>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                {typeLabels[type]}
              </span>
              <span className="text-xs text-white/20">·</span>
              <span className="text-xs text-white/40 capitalize">{item.category?.replace(/-/g, " ")}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-4">
              {item.name}
            </h1>

            <p className="text-white/50 text-base max-w-2xl leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Install command */}
          {item.install_command && (
            <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Comando de instalação</h3>
              </div>
              <div className="relative">
                <pre className="text-sm p-4 rounded-xl bg-[#0a0a0a] text-amber-400/90 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                  {item.install_command}
                </pre>
                <button
                  onClick={() => copyCommand(item.install_command)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                </button>
              </div>
            </div>
          )}

          {/* Tools */}
          {item.tools && item.tools.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-semibold">Tools disponíveis</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tools.map((tool: string) => (
                  <span key={tool} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-700">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Env vars */}
          {item.env_vars && item.env_vars.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold">Variáveis de ambiente</h3>
              </div>
              <div className="space-y-2">
                {item.env_vars.map((v: string) => (
                  <div key={v} className="text-xs font-mono px-3 py-2 rounded-lg bg-orange-500/10 text-orange-700">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model */}
          {item.model && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-3">Modelo recomendado</h3>
              <span className={`text-sm font-medium px-4 py-2 rounded-lg inline-block ${
                item.model === "opus" ? "bg-violet-500/10 text-violet-600" :
                item.model === "sonnet" ? "bg-sky-500/10 text-sky-600" :
                "bg-emerald-500/10 text-emerald-600"
              }`}>
                Claude {item.model.charAt(0).toUpperCase() + item.model.slice(1)}
              </span>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-foreground/5 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deploy type */}
          {item.deploy_type && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-3">Tipo de deploy</h3>
              <span className="text-sm font-medium px-4 py-2 rounded-lg bg-teal-500/10 text-teal-600 inline-block capitalize">
                {item.deploy_type}
              </span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetailPage;
