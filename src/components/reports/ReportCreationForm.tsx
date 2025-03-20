
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

interface ReportCreationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ReportCreationForm: React.FC<ReportCreationFormProps> = ({ onClose, onSuccess }) => {
  const { form, isScheduled, setIsScheduled, onSubmit } = useReportForm({ onSuccess });

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogDescription>
          Configure your report settings and parameters
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <ReportBasicInfoFields />
          <ReportTypeSelector />
          <ReportConfigOptions isScheduled={isScheduled} setIsScheduled={setIsScheduled} />
          <ScheduleSelector isScheduled={isScheduled} />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Report</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ReportCreationForm;
