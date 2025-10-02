
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { auditService } from '@/services/auditService';

interface ProfileWithRole {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
}

export const useAdminUsers = () => {
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRoleChange, setProcessingRoleChange] = useState<string | null>(null);
  const { userRole } = useAuth();

  const fetchProfiles = async () => {
    try {
      // Fetch profiles with their roles from user_roles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (profilesError) throw profilesError;
      
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Create a map of user_id to role
      const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);

      // Combine profiles with their roles
      const profilesWithRoles: ProfileWithRole[] = (profilesData || []).map(profile => ({
        ...profile,
        role: (rolesMap.get(profile.id) || 'client') as 'client' | 'admin'
      }));
      
      setProfiles(profilesWithRoles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, email: string, newRole: 'admin' | 'client') => {
    if (userId === userRole?.user_id) {
      toast.error('You cannot change your own role');
      return;
    }

    setProcessingRoleChange(userId);
    
    try {
      const { error } = await supabase.rpc('admin_change_user_role', {
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
      const oldRole = profiles.find(p => p.id === userId)?.role || 'unknown';
      await auditService.logUserPromotion('admin', email, newRole, oldRole);

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
        .select('id, full_name')
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

      // Check if user is already admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userProfile.id)
        .single();

      if (roleData?.role === 'admin') {
        toast.error('User is already an admin');
        return false;
      }

      // Use the secure admin function to change role
      const { error } = await supabase.rpc('admin_change_user_role', {
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
      await auditService.logUserPromotion('admin', sanitizedEmail, 'admin', roleData?.role || 'client');

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
