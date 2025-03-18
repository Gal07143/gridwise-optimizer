
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check for session, not user, to determine if authenticated
  if (!session) {
    console.log('No session found, redirecting to auth page');
    return <Navigate to="/auth" />;
  }

  console.log('Session found, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
