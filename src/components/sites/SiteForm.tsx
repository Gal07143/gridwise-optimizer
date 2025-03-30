
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { SiteFormValues } from '@/types/site';
import { z } from 'zod';
import { toast } from 'sonner';

interface SiteFormProps {
  initialData?: SiteFormValues;
  onSubmit: (data: SiteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

// Validation schema
const siteSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

const SiteForm: React.FC<SiteFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<SiteFormValues>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lat: initialData?.lat || null,
    lng: initialData?.lng || null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | null = value;
    
    if (type === 'number') {
      parsedValue = value ? parseFloat(value) : null;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleTimezoneChange = (value: string) => {
    setFormData({
      ...formData,
      timezone: value
    });
    
    // Clear error for timezone
    if (errors.timezone) {
      setErrors({
        ...errors,
        timezone: ''
      });
    }
  };
  
  const validateForm = () => {
    try {
      siteSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save site');
    }
  };
  
  // Generate a list of common timezones
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Site Name</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter site name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter site location"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium">Timezone</label>
            <Select value={formData.timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger className={errors.timezone ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-sm text-red-500">{errors.timezone}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="lat" className="text-sm font-medium">Latitude (optional)</label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={formData.lat !== null ? formData.lat : ''}
                onChange={handleChange}
                placeholder="Enter latitude"
                className={errors.lat ? 'border-red-500' : ''}
              />
              {errors.lat && <p className="text-sm text-red-500">{errors.lat}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lng" className="text-sm font-medium">Longitude (optional)</label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={formData.lng !== null ? formData.lng : ''}
                onChange={handleChange}
                placeholder="Enter longitude"
                className={errors.lng ? 'border-red-500' : ''}
              />
              {errors.lng && <p className="text-sm text-red-500">{errors.lng}</p>}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Cancel
          </Button>
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
        </CardFooter>
      </Card>
    </form>
  );
};

export default SiteForm;
