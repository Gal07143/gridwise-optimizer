
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getSiteById, updateSite } from '@/services/sites/siteService';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import { CornerDownLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Site } from '@/types/site';
import { useSiteActions } from '@/hooks/useSiteActions';
import { Card, CardContent } from '@/components/ui/card';
import useConnectionStatus from '@/hooks/useConnectionStatus';

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateSite: updateSiteAction, isLoading: isUpdating } = useSiteActions();
  const { isOnline } = useConnectionStatus({ showToasts: false });
  
  useEffect(() => {
    const fetchSite = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const siteData = await getSiteById(id);
        
        if (!siteData) {
          setError(`Site with ID ${id} not found`);
        } else {
          setSite(siteData);
        }
      } catch (err) {
        console.error('Error fetching site:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch site data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSite();
  }, [id]);
  
  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      // Fix type by creating proper parameter object
      const result = await updateSiteAction({ 
        id, 
        data 
      });
      
      // Use non-nullable assertion to avoid type error
      if (result) {
        toast.success(`Site "${data.name}" updated successfully`);
        navigate('/settings/sites');
        return true;
      } else if (!isOnline) {
        toast.success(`Site update saved and will be processed when you reconnect`);
        navigate('/settings/sites');
        return true;
      } else {
        throw new Error('Failed to update site');
      }
    } catch (error: any) {
      console.error('Error updating site:', error);
      toast.error(`An error occurred: ${error?.message || 'Unknown error'}`);
      throw error; // Re-throw so the form can handle it
    }
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate
        title="Editing Site"
        description="Loading site information..."
        backLink="/settings/sites"
      >
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (error || !site) {
    return (
      <SettingsPageTemplate
        title="Error"
        description="Failed to load site"
        backLink="/settings/sites"
      >
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400">{error || 'Site not found'}</p>
          </CardContent>
        </Card>
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate
      title={`Edit Site: ${site.name}`}
      description="Update site information"
      backLink="/settings/sites"
    >
      <SiteForm
        initialData={site}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </SettingsPageTemplate>
  );
};

export default EditSite;
