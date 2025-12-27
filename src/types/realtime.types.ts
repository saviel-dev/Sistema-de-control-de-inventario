// Tipos para Supabase Realtime
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Tipos de eventos de cambio
export type ChangeEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Nombres de tablas del schema
export type TableName = keyof Database['public']['Tables'];

// Payload genérico para cambios en cualquier tabla
export type RealtimePayload<T extends TableName> = RealtimePostgresChangesPayload<
  Database['public']['Tables'][T]['Row']
>;

// Configuración para una suscripción
export interface RealtimeSubscriptionConfig<T extends TableName> {
  table: T;
  event: ChangeEventType;
  schema?: string;
  filter?: string;
  onInsert?: (payload: RealtimePayload<T>) => void;
  onUpdate?: (payload: RealtimePayload<T>) => void;
  onDelete?: (payload: RealtimePayload<T>) => void;
  onError?: (error: Error) => void;
}

// Estado de la suscripción
export type SubscriptionStatus = 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR';

// Resultado de crear una suscripción
export interface SubscriptionResult {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

// Opciones para debouncing/throttling
export interface RateLimitOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

// Handler genérico para cambios
export type ChangeHandler<T extends TableName> = (
  payload: RealtimePayload<T>
) => void | Promise<void>;

// Configuración de reconexión
export interface ReconnectConfig {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}
