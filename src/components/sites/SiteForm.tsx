
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { Site, SiteFormData } from '@/types/site';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  site_type: z.string().optional(),
  timezone: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  // Adding support for legacy properties
  location: z.string().optional(),
  type: z.string().optional(),
});

export interface SiteFormProps {
  initialData?: SiteFormData;
  initialValues?: Site;
  onSubmit: (data: SiteFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const SiteForm: React.FC<SiteFormProps> = ({ 
  initialData, 
  initialValues, 
  onSubmit, 
  isSubmitting = false, 
  onCancel 
}) => {
  // Support both initialData and initialValues for backward compatibility
  const formData = initialData || initialValues || {
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    site_type: 'Commercial',
    timezone: 'UTC',
    description: '',
  };
  
  // Map legacy fields if they exist
  if (initialValues) {
    if (initialValues.location && !formData.address) {
      formData.address = initialValues.location;
    }
    if (initialValues.type && !formData.site_type) {
      formData.site_type = initialValues.type;
    }
  }
  
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Map legacy fields back if they were used
    if (data.location && !data.address) {
      data.address = data.location;
    }
    if (data.type && !data.site_type) {
      data.site_type = data.type;
    }
    
    onSubmit(data);
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Campus" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique name for this energy monitoring site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormDescription>
                      Physical address of the site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="site_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Data Center">Data Center</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of the energy monitoring site
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Local timezone for the site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the site"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional details about this site
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Site
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SiteForm;
