
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            <Route path="/energy-flow" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder for now */}
            <Route path="/microgrid" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder for now */}
            <Route path="/alerts" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder for now */}
            <Route path="/reports" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder for now */}
            <Route path="/security" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> {/* Placeholder for now */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
