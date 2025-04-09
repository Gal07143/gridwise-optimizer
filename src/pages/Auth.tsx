
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CustomInputWithIcon } from '@/components/ui/custom-input-with-icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Invalid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError(null);
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          setSuccess('Signed in successfully!');
          toast.success('Signed in successfully!');
          
          // Give the success message time to display before redirecting
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (error) throw error;
        
        setSuccess('Signup successful! Please check your email to confirm your account.');
        toast.success('Signup successful!', {
          description: 'Please check your email to confirm your account.'
        });
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unknown error occurred');
      toast.error('Authentication failed', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {mode === 'signin' 
                ? 'Sign in to access your energy management system' 
                : 'Sign up to create your energy management account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-500 flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <CustomInputWithIcon
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-5 w-5" />}
                  disabled={loading}
                  className={cn(
                    "bg-slate-800/75 border-slate-700 text-white placeholder:text-slate-500",
                    error && error.toLowerCase().includes('email') && "border-red-500"
                  )}
                />
                
                <CustomInputWithIcon
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-5 w-5" />}
                  disabled={loading}
                  className={cn(
                    "bg-slate-800/75 border-slate-700 text-white placeholder:text-slate-500",
                    error && error.toLowerCase().includes('password') && "border-red-500"
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              onClick={toggleMode}
              className="w-full text-slate-400 hover:text-white"
              disabled={loading}
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Energy Management System powered by advanced hybrid edge-cloud architecture
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
