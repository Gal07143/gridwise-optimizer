
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from './devices/deviceCompatibility';

// Re-export the seed function from seedService
export { seedTestData } from './devices/seedService';

// Re-export other device services
export * from './devices';
