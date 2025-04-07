
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { readRegister } from '@/services/modbus/modbusService';
import { toast } from 'sonner';
import { ModbusReadingResult } from '@/types/modbus';

interface ModbusReadRegisterProps {
  deviceId: string;
}

const ModbusReadRegister: React.FC<ModbusReadRegisterProps> = ({ deviceId }) => {
  const [address, setAddress] = useState<number>(0);
  const [length, setLength] = useState<number>(1);
  const [result, setResult] = useState<ModbusReadingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRead = async () => {
    setLoading(true);
    try {
      // In a real app this would call an actual API
      const readResult = await readRegister(deviceId, address, length);
      setResult(readResult);
    } catch (error) {
      console.error('Error reading register:', error);
      toast.error('Failed to read register');
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Modbus Register</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="register-address" className="block text-sm font-medium mb-1">Register Address</label>
            <Input 
              id="register-address"
              type="number"
              value={address}
              onChange={(e) => setAddress(parseInt(e.target.value, 10))}
              min={0}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="register-length" className="block text-sm font-medium mb-1">Length</label>
            <Input 
              id="register-length"
              type="number"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              min={1}
              max={125}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleRead}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Reading...' : 'Read Register'}
            </Button>
          </div>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className="font-medium">Result</h3>
            {result.success ? (
              <div className="mt-2">
                <p>Value: <span className="font-medium">{result.value}</span></p>
                <p className="text-sm text-muted-foreground mt-1">Timestamp: {new Date(result.timestamp || '').toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-red-600 mt-2">{result.error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModbusReadRegister;
