import { NavLink } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConfiguracion } from "@/hooks/useConfiguracion";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTour } from "@/contexts/TourContext";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowLeftRight,
  BarChart3,
  Settings,
  X,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tourId: "dashboard-link" },
  { to: "/inventario-general", icon: Package, label: "Inventario General", tourId: "inventario-general-link" },
  {
    to: "/inventario-detallado",
    icon: ClipboardList,
    label: "Inventario Detallado",
    tourId: "inventario-detallado-link"
  },
  { to: "/movimientos", icon: ArrowLeftRight, label: "Movimientos", tourId: "movimientos-link" },
  { to: "/reportes", icon: BarChart3, label: "Reportes", tourId: "reportes-link" },
];

const systemItems = [
  { to: "/notificaciones", icon: Bell, label: "Notificaciones", badge: true, tourId: "notificaciones-link" },
  { to: "/configuracion", icon: Settings, label: "Configuración", tourId: "configuracion-link" },
];

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const { user } = useAuth();
  const { configuracion } = useConfiguracion('sistema.nombre');
  const { unreadCount } = useNotifications();
  const { startTour } = useTour();
  const [activeTooltip, setActiveTooltip] = useState<{ label: string; top: number; left: number; badge?: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, label: string, badge?: number) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      label,
      top: rect.top + (rect.height / 2) - 16, // Center vertically roughly
      left: rect.right + 10,
      badge
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/50 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        data-tour="sidebar"
        className={`bg-sidebar text-sidebar-foreground ${isCollapsed ? 'w-16' : 'w-56'} flex-shrink-0 fixed md:relative h-full z-30 transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sidebar-foreground font-semibold text-lg tracking-wide">
            <UtensilsCrossed className="w-6 h-6" />
            {!isCollapsed && <span>{configuracion?.valor || "Auto-eat"}</span>}
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-sidebar-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                  onMouseLeave={handleMouseLeave}
                  data-tour={item.tourId}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 group ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}

            {!isCollapsed && (
              <li className="pt-4 mt-4 border-t border-sidebar-border">
                <span className="px-4 text-xs font-semibold text-muted-foreground uppercase">
                  Sistema
                </span>
              </li>
            )}

            {/* Tour Button */}
            <li className={isCollapsed ? 'mt-4 pt-4 border-t border-sidebar-border' : ''}>
              <button
                onClick={startTour}
                onMouseEnter={(e) => handleMouseEnter(e, "Cómo usar")}
                onMouseLeave={handleMouseLeave}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 group text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              >
                <HelpCircle className="w-5 h-5" />
                {!isCollapsed && <span>Cómo usar</span>}
              </button>
            </li>

            {systemItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label, item.badge && unreadCount > 0 ? unreadCount : undefined)}
                  onMouseLeave={handleMouseLeave}
                  data-tour={item.tourId}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 group relative ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {item.badge && unreadCount > 0 && isCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-sidebar" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="hidden md:flex p-3 border-t border-sidebar-border justify-center">
          <button
            onClick={onToggleCollapse}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} p-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm`}
            title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span>Minimizar</span>}
          </button>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-sidebar-border bg-foreground/5" data-tour="user-profile">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <img
              src={user?.avatar_url || "https://i.pravatar.cc/150?img=11"}
              alt={user?.nombre || "Usuario"}
              className="w-8 h-8 rounded-full border-2 border-primary object-cover"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate" title={`${user?.nombre || ''} ${user?.apellidos || ''}`.trim()}>
                  {user ? `${user.nombre} ${user.apellidos}` : "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.rol || "Rol"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Tooltip Portal */}
      {activeTooltip && isCollapsed && createPortal(
        <div 
          className="fixed px-3 py-1.5 bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium rounded-lg shadow-lg z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2"
          style={{ 
            top: activeTooltip.top, 
            left: activeTooltip.left,
          }}
        >
          {activeTooltip.label}
          {activeTooltip.badge && (
            <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {activeTooltip.badge > 99 ? '99+' : activeTooltip.badge}
            </span>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default Sidebar;
