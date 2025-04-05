
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Site } from '@/types/site';
import { MapPin, Calendar, Globe, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface SiteDetailsProps {
  site: Site;
}

const SiteDetails: React.FC<SiteDetailsProps> = ({ site }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Site Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Location:</span>
            </div>
            <p className="text-sm pl-6">{site.location}</p>
            
            {site.lat && site.lng && (
              <p className="text-xs text-muted-foreground pl-6">
                Coordinates: {site.lat.toFixed(6)}, {site.lng.toFixed(6)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Timezone:</span>
            </div>
            <p className="text-sm pl-6">{site.timezone || "Not specified"}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Type:</span>
            </div>
            <p className="text-sm pl-6">{site.type || "Not specified"}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Created:</span>
            </div>
            <p className="text-sm pl-6">
              {site.created_at ? format(new Date(site.created_at), 'PPP') : "Unknown"}
            </p>
          </div>
        </div>
        
        {site.description && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{site.description}</p>
          </div>
        )}

        {site.contact_person && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Contact</h4>
            <p className="text-sm">{site.contact_person}</p>
            {site.contact_phone && <p className="text-sm">{site.contact_phone}</p>}
            {site.contact_email && <p className="text-sm">{site.contact_email}</p>}
          </div>
        )}

        {site.status && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Status</h4>
            <p className="text-sm">{site.status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteDetails;
