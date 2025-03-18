
import { useState, useEffect } from 'react';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { createDevice, getOrCreateDummySite } from '@/services/deviceService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useDeviceForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultSiteId, setDefaultSiteId] = useState<string | null>(null);

  const [device, setDevice] = useState({
    name: '',
    location: '',
    type: 'solar' as DeviceType,
    status: 'online' as DeviceStatus,
    capacity: 0,
    firmware: '',
    description: '',
  });

  useEffect(() => {
    const fetchDefaultSite = async () => {
      try {
        const site = await getOrCreateDummySite();
        if (site) {
          setDefaultSiteId(site.id);
        }
      } catch (error) {
        console.error("Error fetching default site:", error);
      }
    };
    
    fetchDefaultSite();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!device.name || !device.location || !device.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a device');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the new device with the user ID and default site
      const newDevice = await createDevice({
        ...device,
        capacity: Number(device.capacity),
        site_id: defaultSiteId
      });
      
      if (newDevice) {
        toast.success('Device created successfully');
        navigate(`/devices`);
      } else {
        toast.error('Failed to create device');
      }
    } catch (error: any) {
      console.error('Error creating device:', error);
      toast.error(`Failed to create device: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    device,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack: () => navigate('/devices'),
  };
};
