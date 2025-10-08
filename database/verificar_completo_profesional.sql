-- =====================================================
-- SCRIPT PROFESIONAL DE VERIFICACIÓN COMPLETA
-- Análisis exhaustivo usando toda la estructura del schema
-- =====================================================

\echo '🔍 VERIFICACIÓN PROFESIONAL DE HUELLA DE CARBONO'
\echo '================================================'
\echo ''

-- =====================================================
-- 1. VERIFICACIÓN DE ESTRUCTURA COMPLETA
-- =====================================================

\echo '📋 1. ESTADO DE LA BASE DE DATOS'
\echo '--------------------------------'

-- Verificar todas las tablas principales
WITH tablas_esperadas AS (
    SELECT unnest(ARRAY[
        'calculos_huella_carbono', 'combustibles_solidos', 'combustibles_liquidos',
        'combustibles_gaseosos', 'consumo_electricidad', 'vuelos_aereos', 'extintores'
    ]) as tabla_nombre
),
tablas_existentes AS (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
)
SELECT 
    te.tabla_nombre,
    CASE 
        WHEN tex.table_name IS NOT NULL THEN '✅ EXISTE'
        ELSE '❌ FALTA'
    END as estado
FROM tablas_esperadas te
LEFT JOIN tablas_existentes tex ON te.tabla_nombre = tex.table_name
ORDER BY te.tabla_nombre;

-- Verificar triggers específicos de huella de carbono
\echo ''
\echo '⚡ TRIGGERS ACTIVOS:'
SELECT 
    schemaname,
    tablename,
    triggername,
    CASE 
        WHEN triggername LIKE '%updated_at%' THEN 'Actualización automática'
        WHEN triggername LIKE '%limite%' THEN 'Cálculo de fecha límite'
        WHEN triggername LIKE '%revocacion%' THEN 'Log de revocaciones'
        ELSE 'Otro trigger'
    END as proposito
FROM pg_triggers 
WHERE schemaname = 'public'
  AND (tablename LIKE '%huella%' 
       OR tablename LIKE '%combustible%' 
       OR tablename LIKE '%electricidad%'
       OR tablename LIKE '%vuelos%'
       OR tablename LIKE '%extintores%')
ORDER BY tablename, triggername;

-- Verificar la columna calculada crítica
\echo ''
\echo '🧮 CAMPOS CALCULADOS AUTOMÁTICAMENTE:'
SELECT 
    table_name,
    column_name,
    data_type,
    generation_expression,
    'Campo calculado por trigger' as nota
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND is_generated = 'ALWAYS'
  AND table_name = 'calculos_huella_carbono';

-- =====================================================
-- 2. ANÁLISIS CUANTITATIVO DETALLADO
-- =====================================================

\echo ''
\echo '📊 2. ANÁLISIS CUANTITATIVO DE DATOS'
\echo '------------------------------------'

-- Resumen completo de registros con estado
WITH conteos AS (
    SELECT 'calculos_huella_carbono' as tabla, COUNT(*) as total FROM calculos_huella_carbono
    UNION ALL
    SELECT 'combustibles_solidos' as tabla, COUNT(*) as total FROM combustibles_solidos
    UNION ALL  
    SELECT 'combustibles_liquidos' as tabla, COUNT(*) as total FROM combustibles_liquidos
    UNION ALL
    SELECT 'combustibles_gaseosos' as tabla, COUNT(*) as total FROM combustibles_gaseosos
    UNION ALL
    SELECT 'consumo_electricidad' as tabla, COUNT(*) as total FROM consumo_electricidad
    UNION ALL
    SELECT 'vuelos_aereos' as tabla, COUNT(*) as total FROM vuelos_aereos
    UNION ALL
    SELECT 'extintores' as tabla, COUNT(*) as total FROM extintores
)
SELECT 
    tabla,
    total as registros,
    CASE 
        WHEN tabla = 'calculos_huella_carbono' AND total = 0 THEN '❌ CRÍTICO - Sin cálculos'
        WHEN tabla = 'calculos_huella_carbono' AND total > 0 THEN '✅ TABLA PRINCIPAL OK'
        WHEN tabla != 'calculos_huella_carbono' AND total = 0 THEN '⚠️ Sin datos detallados'
        WHEN tabla != 'calculos_huella_carbono' AND total > 0 THEN '✅ Con datos'
        ELSE '❓ Estado desconocido'
    END as diagnostico,
    CASE 
        WHEN tabla = 'calculos_huella_carbono' THEN 'CRÍTICA'
        ELSE 'DETALLE'
    END as importancia
FROM conteos
ORDER BY 
    CASE WHEN importancia = 'CRÍTICA' THEN 1 ELSE 2 END,
    tabla;

-- =====================================================
-- 3. ANÁLISIS DEL ÚLTIMO CÁLCULO (MÁS RECIENTE)
-- =====================================================

\echo ''
\echo '🎯 3. ANÁLISIS DEL ÚLTIMO CÁLCULO GUARDADO'
\echo '-----------------------------------------'

-- Información completa del último cálculo
\echo ''
\echo 'DATOS PRINCIPALES DEL ÚLTIMO CÁLCULO:'
SELECT 
    '📋 IDENTIFICACIÓN' as seccion,
    'ID: ' || id || ' | Código: ' || codigo_seguimiento as valor
FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1

UNION ALL

SELECT 
    '🏢 EMPRESA' as seccion,
    nombre_empresa || ' (NIT: ' || COALESCE(nit, 'N/A') || ')' as valor
FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1

UNION ALL

SELECT 
    '📅 FECHAS' as seccion,
    'Reporte: ' || COALESCE(TO_CHAR(fecha_reporte, 'DD/MM/YYYY'), 'N/A') || 
    ' | Creación: ' || TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') as valor
FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1

UNION ALL

SELECT 
    '🌍 EMISIONES (Ton CO₂)' as seccion,
    'Alcance 1: ' || COALESCE(emisiones_alcance_1::text, '0') ||
    ' | Alcance 2: ' || COALESCE(emisiones_alcance_2::text, '0') ||
    ' | Alcance 3: ' || COALESCE(emisiones_alcance_3::text, '0') as valor
FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1

UNION ALL

SELECT 
    '🌳 COMPENSACIÓN' as seccion,
    'Total: ' || COALESCE(emisiones_totales::text, '0') || ' Ton CO₂ | ' ||
    'Árboles: ' || COALESCE(arboles_compensar::text, '0') as valor
FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1;

-- Análisis de completitud del último cálculo
\echo ''
\echo 'COMPLETITUD DE DATOS DEL ÚLTIMO CÁLCULO:'
WITH ultimo_calculo AS (
    SELECT id, codigo_seguimiento FROM calculos_huella_carbono
    ORDER BY fecha_creacion DESC LIMIT 1
),
analisis_completitud AS (
    SELECT 
        uc.codigo_seguimiento,
        (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = uc.id) as solidos,
        (SELECT COUNT(*) FROM combustibles_liquidos WHERE calculo_id = uc.id) as liquidos,
        (SELECT COUNT(*) FROM combustibles_gaseosos WHERE calculo_id = uc.id) as gaseosos,
        (SELECT COUNT(*) FROM consumo_electricidad WHERE calculo_id = uc.id) as electricidad,
        (SELECT COUNT(*) FROM vuelos_aereos WHERE calculo_id = uc.id) as vuelos,
        (SELECT COUNT(*) FROM extintores WHERE calculo_id = uc.id) as extintores,
        (SELECT SUM(emisiones_totales) FROM combustibles_solidos WHERE calculo_id = uc.id) as emisiones_solidos,
        (SELECT SUM(emisiones_totales) FROM combustibles_liquidos WHERE calculo_id = uc.id) as emisiones_liquidos,
        (SELECT SUM(emisiones_totales) FROM combustibles_gaseosos WHERE calculo_id = uc.id) as emisiones_gaseosos,
        (SELECT SUM(emisiones_totales) FROM consumo_electricidad WHERE calculo_id = uc.id) as emisiones_electricidad
    FROM ultimo_calculo uc
)
SELECT 
    'Combustibles Sólidos' as categoria,
    solidos as registros,
    COALESCE(ROUND(emisiones_solidos::numeric, 4), 0) as emisiones_ton,
    CASE 
        WHEN solidos > 0 AND emisiones_solidos > 0 THEN '✅ COMPLETO'
        WHEN solidos > 0 AND emisiones_solidos = 0 THEN '⚠️ SIN EMISIONES'
        WHEN solidos = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud

UNION ALL

SELECT 
    'Combustibles Líquidos' as categoria,
    liquidos as registros,
    COALESCE(ROUND(emisiones_liquidos::numeric, 4), 0) as emisiones_ton,
    CASE 
        WHEN liquidos > 0 AND emisiones_liquidos > 0 THEN '✅ COMPLETO'
        WHEN liquidos > 0 AND emisiones_liquidos = 0 THEN '⚠️ SIN EMISIONES'
        WHEN liquidos = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud

UNION ALL

SELECT 
    'Combustibles Gaseosos' as categoria,
    gaseosos as registros,
    COALESCE(ROUND(emisiones_gaseosos::numeric, 4), 0) as emisiones_ton,
    CASE 
        WHEN gaseosos > 0 AND emisiones_gaseosos > 0 THEN '✅ COMPLETO'
        WHEN gaseosos > 0 AND emisiones_gaseosos = 0 THEN '⚠️ SIN EMISIONES'
        WHEN gaseosos = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud

UNION ALL

SELECT 
    'Consumo Eléctrico' as categoria,
    electricidad as registros,
    COALESCE(ROUND(emisiones_electricidad::numeric, 4), 0) as emisiones_ton,
    CASE 
        WHEN electricidad > 0 AND emisiones_electricidad > 0 THEN '✅ COMPLETO'
        WHEN electricidad > 0 AND emisiones_electricidad = 0 THEN '⚠️ SIN EMISIONES'
        WHEN electricidad = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud

UNION ALL

SELECT 
    'Vuelos Aéreos' as categoria,
    vuelos as registros,
    0 as emisiones_ton, -- Los vuelos no tienen emisiones_totales en el schema actual
    CASE 
        WHEN vuelos > 0 THEN '✅ CON DATOS'
        WHEN vuelos = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud

UNION ALL

SELECT 
    'Extintores' as categoria,
    extintores as registros,
    0 as emisiones_ton, -- Los extintores usan emisiones_parciales
    CASE 
        WHEN extintores > 0 THEN '✅ CON DATOS'
        WHEN extintores = 0 THEN '➖ SIN DATOS'
        ELSE '❓ VERIFICAR'
    END as estado
FROM analisis_completitud;

-- =====================================================
-- 4. VERIFICACIÓN DE INTEGRIDAD Y CÁLCULOS
-- =====================================================

\echo ''
\echo '🔍 4. VERIFICACIÓN DE INTEGRIDAD DE CÁLCULOS'
\echo '--------------------------------------------'

-- Verificar que las emisiones totales se calculan correctamente
\echo ''
\echo 'VALIDACIÓN DE CÁLCULO AUTOMÁTICO (TRIGGER emisiones_totales):'
SELECT 
    codigo_seguimiento,
    emisiones_alcance_1 as alcance1,
    emisiones_alcance_2 as alcance2,
    emisiones_alcance_3 as alcance3,
    emisiones_totales as total_calculado,
    (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3) as suma_manual,
    CASE 
        WHEN ABS(emisiones_totales - (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3)) < 0.001 
        THEN '✅ CÁLCULO CORRECTO'
        ELSE '❌ ERROR EN TRIGGER'
    END as validacion_trigger
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 3;

-- Verificar registros huérfanos (ERROR CRÍTICO si los hay)
\echo ''
\echo 'VERIFICACIÓN DE INTEGRIDAD REFERENCIAL:'
WITH verificacion_huerfanos AS (
    SELECT 'combustibles_solidos' as tabla, 
           COUNT(*) as total_registros,
           COUNT(chc.id) as registros_validos,
           (COUNT(*) - COUNT(chc.id)) as huerfanos
    FROM combustibles_solidos cs
    LEFT JOIN calculos_huella_carbono chc ON cs.calculo_id = chc.id
    
    UNION ALL
    
    SELECT 'combustibles_liquidos' as tabla,
           COUNT(*) as total_registros,
           COUNT(chc.id) as registros_validos,
           (COUNT(*) - COUNT(chc.id)) as huerfanos
    FROM combustibles_liquidos cl
    LEFT JOIN calculos_huella_carbono chc ON cl.calculo_id = chc.id
    
    UNION ALL
    
    SELECT 'consumo_electricidad' as tabla,
           COUNT(*) as total_registros,
           COUNT(chc.id) as registros_validos,
           (COUNT(*) - COUNT(chc.id)) as huerfanos
    FROM consumo_electricidad ce
    LEFT JOIN calculos_huella_carbono chc ON ce.calculo_id = chc.id
)
SELECT 
    tabla,
    total_registros,
    registros_validos,
    huerfanos,
    CASE 
        WHEN huerfanos = 0 THEN '✅ INTEGRIDAD OK'
        ELSE '❌ REGISTROS HUÉRFANOS DETECTADOS'
    END as estado_integridad
FROM verificacion_huerfanos
WHERE total_registros > 0;

-- =====================================================
-- 5. HISTÓRICO Y TENDENCIAS
-- =====================================================

\echo ''
\echo '📈 5. ANÁLISIS HISTÓRICO Y TENDENCIAS'
\echo '-------------------------------------'

-- Histórico completo
\echo ''
\echo 'HISTÓRICO DE TODOS LOS CÁLCULOS:'
SELECT 
    ROW_NUMBER() OVER (ORDER BY fecha_creacion DESC) as posicion,
    codigo_seguimiento,
    LEFT(nombre_empresa, 30) || 
    CASE WHEN LENGTH(nombre_empresa) > 30 THEN '...' ELSE '' END as empresa,
    TO_CHAR(fecha_creacion, 'DD/MM/YY HH24:MI') as fecha,
    ROUND(emisiones_totales::numeric, 2) as emisiones,
    COALESCE(arboles_compensar, 0) as arboles,
    COALESCE(nivel_evaluacion, 'Pendiente') as evaluacion
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC;

-- Estadísticas por empresa
\echo ''
\echo 'TOP EMPRESAS POR EMISIONES (si hay múltiples cálculos):'
SELECT 
    nombre_empresa,
    COUNT(*) as num_calculos,
    ROUND(MIN(emisiones_totales)::numeric, 2) as min_emisiones,
    ROUND(MAX(emisiones_totales)::numeric, 2) as max_emisiones,
    ROUND(AVG(emisiones_totales)::numeric, 2) as promedio_emisiones,
    SUM(COALESCE(arboles_compensar, 0)) as arboles_totales
FROM calculos_huella_carbono
GROUP BY nombre_empresa
HAVING COUNT(*) > 0
ORDER BY AVG(emisiones_totales) DESC;

-- =====================================================
-- 6. DIAGNÓSTICO FINAL Y RECOMENDACIONES
-- =====================================================

\echo ''
\echo '🏥 6. DIAGNÓSTICO FINAL'
\echo '----------------------'

-- Diagnóstico general del sistema
WITH diagnostico AS (
    SELECT 
        (SELECT COUNT(*) FROM calculos_huella_carbono) as total_calculos,
        (SELECT COUNT(*) FROM combustibles_solidos) as total_solidos,
        (SELECT COUNT(*) FROM combustibles_liquidos) as total_liquidos,
        (SELECT COUNT(*) FROM consumo_electricidad) as total_electricidad,
        (SELECT COUNT(*) > 0 FROM calculos_huella_carbono WHERE emisiones_totales > 0) as hay_emisiones,
        (SELECT COUNT(*) FROM calculos_huella_carbono WHERE 
         ABS(emisiones_totales - (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3)) > 0.001) as calculos_incorrectos
)
SELECT 
    'ESTADO GENERAL' as categoria,
    CASE 
        WHEN total_calculos = 0 THEN '❌ SIN DATOS - NO SE HA GUARDADO NINGÚN CÁLCULO'
        WHEN total_calculos > 0 AND (total_solidos + total_liquidos + total_electricidad) = 0 
        THEN '⚠️ PROBLEMA - HAY CÁLCULOS PERO SIN DETALLES'
        WHEN total_calculos > 0 AND (total_solidos + total_liquidos + total_electricidad) > 0 AND hay_emisiones
        THEN '✅ SISTEMA FUNCIONANDO CORRECTAMENTE'
        WHEN calculos_incorrectos > 0 
        THEN '⚠️ HAY ERRORES EN CÁLCULOS AUTOMÁTICOS'
        ELSE '❓ ESTADO INDETERMINADO'
    END as diagnostico,
    CASE 
        WHEN total_calculos = 0 THEN 'Verificar frontend y backend. Hacer prueba de guardado.'
        WHEN total_calculos > 0 AND (total_solidos + total_liquidos + total_electricidad) = 0 
        THEN 'El backend NO está guardando detalles. Verificar DatabaseService.js'
        WHEN total_calculos > 0 AND (total_solidos + total_liquidos + total_electricidad) > 0 AND hay_emisiones
        THEN 'Sistema funcionando correctamente. Continuar con pruebas.'
        WHEN calculos_incorrectos > 0 
        THEN 'Verificar triggers de cálculo automático en la base de datos.'
        ELSE 'Realizar análisis manual adicional.'
    END as recomendacion
FROM diagnostico;

\echo ''
\echo '✅ VERIFICACIÓN PROFESIONAL COMPLETADA'
\echo '====================================='
\echo 'Si el diagnóstico final muestra problemas, seguir las recomendaciones.'
\echo 'Si muestra ✅ FUNCIONANDO CORRECTAMENTE, el sistema está operativo.'
\echo ''