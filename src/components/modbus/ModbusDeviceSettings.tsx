
import React, { useState } from 'react';
import { toast } from 'sonner';
import { updateModbusDevice } from '@/services/modbus/modbusDeviceService';
import { ModbusDevice } from '@/types/modbus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ModbusDeviceSettingsProps {
  device: ModbusDevice;
  onUpdate?: () => void;
}

const ModbusDeviceSettings: React.FC<ModbusDeviceSettingsProps> = ({ device, onUpdate }) => {
  const [name, setName] = useState(device.name);
  const [ip, setIp] = useState(device.ip_address || device.ip || '');
  const [port, setPort] = useState(device.port);
  const [unitId, setUnitId] = useState(device.unit_id || 1);
  const [isActive, setIsActive] = useState(device.is_active ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateModbusDevice(device.id, {
        name,
        ip_address: ip,
        port,
        unit_id: unitId,
        is_active: isActive,
      });

      toast.success('Device settings updated');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update device:', error);
      toast.error('Failed to update device settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Device Name</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Device name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">IP Address</label>
          <Input 
            value={ip} 
            onChange={(e) => setIp(e.target.value)} 
            placeholder="192.168.1.100"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Port</label>
          <Input 
            type="number" 
            value={port} 
            onChange={(e) => setPort(Number(e.target.value))} 
            placeholder="502"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Unit ID</label>
          <Input 
            type="number" 
            value={unitId} 
            onChange={(e) => setUnitId(Number(e.target.value))} 
            placeholder="1"
            min={0}
            max={255}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={isActive} 
          onCheckedChange={setIsActive}
          id="device-enabled"
        />
        <label htmlFor="device-enabled" className="cursor-pointer">Device Enabled</label>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
};

export default ModbusDeviceSettings;
