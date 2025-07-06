import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Test: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugResults, setDebugResults] = useState<any>(null);

  const logResult = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const formattedMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(formattedMessage);
    setTestResults(prev => [...prev, formattedMessage]);
  };

  // Teste simples de conectividade
  const testSupabaseConnection = async () => {
    setLoading(true);
    setDebugResults(null);
    setTestResults([]);
    
    try {
      logResult('🔍 Iniciando teste de conectividade...', 'info');
      
      // Teste 1: Conectividade básica
      logResult('Testando conexão básica...', 'info');
      const { data, error } = await supabase
        .from('analysis_results')
        .select('domain, status, created_at')
        .limit(5);
        
      if (error) {
        logResult(`❌ Erro na conectividade: ${error.message}`, 'error');
        return;
      }
      
      logResult(`✅ Conectividade OK! Encontrados ${data.length} registros`, 'success');
      
      // Teste 2: Buscar especificamente pipefy.com
      logResult('Buscando dados do pipefy.com...', 'info');
      const { data: pipefyData, error: pipefyError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', 'pipefy.com')
        .single();
        
      if (pipefyError) {
        logResult(`❌ Erro buscando pipefy.com: ${pipefyError.message}`, 'error');
        return;
      }
      
      if (pipefyData) {
        logResult('✅ Dados do pipefy.com encontrados!', 'success');
        const analysisData = pipefyData.analysis_data as any;
        logResult(`📊 Score: ${analysisData?.score || 'N/A'}`, 'info');
        logResult(`📅 Última atualização: ${new Date(pipefyData.updated_at).toLocaleString('pt-BR')}`, 'info');
        
        setDebugResults(pipefyData);
        logResult('🎯 Teste de conectividade COMPLETO!', 'success');
      } else {
        logResult('❌ Nenhum dado encontrado para pipefy.com', 'warning');
      }
      
    } catch (error) {
      logResult(`💥 Erro no teste: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const testMyRankDirectly = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      logResult('🔍 Testando hook useAnalysisData simulado...', 'info');
      
      const { data: result, error: fetchError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', 'pipefy.com')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        logResult(`❌ Erro na query: ${fetchError.message}`, 'error');
        return;
      }

      if (result) {
        logResult('✅ useAnalysisData simulado: SUCESSO', 'success');
        logResult(`📊 Dados carregados: ${result.domain}`, 'info');
        logResult('🎯 O problema NÃO é com os dados!', 'success');
        logResult('❗ O problema pode ser com o hook useAnalysisData', 'warning');
      } else {
        logResult('❌ Nenhum resultado encontrado', 'warning');
      }
      
    } catch (error) {
      logResult(`💥 Erro: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Debug Simplificado</h1>
        <p className="text-gray-600">
          Teste de conectividade básica com o Supabase.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Testes de Debug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={testSupabaseConnection}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Testar Conectividade
              </Button>
              
              <Button
                onClick={testMyRankDirectly}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Simular useAnalysisData
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setTestResults([]);
                  setDebugResults(null);
                }}
                disabled={loading}
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Results */}
        {debugResults && (
          <Card>
            <CardHeader>
              <CardTitle>🔍 Dados Encontrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Domínio</Badge>
                  <span>{debugResults.domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Status</Badge>
                  <span className={debugResults.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                    {debugResults.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Score</Badge>
                  <span>{(debugResults.analysis_data as any)?.score || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Atualizado</Badge>
                  <span>{new Date(debugResults.updated_at).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Logs de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-500">Clique em um botão para iniciar o teste.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-2 rounded text-sm font-mono ${
                    result.includes('SUCCESS') || result.includes('✅') ? 'bg-green-50 text-green-800' :
                    result.includes('ERROR') || result.includes('❌') ? 'bg-red-50 text-red-800' :
                    result.includes('WARNING') || result.includes('❗') ? 'bg-yellow-50 text-yellow-800' :
                    'bg-gray-50 text-gray-800'
                  }`}>
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test;
