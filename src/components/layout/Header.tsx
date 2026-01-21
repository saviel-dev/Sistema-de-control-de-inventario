import { Menu, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTour } from "@/contexts/TourContext";


interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
  const { logout } = useAuth();
  const { startTour } = useTour();
  const navigate = useNavigate();


  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-card shadow-sm flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-muted-foreground hover:text-primary flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground capitalize">
            {currentDate}
          </p>
        </div>



        {/* Tour Button */}
        <button
          onClick={startTour}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          title="Cómo usar"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden md:inline">Cómo usar</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-destructive transition-all duration-200"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
