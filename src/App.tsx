
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/settings" element={<Settings />} />
          {/* Additional routes would be added here */}
          <Route path="/energy-flow" element={<Dashboard />} /> {/* Placeholder for now */}
          <Route path="/microgrid" element={<Dashboard />} /> {/* Placeholder for now */}
          <Route path="/alerts" element={<Dashboard />} /> {/* Placeholder for now */}
          <Route path="/reports" element={<Dashboard />} /> {/* Placeholder for now */}
          <Route path="/security" element={<Settings />} /> {/* Placeholder for now */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
