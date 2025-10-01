
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { auditService } from '@/services/auditService';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
}

export const useAdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRoleChange, setProcessingRoleChange] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchProfiles = async () => {
    try {
      // Optimize query to select only needed fields and limit results
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, invite_code')
        .order('created_at', { ascending: false })
        .limit(100); // Limit to prevent loading too many users at once

      if (error) throw error;
      
      // Type assert the data to ensure role is properly typed
      const typedProfiles = (data || []).map(profile => ({
        ...profile,
        role: profile.role as 'client' | 'admin'
      }));
      
      setProfiles(typedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, email: string, newRole: 'admin' | 'client') => {
    if (userId === profile?.id) {
      toast.error('You cannot change your own role');
      return;
    }

    setProcessingRoleChange(userId);
    
    try {
      // Use the secure admin function instead of direct database update
      const { data, error } = await supabase.rpc('admin_change_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) {
        console.error('Error changing user role:', error);
        toast.error(error.message || 'Failed to change user role');
        return;
      }

      const action = newRole === 'admin' ? 'promoted' : 'demoted';
      toast.success(`Successfully ${action} ${email} to ${newRole}`);

      // Log audit event
      if (profile?.email) {
        const oldRole = profiles.find(p => p.id === userId)?.role || 'unknown';
        await auditService.logUserPromotion(profile.email, email, newRole, oldRole);
      }

      fetchProfiles();
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error('Failed to change user role');
    } finally {
      setProcessingRoleChange(null);
    }
  };

  const promoteByEmail = async (emailToPromote: string): Promise<boolean> => {
    if (!emailToPromote.trim()) {
      toast.error('Please enter an email address');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToPromote.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const sanitizedEmail = emailToPromote.trim().toLowerCase();

    try {
      // First find the user by email to get their ID
      const { data: userProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('email', sanitizedEmail)
        .limit(1);

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        toast.error('Error finding user');
        return false;
      }

      if (!userProfiles || userProfiles.length === 0) {
        toast.error('User not found. Make sure they have signed up first.');
        return false;
      }

      const userProfile = userProfiles[0];

      if (userProfile.role === 'admin') {
        toast.error('User is already an admin');
        return false;
      }

      // Use the secure admin function instead of direct database update
      const { data, error } = await supabase.rpc('admin_change_user_role', {
        target_user_id: userProfile.id,
        new_role: 'admin'
      });

      if (error) {
        console.error('Error promoting user:', error);
        toast.error(error.message || 'Failed to promote user to admin');
        return false;
      }

      toast.success(`Successfully promoted ${sanitizedEmail} to admin`);

      // Log audit event
      if (profile?.email) {
        await auditService.logUserPromotion(profile.email, sanitizedEmail, 'admin', userProfile.role);
      }

      fetchProfiles();
      return true;
    } catch (error) {
      console.error('Error promoting user by email:', error);
      toast.error('Failed to promote user to admin');
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const clientCount = profiles.filter(p => p.role === 'client').length;

  return {
    profiles,
    loading,
    processingRoleChange,
    adminCount,
    clientCount,
    fetchProfiles,
    handleRoleChange,
    promoteByEmail
  };
};
