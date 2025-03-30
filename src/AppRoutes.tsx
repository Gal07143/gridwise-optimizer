import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Consumption from '@/pages/Consumption';
import Production from '@/pages/Production';
import BatteryManagement from '@/pages/BatteryManagement';
import EnergyOptimization from '@/pages/EnergyOptimization';
import WeatherForecast from '@/pages/WeatherForecast';
import NotFound from '@/pages/NotFound';

// Auth pages
import Auth from '@/pages/Auth';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={
        user ? <Navigate to="/" replace /> : <Auth />
      } />
      
      {/* Redirect root to dashboard if logged in */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
      } />

      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Energy management routes */}
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/consumption" element={
        <ProtectedRoute>
          <Consumption />
        </ProtectedRoute>
      } />
      <Route path="/production" element={
        <ProtectedRoute>
          <Production />
        </ProtectedRoute>
      } />
      <Route path="/battery-management" element={
        <ProtectedRoute>
          <BatteryManagement />
        </ProtectedRoute>
      } />
      <Route path="/energy-optimization" element={
        <ProtectedRoute>
          <EnergyOptimization />
        </ProtectedRoute>
      } />
      <Route path="/weather-forecast" element={
        <ProtectedRoute>
          <WeatherForecast />
        </ProtectedRoute>
      } />
      
      {/* 404 route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
