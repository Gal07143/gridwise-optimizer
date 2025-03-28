
import { useState } from 'react';
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
import { Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

// Form validation schema
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

// Define types based on the schema
export type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onToggleMode: () => void;
}

const SignUpForm = ({ onToggleMode }: SignUpFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  // Set up form with validation
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      rememberMe: false
    }
  });
  
  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      await signUp(values.email, values.password, { 
        firstName: values.firstName, 
        lastName: values.lastName 
      });
      toast.success('Account created successfully! Welcome aboard.');
      
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
        if (errorMessage.includes('email already exists')) {
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
  
  return (
    <>
      <div>
        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors"
            onClick={onToggleMode}
          >
            Sign in
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
                      placeholder="Create a strong password"
                      autoComplete="new-password"
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
          
          {/* First Name and Last Name Fields */}
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
          
          {/* Remember Me Checkbox */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center">
                <input
                  id="remember-me-signup"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={field.value || false}
                  onChange={field.onChange}
                />
                <label htmlFor="remember-me-signup" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
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
              <UserPlus size={18} />
            )}
            {isSubmitting ? 'Processing...' : 'Create account'}
            <ArrowRight size={16} className="ml-1 opacity-70" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
