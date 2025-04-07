
import { supabase } from '@/lib/supabase';
import { User } from '@/contexts/auth/AuthTypes';
import { toast } from 'sonner';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Error fetching current user:', authError);
      return null;
    }
    
    // Get user profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', authUser.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // If profile doesn't exist but user does, return minimal user
      return {
        id: authUser.id,
        email: authUser.email || '',
        role: 'user',
      };
    }
    
    // Combine auth user and profile data
    return {
      id: authUser.id,
      email: authUser.email || '',
      role: profileData?.role || 'user',
      firstName: profileData?.first_name || authUser.user_metadata?.first_name || '',
      lastName: profileData?.last_name || authUser.user_metadata?.last_name || '',
      avatar: authUser.user_metadata?.avatar_url,
    };
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((profile: any) => ({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    toast.error('Failed to fetch users.');
    return [];
  }
};

export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    // Check if email exists
    if (!userData.email) {
      throw new Error('Email is required');
    }
    
    // Generate a random password for the user
    const tempPassword = Math.random().toString(36).slice(-10);
    
    // Create user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');
    
    // Update the profile with role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: userData.role || 'user',
        first_name: userData.firstName,
        last_name: userData.lastName
      })
      .eq('id', authData.user.id);
    
    if (profileError) throw profileError;
    
    const newUser: User = {
      id: authData.user.id,
      email: authData.user.email || '',
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
    };
    
    toast.success(`User ${userData.email} created successfully.`);
    return newUser;
  } catch (error: any) {
    console.error('Error creating user:', error);
    toast.error(`Failed to create user: ${error.message}`);
    return null;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    const updates: Record<string, any> = {};
    
    // Only add fields that were provided (and map to correct field names)
    if (userData.firstName !== undefined) updates.first_name = userData.firstName;
    if (userData.lastName !== undefined) updates.last_name = userData.lastName;
    if (userData.role !== undefined) updates.role = userData.role;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success('User updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating user:', error);
    toast.error(`Failed to update user: ${error.message}`);
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    toast.success('User deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    toast.error(`Failed to delete user: ${error.message}`);
    return false;
  }
};
