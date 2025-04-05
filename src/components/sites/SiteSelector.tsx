
import React, { useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Site } from '@/types/site';

interface SiteSelectorProps {
  sites: Site[];
  activeSite?: Site | null;
  setActiveSite: (site: Site) => void;
  loading?: boolean;
  error?: string;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({
  sites,
  activeSite,
  setActiveSite,
  loading = false,
  error
}) => {
  const [open, setOpen] = React.useState(false);

  // If there's only one site, select it automatically
  useEffect(() => {
    if (sites.length === 1 && !activeSite) {
      setActiveSite(sites[0]);
    }
  }, [sites, activeSite, setActiveSite]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading || sites.length === 0}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading sites...</span>
            </div>
          ) : activeSite ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{activeSite.name}</span>
              <span className="text-xs text-muted-foreground">
                {activeSite.location || "No location"}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a site...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search sites..." />
          <CommandEmpty>
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <span>No sites found.</span>
            )}
          </CommandEmpty>
          <CommandGroup>
            {sites.map((site) => (
              <CommandItem
                key={site.id}
                value={site.id}
                onSelect={() => {
                  setActiveSite(site as any);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    activeSite?.id === site.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{site.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {site.location || "No location"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SiteSelector;
