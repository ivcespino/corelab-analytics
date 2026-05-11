import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { scrollToHash } from "@/lib/scrollToHash";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Tool from "./pages/Tool.tsx";
import Team from "./pages/Team.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { StubPage } from "./pages/StubPage.tsx";
import { OrientationNotice } from "./components/OrientationNotice";

const queryClient = new QueryClient();

function HashScrollWatcher() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) scrollToHash(hash);
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HashScrollWatcher />
        <OrientationNotice />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tool" element={<Tool />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
