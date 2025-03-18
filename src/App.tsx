
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteProvider } from "@/contexts/SiteContext";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import AddDevice from "./pages/AddDevice";
import EditDevice from "./pages/EditDevice";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Notifications from "./components/ui/Notifications";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Security from "./pages/Security";

import GeneralSettings from "./pages/settings/GeneralSettings";
import UserSettings from "./pages/settings/UserSettings";
import ApiSettings from "./pages/settings/ApiSettings";
import TariffSettings from "./pages/settings/TariffSettings";
import DataExport from "./pages/settings/DataExport";
import ProcessingSettings from "./pages/settings/ProcessingSettings";
import StorageConfiguration from "./pages/settings/StorageConfiguration";
import SystemUpdates from "./pages/settings/SystemUpdates";
import BackupSettings from "./pages/settings/BackupSettings";
import UserAccounts from "./pages/settings/UserAccounts";
import RoleManagement from "./pages/settings/RoleManagement";
import Permissions from "./pages/settings/Permissions";
import Authentication from "./pages/settings/Authentication";
import Encryption from "./pages/settings/Encryption";
import AuditLogging from "./pages/settings/AuditLogging";
import ExternalServices from "./pages/settings/ExternalServices";
import NotificationServices from "./pages/settings/NotificationServices";
import AddSite from "./pages/settings/AddSite";
import EditSite from "./pages/settings/EditSite";
import OperationalThresholds from "./pages/settings/OperationalThresholds";
import OptimizationAlgorithms from "./pages/settings/OptimizationAlgorithms";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && 
            (error.message.includes('404') || error.message.includes('401'))) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 30000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

const SettingsPlaceholder = ({ title }: { title: string }) => (
  <div className="flex h-screen">
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p>This settings page is under development.</p>
      </div>
    </div>
  </div>
);

const NetworkStatusListener = () => {
  const handleOffline = () => {
    if (typeof window !== 'undefined') {
      document.dispatchEvent(new CustomEvent('app:offline'));
    }
  };

  const handleOnline = () => {
    if (typeof window !== 'undefined') {
      document.dispatchEvent(new CustomEvent('app:online'));
    }
  };

  React.useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner closeButton position="top-right" />
            <NetworkStatusListener />
            <Notifications enableRealtime={true} />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
                <Route path="/devices/add" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
                <Route path="/devices/edit/:deviceId" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
                
                {/* Site Management */}
                <Route path="/settings/sites/add" element={<ProtectedRoute><AddSite /></ProtectedRoute>} />
                <Route path="/settings/sites/edit/:id" element={<ProtectedRoute><EditSite /></ProtectedRoute>} />
                
                {/* System Settings */}
                <Route path="/settings/general" element={<ProtectedRoute><GeneralSettings /></ProtectedRoute>} />
                <Route path="/settings/updates" element={<ProtectedRoute><SystemUpdates /></ProtectedRoute>} />
                <Route path="/settings/backup" element={<ProtectedRoute><BackupSettings /></ProtectedRoute>} />
                
                {/* User Management */}
                <Route path="/settings/users" element={<ProtectedRoute><UserAccounts /></ProtectedRoute>} />
                <Route path="/settings/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
                <Route path="/settings/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
                
                {/* Security & Compliance */}
                <Route path="/settings/authentication" element={<ProtectedRoute><Authentication /></ProtectedRoute>} />
                <Route path="/settings/encryption" element={<ProtectedRoute><Encryption /></ProtectedRoute>} />
                <Route path="/settings/audit" element={<ProtectedRoute><AuditLogging /></ProtectedRoute>} />
                
                {/* Integrations */}
                <Route path="/settings/api" element={<ProtectedRoute><ApiSettings /></ProtectedRoute>} />
                <Route path="/settings/services" element={<ProtectedRoute><ExternalServices /></ProtectedRoute>} />
                <Route path="/settings/notifications" element={<ProtectedRoute><NotificationServices /></ProtectedRoute>} />
                
                {/* Data Management */}
                <Route path="/settings/storage" element={<ProtectedRoute><StorageConfiguration /></ProtectedRoute>} />
                <Route path="/settings/export" element={<ProtectedRoute><DataExport /></ProtectedRoute>} />
                <Route path="/settings/processing" element={<ProtectedRoute><ProcessingSettings /></ProtectedRoute>} />
                
                {/* Energy Settings */}
                <Route path="/settings/tariffs" element={<ProtectedRoute><TariffSettings /></ProtectedRoute>} />
                <Route path="/settings/thresholds" element={<ProtectedRoute><OperationalThresholds /></ProtectedRoute>} />
                <Route path="/settings/algorithms" element={<ProtectedRoute><OptimizationAlgorithms /></ProtectedRoute>} />
                
                {/* Additional Settings */}
                <Route path="/settings/api-keys" element={<ProtectedRoute><SettingsPlaceholder title="API Key Management" /></ProtectedRoute>} />
                <Route path="/settings/profile" element={<ProtectedRoute><SettingsPlaceholder title="User Profile" /></ProtectedRoute>} />
                <Route path="/settings/preferences" element={<ProtectedRoute><SettingsPlaceholder title="User Preferences" /></ProtectedRoute>} />
                
                <Route path="/energy-flow" element={<ProtectedRoute><SettingsPlaceholder title="Energy Flow" /></ProtectedRoute>} /> 
                <Route path="/microgrid" element={<ProtectedRoute><SettingsPlaceholder title="Microgrid Control" /></ProtectedRoute>} /> 
                <Route path="/system-status" element={<ProtectedRoute><SettingsPlaceholder title="System Status" /></ProtectedRoute>} />
                <Route path="/documentation" element={<ProtectedRoute><SettingsPlaceholder title="Documentation" /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SiteProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
