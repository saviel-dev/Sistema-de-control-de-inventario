import { ShoppingCart, Plus, Minus, Trash2, User, Printer, X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useExchangeRate } from '@/contexts/ExchangeRateContext';
import { toast } from "sonner";
import hamburguesaImg from '@/assets/hamburguesa.png';

// Reutilizando los productos del menú
type MenuProduct = {
    id: string;
    name: string;
    description: string;
    category: string;
    priceUSD: number;
    sales: number;
    image: string;
};

type CartItem = MenuProduct & {
    quantity: number;
};

const mockProducts: MenuProduct[] = [
    { id: '1', name: 'Perro Sencillo', description: 'Con queso de año', category: 'Perros', priceUSD: 0.17, sales: 45, image: hamburguesaImg },
    { id: '2', name: 'Perro Tradicional', description: 'Con queso Gouda', category: 'Perros', priceUSD: 0.20, sales: 38, image: hamburguesaImg },
    { id: '3', name: 'Perro Polaco', description: 'Salchicha polaca premium', category: 'Perros', priceUSD: 0.25, sales: 32, image: hamburguesaImg },
    { id: '7', name: 'Hamburguesa de Carne', description: '100% carne de res', category: 'Hamburguesas', priceUSD: 0.70, sales: 52, image: hamburguesaImg },
    { id: '8', name: 'Hamburguesa de Pollo', description: 'Pechuga de pollo jugosa', category: 'Hamburguesas', priceUSD: 0.75, sales: 48, image: hamburguesaImg },
    { id: '10', name: 'Hamburguesa Doble Carne', description: 'Doble porción de carne', category: 'Hamburguesas', priceUSD: 1.00, sales: 42, image: hamburguesaImg },
    { id: '14', name: 'Hamburguesa de Carne con Papas', description: 'Incluye papas fritas', category: 'Hamburguesas con Papas', priceUSD: 0.90, sales: 55, image: hamburguesaImg },
    { id: '15', name: 'Hamburguesa de Pollo con Papas', description: 'Incluye papas fritas', category: 'Hamburguesas con Papas', priceUSD: 0.95, sales: 50, image: hamburguesaImg },
    { id: '17', name: 'Shawarma Mixto', description: '2x10$ en físico', category: 'Shawarma', priceUSD: 0.85, sales: 40, image: hamburguesaImg },
    { id: '18', name: 'Salchipapa Sencilla', description: 'Salchichas y papas', category: 'Salchipapas', priceUSD: 0.70, sales: 35, image: hamburguesaImg },
    { id: '19', name: 'Salchipapa Especial', description: 'Con ingredientes extra', category: 'Salchipapas', priceUSD: 1.20, sales: 32, image: hamburguesaImg },
    { id: '20', name: 'Ración de Papas Fritas', description: '160gr de papas', category: 'Salchipapas', priceUSD: 0.30, sales: 45, image: hamburguesaImg },
    { id: '22', name: 'Glup 400ml', description: 'Bebida refrescante', category: 'Bebidas', priceUSD: 0.06, sales: 65, image: hamburguesaImg },
    { id: '23', name: 'Glup 2L', description: 'Botella grande', category: 'Bebidas', priceUSD: 0.17, sales: 38, image: hamburguesaImg },
    { id: '24', name: 'Malta 222ml', description: 'Malta tradicional', category: 'Bebidas', priceUSD: 0.07, sales: 42, image: hamburguesaImg },
    { id: '25', name: 'Refresco 350ml', description: 'Refresco variado', category: 'Bebidas', priceUSD: 0.07, sales: 50, image: hamburguesaImg },
];

const PuntoDeVenta = () => {
    const { convert, formatBs } = useExchangeRate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

    const filteredProducts = selectedCategory === 'all'
        ? mockProducts
        : mockProducts.filter(p => p.category === selectedCategory);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Enter para completar venta
            if (e.key === 'Enter' && !showReceipt && cart.length > 0) {
                e.preventDefault();
                completeSale();
            }
            // Escape para cerrar recibo
            if (e.key === 'Escape' && showReceipt) {
                e.preventDefault();
                closeReceipt();
            }
            // Números 1-9 para seleccionar categorías
            if (e.key >= '1' && e.key <= '9' && !showReceipt) {
                const index = parseInt(e.key) - 1;
                if (index < categories.length) {
                    setSelectedCategory(categories[index]);
                }
            }
            // 0 para "Todas las categorías"
            if (e.key === '0' && !showReceipt) {
                setSelectedCategory('all');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [cart, showReceipt, categories]);

    // Agregar producto al carrito
    const addToCart = (product: MenuProduct) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        toast.success(`${product.name} agregado al carrito`);
    };

    // Actualizar cantidad
    const updateQuantity = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // Eliminar del carrito
    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
        toast.info("Producto eliminado del carrito");
    };

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
    const total = subtotal;

    // Completar venta
    const completeSale = () => {
        if (cart.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        const orderNumber = Math.floor(Math.random() * 9000) + 1000;
        const now = new Date();

        setReceiptData({
            orderNumber,
            date: now.toLocaleDateString('es-ES'),
            time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            customerName: customerName || 'Cliente',
            paymentMethod,
            items: [...cart],
            subtotal,
            total
        });

        setShowReceipt(true);
        toast.success("¡Venta completada!");
    };

    // Cerrar recibo y limpiar
    const closeReceipt = () => {
        setShowReceipt(false);
        setCart([]);
        setCustomerName('');
        setPaymentMethod('Efectivo');
        setReceiptData(null);
    };

    // Imprimir recibo
    const printReceipt = () => {
        window.print();
        toast.success("Preparando impresión...");
    };

    return (
        <PageTransition>
            <div className="h-[calc(100vh-4rem)] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ShoppingCart className="w-7 h-7 text-primary" />
                            Punto de Venta
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Sistema POS para ventas rápidas · Usa atajos de teclado (Enter, Escape, 0-9)</p>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    {/* Panel de Productos - 2/3 */}
                    <div className="lg:col-span-2 flex flex-col overflow-hidden">
                        {/* Filtro de categorías */}
                        <div className="mb-4">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                {categories.map((cat, idx) => {
                                    const isSelected = selectedCategory === cat;
                                    const keyboardHint = idx === 0 ? '0' : idx.toString();

                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${isSelected
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                                : 'bg-secondary hover:bg-secondary/80 hover:scale-105'
                                                }`}
                                        >
                                            <span>{cat === 'all' ? 'Todos' : cat}</span>
                                            {!isSelected && idx < 10 && (
                                                <span className="ml-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                                                    {keyboardHint}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Grid de Productos */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((product, idx) => {
                                    const isInCart = cart.some(item => item.id === product.id);
                                    const cartItem = cart.find(item => item.id === product.id);

                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                            className={`bg-card border-2 rounded-xl p-3 hover:shadow-xl transition-all duration-300 text-left group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 ${isInCart
                                                ? 'border-primary/50 shadow-lg shadow-primary/20'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            {/* Badge en el carrito */}
                                            {isInCart && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10 animate-in zoom-in">
                                                    {cartItem?.quantity}
                                                </div>
                                            )}

                                            <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {/* Overlay fuerte para oscurecer la imagen y mejorar legibilidad */}
                                                <div className="absolute inset-0 bg-black/70" />
                                                <div className="absolute bottom-2 left-2">
                                                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded shadow-lg border border-white/30">{product.category}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 min-h-[2.5rem]">{product.name}</h3>
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-primary">${product.priceUSD.toFixed(2)}</p>
                                                <p className="text-xs text-muted-foreground">{formatBs(convert(product.priceUSD))}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Panel del Carrito - 1/3 */}
                    <div className="bg-card border border-border rounded-xl p-5 flex flex-col overflow-hidden shadow-lg">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            Carrito ({cart.length})
                        </h2>

                        {/* Campo de cliente */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Cliente (opcional)
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nombre del cliente"
                                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Campo de método de pago */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">
                                Método de Pago
                            </label>
                            <input
                                type="text"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                placeholder="Ej: Efectivo, Pago Móvil, Mixto, etc."
                                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Lista de productos en el carrito */}
                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
                                    <p className="text-sm">Carrito vacío</p>
                                    <p className="text-xs">Selecciona productos para agregar</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="bg-secondary/30 rounded-lg p-3 border border-border/50 animate-in slide-in-from-left">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">${item.priceUSD.toFixed(2)} c/u</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors active:scale-95"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors active:scale-95"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">${(item.priceUSD * item.quantity).toFixed(2)}</p>
                                                <p className="text-xs text-muted-foreground">{formatBs(convert(item.priceUSD * item.quantity))}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Totales */}
                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>TOTAL:</span>
                                <div className="text-right">
                                    <p className="text-primary">${total.toFixed(2)}</p>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">{formatBs(convert(total))}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botón de venta */}
                        <button
                            onClick={completeSale}
                            disabled={cart.length === 0}
                            className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Completar Venta {cart.length > 0 && '(Enter)'}
                        </button>
                    </div>
                </div>

                {/* Receipt Modal */}
                {showReceipt && receiptData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={closeReceipt}>
                        <div
                            className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden print:shadow-none print:max-w-full print:rounded-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decoración superior */}
                            <div className="h-2 bg-orange-500 w-full" />

                            <div className="p-6">
                                {/* Encabezado */}
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-extrabold text-gray-800 uppercase tracking-tighter">Sabores Express</h1>
                                    <p className="text-sm text-gray-500">¡Comida rápida, sabor increíble!</p>
                                    <p className="text-xs text-gray-400 mt-1">Calle Principal, Local #12</p>
                                </div>

                                {/* Info de la Orden */}
                                <div className="font-mono text-sm border-t border-b border-dashed border-gray-300 py-3 mb-4">
                                    <div className="flex justify-between">
                                        <span>Orden:</span>
                                        <span className="font-bold">#{receiptData.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Fecha:</span>
                                        <span>{receiptData.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hora:</span>
                                        <span>{receiptData.time}</span>
                                    </div>
                                    {receiptData.customerName !== 'Cliente' && (
                                        <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                                            <span>Cliente:</span>
                                            <span>{receiptData.customerName}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                                        <span>Pago:</span>
                                        <span className="font-semibold">{receiptData.paymentMethod}</span>
                                    </div>
                                </div>

                                {/* Detalle de Productos */}
                                <div className="font-mono text-sm mb-6">
                                    <div className="flex justify-between font-bold border-b border-gray-100 pb-1 mb-2">
                                        <span className="w-1/2">Ítem</span>
                                        <span className="w-1/4 text-center">Cant</span>
                                        <span className="w-1/4 text-right">Total</span>
                                    </div>
                                    <div className="space-y-1">
                                        {receiptData.items.map((item: CartItem) => (
                                            <div key={item.id} className="flex justify-between">
                                                <span className="w-1/2 truncate">{item.name}</span>
                                                <span className="w-1/4 text-center">{item.quantity}</span>
                                                <span className="w-1/4 text-right">${(item.priceUSD * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totales */}
                                <div className="border-t-2 border-double border-gray-300 pt-3 font-mono">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold mt-1">
                                        <span>TOTAL:</span>
                                        <span className="text-orange-600">${receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <div className="text-right text-sm text-gray-600 mt-1">
                                        {formatBs(convert(receiptData.total))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 text-center text-xs text-gray-600">
                                    <p className="font-semibold">¡Gracias por su compra!</p>
                                    <p className="mt-1">Vuelva pronto</p>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="p-4 bg-gray-50 flex space-x-2 print:hidden border-t border-gray-200">
                                <button
                                    onClick={closeReceipt}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={printReceipt}
                                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition flex items-center justify-center"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default PuntoDeVenta;
