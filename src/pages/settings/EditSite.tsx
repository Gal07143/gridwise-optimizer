
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSiteById, updateSite } from '@/services/siteService';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, Loader2 } from 'lucide-react';

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: site, isLoading, isError } = useQuery({
    queryKey: ['site', id],
    queryFn: () => getSiteById(id as string),
    enabled: !!id,
  });
  
  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateSite(id, data);
      
      if (result) {
        toast.success("Site updated successfully");
        navigate('/settings/sites');
      } else {
        toast.error("Failed to update site");
      }
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error("An error occurred while updating the site");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate
        title="Edit Site"
        description="Update site details"
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
      >
        <div className="text-center space-y-4 p-8">
          <h2 className="text-xl font-semibold text-destructive">Site Not Found</h2>
          <p className="text-muted-foreground">
            The site you are trying to edit could not be found.
          </p>
          <Button onClick={() => navigate('/settings/sites')}>
            Back to Sites
          </Button>
        </div>
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
      <SiteForm 
        initialData={site} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </SettingsPageTemplate>
  );
};

export default EditSite;
