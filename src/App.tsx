
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

import GeneralSettings from "./pages/settings/GeneralSettings";
import UserSettings from "./pages/settings/UserSettings";
import ApiSettings from "./pages/settings/ApiSettings";
import TariffSettings from "./pages/settings/TariffSettings";
import DataExport from "./pages/settings/DataExport";
import ProcessingSettings from "./pages/settings/ProcessingSettings";
import StorageConfiguration from "./pages/settings/StorageConfiguration";

const queryClient = new QueryClient();

// DataExport, ProcessingSettings and other remaining settings pages will be implemented later
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

const SystemUpdates = () => (
  <SettingsPlaceholder title="System Updates" />
);

const BackupSettings = () => (
  <SettingsPlaceholder title="Backup & Restore" />
);

const UserAccounts = () => (
  <SettingsPlaceholder title="User Accounts" />
);

const RoleManagement = () => (
  <SettingsPlaceholder title="Role Management" />
);

const Permissions = () => (
  <SettingsPlaceholder title="Permissions" />
);

const Authentication = () => (
  <SettingsPlaceholder title="Authentication" />
);

const Encryption = () => (
  <SettingsPlaceholder title="Encryption" />
);

const AuditLogging = () => (
  <SettingsPlaceholder title="Audit Logging" />
);

const ExternalServices = () => (
  <SettingsPlaceholder title="External Services" />
);

const NotificationServices = () => (
  <SettingsPlaceholder title="Notification Services" />
);

const DataExport = () => (
  <SettingsPlaceholder title="Data Export" />
);

const ProcessingSettings = () => (
  <SettingsPlaceholder title="Processing Settings" />
);

const SystemStatus = () => (
  <SettingsPlaceholder title="System Status" />
);

const Documentation = () => (
  <SettingsPlaceholder title="Documentation" />
);

const Alerts = () => (
  <SettingsPlaceholder title="System Alerts" />
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
            <Route path="/devices/add" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
            <Route path="/devices/edit/:deviceId" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            
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
            <Route path="/settings/thresholds" element={<ProtectedRoute><SettingsPlaceholder title="Operational Thresholds" /></ProtectedRoute>} />
            <Route path="/settings/algorithms" element={<ProtectedRoute><SettingsPlaceholder title="Optimization Algorithms" /></ProtectedRoute>} />
            
            {/* Additional Settings */}
            <Route path="/settings/api-keys" element={<ProtectedRoute><SettingsPlaceholder title="API Key Management" /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><SettingsPlaceholder title="User Profile" /></ProtectedRoute>} />
            <Route path="/settings/preferences" element={<ProtectedRoute><SettingsPlaceholder title="User Preferences" /></ProtectedRoute>} />
            
            <Route path="/energy-flow" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
            <Route path="/microgrid" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
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
