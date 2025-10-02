
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/auth';
import { logger } from '@/utils/logger';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  logger.auth('Estado interno', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    loading,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    let mounted = true;

    logger.auth('Iniciando useEffect');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        logger.auth('Auth state change', { event, hasUser: !!session?.user });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch profile for authenticated users
          logger.auth('User found, fetching profile', {
            userId: session.user.id,
            userEmail: session.user.email
          });
          
          try {
            logger.auth('Executando query direta no Supabase...');
            
            // Usar diretamente o cliente Supabase com timeout
            const { supabase } = await import('@/integrations/supabase/client');
            
            // Implementar timeout para evitar travamento
            const queryPromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Query timeout after 3 seconds')), 3000)
            );
            
            const result = await Promise.race([queryPromise, timeoutPromise]) as any;
            const { data: profileData, error } = result;
            
            logger.auth('Query Supabase direta concluída', {
              hasData: !!profileData,
              hasError: !!error,
              data: profileData ? {
                id: profileData.id,
                email: profileData.email,
                full_name: profileData.full_name
              } : null,
              error: error ? {
                code: error.code,
                message: error.message
              } : null
            });
            
            if (error) {
              logger.error('Error fetching profile from Supabase', error);
              
              // PGRST116 means no rows returned - profile doesn't exist
              if (error.code === 'PGRST116') {
                logger.auth('Profile does not exist (PGRST116)');
                setProfile(null);
                setUserRole(null);
              } else {
                logger.auth('Other error, setting profile to null');
                setProfile(null);
                setUserRole(null);
              }
            } else if (profileData) {
              const typedProfile: Profile = profileData;
              logger.auth('Profile set successfully from Supabase', {
                profileId: typedProfile.id,
                profileEmail: typedProfile.email
              });
              setProfile(typedProfile);
              
              // Fetch user role separately
              setTimeout(async () => {
                try {
                  const { data: roleData, error: roleError } = await supabase
                    .from('user_roles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                  
                  if (roleError) {
                    logger.error('Error fetching user role', roleError);
                    setUserRole(null);
                  } else if (roleData) {
                    setUserRole(roleData);
                    logger.auth('User role fetched', { role: roleData.role });
                  }
                } catch (error) {
                  logger.error('Error in role fetch', error);
                  setUserRole(null);
                }
              }, 0);
            } else {
              logger.auth('No profile data returned from Supabase');
              setProfile(null);
              setUserRole(null);
            }
          } catch (error) {
            logger.error('Profile fetch exception from Supabase', error);
            
            // Fallback: criar perfil temporário baseado no usuário
            logger.auth('Criando perfil temporário como fallback');
            
            const fallbackProfile: Profile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
              email: session.user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            setProfile(fallbackProfile);
            setUserRole(null);
            logger.auth('Perfil temporário criado', {
              id: fallbackProfile.id,
              email: fallbackProfile.email
            });
          }
        } else {
          // Clear profile immediately when user is null
          logger.auth('No user, clearing profile');
          setProfile(null);
          setUserRole(null);
        }
        
        // Always set loading to false after processing auth change
        logger.auth('Setting loading to false');
        if (mounted) {
          setLoading(false);
        }
        
        // Fallback adicional para garantir que loading seja false
        setTimeout(() => {
          if (mounted) {
            logger.auth('Fallback timeout - setting loading to false');
            setLoading(false);
          }
        }, 8000); // Aumentado para 8 segundos
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      logger.auth('getSession result', {
        hasSession: !!session
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session, set loading to false immediately
      if (!session && mounted) {
        logger.auth('No session found, setting loading to false');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    userRole,
    loading
  };
};
