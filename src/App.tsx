import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ExchangeRateProvider } from '@/contexts/ExchangeRateContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { DetailedInventoryProvider } from '@/contexts/DetailedInventoryContext';
import { MovementsProvider } from '@/contexts/MovementsContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { TourProvider } from '@/contexts/TourContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import InventarioGeneral from '@/pages/InventarioGeneral';
import InventarioDetallado from '@/pages/InventarioDetallado';
import Movimientos from '@/pages/Movimientos';
import Configuracion from '@/pages/Configuracion';
import Reportes from '@/pages/Reportes';
import Notificaciones from '@/pages/Notificaciones';
import ProductosMenu from '@/pages/ProductosMenu';
import PuntoDeVenta from '@/pages/PuntoDeVenta';
import Index from '@/pages/Index';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <ExchangeRateProvider>
              <ProductProvider>
                <LocationProvider>
                  <DetailedInventoryProvider>
                    <MovementsProvider>
                      <ReportsProvider>
                        <DashboardProvider>
                          <TourProvider>
                            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                              <Toaster position="top-right" richColors />
                              <Routes>
                                {/* Ruta pública - Login */}
                                <Route path="/" element={<Index />} />

                                {/* Rutas protegidas - Dashboard */}
                                <Route element={<DashboardLayout />}>
                                  <Route path="dashboard" element={<Dashboard />} />
                                  <Route path="inventario-general" element={<InventarioGeneral />} />
                                  <Route path="inventario-detallado" element={<InventarioDetallado />} />
                                  <Route path="movimientos" element={<Movimientos />} />
                                  <Route path="productos-menu" element={<ProductosMenu />} />
                                  <Route path="punto-venta" element={<PuntoDeVenta />} />
                                  <Route path="configuracion" element={<Configuracion />} />
                                  <Route path="reportes" element={<Reportes />} />
                                  <Route path="notificaciones" element={<Notificaciones />} />
                                </Route>
                              </Routes>
                            </Router>
                          </TourProvider>
                        </DashboardProvider>
                      </ReportsProvider>
                    </MovementsProvider>
                  </DetailedInventoryProvider>
                </LocationProvider>
              </ProductProvider>
            </ExchangeRateProvider>
          </NotificationProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
