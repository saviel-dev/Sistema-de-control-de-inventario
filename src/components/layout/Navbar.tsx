import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConfiguracion } from "@/hooks/useConfiguracion";
import { useNotifications } from "@/contexts/NotificationContext";
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    ArrowLeftRight,
    BarChart3,
    Settings,
    UtensilsCrossed,
    Bell,
    ShoppingBag,
    CreditCard,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User,
    Store,
} from "lucide-react";

const simpleNavItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/movimientos", icon: ArrowLeftRight, label: "Movimientos" },
    { to: "/reportes", icon: BarChart3, label: "Reportes" },
];

const insumosSubmenu = [
    { to: "/inventario-general", icon: Package, label: "Insumos Generales" },
    { to: "/inventario-detallado", icon: ClipboardList, label: "Insumos Detallados" },
];

const negocioSubmenu = [
    { to: "/productos-menu", icon: ShoppingBag, label: "Productos" },
    { to: "/punto-venta", icon: CreditCard, label: "POS" },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { configuracion } = useConfiguracion('sistema.nombre');
    const { unreadCount } = useNotifications();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [insumosMenuOpen, setInsumosMenuOpen] = useState(false);
    const [mobileInsumosOpen, setMobileInsumosOpen] = useState(false);
    const [negocioMenuOpen, setNegocioMenuOpen] = useState(false);
    const [mobileNegocioOpen, setMobileNegocioOpen] = useState(false);

    return (
        <nav className="bg-sidebar border-b border-sidebar-border shadow-md">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo y Nombre */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sidebar-foreground font-semibold text-lg">
                            <UtensilsCrossed className="w-6 h-6" />
                            <span className="hidden sm:inline">{configuracion?.valor || "Auto-eat"}</span>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        {simpleNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Insumos Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setInsumosMenuOpen(true)}
                            onMouseLeave={() => setInsumosMenuOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${location.pathname.includes('/inventario')
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                            >
                                <Package className="w-4 h-4" />
                                <span>Insumos</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${insumosMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {insumosMenuOpen && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                    <div className="p-2">
                                        {insumosSubmenu.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                        : "text-foreground hover:bg-secondary"
                                                    }`
                                                }
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Negocio Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setNegocioMenuOpen(true)}
                            onMouseLeave={() => setNegocioMenuOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${location.pathname.includes('/productos-menu') || location.pathname.includes('/punto-venta')
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                            >
                                <Store className="w-4 h-4" />
                                <span>Negocio</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${negocioMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {negocioMenuOpen && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                    <div className="p-2">
                                        {negocioSubmenu.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                        : "text-foreground hover:bg-secondary"
                                                    }`
                                                }
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Notifications, Settings, User */}
                    <div className="flex items-center gap-2">
                        {/* Notificaciones */}
                        <NavLink
                            to="/notificaciones"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }`
                            }
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-sidebar" />
                            )}
                        </NavLink>

                        {/* Configuración */}
                        <NavLink
                            to="/configuracion"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }`
                            }
                        >
                            <Settings className="w-5 h-5" />
                        </NavLink>

                        {/* User Menu - Desktop */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent"
                            >
                                <img
                                    src={user?.avatar_url || "https://i.pravatar.cc/150?img=11"}
                                    alt={user?.nombre || "Usuario"}
                                    className="w-7 h-7 rounded-full border-2 border-primary object-cover"
                                />
                                <span className="hidden xl:inline">{user?.nombre || "Usuario"}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                        <div className="p-3 border-b border-border">
                                            <p className="text-sm font-medium text-foreground">
                                                {user ? `${user.nombre} ${user.apellidos}` : "Usuario"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                                        </div>
                                        <div className="p-2">
                                            <NavLink
                                                to="/configuracion"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Perfil
                                            </NavLink>
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button - Hidden now that we have bottom nav */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="hidden lg:hidden p-2 text-muted-foreground hover:text-sidebar-foreground"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-sidebar-border bg-sidebar">
                    <div className="px-4 py-3 space-y-1">
                        {simpleNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Insumos Dropdown Mobile */}
                        <div>
                            <button
                                onClick={() => setMobileInsumosOpen(!mobileInsumosOpen)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${location.pathname.includes('/inventario')
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                            >
                                <Package className="w-5 h-5" />
                                <span className="flex-1 text-left">Insumos</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileInsumosOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileInsumosOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {insumosSubmenu.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                }`
                                            }
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Negocio Dropdown Mobile */}
                        <div>
                            <button
                                onClick={() => setMobileNegocioOpen(!mobileNegocioOpen)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${location.pathname.includes('/productos-menu') || location.pathname.includes('/punto-venta')
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                            >
                                <Store className="w-5 h-5" />
                                <span className="flex-1 text-left">Negocio</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileNegocioOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileNegocioOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {negocioSubmenu.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                }`
                                            }
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Info Mobile */}
                        <div className="pt-3 mt-3 border-t border-sidebar-border">
                            <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                <img
                                    src={user?.avatar_url || "https://i.pravatar.cc/150?img=11"}
                                    alt={user?.nombre || "Usuario"}
                                    className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-sidebar-foreground">
                                        {user ? `${user.nombre} ${user.apellidos}` : "Usuario"}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {user?.rol || "Rol"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border shadow-lg z-50">
                <div className="flex justify-around items-center px-2 py-2">
                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Dashboard</span>
                    </NavLink>

                    {/* Insumos */}
                    <button
                        onClick={() => {
                            setMobileNegocioOpen(false);
                            setMobileInsumosOpen(!mobileInsumosOpen);
                        }}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${location.pathname.includes('/inventario')
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Insumos</span>
                    </button>

                    {/* Negocio */}
                    <button
                        onClick={() => {
                            setMobileInsumosOpen(false);
                            setMobileNegocioOpen(!mobileNegocioOpen);
                        }}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${location.pathname.includes('/productos-menu') || location.pathname.includes('/punto-venta')
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                    >
                        <Store className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Negocio</span>
                    </button>

                    {/* Movimientos */}
                    <NavLink
                        to="/movimientos"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`
                        }
                    >
                        <ArrowLeftRight className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Movimientos</span>
                    </NavLink>

                    {/* Reportes */}
                    <NavLink
                        to="/reportes"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`
                        }
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Reportes</span>
                    </NavLink>
                </div>
            </div>

            {/* Bottom Sheet for Insumos */}
            {mobileInsumosOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setMobileInsumosOpen(false)}
                    />
                    <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-2xl z-50 animate-in slide-in-from-bottom">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Insumos
                                </h3>
                                <button
                                    onClick={() => setMobileInsumosOpen(false)}
                                    className="p-2 rounded-lg hover:bg-secondary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {insumosSubmenu.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileInsumosOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Sheet for Negocio */}
            {mobileNegocioOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setMobileNegocioOpen(false)}
                    />
                    <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-2xl z-50 animate-in slide-in-from-bottom">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Store className="w-5 h-5 text-primary" />
                                    Negocio
                                </h3>
                                <button
                                    onClick={() => setMobileNegocioOpen(false)}
                                    className="p-2 rounded-lg hover:bg-secondary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {negocioSubmenu.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileNegocioOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
