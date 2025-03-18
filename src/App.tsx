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
import Index from "./pages/Index";

const queryClient = new QueryClient();

const SettingsPlaceholder = ({ title }: { title: string }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p>This settings page is under development.</p>
        </div>
      </div>
    </div>
  );
};

const SystemStatus = () => (
  <SettingsPlaceholder title="System Status" />
);

const Documentation = () => (
  <SettingsPlaceholder title="Documentation" />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            <Route path="/settings/general" element={<ProtectedRoute><SettingsPlaceholder title="General Configuration" /></ProtectedRoute>} />
            <Route path="/settings/updates" element={<ProtectedRoute><SettingsPlaceholder title="System Updates" /></ProtectedRoute>} />
            <Route path="/settings/backup" element={<ProtectedRoute><SettingsPlaceholder title="Backup & Restore" /></ProtectedRoute>} />
            <Route path="/settings/users" element={<ProtectedRoute><SettingsPlaceholder title="User Accounts" /></ProtectedRoute>} />
            <Route path="/settings/roles" element={<ProtectedRoute><SettingsPlaceholder title="Role Management" /></ProtectedRoute>} />
            <Route path="/settings/permissions" element={<ProtectedRoute><SettingsPlaceholder title="Permissions" /></ProtectedRoute>} />
            <Route path="/settings/authentication" element={<ProtectedRoute><SettingsPlaceholder title="Authentication" /></ProtectedRoute>} />
            <Route path="/settings/encryption" element={<ProtectedRoute><SettingsPlaceholder title="Encryption" /></ProtectedRoute>} />
            <Route path="/settings/audit" element={<ProtectedRoute><SettingsPlaceholder title="Audit Logging" /></ProtectedRoute>} />
            <Route path="/settings/api" element={<ProtectedRoute><SettingsPlaceholder title="API Configuration" /></ProtectedRoute>} />
            <Route path="/settings/services" element={<ProtectedRoute><SettingsPlaceholder title="External Services" /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><SettingsPlaceholder title="Notification Services" /></ProtectedRoute>} />
            <Route path="/settings/storage" element={<ProtectedRoute><SettingsPlaceholder title="Storage Configuration" /></ProtectedRoute>} />
            <Route path="/settings/export" element={<ProtectedRoute><SettingsPlaceholder title="Data Export" /></ProtectedRoute>} />
            <Route path="/settings/processing" element={<ProtectedRoute><SettingsPlaceholder title="Processing Settings" /></ProtectedRoute>} />
            <Route path="/settings/thresholds" element={<ProtectedRoute><SettingsPlaceholder title="Operational Thresholds" /></ProtectedRoute>} />
            <Route path="/settings/algorithms" element={<ProtectedRoute><SettingsPlaceholder title="Optimization Algorithms" /></ProtectedRoute>} />
            <Route path="/settings/tariffs" element={<ProtectedRoute><SettingsPlaceholder title="Energy Tariffs" /></ProtectedRoute>} />
            <Route path="/settings/api-keys" element={<ProtectedRoute><SettingsPlaceholder title="API Key Management" /></ProtectedRoute>} />
            
            <Route path="/energy-flow" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
            <Route path="/microgrid" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
            <Route path="/alerts" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
            <Route path="/reports" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
            <Route path="/security" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/system-status" element={<ProtectedRoute><SystemStatus /></ProtectedRoute>} />
            <Route path="/documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
