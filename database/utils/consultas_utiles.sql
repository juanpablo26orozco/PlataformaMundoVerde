-- ============================================================================
-- QUERIES DE CONSULTA ÚTILES - Plataforma Mundo Verde
-- ============================================================================
-- Archivo: utils/consultas_utiles.sql
-- Descripción: Queries comunes para consultar datos de la BD
-- ============================================================================

-- ============================================================================
-- CONSULTAS DE HUELLA DE CARBONO
-- ============================================================================

-- 1. Ver todos los cálculos de huella de carbono
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    nit,
    sector,
    municipio,
    año_reporte,
    emisiones_alcance_1,
    emisiones_alcance_2,
    emisiones_alcance_3,
    emisiones_totales,
    nivel_evaluacion,
    arboles_compensar,
    fecha_creacion
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 20;

-- 2. Buscar por código de seguimiento
SELECT * FROM calculos_huella_carbono 
WHERE codigo_seguimiento = 'HC-2025-000001';

-- 3. Buscar por empresa (NIT)
SELECT * FROM calculos_huella_carbono 
WHERE nit = '900123456-7'
ORDER BY fecha_creacion DESC;

-- 4. Top 10 empresas con más emisiones
SELECT 
    nombre_empresa,
    nit,
    COUNT(*) as total_calculos,
    SUM(emisiones_totales) as emisiones_totales,
    AVG(emisiones_totales) as emisiones_promedio
FROM calculos_huella_carbono
GROUP BY nombre_empresa, nit
ORDER BY emisiones_totales DESC
LIMIT 10;

-- 5. Emisiones por sector económico
SELECT 
    sector,
    COUNT(*) as cantidad_empresas,
    SUM(emisiones_totales) as emisiones_totales,
    AVG(emisiones_totales) as emisiones_promedio
FROM calculos_huella_carbono
GROUP BY sector
ORDER BY emisiones_totales DESC;

-- 6. Detalles completos de un cálculo con combustibles
SELECT 
    hc.codigo_seguimiento,
    hc.nombre_empresa,
    hc.emisiones_totales,
    
    -- Combustibles sólidos
    (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = hc.id) as cant_solidos,
    (SELECT SUM(emisiones_totales) FROM combustibles_solidos WHERE calculo_id = hc.id) as emisiones_solidos,
    
    -- Combustibles líquidos
    (SELECT COUNT(*) FROM combustibles_liquidos WHERE calculo_id = hc.id) as cant_liquidos,
    (SELECT SUM(emisiones_totales) FROM combustibles_liquidos WHERE calculo_id = hc.id) as emisiones_liquidos,
    
    -- Electricidad
    (SELECT SUM(emisiones_totales) FROM consumo_electricidad WHERE calculo_id = hc.id) as emisiones_electricidad,
    
    -- Vuelos
    (SELECT COUNT(*) FROM vuelos_aereos WHERE calculo_id = hc.id) as cant_vuelos,
    (SELECT SUM(emisiones_totales) FROM vuelos_aereos WHERE calculo_id = hc.id) as emisiones_vuelos

FROM calculos_huella_carbono hc
WHERE hc.codigo_seguimiento = 'HC-2025-000001';

-- ============================================================================
-- CONSULTAS DE AUTOGESTIÓN
-- ============================================================================

-- 7. Ver todos los autodiagnósticos
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    nit,
    resumen_ejecutivo->>'porcentajeFinal' as porcentaje_final,
    resumen_ejecutivo->>'nivelCumplimiento' as nivel,
    LENGTH(pdf_reporte) as tamaño_pdf_bytes,
    fecha_creacion
FROM calculos_autogestion
ORDER BY fecha_creacion DESC
LIMIT 20;

-- 8. Buscar autogestión por código
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    nit,
    resumen_ejecutivo,
    LENGTH(pdf_reporte) as tamaño_pdf,
    fecha_creacion
FROM calculos_autogestion 
WHERE codigo_seguimiento = 'AG-2025-000001';

-- 9. Estadísticas de autogestión por nivel
SELECT 
    resumen_ejecutivo->>'nivelCumplimiento' as nivel_cumplimiento,
    COUNT(*) as cantidad,
    AVG((resumen_ejecutivo->>'porcentajeFinal')::numeric) as porcentaje_promedio
FROM calculos_autogestion
GROUP BY resumen_ejecutivo->>'nivelCumplimiento'
ORDER BY cantidad DESC;

-- 10. Verificar PDFs guardados
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    LENGTH(pdf_reporte) as bytes,
    CASE 
        WHEN LENGTH(pdf_reporte) > 100000 THEN '✅ COMPLETO'
        WHEN LENGTH(pdf_reporte) > 1000 THEN '⚠️ PEQUEÑO'
        ELSE '❌ INCOMPLETO'
    END as estado_pdf
FROM calculos_autogestion
ORDER BY fecha_creacion DESC;

-- ============================================================================
-- CATÁLOGOS Y FACTORES DE EMISIÓN
-- ============================================================================

-- 11. Contar factores de emisión por categoría
SELECT 
    'Combustibles Sólidos' as categoria, 
    COUNT(*) as cantidad 
FROM catalogo_combustibles_solidos
UNION ALL
SELECT 'Combustibles Líquidos', COUNT(*) FROM catalogo_combustibles_liquidos
UNION ALL
SELECT 'Combustibles Gaseosos', COUNT(*) FROM catalogo_combustibles_gaseosos
UNION ALL
SELECT 'Factores Eléctricos', COUNT(*) FROM factores_electricidad_pais;

-- 12. Ver todos los combustibles sólidos
SELECT 
    nombre,
    poder_calorifico,
    factor_co2,
    factor_ch4,
    factor_n2o,
    fuente
FROM catalogo_combustibles_solidos
ORDER BY nombre;

-- 13. Factores eléctricos de Colombia
SELECT 
    pais,
    año,
    factor_emision,
    unidad,
    fuente
FROM factores_electricidad_pais
WHERE pais = 'Colombia'
ORDER BY año DESC;

-- ============================================================================
-- TABLAS LEGALES (GDPR/Ley 1581)
-- ============================================================================

-- 14. Ver consentimientos registrados
SELECT 
    id,
    email_usuario,
    nombre_usuario,
    acepta_terminos,
    acepta_privacidad,
    ip_address,
    navegador,
    sistema_operativo,
    fecha_aceptacion
FROM consentimientos_usuario
ORDER BY fecha_aceptacion DESC
LIMIT 50;

-- 15. Consentimientos por navegador
SELECT 
    navegador,
    COUNT(*) as cantidad
FROM consentimientos_usuario
GROUP BY navegador
ORDER BY cantidad DESC;

-- 16. Consentimientos por sistema operativo
SELECT 
    sistema_operativo,
    COUNT(*) as cantidad
FROM consentimientos_usuario
GROUP BY sistema_operativo
ORDER BY cantidad DESC;

-- 17. Log de accesos a datos
SELECT 
    email_usuario,
    tipo_acceso,
    tabla_afectada,
    ip_address,
    fecha_acceso,
    resultado
FROM log_acceso_datos
ORDER BY fecha_acceso DESC
LIMIT 100;

-- 18. Solicitudes de eliminación (Derecho al olvido)
SELECT 
    email_usuario,
    nombre_usuario,
    motivo,
    estado,
    fecha_solicitud,
    fecha_completada
FROM solicitudes_eliminacion
ORDER BY fecha_solicitud DESC;

-- ============================================================================
-- ESTADÍSTICAS GENERALES
-- ============================================================================

-- 19. Resumen general del sistema
SELECT 
    (SELECT COUNT(*) FROM calculos_huella_carbono) as total_huellas,
    (SELECT COUNT(*) FROM calculos_autogestion) as total_autogestion,
    (SELECT COUNT(DISTINCT nit) FROM calculos_huella_carbono) as empresas_unicas,
    (SELECT SUM(emisiones_totales) FROM calculos_huella_carbono) as emisiones_totales,
    (SELECT AVG(emisiones_totales) FROM calculos_huella_carbono) as emisiones_promedio,
    (SELECT COUNT(*) FROM consentimientos_usuario) as total_consentimientos;

-- 20. Últimos códigos generados
SELECT 
    'Huella Carbono' as tipo,
    codigo_seguimiento,
    nombre_empresa,
    fecha_creacion
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 1

UNION ALL

SELECT 
    'Autogestión',
    codigo_seguimiento,
    nombre_empresa,
    fecha_creacion
FROM calculos_autogestion
ORDER BY fecha_creacion DESC
LIMIT 1;

-- 21. Actividad por mes
SELECT 
    DATE_TRUNC('month', fecha_creacion) as mes,
    COUNT(*) as cantidad_calculos,
    SUM(emisiones_totales) as emisiones_totales
FROM calculos_huella_carbono
GROUP BY DATE_TRUNC('month', fecha_creacion)
ORDER BY mes DESC;

-- 22. Verificar integridad de datos
SELECT 
    'Tablas operativas' as categoria,
    (
        (SELECT COUNT(*) FROM calculos_huella_carbono) +
        (SELECT COUNT(*) FROM calculos_autogestion) +
        (SELECT COUNT(*) FROM combustibles_solidos) +
        (SELECT COUNT(*) FROM combustibles_liquidos) +
        (SELECT COUNT(*) FROM consumo_electricidad)
    ) as total_registros
    
UNION ALL

SELECT 
    'Catálogos',
    (
        (SELECT COUNT(*) FROM catalogo_combustibles_solidos) +
        (SELECT COUNT(*) FROM catalogo_combustibles_liquidos) +
        (SELECT COUNT(*) FROM catalogo_combustibles_gaseosos) +
        (SELECT COUNT(*) FROM factores_electricidad_pais)
    )
    
UNION ALL

SELECT 
    'Tablas legales',
    (
        (SELECT COUNT(*) FROM consentimientos_usuario) +
        (SELECT COUNT(*) FROM log_acceso_datos) +
        (SELECT COUNT(*) FROM solicitudes_eliminacion)
    );

-- ============================================================================
-- LIMPIEZA Y MANTENIMIENTO
-- ============================================================================

-- 23. Eliminar cálculos de prueba (CUIDADO!)
-- DELETE FROM calculos_huella_carbono WHERE nombre_empresa LIKE '%Test%' OR nombre_empresa LIKE '%Prueba%';

-- 24. Actualizar emisiones manualmente (si triggers fallan)
-- UPDATE calculos_huella_carbono 
-- SET emisiones_totales = emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3
-- WHERE id = 'uuid-aqui';

-- 25. Resetear secuencias (SOLO SI ES NECESARIO)
-- ALTER SEQUENCE seq_huella_carbono_codigo RESTART WITH 1;
-- ALTER SEQUENCE seq_autogestion_codigo RESTART WITH 1;

-- ============================================================================
-- FIN DEL ARCHIVO
-- ============================================================================
