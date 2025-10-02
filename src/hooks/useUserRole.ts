import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useUserRole = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        } else {
          setUserRole(data);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id]);

  return { userRole, loading };
};
