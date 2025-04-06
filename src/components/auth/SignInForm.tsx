
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
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false)
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
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      rememberMe: !!localStorage.getItem('rememberedEmail')
    }
  });
  
  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    
    try {
      await signIn(values.email, values.password);
      
      // Save to localStorage if remember me is checked
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Error handling is already done in the signIn method
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            onClick={onToggleMode}
          >
            Sign up
          </button>
        </p>
      </div>
      
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
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
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
            
            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
                onClick={() => toast.info('Password reset not implemented yet')}
              >
                Forgot password?
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Sign in
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;
