
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/auth';

export interface RedirectResult {
  path: string;
  reason: string;
}

export const getPostLoginRedirect = async (profile: Profile, userRole: UserRole | null): Promise<RedirectResult> => {
  console.log('Determining redirect for user:', profile, userRole);

  // Admin users go to admin dashboard
  if (userRole?.role === 'admin') {
    return {
      path: '/admin',
      reason: 'Admin user redirected to admin dashboard'
    };
  }

  // Client users need organization lookup
  if (userRole?.role === 'client') {
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
        path: '/domain-setup',
        reason: 'Client user without organization redirected to domain setup'
      };
    }

    try {
      // Fetch organization to check if domain is configured
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('slug, website_url')
        .eq('id', profile.organization_id)
        .single();

      if (error) {
        console.error('Failed to fetch organization:', error);
        return {
          path: '/test',
          reason: 'Organization lookup failed, redirected to fallback'
        };
      }

      if (!organization) {
        console.warn('Organization not found');
        return {
          path: '/test',
          reason: 'Organization not found, redirected to fallback'
        };
      }

      // Check if organization has a domain configured
      if (!organization.website_url) {
        return {
          path: '/domain-setup',
          reason: 'Client needs to configure domain first'
        };
      }

      if (!organization.slug) {
        console.warn('Organization exists but has no slug');
        return {
          path: '/test',
          reason: 'Organization has no slug, redirected to fallback'
        };
      }

      return {
        path: '/analysis',
        reason: `Client with configured domain redirected to analysis page`
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
  console.warn('Unknown user role:', userRole?.role);
  return {
    path: '/test',
    reason: 'Unknown role, redirected to fallback'
  };
};
