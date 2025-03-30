
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Site } from '@/types/site';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the form schema with validation
const siteFormSchema = z.object({
  name: z.string().min(2, { message: 'Site name must be at least 2 characters' }).max(100),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }).max(100),
  timezone: z.string().optional(),
  lat: z.union([
    z.number(),
    z.string().transform((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    })
  ]).optional().nullable(),
  lng: z.union([
    z.number(),
    z.string().transform((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    })
  ]).optional().nullable(),
});

// Infer the form value type from the schema
type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  initialData?: Partial<Site>;
  onSubmit: (data: SiteFormValues) => Promise<void | Site | null>;
  isSubmitting: boolean;
}

const SiteForm: React.FC<SiteFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const { isOnline } = useConnectionStatus({ showToasts: false });
  const [formError, setFormError] = useState<string | null>(null);

  // Set default form values from initialData or use defaults
  const defaultValues: SiteFormValues = {
    name: initialData?.name || '',
    location: initialData?.location || '',
    timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lat: initialData?.lat !== undefined ? initialData.lat : null,
    lng: initialData?.lng !== undefined ? initialData.lng : null,
  };

  // Initialize the form with react-hook-form
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = async (values: SiteFormValues) => {
    try {
      setFormError(null);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      {!isOnline && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. Form submission will be saved locally and processed when you reconnect.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter site name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a unique name for this site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter site location" {...field} />
                      </FormControl>
                      <FormDescription>
                        Physical address or location identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input placeholder="Select timezone" {...field} />
                      </FormControl>
                      <FormDescription>
                        Timezone for all site data and operations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.000001" 
                            placeholder="Latitude coordinate" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? null : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.000001" 
                            placeholder="Longitude coordinate" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? null : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Site'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SiteForm;
