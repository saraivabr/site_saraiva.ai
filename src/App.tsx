import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Sidebar from "@/components/Sidebar";
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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 md:ml-[220px] overflow-y-auto bg-surface-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/directory/:type" element={<DirectoryPage />} />
              <Route path="/directory/:type/:slug" element={<ItemDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              {/* Legacy redirects */}
              <Route path="/skills" element={<Navigate to="/directory/skills" replace />} />
              <Route path="/agents" element={<Navigate to="/directory/agents" replace />} />
              <Route path="/commands" element={<Navigate to="/directory/commands" replace />} />
              <Route path="/mcps" element={<Navigate to="/directory/mcps" replace />} />
              <Route path="/hooks" element={<Navigate to="/directory/hooks" replace />} />
              <Route path="/settings" element={<Navigate to="/directory/settings" replace />} />
              <Route path="/templates" element={<Navigate to="/directory/commands" replace />} />
              <Route path="/explore" element={<Navigate to="/directory/skills" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
