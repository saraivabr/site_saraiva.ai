import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useContents, type ContentCategory } from "@/hooks/useContents";

const Library = () => {
  const [activeCategory, setActiveCategory] = useState<ContentCategory | "all">("all");
  const { data: contents, isLoading } = useContents(
    activeCategory === "all" ? undefined : activeCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-screen pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground uppercase leading-none mb-4">
              Biblioteca
            </h1>
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-accent uppercase leading-none italic mb-8">
              de IA
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Prompts, ferramentas, análises e pensamentos sobre inteligência artificial. 
              Tudo curado e organizado para você.
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-12"
          >
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </motion.div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 rounded-lg bg-secondary animate-pulse" />
              ))}
            </div>
          ) : contents && contents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {contents.map((content, index) => (
                <ContentCard key={content.id} content={content} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-16">
              Nenhum conteúdo encontrado.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Library;
