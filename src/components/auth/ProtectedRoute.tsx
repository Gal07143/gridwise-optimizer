
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading, authError } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (authError && !loading) {
      toast.error("Authentication Error", {
        description: authError,
        duration: 5000,
      });
    }
  }, [authError, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Check for session to determine if authenticated
  if (!session) {
    console.log('No session found, redirecting to auth page');
    // Save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('Session found, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
