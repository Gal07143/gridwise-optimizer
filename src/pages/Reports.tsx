import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, SlidersHorizontal, Calendar, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import ReportCreationForm from '@/components/reports/ReportCreationForm';
import ReportViewDialog from '@/components/reports/ReportViewDialog';

const Reports: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleCreateReport = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsReportViewOpen(true);
  };

  const handleCloseReportView = () => {
    setIsReportViewOpen(false);
    setSelectedReportId(null);
  };

  return (
    <Main title="Reports">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Button onClick={handleCreateReport} className="flex items-center gap-2">
            <Plus size={16} />
            Create Report
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Report List</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search reports..."
                className="max-w-md"
              />
              <Button variant="outline" size="sm">
                <Search size={16} className="mr-2" />
                Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Mock Report Items */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold">Monthly Energy Consumption</h3>
                <p className="text-sm text-muted-foreground">Generated on: 2024-07-20</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary">Consumption</Badge>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport('1')}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-semibold">Solar Production Analysis</h3>
                <p className="text-sm text-muted-foreground">Generated on: 2024-07-15</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary">Production</Badge>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport('2')}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-semibold">System Efficiency Report</h3>
                <p className="text-sm text-muted-foreground">Generated on: 2024-07-10</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary">Efficiency</Badge>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport('3')}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <ReportCreationForm onClose={() => setIsCreateDialogOpen(false)} />
        </Dialog>

        <ReportViewDialog
          open={isReportViewOpen}
          onClose={handleCloseReportView}
          reportId={selectedReportId}
        />
      </div>
    </Main>
  );
};

export default Reports;
