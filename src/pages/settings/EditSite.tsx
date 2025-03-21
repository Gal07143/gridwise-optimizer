
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSiteById, updateSite } from '@/services/sites/siteService';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EditSite = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: site, isLoading, isError, error } = useQuery({
    queryKey: ['site', siteId],
    queryFn: () => getSiteById(siteId as string),
    enabled: !!siteId,
    retry: 1,
  });
  
  const handleSubmit = async (data: any) => {
    if (!siteId) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateSite(siteId, data);
      
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
        description="Update site details"
        backLink="/settings/sites"
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (isError || !site) {
    return (
      <SettingsPageTemplate
        title="Edit Site"
        description="Update site details"
        backLink="/settings/sites"
      >
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Site Not Found</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'The site you are trying to edit could not be found.'}
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate('/settings/sites')}>
          Back to Sites
        </Button>
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate
      title={`Edit Site: ${site.name}`}
      description="Update site information and settings"
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
        <SiteForm 
          initialData={site} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </SettingsPageTemplate>
  );
};

export default EditSite;
