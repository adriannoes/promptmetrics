/**
 * Unified real-time subscription hook
 * Provides consistent real-time subscription management across the application
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { TIMEOUTS } from '@/config/timeouts';
import { handleError, ERROR_CODES } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

export interface RealtimeSubscriptionOptions {
  table: string;
  schema?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  channelName?: string;
}

export interface RealtimeSubscriptionResult {
  isConnected: boolean;
  error: Error | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

/**
 * Unified hook for managing real-time subscriptions
 */
export const useRealtimeSubscription = (
  options: RealtimeSubscriptionOptions
): RealtimeSubscriptionResult => {
  const {
    table,
    schema = 'public',
    filter,
    event = '*',
    onInsert,
    onUpdate,
    onDelete,
    onError,
    enabled = true,
    channelName,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const mountedRef = useRef(true);

  // Generate channel name if not provided
  const finalChannelName = channelName || `realtime:${table}:${schema}`;

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      logger.db(`Unsubscribing from channel: ${finalChannelName}`, {
        table,
        schema,
      });

      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, [finalChannelName, table, schema]);

  const subscribe = useCallback(() => {
    if (!enabled || !mountedRef.current) {
      return;
    }

    // Clean up existing subscription
    unsubscribe();

    try {
      logger.db(`Subscribing to real-time channel: ${finalChannelName}`, {
        table,
        schema,
        event,
        filter,
      });

      // Create channel
      const channel = supabase
        .channel(finalChannelName)
        .on(
          'postgres_changes',
          {
            event,
            schema,
            table,
            filter,
          },
          (payload) => {
            if (!mountedRef.current) return;

            logger.db(`Real-time event received`, {
              event: payload.eventType,
              table,
              new: !!payload.new,
              old: !!payload.old,
            });

            try {
              switch (payload.eventType) {
                case 'INSERT':
                  if (onInsert) {
                    onInsert(payload);
                  }
                  break;
                case 'UPDATE':
                  if (onUpdate) {
                    onUpdate(payload);
                  }
                  break;
                case 'DELETE':
                  if (onDelete) {
                    onDelete(payload);
                  }
                  break;
              }
            } catch (err) {
              const appError = handleError(err, {
                operation: `realtime:${payload.eventType}`,
                context: { table, schema },
              });
              
              logger.error(`Error handling real-time event`, {
                error: appError.message,
                event: payload.eventType,
              });

              if (onError) {
                onError(appError);
              }
              setError(appError);
            }
          }
        )
        .subscribe((status) => {
          if (!mountedRef.current) return;

          logger.db(`Subscription status changed`, {
            status,
            channel: finalChannelName,
          });

          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setError(null);
          } else if (status === 'CHANNEL_ERROR') {
            const err = new Error(`Failed to subscribe to channel: ${finalChannelName}`);
            const appError = handleError(err, {
              operation: 'realtime:subscribe',
              context: { table, schema, status },
            });
            setError(appError);
            setIsConnected(false);
            
            if (onError) {
              onError(appError);
            }
          } else if (status === 'TIMED_OUT') {
            const err = new Error(`Subscription timed out: ${finalChannelName}`);
            const appError = handleError(err, {
              operation: 'realtime:subscribe',
              context: { table, schema, status },
            });
            appError.code = ERROR_CODES.TIMEOUT_ERROR;
            setError(appError);
            setIsConnected(false);
            
            if (onError) {
              onError(appError);
            }
          } else {
            setIsConnected(false);
          }
        });

      channelRef.current = channel;

      // Set up timeout for subscription
      const timeoutId = setTimeout(() => {
        if (!isConnected && mountedRef.current) {
          logger.error(`Subscription timeout for channel: ${finalChannelName}`, {
            table,
            schema,
          });
          
          const err = new Error(`Subscription timeout: ${finalChannelName}`);
          const appError = handleError(err, {
            operation: 'realtime:subscribe',
            context: { table, schema },
          });
          appError.code = ERROR_CODES.TIMEOUT_ERROR;
          setError(appError);
          setIsConnected(false);
          
          if (onError) {
            onError(appError);
          }
        }
      }, TIMEOUTS.SUBSCRIPTION_TIMEOUT);

      // Clear timeout when connected
      if (isConnected) {
        clearTimeout(timeoutId);
      }

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (err) {
      const appError = handleError(err, {
        operation: 'realtime:subscribe',
        context: { table, schema },
      });
      
      logger.error(`Failed to create subscription`, {
        error: appError.message,
        table,
        schema,
      });

      setError(appError);
      setIsConnected(false);
      
      if (onError) {
        onError(appError);
      }
    }
  }, [
    enabled,
    finalChannelName,
    table,
    schema,
    event,
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onError,
    isConnected,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      subscribe();
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [enabled, subscribe, unsubscribe]);

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
  };
};
