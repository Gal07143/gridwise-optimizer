
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Site } from '@/types/energy';
import { getSites, deleteSite } from '@/services/sites/siteService';
import { useSiteContext } from '@/contexts/SiteContext';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const SiteSettings: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSites } = useSiteContext();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  
  useEffect(() => {
    fetchSites();
  }, []);
  
  const fetchSites = async () => {
    try {
      setLoading(true);
      const result = await getSites();
      setSites(result);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching sites:", error);
      setError(error instanceof Error ? error : new Error(error?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSite = () => {
    navigate('/settings/sites/add');
  };
  
  const handleEditSite = (siteId: string) => {
    navigate(`/settings/sites/edit/${siteId}`);
  };
  
  const confirmDelete = (site: Site) => {
    setSiteToDelete(site);
    setShowDeleteConfirm(true);
  };
  
  const handleDelete = async () => {
    if (!siteToDelete) return;
    
    try {
      const success = await deleteSite(siteToDelete.id);
      if (success) {
        toast.success(`Site "${siteToDelete.name}" deleted successfully`);
        fetchSites();
        refreshSites(); // Update the site context
        setShowDeleteConfirm(false);
        setSiteToDelete(null);
      }
    } catch (error: any) {
      console.error("Error deleting site:", error);
      toast.error(`Failed to delete site: ${error?.message || 'Unknown error'}`);
    }
  };
  
  return (
    <SettingsPageTemplate
      title="Site Management"
      description="Add, edit, and remove sites from your account."
      actions={
        <Button onClick={handleAddSite} className="flex items-center gap-2">
          <Plus size={16} />
          Add Site
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Sites</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchSites}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sites found. Click the "Add Site" button to create your first site.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.location}</TableCell>
                    <TableCell>{site.timezone}</TableCell>
                    <TableCell>{new Date(site.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditSite(site.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => confirmDelete(site)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Site"
        description={`Are you sure you want to delete "${siteToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </SettingsPageTemplate>
  );
};

export default SiteSettings;
