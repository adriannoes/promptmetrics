import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { CTAButton } from '@/components/ui/cta-button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OrganizationSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  // Permitir teste sem login quando em DEV
  const allowWithoutAuth = import.meta.env.DEV && !profile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome da organização');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-organization', {
        body: { name: name.trim() }
      });
      if (error || !data?.organization_id) {
        console.error('create-organization error:', error || data);
        toast.error('Não foi possível criar a organização');
        return;
      }
      toast.success('Organização criada! Agora conecte seu domínio');
      navigate('/domain-setup', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Erro inesperado ao criar organização');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 pt-16 pb-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Configure sua organização</h1>
          <p className="text-slate-600 mb-8">Vamos começar com algumas informações básicas antes de conectar seu domínio.</p>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto text-left">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Nome da organização</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Minha Empresa" disabled={loading} required />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Setor (opcional)</label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Tecnologia" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Tamanho (opcional)</label>
              <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="51-200" disabled={loading} />
            </div>
            <CTAButton type="submit" disabled={loading} className="w-full sm:w-auto px-10">
              {loading ? 'Salvando…' : 'Continuar'}
            </CTAButton>
          </form>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default OrganizationSetup;


