import React, { createContext, useContext, useState, useEffect } from 'react';
import { negociosService } from '@/services/negocios.service';
import type { Negocio } from '@/types/database.types';
import { toast } from 'sonner';
import { createRealtimeSubscription, realtimeLogger } from '@/lib/realtime-utils';
import type { RealtimePayload } from '@/types/realtime.types';

// Interfaz Location para compatibilidad con componentes existentes
export interface Location {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface LocationContextType {
  locations: Location[];
  loading: boolean;
  error: string | null;
  addLocation: (location: Omit<Location, 'id'>) => Promise<void>;
  updateLocation: (location: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  refreshLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Función helper para convertir de Negocio a Location
const mapToLocation = (negocio: Negocio): Location => ({
  id: negocio.id,
  name: negocio.nombre,
  address: negocio.direccion || undefined,
  phone: negocio.telefono || undefined,
  email: negocio.email || undefined,
});

// Función helper para convertir de Location a Negocio
const mapFromLocation = (location: Omit<Location, 'id'>): Omit<Negocio, 'id' | 'fecha_creacion' | 'fecha_actualizacion'> => ({
  nombre: location.name,
  direccion: location.address || null,
  telefono: location.phone || null,
  email: location.email || null,
  activo: true,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar ubicaciones al montar el componente y configurar suscripción Realtime
  useEffect(() => {
    loadLocations();

    // Configurar suscripción Realtime para negocios
    realtimeLogger.log('Setting up Realtime subscription for negocios');
    
    const { unsubscribe } = createRealtimeSubscription({
      table: 'negocios',
      event: '*',
      onInsert: (payload: RealtimePayload<'negocios'>) => {
        realtimeLogger.log('New location inserted:', payload.new);
        if (payload.new && 'activo' in payload.new && payload.new.activo) {
          const newLocation = mapToLocation(payload.new as Negocio);
          setLocations((prevLocations) => {
            const exists = prevLocations.some(l => l.id === newLocation.id);
            if (exists) return prevLocations;
            return [...prevLocations, newLocation];
          });
        }
      },
      onUpdate: (payload: RealtimePayload<'negocios'>) => {
        realtimeLogger.log('Location updated:', payload.new);
        if (payload.new && 'id' in payload.new) {
          const updatedLocation = mapToLocation(payload.new as Negocio);
          setLocations((prevLocations) => 
            prevLocations.map(l => l.id === updatedLocation.id ? updatedLocation : l)
          );
        }
      },
      onDelete: (payload: RealtimePayload<'negocios'>) => {
        realtimeLogger.log('Location deleted:', payload.old);
        if (payload.old && 'id' in payload.old) {
          setLocations((prevLocations) => 
            prevLocations.filter(l => l.id !== payload.old.id)
          );
        }
      },
      onError: (error) => {
        realtimeLogger.error('Error in negocios subscription:', error);
      },
    });

    // Cleanup al desmontar
    return () => {
      realtimeLogger.log('Cleaning up negocios subscription');
      unsubscribe();
    };
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await negociosService.obtenerTodos(true);
      const mappedLocations = data.map(mapToLocation);
      setLocations(mappedLocations);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar ubicaciones';
      setError(errorMsg);
      console.error('Error al cargar ubicaciones:', err);
      // No mostrar toast en la carga inicial para no bloquear la UI
      setLocations([]); // Asegurar que locations sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (location: Omit<Location, 'id'>) => {
    try {
      setError(null);
      const newLocationData = mapFromLocation(location);
      await negociosService.crear(newLocationData);
      // No actualizar estado local aquí - la suscripción Realtime lo hará automáticamente
      toast.success(`Ubicación "${location.name}" agregada exitosamente`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al agregar ubicación';
      setError(errorMsg);
      console.error('Error al agregar ubicación:', err);
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateLocation = async (location: Location) => {
    try {
      setError(null);
      const updateData = {
        nombre: location.name,
        direccion: location.address || null,
        telefono: location.phone || null,
        email: location.email || null,
      };
      await negociosService.actualizar(location.id, updateData);
      // No actualizar estado local aquí - la suscripción Realtime lo hará automáticamente
      toast.success(`Ubicación "${location.name}" actualizada exitosamente`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar ubicación';
      setError(errorMsg);
      console.error('Error al actualizar ubicación:', err);
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      setError(null);
      const location = locations.find(l => l.id === id);
      await negociosService.eliminar(id);
      // No actualizar estado local aquí - la suscripción Realtime lo hará automáticamente
      toast.success(`Ubicación "${location?.name || 'desconocida'}" eliminada exitosamente`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar ubicación';
      setError(errorMsg);
      console.error('Error al eliminar ubicación:', err);
      toast.error(errorMsg);
      throw err;
    }
  };

  const refreshLocations = async () => {
    await loadLocations();
  };

  return (
    <LocationContext.Provider value={{
      locations,
      loading,
      error,
      addLocation,
      updateLocation,
      deleteLocation,
      refreshLocations
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
