import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Save, 
  Trash, 
  Edit, 
  UploadIcon, 
  Download, 
  Copy, 
  FileJson
} from 'lucide-react';
import { ModbusRegisterMap, ModbusDataType } from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';

interface ModbusRegisterMapEditorProps {
  deviceId: string;
}

interface RegisterFormValues {
  name: string;
  address: number;
  type: ModbusDataType;
  dataType?: string;
  scale?: number;
  offset?: number;
  description?: string;
  units?: string;
}

const ModbusRegisterMapEditor: React.FC<ModbusRegisterMapEditorProps> = ({ deviceId }) => {
  const [registerMap, setRegisterMap] = useState<ModbusRegisterMap>({});
  const [loading, setLoading] = useState(true);
  const [editingRegister, setEditingRegister] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      address: 0,
      type: 'holdingRegister',
      dataType: 'uint16',
      scale: 1,
      offset: 0,
      description: '',
      units: '',
    }
  });

  // Fetch register map
  const fetchRegisterMap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('modbus_register_maps')
        .select('register_map')
        .eq('device_id', deviceId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, initialize with empty register map
          setRegisterMap({});
        } else {
          throw error;
        }
      } else if (data) {
        setRegisterMap(data.register_map as ModbusRegisterMap);
      }
    } catch (err: any) {
      console.error('Error fetching register map:', err);
      toast.error(`Error loading register map: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save register map
  const saveRegisterMap = async () => {
    try {
      const { data, error } = await supabase
        .from('modbus_register_maps')
        .upsert({
          device_id: deviceId,
          register_map: registerMap,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      toast.success('Register map saved successfully');
      return data;
    } catch (err: any) {
      console.error('Error saving register map:', err);
      toast.error(`Failed to save register map: ${err.message}`);
      throw err;
    }
  };

  // Load register map on mount
  useEffect(() => {
    fetchRegisterMap();
  }, [deviceId]);

  // Handle form submission
  const handleSubmit = (values: RegisterFormValues) => {
    const newRegisterMap = { ...registerMap };
    const registerName = editingRegister || values.name;

    newRegisterMap[registerName] = {
      address: values.address,
      type: values.type,
    };

    // Add optional fields if they have values
    if (values.dataType) newRegisterMap[registerName].dataType = values.dataType as any;
    if (values.scale !== undefined) newRegisterMap[registerName].scale = values.scale;
    if (values.offset !== undefined) newRegisterMap[registerName].offset = values.offset;
    if (values.description) newRegisterMap[registerName].description = values.description;
    if (values.units) newRegisterMap[registerName].units = values.units;

    setRegisterMap(newRegisterMap);
    setDialogOpen(false);
    setEditingRegister(null);
    form.reset();
    toast.success(`Register "${registerName}" ${editingRegister ? 'updated' : 'added'}`);
  };

  // Edit register
  const handleEditRegister = (name: string) => {
    const register = registerMap[name];
    form.reset({
      name: name,
      address: register.address,
      type: register.type,
      dataType: register.dataType,
      scale: register.scale,
      offset: register.offset,
      description: register.description,
      units: register.units,
    });
    setEditingRegister(name);
    setDialogOpen(true);
  };

  // Delete register
  const handleDeleteRegister = (name: string) => {
    const newRegisterMap = { ...registerMap };
    delete newRegisterMap[name];
    setRegisterMap(newRegisterMap);
    toast.success(`Register "${name}" deleted`);
  };

  // Download register map as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(registerMap, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modbus_map_${deviceId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import register map from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setRegisterMap(json);
        toast.success('Register map imported successfully');
      } catch (err) {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modbus Register Map</CardTitle>
        <CardDescription>
          Define and manage Modbus registers for this device
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(registerMap).length} registers defined
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <div className="relative">
                  <Button variant="outline" size="sm" asChild>
                    <label>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Import
                      <input 
                        type="file" 
                        accept=".json" 
                        className="sr-only" 
                        onChange={handleImport}
                      />
                    </label>
                  </Button>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => {
                      setEditingRegister(null);
                      form.reset({
                        name: '',
                        address: 0,
                        type: 'holdingRegister',
                        dataType: 'uint16',
                        scale: 1,
                        offset: 0,
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Register
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingRegister ? 'Edit Register' : 'Add New Register'}
                      </DialogTitle>
                      <DialogDescription>
                        Define the register information for this device
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Register Name</Label>
                          <Input
                            id="name"
                            {...form.register('name')}
                            disabled={!!editingRegister}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            type="number"
                            min="0"
                            max="65535"
                            {...form.register('address', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Register Type</Label>
                          <Select
                            defaultValue={form.watch('type')}
                            onValueChange={(value) => form.setValue('type', value as ModbusDataType)}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="holdingRegister">Holding Register (03)</SelectItem>
                              <SelectItem value="inputRegister">Input Register (04)</SelectItem>
                              <SelectItem value="coil">Coil (01)</SelectItem>
                              <SelectItem value="discreteInput">Discrete Input (02)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataType">Data Type</Label>
                          <Select
                            defaultValue={form.watch('dataType')}
                            onValueChange={(value) => form.setValue('dataType', value)}
                            disabled={['coil', 'discreteInput'].includes(form.watch('type'))}
                          >
                            <SelectTrigger id="dataType">
                              <SelectValue placeholder="Select data type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="int16">Int16</SelectItem>
                              <SelectItem value="uint16">UInt16</SelectItem>
                              <SelectItem value="int32">Int32 (2 registers)</SelectItem>
                              <SelectItem value="uint32">UInt32 (2 registers)</SelectItem>
                              <SelectItem value="float32">Float32 (2 registers)</SelectItem>
                              <SelectItem value="float64">Float64 (4 registers)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scale">Scale Factor</Label>
                          <Input
                            id="scale"
                            type="number"
                            step="any"
                            {...form.register('scale', { valueAsNumber: true })}
                            disabled={['coil', 'discreteInput'].includes(form.watch('type'))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offset">Offset</Label>
                          <Input
                            id="offset"
                            type="number"
                            step="any"
                            {...form.register('offset', { valueAsNumber: true })}
                            disabled={['coil', 'discreteInput'].includes(form.watch('type'))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="units">Units</Label>
                          <Input id="units" {...form.register('units')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" {...form.register('description')} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingRegister ? 'Update' : 'Add'} Register
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {Object.keys(registerMap).length > 0 ? (
              <ScrollArea className="h-[400px] border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-card shadow-sm z-10">
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Scale</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(registerMap).map(([name, register]) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{register.address}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {register.type === 'holdingRegister' && 'Holding (03)'}
                            {register.type === 'inputRegister' && 'Input (04)'}
                            {register.type === 'coil' && 'Coil (01)'}
                            {register.type === 'discreteInput' && 'Discrete (02)'}
                          </Badge>
                        </TableCell>
                        <TableCell>{register.dataType || '-'}</TableCell>
                        <TableCell>{register.scale || '1'}</TableCell>
                        <TableCell>{register.units || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRegister(name)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRegister(name)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-secondary/20">
                <FileJson className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No registers defined yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Register
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveRegisterMap} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Register Map
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModbusRegisterMapEditor;
