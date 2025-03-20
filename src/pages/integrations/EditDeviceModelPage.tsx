
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Loader2, Package, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDeviceModelById } from '@/services/devices';

const EditDeviceModelPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: deviceModel, isLoading, isError } = useQuery({
    queryKey: ['deviceModel', id],
    queryFn: () => getDeviceModelById(id as string),
    enabled: !!id
  });
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Device model updated successfully');
      navigate(`/integrations/device-models/${id}`);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate
        title="Edit Device Model"
        description="Update device model details"
        backLink={`/integrations/device-models/${id}`}
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (isError || !deviceModel) {
    return (
      <SettingsPageTemplate
        title="Edit Device Model"
        description="Update device model details"
        backLink="/integrations"
      >
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Device Model Not Found</AlertTitle>
          <AlertDescription>
            The device model you are trying to edit could not be found.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate('/integrations')}>
          Back to Integrations
        </Button>
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate
      title={`Edit Device Model: ${deviceModel.name}`}
      description="Update device model information and specifications"
      backLink={`/integrations/device-models/${id}`}
      headerIcon={<Package size={20} />}
      actions={
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </Button>
      }
    >
      <div className="grid gap-6">
        <div className="p-6 border rounded-md">
          <h3 className="text-lg font-medium mb-4">Device Model Form</h3>
          <p className="text-muted-foreground mb-4">Form implementation will be added here.</p>
          <p className="text-muted-foreground">Current model ID: {id}</p>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default EditDeviceModelPage;
