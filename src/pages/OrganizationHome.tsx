

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import OrganizationHeader from '@/components/OrganizationHeader';
import OrganizationDashboard from '@/components/OrganizationDashboard';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';
import LoadingSpinner from '@/components/LoadingSpinner';

const OrganizationHome = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAuth();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Organization slug is required');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !organization) {
    return <UnauthorizedAccess message="Organization not found" />;
  }

  // Check if user belongs to this organization
  if (profile?.organization_id !== organization.id) {
    return <UnauthorizedAccess message="You don't have access to this organization" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <OrganizationHeader organization={organization} />
      <OrganizationDashboard organization={organization} />
    </div>
  );
};

export default OrganizationHome;
