import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ContentDetail from "./pages/ContentDetail";
import Conteudo from "./pages/Conteudo";
import ArticlePage from "./pages/ArticlePage";
import McpDirectory from "./pages/McpDirectory";
import McpDetail from "./pages/McpDetail";
import TemplatesDirectory from "./pages/TemplatesDirectory";
import TemplateDetail from "./pages/TemplateDetail";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/conteudo" element={<Conteudo />} />
          <Route path="/conteudo/:category/:slug" element={<ArticlePage />} />
          <Route path="/mcps" element={<McpDirectory />} />
          <Route path="/mcps/:slug" element={<McpDetail />} />
          <Route path="/templates" element={<TemplatesDirectory />} />
          <Route path="/templates/:slug" element={<TemplateDetail />} />
          <Route path="/prompts" element={<CategoryPage />} />
          <Route path="/ferramentas" element={<CategoryPage />} />
          <Route path="/analises" element={<CategoryPage />} />
          <Route path="/pensamentos" element={<CategoryPage />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
