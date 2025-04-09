import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getSiteById, updateSite } from '@/services/sites/siteService';
import { Site } from '@/types/site';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [site, setSite] = useState<Site | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const connection = useConnectionStatus({
    autoConnect: false,
    retryInterval: 5000
  });
  
  useEffect(() => {
    const fetchSite = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetchedSite = await getSiteById(id);
        if (fetchedSite) {
          setSite(fetchedSite);
        } else {
          setError('Site not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load site');
        toast.error(`Failed to load site: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSite();
  }, [id]);
  
  const handleSubmit = async (data: any) => {
    if (!site) return;
    setIsSubmitting(true);
    
    try {
      const result = await updateSite(site.id, data);
      
      if (result) {
        toast.success("Site updated successfully");
        navigate('/settings/sites');
      } else {
        toast.error("Failed to update site");
      }
    } catch (error: any) {
      console.error("Error updating site:", error);
      toast.error(`An error occurred: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate
        title="Edit Site"
        description="Loading site details..."
        backLink="/settings/sites"
      >
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (error || !site) {
    return (
      <SettingsPageTemplate
        title="Edit Site"
        description="Error loading site"
        backLink="/settings/sites"
      >
        <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Site</h2>
          <p>{error || 'Site not found'}</p>
        </div>
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate
      title="Edit Site"
      description="Edit site details"
      backLink="/settings/sites"
      actions={
        <Button 
          variant="outline"
          onClick={() => navigate('/settings/sites')}
          className="flex items-center gap-2"
        >
          <CornerDownLeft size={16} />
          Back to Sites
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto">
        <SiteForm initialData={site} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </SettingsPageTemplate>
  );
};

export default EditSite;
