import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { TipoTasa } from '@/types/exchangeRate';
import type { ExchangeRateConfigRow } from '@/types/database.types';

export const useExchangeRateConfig = () => {
    const { user } = useAuth();
    const [config, setConfig] = useState<ExchangeRateConfigRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Obtener configuración actual
    const fetchConfig = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('exchange_rate_config')
                .select('*')
                .eq('usuario_id', user.id)
                .single();

            if (fetchError) {
                // Si no existe configuración, es normal (primera vez)
                if (fetchError.code === 'PGRST116') {
                    setConfig(null);
                } else {
                    throw fetchError;
                }
            } else {
                setConfig(data);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener configuración';
            setError(errorMessage);
            console.error('Error fetching exchange rate config:', err);
        } finally {
            setLoading(false);
        }
    };

    // Guardar o actualizar configuración
    const saveConfig = async (tipoTasa: TipoTasa, valorPersonalizado?: number) => {
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Validar que si es personalizada, tenga valor y sea > 0
        if (tipoTasa === 'personalizada') {
            if (!valorPersonalizado || valorPersonalizado <= 0) {
                throw new Error('La tasa personalizada debe ser mayor que 0');
            }
        }

        try {
            // Preparar los datos de configuración con tipos explícitos
            const configData: {
                usuario_id: string;
                tipo_tasa: 'bcv' | 'paralelo' | 'personalizada';
                valor_personalizado: number | null;
                fecha_actualizacion: string;
            } = {
                usuario_id: user.id, // Incluir explícitamente para DEV_MODE
                tipo_tasa: tipoTasa,
                valor_personalizado: tipoTasa === 'personalizada' ? (valorPersonalizado ?? null) : null,
                fecha_actualizacion: new Date().toISOString()
            };

            // Intentar actualizar primero, si no existe, insertar
            const { data: existingConfig } = await supabase
                .from('exchange_rate_config')
                .select('id')
                .eq('usuario_id', user.id)
                .maybeSingle();

            if (existingConfig) {
                // Actualizar
                const { data, error: updateError } = await supabase
                    .from('exchange_rate_config')
                    .update(configData)
                    .eq('usuario_id', user.id)
                    .select()
                    .single();

                if (updateError) throw updateError;
                setConfig(data);
            } else {
                // Insertar
                const { data, error: insertError } = await supabase
                    .from('exchange_rate_config')
                    .insert(configData)
                    .select()
                    .single();

                if (insertError) throw insertError;
                setConfig(data);
            }

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar configuración';
            setError(errorMessage);
            console.error('Error saving exchange rate config:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchConfig();
    }, [user]);

    return {
        config,
        loading,
        error,
        saveConfig,
        refetch: fetchConfig
    };
};
