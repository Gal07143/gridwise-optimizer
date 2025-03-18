
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createSite } from '@/services/siteService';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteForm from '@/components/sites/SiteForm';
import { CornerDownLeft } from 'lucide-react';
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
    } catch (error) {
      console.error("Error creating site:", error);
      toast.error("An error occurred while creating the site");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SettingsPageTemplate
      title="Add New Site"
      description="Create a new energy management site"
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
      <SiteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </SettingsPageTemplate>
  );
};

export default AddSite;
