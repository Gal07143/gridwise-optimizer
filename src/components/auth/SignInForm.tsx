
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
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

// Define types based on the schema
export type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onToggleMode: () => void;
}

const SignInForm = ({ onToggleMode }: SignInFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  // Set up form with validation
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  // Load remembered email if available
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);
  
  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    
    try {
      await signIn(values.email, values.password);
      toast.success('Signed in successfully! Welcome back.');
      
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
  
  return (
    <>
      <div>
        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors"
            onClick={onToggleMode}
          >
            Sign up
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
          
          {/* Remember Me Checkbox and Forgot Password */}
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
            ) : (
              <LogIn size={18} />
            )}
            {isSubmitting ? 'Processing...' : 'Sign in'}
            <ArrowRight size={16} className="ml-1 opacity-70" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;
