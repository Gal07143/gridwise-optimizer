
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModbusDevice } from '@/types/modbus';
import { updateModbusDevice } from '@/services/modbus/modbusService';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Trash } from 'lucide-react';

interface ModbusDeviceSettingsProps {
  device: ModbusDevice;
}

const ModbusDeviceSettings: React.FC<ModbusDeviceSettingsProps> = ({ device }) => {
  const [formData, setFormData] = useState({
    name: device.name,
    description: device.description || '',
    ip: device.ip,
    port: device.port,
    unit_id: device.unit_id,
    protocol: device.protocol,
    is_active: device.is_active
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateModbusDevice(device.id, formData);
      toast.success('Device settings updated successfully');
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Failed to update device settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="device-name">Device Name</Label>
            <Input 
              id="device-name" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch 
              id="is-active" 
              checked={formData.is_active} 
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="device-description">Description</Label>
          <Textarea 
            id="device-description" 
            name="description"
            value={formData.description} 
            onChange={handleChange}
            placeholder="Device description"
            className="resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="device-ip">IP Address</Label>
            <Input 
              id="device-ip" 
              name="ip"
              value={formData.ip} 
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="device-port">Port</Label>
            <Input 
              id="device-port" 
              name="port"
              type="number" 
              value={formData.port} 
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="device-unit-id">Unit ID</Label>
            <Input 
              id="device-unit-id" 
              name="unit_id"
              type="number" 
              value={formData.unit_id} 
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="device-protocol">Protocol</Label>
          <Input 
            id="device-protocol" 
            name="protocol"
            value={formData.protocol} 
            onChange={handleChange}
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">Protocol type cannot be changed after device creation</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive">
          <Trash className="h-4 w-4 mr-2" />
          Delete Device
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModbusDeviceSettings;
