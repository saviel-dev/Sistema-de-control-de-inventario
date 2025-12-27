import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';
import { supabase } from '@/lib/supabase';
import type { Movimiento } from '@/types/database.types';

interface DashboardContextType {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  totalProducts: 0,
  totalValue: 0,
  lowStockCount: 0,
  recentMovements: [],
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar estadísticas del dashboard';
      setError(errorMsg);
      console.error(errorMsg, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Subscribe to realtime changes in multiple tables to update dashboard stats
    // Using debounce to avoid excessive refreshes
    let refreshTimeout: NodeJS.Timeout | null = null;
    const debouncedRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        loadStats();
      }, 1000); // Esperar 1 segundo antes de refrescar
    };

    const channel = supabase
      .channel('dashboard-all-changes')
      // Suscribirse a cambios en inventario_general
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventario_general' },
        () => {
          console.log('[Dashboard] Inventario general changed');
          debouncedRefresh();
        }
      )
      // Suscribirse a cambios en inventario_detallado
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventario_detallado' },
        () => {
          console.log('[Dashboard] Inventario detallado changed');
          debouncedRefresh();
        }
      )
      // Suscribirse a cambios en movimientos
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movimientos' },
        () => {
          console.log('[Dashboard] Movimientos changed');
          debouncedRefresh();
        }
      )
      .subscribe();

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshStats = async () => {
    await loadStats();
  };

  return (
    <DashboardContext.Provider value={{ stats, loading, error, refreshStats }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
