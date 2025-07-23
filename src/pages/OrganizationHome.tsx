
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import OrganizationHeader from '@/components/OrganizationHeader';
import OrganizationDashboard from '@/components/OrganizationDashboard';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, TrendingUp } from 'lucide-react';

const OrganizationHome = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAuth();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Organization slug is required');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Check for analysis results
  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis-results', organization?.website_url],
    queryFn: async () => {
      if (!organization?.website_url) return null;
      
      const domain = organization.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching analysis results:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!organization?.website_url,
    refetchInterval: 30000, // Poll every 30 seconds when analysis is not complete
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !organization) {
    return <UnauthorizedAccess message="Organization not found" />;
  }

  // Check if user belongs to this organization
  if (profile?.organization_id !== organization.id) {
    return <UnauthorizedAccess message="You don't have access to this organization" />;
  }

  // Show analysis in progress if no data available
  const showAnalysisProgress = organization?.website_url && !analysisData && !analysisLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <OrganizationHeader organization={organization} />
      
      {showAnalysisProgress ? (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Analysis in Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  We're analyzing your website and generating comprehensive insights.
                </p>
                <p className="text-sm text-gray-500">
                  This usually takes about 5 minutes for the first analysis.
                </p>
              </div>
              
              <div className="space-y-3">
                <Progress value={75} className="h-2" />
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Processing your data...</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">SEO Analysis</p>
                  <p className="text-xs text-blue-700">Scanning content</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-indigo-50">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-900">Performance</p>
                  <p className="text-xs text-indigo-700">Testing speed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Competitors</p>
                  <p className="text-xs text-purple-700">Analyzing market</p>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  You can refresh this page to check for updates, or we'll automatically refresh the data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <OrganizationDashboard organization={organization} />
      )}
    </div>
  );
};

export default OrganizationHome;
