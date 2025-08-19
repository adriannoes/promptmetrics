import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalysisProgressModalProps {
  open: boolean;
  onClose: () => void;
  status: 'processing' | 'completed' | 'failed';
  domain: string;
  elapsedTime: number;
  onViewRanking?: () => void;
  onCancel: () => void;
  error?: string | null;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  open,
  onClose,
  status,
  domain,
  elapsedTime,
  onViewRanking,
  onCancel,
  error
}) => {
  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="max-w-md w-full backdrop-blur-xl bg-white/90 border-white/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {status === 'processing' && (
              <span className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse" />
                  <Loader2 className="relative w-5 h-5 text-blue-600 animate-spin" />
                </div>
                Análise em andamento...
              </span>
            )}
            {status === 'completed' && (
              <span className="flex items-center gap-2 text-green-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md" />
                  <CheckCircle className="relative w-5 h-5" />
                </div>
                Análise concluída!
              </span>
            )}
            {status === 'failed' && (
              <span className="flex items-center gap-2 text-red-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md" />
                  <Clock className="relative w-5 h-5" />
                </div>
                Tempo esgotado
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {status === 'processing' && (
              <>
                Processando análise para <strong>{domain}</strong>.<br />
                Aguarde enquanto coletamos e processamos os dados.
              </>
            )}
            {status === 'completed' && (
              <>
                A análise para <strong>{domain}</strong> foi concluída com sucesso!
              </>
            )}
            {status === 'failed' && (
              <>
                A análise demorou mais que o esperado. Você pode tentar novamente ou verificar o status em "Ver sua análise".
              </>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100/80 border border-red-300/60 text-red-800 rounded-lg backdrop-blur-sm">
                <strong>Erro:</strong> {error}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-blue-100/80 text-blue-700 border-blue-300/60 backdrop-blur-sm">
            ⏱️ {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="outline" className="bg-green-100/80 text-green-700 border-green-300/60 backdrop-blur-sm">
            🔍 Verificando dados periodicamente
          </Badge>
        </div>
        
        <DialogFooter className="mt-6 flex flex-row gap-3 justify-end">
          {status === 'processing' && (
            <Button 
              onClick={onCancel} 
              variant="outline" 
              className="border-blue-300/60 text-blue-700 hover:bg-blue-100/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              Cancelar
            </Button>
          )}
          {(status === 'completed' || status === 'failed') && onViewRanking && (
            <Button 
              onClick={onViewRanking} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Ver sua análise
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisProgressModal; 