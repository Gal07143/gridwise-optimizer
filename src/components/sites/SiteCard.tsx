
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Edit, Trash2, Calendar, User, Phone, Mail, Ruler } from 'lucide-react';
import { Site } from '@/types/site';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SiteCardProps {
  site: Site;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SiteCard = ({ site, onEdit, onDelete }: SiteCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Determine site type for the badge
  const getSiteType = () => {
    if (!site.energy_category || site.energy_category.length === 0) {
      return site.building_type || 'General';
    }
    
    // Show the first energy category
    return site.energy_category[0].charAt(0).toUpperCase() + site.energy_category[0].slice(1);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold truncate" title={site.name}>
            {site.name}
          </CardTitle>
          <Badge variant="outline">{getSiteType()}</Badge>
        </div>
        {site.address && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate" title={site.address}>
              {site.address}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {site.description && (
            <p className="text-muted-foreground line-clamp-2" title={site.description}>
              {site.description}
            </p>
          )}
          
          <div className="space-y-2 mt-2">
            {site.building_type && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{site.building_type}</span>
              </div>
            )}
            
            {site.area && (
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span>{site.area.toLocaleString()} m²</span>
              </div>
            )}
            
            {site.contact_person && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="truncate" title={site.contact_person}>
                  {site.contact_person}
                </span>
              </div>
            )}
            
            {site.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="truncate" title={site.contact_phone}>
                  {site.contact_phone}
                </span>
              </div>
            )}
            
            {site.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate" title={site.contact_email}>
                  {site.contact_email}
                </span>
              </div>
            )}
            
            {site.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Added: {formatDate(site.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(site.id)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit site details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(site.id)}
                  className="text-destructive hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete this site</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
