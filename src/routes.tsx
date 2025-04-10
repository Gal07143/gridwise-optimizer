
import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import SettingsProfile from "@/pages/settings/Profile";
import SettingsAppearance from "@/pages/settings/Appearance";
import SettingsSecurity from "@/pages/settings/Security"; 
import SettingsNotifications from "@/pages/settings/Notifications";
import SettingsAuthentication from "@/pages/settings/Authentication"; 
import Authentication from "@/pages/Authentication";
import ModbusDevices from "@/pages/modbus/ModbusDevices";
import ModbusDevice from "@/pages/modbus/ModbusDevice";
import AddModbusDevice from "@/pages/modbus/AddModbusDevice";
import Users from "@/pages/admin/Users";
import UserRoles from "@/pages/admin/UserRoles";

// Add our new pages
import DeviceManagement from "@/pages/devices/DeviceManagement";
import EnergyOptimization from "@/pages/EnergyOptimization";

// Add other imports for pages
// ...

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/settings",
        element: <Settings />,
        children: [
          {
            path: "/settings",
            element: <Navigate to="/settings/profile" replace />
          },
          {
            path: "/settings/profile",
            element: <SettingsProfile />
          },
          {
            path: "/settings/appearance",
            element: <SettingsAppearance />
          },
          {
            path: "/settings/security",
            element: <SettingsSecurity />
          },
          {
            path: "/settings/authentication",
            element: <SettingsAuthentication />
          },
          {
            path: "/settings/notifications",
            element: <SettingsNotifications />
          },
        ]
      },
      {
        path: "/auth",
        element: <Authentication />
      },
      {
        path: "/modbus-devices",
        element: <ModbusDevices />
      },
      {
        path: "/modbus-devices/:deviceId",
        element: <ModbusDevice />
      },
      {
        path: "/modbus-devices/new",
        element: <AddModbusDevice />
      },
      {
        path: "/users",
        element: <Users />
      },
      {
        path: "/user-roles",
        element: <UserRoles />
      },
      // Add new routes
      {
        path: "/devices",
        element: <DeviceManagement />
      },
      {
        path: "/energy-optimization",
        element: <EnergyOptimization />
      }
    ]
  }
]);
