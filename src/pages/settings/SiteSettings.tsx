
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteById } from '@/services/sites/siteService';
import { Site } from '@/types/site';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSiteActions } from '@/hooks/useSiteActions';
import { Loader2, Save, Trash } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import SiteForm from '@/components/sites/SiteForm';

const SiteSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showConfirm } = useConfirm();
  
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { updateSite, deleteSite, isLoading: isActionLoading } = useSiteActions();
  
  // Load site data
  useEffect(() => {
    const loadSite = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const siteData = await getSiteById(id);
        setSite(siteData);
      } catch (err) {
        console.error(err);
        setError('Failed to load site data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSite();
  }, [id]);
  
  const handleSubmit = async (data: any) => {
    if (!id) return false;
    
    try {
      await updateSite({ id, data });
      toast.success('Site updated successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to update site: ${error.message}`);
      return false;
    }
  };
  
  const handleDelete = async () => {
    if (!id || !site) return;
    
    const confirmed = await showConfirm({
      title: `Delete ${site.name}?`,
      description: "This action cannot be undone. The site and all associated data will be permanently deleted.",
      confirmText: "Delete",
      cancelText: "Cancel"
    });
    
    if (confirmed) {
      try {
        const result = await deleteSite(id);
        if (result) {
          toast.success('Site deleted successfully');
          navigate('/settings/sites');
        }
      } catch (error: any) {
        toast.error(`Failed to delete site: ${error.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 mt-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !site) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardContent className="p-6">
          <p className="text-red-600 dark:text-red-400">{error || 'Site not found'}</p>
          <Button onClick={() => navigate('/settings/sites')} className="mt-4">
            Back to Sites
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage settings for {site.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <SiteForm 
          initialData={site}
          onSubmit={handleSubmit}
          isSubmitting={isActionLoading}
        />
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between items-center">
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isActionLoading}
        >
          {isActionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash className="h-4 w-4 mr-2" />}
          Delete Site
        </Button>
        <Button 
          type="submit"
          form="site-form"
          disabled={isActionLoading}
        >
          {isActionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SiteSettings;
