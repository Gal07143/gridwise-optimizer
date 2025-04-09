
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { readRegister } from '@/services/modbus/modbusService';
import { ModbusReadingResult } from '@/types/modbus';
import { AlertCircle } from 'lucide-react';

interface Props {
  deviceId: string;
}

const ModbusReadRegister: React.FC<Props> = ({ deviceId }) => {
  const [address, setAddress] = useState<string>('');
  const [reading, setReading] = useState<ModbusReadingResult | null>(null);
  const [isReading, setIsReading] = useState<boolean>(false);

  const handleRead = async () => {
    if (!address || isNaN(parseInt(address))) {
      toast.error('Please enter a valid register address');
      return;
    }

    setIsReading(true);
    try {
      const result = await readRegister(deviceId, parseInt(address));
      setReading(result as ModbusReadingResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setReading({
        address: parseInt(address),
        value: 0,
        formattedValue: 'Error',
        timestamp: new Date().toISOString(),
        success: false,
        error: errorMessage
      });
      toast.error(`Failed to read register: ${errorMessage}`);
    } finally {
      setIsReading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!reading?.error) return null;
    
    const errorMessage = typeof reading.error === 'string' 
      ? reading.error 
      : reading.error.message;
      
    return (
      <div className="mt-2 text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        <span>{errorMessage}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Register Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 40001"
                type="number"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleRead} disabled={isReading}>
                {isReading ? 'Reading...' : 'Read Value'}
              </Button>
            </div>
          </div>
          
          {reading && (
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Address:</span> {reading.address}
              </div>
              {reading.success ? (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Value:</span> {reading.formattedValue}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Timestamp:</span> {new Date(reading.timestamp).toLocaleString()}
                  </div>
                </>
              ) : renderErrorMessage()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusReadRegister;
