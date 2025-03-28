import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, BarChart2, Clock, Calendar, Download } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import ReportCreationForm from '@/components/reports/ReportCreationForm';
import ReportViewDialog from '@/components/reports/ReportViewDialog';

// Just implementing the small section that needs fixing
const Reports: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);
  const { activeSite } = useSiteContext();

  return (
    <Main title="Reports">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Reports</CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generated" className="space-y-4">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="generated">
                  <FileText className="h-4 w-4 mr-2" />
                  Generated Reports
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  <Clock className="h-4 w-4 mr-2" />
                  Scheduled Reports
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <Calendar className="h-4 w-4 mr-2" />
                  Report Templates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="generated" className="space-y-4">
                {activeSite ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium">
                            Energy Consumption Report
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingReportId(`report-${i}`)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            Generated on July 11, 2024
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No active site selected.
                  </div>
                )}
              </TabsContent>
              <TabsContent value="scheduled" className="space-y-4">
                <div className="text-center text-muted-foreground">
                  No scheduled reports.
                </div>
              </TabsContent>
              <TabsContent value="templates" className="space-y-4">
                <div className="text-center text-muted-foreground">
                  No report templates available.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {showCreateDialog && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ReportCreationForm 
              onClose={() => setShowCreateDialog(false)}
              onSuccess={() => {
                setShowCreateDialog(false);
                // Refresh reports
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {viewingReportId && (
        <ReportViewDialog
          open={!!viewingReportId}
          reportId={viewingReportId}
          onOpenChange={(open) => {
            if (!open) setViewingReportId(null);
          }}
        />
      )}
    </Main>
  );
};

export default Reports;
