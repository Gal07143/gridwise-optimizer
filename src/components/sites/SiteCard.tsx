
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, MapPin, MoreHorizontal, Trash2, User } from 'lucide-react';
import { getSiteUsers } from '@/services/sites/siteStats';
import { Site } from '@/types/energy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SiteCardProps {
  site: Site;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SiteCard = ({ site, onEdit, onDelete }: SiteCardProps) => {
  const { data: userCount = 0 } = useQuery({
    queryKey: ['site-users', site.id],
    queryFn: () => getSiteUsers(site.id),
  });

  return (
    <Card key={site.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{site.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin size={14} className="mr-1" />
              {site.location}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(site.id)}>
                <Edit size={14} className="mr-2" />
                Edit Site
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(site.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={14} className="mr-2" />
                Delete Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-2">
          <div>Timezone: {site.timezone}</div>
          {site.lat && site.lng && (
            <div>
              Coordinates: {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <User size={14} className="mr-1" />
          <span>{userCount} Users</span>
        </div>
        <Badge variant="outline">Active</Badge>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
