import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { TipoTasa } from '@/types/exchangeRate';
import { useExchangeRateConfig } from '@/hooks/useExchangeRateConfig';
import { useDolarParalelo } from '@/hooks/useDolarParalelo';
import { useDolarBCV } from '@/hooks/useDolarBCV';
import { useExchangeRate } from '@/contexts/ExchangeRateContext';

interface ExchangeRateModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTasa: number;
}

export const ExchangeRateModal = ({ isOpen, onClose, currentTasa }: ExchangeRateModalProps) => {
    const { config, saveConfig } = useExchangeRateConfig();
    const { refreshRate } = useExchangeRate();
    const { data: paraleloData, loading: paraleloLoading } = useDolarParalelo();
    const { data: bcvData, loading: bcvLoading } = useDolarBCV();

    const [selectedTipo, setSelectedTipo] = useState<TipoTasa>(config?.tipo_tasa || 'bcv');
    const [customValue, setCustomValue] = useState<string>(
        config?.valor_personalizado?.toString() || ''
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            let valorPersonalizado: number | undefined;

            if (selectedTipo === 'personalizada') {
                const valor = parseFloat(customValue);
                if (isNaN(valor) || valor <= 0) {
                    setError('La tasa debe ser mayor que 0');
                    return;
                }
                valorPersonalizado = valor;
            }

            await saveConfig(selectedTipo, valorPersonalizado);
            await refreshRate(); // Refrescar la tasa en el contexto inmediatamente
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setCustomValue(value);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
                onClick={onClose}
            />

            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl z-50 animate-in zoom-in-95 fade-in">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Configurar Tasa</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Selecciona la tasa para los cálculos
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-xs text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                        {/* BCV */}
                        <div
                            onClick={() => setSelectedTipo('bcv')}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedTipo === 'bcv'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${selectedTipo === 'bcv' ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                    {selectedTipo === 'bcv' && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">Tasa BCV Oficial</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Tasa oficial del Banco Central de Venezuela
                                    </p>
                                    <div className="mt-1.5">
                                        {bcvLoading ? (
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                <span className="text-xs">Cargando...</span>
                                            </div>
                                        ) : bcvData ? (
                                            <div className="text-base font-bold text-primary">
                                                Bs. {bcvData.promedio.toFixed(2)}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-destructive">Error al cargar</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Paralelo */}
                        <div
                            onClick={() => setSelectedTipo('paralelo')}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedTipo === 'paralelo'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${selectedTipo === 'paralelo' ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                    {selectedTipo === 'paralelo' && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">Dólar Paralelo</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Tasa del mercado paralelo automática
                                    </p>
                                    <div className="mt-1.5">
                                        {paraleloLoading ? (
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                <span className="text-xs">Cargando...</span>
                                            </div>
                                        ) : paraleloData ? (
                                            <div className="text-base font-bold text-primary">
                                                Bs. {paraleloData.promedio.toFixed(2)}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-destructive">Error al cargar</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personalizada */}
                        <div
                            onClick={() => setSelectedTipo('personalizada')}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedTipo === 'personalizada'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${selectedTipo === 'personalizada' ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                    {selectedTipo === 'personalizada' && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">Tasa Personalizada</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Ingresar tu propia tasa manualmente
                                    </p>
                                    {selectedTipo === 'personalizada' && (
                                        <div className="mt-2">
                                            <label className="block text-xs font-medium text-foreground mb-1.5">
                                                Valor (Bs.)
                                            </label>
                                            <input
                                                type="text"
                                                value={customValue}
                                                onChange={handleCustomValueChange}
                                                placeholder="Ej: 52.50"
                                                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            {config?.tipo_tasa === 'personalizada' && config.fecha_actualizacion && (
                                                <p className="text-[10px] text-muted-foreground mt-1.5">
                                                    Última actualización: {new Date(config.fecha_actualizacion).toLocaleString('es-VE', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-1.5 text-sm border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
