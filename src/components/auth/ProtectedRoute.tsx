
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <LoadingSpinner size="lg" text="Verifying your credentials..." />
        <p className="mt-4 text-sm text-muted-foreground">
          If this takes too long, please try refreshing the page
        </p>
      </div>
    );
  }
  
  // Always allow access, no authentication check
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
