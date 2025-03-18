
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createDevice } from '@/services/deviceService';
import { getOrCreateDummySite } from '@/services/sites/siteService';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';

export const useDeviceForm = () => {
  const { user } = useAuth();
  const [defaultSiteId, setDefaultSiteId] = useState<string | null>(null);
  const [siteError, setSiteError] = useState<boolean>(false);
  const [isLoadingSite, setIsLoadingSite] = useState<boolean>(true);
  const [maxRetries] = useState<number>(1); // Reduce retries to prevent infinite recursion

  // Use a useCallback to handle site fetching
  const fetchDefaultSite = useCallback(async () => {
    try {
      setIsLoadingSite(true);
      // Always set a fallback ID first to ensure we have something
      setDefaultSiteId("00000000-0000-0000-0000-000000000000");
      setSiteError(false);
      
      // Try to get site from API
      const site = await getOrCreateDummySite();
      
      if (site) {
        console.log("Successfully fetched site:", site);
        setDefaultSiteId(site.id);
        setSiteError(false);
      } else {
        throw new Error("Failed to fetch site data");
      }
    } catch (error) {
      console.error("Error fetching default site:", error);
      setSiteError(true);
      
      // Use a single toast instead of multiple
      toast.error("Failed to fetch site information", {
        description: "Using fallback configuration.",
        duration: 5000,
        id: "site-fetch-error" // Prevent duplicate toasts
      });
    } finally {
      setIsLoadingSite(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDefaultSite();
  }, [fetchDefaultSite]);

  const handleCreateDevice = async (deviceData: DeviceFormState) => {
    if (!user) {
      toast.error('You must be logged in to create a device');
      return null;
    }

    // Display a warning if we're using the fallback site ID
    if (siteError) {
      toast.warning("Using fallback site configuration", {
        description: "Some features may be limited.",
        id: "fallback-site-warning" // Prevent duplicate toasts
      });
    }
    
    try {
      console.log("Creating device with data:", {
        ...deviceData,
        site_id: defaultSiteId
      });
      
      // Create the new device with the user ID and default site
      const result = await createDevice({
        ...deviceData,
        site_id: defaultSiteId
      });
      
      if (result) {
        toast.success("Device created successfully", {
          description: `${deviceData.name} has been added to your system.`
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error creating device:", error);
      toast.error("Failed to create device", {
        description: "Please try again later."
      });
      return null;
    }
  };

  const baseFormHook = useBaseDeviceForm({
    onSubmit: handleCreateDevice
  });

  return {
    ...baseFormHook,
    isSubmitting: baseFormHook.isSubmitting,
    hasSiteError: siteError,
    isLoadingSite,
    reloadSite: fetchDefaultSite // Add ability to retry loading
  };
};
