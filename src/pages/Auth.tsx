
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

// Auth page component
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        {isSignUp ? (
          <SignUpForm onToggleMode={toggleFormMode} />
        ) : (
          <SignInForm onToggleMode={toggleFormMode} />
        )}
      </div>
    </div>
  );
};

export default Auth;
