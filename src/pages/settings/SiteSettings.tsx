
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteById, updateSite, deleteSite } from '@/services/sites/siteService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import useConfirm from '@/hooks/useConfirm';
import { Site } from '@/types/energy';

const SiteSettings: React.FC = () => {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { confirm, ConfirmationDialog } = useConfirm();

  useEffect(() => {
    const fetchSite = async () => {
      if (!siteId) return;
      
      try {
        const siteData = await getSiteById(siteId);
        if (siteData) {
          setSite(siteData);
        } else {
          toast.error('Site not found');
          navigate('/settings/sites');
        }
      } catch (error) {
        console.error('Error fetching site:', error);
        toast.error('Failed to load site details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSite();
  }, [siteId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!site) return;
    
    setSite({
      ...site,
      [name]: value
    });
  };
  
  const handleSave = async () => {
    if (!site || !siteId) return;
    
    setSaving(true);
    try {
      await updateSite(siteId, site);
      toast.success('Site updated successfully');
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error('Failed to update site');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!siteId || !site) return;
    
    const confirmed = await confirm({
      title: 'Delete Site',
      description: `Are you sure you want to delete ${site.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      try {
        await deleteSite(siteId);
        toast.success('Site deleted successfully');
        navigate('/settings/sites');
      } catch (error) {
        console.error('Error deleting site:', error);
        toast.error('Failed to delete site');
      }
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!site) {
    return <div>Site not found</div>;
  }
  
  return (
    <SettingsPageTemplate
      title="Site Settings"
      description="Manage site details and configuration"
      backLink="/settings/sites"
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                name="name"
                value={site.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={site.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                name="timezone"
                value={site.timezone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Site
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
      
      <ConfirmationDialog />
    </SettingsPageTemplate>
  );
};

export default SiteSettings;
