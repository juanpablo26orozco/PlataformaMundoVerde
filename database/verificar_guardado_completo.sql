-- =====================================================
-- SCRIPT DE VERIFICACIÓN DE GUARDADO COMPLETO
-- Huella de Carbono - Todas las Tablas Afectadas
-- =====================================================

-- Limpiar pantalla y mostrar información
\echo '🔍 VERIFICANDO GUARDADO COMPLETO DE HUELLA DE CARBONO'
\echo '======================================================'

-- =====================================================
-- 1. TABLA PRINCIPAL: calculos_huella_carbono
-- =====================================================
\echo ''
\echo '📊 1. CÁLCULOS PRINCIPALES (calculos_huella_carbono):'
\echo '---------------------------------------------------'

SELECT 
    id,
    codigo_seguimiento,
    nombre_empresa,
    nit,
    sector,
    año_reporte,
    fecha_creacion::date as fecha,
    emisiones_alcance_1,
    emisiones_alcance_2,
    emisiones_alcance_3,
    emisiones_totales,
    arboles_compensar
FROM calculos_huella_carbono 
ORDER BY fecha_creacion DESC 
LIMIT 5;

\echo ''
\echo '📈 Total de cálculos registrados:'
SELECT COUNT(*) as total_calculos FROM calculos_huella_carbono;

-- =====================================================
-- 2. COMBUSTIBLES SÓLIDOS
-- =====================================================
\echo ''
\echo '🔥 2. COMBUSTIBLES SÓLIDOS:'
\echo '----------------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    cs.tipo_combustible,
    cs.consumo_anual,
    cs.unidad_medida,
    cs.energia_consumida,
    cs.emision_co2,
    cs.emision_ch4,
    cs.emision_n2o,
    cs.emisiones_totales
FROM combustibles_solidos cs
JOIN calculos_huella_carbono c ON cs.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, cs.tipo_combustible
LIMIT 10;

\echo ''
\echo '📊 Total registros por empresa:'
SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    COUNT(cs.id) as total_combustibles_solidos,
    SUM(cs.emisiones_totales) as suma_emisiones_solidos
FROM calculos_huella_carbono c
LEFT JOIN combustibles_solidos cs ON c.id = cs.calculo_id
GROUP BY c.id, c.codigo_seguimiento, c.nombre_empresa
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 3. COMBUSTIBLES LÍQUIDOS (Estacionarios y Móviles)
-- =====================================================
\echo ''
\echo '⛽ 3. COMBUSTIBLES LÍQUIDOS:'
\echo '----------------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    cl.tipo_combustible,
    cl.tipo_fuente,
    cl.consumo_anual,
    cl.densidad,
    cl.masa_combustible,
    cl.energia_consumida,
    cl.emisiones_totales
FROM combustibles_liquidos cl
JOIN calculos_huella_carbono c ON cl.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, cl.tipo_fuente, cl.tipo_combustible
LIMIT 10;

\echo ''
\echo '📊 Resumen por tipo de fuente:'
SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    cl.tipo_fuente,
    COUNT(cl.id) as total_registros,
    SUM(cl.emisiones_totales) as suma_emisiones
FROM calculos_huella_carbono c
LEFT JOIN combustibles_liquidos cl ON c.id = cl.calculo_id
WHERE cl.id IS NOT NULL
GROUP BY c.id, c.codigo_seguimiento, c.nombre_empresa, cl.tipo_fuente
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 4. COMBUSTIBLES GASEOSOS (Estacionarios y Móviles)
-- =====================================================
\echo ''
\echo '💨 4. COMBUSTIBLES GASEOSOS:'
\echo '----------------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    cg.tipo_combustible,
    cg.tipo_fuente,
    cg.consumo_anual,
    cg.unidad_medida,
    cg.energia_consumida,
    cg.emisiones_totales
FROM combustibles_gaseosos cg
JOIN calculos_huella_carbono c ON cg.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, cg.tipo_fuente, cg.tipo_combustible
LIMIT 10;

\echo ''
\echo '📊 Resumen por tipo:'
SELECT 
    c.codigo_seguimiento,
    COUNT(cg.id) as total_gaseosos,
    SUM(cg.emisiones_totales) as suma_emisiones_gaseosos
FROM calculos_huella_carbono c
LEFT JOIN combustibles_gaseosos cg ON c.id = cg.calculo_id
GROUP BY c.id, c.codigo_seguimiento
HAVING COUNT(cg.id) > 0
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 5. CONSUMO ELÉCTRICO
-- =====================================================
\echo ''
\echo '⚡ 5. CONSUMO ELÉCTRICO:'
\echo '------------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    ce.instalacion,
    ce.año,
    ce.enero + ce.febrero + ce.marzo + ce.abril + ce.mayo + ce.junio +
    ce.julio + ce.agosto + ce.septiembre + ce.octubre + ce.noviembre + ce.diciembre as consumo_total_kwh,
    ce.factor_emision_co2,
    ce.emisiones_totales
FROM consumo_electricidad ce
JOIN calculos_huella_carbono c ON ce.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, ce.instalacion
LIMIT 10;

\echo ''
\echo '📊 Consumo mensual detallado:'
SELECT 
    c.codigo_seguimiento,
    ce.instalacion,
    ce.enero, ce.febrero, ce.marzo, ce.abril, ce.mayo, ce.junio,
    ce.julio, ce.agosto, ce.septiembre, ce.octubre, ce.noviembre, ce.diciembre,
    ce.emisiones_totales
FROM consumo_electricidad ce
JOIN calculos_huella_carbono c ON ce.calculo_id = c.id
ORDER BY c.fecha_creacion DESC
LIMIT 5;

-- =====================================================
-- 6. VUELOS AÉREOS
-- =====================================================
\echo ''
\echo '✈️ 6. VUELOS AÉREOS:'
\echo '-------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    va.ciudad_origen,
    va.ciudad_destino,
    va.tipo_vuelo,
    va.clase,
    va.numero_pasajeros,
    va.distancia_km,
    va.factor_emision,
    va.emision_ton
FROM vuelos_aereos va
JOIN calculos_huella_carbono c ON va.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, va.distancia_km DESC
LIMIT 10;

\echo ''
\echo '📊 Resumen de vuelos por empresa:'
SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    COUNT(va.id) as total_vuelos,
    SUM(va.distancia_km) as distancia_total_km,
    SUM(va.emision_ton) as emisiones_totales_vuelos
FROM calculos_huella_carbono c
LEFT JOIN vuelos_aereos va ON c.id = va.calculo_id
GROUP BY c.id, c.codigo_seguimiento, c.nombre_empresa
HAVING COUNT(va.id) > 0
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 7. EXTINTORES
-- =====================================================
\echo ''
\echo '🧯 7. EXTINTORES:'
\echo '----------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    e.tipo_gas,
    e.cantidad,
    e.pcg,
    e.emisiones_parciales
FROM extintores e
JOIN calculos_huella_carbono c ON e.calculo_id = c.id
ORDER BY c.fecha_creacion DESC, e.tipo_gas
LIMIT 10;

\echo ''
\echo '📊 Resumen de extintores:'
SELECT 
    c.codigo_seguimiento,
    COUNT(e.id) as total_extintores,
    SUM(e.cantidad) as cantidad_total,
    SUM(e.emisiones_parciales) as emisiones_totales_extintores
FROM calculos_huella_carbono c
LEFT JOIN extintores e ON c.id = e.calculo_id
GROUP BY c.id, c.codigo_seguimiento
HAVING COUNT(e.id) > 0
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 8. RESUMEN GENERAL POR CÁLCULO
-- =====================================================
\echo ''
\echo '📋 8. RESUMEN GENERAL POR CÁLCULO:'
\echo '----------------------------------'

SELECT 
    c.codigo_seguimiento,
    c.nombre_empresa,
    c.fecha_creacion::date as fecha,
    
    -- Conteos de registros por categoría
    COUNT(DISTINCT cs.id) as combustibles_solidos,
    COUNT(DISTINCT cl.id) as combustibles_liquidos,
    COUNT(DISTINCT cg.id) as combustibles_gaseosos,
    COUNT(DISTINCT ce.id) as consumos_electricos,
    COUNT(DISTINCT va.id) as vuelos_aereos,
    COUNT(DISTINCT e.id) as extintores,
    
    -- Emisiones por alcance
    c.emisiones_alcance_1,
    c.emisiones_alcance_2,
    c.emisiones_alcance_3,
    c.emisiones_totales,
    
    -- Verificación de integridad
    CASE 
        WHEN (c.emisiones_alcance_1 + c.emisiones_alcance_2 + c.emisiones_alcance_3) = c.emisiones_totales 
        THEN '✅ CORRECTO'
        ELSE '❌ ERROR EN SUMA'
    END as verificacion_suma

FROM calculos_huella_carbono c
LEFT JOIN combustibles_solidos cs ON c.id = cs.calculo_id
LEFT JOIN combustibles_liquidos cl ON c.id = cl.calculo_id
LEFT JOIN combustibles_gaseosos cg ON c.id = cg.calculo_id
LEFT JOIN consumo_electricidad ce ON c.id = ce.calculo_id
LEFT JOIN vuelos_aereos va ON c.id = va.calculo_id
LEFT JOIN extintores e ON c.id = e.calculo_id

GROUP BY c.id, c.codigo_seguimiento, c.nombre_empresa, c.fecha_creacion,
         c.emisiones_alcance_1, c.emisiones_alcance_2, c.emisiones_alcance_3, c.emisiones_totales
ORDER BY c.fecha_creacion DESC;

-- =====================================================
-- 9. VERIFICACIÓN DE INTEGRIDAD REFERENCIAL
-- =====================================================
\echo ''
\echo '🔍 9. VERIFICACIÓN DE INTEGRIDAD REFERENCIAL:'
\echo '---------------------------------------------'

\echo ''
\echo 'Registros huérfanos (sin relación con cálculo principal):'

\echo 'Combustibles sólidos huérfanos:'
SELECT COUNT(*) FROM combustibles_solidos cs 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = cs.calculo_id);

\echo 'Combustibles líquidos huérfanos:'
SELECT COUNT(*) FROM combustibles_liquidos cl 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = cl.calculo_id);

\echo 'Combustibles gaseosos huérfanos:'
SELECT COUNT(*) FROM combustibles_gaseosos cg 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = cg.calculo_id);

\echo 'Consumos eléctricos huérfanos:'
SELECT COUNT(*) FROM consumo_electricidad ce 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = ce.calculo_id);

\echo 'Vuelos aéreos huérfanos:'
SELECT COUNT(*) FROM vuelos_aereos va 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = va.calculo_id);

\echo 'Extintores huérfanos:'
SELECT COUNT(*) FROM extintores e 
WHERE NOT EXISTS (SELECT 1 FROM calculos_huella_carbono c WHERE c.id = e.calculo_id);

-- =====================================================
-- 10. ESTADÍSTICAS FINALES
-- =====================================================
\echo ''
\echo '📊 10. ESTADÍSTICAS FINALES:'
\echo '-----------------------------'

SELECT 
    'Total Cálculos' as concepto,
    COUNT(*) as cantidad
FROM calculos_huella_carbono

UNION ALL

SELECT 
    'Total Combustibles Sólidos' as concepto,
    COUNT(*) as cantidad
FROM combustibles_solidos

UNION ALL

SELECT 
    'Total Combustibles Líquidos' as concepto,
    COUNT(*) as cantidad
FROM combustibles_liquidos

UNION ALL

SELECT 
    'Total Combustibles Gaseosos' as concepto,
    COUNT(*) as cantidad
FROM combustibles_gaseosos

UNION ALL

SELECT 
    'Total Consumos Eléctricos' as concepto,
    COUNT(*) as cantidad
FROM consumo_electricidad

UNION ALL

SELECT 
    'Total Vuelos Aéreos' as concepto,
    COUNT(*) as cantidad
FROM vuelos_aereos

UNION ALL

SELECT 
    'Total Extintores' as concepto,
    COUNT(*) as cantidad
FROM extintores;

\echo ''
\echo '✅ VERIFICACIÓN COMPLETADA'
\echo '========================='
\echo ''