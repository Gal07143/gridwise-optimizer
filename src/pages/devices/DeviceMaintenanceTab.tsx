
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Device } from '@/types/device';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MaintenanceRecord {
  id: string;
  device_id: string;
  maintenance_type: string;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

interface DeviceMaintenanceTabProps {
  device: Device;
}

const DeviceMaintenanceTab: React.FC<DeviceMaintenanceTabProps> = ({ device }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    maintenance_type: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('maintenance_records')
          .select('*')
          .eq('device_id', device.id)
          .order('scheduled_date', { ascending: false });

        if (error) throw error;
        
        setMaintenanceRecords(data || []);
      } catch (error) {
        console.error('Error fetching maintenance records:', error);
        toast.error('Failed to load maintenance records');
      } finally {
        setIsLoading(false);
      }
    };

    if (device?.id) {
      fetchMaintenanceRecords();
    } else {
      // If no device ID, create some sample data
      setMaintenanceRecords([
        {
          id: '1',
          device_id: device?.id || 'unknown',
          maintenance_type: 'Cleaning',
          scheduled_date: '2023-12-15',
          completed_date: '2023-12-15',
          notes: 'Regular cleaning of solar panels',
          performed_by: 'John Doe',
          created_at: '2023-12-01T10:00:00Z'
        },
        {
          id: '2',
          device_id: device?.id || 'unknown',
          maintenance_type: 'Inspection',
          scheduled_date: '2024-02-10',
          notes: 'Annual inspection of all components',
          created_at: '2023-12-05T14:30:00Z'
        }
      ]);
      setIsLoading(false);
    }
  }, [device.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async () => {
    try {
      // Validate input
      if (!newRecord.maintenance_type || !newRecord.scheduled_date) {
        toast.error('Please provide maintenance type and scheduled date');
        return;
      }

      // Insert record into database
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert({
          device_id: device.id,
          maintenance_type: newRecord.maintenance_type,
          scheduled_date: newRecord.scheduled_date,
          notes: newRecord.notes || null
        })
        .select();

      if (error) throw error;
      
      // Add the new record to state
      if (data && data.length > 0) {
        setMaintenanceRecords(prev => [data[0], ...prev]);
      }
      
      // Reset form
      setNewRecord({
        maintenance_type: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      
      toast.success('Maintenance record added successfully');
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      toast.error('Failed to add maintenance record');
    }
  };

  const handleCompleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_records')
        .update({
          completed_date: new Date().toISOString().split('T')[0],
          performed_by: 'Current User' // You would use the actual user's name here
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update state
      setMaintenanceRecords(prev => prev.map(record => 
        record.id === id 
          ? { ...record, completed_date: new Date().toISOString().split('T')[0], performed_by: 'Current User' } 
          : record
      ));
      
      toast.success('Maintenance marked as completed');
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      toast.error('Failed to mark maintenance as completed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Maintenance Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="maintenance_type" className="text-sm font-medium">
                Maintenance Type
              </label>
              <Input
                id="maintenance_type"
                name="maintenance_type"
                placeholder="e.g., Cleaning, Inspection, Repair"
                value={newRecord.maintenance_type}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="scheduled_date" className="text-sm font-medium">
                Scheduled Date
              </label>
              <Input
                id="scheduled_date"
                name="scheduled_date"
                type="date"
                value={newRecord.scheduled_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Enter maintenance details..."
              value={newRecord.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddRecord}>Add Maintenance Record</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : maintenanceRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No maintenance records found for this device</p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceRecords.map((record) => (
                <Card key={record.id} className={`border-l-4 ${record.completed_date ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-lg">{record.maintenance_type}</h3>
                        {record.notes && <p className="text-muted-foreground mt-1">{record.notes}</p>}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Scheduled: {new Date(record.scheduled_date).toLocaleDateString()}</span>
                        </div>
                        {record.completed_date && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Completed: {new Date(record.completed_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {record.performed_by && <p className="text-sm text-muted-foreground">By: {record.performed_by}</p>}
                      </div>
                    </div>
                    {!record.completed_date && (
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCompleteRecord(record.id)}
                        >
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceMaintenanceTab;
