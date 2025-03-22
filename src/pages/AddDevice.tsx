
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceForm } from '@/components/devices/DeviceForm';
import AppLayout from '@/components/layout/AppLayout';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { createDevice } from '@/services/devices/mutations';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeviceType, DeviceStatus } from '@/types/energy';

// Form schema for device creation
const deviceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['battery', 'solar', 'wind', 'grid', 'load', 'ev_charger', 'inverter', 'meter'] as const),
  status: z.enum(['online', 'offline', 'maintenance', 'error', 'warning'] as const).default('offline'),
  location: z.string().optional(),
  capacity: z.number().positive('Capacity must be positive'),
  description: z.string().optional(),
  firmware: z.string().optional(),
  site_id: z.string().uuid().optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

const AddDevice = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '',
      type: 'battery',
      status: 'offline',
      capacity: 0,
      description: '',
      firmware: '',
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: createDevice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device created successfully');
      navigate(`/devices/${data.id}`);
    },
    onError: (error) => {
      console.error('Error creating device:', error);
      toast.error('Failed to create device');
    },
  });
  
  const onSubmit = (data: DeviceFormValues) => {
    mutate(data);
  };
  
  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/devices">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Add New Device</h1>
        </div>
        
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DeviceForm isLoading={isPending} />
          </form>
        </FormProvider>
      </div>
    </AppLayout>
  );
};

export default AddDevice;
