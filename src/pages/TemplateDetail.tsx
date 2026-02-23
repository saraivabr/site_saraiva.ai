import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Download, Terminal, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  templates,
  typeConfig,
  categoryLabels,
  formatDownloads,
} from "@/data/templates";

const TemplateDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const template = templates.find((t) => t.slug === slug);

  const copyCommand = () => {
    if (template) {
      navigator.clipboard.writeText(template.installCommand);
      setCopied(true);
      toast.success("Comando copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 px-6 md:px-12 text-center">
          <p className="text-muted-foreground">Template não encontrado.</p>
          <Link to="/templates" className="text-primary underline mt-4 inline-block">Voltar</Link>
        </main>
      </div>
    );
  }

  const config = typeConfig[template.type];

  // Generate commands for other models
  const geminiCmd = `# Copie o conteúdo do skill para GEMINI.md na raiz do seu projeto
# O Gemini CLI lerá automaticamente o arquivo como instruções`;
  const cursorCmd = `# Copie o conteúdo do skill para .cursor/rules/${template.slug}.md
# O Cursor lerá automaticamente como regra do projeto`;
  const windsurfCmd = `# Adicione o conteúdo ao arquivo .windsurfrules na raiz
# O Windsurf usará como instruções do projeto`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/templates" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Voltar aos Templates
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center text-3xl shrink-0">
                {config.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{template.name}</h1>
                  <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                {template.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">★ Featured</span>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{template.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 mono text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                <Download className="w-3.5 h-3.5 text-primary" />
                {formatDownloads(template.downloads)} downloads
              </span>
              <span className="inline-flex items-center gap-1.5 mono text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                {categoryLabels[template.category]}
              </span>
            </div>
          </motion.div>

          {/* Install — Claude Code */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
              Instalação — Claude Code
            </h2>
            <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary border border-border">
              <Terminal className="w-4 h-4 text-primary shrink-0" />
              <code className="text-sm text-foreground mono flex-1 overflow-x-auto">
                {template.installCommand}
              </code>
              <button onClick={copyCommand} className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Compatibility */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
              Compatibilidade Multi-Modelo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { name: "Claude Code", ok: template.compatibility.claude, desc: "Instalação nativa via npx" },
                { name: "Gemini CLI", ok: template.compatibility.gemini, desc: "Copiar para GEMINI.md" },
                { name: "Cursor", ok: template.compatibility.cursor, desc: "Copiar para .cursor/rules/" },
                { name: "Windsurf", ok: template.compatibility.windsurf, desc: "Copiar para .windsurfrules" },
              ].map((m) => (
                <div
                  key={m.name}
                  className={`p-3 rounded-lg border ${
                    m.ok ? "bg-primary/5 border-primary/20" : "bg-secondary border-border opacity-50"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {m.ok ? m.desc : "Não compatível"}
                  </p>
                  <span className="text-lg mt-1 block">{m.ok ? "✅" : "❌"}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Other model instructions */}
          {template.compatibility.gemini && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
                Para Gemini CLI
              </h2>
              <pre className="p-4 rounded-xl bg-secondary border border-border text-xs mono text-muted-foreground whitespace-pre-wrap">
                {geminiCmd}
              </pre>
            </motion.div>
          )}

          {template.compatibility.cursor && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
                Para Cursor
              </h2>
              <pre className="p-4 rounded-xl bg-secondary border border-border text-xs mono text-muted-foreground whitespace-pre-wrap">
                {cursorCmd}
              </pre>
            </motion.div>
          )}

          {template.compatibility.windsurf && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3 mono">
                Para Windsurf
              </h2>
              <pre className="p-4 rounded-xl bg-secondary border border-border text-xs mono text-muted-foreground whitespace-pre-wrap">
                {windsurfCmd}
              </pre>
            </motion.div>
          )}

          {/* Source link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <a
              href="https://www.aitmpl.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Fonte: aitmpl.com
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateDetail;
