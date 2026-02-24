import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Wrench, FileText, Brain, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useContents, type Content } from "@/hooks/useContents";
import { useMcpServers } from "@/hooks/useMcpServers";

// Dynamic Components
import { HeroSection } from "@/components/home/HeroSection";
import { ScrollProgress } from "@/components/home/ScrollProgress";
import { LogosCarousel } from "@/components/home/LogosCarousel";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { InteractiveCard, CardsGrid } from "@/components/home/InteractiveCard";

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-purple-500/30 border-t-purple-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

// Category icons mapping
const categoryIcons: Record<string, typeof Sparkles> = {
  prompt: Sparkles,
  tool: Wrench,
  analysis: FileText,
  thought: Brain,
};

// Category gradients for cards
const categoryGradients: Record<string, string> = {
  prompt: "from-yellow-500 to-orange-500",
  tool: "from-blue-500 to-cyan-500",
  analysis: "from-purple-500 to-pink-500",
  thought: "from-green-500 to-emerald-500",
};

// Convert Supabase content to card format
function contentToCard(content: Content) {
  const Icon = categoryIcons[content.category] ?? Sparkles;
  return {
    title: content.title,
    description: content.description || "",
    icon: <Icon className="w-6 h-6" />,
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
    // Simulate initial load for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get featured and recent content
  const featuredContent = contents?.filter((c) => c.featured).slice(0, 6) || [];
  const recentContent = contents?.slice(0, 12) || [];
  const toolsContent = contents?.filter((c) => c.category === "tool").slice(0, 6) || [];

  // Convert to card format
  const showcaseCards = featuredContent.map(contentToCard);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        {/* Scroll Progress */}
        <ScrollProgress />

        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Logos Carousel */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-sm text-muted-foreground mb-8"
            >
              Cobrimos as principais ferramentas de IA
            </motion.p>
            <LogosCarousel />
          </div>
        </section>

        {/* Featured Content - Interactive Cards */}
        {showcaseCards.length > 0 && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Destaques da Biblioteca
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
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
                className="text-center mt-12"
              >
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Explorar biblioteca
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Por que usar Saraiva.AI?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Uma biblioteca curada de recursos sobre Inteligência Artificial para criadores e empreendedores
              </p>
            </motion.div>

            <FeaturesSection />
          </div>
        </section>

        {/* Recent Content Grid */}
        {recentContent.length > 0 && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-12"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Adicionados Recentemente
                  </h2>
                  <p className="text-muted-foreground">
                    {contents?.length || 0}+ recursos disponíveis
                  </p>
                </div>
                <Link
                  to="/explore"
                  className="hidden md:flex items-center gap-2 text-primary hover:underline"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentContent.map((content, index) => {
                  const card = contentToCard(content);
                  return (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
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
        )}

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para criar com IA?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Explore nossa biblioteca de ferramentas, prompts e recursos para acelerar seus projetos com Inteligência Artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Explorar Biblioteca
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-full font-semibold hover:bg-muted transition-all"
                >
                  Falar Comigo
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </motion.div>
    </>
  );
}
