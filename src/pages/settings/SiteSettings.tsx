
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Site } from '@/types/site';
import { getSiteById, updateSite, deleteSite } from '@/services/siteService';
import SiteForm from '@/components/sites/SiteForm';
import PageHeader from '@/components/layout/PageHeader';
import useConfirm from '@/hooks/useConfirm';
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

const SiteSettings = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, confirm, onConfirm, onCancel } = useConfirm({
    title: "Delete Site",
    message: "Are you sure you want to delete this site? All associated data will be permanently removed. This action cannot be undone."
  });

  useEffect(() => {
    const loadSite = async () => {
      try {
        setIsLoading(true);
        if (siteId) {
          const siteData = await getSiteById(siteId);
          if (siteData) {
            setSite(siteData);
          } else {
            setError('Site not found');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error loading site');
        toast.error('Failed to load site');
      } finally {
        setIsLoading(false);
      }
    };

    loadSite();
  }, [siteId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async (updatedSite: Partial<Site>) => {
    if (!site || !siteId) return;
    
    try {
      await updateSite(siteId, updatedSite);
      // Update the site after successful API call
      setSite({ ...site, ...updatedSite });
      setIsEditing(false);
      toast.success('Site updated successfully');
    } catch (err: any) {
      toast.error(`Failed to update site: ${err.message}`);
    }
  };

  const handleDelete = () => {
    confirm(async () => {
      if (!siteId) return;
      
      try {
        const success = await deleteSite(siteId);
        if (success) {
          toast.success('Site deleted successfully');
          navigate('/settings/sites');
        }
      } catch (err: any) {
        toast.error(`Failed to delete site: ${err.message}`);
      }
    });
  };

  const handleBack = () => {
    navigate('/settings/sites');
  };

  // Determine location and type from either property
  const location = site?.location || (site ? `${site.address || ''}, ${site.city || ''}, ${site.state || ''}` : '');
  const siteType = site?.type || site?.site_type;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Site Settings"
        description={site?.name || 'Loading site information...'}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sites
            </Button>
            {site && !isEditing && (
              <>
                <Button variant="outline" onClick={handleEditToggle}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit Site
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash className="h-4 w-4 mr-2" /> Delete Site
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Site</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this site? All associated data will be permanently removed. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {isEditing && (
              <Button variant="outline" onClick={handleEditToggle}>
                <Check className="h-4 w-4 mr-2" /> Cancel Editing
              </Button>
            )}
          </div>
        }
      />
      
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive text-lg font-semibold mb-2">Error</p>
              <p className="text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={handleBack}>Return to Sites</Button>
            </div>
          </CardContent>
        </Card>
      ) : site ? (
        <>
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Site</CardTitle>
                <CardDescription>Make changes to the site information below.</CardDescription>
              </CardHeader>
              <CardContent>
                <SiteForm
                  initialValues={site}
                  onSubmit={handleUpdate}
                  onCancel={handleEditToggle}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                  <CardDescription>Basic details about this site.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Name</div>
                      <div>{site.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Location</div>
                      <div>{location || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Type</div>
                      <div>{siteType || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <div>{site.status || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Building Type</div>
                      <div>{site.building_type || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Area</div>
                      <div>{site.area ? `${site.area} m²` : 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Contact details for this site.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
                      <div>{site.contact_person || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Email</div>
                      <div>{site.contact_email || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Phone</div>
                      <div>{site.contact_phone || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Address</div>
                      <div>{site.address || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Timezone</div>
                      <div>{site.timezone || 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Site not found</p>
              <Button className="mt-4" onClick={handleBack}>Return to Sites</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SiteSettings;
