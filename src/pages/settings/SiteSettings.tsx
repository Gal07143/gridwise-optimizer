
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSites } from '@/services/sites/siteService';
import { useSiteContext } from '@/contexts/SiteContext';
import { useSiteActions } from '@/hooks/useSiteActions';
import { PlusCircle, Trash2, Edit, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Site } from '@/types/site';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { Badge } from '@/components/ui/badge';

const SiteSettings = () => {
  const navigate = useNavigate();
  const { setActiveSite } = useSiteContext();
  const { deleteSite, isLoading: isActionLoading, processPendingOperations } = useSiteActions();
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const { isOnline, retryConnection } = useConnectionStatus();
  const [hasPendingOperations, setHasPendingOperations] = useState(false);
  
  // Check for pending operations
  useEffect(() => {
    try {
      const pendingOps = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      setHasPendingOperations(pendingOps.length > 0);
    } catch (error) {
      console.error('Error checking pending operations:', error);
    }
  }, []);
  
const { data: sites = [], isLoading, error, refetch, isFetching } = useQuery({
  queryKey: ['sites'],
  queryFn: getSites,
  retry: isOnline ? 3 : 1,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  meta: {
    onError: (error: Error) => {
      toast.error(`Failed to load sites: ${error.message}`);
    }
  }
});
  
  const onSetActive = (site: Site) => {
    setActiveSite(site);
    toast.success(`${site.name} set as active site`);
  };
  
  const onRefresh = async () => {
    if (!isOnline) {
      toast.error('You are currently offline. Please check your connection and try again.');
      retryConnection();
      return;
    }
    
    toast.info('Refreshing sites list...');
    
    if (hasPendingOperations) {
      const shouldProcess = window.confirm('You have pending site operations that were saved while offline. Do you want to process them now?');
      
      if (shouldProcess) {
        await processPendingOperations();
      }
    }
    
    refetch();
  };
  
  const onConfirmDelete = async () => {
    if (!siteToDelete) return;
    
    if (!isOnline) {
      toast.warning('You are currently offline. This action will be saved and processed when you reconnect.');
    }
    
    const success = await deleteSite(siteToDelete.id);
    if (success) {
      toast.success(`Site "${siteToDelete.name}" ${isOnline ? 'deleted' : 'marked for deletion'} successfully`);
      refetch();
    }
    
    setSiteToDelete(null);
  };
  
  return (
    <SettingsPageTemplate
      title="Site Management"
      description="Add, edit, and manage your energy management sites"
      actions={
        <div className="flex flex-col sm:flex-row gap-2">
          {!isOnline && (
            <Badge variant="outline" className="flex items-center gap-1 border-red-300 text-red-600 dark:text-red-400">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Offline Mode</span>
            </Badge>
          )}
          
          {hasPendingOperations && isOnline && (
            <Button
              variant="outline"
              onClick={processPendingOperations}
              className="flex items-center gap-1 border-amber-300 text-amber-600"
              disabled={isActionLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isActionLoading ? 'animate-spin' : ''}`} />
              Process Pending Changes
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={isFetching} 
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            onClick={() => navigate('/settings/sites/add')}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Site
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading sites...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-300 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Sites</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onRefresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : sites.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Sites Found</CardTitle>
            <CardDescription>
              You haven't added any sites yet. Add your first site to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/settings/sites/add')}
              className="w-full flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Add Your First Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="p-6 flex-grow">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold mb-1">{site.name}</h3>
                    {site.id.startsWith('temp-') && (
                      <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{site.location}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium">Timezone:</span>
                      <span className="ml-1">{site.timezone || 'None'}</span>
                    </div>
                    {(site.lat !== undefined && site.lat !== null && site.lng !== undefined && site.lng !== null) && (
                      <div className="flex items-center">
                        <span className="font-medium">Coordinates:</span>
                        <span className="ml-1">{site.lat}, {site.lng}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex lg:flex-col gap-2 p-4 lg:border-l lg:min-w-48 bg-muted/20">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 flex items-center gap-1"
                    onClick={() => onSetActive(site)}
                  >
                    Set Active
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center gap-1"
                    onClick={() => navigate(`/settings/sites/edit/${site.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center gap-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setSiteToDelete(site)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Footer with connection status */}
          <div className="flex justify-end mt-6 text-sm text-muted-foreground p-2">
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isOnline ? 'Connected' : 'Offline'}</span>
              {isOnline && hasPendingOperations && (
                <span className="ml-2 text-amber-600">(Pending operations available)</span>
              )}
            </div>
          </div>
        </div>
      )}
      
      <AlertDialog open={!!siteToDelete} onOpenChange={(open) => !open && setSiteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this site?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the site
              "{siteToDelete?.name}" and all associated data.
              
              {!isOnline && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <WifiOff className="inline-block h-4 w-4 mr-1" />
                  You are currently offline. This action will be saved locally and processed when you reconnect.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isActionLoading ? 'Deleting...' : 'Delete Site'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsPageTemplate>
  );
};

export default SiteSettings;
