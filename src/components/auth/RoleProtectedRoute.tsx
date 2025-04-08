
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface RoleProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
  }

  // No role checks, always allow access
  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
