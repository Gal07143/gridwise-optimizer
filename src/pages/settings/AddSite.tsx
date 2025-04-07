import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createSite } from '@/services/sites/siteService';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import { CornerDownLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddSite = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const result = await createSite(data);
      
      if (result) {
        toast.success("Site created successfully");
        navigate('/settings/sites');
      } else {
        toast.error("Failed to create site");
      }
    } catch (error: any) {
      console.error("Error creating site:", error);
      toast.error(`An error occurred: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SettingsPageTemplate
      title="Add New Site"
      description="Create a new energy management site"
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
        <SiteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </SettingsPageTemplate>
  );
};

export default AddSite;
