import { AlertTriangle, TrendingUp, Coins, Wallet } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentMovements from '@/components/dashboard/RecentMovements';

const Dashboard = () => {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Bajo Stock"
          value="8 Productos"
          icon={AlertTriangle}
          status="Requiere atención"
          bgColor="bg-green-500"
          iconBgColor="bg-green-600"
        />
        <StatCard
          title="Tasa Dólar"
          value="Bs. 279.56"
          icon={TrendingUp}
          status="18-dic., 02:02 p. m."
          bgColor="bg-teal-600"
          iconBgColor="bg-teal-700"
        />
        <StatCard
          title="Valor Inventario"
          value="$15,430.00"
          icon={Coins}
          status="Actualizado hoy"
          bgColor="bg-emerald-600"
          iconBgColor="bg-emerald-700"
        />
        <StatCard
          title="Balance"
          value="$20,500.00"
          icon={Wallet}
          status="Ingasos vs Egresos"
          bgColor="bg-indigo-600"
          iconBgColor="bg-indigo-700"
          action={
            <select className="bg-white/20 border-none text-white text-xs rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="daily" className="text-black">Diario</option>
              <option value="weekly" className="text-black">Semanal</option>
            </select>
          }
        />
      </div>

      {/* Chart and Movements */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <RecentMovements />
      </div>

    </>
  );
};

export default Dashboard;
