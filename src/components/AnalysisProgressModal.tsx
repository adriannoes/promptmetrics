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
  onViewRanking: () => void;
  onCancel: () => void;
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
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {status === 'processing' && (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                Análise em andamento...
              </span>
            )}
            {status === 'completed' && (
              <span className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Análise concluída!
              </span>
            )}
            {status === 'failed' && (
              <span className="flex items-center gap-2 text-red-700">
                <Clock className="w-5 h-5" />
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
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            ⏱️ {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            🔍 Verificando dados periodicamente
          </Badge>
        </div>
        <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
          {status === 'processing' && (
            <Button onClick={onCancel} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Cancelar
            </Button>
          )}
          {(status === 'completed' || status === 'failed') && (
            <Button onClick={onViewRanking} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
              Ver sua análise
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisProgressModal; 