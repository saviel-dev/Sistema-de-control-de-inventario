import { Download, Calendar, Package, AlertTriangle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '@/components/dashboard/StatCard';
import RecentMovements from '@/components/dashboard/RecentMovements';



const inventoryData = [
  { day: 'Lun', valor: 15200 },
  { day: 'Mar', valor: 14800 },
  { day: 'Mié', valor: 15100 },
  { day: 'Jue', valor: 15430 },
  { day: 'Vie', valor: 15600 },
  { day: 'Sáb', valor: 15300 },
  { day: 'Dom', valor: 15450 },
];

const criticalStock = [
  { id: 1, name: 'Salsa de Tomate', stock: 2.5, unit: 'Litros', status: 'low' },
  { id: 2, name: 'Carne de Res', stock: 0, unit: 'Kg', status: 'out' },
  { id: 3, name: 'Papas Fritas', stock: 8, unit: 'Bolsas', status: 'low' },
  { id: 4, name: 'Lechuga', stock: 1.2, unit: 'Kg', status: 'low' },
];



const Reportes = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Reportes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background appearance-none">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Este mes</option>
              <option>Este año</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Valor Inventario"
          value="$15,430"
          icon={Package}
          bgColor="bg-cyan-500"
          iconBgColor="bg-cyan-600"
          status="Actualizado hace 1h"
        />
        <StatCard
          title="Mermas del Mes"
          value="$890"
          icon={AlertTriangle}
          bgColor="bg-rose-500"
          iconBgColor="bg-rose-600"
          trend={{ value: '-5% vs mes anterior', positive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMovements />

        {/* Critical Stock */}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#222] p-4 border-b border-border">
            <h3 className="font-bold text-white text-lg">Stock Crítico</h3>
          </div>
          <div className="p-6 space-y-4">
            {criticalStock.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between ${
                  index < criticalStock.length - 1 ? 'pb-3 border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.status === 'out' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.status === 'out' ? 'Agotado' : 'Bajo Stock'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-foreground">
                    {item.stock} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Value Chart */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#222] p-4 border-b border-border">
          <h3 className="font-bold text-white text-lg">Valor de Inventario (Semana)</h3>
        </div>
        <div className="p-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={inventoryData}>
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => [`$${value}`, 'Valor']}
              />
              <Area type="monotone" dataKey="valor" stroke="hsl(var(--info))" fillOpacity={1} fill="url(#colorValor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
