
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Site } from '@/types/site';
import { useAppStore } from '@/store/appStore';

export interface SiteSelectorProps {
  sites?: Site[];
  activeSite?: Site | null;
  setActiveSite?: (site: Site) => void;
  loading?: boolean;
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({ 
  sites: propSites, 
  activeSite: propActiveSite,
  setActiveSite: propSetActiveSite,
  loading: propLoading 
}) => {
  // Use props if provided, otherwise use from global store
  const {
    sites: storeSites,
    activeSite: storeActiveSite,
    setActiveSite: storeSetActiveSite,
    loading: storeLoading
  } = useAppStore();

  // Use provided props or fall back to store
  const sites = propSites || storeSites;
  const activeSite = propActiveSite !== undefined ? propActiveSite : storeActiveSite;
  const setActiveSite = propSetActiveSite || storeSetActiveSite;
  const loading = propLoading !== undefined ? propLoading : storeLoading;

  // Handle site selection
  const handleSiteChange = (siteId: string) => {
    const selectedSite = sites.find(site => site.id === siteId);
    if (selectedSite) {
      setActiveSite(selectedSite);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loading sites..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="w-full">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="No sites available" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select
        value={activeSite?.id || ''}
        onValueChange={handleSiteChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a site" />
        </SelectTrigger>
        <SelectContent>
          {sites.map(site => (
            <SelectItem key={site.id} value={site.id}>
              {site.name} ({site.location})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SiteSelector;
