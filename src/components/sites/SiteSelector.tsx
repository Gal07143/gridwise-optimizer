
import { useEffect, useState } from 'react';
import { Site } from '@/types/site';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useAppStore } from '@/store/appStore';

export interface SiteSelectorProps {
  sites?: Site[];
  activeSite?: Site | null;
  setActiveSite?: (site: Site) => void;
  loading?: boolean;
}

export function SiteSelector({ sites, activeSite, setActiveSite, loading }: SiteSelectorProps = {}) {
  const [open, setOpen] = useState(false);
  
  // Use the app store for sites if not provided via props
  const storeSites = useAppStore(state => state.sites);
  const storeActiveSite = useAppStore(state => state.activeSite);
  const setStoreActiveSite = useAppStore(state => state.setActiveSite);
  const sitesLoading = useAppStore(state => state.sitesLoading);
  
  // Use either provided props or store values
  const sitesToUse = sites || storeSites;
  const activeSiteToUse = activeSite || storeActiveSite;
  const setActiveSiteFunc = setActiveSite || setStoreActiveSite;
  const isLoading = loading !== undefined ? loading : sitesLoading;
  
  // Select the first site when sites load if none is selected
  useEffect(() => {
    if (sitesToUse?.length && !activeSiteToUse && setActiveSiteFunc) {
      setActiveSiteFunc(sitesToUse[0]);
    }
  }, [sitesToUse, activeSiteToUse, setActiveSiteFunc]);

  // Generate a dummy site if none exist
  useEffect(() => {
    if (!isLoading && sitesToUse?.length === 0 && setActiveSiteFunc) {
      const dummySite: Site = {
        id: 'default-site',
        name: 'Demo Site',
        location: 'Default Location',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        type: 'residential',
        status: 'active',
        lat: 37.7749,
        lng: -122.4194,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (useAppStore.setState) {
        useAppStore.setState(state => ({
          ...state,
          sites: [dummySite],
          activeSite: dummySite
        }));
      } else {
        setActiveSiteFunc(dummySite);
      }
    }
  }, [isLoading, sitesToUse, setActiveSiteFunc]);
  
  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between">
        <span className="truncate">Loading sites...</span>
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      </Button>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{activeSiteToUse?.name || "Select site"}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search sites..." className="h-9" />
          <CommandEmpty>No sites found.</CommandEmpty>
          <CommandGroup>
            {sitesToUse?.map((site) => (
              <CommandItem
                key={site.id}
                value={site.id}
                onSelect={() => {
                  setActiveSiteFunc(site);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    activeSiteToUse?.id === site.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {site.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SiteSelector;
