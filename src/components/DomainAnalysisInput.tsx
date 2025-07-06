import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DomainAnalysisInputProps {
  onAnalyze: (domain: string) => void;
  loading?: boolean;
}

export const DomainAnalysisInput: React.FC<DomainAnalysisInputProps> = ({ 
  onAnalyze, 
  loading = false 
}) => {
  const [domain, setDomain] = useState('');

  console.log('DomainAnalysisInput: Rendered with domain=', domain, 'loading=', loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('DomainAnalysisInput: handleSubmit called with domain:', domain);
    
    if (!domain.trim()) {
      console.log('DomainAnalysisInput: Empty domain, returning');
      return;
    }

    console.log('DomainAnalysisInput: About to call trigger-analysis edge function');

    try {
      // Trigger analysis workflow
      const { data, error } = await supabase.functions.invoke('trigger-analysis', {
        body: { domain: domain.trim() }
      });

      console.log('DomainAnalysisInput: Edge function response:', { data, error });

      if (error) {
        console.error('Error triggering analysis:', error);
        toast.error('Failed to start analysis');
        return;
      }

      console.log('DomainAnalysisInput: Analysis triggered successfully');
      toast.success('Analysis started! Results will appear shortly.');
      onAnalyze(domain.trim());
      
    } catch (error) {
      console.error('DomainAnalysisInput: Catch block error:', error);
      toast.error('Failed to start analysis');
    }
  };

  const isButtonDisabled = !domain.trim() || loading;
  console.log('DomainAnalysisInput: Button disabled?', isButtonDisabled, 'domain.trim()=', domain.trim(), 'loading=', loading);

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <Input
        type="text"
        placeholder="Enter domain to analyze (e.g., lovable.dev)"
        value={domain}
        onChange={(e) => {
          console.log('DomainAnalysisInput: Input changed to:', e.target.value);
          setDomain(e.target.value);
        }}
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
            Analyzing...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Analyze
          </>
        )}
      </Button>
    </form>
  );
};