import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Send, CheckCircle, XCircle } from 'lucide-react';
import { ErrorReportingService } from '@/services/errorReporting';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorReportButtonProps {
  domain?: string;
  error?: Error | string;
  additionalInfo?: Record<string, any>;
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ErrorReportButton: React.FC<ErrorReportButtonProps> = ({
  domain,
  error,
  additionalInfo,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [additionalDescription, setAdditionalDescription] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const errorInfo = {
        ...additionalInfo,
        user_description: additionalDescription,
        reported_at: new Date().toISOString()
      };

      let success = false;
      
      if (domain && error) {
        success = await ErrorReportingService.reportAnalysisError(domain, error, errorInfo);
      } else if (domain) {
        success = await ErrorReportingService.reportLoadingError(domain, 'User reported an issue', errorInfo);
      } else {
        success = await ErrorReportingService.reportGenericError(error || 'User reported an issue', errorInfo);
      }

      setSubmitStatus(success ? 'success' : 'error');
      
      if (success) {
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus('idle');
          setAdditionalDescription('');
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMessage = () => {
    switch (submitStatus) {
      case 'success':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          message: 'Erro reportado com sucesso! Obrigado pelo feedback.',
          className: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'error':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          message: 'Falha ao reportar erro. Tente novamente.',
          className: 'bg-red-50 border-red-200 text-red-800'
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Reportar Erro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Reportar Erro
          </DialogTitle>
          <DialogDescription>
            Ajude-nos a melhorar a plataforma relatando este erro. Suas informações serão enviadas para nossa equipe de suporte.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {domain && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Domínio:</strong> {domain}
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Erro:</strong> {typeof error === 'string' ? error : error.message}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Descreva o que aconteceu (opcional):
            </label>
            <Textarea
              placeholder="Descreva o que você estava fazendo quando o erro aconteceu..."
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          
          {statusMessage && (
            <Alert className={statusMessage.className}>
              {statusMessage.icon}
              <AlertDescription>
                {statusMessage.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Relatório
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 