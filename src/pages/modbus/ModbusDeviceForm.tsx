
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ServerIcon } from 'lucide-react';
import { useModbusConnection } from '@/hooks/useModbusConnection';
import ModbusDeviceForm from '@/components/modbus/ModbusDeviceForm';
import { toast } from 'sonner';
import { ModbusDeviceConfig } from '@/types/modbus';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ModbusDeviceFormPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const isNew = deviceId === 'new';
  
  const { 
    device, 
    loading, 
    error 
  } = useModbusConnection(isNew ? undefined : deviceId);
  
  const handleBack = () => {
    navigate('/modbus/devices');
  };
  
  const handleSuccess = (device: ModbusDeviceConfig & { id: string }) => {
    navigate(`/modbus/devices/${device.id}`);
    toast.success(
      isNew 
        ? `Device "${device.name}" created successfully` 
        : `Device "${device.name}" updated successfully`
    );
  };
  
  return (
    <Main title={isNew ? "New Modbus Device" : "Edit Modbus Device"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <ServerIcon className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">
              {isNew ? "New Modbus Device" : `Edit: ${device?.name || 'Device'}`}
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error && !isNew ? (
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md">
            <p className="text-destructive font-medium">Error loading device</p>
            <p className="text-sm text-destructive/80 mt-1">{error instanceof Error ? error.message : String(error)}</p>
            <div className="mt-4">
              <Button onClick={handleBack}>Return to Devices</Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border shadow-sm rounded-lg p-6">
            <ModbusDeviceForm 
              initialData={isNew ? undefined : device} 
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </Main>
  );
};

export default ModbusDeviceFormPage;
