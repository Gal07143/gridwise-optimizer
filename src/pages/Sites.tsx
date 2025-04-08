
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MapPin, Calendar, Buildings, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSites } from '@/services/supabase/supabaseService';
import { Site } from '@/types/energy';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

const Sites = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });

  return (
    <Main title="Sites">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sites</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your energy monitoring locations
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link to={`/sites/${site.id}`} className="block p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg">{site.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/sites/${site.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/sites/${site.id}/edit`}>Edit Site</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                      {site.location}
                    </div>
                    {site.created_at && (
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        Added {formatDistanceToNow(new Date(site.created_at), { addSuffix: true })}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Buildings className="h-3.5 w-3.5 mr-2 text-slate-400" />
                      {site.status || 'Active'}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Main>
  );
};

export default Sites;
