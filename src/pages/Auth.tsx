
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const Auth = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      isAdmin: false,
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Login attempt:', values.email);
      const { error } = await signIn(values.email, values.password);
      if (!error) {
        console.log('Login successful, redirecting...');
        navigate('/');
      } else {
        console.error('Login error:', error);
      }
    } catch (err) {
      console.error('Login exception:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Signup attempt:', values.email);
      const { error } = await signUp(
        values.email,
        values.password,
        {
          firstName: values.firstName,
          lastName: values.lastName,
        }
      );
      
      if (!error) {
        // Set the role to admin if isAdmin is checked
        if (values.isAdmin) {
          try {
            console.log('Attempting to set admin role');
            // First, get the user that was just created
            const { data: userData } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', values.email)
              .single();
            
            if (userData) {
              console.log('Found user profile:', userData);
              // Update the role to admin
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', userData.id);
              
              if (updateError) {
                console.error('Failed to set admin role:', updateError);
                toast.error(`Failed to set admin role: ${updateError.message}`);
              } else {
                console.log('Admin role set successfully');
                toast.success("Admin account created successfully");
              }
            } else {
              console.log('No user profile found');
            }
          } catch (err) {
            console.error("Error setting admin role:", err);
            toast.error("Account created, but admin role setting failed");
          }
        }
        
        setAuthMode('login');
        toast.success("Account created successfully. Please check your email to verify your account.");
      } else {
        console.error('Signup error:', error);
      }
    } catch (err) {
      console.error('Signup exception:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Reset password attempt:', values.email);
      await resetPassword(values.email);
    } catch (err) {
      console.error('Reset password exception:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="w-full bg-background/70 backdrop-blur-md shadow-xl border-border/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Energy Management System</CardTitle>
          <CardDescription>
            {authMode === 'login' && 'Sign in to your account'}
            {authMode === 'signup' && 'Create a new account'}
            {authMode === 'forgotPassword' && 'Reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authMode === 'login' && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>
          )}

          {authMode === 'signup' && (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={signupForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Admin Account</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Create this account with administrator privileges
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>
            </Form>
          )}

          {authMode === 'forgotPassword' && (
            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Reset Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {authMode === 'login' && (
            <>
              <Button
                variant="link"
                className="text-sm w-full"
                onClick={() => setAuthMode('forgotPassword')}
              >
                Forgot your password?
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => setAuthMode('signup')}>
                  Sign up
                </Button>
              </div>
            </>
          )}
          {authMode === 'signup' && (
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => setAuthMode('login')}>
                Sign in
              </Button>
            </div>
          )}
          {authMode === 'forgotPassword' && (
            <Button variant="link" className="text-sm w-full" onClick={() => setAuthMode('login')}>
              Back to sign in
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
