
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Site } from '@/types/site';
import { createSite, updateSite, deleteSite } from '@/services/sites/siteService';

export function useSiteActions() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateSite = async (siteData: Omit<Site, 'id'>) => {
    setIsLoading(true);
    try {
      const newSite = await createSite(siteData);
      if (newSite) {
        toast.success('Site created successfully');
        navigate(`/sites/${newSite.id}`);
        return newSite;
      } else {
        toast.error('Failed to create site');
        return null;
      }
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error('An error occurred while creating the site');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSite = async (id: string, siteData: Partial<Site>) => {
    setIsLoading(true);
    try {
      const updatedSite = await updateSite(id, siteData);
      if (updatedSite) {
        toast.success('Site updated successfully');
        return updatedSite;
      } else {
        toast.error('Failed to update site');
        return null;
      }
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error('An error occurred while updating the site');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSite = async (id: string) => {
    setIsLoading(true);
    try {
      // Fix the void return check
      const result = await deleteSite(id);
      
      // Properly check boolean result
      if (result === true) {
        toast.success('Site deleted successfully');
        navigate('/sites');
        return true;
      } else {
        toast.error('Failed to delete site');
        return false;
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      toast.error('An error occurred while deleting the site');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreateSite,
    handleUpdateSite,
    handleDeleteSite
  };
}
