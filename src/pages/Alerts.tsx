
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  Info, 
  Search, 
  SlidersHorizontal,
  MessageCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import { getAlerts, acknowledgeAlert } from '@/services/alertService';
import { Alert, AlertType } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SiteSelector from '@/components/sites/SiteSelector';
import { useSite } from '@/contexts/SiteContext';
import { Input } from '@/components/ui/input';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from 'sonner';

const AlertIconMap: Record<AlertType, React.ReactNode> = {
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  critical: <AlertTriangle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />
};

const AlertsPage = () => {
  const navigate = useNavigate();
  const { currentSite } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAcknowledged, setFilterAcknowledged] = useState<boolean | null>(null);
  const [filterType, setFilterType] = useState<AlertType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  
  const {
    data: alerts = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['alerts', currentSite?.id, filterAcknowledged, filterType, currentPage],
    queryFn: () => getAlerts({
      deviceId: undefined, // We'll filter by site later
      acknowledged: filterAcknowledged !== null ? filterAcknowledged : undefined,
      type: filterType || undefined,
      limit: 100 // Get all and filter client-side for now
    }),
    enabled: !!currentSite
  });
  
  // Filter alerts client-side
  const filteredAlerts = alerts
    .filter(alert => {
      // Filter by site
      if (currentSite && alert.device_id) {
        // This is a simplification. In a real app, we'd check if the device belongs to the site
        // For now, we're assuming all alerts are relevant to the current site
        return true;
      }
      
      // If no site is selected, show all alerts
      return !currentSite;
    })
    .filter(alert => {
      // Filter by search query
      if (!searchQuery) return true;
      return alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
  // Pagination
  const totalAlerts = filteredAlerts.length;
  const totalPages = Math.ceil(totalAlerts / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const handleAcknowledge = async (alertId: string) => {
    try {
      const success = await acknowledgeAlert(alertId);
      if (success) {
        toast.success("Alert acknowledged");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterAcknowledged(null);
    setFilterType(null);
    setCurrentPage(0);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTimeSince = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">System Alerts</h1>
                <SiteSelector />
              </div>
              <p className="text-muted-foreground mt-1">
                Monitor and manage system alerts and notifications
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <DashboardCard 
              title="Critical Alerts" 
              icon={<AlertTriangle className="text-red-500" size={18} />}
              className="bg-red-950/10"
            >
              <div className="flex flex-col items-center justify-center h-20">
                <div className="text-3xl font-bold text-red-500">
                  {filteredAlerts.filter(a => a.type === 'critical' && !a.acknowledged).length}
                </div>
                <div className="text-sm text-muted-foreground">Unacknowledged</div>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Warning Alerts" 
              icon={<AlertTriangle className="text-amber-500" size={18} />}
              className="bg-amber-950/10"
            >
              <div className="flex flex-col items-center justify-center h-20">
                <div className="text-3xl font-bold text-amber-500">
                  {filteredAlerts.filter(a => a.type === 'warning' && !a.acknowledged).length}
                </div>
                <div className="text-sm text-muted-foreground">Unacknowledged</div>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Info Alerts" 
              icon={<Info className="text-blue-500" size={18} />}
              className="bg-blue-950/10"
            >
              <div className="flex flex-col items-center justify-center h-20">
                <div className="text-3xl font-bold text-blue-500">
                  {filteredAlerts.filter(a => a.type === 'info' && !a.acknowledged).length}
                </div>
                <div className="text-sm text-muted-foreground">Unacknowledged</div>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Total Alerts" 
              icon={<MessageCircle size={18} />}
            >
              <div className="flex flex-col items-center justify-center h-20">
                <div className="text-3xl font-bold">
                  {filteredAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">All alerts</div>
              </div>
            </DashboardCard>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground">
                    Status
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={filterAcknowledged === false}
                    onCheckedChange={() => setFilterAcknowledged(prev => prev === false ? null : false)}
                  >
                    Unacknowledged
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterAcknowledged === true}
                    onCheckedChange={() => setFilterAcknowledged(prev => prev === true ? null : true)}
                  >
                    Acknowledged
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground">
                    Alert Type
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={filterType === 'critical'}
                    onCheckedChange={() => setFilterType(prev => prev === 'critical' ? null : 'critical')}
                  >
                    Critical
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterType === 'warning'}
                    onCheckedChange={() => setFilterType(prev => prev === 'warning' ? null : 'warning')}
                  >
                    Warning
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterType === 'info'}
                    onCheckedChange={() => setFilterType(prev => prev === 'info' ? null : 'info')}
                  >
                    Info
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <GlassPanel className="mb-6">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <div>Loading alerts...</div>
              </div>
            ) : paginatedAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-2 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No alerts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterAcknowledged !== null || filterType !== null
                    ? "Try adjusting your filters"
                    : "System is running smoothly with no alerts"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Message</th>
                      <th className="text-left p-4 font-medium">Time</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-border hover:bg-secondary/20">
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {AlertIconMap[alert.type]}
                            <span className="ml-2 capitalize">{alert.type}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-muted-foreground">Device ID: {alert.device_id}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <Clock size={14} className="mr-1 text-muted-foreground" />
                            <div>
                              <div>{formatTimestamp(alert.timestamp)}</div>
                              <div className="text-xs text-muted-foreground">{getTimeSince(alert.timestamp)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {alert.acknowledged ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              <CheckCircle size={12} className="mr-1" />
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                              Unacknowledged
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {!alert.acknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => { 
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(0, prev - 1));
                        }}
                        aria-disabled={currentPage === 0}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#"
                          isActive={currentPage === i}
                          onClick={(e) => { 
                            e.preventDefault();
                            setCurrentPage(i);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => { 
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
                        }}
                        aria-disabled={currentPage >= totalPages - 1}
                        className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
