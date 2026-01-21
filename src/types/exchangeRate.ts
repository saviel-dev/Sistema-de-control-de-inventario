// Exchange Rate Types
export type TipoTasa = 'bcv' | 'paralelo' | 'personalizada';

export interface ExchangeRateConfig {
    id: string;
    tipo_tasa: TipoTasa;
    valor_personalizado?: number;
    fecha_actualizacion: string;
    usuario_id: string;
    created_at: string;
    updated_at: string;
}

export interface DolarParaleloResponse {
    nombre: string;
    compra: number;
    venta: number;
    promedio: number;
    fechaActualizacion: string;
}

export interface ExchangeRateInfo {
    tipo: TipoTasa;
    valor: number;
    fechaActualizacion: string;
    fuente: string; // 'BCV', 'API Paralelo', 'Personalizada'
}
