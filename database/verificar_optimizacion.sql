-- VERIFICAR GUARDADO OPTIMIZADO DE AUTOGESTIÓN
-- Ejecuta esto después de hacer una prueba de guardado

-- 1. Ver los últimos registros guardados
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    porcentaje_final,
    nivel_cumplimiento,
    fecha_creacion,
    CASE 
        WHEN executive_summary IS NOT NULL THEN '✅ Tiene resumen ejecutivo'
        ELSE '❌ Sin resumen ejecutivo'
    END as estado_resumen
FROM calculos_autogestion 
ORDER BY fecha_creacion DESC 
LIMIT 5;

-- 2. Ver el contenido del resumen ejecutivo del último registro
SELECT 
    codigo_seguimiento,
    executive_summary,
    jsonb_pretty(executive_summary) as resumen_formateado
FROM calculos_autogestion 
WHERE executive_summary IS NOT NULL
ORDER BY fecha_creacion DESC 
LIMIT 1;

-- 3. Comparar antes vs después (si hay registros antiguos)
SELECT 
    'OPTIMIZADO' as tipo,
    COUNT(*) as total_registros,
    AVG(porcentaje_final) as promedio_porcentaje
FROM calculos_autogestion 
WHERE executive_summary IS NOT NULL

UNION ALL

SELECT 
    'ANTERIOR' as tipo,
    COUNT(*) as total_registros,
    AVG(porcentaje_final) as promedio_porcentaje
FROM calculos_autogestion 
WHERE executive_summary IS NULL;

-- 4. Verificar que NO se están guardando respuestas individuales
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'respuestas_autogestion') 
        THEN (SELECT COUNT(*) FROM respuestas_autogestion)
        ELSE 0
    END as respuestas_individuales_guardadas,
    'Debería ser 0 en la versión optimizada' as nota;