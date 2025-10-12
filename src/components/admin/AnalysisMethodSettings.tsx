import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Zap,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface AnalysisMethodSettingsProps {
  organizationId?: string;
}

export const AnalysisMethodSettings: React.FC<AnalysisMethodSettingsProps> = ({ 
  organizationId 
}) => {
  const { user } = useAuth();
  const [currentMethod, setCurrentMethod] = useState<string>('n8n');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (organizationId) {
      fetchCurrentMethod();
    }
  }, [organizationId]);

  const fetchCurrentMethod = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('preferred_analysis_method')
        .eq('id', organizationId)
        .single();

      if (error) {
        throw error;
      }

      setCurrentMethod(data?.preferred_analysis_method || 'n8n');
    } catch (err) {
      logger.error('Error fetching analysis method', err);
      setMessage({ type: 'error', text: 'Failed to load current settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!organizationId) {
      setMessage({ type: 'error', text: 'No organization selected' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('organizations')
        .update({ preferred_analysis_method: currentMethod })
        .eq('id', organizationId);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Analysis method updated successfully' });
      logger.info('Analysis method updated', { method: currentMethod, organizationId });
    } catch (err) {
      logger.error('Error updating analysis method', err);
      setMessage({ type: 'error', text: 'Failed to update analysis method' });
    } finally {
      setSaving(false);
    }
  };

  const getMethodInfo = (method: string) => {
    switch (method) {
      case 'n8n':
        return {
          name: 'N8N Analysis',
          description: 'Original workflow-based analysis using multiple LLMs',
          icon: <Zap className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          features: ['Multi-LLM comparison', 'Workflow automation', 'Real-time analysis']
        };
      case 'rankllm':
        return {
          name: 'RankLLM Reranking',
          description: 'Advanced document ranking using state-of-the-art LLM models',
          icon: <Brain className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          features: ['Scientific ranking', 'Multiple model types', 'Quantitative metrics']
        };
      case 'both':
        return {
          name: 'Both Methods',
          description: 'Users can choose between N8N and RankLLM for each analysis',
          icon: <FileText className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          features: ['Flexibility', 'A/B testing', 'User choice']
        };
      default:
        return {
          name: 'Unknown',
          description: '',
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          features: []
        };
    }
  };

  const currentInfo = getMethodInfo(currentMethod);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Analysis Method Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure which analysis method users in this organization can access
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Method Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Method:</span>
            <Badge className={currentInfo.color}>
              {currentInfo.icon}
              <span className="ml-1">{currentInfo.name}</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentInfo.description}
          </p>
        </div>

        {/* Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Analysis Method:</label>
          <Select value={currentMethod} onValueChange={setCurrentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="n8n">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <div>
                    <div className="font-medium">N8N Analysis</div>
                    <div className="text-xs text-muted-foreground">Original workflow-based</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="rankllm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <div>
                    <div className="font-medium">RankLLM Reranking</div>
                    <div className="text-xs text-muted-foreground">Advanced document ranking</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="both">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Both Methods</div>
                    <div className="text-xs text-muted-foreground">User choice</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Method Features */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Features:</span>
          <div className="flex flex-wrap gap-2">
            {currentInfo.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
