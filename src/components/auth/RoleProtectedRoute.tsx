
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/lib/supabase';

export interface RoleProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [checkingRole, setCheckingRole] = React.useState(true);

  React.useEffect(() => {
    const getUserRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        // First try to get the role from the user's session
        const { data: { user: userData } } = await supabase.auth.getUser();
        
        if (userData?.app_metadata?.role) {
          setUserRole(userData.app_metadata.role);
        } else {
          // If not found in session, fetch from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
          } else {
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error('Error checking role:', error);
      } finally {
        setCheckingRole(false);
      }
    };

    if (user) {
      getUserRole();
    } else {
      setCheckingRole(false);
    }
  }, [user]);

  if (loading || checkingRole) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If we have a user but don't have a role, or the role is not allowed
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
