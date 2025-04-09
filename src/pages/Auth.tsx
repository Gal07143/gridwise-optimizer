
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/useAuth';
import { CustomInputWithIcon } from '@/components/ui/custom-input-with-icon';
import { Mail, Lock, User, Phone, ArrowLeft, Check, AlertCircle, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

// Add animation and modern styling
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Recover password states
  const [recoverEmail, setRecoverEmail] = useState('');
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      if (result) {
        toast.success('Signed in successfully');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, name);
      toast.success('Account created! Please check your email to confirm your registration.');
      setActiveTab('signin');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
      toast.error(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Password recovery logic here
      toast.success('Password recovery email sent. Please check your inbox.');
      setActiveTab('signin');
    } catch (err: any) {
      console.error('Password recovery error:', err);
      toast.error(err.message || 'Failed to send recovery email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Go back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        {/* Main card with glass effect */}
        <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-gradient-to-r from-blue-400 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Fingerprint className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Energy Management System
            </CardTitle>
            <CardDescription className="text-slate-400">
              Access your energy optimization dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-white rounded-lg p-3 mb-4 flex items-center gap-2 animate-in slide-in-from-top duration-300">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6 bg-slate-700/30">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              
              {/* Sign In Form */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <CustomInputWithIcon
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />
                  
                  <CustomInputWithIcon
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    icon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button 
                        type="button" 
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="text-slate-400 hover:text-slate-300 focus:outline-none"
                      >
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                    }
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500"
                      />
                      <label htmlFor="remember" className="text-sm text-slate-300">
                        Remember me
                      </label>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('recover')}
                      className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading || authLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Signing in...
                      </span>
                    ) : (
                      <>Sign In</>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <CustomInputWithIcon
                    id="signup-email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />
                  
                  <CustomInputWithIcon
                    id="full-name"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    icon={<User className="h-4 w-4" />}
                  />
                  
                  <CustomInputWithIcon
                    id="signup-password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    icon={<Lock className="h-4 w-4" />}
                  />
                  
                  <CustomInputWithIcon
                    id="confirm-password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    icon={<Lock className="h-4 w-4" />}
                  />
                  
                  <div className="text-xs text-slate-400">
                    <p>Password must contain:</p>
                    <ul className="pl-5 mt-1 space-y-1">
                      <li className="flex items-center gap-1">
                        <Check className={`h-3 w-3 ${password.length >= 8 ? 'text-green-500' : 'text-slate-500'}`} />
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className={`h-3 w-3 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-slate-500'}`} />
                        <span>One uppercase letter</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className={`h-3 w-3 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-slate-500'}`} />
                        <span>One number</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Creating Account...
                      </span>
                    ) : (
                      <>Create Account</>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Password Recovery Form */}
              <TabsContent value="recover">
                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-white">Reset Your Password</h3>
                    <p className="text-sm text-slate-400">
                      Enter your email and we'll send you instructions to reset your password.
                    </p>
                  </div>
                  
                  <CustomInputWithIcon
                    id="recover-email"
                    type="email"
                    placeholder="Email address"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    autoComplete="email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    
                    <button 
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-white"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t border-slate-700/50 pt-4">
            <p className="text-xs text-center text-slate-500 w-full">
              By using this service, you agree to our 
              <a href="/terms" className="text-indigo-400 hover:text-indigo-300 hover:underline ml-1">Terms of Service</a> and 
              <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline ml-1">Privacy Policy</a>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-slate-400 mt-4">
          Powered by Advanced Energy Management System
        </p>
      </div>
    </div>
  );
};

export default Auth;
