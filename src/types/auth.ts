
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  invite_code?: string | null;
  organization_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'client' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  error: AuthError | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, inviteCode: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signInWithDemo: () => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}
