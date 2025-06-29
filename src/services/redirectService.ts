
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export interface RedirectResult {
  path: string;
  reason: string;
}

export const getPostLoginRedirect = async (profile: Profile): Promise<RedirectResult> => {
  console.log('Determining redirect for user:', profile);

  // Admin users go to admin dashboard
  if (profile.role === 'admin') {
    return {
      path: '/admin',
      reason: 'Admin user redirected to admin dashboard'
    };
  }

  // Client users need organization lookup
  if (profile.role === 'client') {
    // Special handling for demo user - always redirect to demo page
    if (profile.email === 'demo@example.com') {
      return {
        path: '/demo',
        reason: 'Demo user redirected to demo page'
      };
    }

    if (!profile.organization_id) {
      console.warn('Client user has no organization_id');
      return {
        path: '/test',
        reason: 'Client user without organization redirected to fallback'
      };
    }

    try {
      // Fetch organization slug
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('slug')
        .eq('id', profile.organization_id)
        .single();

      if (error) {
        console.error('Failed to fetch organization:', error);
        return {
          path: '/test',
          reason: 'Organization lookup failed, redirected to fallback'
        };
      }

      if (!organization?.slug) {
        console.warn('Organization exists but has no slug');
        return {
          path: '/test',
          reason: 'Organization has no slug, redirected to fallback'
        };
      }

      return {
        path: `/home/${organization.slug}`,
        reason: `Client redirected to organization: ${organization.slug}`
      };

    } catch (error) {
      console.error('Error during organization lookup:', error);
      return {
        path: '/test',
        reason: 'Error during organization lookup, redirected to fallback'
      };
    }
  }

  // Unknown role fallback
  console.warn('Unknown user role:', profile.role);
  return {
    path: '/test',
    reason: 'Unknown role, redirected to fallback'
  };
};
