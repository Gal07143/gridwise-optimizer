
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
  Trash2,
  DollarSign,
  Zap,
  PieChart,
  TrendingDown
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GlassPanel from '@/components/ui/GlassPanel';
import DashboardCard from '@/components/dashboard/DashboardCard';
import SiteSelector from '@/components/sites/SiteSelector';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllReports, deleteReport, runReport } from '@/services/reports/reportService';
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
import { Dialog } from '@/components/ui/dialog';
import ReportCreationForm from '@/components/reports/ReportCreationForm';
import ReportViewDialog from '@/components/reports/ReportViewDialog';

const ReportsPage = () => {
  const navigate = useNavigate();
  const { currentSite } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const {
    data: reports = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['reports', currentSite?.id],
    queryFn: () => getAllReports({ siteId: currentSite?.id }),
    enabled: !!currentSite
  });
  
  // Filter reports by search query and active filter
  const filteredReports = reports.filter(report => {
    if (!searchQuery && activeFilter === 'all') return true;
    
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'templates' && report.is_template) ||
      (activeFilter === 'scheduled' && report.schedule) ||
      (activeFilter === 'consumption' && report.type === 'energy_consumption') ||
      (activeFilter === 'cost' && report.type === 'cost_analysis') ||
      (activeFilter === 'production' && report.type === 'energy_production');
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'last-run') {
      if (!a.last_run_at) return 1;
      if (!b.last_run_at) return -1;
      return new Date(b.last_run_at).getTime() - new Date(a.last_run_at).getTime();
    }
    return 0;
  });
  
  const handleCreateReport = () => {
    setIsCreatingReport(true);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleRunReport = async (reportId) => {
    toast.promise(runReport(reportId), {
      loading: 'Running report...',
      success: 'Report completed successfully',
      error: 'Failed to run report'
    });
    
    await refetch();
  };
  
  const handleViewReport = (report) => {
    setSelectedReport(report);
  };
  
  const handleDownloadReport = (reportId) => {
    toast.info(`Downloading report ${reportId}...`);
    // Will implement download functionality
  };
  
  const handleShareReport = (reportId) => {
    toast.info(`Sharing report ${reportId}...`);
    // Will implement sharing functionality 
  };
  
  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await deleteReport(reportId);
      toast.success('Report deleted successfully');
      refetch();
    }
  };

  const reportTypeIcons = {
    energy_production: <Zap size={18} className="mr-2 text-energy-green" />,
    energy_consumption: <TrendingDown size={18} className="mr-2 text-energy-orange" />,
    cost_analysis: <DollarSign size={18} className="mr-2 text-primary" />,
    device_performance: <BarChart size={18} className="mr-2 text-energy-blue" />,
    efficiency_analysis: <PieChart size={18} className="mr-2 text-energy-purple" />
  };
  
  const getReportTypeColor = (type) => {
    switch (type) {
      case 'energy_production': return 'bg-energy-green/10 text-energy-green';
      case 'energy_consumption': return 'bg-energy-orange/10 text-energy-orange';
      case 'cost_analysis': return 'bg-primary/10 text-primary';
      case 'device_performance': return 'bg-energy-blue/10 text-energy-blue';
      case 'efficiency_analysis': return 'bg-energy-purple/10 text-energy-purple';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Energy Reports</h1>
              <SiteSelector />
            </div>
            <p className="text-muted-foreground mt-1">
              Generate insights and track energy consumption, production, and costs
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard title="Templates" icon={<FileText size={18} />}>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {reports.filter(r => r.is_template).length}
              </div>
              <Button variant="outline" size="sm" onClick={() => { setIsCreatingReport(true); }}>
                <Plus size={14} className="mr-1" />
                New
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Consumption Reports" icon={<TrendingDown size={18} />}>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {reports.filter(r => r.type === 'energy_consumption').length}
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveFilter('consumption')}>
                <Search size={14} className="mr-1" />
                View
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Cost Reports" icon={<DollarSign size={18} />}>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {reports.filter(r => r.type === 'cost_analysis').length}
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveFilter('cost')}>
                <Search size={14} className="mr-1" />
                View
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Scheduled Reports" icon={<Calendar size={18} />}>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {reports.filter(r => r.schedule).length}
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveFilter('scheduled')}>
                <Search size={14} className="mr-1" />
                View
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
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'templates' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('templates')}
            >
              Templates
            </Button>
            <Button 
              variant={activeFilter === 'scheduled' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('scheduled')}
            >
              Scheduled
            </Button>
            <Button 
              variant={activeFilter === 'consumption' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('consumption')}
            >
              Consumption
            </Button>
            <Button 
              variant={activeFilter === 'cost' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('cost')}
            >
              Cost
            </Button>
            <Button 
              variant={activeFilter === 'production' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('production')}
            >
              Production
            </Button>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronDown size={16} />
                  <span>Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'alphabetical' ? 'A-Z' : 'Last Run'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('last-run')}>
                  Last Run
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
              {searchQuery || activeFilter !== 'all'
                ? "No reports match your current filters"
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
              <Card key={report.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
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
                    {reportTypeIcons[report.type] || <BarChart size={18} className="mr-2 text-primary" />}
                    {report.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 items-center mt-1">
                    <Badge className={`${getReportTypeColor(report.type)} text-xs`}>
                      {report.type.replace(/_/g, ' ')}
                    </Badge>
                    <span>Created {formatDate(report.created_at)}</span>
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
                    onClick={() => handleViewReport(report)}
                  >
                    <FileText size={14} className="mr-1" />
                    View
                  </Button>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunReport(report.id)}
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Run
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
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isCreatingReport} onOpenChange={setIsCreatingReport}>
        <ReportCreationForm 
          onClose={() => setIsCreatingReport(false)}
          onSuccess={() => {
            setIsCreatingReport(false);
            refetch();
          }}
        />
      </Dialog>
      
      {selectedReport && (
        <ReportViewDialog 
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={(open) => {
            if (!open) setSelectedReport(null);
          }}
          onRunReport={handleRunReport}
        />
      )}
    </AppLayout>
  );
};

export default ReportsPage;
