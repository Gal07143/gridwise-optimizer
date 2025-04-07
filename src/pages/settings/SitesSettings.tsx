
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSites, deleteSite } from '@/services/sites/siteService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import useConfirm from '@/hooks/useConfirm';
import { Site } from '@/types/energy';

const SitesSettings: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { confirm, ConfirmationDialog } = useConfirm();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sitesData = await getAllSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        toast.error('Failed to load sites');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSites();
  }, []);
  
  const handleDeleteSite = async (siteId: string, siteName: string) => {
    const confirmed = await confirm({
      title: 'Delete Site',
      description: `Are you sure you want to delete ${siteName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      try {
        await deleteSite(siteId);
        toast.success('Site deleted successfully');
        // Remove the site from the state
        setSites(sites.filter(site => site.id !== siteId));
      } catch (error) {
        console.error('Error deleting site:', error);
        toast.error('Failed to delete site');
      }
    }
  };
  
  return (
    <SettingsPageTemplate
      title="Sites Management"
      description="Manage all sites and their settings"
      actions={
        <Button onClick={() => navigate('/settings/sites/add')} className="flex items-center gap-2">
          <Plus size={16} />
          Add Site
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>All Sites</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">Loading sites...</div>
          ) : sites.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No sites found</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/settings/sites/add')}
              >
                Add your first site
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.location}</TableCell>
                    <TableCell>{site.timezone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/${site.id}`)}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/settings/sites/${site.id}`)}>
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSite(site.id, site.name)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">
            Total sites: {sites.length}
          </div>
        </CardFooter>
      </Card>
      
      <ConfirmationDialog />
    </SettingsPageTemplate>
  );
};

export default SitesSettings;
