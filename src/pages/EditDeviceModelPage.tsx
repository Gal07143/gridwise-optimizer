
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { 
  Loader2, 
  Package, 
  Save, 
  Upload,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { categoryNames } from '@/hooks/useDeviceModels';

interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number?: string;
  type: string;
  capacity?: number;
  power_rating?: number;
  efficiency?: number;
  dimensions?: string;
  weight?: number;
  warranty_period?: number;
  release_date?: string;
  description?: string;
  technical_specs?: Record<string, any>;
  datasheet_url?: string;
  supported?: boolean;
  protocol?: string;
  firmware?: string;
}

const getDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return null;
    
    return data as DeviceModel;
  } catch (error) {
    console.error('Error fetching device model:', error);
    throw error;
  }
};

const updateDeviceModel = async (id: string, updates: Partial<DeviceModel>): Promise<DeviceModel> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    return data as DeviceModel;
  } catch (error) {
    console.error('Error updating device model:', error);
    throw error;
  }
};

const EditDeviceModelPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<DeviceModel>>({});
  
  const { data: deviceModel, isLoading, isError } = useQuery({
    queryKey: ['deviceModel', id],
    queryFn: () => getDeviceModelById(id as string),
    enabled: !!id
  });
  
  // Initialize form data when device model is loaded
  useEffect(() => {
    if (deviceModel) {
      setFormData({
        name: `${deviceModel.manufacturer} ${deviceModel.model_number || ''}`.trim(),
        manufacturer: deviceModel.manufacturer,
        model_number: deviceModel.model_number,
        type: deviceModel.type,
        capacity: deviceModel.capacity,
        power_rating: deviceModel.power_rating,
        efficiency: deviceModel.efficiency,
        dimensions: deviceModel.dimensions,
        weight: deviceModel.weight,
        warranty_period: deviceModel.warranty_period,
        release_date: deviceModel.release_date,
        description: deviceModel.description,
        datasheet_url: deviceModel.datasheet_url,
        supported: deviceModel.supported !== false, // Default to true if not set
        protocol: deviceModel.protocol,
        firmware: deviceModel.firmware,
      });
    }
  }, [deviceModel]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleUploadSpecs = () => {
    toast.info('Upload specifications dialog would open here');
  };
  
  const handleSubmit = async () => {
    if (!id) return;
    
    // Validate form
    if (!formData.manufacturer || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the device model
      await updateDeviceModel(id, {
        ...formData,
        name: `${formData.manufacturer} ${formData.model_number || ''}`.trim(),
      });
      
      toast.success('Device model updated successfully');
      navigate(`/integrations/device-models/${id}`);
    } catch (error: any) {
      console.error('Error updating device model:', error);
      toast.error(`Failed to update device model: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate
        title="Edit Device Model"
        description="Update device model details"
        backLink={`/integrations/device-models/${id}`}
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (isError || !deviceModel) {
    return (
      <SettingsPageTemplate
        title="Edit Device Model"
        description="Update device model details"
        backLink="/integrations"
      >
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Device Model Not Found</AlertTitle>
          <AlertDescription>
            The device model you are trying to edit could not be found.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate('/integrations')}>
          Back to Integrations
        </Button>
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate
      title={`Edit Device Model: ${deviceModel.name}`}
      description="Update device model information and specifications"
      backLink={`/integrations/device-models/${id}`}
      headerIcon={<Package size={20} />}
      actions={
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </Button>
      }
    >
      <div className="grid gap-6">
        <div className="p-6 border rounded-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer <span className="text-red-500">*</span></Label>
              <Input 
                id="manufacturer" 
                name="manufacturer"
                placeholder="e.g., Tesla, SMA, Enphase" 
                value={formData.manufacturer || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model_number">Model Number</Label>
              <Input 
                id="model_number" 
                name="model_number"
                placeholder="e.g., Powerwall 2, Sunny Boy" 
                value={formData.model_number || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Category <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.type || ''} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="solar">Solar Panel</SelectItem>
                  <SelectItem value="wind">Wind Turbine</SelectItem>
                  <SelectItem value="grid">Grid Connection</SelectItem>
                  <SelectItem value="load">Load</SelectItem>
                  <SelectItem value="ev_charger">EV Charger</SelectItem>
                  <SelectItem value="inverter">Inverter</SelectItem>
                  <SelectItem value="meter">Smart Meter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="protocol">Communication Protocol</Label>
              <Input 
                id="protocol" 
                name="protocol"
                placeholder="e.g., Modbus TCP, REST API" 
                value={formData.protocol || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firmware">Latest Firmware Version</Label>
              <Input 
                id="firmware" 
                name="firmware"
                placeholder="e.g., v1.45.2" 
                value={formData.firmware || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="supported">Supported Device</Label>
                <Switch 
                  id="supported" 
                  checked={formData.supported !== false}
                  onCheckedChange={(checked) => handleSwitchChange('supported', checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Is this device officially supported by the system?
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (kWh/kW)</Label>
              <Input 
                id="capacity" 
                name="capacity"
                type="number"
                step="0.01"
                placeholder="Enter capacity" 
                value={formData.capacity === undefined ? '' : formData.capacity}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="power_rating">Power Rating (kW)</Label>
              <Input 
                id="power_rating" 
                name="power_rating"
                type="number"
                step="0.01"
                placeholder="Enter power rating" 
                value={formData.power_rating === undefined ? '' : formData.power_rating}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input 
                id="efficiency" 
                name="efficiency"
                type="number"
                step="0.01"
                placeholder="Enter efficiency" 
                value={formData.efficiency === undefined ? '' : formData.efficiency}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input 
                id="dimensions" 
                name="dimensions"
                placeholder="e.g., 1200 x 800 x 200 mm" 
                value={formData.dimensions || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                name="weight"
                type="number"
                step="0.01"
                placeholder="Enter weight" 
                value={formData.weight === undefined ? '' : formData.weight}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warranty_period">Warranty Period (years)</Label>
              <Input 
                id="warranty_period" 
                name="warranty_period"
                type="number"
                placeholder="Enter warranty period" 
                value={formData.warranty_period === undefined ? '' : formData.warranty_period}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="release_date">Release Date</Label>
              <Input 
                id="release_date" 
                name="release_date"
                type="date"
                placeholder="Select release date" 
                value={formData.release_date || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="datasheet_url">Datasheet URL</Label>
              <Input 
                id="datasheet_url" 
                name="datasheet_url"
                placeholder="Enter datasheet URL" 
                value={formData.datasheet_url || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Enter a description of the device" 
              rows={4}
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="pt-2">
            <Button type="button" variant="outline" onClick={handleUploadSpecs}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Specifications
            </Button>
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default EditDeviceModelPage;
