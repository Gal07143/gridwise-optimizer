
import React, { useEffect, useState } from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';
import { Equipment } from '../../types/equipment';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';

interface EquipmentFormProps {
  equipmentId?: string;
  onSubmit: (equipment: Partial<Equipment>) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  type: string;
  location: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  notes?: string;
  efficiency?: number;
  load?: number;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipmentId, onSubmit, onCancel }) => {
  const { selectedEquipment, loading, selectEquipment } = useEquipment();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    location: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    installation_date: '',
  });

  useEffect(() => {
    if (equipmentId) {
      selectEquipment(equipmentId);
    }
  }, [equipmentId, selectEquipment]);

  useEffect(() => {
    if (selectedEquipment) {
      setFormData({
        ...selectedEquipment,
        installation_date: selectedEquipment.installation_date 
          ? new Date(selectedEquipment.installation_date).toISOString().split('T')[0] 
          : '',
      });
    }
  }, [selectedEquipment]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: Partial<Equipment> = {
      ...formData,
      installation_date: formData.installation_date ? formData.installation_date : undefined,
    };
    await onSubmit(submissionData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{equipmentId ? 'Edit Equipment' : 'Add New Equipment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="actuator">Actuator</SelectItem>
                  <SelectItem value="controller">Controller</SelectItem>
                  <SelectItem value="gateway">Gateway</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleChange('serial_number', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installation_date">Installation Date</Label>
              <Input
                id="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={(e) => handleChange('installation_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {equipmentId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentForm;
