
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useSite } from '@/contexts/SiteContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Devices from "@/pages/Devices";
import AddDevice from "@/pages/AddDevice";
import EditDevice from "@/pages/EditDevice";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";
import SiteSettings from "@/pages/settings/SiteSettings";
import AddSite from "@/pages/settings/AddSite";
import EditSite from "@/pages/settings/EditSite";
import NotFound from "@/pages/NotFound";
import EnergyFlow from "@/pages/EnergyFlow";
import MicrogridControl from "@/pages/MicrogridControl";
import SystemStatus from "@/pages/SystemStatus";
import Reports from "@/pages/Reports";

// Create the routes configuration
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Auth />
  },
  {
    element: <ProtectedRoute>
      {/* Protected routes will be rendered as children */}
      <></>
    </ProtectedRoute>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/analytics",
        element: <Analytics />
      },
      {
        path: "/devices",
        element: <Devices />
      },
      {
        path: "/devices/add",
        element: <AddDevice />
      },
      {
        path: "/devices/:id",
        element: <EditDevice />
      },
      {
        path: "/alerts",
        element: <Alerts />
      },
      {
        path: "/reports",
        element: <Reports />
      },
      {
        path: "/energy-flow",
        element: <EnergyFlow />
      },
      {
        path: "/microgrid",
        element: <MicrogridControl />
      },
      {
        path: "/system-status",
        element: <SystemStatus />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/settings/sites",
        element: <SiteSettings />
      },
      {
        path: "/settings/sites/add",
        element: <AddSite />
      },
      {
        path: "/settings/sites/:id",
        element: <EditSite />
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
];

const App = () => {
  const { user, session } = useAuth();
  const { currentSite, setCurrentSite } = useSite();
  
  useEffect(() => {
    // No need to call checkAuth here as it's handled in AuthContext already
  }, []);
  
  useEffect(() => {
    const storedSiteId = localStorage.getItem('currentSiteId');
    if (storedSiteId && currentSite) {
      // Optimistically set the site, it will be validated in SiteContext
      setCurrentSite({
        ...currentSite,
        id: storedSiteId
      });
    }
  }, [setCurrentSite, currentSite]);
  
  const router = createBrowserRouter(routes);
  
  return <RouterProvider router={router} />;
};

export default App;
