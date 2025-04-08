
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';
import { Site } from '@/types/energy';

interface SiteSelectorProps {
  mini?: boolean;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ mini = false }) => {
  const { sites, currentSite, setCurrentSite } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set the first site as current if nothing is selected
    if (sites.length > 0 && !currentSite) {
      setCurrentSite(sites[0]);
    }
  }, [sites, currentSite, setCurrentSite]);

  const handleSiteChange = (siteId: string) => {
    const selectedSite = sites.find(site => site.id === siteId);
    if (selectedSite) {
      setLoading(true);
      
      // Simulate API call to load site data
      setTimeout(() => {
        setCurrentSite(selectedSite);
        setLoading(false);
        toast.success(`Switched to ${selectedSite.name}`);
      }, 500);
    }
  };

  if (mini) {
    return (
      <Select
        value={currentSite?.id}
        onValueChange={handleSiteChange}
        disabled={loading}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={loading ? "Loading..." : "Select site"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{site.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      value={currentSite?.id}
      onValueChange={handleSiteChange}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Loading..." : "Select site"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{site.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SiteSelector;
