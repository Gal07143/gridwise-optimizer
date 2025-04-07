
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ModbusRegisterDefinition, ModbusRegisterMap } from '@/types/modbus';
import { getDefaultRegisterMap } from '@/services/modbus/modbusRegisterService';

interface ModbusRegisterMapProps {
  deviceId: string;
  onSave?: (map: ModbusRegisterMap) => void;
}

export default function ModbusRegisterMapComponent({ deviceId, onSave }: ModbusRegisterMapProps) {
  const [registerMap, setRegisterMap] = useState<ModbusRegisterMap>(getDefaultRegisterMap(deviceId));
  const [newRegister, setNewRegister] = useState({
    name: '',
    address: 0,
    registerType: 'holding',
    dataType: 'int16',
    access: 'read',
    description: ''
  });

  useEffect(() => {
    // If the device ID changes, reset the map
    setRegisterMap(getDefaultRegisterMap(deviceId));
  }, [deviceId]);

  const handleAddRegister = () => {
    if (!newRegister.name) {
      toast.error('Register name is required');
      return;
    }

    const updatedRegisters = [
      ...registerMap.registers,
      {
        ...newRegister,
        address: Number(newRegister.address)
      } as ModbusRegisterDefinition
    ];

    setRegisterMap({
      ...registerMap,
      registers: updatedRegisters
    });

    // Reset the form
    setNewRegister({
      name: '',
      address: 0,
      registerType: 'holding',
      dataType: 'int16',
      access: 'read',
      description: ''
    });

    toast.success('Register added');
  };

  const handleRemoveRegister = (index: number) => {
    const updatedRegisters = [...registerMap.registers];
    updatedRegisters.splice(index, 1);

    setRegisterMap({
      ...registerMap,
      registers: updatedRegisters
    });

    toast.info('Register removed');
  };

  const handleSaveMap = () => {
    if (registerMap.registers.length === 0) {
      toast.warning('Add at least one register before saving');
      return;
    }

    if (onSave) {
      onSave(registerMap);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modbus Register Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label htmlFor="register-name">Register Name</Label>
              <Input
                id="register-name"
                value={newRegister.name}
                onChange={(e) => setNewRegister({ ...newRegister, name: e.target.value })}
                placeholder="e.g., Battery Voltage"
              />
            </div>
            <div>
              <Label htmlFor="register-address">Register Address</Label>
              <Input
                id="register-address"
                type="number"
                value={newRegister.address}
                onChange={(e) => setNewRegister({ ...newRegister, address: parseInt(e.target.value) })}
                placeholder="e.g., 40001"
              />
            </div>
            <div>
              <Label htmlFor="register-type">Register Type</Label>
              <select
                id="register-type"
                className="w-full p-2 border rounded-md"
                value={newRegister.registerType}
                onChange={(e) => setNewRegister({ ...newRegister, registerType: e.target.value as any })}
              >
                <option value="holding">Holding Register</option>
                <option value="input">Input Register</option>
                <option value="coil">Coil</option>
                <option value="discrete">Discrete Input</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label htmlFor="data-type">Data Type</Label>
              <select
                id="data-type"
                className="w-full p-2 border rounded-md"
                value={newRegister.dataType}
                onChange={(e) => setNewRegister({ ...newRegister, dataType: e.target.value as any })}
              >
                <option value="int16">INT16</option>
                <option value="uint16">UINT16</option>
                <option value="int32">INT32</option>
                <option value="uint32">UINT32</option>
                <option value="float32">FLOAT32</option>
                <option value="float64">FLOAT64</option>
                <option value="bit">BIT</option>
              </select>
            </div>
            <div>
              <Label htmlFor="access">Access</Label>
              <select
                id="access"
                className="w-full p-2 border rounded-md"
                value={newRegister.access}
                onChange={(e) => setNewRegister({ ...newRegister, access: e.target.value as any })}
              >
                <option value="read">Read Only</option>
                <option value="write">Write Only</option>
                <option value="read/write">Read/Write</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newRegister.description}
                onChange={(e) => setNewRegister({ ...newRegister, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>

          <Button onClick={handleAddRegister} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Register
          </Button>

          {registerMap.registers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Registers ({registerMap.registers.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registerMap.registers.map((reg, index) => (
                    <TableRow key={index}>
                      <TableCell>{reg.name}</TableCell>
                      <TableCell>{reg.address}</TableCell>
                      <TableCell>{reg.registerType}</TableCell>
                      <TableCell>{reg.dataType}</TableCell>
                      <TableCell>{reg.access}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRegister(index)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button onClick={handleSaveMap} className="mt-4">
                <Save className="mr-2 h-4 w-4" /> Save Map
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
