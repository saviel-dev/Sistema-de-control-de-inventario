-- =====================================================
-- EJEMPLO: CREAR USUARIOS EN LA BASE DE DATOS
-- =====================================================
-- Este archivo contiene ejemplos de cómo crear usuarios en la base de datos
-- Para el sistema GastroFlow Manager
--
-- IMPORTANTE: 
-- - En modo desarrollo (DEV_MODE = true), la contraseña NO se verifica
-- - Solo se verifica que el email exista en la tabla usuarios
-- - El campo contraseña_hash es obligatorio pero no se usa en DEV_MODE
-- =====================================================

-- =====================================================
-- MÉTODO 1: CREAR USUARIO BÁSICO
-- =====================================================
-- Este es el método más simple para crear un usuario

INSERT INTO usuarios (
    nombre_completo,
    email,
    contraseña_hash,
    rol,
    activo
) VALUES (
    'Juan Pérez García',
    'juan.perez@ejemplo.com',
    'dev_mode_no_password',  -- Placeholder para modo desarrollo
    'empleado',
    true
);

-- =====================================================
-- MÉTODO 2: CREAR USUARIO CON TODOS LOS DATOS
-- =====================================================
-- Incluye información adicional como teléfono y avatar

INSERT INTO usuarios (
    nombre_completo,
    email,
    contraseña_hash,
    rol,
    telefono,
    avatar_url,
    activo
) VALUES (
    'María González López',
    'maria.gonzalez@ejemplo.com',
    'dev_mode_no_password',
    'gerente',
    '+58 414-1234567',
    'https://i.pravatar.cc/150?img=5',  -- Avatar de ejemplo
    true
);

-- =====================================================
-- MÉTODO 3: CREAR MÚLTIPLES USUARIOS A LA VEZ
-- =====================================================

INSERT INTO usuarios (nombre_completo, email, contraseña_hash, rol, telefono, activo) VALUES
('Carlos Rodríguez', 'carlos.rodriguez@ejemplo.com', 'dev_mode_no_password', 'empleado', '+58 424-2345678', true),
('Ana Martínez', 'ana.martinez@ejemplo.com', 'dev_mode_no_password', 'empleado', '+58 412-3456789', true),
('Luis Fernández', 'luis.fernandez@ejemplo.com', 'dev_mode_no_password', 'gerente', '+58 426-4567890', true),
('Sofia Ramírez', 'sofia.ramirez@ejemplo.com', 'dev_mode_no_password', 'administrador', '+58 414-5678901', true);

-- =====================================================
-- MÉTODO 4: CREAR USUARIO CON UUID ESPECÍFICO
-- =====================================================
-- Útil si necesitas sincronizar con Supabase Auth

INSERT INTO usuarios (
    id,  -- Especificar UUID manualmente
    nombre_completo,
    email,
    contraseña_hash,
    rol,
    activo
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- UUID personalizado
    'Roberto Silva',
    'roberto.silva@ejemplo.com',
    'dev_mode_no_password',
    'gerente',
    true
);

-- =====================================================
-- MÉTODO 5: ACTUALIZAR USUARIO EXISTENTE
-- =====================================================

UPDATE usuarios 
SET 
    nombre_completo = 'Juan Carlos Pérez García',
    telefono = '+58 424-9999999',
    rol = 'gerente'
WHERE email = 'juan.perez@ejemplo.com';

-- =====================================================
-- MÉTODO 6: DESACTIVAR USUARIO (SOFT DELETE)
-- =====================================================
-- No eliminar usuarios, solo marcarlos como inactivos

UPDATE usuarios 
SET activo = false 
WHERE email = 'usuario@desactivar.com';

-- =====================================================
-- MÉTODO 7: REACTIVAR USUARIO
-- =====================================================

UPDATE usuarios 
SET activo = true 
WHERE email = 'usuario@reactivar.com';

-- =====================================================
-- CONSULTAS ÚTILES
-- =====================================================

-- Ver todos los usuarios activos
SELECT id, nombre_completo, email, rol, telefono, fecha_creacion
FROM usuarios
WHERE activo = true
ORDER BY fecha_creacion DESC;

-- Ver usuarios por rol
SELECT nombre_completo, email, telefono
FROM usuarios
WHERE rol = 'administrador' AND activo = true;

-- Contar usuarios por rol
SELECT 
    rol,
    COUNT(*) as total_usuarios
FROM usuarios
WHERE activo = true
GROUP BY rol
ORDER BY total_usuarios DESC;

-- Verificar si un email ya existe
SELECT COUNT(*) as existe
FROM usuarios
WHERE email = 'email@verificar.com';

-- =====================================================
-- ROLES DISPONIBLES
-- =====================================================
-- Según el schema, los roles permitidos son:
-- - 'administrador': Acceso completo al sistema
-- - 'gerente': Gestión de inventario y reportes
-- - 'empleado': Acceso limitado a operaciones básicas

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 
-- 1. EMAILS ÚNICOS:
--    - Cada email debe ser único en la base de datos
--    - Si intentas insertar un email duplicado, obtendrás un error
--
-- 2. CONTRASEÑA EN MODO DESARROLLO:
--    - El campo contraseña_hash es obligatorio pero no se usa
--    - Puedes poner cualquier valor como 'dev_mode_no_password'
--    - En modo desarrollo, solo importa que el email exista
--
-- 3. CONTRASEÑA EN PRODUCCIÓN:
--    - Cuando uses Supabase Auth (DEV_MODE = false):
--      a) Crea el usuario en Supabase Auth Dashboard
--      b) Copia el UUID generado
--      c) Usa ese UUID en el INSERT de la tabla usuarios
--
-- 4. ROLES:
--    - Los valores permitidos son: 'administrador', 'gerente', 'empleado'
--    - Cualquier otro valor causará un error
--
-- 5. UUID AUTOMÁTICO:
--    - Si no especificas un 'id', se generará automáticamente
--    - Solo especifica 'id' si necesitas sincronizar con Supabase Auth
--
-- 6. CAMPOS OBLIGATORIOS:
--    - nombre_completo
--    - email
--    - contraseña_hash
--    - rol
--
-- 7. CAMPOS OPCIONALES:
--    - telefono
--    - avatar_url
--    - activo (por defecto: true)
--
-- =====================================================
-- EJEMPLOS DE USUARIOS DE PRUEBA
-- =====================================================

-- Descomenta las siguientes líneas si quieres crear usuarios de prueba:

/*
INSERT INTO usuarios (nombre_completo, email, contraseña_hash, rol, telefono, activo) VALUES
('Admin de Prueba', 'admin@test.com', 'dev_mode_no_password', 'administrador', '+58 424-0000001', true),
('Gerente de Prueba', 'gerente@test.com', 'dev_mode_no_password', 'gerente', '+58 424-0000002', true),
('Empleado de Prueba', 'empleado@test.com', 'dev_mode_no_password', 'empleado', '+58 424-0000003', true);
*/

-- =====================================================
-- LIMPIAR USUARIOS DE PRUEBA (CUIDADO!)
-- =====================================================

-- ⚠️ USAR CON PRECAUCIÓN: Esto eliminará PERMANENTEMENTE los usuarios
-- Descomenta solo si estás seguro:

/*
DELETE FROM usuarios WHERE email LIKE '%@test.com';
DELETE FROM usuarios WHERE email LIKE '%@ejemplo.com';
*/

-- Mejor opción: Desactivar en lugar de eliminar
-- UPDATE usuarios SET activo = false WHERE email LIKE '%@test.com';
