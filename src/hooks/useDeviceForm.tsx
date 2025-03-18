
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
        // Hardcode a dummy site ID for now to bypass the permission issues
        setDefaultSiteId("00000000-0000-0000-0000-000000000000");
        
        // Try to get site from API, but don't block on it
        const site = await getOrCreateDummySite();
        if (site) {
          setDefaultSiteId(site.id);
        }
      } catch (error) {
        console.error("Error fetching default site:", error);
        // We'll continue with the dummy ID
      }
    };
    
    fetchDefaultSite();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert capacity to number if it's the capacity field
    if (name === 'capacity') {
      setDevice(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setDevice(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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
      
      console.log("Creating device with data:", {
        ...device,
        capacity: Number(device.capacity),
        site_id: defaultSiteId
      });
      
      // Create the new device with the user ID and default site
      const newDevice = await createDevice({
        ...device,
        capacity: Number(device.capacity),
        site_id: defaultSiteId || "00000000-0000-0000-0000-000000000000" // Fallback if still null
      });
      
      if (newDevice) {
        toast.success('Device created successfully');
        navigate('/devices');
      } else {
        throw new Error('Failed to create device: Server returned null');
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
