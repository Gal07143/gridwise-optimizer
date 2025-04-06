
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Card, CardContent } from '@/components/ui/card';

// Auth page component
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
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
