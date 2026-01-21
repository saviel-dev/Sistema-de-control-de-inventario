import { useExchangeRateConfig } from './useExchangeRateConfig';
import { useDolarParalelo } from './useDolarParalelo';
import { ExchangeRateInfo } from '@/types/exchangeRate';

const TASA_BCV_DEFAULT = 50.00; // Valor por defecto, debe configurarse

export const useExchangeRate = () => {
    const { config, loading: configLoading, saveConfig } = useExchangeRateConfig();
    const { data: paraleloData, loading: paraleloLoading } = useDolarParalelo();

    // Calcular la tasa efectiva según la configuración
    const getExchangeRate = (): ExchangeRateInfo => {
        if (!config) {
            // Si no hay configuración, usar BCV por defecto
            return {
                tipo: 'bcv',
                valor: TASA_BCV_DEFAULT,
                fechaActualizacion: new Date().toISOString(),
                fuente: 'BCV (por defecto)'
            };
        }

        switch (config.tipo_tasa) {
            case 'bcv':
                return {
                    tipo: 'bcv',
                    valor: TASA_BCV_DEFAULT,
                    fechaActualizacion: config.fecha_actualizacion,
                    fuente: 'BCV Oficial'
                };

            case 'paralelo':
                return {
                    tipo: 'paralelo',
                    valor: paraleloData?.promedio || TASA_BCV_DEFAULT,
                    fechaActualizacion: paraleloData?.fechaActualizacion || config.fecha_actualizacion,
                    fuente: 'Dólar Paralelo (API)'
                };

            case 'personalizada':
                return {
                    tipo: 'personalizada',
                    valor: config.valor_personalizado || TASA_BCV_DEFAULT,
                    fechaActualizacion: config.fecha_actualizacion,
                    fuente: 'Tasa Personalizada'
                };

            default:
                return {
                    tipo: 'bcv',
                    valor: TASA_BCV_DEFAULT,
                    fechaActualizacion: new Date().toISOString(),
                    fuente: 'BCV (por defecto)'
                };
        }
    };

    return {
        exchangeRate: getExchangeRate(),
        config,
        paraleloData,
        loading: configLoading || (config?.tipo_tasa === 'paralelo' && paraleloLoading),
        saveConfig
    };
};
