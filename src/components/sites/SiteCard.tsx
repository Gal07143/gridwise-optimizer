
import React from 'react';
import { Site } from '@/types/site';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Edit, Trash } from 'lucide-react';

export interface SiteCardProps {
  site: Site;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>{site.name}</span>
          </CardTitle>
          {site.status && (
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${site.status === 'active' ? 'bg-green-100 text-green-800' : ''}
              ${site.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
              ${site.status === 'maintenance' ? 'bg-amber-100 text-amber-800' : ''}
            `}>
              {site.status}
            </div>
          )}
        </div>
        <CardDescription>{site.location}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p>{site.type || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Timezone:</span>
            <p>{site.timezone || 'N/A'}</p>
          </div>
        </div>
        {site.description && (
          <div className="mt-4">
            <span className="text-muted-foreground text-sm">Description:</span>
            <p className="text-sm mt-1">{site.description}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-3">
        {onSelect && (
          <Button variant="default" onClick={onSelect} className="flex-1 mr-2">
            View Details
          </Button>
        )}
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
