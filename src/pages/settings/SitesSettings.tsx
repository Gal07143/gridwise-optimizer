import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building, 
  Plus, 
  Trash, 
  Edit, 
  MoreHorizontal, 
  Loader2,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import axios from 'axios';

interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  devices?: number;
  lastUpdated?: string;
}

const fetchSites = async (): Promise<Site[]> => {
  // This would be a real API call in production
  try {
    const response = await axios.get('/api/sites');
    return response.data;
  } catch (error) {
    console.error('Error fetching sites:', error);
    // Return mock data for now
    return [
      {
        id: '1',
        name: 'Main Campus',
        location: 'New York, NY',
        type: 'Commercial',
        status: 'active',
        devices: 12,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'West Building',
        location: 'San Francisco, CA',
        type: 'Industrial',
        status: 'active',
        devices: 8,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Data Center',
        location: 'Austin, TX',
        type: 'Data Center',
        status: 'maintenance',
        devices: 15,
        lastUpdated: new Date().toISOString(),
      },
    ];
  }
};

const SitesSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const { activeSite, setActiveSite } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    type: 'Commercial',
  });
  
  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });
  
  const createSiteMutation = useMutation({
    mutationFn: async (site: Omit<Site, 'id' | 'status'>) => {
      // This would be a real API call in production
      return { id: Date.now().toString(), ...site, status: 'active' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create site');
      console.error('Error creating site:', error);
    },
  });
  
  const updateSiteMutation = useMutation({
    mutationFn: async (site: Site) => {
      // This would be a real API call in production
      return site;
    },
    onSuccess: (updatedSite) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      
      // If the active site was updated, update it in the store
      if (activeSite?.id === updatedSite.id) {
        setActiveSite(updatedSite);
      }
      
      toast.success('Site updated successfully');
      setDialogOpen(false);
      setEditingSite(null);
    },
    onError: (error) => {
      toast.error('Failed to update site');
      console.error('Error updating site:', error);
    },
  });
  
  const deleteSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      // This would be a real API call in production
      return siteId;
    },
    onSuccess: (deletedSiteId) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      
      // If the active site was deleted, set active site to null
      if (activeSite?.id === deletedSiteId) {
        setActiveSite(null);
      }
      
      toast.success('Site deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete site');
      console.error('Error deleting site:', error);
    },
  });
  
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateSite = () => {
    createSiteMutation.mutate(newSite);
  };
  
  const handleUpdateSite = () => {
    if (editingSite) {
      updateSiteMutation.mutate(editingSite);
    }
  };
  
  const handleDeleteSite = (siteId: string) => {
    if (confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      deleteSiteMutation.mutate(siteId);
    }
  };
  
  const openEditDialog = (site: Site) => {
    setEditingSite(site);
    setDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setEditingSite(null);
    resetForm();
    setDialogOpen(true);
  };
  
  const resetForm = () => {
    setNewSite({
      name: '',
      location: '',
      type: 'Commercial',
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editingSite) {
      setEditingSite({
        ...editingSite,
        [name]: value,
      });
    } else {
      setNewSite({
        ...newSite,
        [name]: value,
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-500">Maintenance</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sites</h2>
          <p className="text-muted-foreground">
            Manage your energy monitoring sites
          </p>
        </div>
        <Button 
          onClick={openCreateDialog} 
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </div>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sites by name, location or type..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="text-center py-8 rounded-lg border border-dashed">
          <Building className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No sites found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No sites match your search criteria"
              : "You haven't added any sites yet"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <TableRow key={site.id} className={activeSite?.id === site.id ? "bg-muted/50" : undefined}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>{site.type}</TableCell>
                  <TableCell>{site.devices || 0}</TableCell>
                  <TableCell>{getStatusBadge(site.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(site)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {activeSite?.id !== site.id ? (
                          <DropdownMenuItem onClick={() => setActiveSite(site)}>
                            <Check className="mr-2 h-4 w-4" />
                            Set as active
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Check className="mr-2 h-4 w-4" />
                            Current active site
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteSite(site.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSite ? 'Edit Site' : 'Add New Site'}
            </DialogTitle>
            <DialogDescription>
              {editingSite 
                ? 'Update your site information here.'
                : 'Enter the details for your new site.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editingSite ? editingSite.name : newSite.name}
                onChange={handleFormChange}
                className="col-span-3"
                placeholder="Site name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={editingSite ? editingSite.location : newSite.location}
                onChange={handleFormChange}
                className="col-span-3"
                placeholder="City, State"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <select
                id="type"
                name="type"
                value={editingSite ? editingSite.type : newSite.type}
                onChange={handleFormChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
                <option value="Data Center">Data Center</option>
                <option value="Educational">Educational</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={editingSite ? handleUpdateSite : handleCreateSite}
              disabled={
                createSiteMutation.isPending || 
                updateSiteMutation.isPending ||
                (editingSite
                  ? !editingSite.name || !editingSite.location
                  : !newSite.name || !newSite.location)
              }
            >
              {(createSiteMutation.isPending || updateSiteMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingSite ? 'Save Changes' : 'Create Site'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SitesSettings;
