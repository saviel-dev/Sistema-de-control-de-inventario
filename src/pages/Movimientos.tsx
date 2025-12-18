import { ArrowLeftRight, ArrowDown, ArrowUp, Plus, Search, Calendar, Table2, Grid3x3, ArrowDownCircle, ArrowUpCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Movement {
  id: string;
  date: string;
  time: string;
  product: string;
  type: 'entrada' | 'salida' | 'ajuste' | 'merma';
  quantity: number;
  unit: string;
  reason: string;
  user: string;
  reference?: string;
}

const movements: Movement[] = [
  { id: 'M001', date: '2024-01-18', time: '10:30', product: 'Harina de Trigo', type: 'entrada', quantity: 50, unit: 'Kg', reason: 'Compra a proveedor', user: 'Carlos Admin', reference: 'OC-2024-001' },
  { id: 'M002', date: '2024-01-18', time: '11:15', product: 'Coca Cola 355ml', type: 'salida', quantity: 12, unit: 'Unidades', reason: 'Venta', user: 'María Cajera', reference: 'V-2024-089' },
  { id: 'M003', date: '2024-01-18', time: '11:45', product: 'Queso Mozzarella', type: 'merma', quantity: 2, unit: 'Kg', reason: 'Producto vencido', user: 'Carlos Admin' },
  { id: 'M004', date: '2024-01-18', time: '12:00', product: 'Tomates Frescos', type: 'entrada', quantity: 10, unit: 'Kg', reason: 'Compra a proveedor', user: 'Carlos Admin', reference: 'OC-2024-002' },
  { id: 'M005', date: '2024-01-18', time: '13:30', product: 'Aceite Vegetal', type: 'ajuste', quantity: -3, unit: 'Litros', reason: 'Ajuste de inventario', user: 'Carlos Admin' },
  { id: 'M006', date: '2024-01-17', time: '09:00', product: 'Carne de Res', type: 'entrada', quantity: 30, unit: 'Kg', reason: 'Compra a proveedor', user: 'Carlos Admin', reference: 'OC-2024-003' },
  { id: 'M007', date: '2024-01-17', time: '14:20', product: 'Pan de Hamburguesa', type: 'salida', quantity: 24, unit: 'Paquetes', reason: 'Producción', user: 'Chef Pedro' },
  { id: 'M008', date: '2024-01-17', time: '16:45', product: 'Lechuga Fresca', type: 'merma', quantity: 1.5, unit: 'Kg', reason: 'Deterioro', user: 'Chef Pedro' },
];

const typeConfig = {
  entrada: { label: 'Entrada', icon: ArrowDownCircle, className: 'bg-success/10 text-success', bgColor: 'bg-green-500', iconBg: 'bg-green-600' },
  salida: { label: 'Salida', icon: ArrowUpCircle, className: 'bg-info/10 text-info', bgColor: 'bg-blue-500', iconBg: 'bg-blue-600' },
  ajuste: { label: 'Ajuste', icon: RefreshCw, className: 'bg-warning/10 text-warning', bgColor: 'bg-amber-500', iconBg: 'bg-amber-600' },
  merma: { label: 'Merma', icon: AlertTriangle, className: 'bg-destructive/10 text-destructive', bgColor: 'bg-rose-500', iconBg: 'bg-rose-600' },
};

const Movimientos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Actualizar título del header
  useEffect(() => {
    const headerTitle = document.querySelector('header h2');
    if (headerTitle) {
      headerTitle.textContent = 'Movimientos';
    }
  }, []);

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    const matchesDate = !dateFilter || movement.date === dateFilter;
    return matchesSearch && matchesType && matchesDate;
  });

  const todayEntries = movements.filter(m => m.date === '2024-01-18' && m.type === 'entrada').length;
  const todayExits = movements.filter(m => m.date === '2024-01-18' && m.type === 'salida').length;
  const todayAdjustments = movements.filter(m => m.date === '2024-01-18' && (m.type === 'ajuste' || m.type === 'merma')).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-green-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Entradas Hoy</p>
            <div className="p-2 bg-green-600 rounded-full flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{todayEntries}</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Salidas Hoy</p>
            <div className="p-2 bg-blue-600 rounded-full flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{todayExits}</p>
        </div>
        <div className="bg-amber-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Ajustes/Mermas</p>
            <div className="p-2 bg-amber-600 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{todayAdjustments}</p>
        </div>
        <div className="bg-purple-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Total Movimientos</p>
            <div className="p-2 bg-purple-600 rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{movements.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
            </div>
            <div className="flex gap-3 sm:gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select-category flex-1 sm:flex-none"
              >
                <option value="all">Todos los tipos</option>
                <option value="entrada">Entradas</option>
                <option value="salida">Salidas</option>
                <option value="ajuste">Ajustes</option>
                <option value="merma">Mermas</option>
              </select>
              <div className="relative flex-1 sm:flex-none">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="hidden sm:flex gap-2 border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm transition-colors flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-blue-500 text-white'
                    : 'bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <Table2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 text-sm transition-colors flex items-center gap-1 ${
                  viewMode === 'cards'
                    ? 'bg-blue-500 text-white'
                    : 'bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              className="button flex-1 sm:flex-none sm:ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Movimiento</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movements View */}
      {viewMode === 'table' ? (
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#222] text-white text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium text-center">ID</th>
                  <th className="p-4 font-medium text-center">Fecha/Hora</th>
                  <th className="p-4 font-medium text-center">Producto</th>
                  <th className="p-4 font-medium text-center">Tipo</th>
                  <th className="p-4 font-medium text-center">Cantidad</th>
                  <th className="p-4 font-medium text-center">Razón</th>
                  <th className="p-4 font-medium text-center">Usuario</th>
                  <th className="p-4 font-medium text-center">Referencia</th>
                </tr>
              </thead>
              <tbody className="text-sm text-foreground divide-y divide-border">
                {filteredMovements.map((movement) => {
                  const config = typeConfig[movement.type];
                  return (
                    <tr key={movement.id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-4 font-medium text-muted-foreground text-center">{movement.id}</td>
                      <td className="p-4 text-center">
                        <div>
                          <p className="font-medium">{movement.date}</p>
                          <p className="text-xs text-muted-foreground">{movement.time}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-center">{movement.product}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className={`p-4 font-bold text-center ${
                        movement.type === 'entrada' ? 'text-success' : 
                        movement.type === 'salida' || movement.type === 'merma' ? 'text-destructive' : 
                        'text-warning'
                      }`}>
                        {movement.type === 'entrada' ? '+' : movement.type === 'ajuste' && movement.quantity > 0 ? '+' : '-'}
                        {Math.abs(movement.quantity)} {movement.unit}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">{movement.reason}</td>
                      <td className="p-4 text-center">{movement.user}</td>
                      <td className="p-4 text-center text-muted-foreground">{movement.reference || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredMovements.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No hay movimientos para mostrar
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMovements.map((movement) => {
            const config = typeConfig[movement.type];
            const Icon = config.icon;
            return (
              <div key={movement.id} className="bg-card rounded-xl shadow-sm p-4 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${config.iconBg} rounded-full flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{movement.id}</p>
                      <p className="font-semibold text-foreground">{movement.product}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>
                    {config.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Cantidad</span>
                    <span className={`text-sm font-bold ${
                      movement.type === 'entrada' ? 'text-success' : 
                      movement.type === 'salida' || movement.type === 'merma' ? 'text-destructive' : 
                      'text-warning'
                    }`}>
                      {movement.type === 'entrada' ? '+' : movement.type === 'ajuste' && movement.quantity > 0 ? '+' : '-'}
                      {Math.abs(movement.quantity)} {movement.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Fecha</span>
                    <span className="text-sm text-foreground">{movement.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Hora</span>
                    <span className="text-sm text-foreground">{movement.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Razón</span>
                    <span className="text-sm text-foreground text-right">{movement.reason}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Usuario</span>
                    <span className="text-sm font-medium text-foreground">{movement.user}</span>
                  </div>
                  {movement.reference && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Referencia</span>
                      <span className="text-sm text-muted-foreground">{movement.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredMovements.length === 0 && viewMode === 'cards' && (
        <div className="bg-card rounded-xl shadow-sm p-8 text-center text-muted-foreground">
          No hay movimientos para mostrar
        </div>
      )}
    </div>
  );
};

export default Movimientos;
