
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DeviceModel } from '@/hooks/useDeviceModels';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const EditDeviceModelPage = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);
  const [formData, setFormData] = useState<Partial<DeviceModel>>({});
  
  // Fetch device model data
  useEffect(() => {
    const fetchDeviceModel = async () => {
      setIsLoading(true);
      
      try {
        // Use a custom function to get device model data
        const query = `
          SELECT * FROM device_models 
          WHERE id = '${modelId}'
          LIMIT 1
        `;
        
        const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const model = data[0] as DeviceModel;
          setDeviceModel(model);
          setFormData({
            name: model.name,
            manufacturer: model.manufacturer,
            model_number: model.model_number,
            type: model.type,
            capacity: model.capacity,
            power_rating: model.power_rating,
            efficiency: model.efficiency,
            dimensions: model.dimensions,
            weight: model.weight,
            warranty_period: model.warranty_period,
            description: model.description,
            datasheet_url: model.datasheet_url
          });
        } else {
          toast.error('Device model not found');
          navigate('/integrations');
        }
      } catch (error: any) {
        console.error('Error fetching device model:', error);
        toast.error(`Failed to fetch device model: ${error.message}`);
        navigate('/integrations');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (modelId) {
      fetchDeviceModel();
    } else {
      setIsLoading(false);
    }
  }, [modelId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric input conversion
    const numericFields = ['capacity', 'power_rating', 'efficiency', 'weight', 'warranty_period'];
    
    if (numericFields.includes(name) && value !== '') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelId) {
      toast.error('Model ID is missing');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Use a custom function to update device model
      const query = `
        UPDATE device_models
        SET 
          name = '${formData.name}',
          manufacturer = '${formData.manufacturer}',
          model_number = '${formData.model_number || ''}',
          type = '${formData.type}',
          capacity = ${formData.capacity || 'NULL'},
          power_rating = ${formData.power_rating || 'NULL'},
          efficiency = ${formData.efficiency || 'NULL'},
          dimensions = '${formData.dimensions || ''}',
          weight = ${formData.weight || 'NULL'},
          warranty_period = ${formData.warranty_period || 'NULL'},
          description = '${formData.description || ''}',
          datasheet_url = '${formData.datasheet_url || ''}',
          last_updated = NOW()
        WHERE id = '${modelId}'
        RETURNING *
      `;
      
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast.success('Device model updated successfully');
        navigate('/integrations');
      } else {
        toast.error('Failed to update device model');
      }
    } catch (error: any) {
      console.error('Error updating device model:', error);
      toast.error(`Failed to update device model: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-muted-foreground">Loading device model...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/integrations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Edit Device Model</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the device model details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter device model name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="manufacturer">Manufacturer</FormLabel>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={handleInputChange}
                    placeholder="Enter manufacturer name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="model_number">Model Number</FormLabel>
                  <Input
                    id="model_number"
                    name="model_number"
                    value={formData.model_number || ''}
                    onChange={handleInputChange}
                    placeholder="Enter model number"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="type">Type</FormLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="inverter">Inverter</SelectItem>
                      <SelectItem value="solar">Solar Panel</SelectItem>
                      <SelectItem value="wind">Wind Turbine</SelectItem>
                      <SelectItem value="ev_charger">EV Charger</SelectItem>
                      <SelectItem value="meter">Smart Meter</SelectItem>
                      <SelectItem value="load">Load</SelectItem>
                      <SelectItem value="grid">Grid Connection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="capacity">Capacity (kWh)</FormLabel>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    step="0.01"
                    value={formData.capacity || ''}
                    onChange={handleInputChange}
                    placeholder="Enter capacity"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="power_rating">Power Rating (kW)</FormLabel>
                  <Input
                    id="power_rating"
                    name="power_rating"
                    type="number"
                    step="0.01"
                    value={formData.power_rating || ''}
                    onChange={handleInputChange}
                    placeholder="Enter power rating"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="efficiency">Efficiency (%)</FormLabel>
                  <Input
                    id="efficiency"
                    name="efficiency"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.efficiency || ''}
                    onChange={handleInputChange}
                    placeholder="Enter efficiency"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="dimensions">Dimensions</FormLabel>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions || ''}
                    onChange={handleInputChange}
                    placeholder="Enter dimensions"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="weight">Weight (kg)</FormLabel>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    placeholder="Enter weight"
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="warranty_period">Warranty (months)</FormLabel>
                  <Input
                    id="warranty_period"
                    name="warranty_period"
                    type="number"
                    value={formData.warranty_period || ''}
                    onChange={handleInputChange}
                    placeholder="Enter warranty period"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter device description"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="datasheet_url">Datasheet URL</FormLabel>
                <Input
                  id="datasheet_url"
                  name="datasheet_url"
                  value={formData.datasheet_url || ''}
                  onChange={handleInputChange}
                  placeholder="Enter URL to datasheet"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/integrations')}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditDeviceModelPage;
