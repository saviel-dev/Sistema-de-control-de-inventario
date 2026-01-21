import { supabase } from './supabase';
import type {
  RealtimeSubscriptionConfig,
  SubscriptionResult,
  TableName,
  RateLimitOptions,
  ReconnectConfig,
} from '@/types/realtime.types';

// Flag para habilitar/deshabilitar logs de debug
const DEBUG = false; // Logs deshabilitados

/**
 * Logger condicional para debugging de Realtime
 */
export const realtimeLogger = {
  log: (...args: any[]) => {
    if (DEBUG) console.log('[Realtime]', ...args);
  },
  warn: (...args: any[]) => {
    if (DEBUG) console.warn('[Realtime]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[Realtime]', ...args);
  },
};

/**
 * Crea una suscripción Realtime a una tabla específica con manejo de errores
 */
export function createRealtimeSubscription<T extends TableName>(
  config: RealtimeSubscriptionConfig<T>
): SubscriptionResult {
  const { table, event, schema = 'public', filter, onInsert, onUpdate, onDelete, onError } = config;

  // Crear nombre único para el channel
  const channelName = `${table}-changes-${Date.now()}`;

  realtimeLogger.log(`Creating subscription for table: ${table}, event: ${event}`);

  // Crear channel
  const channel = supabase.channel(channelName);

  // Configurar listener de cambios de postgres
  const filterString = filter ? `${filter}` : undefined;

  channel.on(
    'postgres_changes' as const,
    {
      event,
      schema,
      table,
      filter: filterString,
    } as any,
    (payload: any) => {
      realtimeLogger.log(`Received ${payload.eventType} event for ${table}:`, payload);

      try {
        // Llamar al handler apropiado según el tipo de evento
        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload);
            break;
          case 'UPDATE':
            onUpdate?.(payload);
            break;
          case 'DELETE':
            onDelete?.(payload);
            break;
          default:
            realtimeLogger.warn(`Unknown event type: ${payload.eventType}`);
        }
      } catch (error) {
        realtimeLogger.error(`Error handling ${payload.eventType} event:`, error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }
  );

  // Suscribir y manejar estados
  channel.subscribe((status) => {
    realtimeLogger.log(`Subscription status for ${table}: ${status}`);

    if (status === 'CHANNEL_ERROR') {
      const error = new Error(`Channel error for table ${table}`);
      realtimeLogger.error(error);
      onError?.(error);
    }
  });

  // Función para limpiar la suscripción
  const unsubscribe = () => {
    realtimeLogger.log(`Unsubscribing from ${table}`);
    supabase.removeChannel(channel);
  };

  return { channel, unsubscribe };
}

/**
 * Debounce: Retrasa la ejecución de una función hasta que pase cierto tiempo
 * sin que se vuelva a llamar
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle: Limita la frecuencia de ejecución de una función
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: Omit<RateLimitOptions, 'delay'> = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecuted = 0;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    lastArgs = args;

    // Ejecutar inmediatamente si es el primer call y leading está habilitado
    if (leading && timeSinceLastExecution >= delay) {
      lastExecuted = now;
      func(...args);
      return;
    }

    // Limpiar timeout previo
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Programar ejecución si trailing está habilitado
    if (trailing) {
      const remainingTime = delay - timeSinceLastExecution;
      timeoutId = setTimeout(() => {
        lastExecuted = Date.now();
        if (lastArgs) {
          func(...lastArgs);
        }
        timeoutId = null;
      }, remainingTime > 0 ? remainingTime : delay);
    }
  };
}

/**
 * Wrapper para manejar actualizaciones optimistas del estado
 */
export async function optimisticUpdate<T>(
  updateFn: () => void,
  asyncAction: () => Promise<T>,
  rollbackFn: () => void
): Promise<T> {
  // Actualizar el estado inmediatamente
  updateFn();

  try {
    // Ejecutar la acción asíncrona
    const result = await asyncAction();
    return result;
  } catch (error) {
    // Si falla, hacer rollback
    realtimeLogger.error('Optimistic update failed, rolling back:', error);
    rollbackFn();
    throw error;
  }
}

/**
 * Helper para crear múltiples suscripciones y retornar función de cleanup
 */
export function createMultipleSubscriptions(
  configs: RealtimeSubscriptionConfig<any>[]
): () => void {
  const subscriptions = configs.map((config) => createRealtimeSubscription(config));

  return () => {
    subscriptions.forEach((sub) => sub.unsubscribe());
  };
}

/**
 * Manejo de reconexión con reintentos exponenciales
 */
export function setupReconnectionHandler(
  subscriptionFn: () => SubscriptionResult,
  config: ReconnectConfig = {}
): () => void {
  const { maxRetries = 5, retryDelay = 1000, exponentialBackoff = true } = config;

  let retries = 0;
  let currentSubscription: SubscriptionResult | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  const reconnect = () => {
    if (retries >= maxRetries) {
      realtimeLogger.error('Max reconnection retries reached');
      return;
    }

    const delay = exponentialBackoff ? retryDelay * Math.pow(2, retries) : retryDelay;

    realtimeLogger.log(`Attempting reconnection in ${delay}ms (retry ${retries + 1}/${maxRetries})`);

    reconnectTimeout = setTimeout(() => {
      retries++;
      try {
        currentSubscription = subscriptionFn();
        retries = 0; // Reset en caso de éxito
        realtimeLogger.log('Reconnection successful');
      } catch (error) {
        realtimeLogger.error('Reconnection failed:', error);
        reconnect();
      }
    }, delay);
  };

  // Crear suscripción inicial
  try {
    currentSubscription = subscriptionFn();
  } catch (error) {
    realtimeLogger.error('Initial subscription failed:', error);
    reconnect();
  }

  // Cleanup function
  return () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    currentSubscription?.unsubscribe();
  };
}
