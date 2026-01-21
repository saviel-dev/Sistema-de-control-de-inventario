import React, { createContext, useContext, useState, useEffect } from 'react';
import { useExchangeRateConfig } from '@/hooks/useExchangeRateConfig';
import { useDolarParalelo } from '@/hooks/useDolarParalelo';
import { useDolarBCV } from '@/hooks/useDolarBCV';

const TASA_BCV_DEFAULT = 50.00; // Valor por defecto BCV

interface ExchangeRateContextType {
  rate: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
  refreshRate: () => Promise<void>;
  convert: (amountUSD: number) => number;
  formatBs: (amount: number) => string;
  tipoTasa: 'bcv' | 'paralelo' | 'personalizada' | null;
  fuente: string;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export const ExchangeRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, loading: configLoading, refetch: refetchConfig } = useExchangeRateConfig();
  const { data: paraleloData, loading: paraleloLoading, refetch: refetchParalelo } = useDolarParalelo();
  const { data: bcvData, loading: bcvLoading, refetch: refetchBCV } = useDolarBCV();

  const [rate, setRate] = useState<number>(TASA_BCV_DEFAULT);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fuente, setFuente] = useState<string>('BCV (por defecto)');

  useEffect(() => {
    try {
      setError(null);

      if (!config) {
        // Sin configuración, usar BCV por defecto
        setRate(TASA_BCV_DEFAULT);
        setLastUpdated(new Date().toLocaleDateString('es-VE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));
        setFuente('BCV (por defecto)');
        return;
      }

      switch (config.tipo_tasa) {
        case 'bcv':
          if (bcvData) {
            setRate(bcvData.promedio);
            setFuente('BCV Oficial (API)');
          } else {
            setRate(TASA_BCV_DEFAULT);
            setFuente('BCV (fallback)');
          }
          break;

        case 'paralelo':
          if (paraleloData) {
            setRate(paraleloData.promedio);
            setFuente('Dólar Paralelo (API)');
          } else {
            setRate(TASA_BCV_DEFAULT);
            setFuente('BCV (fallback)');
          }
          break;

        case 'personalizada':
          if (config.valor_personalizado) {
            setRate(config.valor_personalizado);
            setFuente('Tasa Personalizada');
          } else {
            setRate(TASA_BCV_DEFAULT);
            setFuente('BCV (fallback)');
          }
          break;
      }

      // Actualizar fecha
      const dateString = config.tipo_tasa === 'bcv' && bcvData
        ? bcvData.fechaActualizacion
        : config.tipo_tasa === 'paralelo' && paraleloData
          ? paraleloData.fechaActualizacion
          : config.fecha_actualizacion;

      const date = new Date(dateString);
      setLastUpdated(date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    } catch (err) {
      console.error('Error calculating exchange rate:', err);
      setError('Error al calcular tasa de cambio');
    }
  }, [config, paraleloData, bcvData]);

  const refreshRate = async () => {
    await refetchConfig();
    if (config?.tipo_tasa === 'paralelo') {
      await refetchParalelo();
    } else if (config?.tipo_tasa === 'bcv') {
      await refetchBCV();
    }
  };

  const convert = (amountUSD: number) => {
    return amountUSD * rate;
  };

  const formatBs = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const isLoading = configLoading ||
    (config?.tipo_tasa === 'paralelo' && paraleloLoading) ||
    (config?.tipo_tasa === 'bcv' && bcvLoading);

  return (
    <ExchangeRateContext.Provider value={{
      rate,
      lastUpdated,
      isLoading,
      error,
      refreshRate,
      convert,
      formatBs,
      tipoTasa: config?.tipo_tasa || null,
      fuente
    }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
};
