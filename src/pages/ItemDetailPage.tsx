import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  tags?: string[];
  tools?: string[];
  model?: string;
  env_vars?: string[];
}

const typeColors: Record<string, { color: string; bg: string }> = {
  skills: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  agents: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  commands: { color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  mcps: { color: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
  hooks: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  settings: { color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
};

const typeLabels: Record<string, string> = {
  skills: "Skills", agents: "Agents", commands: "Commands", mcps: "MCPs", hooks: "Hooks", settings: "Settings",
};

const typeIcons: Record<string, JSX.Element> = {
  skills: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  agents: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M9 17h6"/></svg>,
  commands: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  mcps: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4 4 4-4"/></svg>,
  hooks: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  settings: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

const getHowToSteps = (type: string, item: any): { title: string; desc: string }[] => {
  switch (type) {
    case 'mcps': return [
      { title: 'Instale o servidor', desc: item.install_command ? `Execute: ${item.install_command}` : 'Instale o pacote do MCP server' },
      { title: 'Configure o .mcp.json', desc: 'Adicione a entrada do servidor no arquivo .mcp.json do seu projeto' },
      { title: 'Verifique a conexão', desc: 'Reinicie o Claude Code e verifique se o MCP está disponível' },
    ];
    case 'skills': return [
      { title: 'Crie o arquivo de skill', desc: 'Crie um arquivo .md em .claude/skills/ no seu projeto' },
      { title: 'Configure a skill', desc: 'Adicione o conteúdo da skill com as instruções específicas' },
      { title: 'Referencie no CLAUDE.md', desc: 'Opcionalmente, mencione a skill no CLAUDE.md para ativação automática' },
    ];
    case 'agents': return [
      { title: 'Crie o arquivo do agente', desc: 'Crie um arquivo .md em .claude/agents/ com o nome do agente' },
      { title: 'Configure modelo', desc: `Modelo recomendado: ${item.model || 'sonnet'}` },
      { title: 'Execute o agente', desc: 'Use /agent no Claude Code para invocar' },
    ];
    case 'commands': return [
      { title: 'Execute o comando', desc: `Digite /${item.slug} no Claude Code` },
      { title: 'Personalize', desc: 'Passe argumentos adicionais após o comando' },
    ];
    case 'hooks': return [
      { title: 'Edite settings.json', desc: 'Abra .claude/settings.json do projeto' },
      { title: 'Adicione o hook', desc: `Adicione na seção "hooks" com evento "${item.category || 'PostToolUse'}"` },
    ];
    case 'settings': return [
      { title: 'Edite settings.json', desc: 'Abra .claude/settings.json (global ou por projeto)' },
      { title: 'Configure', desc: 'Insira a chave e valor conforme documentação' },
    ];
    default: return [{ title: 'Documentação', desc: 'Consulte a documentação oficial do Claude Code' }];
  }
};

const generateConfig = (type: string, item: any): string => {
  switch (type) {
    case 'mcps': {
      const parts = (item.install_command || `npx ${item.slug}`).trim().split(/\s+/);
      return JSON.stringify({ mcpServers: { [item.slug]: { command: parts[0], args: parts.slice(1) } } }, null, 2);
    }
    case 'skills': return `# ${item.name}\n\n${item.description_pt || item.description || ''}\n\n<!-- .claude/skills/${item.slug}.md -->`;
    case 'agents': return `---\nname: ${item.name}\nmodel: ${item.model || 'sonnet'}\n---\n\n${item.description_pt || item.description || ''}`;
    case 'hooks': return JSON.stringify({ hooks: { [item.category || 'PostToolUse']: [{ command: item.name }] } }, null, 2);
    case 'settings': return JSON.stringify({ [item.slug]: true }, null, 2);
    case 'commands': return `/${item.slug}`;
    default: return '';
  }
};

export default function ItemDetailPage() {
  const { type = "skills", slug = "" } = useParams<{ type: string; slug: string }>();
  const [copied, setCopied] = useState(false);
  const [configCopied, setConfigCopied] = useState(false);

  const tc = typeColors[type] || typeColors.skills;
  const icon = typeIcons[type];

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
      const res = await fetch(`/api/${type}?category=${item?.category}`);
      if (!res.ok) return [];
      const all = await res.json() as DirectoryItem[];
      return all.filter(i => i.slug !== slug).slice(0, 4);
    },
    enabled: !!item?.category,
  });

  const description = item?.description_pt || item?.description;
  const config = item ? generateConfig(type, item) : "";
  const steps = item ? getHowToSteps(type, item) : [];

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-[var(--color-surface-3)] border-t-[var(--color-text-tertiary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-xl bg-[var(--color-surface-2)] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Item não encontrado</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-6">O item que você procura não existe ou foi removido.</p>
        <div className="flex gap-3 justify-center">
          <Link to={`/directory/${type}`} className="px-4 py-2 rounded-md text-[13px] font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Voltar para {typeLabels[type]}
          </Link>
          <Link to="/" className="px-4 py-2 rounded-md text-[13px] font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
            Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <SEOHead title={item.name} description={description?.slice(0, 160)} path={`/directory/${type}/${slug}`} />

      {/* Back link */}
      <Link
        to={`/directory/${type}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Voltar para {typeLabels[type]}
      </Link>

      <article>
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6" style={{ backgroundColor: tc.bg, color: tc.color }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{item.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]">
                {typeLabels[type]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)]">
                {item.category}
              </span>
              {item.model && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)]">
                  {item.model}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Install command */}
        {item.install_command && (
          <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Instalar</span>
              <button
                onClick={() => copyText(item.install_command, setCopied)}
                className="text-xs text-[#5e6ad2] hover:text-[#7e88d8] transition-colors"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <code className="text-sm text-[#d57455] font-mono break-all">{item.install_command}</code>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Descrição</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
          </div>
        )}

        {/* Como usar */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Como usar</h3>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 p-3 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)] flex items-center justify-center text-[11px] font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-[13px] font-medium text-[var(--color-text-primary)] mb-0.5">{step.title}</h4>
                  <p className="text-[12px] text-[var(--color-text-tertiary)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Config generator */}
        {config && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Configuração</h3>
              <button
                onClick={() => copyText(config, setConfigCopied)}
                className="text-xs text-[#5e6ad2] hover:text-[#7e88d8] transition-colors"
              >
                {configCopied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <pre className="text-sm p-4 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[#d57455] font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {config}
            </pre>
          </div>
        )}

        {/* Tools */}
        {item.tools?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Tools ({item.tools.length})</h3>
            <div className="flex flex-wrap gap-1.5">
              {item.tools.map((tool: string) => (
                <span key={tool} className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Env vars */}
        {item.env_vars?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Variáveis de ambiente</h3>
            <div className="space-y-1.5">
              {item.env_vars.map((v: string) => (
                <div key={v} className="text-[12px] font-mono px-3 py-2 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[#d57455]">
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag: string) => (
                <span key={tag} className="text-[11px] px-2 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related items */}
      {relatedItems.length > 0 && (
        <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
          <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">Itens relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedItems.map((related: DirectoryItem) => (
              <Link
                key={related.slug}
                to={`/directory/${type}/${related.slug}`}
                className="group p-3 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] transition-all"
              >
                <h4 className="text-[13px] font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors truncate mb-1">
                  {related.name}
                </h4>
                <p className="text-[11px] text-[var(--color-text-tertiary)] line-clamp-2">
                  {related.description_pt || related.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
