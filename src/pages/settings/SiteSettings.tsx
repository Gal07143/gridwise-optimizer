
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getAllSites, deleteSite } from '@/services/sites/siteService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import SiteCard from '@/components/sites/SiteCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SiteSettings = () => {
  const navigate = useNavigate();
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: sites = [], isLoading, error, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: () => getAllSites(),
  });

  const handleAddSite = () => {
    navigate('/settings/sites/add');
  };

  const handleEditSite = (siteId: string) => {
    navigate(`/settings/sites/edit/${siteId}`);
  };

  const openDeleteDialog = (siteId: string) => {
    setSiteToDelete(siteId);
  };

  const handleDeleteSite = async () => {
    if (!siteToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteSite(siteToDelete);
      if (success) {
        refetch();
        toast.success("Site deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting site:", error);
      toast.error(`Failed to delete site: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setSiteToDelete(null);
    }
  };

  const siteToDeleteName = siteToDelete 
    ? sites.find(site => site.id === siteToDelete)?.name || 'this site' 
    : '';

  if (error) {
    return (
      <SettingsPageTemplate
        title="Site Management"
        description="Manage your organization's sites and locations"
      >
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading sites. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </SettingsPageTemplate>
    );
  }

  return (
    <SettingsPageTemplate
      title="Site Management"
      description="Manage your organization's sites and locations"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sites</h2>
          <p className="text-muted-foreground">Manage your energy sites and locations</p>
        </div>
        <Button onClick={handleAddSite}>
          <Plus size={16} className="mr-2" />
          Add Site
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <MapPin size={48} className="mb-4 text-muted-foreground" />
            <p className="mb-4 text-center text-muted-foreground">
              No sites have been created yet. Add your first site to get started.
            </p>
            <Button onClick={handleAddSite}>
              <Plus size={16} className="mr-2" />
              Add First Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <SiteCard 
              key={site.id} 
              site={site} 
              onEdit={handleEditSite} 
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!siteToDelete} onOpenChange={(open) => !open && setSiteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {siteToDeleteName}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the site
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsPageTemplate>
  );
};

export default SiteSettings;
