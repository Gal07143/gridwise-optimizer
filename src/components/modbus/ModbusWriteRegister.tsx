
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { writeRegister } from '@/services/modbus/modbusService';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModbusWriteRegisterProps {
  deviceId: string;
}

const ModbusWriteRegister: React.FC<ModbusWriteRegisterProps> = ({ deviceId }) => {
  const [address, setAddress] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [dataType, setDataType] = useState<string>('int16');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleWrite = async () => {
    setLoading(true);
    try {
      // In a real app this would call an actual API
      // Convert dataType to supported modbus register type
      const regType = dataType === 'boolean' ? 'coil' : 'holding_register';
      await writeRegister(deviceId, address, value, regType);
      setResult({ success: true, message: 'Value written successfully' });
      toast.success('Value written successfully');
    } catch (error) {
      console.error('Error writing register:', error);
      toast.error('Failed to write register');
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Modbus Register</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="register-address" className="block text-sm font-medium mb-1">Register Address</label>
              <Input 
                id="register-address"
                type="number"
                value={address}
                onChange={(e) => setAddress(parseInt(e.target.value, 10))}
                min={0}
              />
            </div>
            
            <div>
              <label htmlFor="data-type" className="block text-sm font-medium mb-1">Data Type</label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger id="data-type">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="int16">INT16</SelectItem>
                  <SelectItem value="uint16">UINT16</SelectItem>
                  <SelectItem value="int32">INT32</SelectItem>
                  <SelectItem value="uint32">UINT32</SelectItem>
                  <SelectItem value="float32">FLOAT32</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="register-value" className="block text-sm font-medium mb-1">Value</label>
            <Input 
              id="register-value"
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
            />
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleWrite}
              disabled={loading}
            >
              {loading ? 'Writing...' : 'Write Value'}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.message}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusWriteRegister;
