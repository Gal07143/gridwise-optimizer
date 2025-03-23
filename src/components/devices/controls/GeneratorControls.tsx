// src/components/device/controls/GeneratorControls.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface GeneratorControlsProps {
  deviceId: string;
}

const GeneratorControls: React.FC<GeneratorControlsProps> = ({ deviceId }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (label: string, action: () => Promise<void> | void) => {
    try {
      setLoadingAction(label);
      await action();
      toast({ title: `${label} sent successfully` });
    } catch (error) {
      toast({ title: `Failed to ${label.toLowerCase()}`, variant: 'destructive' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Generator Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          disabled={loadingAction !== null}
          onClick={() => handleAction("Start Generator", () => console.log(`Starting generator ${deviceId}`))}
        >
          {loadingAction === "Start Generator" && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Start Generator
        </Button>

        <Button
          variant="secondary"
          disabled={loadingAction !== null}
          onClick={() => handleAction("Stop Generator", () => console.log(`Stopping generator ${deviceId}`))}
        >
          {loadingAction === "Stop Generator" && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Stop Generator
        </Button>

        <Button
          variant="outline"
          disabled={loadingAction !== null}
          onClick={() => handleAction("Run Self-Test", () => console.log(`Running self-test on generator ${deviceId}`))}
        >
          {loadingAction === "Run Self-Test" && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Run Self-Test
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeneratorControls;
