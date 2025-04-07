
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(value => /[A-Z]/.test(value), 'Password must contain at least one uppercase letter')
    .refine(value => /[a-z]/.test(value), 'Password must contain at least one lowercase letter')
    .refine(value => /[0-9]/.test(value), 'Password must contain at least one number'),
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
      // Auth context will handle redirection
      navigate('/dashboard');
    } catch (error) {
      // Error handling is already done in the signUp method
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            onClick={onToggleMode}
          >
            Sign in
          </button>
        </p>
      </div>
      
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="Create a strong password"
                      autoComplete="new-password"
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
                <FormDescription className="text-xs">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Terms Checkbox */}
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the{' '}
                    <a
                      href="#"
                      className="text-primary hover:underline hover:text-primary/90"
                      onClick={(e) => e.preventDefault()}
                    >
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={18} className="mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
