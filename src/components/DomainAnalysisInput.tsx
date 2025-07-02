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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    try {
      // Trigger analysis workflow
      const { data, error } = await supabase.functions.invoke('trigger-analysis', {
        body: { domain: domain.trim() }
      });

      if (error) {
        console.error('Error triggering analysis:', error);
        toast.error('Failed to start analysis');
        return;
      }

      toast.success('Analysis started! Results will appear shortly.');
      onAnalyze(domain.trim());
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start analysis');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <Input
        type="text"
        placeholder="Enter domain to analyze (e.g., lovable.dev)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="flex-1"
        disabled={loading}
      />
      <Button 
        type="submit" 
        disabled={!domain.trim() || loading}
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