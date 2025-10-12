import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Settings, 
  BarChart3, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { RankLLMInput } from '@/components/dashboard/rankllm/RankLLMInput';
import { RankLLMResults } from '@/components/dashboard/rankllm/RankLLMResults';
import { ModelSelector } from '@/components/dashboard/rankllm/ModelSelector';
import { RankLLMRequest, RankLLMResponse } from '@/types/rankllm';
import { useRankLLMAccess } from '@/hooks/useRankLLMAccess';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const DocumentRanking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RankLLMResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>('');
  
  // Check RankLLM access
  const { canAccess, method, loading: accessLoading, error: accessError } = useRankLLMAccess();

  // Get current domain from URL or use default
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const domainParam = urlParams.get('domain');
    if (domainParam) {
      setDomain(domainParam);
    } else {
      // Try to get from localStorage or use a default
      const savedDomain = localStorage.getItem('currentDomain');
      if (savedDomain) {
        setDomain(savedDomain);
      }
    }
  }, []);

  const handleRankingSubmit = async (request: RankLLMRequest) => {
    setLoading(true);
    setError(null);
    setActiveTab('results');

    try {
      logger.info('Submitting RankLLM request', { domain: request.domain, model: request.model });

      const { data, error: edgeError } = await supabase.functions.invoke('trigger-rankllm-analysis', {
        body: {
          domain: request.domain,
          query: request.query,
          documents: request.documents,
          model: request.model,
          top_k: request.top_k
        }
      });

      if (edgeError) {
        throw new Error(`Edge function error: ${edgeError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to process ranking request');
      }

      logger.info('RankLLM request submitted successfully', { id: data.id });

      // Wait a moment then fetch results
      setTimeout(() => {
        fetchRankingResults(request.domain);
      }, 2000);

    } catch (err) {
      logger.error('Error submitting RankLLM request', err);
      setError(err instanceof Error ? err.message : 'Failed to submit ranking request');
    } finally {
      setLoading(false);
    }
  };

  const fetchRankingResults = async (targetDomain: string) => {
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('get-rankllm-data', {
        body: { domain: targetDomain, limit: 10 }
      });

      if (fetchError) {
        throw new Error(`Failed to fetch results: ${fetchError.message}`);
      }

      if (data?.success && data.data) {
        setResults(data.data);
        logger.info('RankLLM results fetched successfully', { count: data.data.length });
      } else {
        setResults([]);
      }
    } catch (err) {
      logger.error('Error fetching RankLLM results', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    }
  };

  const handleRefresh = () => {
    if (domain) {
      fetchRankingResults(domain);
    }
  };

  // Show access denied if user cannot access RankLLM
  if (!canAccess && !accessLoading) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Your organization is configured to use {method} analysis method. 
            Contact your administrator to enable RankLLM access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading while checking access
  if (accessLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show access error
  if (accessError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error checking access permissions: {accessError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No domain specified. Please provide a domain parameter or set a current domain.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Ranking</h1>
          <p className="text-muted-foreground">
            Advanced document ranking using RankLLM with state-of-the-art LLM models
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Domain: {domain}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Input
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Results
            {results.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {results.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Models
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <RankLLMInput
            onSubmit={handleRankingSubmit}
            loading={loading}
            domain={domain}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <RankLLMResults
            results={results}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <ModelSelector
            selectedModel="monot5"
            onModelSelect={(model) => {
              // This could be used to set default model preference
              console.log('Selected model:', model);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Status Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing ranking...</span>
                </>
              ) : results.length > 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Ready - {results.length} results available</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No results yet</span>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Powered by RankLLM
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
