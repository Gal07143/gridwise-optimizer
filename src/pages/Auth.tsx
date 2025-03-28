
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, ArrowRight, UserPlus, LogIn } from 'lucide-react';

// Form validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  rememberMe: z.boolean().optional()
});

// Define types based on the schemas
type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

// Auth page component
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  // Set up form with validation
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      rememberMe: false
    }
  });
  
  // Use the active form based on current mode
  const form = isSignUp ? signUpForm : signInForm;
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    signInForm.reset();
    signUpForm.reset();
    
    // Load remembered email if switching to sign in
    if (!isSignUp) {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        signInForm.setValue('email', rememberedEmail);
        signInForm.setValue('rememberMe', true);
      }
    }
  };
  
  const onSubmit = async (values: SignInFormValues | SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        const signUpValues = values as SignUpFormValues;
        await signUp(signUpValues.email, signUpValues.password, { 
          firstName: signUpValues.firstName, 
          lastName: signUpValues.lastName 
        });
        toast.success('Account created successfully! Welcome aboard.');
      } else {
        const signInValues = values as SignInFormValues;
        await signIn(signInValues.email, signInValues.password);
        toast.success('Signed in successfully! Welcome back.');
      }
      
      // Save to localStorage if remember me is checked
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Display user-friendly error messages
      if (error instanceof Error) {
        // Common error messages with friendly alternatives
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('invalid login')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (errorMessage.includes('email already exists')) {
          toast.error('This email is already registered. Try signing in instead.');
        } else if (errorMessage.includes('network')) {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load remembered email if available
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && !isSignUp) {
      signInForm.setValue('email', rememberedEmail);
      signInForm.setValue('rememberMe', true);
    }
  }, [signInForm, isSignUp]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors"
              onClick={toggleFormMode}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
        
        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password Field with toggle visibility */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        className="pr-10"
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Additional Sign Up Fields */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Remember Me Checkbox */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={field.value || false}
                      onChange={field.onChange}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  
                  {!isSignUp && (
                    <div className="text-sm">
                      <a 
                        href="#" 
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Password reset functionality coming soon!');
                        }}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}
                </div>
              )}
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
              ) : isSignUp ? (
                <UserPlus size={18} />
              ) : (
                <LogIn size={18} />
              )}
              {isSubmitting 
                ? 'Processing...' 
                : (isSignUp ? 'Create account' : 'Sign in')
              }
              <ArrowRight size={16} className="ml-1 opacity-70" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
