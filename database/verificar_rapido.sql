-- =====================================================
-- SCRIPT RÁPIDO DE VERIFICACIÓN DE GUARDADO
-- Para verificar que los datos se estén guardando correctamente
-- =====================================================

-- Verificar el último cálculo guardado
SELECT 
    'ÚLTIMO CÁLCULO GUARDADO' as verificacion,
    codigo_seguimiento,
    nombre_empresa,
    fecha_creacion,
    emisiones_totales
FROM calculos_huella_carbono 
ORDER BY fecha_creacion DESC 
LIMIT 1;

-- Verificar cuántos registros detallados tiene el último cálculo
WITH ultimo_calculo AS (
    SELECT id FROM calculos_huella_carbono
    ORDER BY fecha_creacion DESC
    LIMIT 1
)
SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Combustibles Sólidos' as tipo,
    COUNT(*) as cantidad
FROM combustibles_solidos cs, ultimo_calculo uc
WHERE cs.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Combustibles Líquidos' as tipo,
    COUNT(*) as cantidad
FROM combustibles_liquidos cl, ultimo_calculo uc
WHERE cl.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Combustibles Gaseosos' as tipo,
    COUNT(*) as cantidad
FROM combustibles_gaseosos cg, ultimo_calculo uc
WHERE cg.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Consumo Electricidad' as tipo,
    COUNT(*) as cantidad
FROM consumo_electricidad ce, ultimo_calculo uc
WHERE ce.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Vuelos Aéreos' as tipo,
    COUNT(*) as cantidad
FROM vuelos_aereos va, ultimo_calculo uc
WHERE va.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Extintores' as tipo,
    COUNT(*) as cantidad
FROM extintores e, ultimo_calculo uc
WHERE e.calculo_id = uc.id;SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Combustibles Líquidos' as tipo,
    COUNT(*) as cantidad
FROM combustibles_liquidos cl, ultimo_calculo uc
WHERE cl.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Combustibles Gaseosos' as tipo,
    COUNT(*) as cantidad
FROM combustibles_gaseosos cg, ultimo_calculo uc
WHERE cg.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Consumo Eléctrico' as tipo,
    COUNT(*) as cantidad
FROM consumo_electricidad ce, ultimo_calculo uc
WHERE ce.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Vuelos Aéreos' as tipo,
    COUNT(*) as cantidad
FROM vuelos_aereos va, ultimo_calculo uc
WHERE va.calculo_id = uc.id

UNION ALL

SELECT 
    'DETALLES DEL ÚLTIMO CÁLCULO' as categoria,
    'Extintores' as tipo,
    COUNT(*) as cantidad
FROM extintores e, ultimo_calculo uc
WHERE e.calculo_id = uc.id;

-- Verificar que las emisiones estén calculadas correctamente
SELECT 
    codigo_seguimiento,
    emisiones_alcance_1,
    emisiones_alcance_2,
    emisiones_alcance_3,
    emisiones_totales,
    (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3) as suma_calculada,
    CASE 
        WHEN ABS(emisiones_totales - (emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3)) < 0.01 
        THEN 'OK' 
        ELSE 'ERROR' 
    END as verificacion_suma
FROM calculos_huella_carbono 
ORDER BY fecha_creacion DESC 
LIMIT 5;