
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import * as authService from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, profile, loading } = useAuthState();

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp: authService.signUp,
      signIn: authService.signIn,
      signInWithGoogle: authService.signInWithGoogle,
      signInWithDemo: authService.signInWithDemo,
      signOut: authService.signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn('useAuth called outside of AuthProvider, returning fallback values');
    return {
      user: null,
      session: null,
      profile: null,
      loading: false,
      signUp: async () => ({ error: { message: 'Auth not initialized' } }),
      signIn: async () => ({ error: { message: 'Auth not initialized' } }),
      signInWithGoogle: async () => ({ error: { message: 'Auth not initialized' } }),
      signInWithDemo: async () => ({ error: { message: 'Auth not initialized' } }),
      signOut: async () => ({ success: false })
    };
  }
  return context;
};
