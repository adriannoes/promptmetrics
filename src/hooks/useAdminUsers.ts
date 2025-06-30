
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

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
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      const action = newRole === 'admin' ? 'promoted' : 'demoted';
      toast.success(`Successfully ${action} ${email} to ${newRole}`);
      fetchProfiles();
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error(`Failed to change user role`);
    } finally {
      setProcessingRoleChange(null);
    }
  };

  const promoteByEmail = async (emailToPromote: string) => {
    if (!emailToPromote.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToPromote.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    const sanitizedEmail = emailToPromote.trim().toLowerCase();

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('email', sanitizedEmail)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast.success(`Successfully promoted ${sanitizedEmail} to admin`);
        fetchProfiles();
        return true;
      } else {
        toast.error('User not found. Make sure they have signed up first.');
        return false;
      }
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
