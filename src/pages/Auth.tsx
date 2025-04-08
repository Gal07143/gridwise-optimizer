
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Auth page component - will automatically redirect to dashboard
const Auth = () => {
  const navigate = useNavigate();
  
  // Auto-redirect to dashboard
  useEffect(() => {
    // Short timeout to allow any other processes to complete
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 500);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <LoadingSpinner size="lg" text="Bypassing authentication..." />
      <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
};

export default Auth;
