import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Header from './Header';


interface DashboardLayoutProps {
  title?: string;
}

const routeTitles: Record<string, string> = {
  '/dashboard': 'Panel de Control',
  '/inventario-general': 'Insumos Generales',
  '/inventario-detallado': 'Insumos Detallados',
  '/movimientos': 'Movimientos',
  '/productos-menu': 'Productos del Menú',
  '/punto-venta': 'Punto de Venta',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
};

const DashboardLayout = ({ title }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const { navigationType } = useSettings();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Determine title: prop title > route mapping > default
  const currentTitle = title || routeTitles[location.pathname] || 'Panel de Control';

  // Render with Navbar
  if (navigationType === 'navbar') {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />

        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:pb-6 lg:pb-8 scroll-smooth"
          style={{ paddingBottom: 'max(1.5rem, calc(5rem + env(safe-area-inset-bottom, 0px)))' }}
        >
          <Outlet />
        </main>
      </div>
    );
  }

  // Render with Sidebar (default)
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header title={currentTitle} onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
