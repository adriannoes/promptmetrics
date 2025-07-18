import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DomainAnalysisInputProps {
  onAnalyze: (domain: string) => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

export const DomainAnalysisInput: React.FC<DomainAnalysisInputProps> = ({ 
  onAnalyze, 
  loading = false,
  onError 
}) => {
  const { t } = useLanguage();
  const [domain, setDomain] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lastSubmittedDomain, setLastSubmittedDomain] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 DomainAnalysisInput: Form submitted with domain:', domain);
    
    if (!domain.trim()) {
      console.log('❌ DomainAnalysisInput: Empty domain, returning');
      return;
    }

    // Reset previous states
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');

    const trimmedDomain = domain.trim();
    
    console.log('🚀 DomainAnalysisInput: About to call trigger-analysis edge function');
    console.log('🔍 Current supabase client:', supabase);

    try {
      // Log the exact request being made
      const requestBody = { domain: trimmedDomain };
      console.log('📦 Request body:', requestBody);
      
      // Save domain to localStorage for persistence
      localStorage.setItem('lastAnalyzedDomain', trimmedDomain);
      
      // Save timestamp to indicate analysis was started
      localStorage.setItem(`analysis_started_${trimmedDomain}`, Date.now().toString());
      
      // Trigger analysis workflow
            console.log('📡 DomainAnalysisInput: Calling supabase.functions.invoke...');
      console.log('📡 Function name: trigger-analysis');
      console.log('📡 Request body:', JSON.stringify(requestBody));
      
      // Teste simples para verificar se o cliente Supabase está funcionando
      console.log('🧪 Testing Supabase client...');
      
      // Teste direto com fetch para comparar
      console.log('🧪 Testing direct fetch...');
      try {
        const directResponse = await fetch('https://racfoelvuhdifnekjsro.supabase.co/functions/v1/trigger-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        const directData = await directResponse.json();
        console.log('🧪 Direct fetch response:', directResponse.status, directData);
      } catch (directError) {
        console.error('🧪 Direct fetch error:', directError);
      }
      
      console.log('🔍 About to call supabase.functions.invoke...');
      console.log('🔍 Function name: trigger-analysis');
      console.log('🔍 Request body:', JSON.stringify(requestBody));
      
      let data, error;
      try {
        const result = await supabase.functions.invoke('trigger-analysis', {
          body: requestBody
        });
        
        data = result.data;
        error = result.error;
        
        console.log('✅ supabase.functions.invoke completed');
        console.log('📊 Data:', data);
        console.log('❗ Error:', error);
      } catch (invokeError) {
        console.error('💥 Error in supabase.functions.invoke:', invokeError);
        throw invokeError;
      }

      // NOVO: Exibir resultado bruto em toast e log
      toast("Raw response: " + JSON.stringify({ data, error }));
      console.log('🟢 Raw response from trigger-analysis:', { data, error });

      console.log('📤 DomainAnalysisInput: Edge function response received');
      console.log('📊 Data:', data);
      console.log('❗ Error:', error);

      if (error) {
        console.error('❌ Error triggering analysis:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        const errorMsg = error.message || t('domainInput.startError');
        setErrorMessage(errorMsg);
        setShowError(true);
        toast.error(`${t('domainInput.startError')}: ${error.message}`);
        
        // Report error to parent component
        if (onError) {
          onError(errorMsg);
        }
        return;
      }

      console.log('✅ DomainAnalysisInput: Analysis triggered successfully');
      
      // Show immediate visual feedback
      setLastSubmittedDomain(trimmedDomain);
      setShowSuccess(true);
      
      // Also show toast notification
      toast.success(t('domainInput.startSuccess'));
      
      // Call the parent callback
      onAnalyze(trimmedDomain);
      
      // Clear the input field
      setDomain('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('💥 DomainAnalysisInput: Catch block error:', error);
      console.error('💥 Error type:', typeof error);
      console.error('💥 Error details:', JSON.stringify(error, null, 2));
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(errorMsg);
      setShowError(true);
      toast.error(`${t('domainInput.startError')}: ${errorMsg}`);
      
      // Report error to parent component
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  const handleViewRanking = () => {
    // Navigate to /my-rank with domain parameter
    window.location.href = `/my-rank?domain=${encodeURIComponent(lastSubmittedDomain)}`;
  };

  const isButtonDisabled = !domain.trim() || loading;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Input
          type="text"
          placeholder={t('domainInput.placeholder')}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={isButtonDisabled}
          className="px-6"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {t('domainInput.analyzing')}
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              {t('domainInput.analyze')}
            </>
          )}
        </Button>
      </form>

      {/* Success feedback with navigation button */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>{t('domainInput.startSuccess')}</strong>
                <br />
                <span className="text-sm">
                  {t('domainInput.domainSubmitted')}: <strong>{lastSubmittedDomain}</strong>
                </span>
                <br />
                <span className="text-sm text-green-700">
                  {t('analysis.analysisInProgressMessage')}
                </span>
              </div>
              <Button 
                onClick={handleViewRanking}
                variant="outline"
                size="sm"
                className="ml-4 bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
              >
                {t('analysis.viewRanking')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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