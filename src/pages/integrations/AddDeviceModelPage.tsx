
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { categoryNames } from '@/types/device-model';
import { toast } from 'sonner';

const AddDeviceModelPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: '',
    model: '',
    category: '',
    protocol: '',
    firmware: '',
    supported: true,
    description: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.manufacturer || !formData.model || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Device model added successfully');
      navigate('/integrations');
    }, 1500);
  };
  
  const handleUploadSpecs = () => {
    toast.info('Upload specifications dialog would open here');
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/integrations">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Add Device Model</h1>
        </div>
        
        <p className="text-muted-foreground">
          Add a new device model to the integration catalog. This will make the device available for users to add to their systems.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about the device model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer <span className="text-red-500">*</span></Label>
                  <Input 
                    id="manufacturer" 
                    name="manufacturer"
                    placeholder="e.g., Tesla, SMA, Enphase" 
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                  <Input 
                    id="model" 
                    name="model"
                    placeholder="e.g., Powerwall 2, Sunny Boy" 
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryNames).map(([id, name]) => (
                        <SelectItem key={id} value={id}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="protocol">Communication Protocol</Label>
                  <Input 
                    id="protocol" 
                    name="protocol"
                    placeholder="e.g., Modbus TCP, REST API" 
                    value={formData.protocol}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firmware">Latest Firmware Version</Label>
                  <Input 
                    id="firmware" 
                    name="firmware"
                    placeholder="e.g., v1.45.2" 
                    value={formData.firmware}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supported">Supported Device</Label>
                    <Switch 
                      id="supported" 
                      checked={formData.supported}
                      onCheckedChange={(checked) => handleSwitchChange('supported', checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Is this device officially supported by the system?
                  </p>
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
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="pt-2">
                <Button type="button" variant="outline" onClick={handleUploadSpecs}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Specifications
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/integrations')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Device Model
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddDeviceModelPage;
