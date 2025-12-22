import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  status?: string;
  secondaryValue?: string;
  bgColor: string;
  iconBgColor: string;
  action?: ReactNode;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  status,
  secondaryValue,
  bgColor,
  iconBgColor,
  action,
}: StatCardProps) => {
  return (
    <div
      className={`${bgColor} relative overflow-hidden p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white`}
    >
      {/* Background Icon */}
      <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
        <Icon className="w-32 h-32 transform rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-white/90 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-center gap-2">{action}</div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words">
            {value}
          </h3>
          {secondaryValue && (
            <p className="text-sm text-white/80 break-words">
              {secondaryValue}
            </p>
          )}
          {status && <p className="text-xs mt-2 text-white/70">{status}</p>}
          {trend && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                trend.positive ? "text-white/90" : "text-white/70"
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
