
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ModbusReadingResult } from '@/types/modbus';

interface ModbusReadRegisterProps {
  deviceId: string;
  onRead?: (result: ModbusReadingResult) => void;
}

const ModbusReadRegister: React.FC<ModbusReadRegisterProps> = ({ deviceId, onRead }) => {
  const [registerAddress, setRegisterAddress] = useState<number>(40001);
  const [registerType, setRegisterType] = useState<string>("holding");
  const [dataType, setDataType] = useState<string>("uint16");
  const [isReading, setIsReading] = useState<boolean>(false);
  const [readResult, setReadResult] = useState<ModbusReadingResult | null>(null);

  const handleRead = async () => {
    setIsReading(true);
    setReadResult(null);

    try {
      // Simulate reading from a Modbus device
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: ModbusReadingResult = {
        address: registerAddress,
        value: Math.floor(Math.random() * 1000),
        formattedValue: `${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        success: true
      };

      setReadResult(result);
      if (onRead) onRead(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error(String(error));
      
      setReadResult({
        address: registerAddress,
        value: 0,
        formattedValue: "",
        timestamp: new Date().toISOString(),
        success: false,
        error: errorMessage
      });
    } finally {
      setIsReading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Read Register</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Register Address</label>
              <Input
                type="number"
                value={registerAddress}
                onChange={(e) => setRegisterAddress(parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Register Type</label>
              <select
                className="w-full p-2 border rounded"
                value={registerType}
                onChange={(e) => setRegisterType(e.target.value)}
              >
                <option value="holding">Holding Register</option>
                <option value="input">Input Register</option>
                <option value="coil">Coil</option>
                <option value="discrete">Discrete Input</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Data Type</label>
            <select
              className="w-full p-2 border rounded"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="uint16">Unsigned Int (16-bit)</option>
              <option value="int16">Signed Int (16-bit)</option>
              <option value="uint32">Unsigned Int (32-bit)</option>
              <option value="int32">Signed Int (32-bit)</option>
              <option value="float32">Float (32-bit)</option>
            </select>
          </div>
          
          <Button 
            onClick={handleRead} 
            disabled={isReading}
            className="w-full"
          >
            {isReading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reading...
              </>
            ) : (
              'Read Value'
            )}
          </Button>
          
          {readResult && (
            <div className="mt-4 p-3 rounded border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Address:</div>
                <div className="font-mono">{readResult.address}</div>
                
                <div>Value:</div>
                <div className="font-mono">{readResult.success ? readResult.formattedValue : 'Error'}</div>
                
                <div>Timestamp:</div>
                <div className="font-mono">{new Date(readResult.timestamp).toLocaleTimeString()}</div>
                
                {!readResult.success && readResult.error && (
                  <>
                    <div>Error:</div>
                    <div className="font-mono text-destructive">
                      {readResult.error instanceof Error ? readResult.error.message : String(readResult.error)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusReadRegister;
