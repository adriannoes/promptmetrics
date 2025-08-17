// Mock Supabase client for Lovable preview environment
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Mock user data for demo purposes
const mockUser = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  user_metadata: { full_name: 'Demo User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  phone: null,
  confirmation_sent_at: null,
  confirmed_at: '2024-01-01T00:00:00Z',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  recovery_sent_at: null,
  last_sign_in_at: '2024-01-01T00:00:00Z',
  role: 'authenticated',
  email_change: null,
  email_change_sent_at: null,
  email_change_token: null,
  email_change_confirm_status: 0,
  phone_change: null,
  phone_change_token: null,
  phone_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  new_phone: null,
  is_anonymous: false,
};

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: mockUser,
};

// Create a mock client that returns demo data
export function createMockSupabaseClient() {
  const mockClient = createClient<Database>(
    'https://demo.supabase.co',
    'demo-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  // Override auth methods to return mock data
  mockClient.auth.getSession = async () => ({
    data: { session: mockSession },
    error: null,
  });

  mockClient.auth.getUser = async () => ({
    data: { user: mockUser },
    error: null,
  });

  mockClient.auth.onAuthStateChange = (callback) => {
    // Simulate authenticated state
    setTimeout(() => {
      callback('SIGNED_IN', mockSession);
    }, 100);

    return {
      data: {
        subscription: {
          id: 'mock-subscription',
          callback,
          unsubscribe: () => {},
        },
      },
    };
  };

  // Override database methods to return mock data
  const originalFrom = mockClient.from.bind(mockClient);
  mockClient.from = (table: string) => {
    const query = originalFrom(table);
    
    // Override select method to return mock data
    const originalSelect = query.select.bind(query);
    query.select = (...args: any[]) => {
      const selectQuery = originalSelect(...args);
      
      // Return mock profile data for profiles table
      if (table === 'profiles') {
        selectQuery.single = async () => ({
          data: {
            id: 'demo-user-id',
            full_name: 'Demo User',
            email: 'demo@example.com',
            role: 'client',
            organization_id: null,
            invite_code: 'DEMO2024',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          error: null,
        });
      }

      return selectQuery;
    };

    return query;
  };

  return mockClient;
}