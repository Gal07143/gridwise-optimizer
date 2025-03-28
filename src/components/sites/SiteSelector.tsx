import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Site } from '@/types/energy';
import { useSiteContext } from '@/contexts/SiteContext';

interface SiteSelectorProps {
  onSiteChange?: (site: Site) => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ onSiteChange }) => {
  const { sites, activeSite, setActiveSite, loading, error } = useSiteContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (activeSite && onSiteChange) {
      onSiteChange(activeSite);
    }
  }, [activeSite, onSiteChange]);

  const handleSiteChange = (siteId: string) => {
    const selectedSite = sites.find((site) => site.id === siteId);
    if (selectedSite) {
      setActiveSite(selectedSite);
      if (onSiteChange) {
        onSiteChange(selectedSite);
      }
      toast.success(`Active site changed to ${selectedSite.name}`);
    }
  };

  const handleAddSite = () => {
    navigate('/settings/sites/add');
  };

  if (loading) {
    return <p>Loading sites...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex items-center space-x-4">
      <Select open={open} onOpenChange={setOpen} value={activeSite?.id} onValueChange={handleSiteChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a site" />
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={handleAddSite}>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SiteSelector;
