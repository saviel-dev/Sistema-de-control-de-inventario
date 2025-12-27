-- ========================================
-- Script SQL para Habilitar Realtime en Supabase
-- ========================================
-- Este script habilita Realtime en todas las tablas necesarias
-- para el sistema GastroFlow Manager
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
-- 2. Ve a "SQL Editor" en el menú lateral
-- 3. Copia y pega este script completo
-- 4. Haz clic en "Run" para ejecutarlo
-- ========================================

-- Habilitar Realtime para inventario_general
ALTER PUBLICATION supabase_realtime ADD TABLE inventario_general;

-- Habilitar Realtime para inventario_detallado
ALTER PUBLICATION supabase_realtime ADD TABLE inventario_detallado;

-- Habilitar Realtime para movimientos
ALTER PUBLICATION supabase_realtime ADD TABLE movimientos;

-- Habilitar Realtime para negocios (ubicaciones)
ALTER PUBLICATION supabase_realtime ADD TABLE negocios;

-- Habilitar Realtime para notificaciones
ALTER PUBLICATION supabase_realtime ADD TABLE notificaciones;

-- ========================================
-- Verificar que las tablas están habilitadas
-- ========================================
-- Ejecuta esta consulta para confirmar que Realtime está habilitado:

SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN tablename IN (
            SELECT tablename 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
        ) THEN '✅ Habilitado'
        ELSE '❌ No habilitado'
    END as realtime_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'inventario_general',
    'inventario_detallado',
    'movimientos',
    'negocios',
    'notificaciones'
)
ORDER BY tablename;

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 1. Después de ejecutar este script, reinicia el servidor de desarrollo (npm run dev)
-- 2. Refresca la página del navegador (Ctrl + Shift + R)
-- 3. Abre la consola del navegador (F12) y ejecuta: diagnoseRealtime()
-- 4. Deberías ver "✅ Suscripción exitosa!" en la consola
-- 5. Ahora prueba eliminar un producto y deberías ver el evento en la consola
-- 
-- Si sigues teniendo problemas:
-- - Verifica que VITE_REALTIME_DEBUG=true esté en tu archivo .env
-- - Verifica que las políticas RLS permitan SELECT en las tablas
-- - Verifica que no haya bloqueadores de WebSocket (firewall, proxy, etc.)
