
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Edit, MapPin, User, MoreHorizontal, Loader2 } from 'lucide-react';
import { getAllSites, deleteSite } from '@/services/siteService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{site.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {site.location}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSite(site.id)}>
                        <Edit size={14} className="mr-2" />
                        Edit Site
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(site.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete Site
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground mb-2">
                  <div>Timezone: {site.timezone}</div>
                  {site.lat && site.lng && (
                    <div>
                      Coordinates: {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User size={14} className="mr-1" />
                  <span>3 Users</span>
                </div>
                <Badge variant="outline">12 Devices</Badge>
              </CardFooter>
            </Card>
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
