
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  invite_code?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, inviteCode: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithDemo: () => Promise<{ error: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}
