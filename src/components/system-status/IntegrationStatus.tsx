
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Integration } from '@/services/systemStatusService';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, ChevronDown, Search, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationStatusProps {
  integrations: Integration[];
  isLoading?: boolean;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ 
  integrations = [], 
  isLoading = false 
}) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sort + Filter integrations
  const filteredIntegrations = integrations
    .filter(integration => {
      const matchesSearchFilter = integration.name.toLowerCase().includes(filter.toLowerCase()) ||
        integration.type.toLowerCase().includes(filter.toLowerCase());
      
      const matchesStatusFilter = 
        statusFilter === 'all' || 
        integration.status === statusFilter;
      
      return matchesSearchFilter && matchesStatusFilter;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valA, valB;
      
      switch (sortBy) {
        case 'name':
          valA = a.name;
          valB = b.name;
          break;
        case 'type':
          valA = a.type;
          valB = b.type;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        case 'latency':
          valA = a.latency || 0;
          valB = b.latency || 0;
          break;
        case 'successRate':
          valA = a.successRate || 0;
          valB = b.successRate || 0;
          break;
        default:
          return 0;
      }
      
      const comparison = typeof valA === 'string' 
        ? valA.localeCompare(valB as string)
        : (valA as number) - (valB as number);
        
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">
            <XCircle className="h-3.5 w-3.5 mr-1" /> Offline
          </Badge>
        );
      case 'degraded':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Degraded
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Integration Status</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="online">Online</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="degraded">Degraded</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="offline">Offline</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" className="w-full md:w-auto" disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center">
                      Integration
                      {sortBy === 'name' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('type')} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center">
                      Type
                      {sortBy === 'type' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('status')} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('latency')} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center">
                      Latency
                      {sortBy === 'latency' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('successRate')} className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-right">
                    <div className="flex items-center justify-end">
                      Success Rate
                      {sortBy === 'successRate' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Last Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIntegrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No integrations found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIntegrations.map((integration) => (
                    <TableRow key={integration.id} className="group">
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell className="capitalize">{integration.type}</TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell>
                        {integration.latency ? (
                          <span className={cn(
                            integration.latency < 100 ? "text-green-600 dark:text-green-400" :
                            integration.latency < 250 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {integration.latency} ms
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {integration.successRate !== undefined ? (
                          <span className={cn(
                            integration.successRate > 99 ? "text-green-600 dark:text-green-400" :
                            integration.successRate > 95 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {integration.successRate.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(integration.lastSync).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationStatus;
