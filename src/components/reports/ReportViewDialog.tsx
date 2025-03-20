
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  RefreshCw, 
  Calendar, 
  BarChart, 
  Share, 
  FileText, 
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  TrendingDown,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getReportResults } from '@/services/reports/reportService';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  GeneralReportContent, 
  ConsumptionReportContent, 
  CostReportContent, 
  ProductionReportContent, 
  PerformanceReportContent,
  EfficiencyReportContent 
} from './report-content';

interface ReportViewDialogProps {
  report: any; // Report object
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunReport: (reportId: string) => Promise<void>;
}

const ReportViewDialog: React.FC<ReportViewDialogProps> = ({ 
  report, 
  open, 
  onOpenChange,
  onRunReport
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: reportResults = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['report-results', report.id],
    queryFn: () => getReportResults(report.id),
    enabled: open,
  });

  const latestResult = reportResults?.[0]?.result_data || null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRunReport = async () => {
    setIsRunning(true);
    try {
      await onRunReport(report.id);
      await refetch();
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownload = () => {
    toast.info('Downloading report...');
    // In a real app, implement download functionality
  };

  const handleShare = () => {
    toast.info('Sharing report...');
    // In a real app, implement share functionality
  };

  const getReportIcon = () => {
    switch (report.type) {
      case 'energy_consumption':
        return <TrendingDown className="h-5 w-5 text-energy-orange" />;
      case 'energy_production':
        return <Zap className="h-5 w-5 text-energy-green" />;
      case 'cost_analysis':
        return <DollarSign className="h-5 w-5 text-primary" />;
      case 'device_performance':
        return <BarChart className="h-5 w-5 text-energy-blue" />;
      case 'efficiency_analysis':
        return <PieChart className="h-5 w-5 text-energy-purple" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const renderReportContent = () => {
    if (!latestResult) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No report data available</h3>
          <p className="text-muted-foreground mb-6">
            Run the report to generate data and visualizations
          </p>
          <Button onClick={handleRunReport} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      );
    }

    switch (report.type) {
      case 'energy_consumption':
        return <ConsumptionReportContent data={latestResult} />;
      case 'energy_production':
        return <ProductionReportContent data={latestResult} />;
      case 'cost_analysis':
        return <CostReportContent data={latestResult} />;
      case 'device_performance':
        return <PerformanceReportContent data={latestResult} />;
      case 'efficiency_analysis':
        return <EfficiencyReportContent data={latestResult} />;
      default:
        return <GeneralReportContent data={latestResult} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getReportIcon()}
            <DialogTitle className="text-xl">{report.title}</DialogTitle>
          </div>
          <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline">
              {report.type.replace(/_/g, ' ')}
            </Badge>
            {report.is_template && <Badge variant="secondary">Template</Badge>}
            {report.schedule && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {report.schedule}
              </Badge>
            )}
            {report.last_run_at && (
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last run: {formatDate(report.last_run_at)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {report.description || "No description provided"}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunReport}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">
                {isRunning ? 'Running...' : 'Run Report'}
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        
        {reportResults.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Report Overview</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderReportContent()
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-medium">Report Run History</h3>
                {reportResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No report history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reportResults.map((result, index) => (
                      <Card key={result.id || index} className="hover:bg-accent/50 transition-colors">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium flex justify-between">
                            <span>Report Run #{reportResults.length - index}</span>
                            <span className="text-muted-foreground">
                              {formatDate(result.created_at)}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-1">
                          <div className="flex justify-between items-center">
                            <div>
                              {result.result_data?.summary && (
                                <p className="text-sm">{result.result_data.summary}</p>
                              )}
                            </div>
                            <Button size="sm" variant="outline" onClick={handleDownload}>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {reportResults.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No report data available</h3>
            <p className="text-muted-foreground mb-6">
              Run the report to generate data and visualizations
            </p>
            <Button onClick={handleRunReport} disabled={isRunning}>
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewDialog;
