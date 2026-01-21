import { ShoppingBag, Plus, Search, Grid3x3, Table2, TrendingUp, Edit, Trash2, Eye, DollarSign, Package, X, Save } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useExchangeRate } from '@/contexts/ExchangeRateContext';
import { toast } from "sonner";
import hamburguesaImg from '@/assets/hamburguesa.png';

// Datos simulados basados en el menú real
type MenuProduct = {
    id: string;
    name: string;
    description: string;
    category: string;
    priceUSD: number;
    sales: number;
    image: string;
};

const mockProductsData: MenuProduct[] = [
    // PERROS
    { id: '1', name: 'Perro Sencillo', description: 'Con queso de año', category: 'Perros', priceUSD: 0.17, sales: 45, image: hamburguesaImg },
    { id: '2', name: 'Perro Tradicional', description: 'Con queso Gouda', category: 'Perros', priceUSD: 0.20, sales: 38, image: hamburguesaImg },
    { id: '3', name: 'Perro Polaco', description: 'Salchicha polaca premium', category: 'Perros', priceUSD: 0.25, sales: 32, image: hamburguesaImg },
    { id: '4', name: 'Perro Especial', description: 'Con ingredientes especiales', category: 'Perros', priceUSD: 0.50, sales: 28, image: hamburguesaImg },
    { id: '5', name: 'Choriperro', description: 'Chorizo premium', category: 'Perros', priceUSD: 0.55, sales: 25, image: hamburguesaImg },
    { id: '6', name: 'Pepiperro', description: '2x10$ en divisas físicas', category: 'Perros', priceUSD: 0.85, sales: 18, image: hamburguesaImg },

    // HAMBURGUESAS
    { id: '7', name: 'Hamburguesa de Carne', description: '100% carne de res', category: 'Hamburguesas', priceUSD: 0.70, sales: 52, image: hamburguesaImg },
    { id: '8', name: 'Hamburguesa de Pollo', description: 'Pechuga de pollo jugosa', category: 'Hamburguesas', priceUSD: 0.75, sales: 48, image: hamburguesaImg },
    { id: '9', name: 'Hamburguesa de Chuleta', description: 'Chuleta ahumada', category: 'Hamburguesas', priceUSD: 0.75, sales: 35, image: hamburguesaImg },
    { id: '10', name: 'Hamburguesa Doble Carne', description: 'Doble porción de carne', category: 'Hamburguesas', priceUSD: 1.00, sales: 42, image: hamburguesaImg },
    { id: '11', name: 'Hamburguesa Doble Pollo', description: 'Doble porción de pollo', category: 'Hamburguesas', priceUSD: 1.00, sales: 30, image: hamburguesaImg },
    { id: '12', name: 'Hamburguesa Mixta', description: 'Carne y pollo', category: 'Hamburguesas', priceUSD: 1.00, sales: 38, image: hamburguesaImg },
    { id: '13', name: 'Hamburguesa Triple', description: 'Triple porción de carne', category: 'Hamburguesas', priceUSD: 1.40, sales: 22, image: hamburguesaImg },

    // HAMBURGUESAS CON PAPAS
    { id: '14', name: 'Hamburguesa de Carne con Papas', description: 'Incluye papas fritas', category: 'Hamburguesas con Papas', priceUSD: 0.90, sales: 55, image: hamburguesaImg },
    { id: '15', name: 'Hamburguesa de Pollo con Papas', description: 'Incluye papas fritas', category: 'Hamburguesas con Papas', priceUSD: 0.95, sales: 50, image: hamburguesaImg },
    { id: '16', name: 'Hamburguesa Triple con Papas', description: 'Triple carne + papas', category: 'Hamburguesas con Papas', priceUSD: 1.70, sales: 28, image: hamburguesaImg },

    // SHAWARMA Y OTROS
    { id: '17', name: 'Shawarma Mixto', description: '2x10$ en físico', category: 'Shawarma', priceUSD: 0.85, sales: 40, image: hamburguesaImg },
    { id: '18', name: 'Salchipapa Sencilla', description: 'Salchichas y papas', category: 'Salchipapas', priceUSD: 0.70, sales: 35, image: hamburguesaImg },
    { id: '19', name: 'Salchipapa Especial', description: 'Con ingredientes extra', category: 'Salchipapas', priceUSD: 1.20, sales: 32, image: hamburguesaImg },
    { id: '20', name: 'Ración de Papas Fritas', description: '160gr de papas', category: 'Salchipapas', priceUSD: 0.30, sales: 45, image: hamburguesaImg },
    { id: '21', name: 'Pepito', description: 'Pan con carne y vegetales', category: 'Otros', priceUSD: 1.70, sales: 20, image: hamburguesaImg },

    // BEBIDAS
    { id: '22', name: 'Glup 400ml', description: 'Bebida refrescante', category: 'Bebidas', priceUSD: 0.06, sales: 65, image: hamburguesaImg },
    { id: '23', name: 'Glup 2L', description: 'Botella grande', category: 'Bebidas', priceUSD: 0.17, sales: 38, image: hamburguesaImg },
    { id: '24', name: 'Malta 222ml', description: 'Malta tradicional', category: 'Bebidas', priceUSD: 0.07, sales: 42, image: hamburguesaImg },
    { id: '25', name: 'Refresco 350ml', description: 'Refresco variado', category: 'Bebidas', priceUSD: 0.07, sales: 50, image: hamburguesaImg },
];

const ProductosMenu = () => {
    const { convert, formatBs } = useExchangeRate();
    const [mockProducts, setMockProducts] = useState<MenuProduct[]>(mockProductsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [viewingProduct, setViewingProduct] = useState<MenuProduct | null>(null);
    const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<MenuProduct | null>(null);
    const [editForm, setEditForm] = useState<Partial<MenuProduct>>({});

    const ITEMS_PER_PAGE = 8;

    // Obtener categorías únicas
    const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

    // Filtrar y ordenar productos
    let filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Ordenar
    if (sortBy === 'mostSold') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'leastSold') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.sales - b.sales);
    } else if (sortBy === 'priceHigh') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (sortBy === 'priceLow') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.priceUSD - b.priceUSD);
    }

    // Paginación
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Estadísticas
    const totalProducts = mockProducts.length;
    const totalSales = mockProducts.reduce((sum, p) => sum + p.sales, 0);
    const avgPrice = mockProducts.reduce((sum, p) => sum + p.priceUSD, 0) / mockProducts.length;

    // CRUD Handlers
    const handleViewDetails = (product: MenuProduct) => {
        setViewingProduct(product);
    };

    const handleEditClick = (product: MenuProduct) => {
        setEditingProduct(product);
        setEditForm({ ...product });
    };

    const handleEditSave = () => {
        if (!editingProduct || !editForm.name || !editForm.priceUSD) {
            toast.error("Por favor completa todos los campos requeridos");
            return;
        }

        setMockProducts(prev => prev.map(p =>
            p.id === editingProduct.id ? { ...p, ...editForm } as MenuProduct : p
        ));

        toast.success("Producto actualizado correctamente");
        setEditingProduct(null);
        setEditForm({});
    };

    const handleDeleteClick = (product: MenuProduct) => {
        setDeletingProduct(product);
    };

    const handleDeleteConfirm = () => {
        if (!deletingProduct) return;

        setMockProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
        toast.success("Producto eliminado correctamente");
        setDeletingProduct(null);
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flexcol md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ShoppingBag className="w-7 h-7 text-primary" />
                            Productos del Menú
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Gestiona los productos que ofreces en tu negocio</p>
                    </div>
                    <button className="button" onClick={() => toast.info("Función de agregar producto (solo UI)")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Producto
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Total Productos</p>
                            <div className="p-2 bg-blue-600 rounded-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{totalProducts}</p>
                        <p className="text-xs text-white/70 mt-1">En el menú</p>
                    </div>

                    <div className="bg-emerald-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Ventas Totales</p>
                            <div className="p-2 bg-emerald-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{totalSales}</p>
                        <p className="text-xs text-white/70 mt-1">Unidades vendidas</p>
                    </div>

                    <div className="bg-purple-500 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-white">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-medium text-white/90 uppercase tracking-wide">Precio Promedio</p>
                            <div className="p-2 bg-purple-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">${avgPrice.toFixed(2)}</p>
                        <p className="text-xs text-white/70 mt-1">{formatBs(convert(avgPrice))}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-xl shadow-sm p-4">
                    <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="select-category flex-1"
                            >
                                <option value="all">Todas las categorías</option>
                                {categories.filter(c => c !== 'all').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select-category flex-1"
                            >
                                <option value="name">Ordenar por nombre</option>
                                <option value="mostSold">Más vend

                                    idos</option>
                                <option value="leastSold">Menos vendidos</option>
                                <option value="priceHigh">Precio: Mayor a menor</option>
                                <option value="priceLow">Precio: Menor a mayor</option>
                            </select>
                            <div className="flex gap-2 border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${viewMode === 'table'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-background text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    <Table2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tabla</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${viewMode === 'cards'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-background text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tarjetas</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products View */}
                {viewMode === 'cards' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paginatedProducts.map((product, idx) => (
                                <div
                                    key={product.id}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                    className="bg-card border border-border rounded-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Overlay más oscuro para reducir conflicto con texto de la imagen */}
                                        <div className="absolute inset-0 bg-black/75" />
                                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full font-bold shadow-xl">
                                            {product.sales} ventas
                                        </div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg border border-white/40">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">{product.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                                        </div>

                                        <div className="space-y-3 pt-3 border-t border-border">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-xl font-bold text-primary">${product.priceUSD.toFixed(2)}</span>
                                                <span className="text-xs text-muted-foreground">{formatBs(convert(product.priceUSD))}</span>
                                            </div>

                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => handleViewDetails(product)}
                                                    className="flex-1 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-all hover:scale-105 active:scale-95"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="flex-1 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-all hover:scale-105 active:scale-95"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4 mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="flex-1 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-all hover:scale-105 active:scale-95"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4 mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="bg-card rounded-xl shadow-sm p-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-border rounded hover:bg-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded text-sm ${currentPage === page
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border border-border hover:bg-secondary'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-border rounded hover:bg-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#222] text-white text-xs uppercase tracking-wider">
                                        <th className="p-4 font-medium">Producto</th>
                                        <th className="p-4 font-medium">Categoría</th>
                                        <th className="p-4 font-medium text-center">Precio USD</th>
                                        <th className="p-4 font-medium text-center">Precio Bs</th>
                                        <th className="p-4 font-medium text-center">Ventas</th>
                                        <th className="p-4 font-medium text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-foreground divide-y divide-border">
                                    {paginatedProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                                                    <div>
                                                        <p className="font-semibold">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-secondary rounded text-xs">{product.category}</span>
                                            </td>
                                            <td className="p-4 text-center font-bold text-primary">${product.priceUSD.toFixed(2)}</td>
                                            <td className="p-4 text-center text-muted-foreground text-xs">{formatBs(convert(product.priceUSD))}</td>
                                            <td className="p-4 text-center">
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                                    {product.sales}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Eliminar"
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
                    </div>
                )}

                {/* View Details Modal */}
                {viewingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setViewingProduct(null)}>
                        <div className="bg-card w-full max-w-[520px] rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                            {/* Header con gradiente */}
                            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Eye className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">Detalles del Producto</h3>
                                            <p className="text-xs text-white/70">Información completa</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewingProduct(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group">
                                        <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-5">
                                {/* Image with overlay */}
                                <div className="relative h-52 rounded-xl overflow-hidden group shadow-lg">
                                    <img
                                        src={viewingProduct.image}
                                        alt={viewingProduct.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                                            {viewingProduct.category}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold rounded-full shadow-lg">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                            {viewingProduct.sales} ventas
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-2xl font-bold text-foreground">{viewingProduct.name}</h4>
                                        <p className="text-muted-foreground mt-1">{viewingProduct.description}</p>
                                    </div>

                                    {/* Price Cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20">
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">Precio USD</p>
                                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">${viewingProduct.priceUSD.toFixed(2)}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20">
                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">Precio Bs</p>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formatBs(convert(viewingProduct.priceUSD))}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-secondary/30 border-t border-border">
                                <button onClick={() => setViewingProduct(null)} className="w-full px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-md">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingProduct(null)}>
                        <div className="bg-card w-full max-w-[520px] rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                            {/* Header con gradiente */}
                            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Edit className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">Editar Producto</h3>
                                            <p className="text-xs text-white/70">Modifica la información</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group">
                                        <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Nombre del producto *</label>
                                        <input
                                            type="text"
                                            value={editForm.name || ''}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder="Nombre del producto"
                                            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Descripción</label>
                                        <input
                                            type="text"
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Descripción del producto"
                                            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Categoría</label>
                                            <select
                                                value={editForm.category || ''}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                            >
                                                {categories.filter(c => c !== 'all').map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Precio USD *</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editForm.priceUSD || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, priceUSD: parseFloat(e.target.value) })}
                                                    className="w-full pl-9 pr-4 py-3 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Preview */}
                                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Conversión automática:</span>
                                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatBs(convert(editForm.priceUSD || 0))}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-secondary/30 border-t border-border">
                                <button onClick={() => setEditingProduct(null)} className="px-5 py-2.5 border border-border rounded-xl hover:bg-secondary text-sm font-medium transition-all duration-200">
                                    Cancelar
                                </button>
                                <button onClick={handleEditSave} className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deletingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setDeletingProduct(null)}>
                        <div className="bg-card w-full max-w-[440px] rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                            {/* Header con gradiente rojo */}
                            <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Trash2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">Confirmar Eliminación</h3>
                                            <p className="text-xs text-white/70">Esta acción no se puede deshacer</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setDeletingProduct(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group">
                                        <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    ¿Estás seguro de que deseas eliminar este producto permanentemente?
                                </p>

                                {/* Product Preview */}
                                <div className="flex items-center gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                                    <img
                                        src={deletingProduct.image}
                                        alt={deletingProduct.name}
                                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-foreground truncate">{deletingProduct.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{deletingProduct.description}</p>
                                        <p className="text-sm font-semibold text-primary mt-1">${deletingProduct.priceUSD.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-secondary/30 border-t border-border">
                                <button onClick={() => setDeletingProduct(null)} className="px-5 py-2.5 border border-border rounded-xl hover:bg-secondary text-sm font-medium transition-all duration-200">
                                    Cancelar
                                </button>
                                <button onClick={handleDeleteConfirm} className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar Producto
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default ProductosMenu;
