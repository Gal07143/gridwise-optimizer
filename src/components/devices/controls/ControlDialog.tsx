
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Action {
  label: string;
  inputType?: string;
  onSubmit: (value?: any) => void;
}

interface ControlDialogProps {
  title: string;
  description: string;
  actions: Action[];
}

const ControlDialog: React.FC<ControlDialogProps> = ({ 
  title, 
  description, 
  actions 
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleInputChange = (index: number, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleAction = (index: number, action: Action) => {
    if (action.inputType) {
      const value = inputValues[index] || '';
      action.onSubmit(value);
      
      // Show toast
      toast.success(`Command sent: ${action.label} with value ${value}`);
    } else {
      action.onSubmit();
      
      // Show toast
      toast.success(`Command sent: ${action.label}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{action.label}</label>
            </div>
            
            <div className="flex space-x-2">
              {action.inputType && (
                <Input
                  type={action.inputType}
                  value={inputValues[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1"
                />
              )}
              
              <Button 
                onClick={() => handleAction(index, action)}
                variant={action.inputType ? "default" : "outline"}
                className="min-w-[80px]"
              >
                {action.inputType ? "Apply" : "Execute"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="text-xs text-muted-foreground">
          Changes may take a few moments to apply to the device
        </div>
      </CardFooter>
    </Card>
  );
};

export default ControlDialog;
