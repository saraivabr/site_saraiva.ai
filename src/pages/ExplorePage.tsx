import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExploreTabBar from "@/components/explore/ExploreTabBar";
import ExploreSearch from "@/components/explore/ExploreSearch";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import ExploreCardGrid from "@/components/explore/ExploreCardGrid";
import { useExploreSearch, type ExploreTab } from "@/hooks/useExploreSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const validTabs: ExploreTab[] = ["tools", "prompts", "mcps", "templates", "analysis"];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const tabParam = searchParams.get("tab") as ExploreTab | null;
  const activeTab: ExploreTab = tabParam && validTabs.includes(tabParam) ? tabParam : "tools";
  const searchParam = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync URL
  const updateParams = useCallback(
    (tab: ExploreTab, q: string) => {
      const params = new URLSearchParams();
      if (tab !== "tools") params.set("tab", tab);
      if (q) params.set("q", q);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    updateParams(activeTab, debouncedSearch);
  }, [activeTab, debouncedSearch, updateParams]);

  const handleTabChange = (tab: ExploreTab) => {
    setSelectedCategory("all");
    setSelectedPricing("all");
    updateParams(tab, debouncedSearch);
  };

  const { results, isLoading } = useExploreSearch({
    tab: activeTab,
    search: debouncedSearch,
    category: selectedCategory,
    pricing: selectedPricing,
  });

  const sidebarContent = (
    <ExploreSidebar
      tab={activeTab}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      selectedPricing={selectedPricing}
      onPricingChange={setSelectedPricing}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero compacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Explorar
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Descubra ferramentas de IA, prompts, servidores MCP e templates — tudo em um só lugar.
            </p>
          </motion.div>

          {/* Search */}
          <div className="mb-6">
            <ExploreSearch value={search} onChange={setSearch} />
          </div>

          {/* Tabs */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <ExploreTabBar active={activeTab} onChange={handleTabChange} />

            {/* Mobile filter trigger */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {sidebarContent}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Content area */}
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            {!isMobile && (
              <div className="hidden md:block sticky top-24 self-start">
                {sidebarContent}
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 min-w-0">
              <ExploreCardGrid items={results} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExplorePage;
