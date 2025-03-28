
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId);
    
    if (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
      return false;
    }
    
    toast.success('Device deleted successfully');
    return true;
  } catch (err) {
    console.error('Exception when deleting device:', err);
    toast.error('Unexpected error while deleting device');
    return false;
  }
};
