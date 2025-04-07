
import React from 'react';
import { Site } from '@/types/site';
import SiteCard from './SiteCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteListProps {
  sites: Site[];
  isLoading?: boolean;
  error?: Error | null;
  onEditSite: (site: Site) => void;
  onDeleteSite: (site: Site) => void;
  onSelectSite: (site: Site) => void;
}

const SiteList: React.FC<SiteListProps> = ({
  sites,
  isLoading = false,
  error = null,
  onEditSite,
  onDeleteSite,
  onSelectSite
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <Skeleton className="h-7 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium mb-1">Error loading sites</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!sites.length) {
    return (
      <div className="border border-dashed rounded-lg p-6 text-center text-muted-foreground">
        <p>No sites found. Create your first site to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sites.map((site) => (
        <SiteCard
          key={site.id}
          site={site}
          onSelect={() => onSelectSite(site)}
          onEdit={() => onEditSite(site)}
          onDelete={() => onDeleteSite(site)}
        />
      ))}
    </div>
  );
};

export default SiteList;
