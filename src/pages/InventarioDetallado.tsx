import { ClipboardList, Search, Plus, Edit, Trash2, Folder, ChevronRight, X, Table2, Grid3x3, Save, List } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
  status: 'available' | 'low' | 'medium' | 'out';
}

interface Location {
  id: string;
  name: string;
}

const statusConfig = {
  available: { label: 'Disponible', className: 'bg-success/10 text-success' },
  low: { label: 'Bajo Stock', className: 'bg-destructive/10 text-destructive' },
  medium: { label: 'Medio', className: 'bg-warning/10 text-warning' },
  out: { label: 'Agotado', className: 'bg-muted text-muted-foreground' },
};

const InventarioDetallado = () => {
  const [locations, setLocations] = useState<Location[]>([
    { id: 'duarte-burguer', name: 'Duarte Burguer' },
    { id: 'bodega-san-antonio', name: 'Bodega San Antonio' },
    { id: 'kiosko-will', name: 'Kiosko Will' },
  ]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [locationViewMode, setLocationViewMode] = useState<'list' | 'cards'>('cards');
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locationFormData, setLocationFormData] = useState({ name: '' });
  const [products, setProducts] = useState<Record<string, Product[]>>({
    'duarte-burguer': [
      { id: '#001', name: 'Queso Cheddar', category: 'Ingredientes', stock: 45.0, unit: 'Kg', minStock: 10, price: 120, status: 'available' },
      { id: '#002', name: 'Salsa de Tomate', category: 'Salsas', stock: 2.5, unit: 'Litros', minStock: 5, price: 35, status: 'low' },
    ],
    'bodega-san-antonio': [
      { id: '#003', name: 'Coca Cola 355ml', category: 'Bebidas', stock: 120, unit: 'Unidades', minStock: 50, price: 15, status: 'available' },
    ],
    'kiosko-will': [
      { id: '#004', name: 'Pan de Hamburguesa', category: 'Panadería', stock: 50, unit: 'Paquetes', minStock: 30, price: 45, status: 'medium' },
    ],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    stock: 0,
    unit: '',
    minStock: 0,
    price: 0,
    status: 'available',
  });

  const currentProducts = selectedLocation ? products[selectedLocation] || [] : [];
  const categories = ['all', ...new Set(currentProducts.map(p => p.category))];

  const filteredProducts = currentProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!selectedLocation) return;
    const newId = `#${String(currentProducts.length + 1).padStart(3, '0')}`;
    const newProduct: Product = { ...formData, id: newId };
    setProducts({
      ...products,
      [selectedLocation]: [...currentProducts, newProduct],
    });
    setIsAddingProduct(false);
    setFormData({ name: '', category: '', stock: 0, unit: '', minStock: 0, price: 0, status: 'available' });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, category: product.category, stock: product.stock, unit: product.unit, minStock: product.minStock, price: product.price, status: product.status });
  };

  const handleUpdateProduct = () => {
    if (!selectedLocation || !editingProduct) return;
    const updatedProducts = currentProducts.map(p => 
      p.id === editingProduct.id ? { ...formData, id: editingProduct.id } : p
    );
    setProducts({
      ...products,
      [selectedLocation]: updatedProducts,
    });
    setEditingProduct(null);
    setFormData({ name: '', category: '', stock: 0, unit: '', minStock: 0, price: 0, status: 'available' });
  };

  const handleDeleteProduct = (productId: string) => {
    if (!selectedLocation) return;
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts({
        ...products,
        [selectedLocation]: currentProducts.filter(p => p.id !== productId),
      });
    }
  };

  const handleCloseForm = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', stock: 0, unit: '', minStock: 0, price: 0, status: 'available' });
  };

  // Actualizar título del header
  useEffect(() => {
    const headerTitle = document.querySelector('header h2');
    if (headerTitle) {
      if (selectedLocation) {
        const location = locations.find(l => l.id === selectedLocation);
        headerTitle.textContent = location ? location.name : 'Inventario Detallado';
      } else {
        headerTitle.textContent = 'Inventario Detallado';
      }
    }
  }, [selectedLocation, locations]);

  // Funciones CRUD para locations
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  const handleAddLocation = () => {
    if (locationFormData.name.trim()) {
      const newId = locationFormData.name.toLowerCase().replace(/\s+/g, '-');
      const newLocation: Location = { id: newId, name: locationFormData.name };
      setLocations([...locations, newLocation]);
      setProducts({ ...products, [newId]: [] });
      setIsAddingLocation(false);
      setLocationFormData({ name: '' });
    }
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationFormData({ name: location.name });
  };

  const handleUpdateLocation = () => {
    if (editingLocation && locationFormData.name.trim()) {
      const oldId = editingLocation.id;
      const newId = locationFormData.name.toLowerCase().replace(/\s+/g, '-');
      const updatedLocations = locations.map(l =>
        l.id === oldId ? { id: newId, name: locationFormData.name } : l
      );
      setLocations(updatedLocations);
      
      // Actualizar productos si cambió el ID
      if (oldId !== newId && products[oldId]) {
        setProducts({
          ...products,
          [newId]: products[oldId],
        });
        delete products[oldId];
      }
      
      setEditingLocation(null);
      setLocationFormData({ name: '' });
      if (selectedLocation === oldId) {
        setSelectedLocation(newId);
      }
    }
  };

  const handleDeleteLocation = (locationId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este negocio? Se eliminarán todos sus productos.')) {
      setLocations(locations.filter(l => l.id !== locationId));
      const newProducts = { ...products };
      delete newProducts[locationId];
      setProducts(newProducts);
      if (selectedLocation === locationId) {
        setSelectedLocation(null);
      }
    }
  };

  const handleCloseLocationForm = () => {
    setIsAddingLocation(false);
    setEditingLocation(null);
    setLocationFormData({ name: '' });
  };

  if (selectedLocation) {
    return (
      <div className="space-y-6">
        {/* Header con botón de volver */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedLocation(null)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ClipboardList className="w-7 h-7 text-primary" />
                {locations.find(l => l.id === selectedLocation)?.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Gestión de inventario</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingProduct(true)}
            type="button"
            className="button"
          >
            <Plus className="w-4 h-4" />
            Agregar Producto
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-category"
            >
              <option value="all">Todas las categorías</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex gap-2 border border-border rounded-lg overflow-hidden">
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
          </div>
        </div>

        {/* Form Modal para Agregar/Editar */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={handleCloseForm} />
            <div className="relative bg-card rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
                <button onClick={handleCloseForm} className="p-2 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Categoría</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Unidad</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Precio</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  >
                    <option value="available">Disponible</option>
                    <option value="low">Bajo Stock</option>
                    <option value="medium">Medio</option>
                    <option value="out">Agotado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table or Cards View */}
        {viewMode === 'table' ? (
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#222] text-white text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium text-center">ID</th>
                    <th className="p-4 font-medium text-center">Producto</th>
                    <th className="p-4 font-medium text-center">Categoría</th>
                    <th className="p-4 font-medium text-center">Stock</th>
                    <th className="p-4 font-medium text-center">Min. Stock</th>
                    <th className="p-4 font-medium text-center">Precio Unit.</th>
                    <th className="p-4 font-medium text-center">Estado</th>
                    <th className="p-4 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-foreground divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-4 font-medium text-muted-foreground">{product.id}</td>
                      <td className="p-4 font-semibold">{product.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-secondary rounded text-xs">{product.category}</span>
                      </td>
                      <td className={`p-4 font-bold ${product.status === 'low' || product.status === 'out' ? 'text-destructive' : ''}`}>
                        {product.stock} {product.unit}
                      </td>
                      <td className="p-4 text-muted-foreground">{product.minStock} {product.unit}</td>
                      <td className="p-4">${product.price}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[product.status].className}`}>
                          {statusConfig[product.status].label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No hay productos para mostrar
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{product.id}</p>
                      <h3 className="text-lg font-semibold text-foreground mt-1">{product.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Categoría</span>
                      <span className="px-2 py-1 bg-secondary rounded text-xs">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Stock</span>
                      <span className={`text-sm font-bold ${product.status === 'low' || product.status === 'out' ? 'text-destructive' : 'text-foreground'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Min. Stock</span>
                      <span className="text-sm text-foreground">{product.minStock} {product.unit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Precio</span>
                      <span className="text-sm font-semibold text-foreground">${product.price}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Estado</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[product.status].className}`}>
                        {statusConfig[product.status].label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No hay productos para mostrar
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters y botón agregar */}
      <div className="bg-card rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar negocio..."
              value={locationSearchTerm}
              onChange={(e) => setLocationSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            />
          </div>
          <div className="flex gap-2 border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setLocationViewMode('list')}
              className={`px-4 py-2 text-sm transition-colors flex items-center gap-1 ${
                locationViewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-background text-foreground hover:bg-secondary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLocationViewMode('cards')}
              className={`px-4 py-2 text-sm transition-colors flex items-center gap-1 ${
                locationViewMode === 'cards'
                  ? 'bg-blue-500 text-white'
                  : 'bg-background text-foreground hover:bg-secondary'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setIsAddingLocation(true)}
            type="button"
            className="button"
          >
            <Plus className="w-4 h-4" />
            Agregar Negocio
          </button>
        </div>
      </div>

      {/* Form Modal para Agregar/Editar Location */}
      {(isAddingLocation || editingLocation) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={handleCloseLocationForm} />
          <div className="relative bg-card rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {editingLocation ? 'Editar Negocio' : 'Agregar Negocio'}
              </h2>
              <button onClick={handleCloseLocationForm} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre del Negocio</label>
              <input
                type="text"
                value={locationFormData.name}
                onChange={(e) => setLocationFormData({ name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                placeholder="Ej: Duarte Burguer"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseLocationForm}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingLocation ? handleUpdateLocation : handleAddLocation}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingLocation ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location View */}
      {locationViewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="bg-card rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group relative"
            >
              <button
                onClick={() => setSelectedLocation(location.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Folder className="w-8 h-8 text-primary" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{location.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {products[location.id]?.length || 0} productos
                </p>
              </button>
              <div className="absolute top-4 right-4 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditLocation(location);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocation(location.id);
                  }}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#222] text-white text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium text-center">Negocio</th>
                  <th className="p-4 font-medium text-center">Productos</th>
                  <th className="p-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-foreground divide-y divide-border">
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedLocation(location.id)}
                        className="flex items-center gap-3 text-left hover:text-primary transition-colors"
                      >
                        <Folder className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{location.name}</span>
                      </button>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      {products[location.id]?.length || 0} productos
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditLocation(location)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLocations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No hay negocios para mostrar
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventarioDetallado;
