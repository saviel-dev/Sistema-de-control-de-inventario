import { useState, useEffect } from 'react';
import { DolarParaleloResponse } from '@/types/exchangeRate';

const BCV_API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos

interface CachedData {
    data: DolarParaleloResponse;
    timestamp: number;
}

let cachedBCV: CachedData | null = null;

export const useDolarBCV = () => {
    const [data, setData] = useState<DolarParaleloResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDolarBCV = async () => {
        // Verificar si hay datos en caché y son válidos
        const now = Date.now();
        if (cachedBCV && (now - cachedBCV.timestamp) < CACHE_DURATION) {
            setData(cachedBCV.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(BCV_API_URL);

            if (!response.ok) {
                throw new Error(`Error al obtener dólar BCV: ${response.statusText}`);
            }

            const result: DolarParaleloResponse = await response.json();

            // Actualizar caché
            cachedBCV = {
                data: result,
                timestamp: now
            };

            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error fetching dólar BCV:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDolarBCV();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchDolarBCV
    };
};
