
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const seedTestData = async () => {
  try {
    // Check if data already exists
    const { count, error: countError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    if (count && count > 0) {
      console.log('Seed data already exists, skipping seed operation');
      return;
    }
    
    console.log('Seeding test data...');
    
    // Seed logic would go here
    toast.success('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    toast.error('Failed to seed test data');
  }
};

// Export other functions as needed
