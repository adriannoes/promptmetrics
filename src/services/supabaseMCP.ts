// Serviço que usa MCPs do Supabase diretamente
// Isso garante que estejamos usando a mesma abordagem que o Lovable

import { logger } from '@/utils/logger';

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

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

// Função para executar SQL diretamente via cliente Supabase
const executeMCPSQL = async (query: string): Promise<any[]> => {
  logger.db('Executando query', { query: query.substring(0, 100) + '...' });
  
  // Importar o cliente Supabase apenas aqui para manter compatibilidade
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Para queries de SELECT simples, podemos usar o cliente direto
  if (query.includes('SELECT') && query.includes('profiles')) {
    if (query.includes('WHERE id =')) {
      const userId = query.match(/'([^']+)'/)?.[1];
      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error && error.code === 'PGRST116') {
          return [];
        }
        
        if (error) {
          throw error;
        }
        
        return data ? [data] : [];
      }
    }
  }
  
  if (query.includes('SELECT') && query.includes('organizations')) {
    if (query.includes('WHERE slug =')) {
      const slug = query.match(/'([^']+)'/)?.[1];
      if (slug) {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error && error.code === 'PGRST116') {
          return [];
        }
        
        if (error) {
          throw error;
        }
        
        return data ? [data] : [];
      }
    }
  }
  
  throw new Error('Unsupported query pattern');
};

// Função para buscar profile por ID de usuário
export const getProfileByUserId = async (userId: string): Promise<{ data: Profile | null; error: any }> => {
  try {
    logger.db('Buscando profile para usuário');
    
    // Usar o cliente Supabase diretamente para maior confiabilidade
    const { supabase } = await import('@/integrations/supabase/client');
    
    logger.db('Cliente Supabase importado, fazendo query...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Usar maybeSingle em vez de single para evitar erro se não encontrar
    
    logger.db('Query executada', { 
      hasData: !!data, 
      hasError: !!error,
      data: data ? {
        id: data.id,
        email: data.email,
        full_name: data.full_name
      } : null,
      error: error ? {
        code: error.code,
        message: error.message
      } : null
    });
    
    if (error) {
      logger.error('Erro ao buscar profile', error);
      return { data: null, error };
    }
    
    if (!data) {
      logger.db('Profile não encontrado');
      return { data: null, error: { code: 'PGRST116', message: 'Profile not found' } };
    }
    
    logger.db('Profile encontrado', {
      id: data.id,
      email: data.email,
      full_name: data.full_name
    });
    return { data: data as Profile, error: null };
  } catch (error) {
    logger.error('Erro ao buscar profile', error);
    return { data: null, error };
  }
};

// Função para criar um profile
export const createProfile = async (profileData: Omit<Profile, 'created_at' | 'updated_at'>): Promise<{ data: Profile | null; error: any }> => {
  try {
    logger.db('Criando profile');
    
    // Para INSERT, vamos usar o cliente direto por segurança
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        full_name: profileData.full_name,
        email: profileData.email,
        role: profileData.role,
        invite_code: profileData.invite_code,
        organization_id: profileData.organization_id
      })
      .select()
      .single();
    
    if (error) {
      return { data: null, error };
    }

    return { data: data as Profile, error: null };
  } catch (error) {
    logger.error('Erro ao criar profile', error);
    return { data: null, error };
  }
};

// Função para buscar organização por slug
export const getOrganizationBySlug = async (slug: string): Promise<{ data: Organization | null; error: any }> => {
  try {
    logger.db('Buscando organização', { slug });
    
    const query = `SELECT * FROM organizations WHERE slug = '${slug}'`;
    const result = await executeMCPSQL(query);
    
    if (result.length === 0) {
      return { data: null, error: { code: 'PGRST116', message: 'Organization not found' } };
    }

    return { data: result[0] as Organization, error: null };
  } catch (error) {
    logger.error('Erro ao buscar organização', error);
    return { data: null, error };
  }
};