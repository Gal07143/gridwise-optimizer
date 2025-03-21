
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Update DeviceModel interface to match what's available
interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number?: string;
  protocol?: string;
  capacity?: number;
  power_rating?: number;
  certification?: string;
  category?: string;
  created_at: string;
}

// Form schema definition
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  model_number: z.string().optional(),
  protocol: z.string().optional(),
  capacity: z.coerce.number().optional(),
  power_rating: z.coerce.number().optional(),
  certification: z.string().optional(),
  category: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const EditDeviceModelPage = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      model_number: '',
      protocol: '',
      capacity: undefined,
      power_rating: undefined,
      certification: '',
      category: ''
    }
  });

  useEffect(() => {
    const fetchDeviceModel = async () => {
      if (!modelId) return;
      
      setIsLoading(true);
      try {
        // Use a custom function to get the device model
        const query = `SELECT * FROM device_models WHERE id = '${modelId}'`;
        const { data, error } = await supabase.functions.invoke('execute-sql', {
          body: { query }
        });
        
        if (error) throw error;
        
        if (data) {
          // Parse the result if it's a string
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            const modelData = parsedData[0] as DeviceModel;
            setDeviceModel(modelData);
            
            // Reset form with device model data
            reset({
              name: modelData.name,
              manufacturer: modelData.manufacturer,
              model_number: modelData.model_number || '',
              protocol: modelData.protocol || '',
              capacity: modelData.capacity,
              power_rating: modelData.power_rating,
              certification: modelData.certification || '',
              category: modelData.category || ''
            });
          } else {
            toast.error("Device model not found");
            navigate('/integrations', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error fetching device model:", error);
        toast.error("Failed to load device model");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceModel();
  }, [modelId, reset, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!modelId) return;
    
    try {
      // Prepare update data
      const updateData = {
        ...data,
        last_updated: new Date().toISOString()
      };
      
      // Update the device model using our custom function
      const updateQuery = `
        UPDATE device_models
        SET 
          name = '${updateData.name}',
          manufacturer = '${updateData.manufacturer}',
          model_number = ${updateData.model_number ? `'${updateData.model_number}'` : 'NULL'},
          protocol = ${updateData.protocol ? `'${updateData.protocol}'` : 'NULL'},
          capacity = ${updateData.capacity || 'NULL'},
          power_rating = ${updateData.power_rating || 'NULL'},
          certification = ${updateData.certification ? `'${updateData.certification}'` : 'NULL'},
          category = ${updateData.category ? `'${updateData.category}'` : 'NULL'},
          last_updated = '${updateData.last_updated}'
        WHERE id = '${modelId}'
        RETURNING *
      `;
      
      const { data: responseData, error } = await supabase.functions.invoke('execute-sql', {
        body: { query: updateQuery }
      });
      
      if (error) throw error;
      
      toast.success("Device model updated successfully");
      
      // Navigate back to the device model page
      navigate(`/integrations/device-model/${modelId}`, { replace: true });
    } catch (error) {
      console.error("Error updating device model:", error);
      toast.error("Failed to update device model");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Edit Device Model</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" {...register('manufacturer')} />
                  {errors.manufacturer && <p className="text-red-500 text-sm">{errors.manufacturer.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model_number">Model Number</Label>
                  <Input id="model_number" {...register('model_number')} />
                  {errors.model_number && <p className="text-red-500 text-sm">{errors.model_number.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocol</Label>
                  <Input id="protocol" {...register('protocol')} />
                  {errors.protocol && <p className="text-red-500 text-sm">{errors.protocol.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (kWh/kW)</Label>
                  <Input id="capacity" type="number" step="0.01" {...register('capacity')} />
                  {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="power_rating">Power Rating (kW)</Label>
                  <Input id="power_rating" type="number" step="0.01" {...register('power_rating')} />
                  {errors.power_rating && <p className="text-red-500 text-sm">{errors.power_rating.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certification">Certification</Label>
                  <Input id="certification" {...register('certification')} />
                  {errors.certification && <p className="text-red-500 text-sm">{errors.certification.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register('category')} />
                  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EditDeviceModelPage;
