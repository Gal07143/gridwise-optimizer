
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModbusDataType, ModbusRegisterDefinition, ModbusRegisterMap } from '@/types/modbus';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRegisterMap, saveRegisterMap } from '@/services/modbus/modbusRegisterService';

interface ModbusRegisterMapProps {
  deviceId: string;
}

const ModbusRegisterMap: React.FC<ModbusRegisterMapProps> = ({ deviceId }) => {
  const [registerMap, setRegisterMap] = useState<ModbusRegisterMap>({ 
    device_id: deviceId,
    registers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRegister, setNewRegister] = useState<ModbusRegisterDefinition>({
    name: '',
    address: 0,
    length: 1,
    dataType: 'holding_register',
    unit: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch register map for device on mount
  useEffect(() => {
    const fetchRegisterMap = async () => {
      setLoading(true);
      try {
        const data = await getRegisterMap(deviceId);
        if (data) {
          // Make sure there are registers array
          setRegisterMap(data.registers ? data : { ...data, registers: [] });
        } else {
          // Create empty register map
          setRegisterMap({ 
            device_id: deviceId, 
            registers: [] 
          });
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to load register map:', err);
        setError(err.message || 'Failed to load register map');
        setRegisterMap({ 
          device_id: deviceId, 
          registers: [] 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegisterMap();
  }, [deviceId]);

  // Save register map
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveRegisterMap(deviceId, registerMap);
      setError(null);
    } catch (err: any) {
      console.error('Failed to save register map:', err);
      setError(err.message || 'Failed to save register map');
    } finally {
      setSaving(false);
    }
  };

  // Add new register
  const handleAddRegister = () => {
    if (!newRegister.name) {
      setError('Register name is required');
      return;
    }

    setRegisterMap(prev => ({
      ...prev,
      registers: [...(prev.registers || []), { ...newRegister }]
    }));

    // Reset form
    setNewRegister({
      name: '',
      address: 0,
      length: 1,
      dataType: 'holding_register',
      unit: '',
      description: ''
    });
    
    setError(null);
  };

  // Remove register
  const handleRemoveRegister = (index: number) => {
    setRegisterMap(prev => ({
      ...prev,
      registers: prev.registers.filter((_, i) => i !== index)
    }));
  };

  // Update new register fields
  const handleNewRegisterChange = (field: keyof ModbusRegisterDefinition, value: string | number) => {
    setNewRegister(prev => ({
      ...prev,
      [field]: field === 'address' || field === 'length' ? Number(value) : value
    }));
  };

  if (loading) {
    return <div className="p-4">Loading register map...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Modbus Register Map</CardTitle>
        <CardDescription>Configure the registers for this Modbus device</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Registers</h3>
          {registerMap.registers.length === 0 ? (
            <div className="text-muted-foreground">No registers configured yet.</div>
          ) : (
            <div className="space-y-4">
              {registerMap.registers.map((register, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 p-3 border rounded-md">
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <div className="font-medium">{register.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Address: {register.address}, Length: {register.length}, Type: {register.dataType}
                      </div>
                    </div>
                    {register.description && (
                      <div className="text-sm text-muted-foreground mt-1">{register.description}</div>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveRegister(index)}
                    className="mt-2 md:mt-0"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add Register</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium mb-1">Name</label>
              <Input 
                id="register-name"
                value={newRegister.name}
                onChange={(e) => handleNewRegisterChange('name', e.target.value)}
                placeholder="Register name"
              />
            </div>
            
            <div>
              <label htmlFor="register-address" className="block text-sm font-medium mb-1">Address</label>
              <Input 
                id="register-address"
                type="number"
                min={0}
                value={newRegister.address}
                onChange={(e) => handleNewRegisterChange('address', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="register-length" className="block text-sm font-medium mb-1">Length</label>
              <Input 
                id="register-length"
                type="number"
                min={1}
                value={newRegister.length}
                onChange={(e) => handleNewRegisterChange('length', e.target.value)}
                placeholder="1"
              />
            </div>
            
            <div>
              <label htmlFor="register-type" className="block text-sm font-medium mb-1">Data Type</label>
              <Select
                value={newRegister.dataType}
                onValueChange={(value) => handleNewRegisterChange('dataType', value as ModbusDataType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a register type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="holding_register">Holding Register</SelectItem>
                    <SelectItem value="input_register">Input Register</SelectItem>
                    <SelectItem value="coil">Coil</SelectItem>
                    <SelectItem value="discrete_input">Discrete Input</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="register-unit" className="block text-sm font-medium mb-1">Unit (optional)</label>
              <Input 
                id="register-unit"
                value={newRegister.unit}
                onChange={(e) => handleNewRegisterChange('unit', e.target.value)}
                placeholder="e.g., kW, V, A"
              />
            </div>
            
            <div>
              <label htmlFor="register-scale" className="block text-sm font-medium mb-1">Scaling Factor (optional)</label>
              <Input 
                id="register-scale"
                type="number"
                value={newRegister.scale || ''}
                onChange={(e) => handleNewRegisterChange('scale', e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="register-description" className="block text-sm font-medium mb-1">Description (optional)</label>
            <Input 
              id="register-description"
              value={newRegister.description}
              onChange={(e) => handleNewRegisterChange('description', e.target.value)}
              placeholder="Register description"
            />
          </div>
          
          <Button type="button" onClick={handleAddRegister}>
            Add Register
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Register Map'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModbusRegisterMap;
