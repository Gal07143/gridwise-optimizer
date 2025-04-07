
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Only show the toast if we've finished loading and the user isn't authenticated
    if (!loading && !isAuthenticated) {
      toast.error("Please sign in to access this page", {
        id: "auth-required",
        duration: 3000
      });
    }
  }, [loading, isAuthenticated, location.pathname]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading your profile..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to auth page but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
