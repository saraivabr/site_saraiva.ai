import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import SubcategoryTabs from "@/components/SubcategoryTabs";
import { useContents, type ContentCategory } from "@/hooks/useContents";
import { Sparkles, Wrench, BarChart3, Brain } from "lucide-react";

const categoryMeta: Record<string, { category: ContentCategory; icon: typeof Sparkles; title: string; description: string }> = {
  prompts: {
    category: "prompt",
    icon: Sparkles,
    title: "Prompts",
    description: "Prompts prontos para copiar e usar nas principais ferramentas de IA.",
  },
  ferramentas: {
    category: "tool",
    icon: Wrench,
    title: "Ferramentas",
    description: "Curadoria das melhores ferramentas de inteligência artificial do mercado.",
  },
  analises: {
    category: "analysis",
    icon: BarChart3,
    title: "Análises",
    description: "Tendências, comparativos e insights sobre o mercado de IA.",
  },
  pensamentos: {
    category: "thought",
    icon: Brain,
    title: "Pensamentos",
    description: "Reflexões, opiniões e ideias sobre o futuro da inteligência artificial.",
  },
};

const CategoryPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const meta = categoryMeta[slug || ""];
  const [activeTag, setActiveTag] = useState("all");
  const { data: contents, isLoading } = useContents(
    meta?.category,
    activeTag === "all" ? undefined : activeTag
  );

  if (!meta) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 px-6 text-center">
          <p className="text-muted-foreground">Categoria não encontrada.</p>
        </main>
      </div>
    );
  }

  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mono">
                {meta.title}
              </span>
            </div>
            <h1 className="hero-title text-5xl md:text-7xl text-foreground mb-4">
              {meta.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">{meta.description}</p>
          </motion.div>

          {/* Subcategory Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-10"
          >
            <SubcategoryTabs
              category={meta.category}
              active={activeTag}
              onChange={setActiveTag}
            />
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : contents && contents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {contents.map((content, index) => (
                <ContentCard key={content.id} content={content} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-16">Nenhum conteúdo nesta categoria ainda.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
