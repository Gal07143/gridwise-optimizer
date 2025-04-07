
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

// Auth page component
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // Check if we should show signup initially (from URL state)
  useEffect(() => {
    if (location.state && (location.state as any).signUp) {
      setIsSignUp(true);
    }
  }, [location.state]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);
  
  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Energy Management System</h1>
        <p className="text-muted-foreground mt-2">Control and optimize your energy infrastructure</p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          {isSignUp ? (
            <SignUpForm onToggleMode={toggleFormMode} />
          ) : (
            <SignInForm onToggleMode={toggleFormMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
