import { useState, useEffect } from 'react';
import { DolarParaleloResponse } from '@/types/exchangeRate';

const PARALELO_API_URL = 'https://ve.dolarapi.com/v1/dolares/paralelo';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos

interface CachedData {
    data: DolarParaleloResponse;
    timestamp: number;
}

let cachedParalelo: CachedData | null = null;

export const useDolarParalelo = () => {
    const [data, setData] = useState<DolarParaleloResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDolarParalelo = async () => {
        // Verificar si hay datos en caché y son válidos
        const now = Date.now();
        if (cachedParalelo && (now - cachedParalelo.timestamp) < CACHE_DURATION) {
            setData(cachedParalelo.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(PARALELO_API_URL);

            if (!response.ok) {
                throw new Error(`Error al obtener dólar paralelo: ${response.statusText}`);
            }

            const result: DolarParaleloResponse = await response.json();

            // Actualizar caché
            cachedParalelo = {
                data: result,
                timestamp: now
            };

            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error fetching dólar paralelo:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDolarParalelo();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchDolarParalelo
    };
};
