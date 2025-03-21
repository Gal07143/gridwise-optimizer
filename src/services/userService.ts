
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/energy";
import { toast } from "sonner";

// Define the roles used in the database
type DbUserRole = 'admin' | 'viewer' | 'operator' | 'installer' | 'user';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<Partial<User>[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    // Map Supabase profile data to User type
    return (data || []).map(profile => {
      // Convert role to ensure it matches UserRole type
      let role: UserRole = 'viewer'; // Default
      
      if (profile.role === 'admin') {
        role = 'admin';
      } else if (profile.role === 'installer') {
        role = 'installer';
      } else if (profile.role === 'user') {
        role = 'user';
      } else if (profile.role === 'viewer') {
        role = 'viewer';
      } else if (profile.role === 'operator') {
        // Map operator to installer as closest equivalent
        role = 'installer';
      }
      
      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role,
        createdAt: profile.created_at,
        lastLogin: profile.last_login,
        preferences: {
          theme: profile.theme_preference,
          notifications: {
            email: profile.email_notifications,
            push: profile.push_notifications,
            sms: profile.sms_notifications
          },
          dashboardLayout: profile.dashboard_layout
        }
      };
    });
    
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to fetch users");
    return [];
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<Partial<User> | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Convert role to ensure it matches UserRole type
    let role: UserRole = 'viewer'; // Default
    
    if (data.role === 'admin') {
      role = 'admin';
    } else if (data.role === 'installer') {
      role = 'installer';
    } else if (data.role === 'user') {
      role = 'user';
    } else if (data.role === 'viewer') {
      role = 'viewer';
    } else if (data.role === 'operator') {
      // Map operator to installer as closest equivalent
      role = 'installer';
    }
    
    // Map Supabase profile data to User type
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role,
      createdAt: data.created_at,
      lastLogin: data.last_login,
      preferences: {
        theme: data.theme_preference,
        notifications: {
          email: data.email_notifications,
          push: data.push_notifications,
          sms: data.sms_notifications
        },
        dashboardLayout: data.dashboard_layout
      }
    };
    
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    toast.error("Failed to fetch user");
    return null;
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Map UserRole to database role
    let dbRole: DbUserRole;
    
    switch (role) {
      case 'admin':
        dbRole = 'admin';
        break;
      case 'installer':
        dbRole = 'installer';
        break;
      case 'user':
        dbRole = 'user';
        break;
      default:
        dbRole = 'viewer';
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: dbRole })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("User role updated");
    return true;
    
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    toast.error("Failed to update user role");
    return false;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: {
  firstName?: string;
  lastName?: string;
  preferences?: {
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    dashboardLayout?: any;
  };
}): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    
    if (updates.preferences) {
      if (updates.preferences.theme !== undefined) {
        updateData.theme_preference = updates.preferences.theme;
      }
      
      if (updates.preferences.notifications) {
        if (updates.preferences.notifications.email !== undefined) {
          updateData.email_notifications = updates.preferences.notifications.email;
        }
        if (updates.preferences.notifications.push !== undefined) {
          updateData.push_notifications = updates.preferences.notifications.push;
        }
        if (updates.preferences.notifications.sms !== undefined) {
          updateData.sms_notifications = updates.preferences.notifications.sms;
        }
      }
      
      if (updates.preferences.dashboardLayout !== undefined) {
        updateData.dashboard_layout = updates.preferences.dashboardLayout;
      }
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("Profile updated");
    return true;
    
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    toast.error("Failed to update profile");
    return false;
  }
};

/**
 * Get site access for a user
 */
export const getUserSiteAccess = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_site_access')
      .select('site_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (data || []).map(access => access.site_id);
    
  } catch (error) {
    console.error(`Error fetching site access for user ${userId}:`, error);
    return [];
  }
};
