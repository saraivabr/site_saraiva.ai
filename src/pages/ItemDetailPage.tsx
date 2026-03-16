import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Copy, Check, Terminal, Tag, Wrench, Key, Server, Package,
  Blocks, Settings, Webhook, Home, FileCode, ChevronRight, BookOpen,
  Cpu, Rocket, ClipboardCopy,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

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

const typeIcons: Record<string, any> = {
  skills: Blocks, agents: Package, commands: Terminal, mcps: Server, hooks: Webhook, settings: Settings,
};

const typeLabels: Record<string, string> = {
  skills: "Skills", agents: "Agents", commands: "Commands", mcps: "MCPs", hooks: "Hooks", settings: "Settings",
};

const getHowToSteps = (type: string, item: any): { title: string; description: string }[] => {
  switch (type) {
    case 'mcps':
      return [
        { title: 'Instale o servidor', description: item.install_command ? `Execute: ${item.install_command}` : 'Instale o pacote do MCP server' },
        { title: 'Configure o .mcp.json', description: 'Adicione a entrada do servidor no arquivo .mcp.json do seu projeto' },
        { title: 'Verifique a conexão', description: 'Reinicie o Claude Code e verifique se o MCP está disponível' },
      ];
    case 'skills':
      return [
        { title: 'Crie o arquivo de skill', description: 'Crie um arquivo .md em .claude/skills/ no seu projeto' },
        { title: 'Configure a skill', description: 'Adicione o conteúdo da skill com as instruções específicas' },
        { title: 'Referencie no CLAUDE.md', description: 'Opcionalmente, mencione a skill no seu CLAUDE.md para ativação automática' },
      ];
    case 'agents':
      return [
        { title: 'Crie o arquivo do agente', description: 'Crie um arquivo .md em .claude/agents/ com o nome do agente' },
        { title: 'Configure modelo e ferramentas', description: `Modelo recomendado: ${item.model || 'sonnet'}. Defina as ferramentas permitidas.` },
        { title: 'Execute o agente', description: 'Use /agent no Claude Code para invocar o agente configurado' },
      ];
    case 'commands':
      return [
        { title: 'Comando disponível', description: `Digite /${item.slug} no Claude Code para executar este comando` },
        { title: 'Personalização', description: 'Você pode passar argumentos adicionais após o comando' },
      ];
    case 'hooks':
      return [
        { title: 'Abra settings.json', description: 'Edite o arquivo .claude/settings.json do seu projeto' },
        { title: 'Adicione o hook', description: `Adicione uma entrada na seção "hooks" com o evento "${item.category || 'PostToolUse'}"` },
        { title: 'Teste o hook', description: 'Execute uma ação que dispare o evento para verificar o hook' },
      ];
    case 'settings':
      return [
        { title: 'Abra settings.json', description: 'Edite o arquivo .claude/settings.json (global ou por projeto)' },
        { title: 'Adicione a configuração', description: 'Insira a chave e valor conforme documentação' },
      ];
    default:
      return [
        { title: 'Consulte a documentação', description: 'Verifique a documentação oficial do Claude Code para mais detalhes' },
      ];
  }
};

const generateConfig = (type: string, item: any): string => {
  switch (type) {
    case 'mcps': {
      if (item.install_command) {
        const parts = item.install_command.trim().split(/\s+/);
        return JSON.stringify({ mcpServers: { [item.slug]: { command: parts[0], args: parts.slice(1) } } }, null, 2);
      }
      return JSON.stringify({ mcpServers: { [item.slug]: { command: "npx", args: [item.slug] } } }, null, 2);
    }
    case 'skills':
      return `# ${item.name}\n\n${item.description_pt || item.description || ''}\n\n<!-- Salvar em .claude/skills/${item.slug}.md -->`;
    case 'agents':
      return `---\nname: ${item.name}\nmodel: ${item.model || 'sonnet'}\n---\n\n${item.description_pt || item.description || ''}`;
    case 'hooks':
      return JSON.stringify({ hooks: { [item.category || 'PostToolUse']: [{ command: item.name }] } }, null, 2);
    case 'settings':
      return JSON.stringify({ [item.slug]: true }, null, 2);
    case 'commands':
      return `/${item.slug}`;
    default:
      return '';
  }
};

const ItemDetailPage = () => {
  const { type = "skills", slug = "" } = useParams<{ type: string; slug: string }>();
  const [copied, setCopied] = useState(false);
  const [configCopied, setConfigCopied] = useState(false);
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

  const { data: relatedItems = [] } = useQuery({
    queryKey: ["related", type, item?.category],
    queryFn: async () => {
      const res = await fetch(`/api/${type}?category=${item?.category}&limit=6`);
      if (!res.ok) return [];
      const all = await res.json() as DirectoryItem[];
      return all.filter(i => i.slug !== slug).slice(0, 4);
    },
    enabled: !!item?.category,
  });

  const copyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyConfig = (text: string) => {
    navigator.clipboard.writeText(text);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 2000);
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
          <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
            <FileCode className="w-10 h-10 text-amber-500/50" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Item não encontrado</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            O item que você está procurando não existe ou foi removido do diretório.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={`/directory/${type}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#0a0a0a] font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para {typeLabels[type] || "Diretório"}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-foreground/5 transition-colors"
            >
              <Home className="w-4 h-4" />
              Página inicial
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const howToSteps = getHowToSteps(type, item);
  const config = generateConfig(type, item);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SEOHead title={item?.name} description={description?.slice(0, 160)} path={`/directory/${type}/${slug}`} />

      {/* Dark header */}
      <section className="relative bg-[#0a0a0a] pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,204,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/40 mb-8 flex-wrap">
            <Link to="/" className="hover:text-white/70 transition-colors">Início</Link>
            <span>/</span>
            <Link to={`/directory/${type}`} className="hover:text-white/70 transition-colors">{typeLabels[type]}</Link>
            <span>/</span>
            <span className="text-white/60">{item.name}</span>
          </div>

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

      {/* Content — two-column layout */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Description card */}
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold">Descrição</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            )}

            {/* Como usar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Rocket className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Como usar</h3>
              </div>
              <div className="space-y-4">
                {howToSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Install command */}
            {item.install_command && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
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
              </motion.div>
            )}

            {/* Tools grid */}
            {item.tools && item.tools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-sky-500" />
                  <h3 className="text-sm font-semibold">Tools disponíveis</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{item.tools.length} tools</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {item.tools.map((tool: string) => (
                    <span key={tool} className="text-xs font-medium px-3 py-2 rounded-lg bg-sky-500/10 text-sky-700 text-center truncate">
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Env vars */}
            {item.env_vars && item.env_vars.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
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
              </motion.div>
            )}

            {/* Config generator */}
            {config && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-amber-500/30 bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileCode className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold">Configuração gerada</h3>
                  <button
                    onClick={() => copyConfig(config)}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    {configCopied
                      ? <><Check className="w-3 h-3" /> Copiado</>
                      : <><ClipboardCopy className="w-3 h-3" /> Copiar configuração</>
                    }
                  </button>
                </div>
                <pre className="text-sm p-4 rounded-xl bg-[#0a0a0a] text-amber-400/90 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                  {config}
                </pre>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Metadata card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informações</h3>

                {/* Type badge */}
                <div>
                  <span className="text-xs text-muted-foreground block mb-1.5">Tipo</span>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-semibold">
                    <Icon className="w-3.5 h-3.5" />
                    {typeLabels[type]}
                  </div>
                </div>

                {/* Category */}
                {item.category && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5">Categoria</span>
                    <span className="text-sm font-medium capitalize">{item.category.replace(/-/g, " ")}</span>
                  </div>
                )}

                {/* Model */}
                {item.model && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5">Modelo</span>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
                      item.model === "opus" ? "bg-violet-500/10 text-violet-600" :
                      item.model === "sonnet" ? "bg-sky-500/10 text-sky-600" :
                      "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      <Cpu className="w-3 h-3" />
                      Claude {item.model.charAt(0).toUpperCase() + item.model.slice(1)}
                    </span>
                  </div>
                )}

                {/* Deploy type */}
                {item.deploy_type && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5">Deploy</span>
                    <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-600 inline-block capitalize">
                      {item.deploy_type}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="text-[11px] px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy config button */}
                {config && (
                  <button
                    onClick={() => copyConfig(config)}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-amber-500 text-[#0a0a0a] text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {configCopied
                      ? <><Check className="w-4 h-4" /> Configuração copiada</>
                      : <><ClipboardCopy className="w-4 h-4" /> Copiar configuração</>
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related items */}
        {relatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-12"
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-amber-500" />
              Itens relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedItems.map((related: DirectoryItem) => {
                const RelIcon = typeIcons[type] || Blocks;
                const relDesc = related.description_pt || related.description || "";
                return (
                  <Link
                    key={related.slug}
                    to={`/directory/${type}/${related.slug}`}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-md bg-amber-400/15 flex items-center justify-center">
                        <RelIcon className="w-3 h-3 text-amber-500" />
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{related.category?.replace(/-/g, " ")}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-amber-600 transition-colors truncate">
                      {related.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {relDesc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetailPage;
