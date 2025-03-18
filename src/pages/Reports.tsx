
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Calendar, 
  ChevronDown, 
  Download, 
  FileText, 
  Plus, 
  RefreshCw, 
  Search,
  ClipboardList,
  FileBarChart,
  Share,
  Trash2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import DashboardCard from '@/components/dashboard/DashboardCard';
import SiteSelector from '@/components/sites/SiteSelector';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getReports } from '@/services/reportService';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ReportsPage = () => {
  const navigate = useNavigate();
  const { currentSite } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    data: reports = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['reports', currentSite?.id],
    queryFn: () => getReports({ siteId: currentSite?.id }),
    enabled: !!currentSite
  });
  
  // Filter reports by search query
  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    return (
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  const handleCreateReport = () => {
    // Will implement later
    toast.info("Report creation functionality coming soon!");
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleRunReport = (reportId: string) => {
    toast.info(`Running report ${reportId}...`);
    // Will implement later
  };
  
  const handleDownloadReport = (reportId: string) => {
    toast.info(`Downloading report ${reportId}...`);
    // Will implement later
  };
  
  const handleShareReport = (reportId: string) => {
    toast.info(`Sharing report ${reportId}...`);
    // Will implement later
  };
  
  const handleDeleteReport = (reportId: string) => {
    toast.info(`Deleting report ${reportId}...`);
    // Will implement later
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
                <h1 className="text-2xl font-semibold">Reports</h1>
                <SiteSelector />
              </div>
              <p className="text-muted-foreground mt-1">
                Generate and manage energy management reports
              </p>
            </div>
            <Button 
              onClick={handleCreateReport}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create Report</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DashboardCard title="Available Report Templates" icon={<FileText size={18} />}>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {reports.filter(r => r.is_template).length}
                </div>
                <Button variant="outline" size="sm" onClick={handleCreateReport}>
                  <Plus size={14} className="mr-1" />
                  New Template
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Recent Reports" icon={<ClipboardList size={18} />}>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {reports.filter(r => !r.is_template).length}
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Scheduled Reports" icon={<Calendar size={18} />}>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {reports.filter(r => r.schedule).length}
                </div>
                <Button variant="outline" size="sm" onClick={handleCreateReport}>
                  <Plus size={14} className="mr-1" />
                  Schedule New
                </Button>
              </div>
            </DashboardCard>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ChevronDown size={16} />
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Name (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-2/3 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <GlassPanel className="p-8 text-center">
              <FileBarChart size={32} className="mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search query"
                  : "Get started by creating your first report"}
              </p>
              <Button onClick={handleCreateReport}>
                <Plus size={16} className="mr-1" />
                Create Report
              </Button>
            </GlassPanel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="relative overflow-hidden">
                  {report.is_template && (
                    <Badge 
                      className="absolute top-2 right-2 z-10"
                      variant="secondary"
                    >
                      Template
                    </Badge>
                  )}
                  {report.schedule && (
                    <Badge 
                      className="absolute top-2 right-[70px] z-10"
                      variant="outline"
                    >
                      <Calendar size={12} className="mr-1" />
                      Scheduled
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart size={18} className="mr-2 text-primary" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>
                      {report.type} • Created {formatDate(report.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description || "No description provided"}
                    </p>
                    {report.last_run_at && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last run: {formatDate(report.last_run_at)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunReport(report.id)}
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Run Now
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown size={14} />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRunReport(report.id)}>
                          <RefreshCw size={14} className="mr-2" />
                          Run Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReport(report.id)}>
                          <Download size={14} className="mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareReport(report.id)}>
                          <Share size={14} className="mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
