import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Wrench, FileText, Brain, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useContents, type Content } from "@/hooks/useContents";
import { useMcpServers } from "@/hooks/useMcpServers";

import { HeroSection } from "@/components/home/HeroSection";
import { ScrollProgress } from "@/components/home/ScrollProgress";
import { LogosCarousel } from "@/components/home/LogosCarousel";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { InteractiveCard, CardsGrid } from "@/components/home/InteractiveCard";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { ContactSection } from "@/components/home/ContactSection";

const ease = [0.22, 1, 0.36, 1] as const;

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

const categoryIcons: Record<string, typeof Sparkles> = {
  prompt: Sparkles,
  tool: Wrench,
  analysis: FileText,
  thought: Brain,
};

const categoryGradients: Record<string, string> = {
  prompt: "from-amber-500 to-orange-500",
  tool: "from-blue-500 to-cyan-500",
  analysis: "from-purple-500 to-pink-500",
  thought: "from-emerald-500 to-teal-500",
};

function contentToCard(content: Content) {
  const Icon = categoryIcons[content.category] ?? Sparkles;
  return {
    title: content.title,
    description: content.description || "",
    icon: <Icon className="w-5 h-5" />,
    gradient: categoryGradients[content.category] || "from-gray-500 to-slate-500",
    link: `/content/${content.id}`,
    tags: content.tags?.slice(0, 2) || [],
    featured: content.featured,
    pricing: content.pricing,
    category: content.category,
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: contents, isLoading: contentsLoading } = useContents();
  const { data: mcpServers } = useMcpServers();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const featuredContent = contents?.filter((c) => c.featured).slice(0, 6) || [];
  const recentContent = contents?.slice(0, 12) || [];
  const showcaseCards = featuredContent.map(contentToCard);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-background"
      >
        <ScrollProgress />
        <Navigation />

        {/* Hero */}
        <HeroSection />

        {/* Logos — subtle separator */}
        <section className="py-10 border-y border-border/30">
          <div className="container mx-auto px-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-center text-xs text-muted-foreground/60 mb-6 uppercase tracking-widest"
            >
              Cobrimos as principais ferramentas de IA
            </motion.p>
            <LogosCarousel />
          </div>
        </section>

        {/* Featured Content */}
        {showcaseCards.length > 0 && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
                  Destaques da Biblioteca
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                  Conteúdo curado e atualizado diariamente sobre as melhores ferramentas e práticas de IA
                </p>
              </motion.div>

              <CardsGrid>
                {showcaseCards.map((card, index) => (
                  <Link key={index} to={card.link || "#"}>
                    <InteractiveCard
                      title={card.title}
                      description={card.description}
                      icon={card.icon}
                      gradient={card.gradient}
                    />
                  </Link>
                ))}
              </CardsGrid>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-10"
              >
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-full font-medium text-sm hover:bg-secondary/80 transition-colors"
                >
                  Explorar biblioteca
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="section-divider mx-auto max-w-xl" />

        {/* Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
                Por que usar Saraiva.AI?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                Uma biblioteca curada de recursos sobre Inteligência Artificial para criadores e empreendedores
              </p>
            </motion.div>

            <FeaturesSection />
          </div>
        </section>

        {/* Recent Content */}
        {recentContent.length > 0 && (
          <>
            <div className="section-divider mx-auto max-w-xl" />
            <section className="py-20 px-4">
              <div className="container mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease }}
                  className="flex items-center justify-between mb-10"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-display mb-1">
                      Adicionados Recentemente
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {contents?.length || 0}+ recursos disponíveis
                    </p>
                  </div>
                  <Link
                    to="/explore"
                    className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver todos
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentContent.map((content, index) => {
                    const card = contentToCard(content);
                    return (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.5, ease }}
                      >
                        <Link to={card.link || "#"}>
                          <InteractiveCard
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                            gradient={card.gradient}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Divider */}
        <div className="section-divider mx-auto max-w-xl" />

        {/* Pricing */}
        <PricingSection />

        {/* Contact */}
        <ContactSection />

        {/* Final CTA */}
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Subtle gradient mesh */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-5">
                Pronto para criar com IA?
              </h2>
              <p className="text-muted-foreground mb-8">
                Explore nossa biblioteca de ferramentas, prompts e recursos para acelerar seus projetos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/15"
                >
                  Explorar Biblioteca
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-full font-semibold hover:bg-card transition-all"
                >
                  Falar Comigo
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </motion.div>
    </>
  );
}
