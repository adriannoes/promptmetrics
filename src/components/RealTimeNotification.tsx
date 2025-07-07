import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RealTimeNotificationProps {
  isConnected: boolean;
  hasNewData: boolean;
  lastUpdated: Date | null;
  onMarkAsRead: () => void;
  onRefresh?: () => void;
  className?: string;
}

export const RealTimeNotification: React.FC<RealTimeNotificationProps> = ({
  isConnected,
  hasNewData,
  lastUpdated,
  onMarkAsRead,
  onRefresh,
  className = '',
}) => {
  const { t } = useLanguage();

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}min atrás`;
    }
    return `${seconds}s atrás`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Conectado em tempo real
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-orange-600" />
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Modo fallback (polling)
              </Badge>
            </>
          )}
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Última atualização: {formatLastUpdated(lastUpdated)}</span>
          </div>
        )}
      </div>

      {/* New Data Alert */}
      {hasNewData && (
        <Alert className="bg-blue-50 border-blue-200 animate-in slide-in-from-top-2">
          <RefreshCw className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-800 font-medium">
                  🎉 Novos dados disponíveis!
                </span>
                <span className="text-blue-600 text-sm">
                  A análise foi atualizada em tempo real.
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onRefresh && (
                  <Button
                    onClick={onRefresh}
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Atualizar
                  </Button>
                )}
                <Button
                  onClick={onMarkAsRead}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar como lido
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Help Text */}
      {!isConnected && (
        <p className="text-xs text-gray-500">
          📡 Tentando reconectar ao sistema em tempo real... Os dados serão atualizados automaticamente a cada 10 segundos.
        </p>
      )}
    </div>
  );
}; 