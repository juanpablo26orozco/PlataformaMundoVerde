-- =====================================================
-- VERIFICACIÓN SIMPLE PERO COMPLETA - PARA PGADMIN
-- =====================================================

-- 1. VERIFICAR ESTRUCTURA DE TABLAS
SELECT 
    'VERIFICACIÓN DE TABLAS' as tipo,
    table_name as nombre,
    CASE 
        WHEN table_name IN ('calculos_huella_carbono', 'combustibles_solidos', 'combustibles_liquidos', 
                           'combustibles_gaseosos', 'consumo_electricidad', 'vuelos_aereos', 'extintores')
        THEN '✅ TABLA CORRECTA'
        ELSE '❓ TABLA ADICIONAL'
    END as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%huella%' 
       OR table_name LIKE '%combustible%' 
       OR table_name LIKE '%electricidad%'
       OR table_name LIKE '%vuelos%'
       OR table_name LIKE '%extintores%')
ORDER BY table_name;

-- 2. CONTEO GENERAL DE REGISTROS
SELECT 'CONTEO DE REGISTROS' as tipo, tabla, registros, estado FROM (
    SELECT 'calculos_huella_carbono' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '❌ VACÍA' END as estado
    FROM calculos_huella_carbono
    
    UNION ALL
    
    SELECT 'combustibles_solidos' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM combustibles_solidos
    
    UNION ALL
    
    SELECT 'combustibles_liquidos' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM combustibles_liquidos
    
    UNION ALL
    
    SELECT 'combustibles_gaseosos' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM combustibles_gaseosos
    
    UNION ALL
    
    SELECT 'consumo_electricidad' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM consumo_electricidad
    
    UNION ALL
    
    SELECT 'vuelos_aereos' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM vuelos_aereos
    
    UNION ALL
    
    SELECT 'extintores' as tabla, 
           COUNT(*) as registros,
           CASE WHEN COUNT(*) > 0 THEN '✅ CON DATOS' ELSE '⚠️ VACÍA' END as estado
    FROM extintores
) subconsulta
ORDER BY 
    CASE WHEN tabla = 'calculos_huella_carbono' THEN 1 ELSE 2 END,
    tabla;

-- 3. ÚLTIMO CÁLCULO GUARDADO (DATOS PRINCIPALES)
SELECT 
    'ÚLTIMO CÁLCULO' as tipo,
    codigo_seguimiento,
    nombre_empresa,
    nit,
    fecha_creacion::date as fecha,
    emisiones_alcance_1,
    emisiones_alcance_2,
    emisiones_alcance_3,
    emisiones_totales,
    arboles_compensar
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 1;

-- 4. DETALLES DEL ÚLTIMO CÁLCULO
WITH ultimo_id AS (
    SELECT id FROM calculos_huella_carbono
    ORDER BY fecha_creacion DESC LIMIT 1
)
SELECT 
    'DETALLES ÚLTIMO CÁLCULO' as tipo,
    categoria,
    cantidad,
    CASE 
        WHEN cantidad > 0 THEN '✅ CON DATOS'
        ELSE '➖ SIN DATOS'
    END as estado
FROM (
    SELECT 'Combustibles Sólidos' as categoria, COUNT(*) as cantidad
    FROM combustibles_solidos cs, ultimo_id ui
    WHERE cs.calculo_id = ui.id
    
    UNION ALL
    
    SELECT 'Combustibles Líquidos' as categoria, COUNT(*) as cantidad
    FROM combustibles_liquidos cl, ultimo_id ui
    WHERE cl.calculo_id = ui.id
    
    UNION ALL
    
    SELECT 'Combustibles Gaseosos' as categoria, COUNT(*) as cantidad
    FROM combustibles_gaseosos cg, ultimo_id ui
    WHERE cg.calculo_id = ui.id
    
    UNION ALL
    
    SELECT 'Consumo Eléctrico' as categoria, COUNT(*) as cantidad
    FROM consumo_electricidad ce, ultimo_id ui
    WHERE ce.calculo_id = ui.id
    
    UNION ALL
    
    SELECT 'Vuelos Aéreos' as categoria, COUNT(*) as cantidad
    FROM vuelos_aereos va, ultimo_id ui
    WHERE va.calculo_id = ui.id
    
    UNION ALL
    
    SELECT 'Extintores' as categoria, COUNT(*) as cantidad
    FROM extintores e, ultimo_id ui
    WHERE e.calculo_id = ui.id
) detalles
ORDER BY categoria;

-- 5. VERIFICACIÓN DE CÁLCULOS AUTOMÁTICOS (TRIGGER)
SELECT 
    'VERIFICACIÓN TRIGGER' as tipo,
    codigo_seguimiento,
    (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3) as suma_manual,
    emisiones_totales as calculado_automatico,
    CASE 
        WHEN ABS(emisiones_totales - (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3)) < 0.01 
        THEN '✅ CÁLCULO CORRECTO'
        ELSE '❌ ERROR EN TRIGGER'
    END as validacion
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 3;

-- 6. HISTÓRICO COMPLETO
SELECT 
    'HISTÓRICO' as tipo,
    ROW_NUMBER() OVER (ORDER BY fecha_creacion DESC) as num,
    codigo_seguimiento,
    LEFT(nombre_empresa, 25) as empresa,
    fecha_creacion::date as fecha,
    ROUND(emisiones_totales::numeric, 2) as emisiones_ton
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC;