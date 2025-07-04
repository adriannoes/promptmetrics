import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { DomainAnalysisInput } from '../components/DomainAnalysisInput';
import { AnalysisResults } from '../components/AnalysisResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Search, TrendingUp, Globe } from 'lucide-react';

const AnalysisContent = () => {
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = (domain: string) => {
    setCurrentDomain(domain);
    setLoading(true);
    
    // Simulate analysis time and refresh results
    setTimeout(() => {
      setLoading(false);
      setRefreshTrigger(prev => prev + 1);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Análise de Domínio
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Analise como sua marca aparece em sistemas de IA como ChatGPT, Gemini e Perplexity
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Análise Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Análise detalhada de como sua marca é percebida por diferentes sistemas de IA
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Insights Estratégicos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Recomendações práticas para melhorar sua presença em sistemas de IA
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Múltiplas Plataformas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Análise cross-platform incluindo ChatGPT, Gemini, Perplexity e outros
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Nova Análise
                  </CardTitle>
                  <CardDescription>
                    Digite o domínio que deseja analisar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DomainAnalysisInput 
                    onAnalyze={handleAnalyze}
                    loading={loading}
                  />
                  
                  {loading && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <div>
                          <p className="font-medium text-blue-900">Análise em andamento</p>
                          <p className="text-sm text-blue-700">
                            Analisando {currentDomain}... Isso pode levar alguns minutos.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como funciona?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">1</Badge>
                    <div>
                      <p className="font-medium">Digite seu domínio</p>
                      <p className="text-sm text-muted-foreground">Digite o domínio do seu site (ex: lovable.dev)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">2</Badge>
                    <div>
                      <p className="font-medium">Processamento IA</p>
                      <p className="text-sm text-muted-foreground">Nosso sistema consulta múltiplas IAs sobre sua marca</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">3</Badge>
                    <div>
                      <p className="font-medium">Relatório completo</p>
                      <p className="text-sm text-muted-foreground">Receba insights e recomendações detalhadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Histórico de Análises
                  </CardTitle>
                  <CardDescription>
                    Resultados das análises realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto">
                    <AnalysisResults 
                      domain={currentDomain || undefined}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

const Analysis = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AnalysisContent />
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default Analysis;