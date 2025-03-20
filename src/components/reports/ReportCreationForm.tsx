
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
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogDescription>
          Configure your report settings and parameters
        </DialogDescription>
      </DialogHeader>
      
      <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ReportBasicInfoFields />
            <ReportTypeSelector />
            <ReportConfigOptions isScheduled={isScheduled} setIsScheduled={setIsScheduled} />
            <ScheduleSelector isScheduled={isScheduled} />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ReportCreationForm;
