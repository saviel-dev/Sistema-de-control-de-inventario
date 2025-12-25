import { createContext, useContext, ReactNode } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { tourSteps, tourConfig } from '@/config/tour.config';
import { useTheme } from 'next-themes';

interface TourContextType {
  startTour: () => void;
  driverObj: Driver | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();

  const driverObj = driver({
    ...tourConfig,
    onDestroyStarted: () => {
      // Permitir cerrar el tour
      if (driverObj) {
        driverObj.destroy();
      }
    },
    onDestroyed: () => {
      // Tour completado o cerrado
      console.log('Tour finalizado');
    },
  });

  const startTour = () => {
    // Aplicar clase de tema al driver
    const driverElement = document.querySelector('.driver-popover');
    if (driverElement) {
      driverElement.classList.add(theme === 'dark' ? 'driver-theme-dark' : 'driver-theme-light');
    }

    driverObj.setConfig({
      steps: tourSteps,
    });

    driverObj.drive();
  };

  return (
    <TourContext.Provider value={{ startTour, driverObj }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
