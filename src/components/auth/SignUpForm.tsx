
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
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
      name: '',
      email: '',
      password: '',
      agreeTerms: false
    }
  });
  
  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      await signUp(values.email, values.password, values.name);
      toast.success('Account created successfully! Redirecting to dashboard...');
      
      // Navigate to dashboard on success (for demo purposes)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      
      // Display user-friendly error messages
      if (error instanceof Error) {
        // Common error messages with friendly alternatives
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('already in use') || errorMessage.includes('already registered')) {
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
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="John Doe" 
                    autoComplete="name"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                      placeholder="Choose a strong password"
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
          
          {/* Terms Checkbox */}
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={field.value}
                  onChange={field.onChange}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    terms and conditions
                  </a>
                </label>
                {form.formState.errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-500">{form.formState.errors.agreeTerms.message}</p>
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
            ) : (
              <UserPlus size={18} />
            )}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            <ArrowRight size={16} className="ml-1 opacity-70" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
