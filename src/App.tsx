import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import DirectoryPage from "./pages/DirectoryPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory/:type" element={<DirectoryPage />} />
          <Route path="/directory/:type/:slug" element={<ItemDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          {/* Legacy redirects */}
          <Route path="/mcps" element={<Navigate to="/directory/mcps" replace />} />
          <Route path="/mcps/:slug" element={<Navigate to="/directory/mcps" replace />} />
          <Route path="/templates" element={<Navigate to="/directory/commands" replace />} />
          <Route path="/explore" element={<Navigate to="/directory/skills" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
