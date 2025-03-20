
import React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { useReportForm } from './form/useReportForm';
import ReportBasicInfoFields from './form/ReportBasicInfoFields';
import ReportTypeSelector from './form/ReportTypeSelector';
import ReportConfigOptions from './form/ReportConfigOptions';
import ScheduleSelector from './form/ScheduleSelector';
import { X } from 'lucide-react';

interface ReportCreationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ReportCreationForm: React.FC<ReportCreationFormProps> = ({ onClose, onSuccess }) => {
  const { form, isScheduled, setIsScheduled, onSubmit, isSubmitting } = useReportForm({ onSuccess });

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogTitle className="text-xl">Create New Report</DialogTitle>
        <DialogDescription>
          Configure your report settings and parameters
        </DialogDescription>
      </DialogHeader>
      
      <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <ReportBasicInfoFields />
            <ReportTypeSelector />
            <ReportConfigOptions isScheduled={isScheduled} setIsScheduled={setIsScheduled} />
            <ScheduleSelector isScheduled={isScheduled} />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ReportCreationForm;
