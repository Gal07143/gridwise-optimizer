
import React from 'react';
import { Site } from '@/types/site';
import SiteCard from './SiteCard';

interface SiteListProps {
  sites: Site[];
  onSelect?: (site: Site) => void;
  onEdit?: (site: Site) => void;
  onDelete?: (id: string) => void;
}

const SiteList: React.FC<SiteListProps> = ({ 
  sites, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  if (sites.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No sites found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <SiteCard
          key={site.id}
          site={site}
          onSelect={onSelect ? () => onSelect(site) : undefined}
          onEdit={onEdit ? () => onEdit(site) : undefined}
          onDelete={onDelete ? () => onDelete(site.id) : undefined}
        />
      ))}
    </div>
  );
};

export default SiteList;
