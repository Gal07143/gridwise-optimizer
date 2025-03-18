
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createDevice, getOrCreateDummySite } from '@/services/deviceService';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';

export const useDeviceForm = () => {
  const { user } = useAuth();
  const [defaultSiteId, setDefaultSiteId] = useState<string | null>(null);
  const [siteError, setSiteError] = useState<boolean>(false);

  useEffect(() => {
    const fetchDefaultSite = async () => {
      try {
        // Always set a fallback ID first to ensure we have something
        setDefaultSiteId("00000000-0000-0000-0000-000000000000");
        setSiteError(false);
        
        // Try to get site from API
        const site = await getOrCreateDummySite();
        if (site) {
          setDefaultSiteId(site.id);
        }
      } catch (error) {
        console.error("Error fetching default site:", error);
        setSiteError(true);
        // We'll continue with the dummy ID set above
      }
    };
    
    fetchDefaultSite();
  }, []);

  const handleCreateDevice = async (deviceData: DeviceFormState) => {
    if (!user) {
      toast.error('You must be logged in to create a device');
      return null;
    }

    // Display a warning if we're using the fallback site ID
    if (siteError) {
      toast.warning("Using fallback site configuration. Some features may be limited.");
    }
    
    console.log("Creating device with data:", {
      ...deviceData,
      site_id: defaultSiteId
    });
    
    // Create the new device with the user ID and default site
    return await createDevice({
      ...deviceData,
      site_id: defaultSiteId
    });
  };

  const baseFormHook = useBaseDeviceForm({
    onSubmit: handleCreateDevice
  });

  return {
    ...baseFormHook,
    isSubmitting: baseFormHook.isSubmitting,
    hasSiteError: siteError,
  };
};
