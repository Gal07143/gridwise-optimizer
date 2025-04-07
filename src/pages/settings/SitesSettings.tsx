import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Check, X, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Site } from '@/types/site';
import { getAllSites, createSite, updateSite, deleteSite } from '@/services/siteService';
import SiteForm from '@/components/sites/SiteForm';
import PageHeader from '@/components/layout/PageHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import useConfirm from '@/hooks/useConfirm';

const SitesSettings = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Site>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddingNewSite, setIsAddingNewSite] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const { isOpen, confirm, onConfirm, onCancel } = useConfirm({
    title: "Delete Site",
    message: "Are you sure you want to delete this site? All associated data will be permanently removed. This action cannot be undone."
  });

  useEffect(() => {
    const loadSites = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSites();
        setSites(data);
      } catch (err: any) {
        setError(err.message || 'Error loading sites');
        toast.error('Failed to load sites');
      } finally {
        setIsLoading(false);
      }
    };

    loadSites();
  }, []);

  useEffect(() => {
    // Filter sites based on search query
    let filtered = [...sites];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(query) ||
        site.location.toLowerCase().includes(query) ||
        site.type?.toLowerCase().includes(query) ||
        site.status?.toLowerCase().includes(query)
      );
    }
    
    // Sort sites
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortDirection === 'asc' ? 1 : -1;
      if (!bValue) return sortDirection === 'asc' ? -1 : 1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredSites(filtered);
  }, [sites, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof Site) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateSite = async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Add default values that might be missing
      const completeData = {
        ...siteData,
        lat: siteData.lat || 0,
        lng: siteData.lng || 0,
        timezone: siteData.timezone || 'UTC'
      };
      
      // Now we have all the required fields
      const newSite = await createSite(completeData);
      
      if (newSite) {
        setSites([...sites, newSite]);
        setIsAddingNewSite(false);
        toast.success(`Site "${newSite.name}" has been created`);
      }
    } catch (err: any) {
      toast.error(`Failed to create site: ${err.message}`);
    }
  };

  const handleUpdateSite = async (siteId: string, updates: Partial<Site>) => {
    try {
      // Ensure we have the required fields if they were updated
      if (updates.lat === undefined) updates.lat = sites.find(s => s.id === siteId)?.lat || 0;
      if (updates.lng === undefined) updates.lng = sites.find(s => s.id === siteId)?.lng || 0;
      if (updates.timezone === undefined) updates.timezone = sites.find(s => s.id === siteId)?.timezone || 'UTC';
      
      const updatedSite = await updateSite(siteId, updates);
      if (updatedSite) {
        setSites(sites.map(site => site.id === siteId ? { ...site, ...updatedSite } : site));
        setEditingSiteId(null);
        toast.success(`Site "${updatedSite.name}" has been updated`);
      }
    } catch (err: any) {
      toast.error(`Failed to update site: ${err.message}`);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    try {
      const success = await deleteSite(siteId);
      if (success) {
        setSites(sites.filter(site => site.id !== siteId));
        toast.success('Site has been deleted');
      }
    } catch (err: any) {
      toast.error(`Failed to delete site: ${err.message}`);
    } finally {
      setDeletingSiteId(null);
    }
  };

  const confirmDeleteSite = (siteId: string) => {
    setDeletingSiteId(siteId);
    confirm(() => handleDeleteSite(siteId));
  };

  const getSiteStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Not Set</Badge>;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Sites"
        description="Manage your energy monitoring sites"
        actions={
          <Button onClick={() => setIsAddingNewSite(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Site
          </Button>
        }
      />
      
      {isAddingNewSite && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Site</CardTitle>
            <CardDescription>Enter the details for the new site.</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteForm 
              onSubmit={handleCreateSite}
              onCancel={() => setIsAddingNewSite(false)}
            />
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>
            {filteredSites.length} {filteredSites.length === 1 ? 'site' : 'sites'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sites..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive text-lg font-semibold mb-2">Error</p>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No sites match your search' : 'No sites have been added yet'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
              {!searchQuery && (
                <Button 
                  className="mt-4"
                  onClick={() => setIsAddingNewSite(true)}
                >
                  Add Your First Site
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name 
                      {sortField === 'name' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('location')}
                    >
                      Location
                      {sortField === 'location' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      Type
                      {sortField === 'type' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortField === 'status' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      {editingSiteId === site.id ? (
                        <TableCell colSpan={5}>
                          <SiteForm 
                            initialValues={site}
                            onSubmit={(data) => handleUpdateSite(site.id, data)}
                            onCancel={() => setEditingSiteId(null)}
                          />
                        </TableCell>
                      ) : (
                        <>
                          <TableCell className="font-medium">{site.name}</TableCell>
                          <TableCell>{site.location}</TableCell>
                          <TableCell>{site.type || 'Not specified'}</TableCell>
                          <TableCell>{getSiteStatusBadge(site.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingSiteId(site.id)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Site</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{site.name}"? All associated data will be permanently removed. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteSite(site.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SitesSettings;
