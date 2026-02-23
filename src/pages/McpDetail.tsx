import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Monitor, Zap, CheckCircle, ExternalLink, Github, Copy, Terminal, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useMcpServer, formatUsageCount } from "@/hooks/useMcpServers";
import { toast } from "sonner";

const deployConfig = {
  remote: { icon: Globe, label: "Remote", desc: "Hospedado na nuvem, sem instalação local" },
  local: { icon: Monitor, label: "Local", desc: "Roda na sua máquina local" },
  both: { icon: Zap, label: "Remote & Local", desc: "Disponível em ambos os modos" },
};

const categoryLabels: Record<string, string> = {
  search: "Busca", productivity: "Produtividade", development: "Desenvolvimento",
  communication: "Comunicação", data: "Dados", design: "Design",
  ai: "IA", storage: "Storage", automation: "Automação", other: "Outro",
};

const McpDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: server, isLoading } = useMcpServer(slug || "");

  const copyCommand = () => {
    if (server?.install_command) {
      navigator.clipboard.writeText(server.install_command);
      toast.success("Comando copiado!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 w-32 bg-secondary animate-pulse rounded-lg mb-8" />
            <div className="h-16 bg-secondary animate-pulse rounded-lg mb-6" />
            <div className="h-64 bg-secondary animate-pulse rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 px-6 md:px-12 text-center">
          <p className="text-muted-foreground">MCP não encontrado.</p>
          <Link to="/mcps" className="text-primary underline mt-4 inline-block">Voltar</Link>
        </main>
      </div>
    );
  }

  const deploy = deployConfig[server.deploy_type];
  const DeployIcon = deploy.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/mcps" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Voltar aos MCPs
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {server.icon_url ? (
                  <img src={server.icon_url} alt={server.name} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{server.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{server.name}</h1>
                  {server.verified && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
                {server.author && (
                  <p className="text-sm text-muted-foreground mono">{server.author}</p>
                )}
              </div>
            </div>

            {server.description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{server.description}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 mono text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                <DeployIcon className="w-3.5 h-3.5 text-primary" />
                {deploy.label}
              </span>
              <span className="inline-flex items-center gap-1.5 mono text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-primary" />
                {formatUsageCount(server.usage_count)} usos
              </span>
              <span className="inline-flex items-center gap-1.5 mono text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                {categoryLabels[server.category] || server.category}
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {server.github_url && (
                <a href={server.github_url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {server.website_url && (
                <a href={server.website_url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Globe className="w-4 h-4" /> Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Install Command */}
          {server.install_command && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">Instalação</h2>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary border border-border">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <code className="text-sm text-foreground mono flex-1 overflow-x-auto">
                  {server.install_command}
                </code>
                <button onClick={copyCommand} className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0" title="Copiar">
                  <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Deploy Type Info */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">Tipo de Deploy</h2>
            <div className="p-4 rounded-xl bg-secondary border border-border">
              <div className="flex items-center gap-2 mb-1">
                <DeployIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{deploy.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{deploy.desc}</p>
            </div>
          </motion.div>

          {/* Tools */}
          {server.tools.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
                <Wrench className="w-3.5 h-3.5 inline mr-1" />
                Tools Disponíveis ({server.tools.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {server.tools.map((tool) => (
                  <div key={tool} className="px-3 py-2 rounded-lg bg-secondary border border-border">
                    <code className="text-xs mono text-foreground">{tool}</code>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {server.tags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {server.tags.map((tag) => (
                  <span key={tag} className="mono text-[11px] px-2.5 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Long Description */}
          {server.long_description && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">Sobre</h2>
              <div className="prose prose-sm max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{server.long_description}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default McpDetail;
