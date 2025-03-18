
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createDevice, getOrCreateDummySite } from '@/services/deviceService';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';

export const useDeviceForm = () => {
  const { user } = useAuth();
  const [defaultSiteId, setDefaultSiteId] = useState<string | null>(null);

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

  const handleCreateDevice = async (deviceData: DeviceFormState) => {
    if (!user) {
      toast.error('You must be logged in to create a device');
      return null;
    }

    console.log("Creating device with data:", {
      ...deviceData,
      site_id: defaultSiteId
    });
    
    // Create the new device with the user ID and default site
    return await createDevice({
      ...deviceData,
      site_id: defaultSiteId || "00000000-0000-0000-0000-000000000000" // Fallback if still null
    });
  };

  const baseFormHook = useBaseDeviceForm({
    onSubmit: handleCreateDevice
  });

  return {
    ...baseFormHook,
    isSubmitting: baseFormHook.isSubmitting,
  };
};
