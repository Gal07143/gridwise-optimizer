
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getModbusRegisterMap } from '@/services/modbus/modbusRegisterService';
import { ModbusRegisterMap, ModbusDataType } from '@/types/modbus';

interface ModbusRegisterMapProps {
  deviceId: string;
  onUpdate?: (registerMap: ModbusRegisterMap) => void;
  editable?: boolean;
}

const ModbusRegisterMapComponent: React.FC<ModbusRegisterMapProps> = ({ deviceId, onUpdate, editable = false }) => {
  const [registerMap, setRegisterMap] = useState<ModbusRegisterMap>({ registers: {} });
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingRegister, setEditingRegister] = useState<string | null>(null);
  const [newRegister, setNewRegister] = useState({
    address: '',
    name: '',
    length: '1',
    scale: '1',
    type: 'holding_register' as ModbusDataType
  });

  useEffect(() => {
    const loadRegisterMap = async () => {
      setLoading(true);
      try {
        const map = await getModbusRegisterMap(deviceId);
        // Ensure the map has a registers property
        setRegisterMap(map || { registers: {} });
      } catch (error) {
        console.error('Error loading Modbus register map:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRegisterMap();
  }, [deviceId]);

  const handleAddRegister = () => {
    if (!newRegister.address || !newRegister.name) return;
    
    const address = newRegister.address;
    const updatedMap = { ...registerMap };
    
    if (!updatedMap.registers) {
      updatedMap.registers = {};
    }
    
    updatedMap.registers[address] = {
      name: newRegister.name,
      length: parseInt(newRegister.length),
      scale: parseFloat(newRegister.scale),
      type: newRegister.type
    };
    
    setRegisterMap(updatedMap);
    setNewRegister({
      address: '',
      name: '',
      length: '1',
      scale: '1',
      type: 'holding_register'
    });
    
    if (onUpdate) {
      onUpdate(updatedMap);
    }
  };

  const handleSaveEdit = (address: string) => {
    // Implementation of save edit logic
    setEditingRegister(null);
  };

  const handleRemoveRegister = (address: string) => {
    const updatedMap = { ...registerMap };
    if (updatedMap.registers && updatedMap.registers[address]) {
      delete updatedMap.registers[address];
      setRegisterMap(updatedMap);
      
      if (onUpdate) {
        onUpdate(updatedMap);
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading register map...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Register Map</h3>
        {editable && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'View Mode' : 'Edit Mode'}
          </Button>
        )}
      </div>
      
      <Table>
        <TableCaption>Modbus Register Mapping for Device</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Length</TableHead>
            <TableHead>Scale</TableHead>
            <TableHead>Type</TableHead>
            {editMode && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {registerMap.registers && Object.entries(registerMap.registers).map(([address, register]) => (
            <TableRow key={address}>
              <TableCell>{address}</TableCell>
              <TableCell>{register.name}</TableCell>
              <TableCell>{register.length}</TableCell>
              <TableCell>{register.scale}</TableCell>
              <TableCell>{register.type}</TableCell>
              {editMode && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRegister(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRegister(address)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          
          {/* Add new register row */}
          {editMode && (
            <TableRow>
              <TableCell>
                <Input
                  placeholder="Address"
                  value={newRegister.address}
                  onChange={(e) => setNewRegister({ ...newRegister, address: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Name"
                  value={newRegister.name}
                  onChange={(e) => setNewRegister({ ...newRegister, name: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Length"
                  value={newRegister.length}
                  onChange={(e) => setNewRegister({ ...newRegister, length: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Scale"
                  value={newRegister.scale}
                  onChange={(e) => setNewRegister({ ...newRegister, scale: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={newRegister.type}
                  onValueChange={(value) => setNewRegister({ 
                    ...newRegister, 
                    type: value as ModbusDataType 
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holding_register">Holding Register</SelectItem>
                    <SelectItem value="input_register">Input Register</SelectItem>
                    <SelectItem value="coil">Coil</SelectItem>
                    <SelectItem value="discrete_input">Discrete Input</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={handleAddRegister}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModbusRegisterMapComponent;
