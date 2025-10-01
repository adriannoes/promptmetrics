import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Organization {
  id: string;
  name: string;
  website_url?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export const useOrganizationData = () => {
  const { profile } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!profile?.organization_id) {
        setOrganization(null);
        setCurrentDomain('');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: org, error: fetchError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (org) {
          setOrganization(org);
          if (org.website_url) {
            // Extract domain from URL
            const domain = org.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '');
            setCurrentDomain(domain);
          } else {
            setCurrentDomain('');
          }
        }
      } catch (err) {
        console.error('Error fetching organization data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organization');
        setOrganization(null);
        setCurrentDomain('');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [profile?.organization_id]);

  return {
    organization,
    currentDomain,
    loading,
    error,
    hasDomain: !!currentDomain
  };
};
