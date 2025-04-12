import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Layout from '@/pages/energy-management/layout';
import EnergyManagementLayout from '@/pages/energy-management/layout';
import EnergyManagementDashboard from '@/pages/energy-management';
import AssetsPage from '@/pages/energy-management/assets';
import SignalsPage from '@/pages/energy-management/signals';
import SecuritySettings from '@/pages/settings/SecuritySettings';
import UserSettings from '@/pages/settings/UserSettings';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/dashboard';
import SiteSettings from '@/pages/settings/SiteSettings';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: '/',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: 'dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: 'sites',
                        element: <SiteSettings />
                    }
                ]
            },
            {
                path: 'energy-management',
                element: <EnergyManagementLayout />,
                children: [
                    {
                        index: true,
                        element: <EnergyManagementDashboard />
                    },
                    {
                        path: 'assets',
                        element: <AssetsPage />
                    },
                    {
                        path: 'signals',
                        element: <SignalsPage />
                    }
                ]
            },
            {
                path: 'settings',
                element: <SecuritySettings />,
                children: [
                    {
                        path: 'security',
                        element: <SecuritySettings />
                    },
                    {
                        path: 'user',
                        element: <UserSettings />
                    }
                ]
            }
        ]
    }
]); 