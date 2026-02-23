import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Wrench, BarChart3, Brain, Calendar, ExternalLink, Star, Tag, DollarSign, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { preprocessMarkdown } from "@/lib/preprocessMarkdown";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useContent, useContents } from "@/hooks/useContents";
import ContentCard from "@/components/ContentCard";

const categoryConfig = {
  prompt: { icon: Sparkles, label: "Prompt", color: "text-amber-600", bg: "bg-amber-100" },
  tool: { icon: Wrench, label: "Ferramenta", color: "text-primary", bg: "bg-primary/10" },
  analysis: { icon: BarChart3, label: "Análise", color: "text-blue-600", bg: "bg-blue-100" },
  thought: { icon: Brain, label: "Pensamento", color: "text-purple-600", bg: "bg-purple-100" },
};

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: content, isLoading } = useContent(id || "");
  const { data: relatedContents } = useContents(content?.category);

  const related = relatedContents?.filter(c => c.id !== id).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="min-h-screen pt-32 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 w-32 bg-secondary animate-pulse rounded-lg mb-8" />
            <div className="h-16 bg-secondary animate-pulse rounded-lg mb-6" />
            <div className="space-y-4">
              <div className="h-64 bg-secondary animate-pulse rounded-xl" />
              <div className="h-48 bg-secondary animate-pulse rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="min-h-screen pt-32 px-6 md:px-12 text-center">
          <p className="text-muted-foreground">Conteúdo não encontrado.</p>
          <Link to="/" className="text-primary underline mt-4 inline-block">Voltar</Link>
        </main>
      </div>
    );
  }

  const config = categoryConfig[content.category];
  const Icon = config.icon;
  const date = new Date(content.created_at).toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric"
  });

  const isTool = content.category === "tool";
  const imageUrl = content.image_url;
  const websiteUrl = content.website_url;
  const pricing = content.pricing;

  if (isTool) {
    return <ToolDetailLayout content={content} config={config} Icon={Icon} date={date} imageUrl={imageUrl} websiteUrl={websiteUrl} pricing={pricing} related={related} />;
  }

  // Default layout for non-tool content
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-screen py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-4 mb-5">
            <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] ${config.color} mono`}>
              <Icon className="w-4 h-4" />
              {config.label}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mono">
              <Calendar className="w-3 h-3" />
              {date}
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
            {content.title}
          </motion.h1>

          {content.description && (
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {content.description}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} className="flex gap-2 flex-wrap mb-10 pb-10 border-b border-border">
            {content.tags?.map((tag) => (
              <span key={tag} className="mono text-[10px] font-medium px-3 py-1 rounded-md bg-secondary text-muted-foreground">{tag}</span>
            ))}
          </motion.div>

          {content.body && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground prose-th:border-border prose-td:border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preprocessMarkdown(content.body)}</ReactMarkdown>
            </motion.div>
          )}

          {related.length > 0 && (
            <div className="mt-20 pt-10 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Conteúdos Relacionados</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {related.map((r, i) => <ContentCard key={r.id} content={r} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// ─── TOOL DETAIL PREMIUM LAYOUT ────────────────────────────────────

interface ToolDetailProps {
  content: any;
  config: any;
  Icon: any;
  date: string;
  imageUrl?: string;
  websiteUrl?: string;
  pricing?: string;
  related: any[];
}

const ToolDetailLayout = ({ content, config, Icon, date, imageUrl, websiteUrl, pricing, related }: ToolDetailProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-screen pt-24 pb-16">
        {/* Back nav */}
        <div className="px-6 md:px-12 mb-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Link to="/ferramentas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Ferramentas
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="px-6 md:px-12 mb-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border p-8 md:p-12"
              style={{ background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--secondary)) 100%)' }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Logo */}
                <div className="shrink-0">
                  {imageUrl ? (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-border bg-background flex items-center justify-center">
                      <img src={imageUrl} alt={content.title} className="w-full h-full object-contain p-2" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-border bg-background flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${config.color} mono px-2.5 py-1 rounded-md ${config.bg}`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                    {content.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 mono px-2.5 py-1 rounded-md bg-amber-100">
                        <Star className="w-3 h-3" />
                        Destaque
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {date}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                    {content.title}
                  </h1>

                  {content.description && (
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                      {content.description}
                    </p>
                  )}

                  {/* Action row */}
                  <div className="flex flex-wrap items-center gap-3">
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        <Globe className="w-4 h-4" />
                        Visitar Ferramenta
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {pricing && (
                      <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background text-sm">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Preço:</span>
                        <span className="font-semibold text-foreground">{pricing}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {content.tags && content.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  {content.tags.map((tag: string) => (
                    <span key={tag} className="mono text-[10px] font-medium px-3 py-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Body Content */}
        {content.body && (
          <section className="px-6 md:px-12 mb-16">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                {/* Main content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                    prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-strong:text-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                    prose-table:text-sm
                    prose-th:text-foreground prose-th:bg-secondary prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold
                    prose-td:text-muted-foreground prose-td:px-4 prose-td:py-3 prose-td:border-border
                    prose-tr:border-border
                    prose-ul:text-muted-foreground
                    prose-li:text-muted-foreground prose-li:marker:text-primary
                    prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:bg-secondary/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{preprocessMarkdown(content.body)}</ReactMarkdown>
                </motion.div>

                {/* Sidebar */}
                <motion.aside
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="hidden lg:block"
                >
                  <div className="sticky top-28 space-y-6">
                    {/* Quick Info Card */}
                    <div className="rounded-xl border border-border p-6 space-y-5" style={{ background: 'hsl(var(--card))' }}>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resumo Rápido</h3>

                      {imageUrl && (
                        <div className="flex justify-center">
                          <img src={imageUrl} alt={content.title} className="w-16 h-16 rounded-xl object-contain" />
                        </div>
                      )}

                      <div className="space-y-3">
                        {pricing && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Preço</span>
                            <span className="font-medium text-foreground">{pricing}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Categoria</span>
                          <span className={`font-medium ${config.color}`}>{config.label}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Publicado</span>
                          <span className="font-medium text-foreground">{date}</span>
                        </div>
                        {content.featured && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-amber-600 flex items-center gap-1"><Star className="w-3 h-3" /> Destaque</span>
                          </div>
                        )}
                      </div>

                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                          Acessar
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Tags sidebar */}
                    {content.tags && content.tags.length > 0 && (
                      <div className="rounded-xl border border-border p-6" style={{ background: 'hsl(var(--card))' }}>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {content.tags.map((tag: string) => (
                            <span key={tag} className="mono text-[10px] px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.aside>
              </div>
            </div>
          </section>
        )}

        {/* Related Tools */}
        {related.length > 0 && (
          <section className="px-6 md:px-12 py-12 border-t border-border">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">Ferramentas Relacionadas</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {related.map((r, i) => <ContentCard key={r.id} content={r} index={i} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ContentDetail;
