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
        <section className="pt-28 pb-20 px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Esquerda: texto */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground font-medium mb-8">
                  <Sparkles className="w-4 h-4 text-primary" />
                  1000+ recursos de IA curados
                </div>

                <h1 className="text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] font-bold text-foreground leading-[1.05] tracking-tight mb-6">
                  Tudo para{" "}
                  <span className="gradient-text">criar com IA</span>
                  {" "}- em um só lugar
                </h1>

                <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                  A maior coleção de ferramentas, prompts, MCPs e templates de IA. Curado para criadores.
                </p>

                <ul className="space-y-3 mb-10">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15px] text-foreground/80">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-[15px] hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                  >
                    Explorar biblioteca
                  </Link>
                  <a
                    href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-border text-foreground font-semibold text-[15px] hover:bg-secondary transition-colors"
                  >
                    Falar comigo
                  </a>
                </div>

                {/* Logos de ferramentas */}
                <div className="mt-12">
                  <p className="text-sm text-muted-foreground mb-3">
                    Cobrimos tutoriais, templates e prompts para <strong className="text-foreground">{logos.length} ferramentas</strong> e contando:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {logos.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-foreground/70 bg-white">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Direita: grid masonry com imagens reais */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="grid grid-cols-3 gap-3 auto-rows-[120px]">
                  {heroImages.map((img, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl overflow-hidden ${img.span}`}
                    >
                      <img
                        src={img.src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── "Tudo que você precisa" — 3 Cards de destaque ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-[2.5rem] font-bold text-foreground mb-3"
            >
              Tudo que você precisa, em um só lugar
            </motion.h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O Saraiva.ai te dá o toolkit completo de IA — ferramentas, prompts, MCPs e templates.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Wrench, value: "50+", title: "Ferramentas de IA", desc: "Descubra as melhores ferramentas de IA, testadas e curadas para criadores.", gradient: "from-violet-100 to-indigo-100" },
              { icon: Sparkles, value: "150+", title: "Prompts Prontos", desc: "Prompts prontos para usar em qualquer ferramenta de IA. Copie e crie.", gradient: "from-amber-50 to-orange-100" },
              { icon: Server, value: "18+", title: "Servidores MCP", desc: "Servidores MCP para conectar Claude, Cursor e outras ferramentas.", gradient: "from-emerald-50 to-teal-100" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 hover:shadow-md transition-shadow"
              >
                <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6`}>
                  <div className="text-center">
                    <item.icon className="w-10 h-10 text-primary/60 mx-auto mb-2" />
                    <span className="text-2xl font-bold text-primary">{item.value}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Ferramentas em Destaque ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground mb-2">
                  Ferramentas de IA em Destaque
                </h2>
                <p className="text-muted-foreground">
                  Explore as melhores ferramentas de IA para criadores.
                </p>
              </div>
              <Link to="/ferramentas" className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                Ver ferramentas
              </Link>
            </div>

            <div className="h-px bg-border my-6" />

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
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground mb-2">
                  Ultimos Prompts de IA
                </h2>
                <p className="text-muted-foreground">
                  Prompts prontos para usar — copie, cole e crie.
                </p>
              </div>
              <Link to="/prompts" className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                Ver prompts
              </Link>
            </div>

            <div className="h-px bg-border my-6" />

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
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-3xl md:text-[2.5rem] font-bold text-foreground mb-2">
                  Servidores MCP em Destaque
                </h2>
                <p className="text-muted-foreground">
                  Conecte suas ferramentas de IA com servidores MCP.
                </p>
              </div>
              <Link to="/mcps" className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                Ver MCPs
              </Link>
            </div>

            <div className="h-px bg-border my-6" />

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

        {/* ─── CTA Banner (gradiente roxo estilo aicreator) ─── */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(245 100% 67%), hsl(260 80% 60%))' }}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Texto esquerdo */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/70 text-sm font-medium mb-3">Comece sua jornada com IA hoje!</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
                    Explore a biblioteca completa e crie com IA.
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Ferramentas, prompts, MCPs, templates e muito mais. Tudo curado em um só lugar.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors"
                    >
                      Explorar agora
                    </Link>
                    <a
                      href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                    >
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>

                {/* Grid decorativo com imagens */}
                <div className="hidden md:grid grid-cols-4 grid-rows-3 gap-2 p-6">
                  {heroImages.slice(0, 8).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <img src={img.src} alt="" className="w-full h-full object-cover opacity-70" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;
