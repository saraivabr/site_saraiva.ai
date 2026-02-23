import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Wrench, Server, ArrowRight, Package, FileText, Brain } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useContents, type Content } from "@/hooks/useContents";
import { useMcpServers, type McpServer } from "@/hooks/useMcpServers";

const bullets = [
  "Ferramentas de IA curadas e testadas",
  "Prompts prontos para cada caso de uso",
  "MCPs e Templates para criar mais rápido",
];

const logos = ["Claude", "ChatGPT", "Midjourney", "Gemini", "Cursor", "v0"];

const categoryIcons: Record<string, typeof Sparkles> = {
  prompt: Sparkles,
  tool: Wrench,
  analysis: FileText,
  thought: Brain,
};

/* ─── Hero masonry images (Unsplash — AI, tech, criativo) ─── */
const heroImages = [
  { src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop", span: "row-span-1" },
  { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=500&fit=crop", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop", span: "row-span-1" },
  { src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=500&fit=crop", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop", span: "row-span-1" },
  { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop", span: "row-span-1" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", span: "row-span-1" },
  { src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=500&fit=crop", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", span: "row-span-1" },
];

/* ─── Content card (estilo aicreator) ─── */
const HomeContentCard = ({ content, index }: { content: Content; index: number }) => {
  const Icon = categoryIcons[content.category] ?? Sparkles;
  const isTool = content.category === "tool";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link to={`/content/${content.id}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Área de imagem */}
        <div className="relative h-44 bg-gradient-to-br from-primary/5 via-secondary to-primary/10 flex items-center justify-center overflow-hidden">
          {isTool && content.image_url ? (
            <img src={content.image_url} alt={content.title} className="w-20 h-20 object-contain rounded-xl" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary/60" />
            </div>
          )}
          {content.featured && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-primary bg-white/90 px-2 py-0.5 rounded-md">
              Destaque
            </span>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {content.title}
            </h3>
            {content.pricing && isTool && (
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                content.pricing === "Free"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : content.pricing === "Freemium"
                  ? "bg-gradient-to-r from-indigo-100 to-primary/20 text-primary border-primary/30"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {content.pricing === "Free" ? "Grátis" : content.pricing}
              </span>
            )}
          </div>

          {content.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {content.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {content.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            {isTool && content.image_url && (
              <img src={content.image_url} alt="" className="w-5 h-5 rounded object-contain opacity-60" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── Card de ferramenta (header escuro com logo, estilo aicreator) ─── */
const FeaturedToolCard = ({ content, index }: { content: Content; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link to={`/content/${content.id}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Header escuro com logo */}
        <div className="h-40 bg-gray-900 flex items-center justify-center">
          {content.image_url ? (
            <img src={content.image_url} alt={content.title} className="max-w-[140px] max-h-[60px] object-contain" />
          ) : (
            <Wrench className="w-12 h-12 text-white/40" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {content.title}
            </h3>
            {content.pricing && (
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                content.pricing === "Free"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : content.pricing === "Freemium"
                  ? "bg-gradient-to-r from-indigo-100 to-primary/20 text-primary border border-primary/30"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}>
                {content.pricing === "Free" ? "Grátis" : content.pricing}
              </span>
            )}
          </div>

          {content.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {content.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── Card de MCP (header escuro com ícone) ─── */
const HomeMcpCard = ({ server, index }: { server: McpServer; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link to={`/mcps/${server.slug}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Header escuro com ícone */}
        <div className="h-32 bg-gray-900 flex items-center justify-center">
          {server.icon_url ? (
            <img src={server.icon_url} alt={server.name} className="w-14 h-14 object-contain rounded-xl" />
          ) : (
            <span className="text-3xl font-bold text-white/60">{server.name.charAt(0)}</span>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {server.name}
            </h3>
            {server.verified && (
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verificado
              </span>
            )}
          </div>
          {server.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
              {server.description}
            </p>
          )}
          <div className="flex gap-1.5 flex-wrap">
            {server.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════ */

const Home = () => {
  const { data: tools, error: toolsError, isLoading: toolsLoading } = useContents("tool");
  const { data: prompts, error: promptsError, isLoading: promptsLoading } = useContents("prompt");
  const { data: mcps, error: mcpsError, isLoading: mcpsLoading } = useMcpServers();

  const latestTools = tools?.slice(0, 4) ?? [];
  const latestPrompts = prompts?.slice(0, 4) ?? [];
  const latestMcps = mcps?.slice(0, 4) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>

        {/* ─── HERO ─── */}
        <section className="pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left: Copy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary font-medium mb-8 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  1000+ recursos de IA curados
                </motion.div>

                <h1 className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold text-foreground leading-[1.02] tracking-tight mb-6">
                  Tudo para{" "}
                  <span className="gradient-text">criar com IA</span>
                  <br />
                  em um só lugar
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
                  Ferramentas, prompts, MCPs e templates — curado para quem cria com inteligência artificial.
                </p>

                {/* Bullet points with better styling */}
                <ul className="space-y-4 mb-10">
                  {bullets.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 text-[15px] text-foreground/80"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-white font-semibold text-[15px] hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    Explorar biblioteca
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-[15px] hover:bg-secondary hover:-translate-y-0.5 transition-all"
                  >
                    Falar comigo
                  </a>
                </motion.div>

                {/* Trust bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-14 pt-8 border-t border-border/50"
                >
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">
                    Cobrimos as principais ferramentas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {logos.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border/60 text-sm text-foreground/70 bg-white hover:border-primary/30 hover:text-primary transition-colors">
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Masonry grid with hover effects */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block relative"
              >
                {/* Decorative glow behind grid */}
                <div className="absolute -inset-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[40px] blur-3xl pointer-events-none" />

                <div className="relative grid grid-cols-3 gap-3 auto-rows-[130px]">
                  {heroImages.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                      className={`rounded-2xl overflow-hidden ${img.span} group`}
                    >
                      <img
                        src={img.src}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── "Tudo que você precisa" — 3 Feature Cards ─── */}
        <section className="py-24 px-6 md:px-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Biblioteca completa</span>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-foreground mb-4 leading-tight">
                Tudo que você precisa,{" "}
                <span className="gradient-text">em um só lugar</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                O toolkit completo de IA — descubra, copie e crie.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Wrench, value: "50+", title: "Ferramentas de IA", desc: "Testadas e curadas. De geração de texto a automação — as melhores do mercado.", gradient: "from-violet-500/10 to-indigo-500/10", iconColor: "text-violet-600", borderHover: "hover:border-violet-200" },
                { icon: Sparkles, value: "150+", title: "Prompts Prontos", desc: "Copie, cole e crie. Prompts otimizados para cada ferramenta e caso de uso.", gradient: "from-amber-500/10 to-orange-500/10", iconColor: "text-amber-600", borderHover: "hover:border-amber-200" },
                { icon: Server, value: "18+", title: "Servidores MCP", desc: "Conecte Claude, Cursor e outras ferramentas com servidores MCP verificados.", gradient: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-600", borderHover: "hover:border-emerald-200" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 ${item.borderHover}`}
                >
                  {/* Icon area */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>

                  {/* Big number */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-foreground">{item.value}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Ferramentas em Destaque ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 mb-2">Curadoria</span>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground leading-tight">
                  Ferramentas de IA{" "}
                  <span className="gradient-text">em Destaque</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  As melhores ferramentas de IA, testadas e avaliadas pela comunidade.
                </p>
              </div>
              <Link to="/ferramentas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shrink-0 group">
                Ver todas
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {toolsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="h-40 bg-secondary" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-secondary rounded w-3/4" />
                      <div className="h-3 bg-secondary rounded w-full" />
                      <div className="h-3 bg-secondary rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {toolsError && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nao foi possivel carregar as ferramentas. Tente novamente mais tarde.
              </p>
            )}

            {!toolsLoading && !toolsError && latestTools.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma ferramenta encontrada no momento.
              </p>
            )}

            {!toolsLoading && !toolsError && latestTools.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {latestTools.map((content, index) => (
                  <FeaturedToolCard key={content.id} content={content} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Ultimos Prompts ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-2">Copie e use</span>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground leading-tight">
                  Últimos Prompts{" "}
                  <span className="gradient-text">de IA</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Prompts prontos para usar — copie, cole e crie em segundos.
                </p>
              </div>
              <Link to="/prompts" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shrink-0 group">
                Ver todos
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {promptsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="h-44 bg-secondary" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-secondary rounded w-3/4" />
                      <div className="h-3 bg-secondary rounded w-full" />
                      <div className="h-3 bg-secondary rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {promptsError && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nao foi possivel carregar os prompts. Tente novamente mais tarde.
              </p>
            )}

            {!promptsLoading && !promptsError && latestPrompts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum prompt encontrado no momento.
              </p>
            )}

            {!promptsLoading && !promptsError && latestPrompts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {latestPrompts.map((content, index) => (
                  <HomeContentCard key={content.id} content={content} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Servidores MCP em Destaque ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">Integração</span>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground leading-tight">
                  Servidores MCP{" "}
                  <span className="gradient-text">em Destaque</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Conecte suas ferramentas de IA com servidores MCP verificados.
                </p>
              </div>
              <Link to="/mcps" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shrink-0 group">
                Ver todos
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {mcpsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="h-32 bg-secondary" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-secondary rounded w-3/4" />
                      <div className="h-3 bg-secondary rounded w-full" />
                      <div className="h-3 bg-secondary rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mcpsError && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nao foi possivel carregar os servidores MCP. Tente novamente mais tarde.
              </p>
            )}

            {!mcpsLoading && !mcpsError && latestMcps.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum servidor MCP encontrado no momento.
              </p>
            )}

            {!mcpsLoading && !mcpsError && latestMcps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {latestMcps.map((server, index) => (
                  <HomeMcpCard key={server.id} server={server} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, hsl(245 100% 67%), hsl(270 80% 55%), hsl(290 70% 50%))' }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative grid grid-cols-1 md:grid-cols-2">
                {/* Left: Content */}
                <div className="p-10 md:p-16 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/10"
                  >
                    <Sparkles className="w-7 h-7 text-white" />
                  </motion.div>

                  <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">Comece agora</p>

                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
                    Explore a biblioteca completa e{" "}
                    <span className="text-white/90 underline decoration-white/30 underline-offset-4">crie com IA</span>.
                  </h2>

                  <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
                    Mais de 1000 recursos curados — ferramentas, prompts, MCPs e templates. Tudo que voce precisa para criar melhor.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-all shadow-lg hover:-translate-y-0.5"
                    >
                      Explorar agora
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
                    >
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>

                {/* Right: Image grid with overlay */}
                <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-2 p-8">
                  {heroImages.slice(0, 9).map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl overflow-hidden"
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;
