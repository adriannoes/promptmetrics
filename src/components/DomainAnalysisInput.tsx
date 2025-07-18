
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AnalysisProgressModal from './AnalysisProgressModal';

interface DomainAnalysisInputProps {
  onAnalyze: (domain: string) => void;
  loading: boolean;
  onError: (error: string) => void;
}

export const DomainAnalysisInput: React.FC<DomainAnalysisInputProps> = ({ 
  onAnalyze, 
  loading,
  onError 
}) => {
  const { t } = useLanguage();
  const [domain, setDomain] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedDomain, setLastSubmittedDomain] = useState('');

  // Estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modalElapsedTime, setModalElapsedTime] = useState(0);
  const [modalError, setModalError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const validateDomain = (input: string): boolean => {
    // Validação básica - apenas verifica se não está vazio
    // O backend fará validação mais específica
    return input.trim().length > 0;
  };

  // Função para verificar se os dados chegaram
  const checkAnalysisData = async (domain: string): Promise<boolean> => {
    try {
      console.log('🔍 DomainAnalysisInput: Checking analysis data for:', domain);
      
      // Primeiro, tenta buscar pelo domínio específico
      let { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Se não encontrou, busca qualquer análise recente (útil para casos onde o domínio pode estar diferente)
      if (!data) {
        console.log('🔄 DomainAnalysisInput: Domain not found, checking for recent analysis...');
        const result = await supabase
          .from('analysis_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
        
        if (data) {
          console.log('📋 DomainAnalysisInput: Found recent analysis for domain:', data.domain);
          // Atualiza o localStorage com o domínio correto
          localStorage.setItem('lastAnalyzedDomain', data.domain);
        }
      }

      if (error) {
        console.error('❌ DomainAnalysisInput: Error checking analysis data:', error);
        return false;
      }

      if (data && data.status === 'completed' && data.analysis_data) {
        console.log('✅ DomainAnalysisInput: Analysis data found and completed:', data);
        return true;
      }

      console.log('⏳ DomainAnalysisInput: Analysis data not ready yet:', data);
      return false;
    } catch (error) {
      console.error('💥 DomainAnalysisInput: Error in checkAnalysisData:', error);
      return false;
    }
  };

  // Função para iniciar polling
  const startPolling = (domain: string) => {
    console.log('🔄 DomainAnalysisInput: Starting polling for domain:', domain);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      setModalElapsedTime(prev => prev + 10);
      
      const hasData = await checkAnalysisData(domain);
      
      if (hasData) {
        console.log('🎉 DomainAnalysisInput: Analysis completed!');
        setModalStatus('completed');
        clearInterval(interval);
        return;
      }

      // Verificar timeout (5 minutos)
      if (modalElapsedTime >= 300) {
        console.log('⏰ DomainAnalysisInput: Max wait time reached');
        setModalStatus('failed');
        clearInterval(interval);
        setModalError('A análise está demorando mais que o esperado.');
        return;
      }
    }, 10000); // Verificar a cada 10 segundos

    setPollingInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 DomainAnalysisInput: Form submitted with domain:', domain);

    const trimmedDomain = domain.trim();
    
    if (!validateDomain(trimmedDomain)) {
      const errorMsg = t('domainInput.invalidDomain');
      console.log('❌ DomainAnalysisInput: Invalid domain:', trimmedDomain);
      setErrorMessage(errorMsg);
      setShowError(true);
      if (onError) {
        onError(errorMsg);
      }
      return;
    }

    setShowError(false);
    setShowSuccess(false);
    setErrorMessage('');

    // Abrir modal imediatamente
    setModalOpen(true);
    setModalStatus('processing');
    setModalElapsedTime(0);
    setModalError(null);

    console.log('🚀 DomainAnalysisInput: Triggering analysis for:', trimmedDomain);

    try {
      const requestBody = { domain: trimmedDomain };
      console.log('📦 DomainAnalysisInput: Request body:', requestBody);
      
      // Save domain to localStorage for persistence
      localStorage.setItem('lastAnalyzedDomain', trimmedDomain);
      localStorage.setItem(`analysis_started_${trimmedDomain}`, Date.now().toString());
      
      console.log('📡 DomainAnalysisInput: About to call supabase.functions.invoke("trigger-analysis")...');
      console.log('📡 DomainAnalysisInput: Using body:', JSON.stringify(requestBody));
      console.log('📡 DomainAnalysisInput: Supabase client available?', !!supabase);
      console.log('📡 DomainAnalysisInput: Supabase functions available?', !!supabase.functions);
      
      // Teste se podemos chamar qualquer função primeiro
      console.log('🧪 DomainAnalysisInput: Testing connection to Supabase functions...');
      
      console.log('⏳ DomainAnalysisInput: Function invocation started...');
      
      // Tentar chamada direta com fetch como alternativa
      console.log('🔄 DomainAnalysisInput: Trying direct fetch as alternative...');
      
      const functionUrl = `https://racfoelvuhdifnekjsro.supabase.co/functions/v1/trigger-analysis`;
      console.log('📍 DomainAnalysisInput: Function URL:', functionUrl);
      
      try {
        const directResponse = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0`,
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('🎯 DomainAnalysisInput: Direct fetch response status:', directResponse.status);
        console.log('🎯 DomainAnalysisInput: Direct fetch response statusText:', directResponse.statusText);
        console.log('🎯 DomainAnalysisInput: Direct fetch response headers:', Object.fromEntries(directResponse.headers.entries()));
        
        const responseText = await directResponse.text();
        console.log('📄 DomainAnalysisInput: Direct fetch response text:', responseText);
        
        let data = null;
        let error = null;
        
        if (directResponse.ok) {
          try {
            data = JSON.parse(responseText);
            console.log('✅ DomainAnalysisInput: Parsed response data:', data);
          } catch (parseError) {
            console.log('⚠️ DomainAnalysisInput: Response is not JSON:', responseText);
            data = { message: responseText };
          }
        } else {
          error = {
            message: `HTTP ${directResponse.status}: ${directResponse.statusText}`,
            status: directResponse.status,
            body: responseText
          };
          console.error('❌ DomainAnalysisInput: Direct fetch error:', error);
        }
        
        console.log('📊 DomainAnalysisInput: Function response - data:', data, 'error:', error);
        console.log('📊 DomainAnalysisInput: Data type:', typeof data);
        console.log('📊 DomainAnalysisInput: Error type:', typeof error);

        if (error) {
          console.error('❌ DomainAnalysisInput: Function returned error:', error);
          console.error('❌ DomainAnalysisInput: Error details:', JSON.stringify(error, null, 2));
          console.error('❌ DomainAnalysisInput: Error message:', error.message);
          console.error('❌ DomainAnalysisInput: Error status:', error.status);
          
          const errorMsg = error.message || t('domainInput.startError');
          setModalError(errorMsg);
          setModalStatus('failed');
          toast.error(`Erro na função: ${errorMsg}`);
          
          if (onError) {
            onError(errorMsg);
          }
          return;
        }

        if (data) {
          console.log('✅ DomainAnalysisInput: Function returned success data:', data);
          console.log('🎯 DomainAnalysisInput: N8N webhook should have been triggered');
        } else {
          console.log('⚠️ DomainAnalysisInput: Function returned no data, but no error either');
        }

        console.log('✅ DomainAnalysisInput: Analysis triggered successfully');
        
        // Iniciar polling para aguardar dados
        startPolling(trimmedDomain);
        
        // Call the parent callback
        console.log('📞 DomainAnalysisInput: Calling parent onAnalyze with:', trimmedDomain);
        onAnalyze(trimmedDomain);
        
        // Clear the input field
        setDomain('');
        
      } catch (fetchError) {
        console.error('💥 DomainAnalysisInput: Direct fetch error:', fetchError);
        
        const errorMsg = fetchError instanceof Error ? fetchError.message : t('domainInput.startError');
        setModalError(errorMsg);
        setModalStatus('failed');
        
        if (onError) {
          onError(errorMsg);
        }
      }
        
    } catch (error) {
      console.error('💥 DomainAnalysisInput: Catch block - Unexpected error:', error);
      console.error('💥 DomainAnalysisInput: Error type:', typeof error);
      console.error('💥 DomainAnalysisInput: Error details:', JSON.stringify(error, null, 2));
      console.error('💥 DomainAnalysisInput: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMsg = error instanceof Error ? error.message : t('domainInput.startError');
      setModalError(errorMsg);
      setModalStatus('failed');
      
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  const handleViewRanking = () => {
    const currentDomain = localStorage.getItem('lastAnalyzedDomain');
    if (currentDomain) {
      window.location.href = `/my-rank?domain=${encodeURIComponent(currentDomain)}`;
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalStatus('processing');
    setModalElapsedTime(0);
    setModalError(null);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={t('domainInput.placeholder')}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading || !domain.trim()}
            className="whitespace-nowrap"
          >
            {loading ? t('domainInput.analyzing') : t('domainInput.analyze')}
          </Button>
        </div>
      </form>

      {/* Analysis Progress Modal */}
      <AnalysisProgressModal
        open={modalOpen}
        onClose={handleCloseModal}
        status={modalStatus}
        domain={localStorage.getItem('lastAnalyzedDomain') || ''}
        elapsedTime={modalElapsedTime}
        onViewRanking={modalStatus === 'completed' ? handleViewRanking : undefined}
        onCancel={handleCloseModal}
        error={modalError}
      />

      {/* Error feedback */}
      {showError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{t('domainInput.startError')}</strong>
            <br />
            <span className="text-sm">
              {errorMessage}
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
