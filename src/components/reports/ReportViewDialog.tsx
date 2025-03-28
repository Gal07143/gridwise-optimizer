import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface ReportViewDialogProps {
  open: boolean;
  reportId: string;
  onOpenChange: (open: boolean) => void;
}

const ReportViewDialog: React.FC<ReportViewDialogProps> = ({ 
  open, 
  reportId,
  onOpenChange
}) => {
  // Implementation here
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Report Viewer</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="bg-muted p-8 rounded-md min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Report content for ID: {reportId}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewDialog;
