
import React, { useState } from 'react';
import { Check, ChevronsUpDown, MapPin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Site } from '@/types/energy';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/contexts/SiteContext';
import { cn } from '@/lib/utils';

interface SiteSelectorProps {
  className?: string;
  showAddOption?: boolean;
}

const SiteSelector = ({ className, showAddOption = true }: SiteSelectorProps) => {
  const { currentSite, sites, setCurrentSite } = useSite();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentSite) {
    return <div className="h-10 w-[200px] skeleton" />;
  }

  const handleSelectSite = (site: Site) => {
    setCurrentSite(site);
    setOpen(false);
  };

  const handleAddSite = () => {
    setOpen(false);
    navigate('/settings/sites/add');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="truncate">{currentSite?.name}</span>
          </div>
          <ChevronsUpDown size={16} className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sites..." />
          <CommandEmpty>No sites found.</CommandEmpty>
          <CommandList>
            <CommandGroup heading="Sites">
              {sites.map((site) => (
                <CommandItem
                  key={site.id}
                  onSelect={() => handleSelectSite(site)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentSite?.id === site.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{site.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {showAddOption && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleAddSite}
                    className="cursor-pointer text-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Site
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SiteSelector;
