-- ============================================================================
-- SCRIPT DE VERIFICACIÓN: ¿Qué factores existen realmente en la BD?
-- ============================================================================
-- Este script verifica las 4 tablas de factores que YA EXISTEN

-- 1. ¿Existe la tabla de combustibles sólidos?
SELECT 
    'catalogo_combustibles_solidos' as tabla,
    COUNT(*) as total,
    COUNT(CASE WHEN activo THEN 1 END) as activos
FROM catalogo_combustibles_solidos;

-- 2. ¿Existe la tabla de combustibles líquidos?
SELECT 
    'catalogo_combustibles_liquidos' as tabla,
    COUNT(*) as total,
    COUNT(CASE WHEN activo THEN 1 END) as activos
FROM catalogo_combustibles_liquidos;

-- 3. ¿Existe la tabla de combustibles gaseosos?
SELECT 
    'catalogo_combustibles_gaseosos' as tabla,
    COUNT(*) as total,
    COUNT(CASE WHEN activo THEN 1 END) as activos
FROM catalogo_combustibles_gaseosos;

-- 4. ¿Existe la tabla de factores de electricidad?
SELECT 
    'factores_electricidad_pais' as tabla,
    COUNT(*) as total,
    COUNT(CASE WHEN activo THEN 1 END) as activos
FROM factores_electricidad_pais;

-- 5. Ver algunos ejemplos de cada tabla
\echo ''
\echo '=== MUESTRA DE COMBUSTIBLES SÓLIDOS ==='
SELECT nombre, poder_calorifico, factor_co2 
FROM catalogo_combustibles_solidos 
WHERE activo = true 
LIMIT 3;

\echo ''
\echo '=== MUESTRA DE COMBUSTIBLES LÍQUIDOS ==='
SELECT nombre, densidad, poder_calorifico, factor_co2
FROM catalogo_combustibles_liquidos 
WHERE activo = true 
LIMIT 3;

\echo ''
\echo '=== MUESTRA DE COMBUSTIBLES GASEOSOS ==='
SELECT nombre, poder_calorifico, factor_co2
FROM catalogo_combustibles_gaseosos 
WHERE activo = true 
LIMIT 3;

\echo ''
\echo '=== FACTORES DE ELECTRICIDAD (COLOMBIA) ==='
SELECT pais, año, factor_emision, fuente
FROM factores_electricidad_pais 
WHERE pais = 'Colombia' AND activo = true
ORDER BY año DESC;
