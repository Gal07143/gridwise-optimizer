
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin, Plus } from 'lucide-react';
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

const SiteSettings = () => {
  const navigate = useNavigate();
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);
  
  const { data: sites = [], isLoading, refetch } = useQuery({
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
    
    try {
      const success = await deleteSite(siteToDelete);
      if (success) {
        refetch();
        toast.success("Site deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site");
    } finally {
      setSiteToDelete(null);
    }
  };

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
            <AlertDialogTitle>Delete Site</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the site
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsPageTemplate>
  );
};

export default SiteSettings;
