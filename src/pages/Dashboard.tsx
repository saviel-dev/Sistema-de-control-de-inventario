import { AlertTriangle, TrendingUp, Coins, Package, Loader2, Settings } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentMovements from '@/components/dashboard/RecentMovements';
import PageTransition from '@/components/layout/PageTransition';
import { useExchangeRate } from '@/contexts/ExchangeRateContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { ExchangeRateModal } from '@/components/ExchangeRateModal';
import { useState } from 'react';

const Dashboard = () => {
  const { rate, lastUpdated, isLoading: isRateLoading, formatBs, convert, tipoTasa, fuente } = useExchangeRate();
  const { stats, loading: isStatsLoading } = useDashboard();
  const [modalOpen, setModalOpen] = useState(false);

  if (isStatsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Productos"
          value={`${stats.totalProducts}`}
          icon={Package}
          status="En insumos generales"
          bgColor="bg-blue-600"
          iconBgColor="bg-blue-700"
        />
        <StatCard
          title={tipoTasa === 'personalizada' ? 'Tasa Personalizada' : tipoTasa === 'paralelo' ? 'Dólar Paralelo' : 'Tasa BCV'}
          value={isRateLoading ? "Actualizando..." : `Bs. ${rate.toFixed(2)}`}
          icon={TrendingUp}
          status={fuente ? `${fuente} - ${lastUpdated}` : lastUpdated || "Consultando..."}
          bgColor="bg-indigo-600"
          iconBgColor="bg-indigo-700"
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              title="Configurar tasa"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          }
        />
        <StatCard
          title="Valor Insumos"
          value={`$${stats.totalValue.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
          secondaryValue={formatBs(convert(stats.totalValue))}
          icon={Coins}
          status="Valor total estimado"
          bgColor="bg-emerald-600"
          iconBgColor="bg-emerald-700"
        />
        <StatCard
          title="Bajo Stock"
          value={`${stats.lowStockCount}`}
          secondaryValue="Productos en alerta"
          icon={AlertTriangle}
          status={stats.lowStockCount > 0 ? "Requiere atención" : "Stock saludable"}
          bgColor="bg-amber-500"
          iconBgColor="bg-amber-600"
        />
      </div>

      {/* Chart and Movements */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <RecentMovements customData={stats.recentMovements} />
      </div>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentTasa={rate}
      />
    </PageTransition>
  );
};

export default Dashboard;
