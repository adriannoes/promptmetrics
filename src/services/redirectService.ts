
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
          path: '/domain-setup',
          reason: 'Organization lookup failed, redirected to domain setup'
        };
      }

      if (!organization) {
        console.warn('Organization not found');
        return {
          path: '/domain-setup',
          reason: 'Organization not found, redirected to domain setup'
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
          path: '/domain-setup',
          reason: 'Organization has no slug, redirected to domain setup'
        };
      }

      return {
        path: `/home/${organization.slug}`,
        reason: `Client redirected to organization: ${organization.slug}`
      };

    } catch (error) {
      console.error('Error during organization lookup:', error);
      return {
        path: '/domain-setup',
        reason: 'Error during organization lookup, redirected to domain setup'
      };
    }
  }

  // Unknown role fallback
  console.warn('Unknown user role:', profile.role);
  return {
    path: '/domain-setup',
    reason: 'Unknown role, redirected to domain setup'
  };
};
