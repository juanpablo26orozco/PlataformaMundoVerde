-- ============================================================================
-- SCRIPT DE VERIFICACIÓN DE BASE DE DATOS
-- ============================================================================
-- Descripción: Verifica que todo esté correctamente instalado y configurado
-- Uso: psql -U postgres -d mundoverde_db -f database/verificar.sql
-- ============================================================================

\c mundoverde_db

\echo ''
\echo '======================================================================='
\echo '🔍 VERIFICACIÓN DE BASE DE DATOS - PLATAFORMA MUNDO VERDE'
\echo '======================================================================='
\echo ''

-- ============================================================================
-- 1. VERIFICAR TABLAS
-- ============================================================================

\echo '1️⃣  VERIFICANDO TABLAS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    table_name as "Tabla",
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as "Columnas"
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

\echo ''
\echo '✅ Total de tablas:'
SELECT COUNT(*) as "Total Tablas" 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

\echo ''
\echo '🛡️  Verificando tablas de privacidad/GDPR:'
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consentimientos_usuario') THEN '✅'
        ELSE '❌'
    END || ' consentimientos_usuario' as "Estado",
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'consentimientos_usuario') as "Columnas"
UNION ALL
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'historial_politicas') THEN '✅'
        ELSE '❌'
    END || ' historial_politicas',
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'historial_politicas')
UNION ALL
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'log_acceso_datos') THEN '✅'
        ELSE '❌'
    END || ' log_acceso_datos',
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'log_acceso_datos')
UNION ALL
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'solicitudes_eliminacion') THEN '✅'
        ELSE '❌'
    END || ' solicitudes_eliminacion',
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'solicitudes_eliminacion');

\echo ''

-- ============================================================================
-- 2. VERIFICAR FACTORES DE EMISIÓN
-- ============================================================================

\echo '2️⃣  VERIFICANDO FACTORES DE EMISIÓN...'
\echo '-----------------------------------------------------------------------'

SELECT 
    'Combustibles Sólidos' as "Tipo",
    COUNT(*) as "Cantidad",
    COUNT(*) FILTER (WHERE activo = true) as "Activos"
FROM catalogo_combustibles_solidos
UNION ALL
SELECT 
    'Combustibles Líquidos',
    COUNT(*),
    COUNT(*) FILTER (WHERE activo = true)
FROM catalogo_combustibles_liquidos
UNION ALL
SELECT 
    'Combustibles Gaseosos',
    COUNT(*),
    COUNT(*) FILTER (WHERE activo = true)
FROM catalogo_combustibles_gaseosos
UNION ALL
SELECT 
    'Factores Electricidad',
    COUNT(*),
    COUNT(*) FILTER (WHERE activo = true)
FROM factores_electricidad_pais;

\echo ''
\echo '🇨🇴 Factor de Colombia 2024:'
SELECT 
    pais as "País",
    año as "Año",
    factor_emision as "Factor (kg CO₂/kWh)",
    fuente as "Fuente"
FROM factores_electricidad_pais
WHERE pais = 'Colombia' 
AND año = 2024
AND activo = true;

\echo ''

-- ============================================================================
-- 3. VERIFICAR FUNCIONES Y TRIGGERS
-- ============================================================================

\echo '3️⃣  VERIFICANDO FUNCIONES...'
\echo '-----------------------------------------------------------------------'

SELECT 
    p.proname as "Función",
    pg_get_function_result(p.oid) as "Retorna"
FROM pg_proc p
WHERE p.pronamespace = 'public'::regnamespace
AND p.prokind = 'f'
ORDER BY p.proname;

\echo ''
\echo '⚙️  Total de funciones:'
SELECT COUNT(*) as "Total Funciones"
FROM pg_proc p
WHERE p.pronamespace = 'public'::regnamespace
AND p.prokind = 'f';

\echo ''

-- ============================================================================
-- 4. VERIFICAR TRIGGERS
-- ============================================================================

\echo '4️⃣  VERIFICANDO TRIGGERS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    c.relname as "Tabla",
    t.tgname as "Trigger",
    p.proname as "Función"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relnamespace = 'public'::regnamespace
AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;

\echo ''
\echo '⚙️  Total de triggers:'
SELECT COUNT(*) as "Total Triggers"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relnamespace = 'public'::regnamespace
AND NOT t.tgisinternal;

\echo ''

-- ============================================================================
-- 5. VERIFICAR SECUENCIAS
-- ============================================================================

\echo '5️⃣  VERIFICANDO SECUENCIAS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    sequence_name as "Secuencia",
    last_value as "Último Valor",
    increment_by as "Incremento"
FROM pg_sequences
WHERE schemaname = 'public';

\echo ''

-- ============================================================================
-- 6. VERIFICAR ÍNDICES
-- ============================================================================

\echo '6️⃣  VERIFICANDO ÍNDICES...'
\echo '-----------------------------------------------------------------------'

SELECT 
    tablename as "Tabla",
    indexname as "Índice"
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%pkey'
ORDER BY tablename, indexname;

\echo ''
\echo '🔍 Total de índices (sin primary keys):'
SELECT COUNT(*) as "Total Índices"
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%pkey';

\echo ''

-- ============================================================================
-- 7. VERIFICAR VISTAS
-- ============================================================================

\echo '7️⃣  VERIFICANDO VISTAS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    table_name as "Vista"
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

\echo ''
\echo '👁️  Total de vistas:'
SELECT COUNT(*) as "Total Vistas"
FROM information_schema.views
WHERE table_schema = 'public';

\echo ''

-- ============================================================================
-- 8. PROBAR GENERACIÓN DE CÓDIGOS
-- ============================================================================

\echo '8️⃣  PROBANDO GENERACIÓN DE CÓDIGOS...'
\echo '-----------------------------------------------------------------------'

\echo '🔖 Generando código de Huella de Carbono:'
SELECT generar_codigo_seguimiento('HC') as "Código HC";

\echo ''
\echo '🔖 Generando código de Autogestión:'
SELECT generar_codigo_seguimiento('AG') as "Código AG";

\echo ''

-- ============================================================================
-- 9. ESTADÍSTICAS DE DATOS
-- ============================================================================

\echo '9️⃣  ESTADÍSTICAS DE DATOS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    'Cálculos de Huella' as "Tabla",
    COUNT(*) as "Registros"
FROM calculos_huella_carbono
UNION ALL
SELECT 
    'Cálculos de Autogestión',
    COUNT(*)
FROM calculos_autogestion
UNION ALL
SELECT 
    'Documentos Generados',
    COUNT(*)
FROM documentos_generados
UNION ALL
SELECT 
    'Registros de Auditoría',
    COUNT(*)
FROM auditoria;

\echo ''

-- ============================================================================
-- 10. TAMAÑO DE LA BASE DE DATOS
-- ============================================================================

\echo '🔟 TAMAÑO DE LA BASE DE DATOS...'
\echo '-----------------------------------------------------------------------'

SELECT 
    pg_database.datname as "Base de Datos",
    pg_size_pretty(pg_database_size(pg_database.datname)) as "Tamaño"
FROM pg_database
WHERE datname = 'mundoverde_db';

\echo ''

-- ============================================================================
-- 11. VERIFICACIÓN FINAL
-- ============================================================================

\echo '======================================================================='
\echo '✅ RESUMEN DE VERIFICACIÓN'
\echo '======================================================================='

DO $$
DECLARE
    v_tablas INTEGER;
    v_funciones INTEGER;
    v_triggers INTEGER;
    v_factores_solidos INTEGER;
    v_factores_liquidos INTEGER;
    v_factores_gaseosos INTEGER;
    v_factores_electricidad INTEGER;
BEGIN
    -- Contar elementos
    SELECT COUNT(*) INTO v_tablas 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    SELECT COUNT(*) INTO v_funciones
    FROM pg_proc p
    WHERE p.pronamespace = 'public'::regnamespace
    AND p.prokind = 'f';
    
    SELECT COUNT(*) INTO v_triggers
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE c.relnamespace = 'public'::regnamespace
    AND NOT t.tgisinternal;
    
    SELECT COUNT(*) INTO v_factores_solidos FROM catalogo_combustibles_solidos WHERE activo = true;
    SELECT COUNT(*) INTO v_factores_liquidos FROM catalogo_combustibles_liquidos WHERE activo = true;
    SELECT COUNT(*) INTO v_factores_gaseosos FROM catalogo_combustibles_gaseosos WHERE activo = true;
    SELECT COUNT(*) INTO v_factores_electricidad FROM factores_electricidad_pais WHERE activo = true;
    
    -- Mostrar resultados
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABLAS: % (esperado: 21 - 17 operativas + 4 legales)', v_tablas;
    RAISE NOTICE '⚙️  FUNCIONES: % (esperado: 8+)', v_funciones;
    RAISE NOTICE '🔧 TRIGGERS: % (esperado: 12+)', v_triggers;
    RAISE NOTICE '🔥 FACTORES SÓLIDOS: % (esperado: 25)', v_factores_solidos;
    RAISE NOTICE '💧 FACTORES LÍQUIDOS: % (esperado: 16)', v_factores_liquidos;
    RAISE NOTICE '💨 FACTORES GASEOSOS: % (esperado: 11)', v_factores_gaseosos;
    RAISE NOTICE '⚡ FACTORES ELECTRICIDAD: % (esperado: 14+)', v_factores_electricidad;
    RAISE NOTICE '';
    
    -- Validación
    IF v_tablas >= 21 AND v_factores_solidos > 0 AND v_factores_liquidos > 0 THEN
        RAISE NOTICE '✅ ¡TODO CORRECTO! La base de datos está lista para usar.';
        RAISE NOTICE '';
        RAISE NOTICE '🎯 PRÓXIMOS PASOS:';
        RAISE NOTICE '   1. Configurar el archivo .env con las credenciales';
        RAISE NOTICE '   2. Instalar dependencia: npm install pg';
        RAISE NOTICE '   3. Iniciar el servidor: npm start';
        RAISE NOTICE '   4. Probar los endpoints con Postman o desde el frontend';
    ELSE
        RAISE WARNING '⚠️  ATENCIÓN: Algunos elementos faltan o no están correctos.';
        RAISE WARNING '   Verifica que hayas ejecutado TODOS los scripts en orden:';
        RAISE WARNING '   1. schema.sql';
        RAISE WARNING '   2. seed_factores.sql';
        RAISE WARNING '   3. functions.sql';
    END IF;
    
    RAISE NOTICE '';
END $$;

-- ============================================================================
-- 12. VERIFICACIÓN DE TABLAS DE PRIVACIDAD
-- ============================================================================

\echo ''
\echo '======================================================================='
\echo '🛡️  VERIFICACIÓN DE CUMPLIMIENTO LEGAL (GDPR/Ley 1581)'
\echo '======================================================================='
\echo ''

\echo '📋 Políticas registradas en el sistema:'
SELECT 
    tipo as "Tipo",
    version as "Versión",
    fecha_vigencia as "Vigencia",
    CASE WHEN activa THEN '✅ Activa' ELSE '❌ Inactiva' END as "Estado"
FROM historial_politicas
ORDER BY tipo, version;

\echo ''
\echo '📊 Estadísticas de consentimientos:'
SELECT 
    'Total Registrados' as "Concepto",
    COUNT(*) as "Cantidad"
FROM consentimientos_usuario
UNION ALL
SELECT 
    'Activos (No Revocados)',
    COUNT(*)
FROM consentimientos_usuario
WHERE consentimiento_revocado = false
UNION ALL
SELECT 
    'Revocados',
    COUNT(*)
FROM consentimientos_usuario
WHERE consentimiento_revocado = true;

\echo ''
\echo '📝 Registros de auditoría:'
SELECT 
    'Accesos Registrados (últimos 30 días)' as "Concepto",
    COUNT(*) as "Cantidad"
FROM log_acceso_datos
WHERE fecha_acceso >= CURRENT_TIMESTAMP - INTERVAL '30 days';

\echo ''
\echo '🗑️  Solicitudes de eliminación:'
SELECT 
    'Total Solicitudes' as "Concepto",
    COUNT(*) as "Cantidad"
FROM solicitudes_eliminacion
UNION ALL
SELECT 
    'Pendientes',
    COUNT(*)
FROM solicitudes_eliminacion
WHERE estado IN ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'PROCESANDO')
UNION ALL
SELECT 
    'Completadas',
    COUNT(*)
FROM solicitudes_eliminacion
WHERE estado = 'COMPLETADA';

\echo ''
\echo '✅ Vistas de privacidad disponibles:'
SELECT 
    viewname as "Vista",
    CASE 
        WHEN viewname = 'vista_consentimientos_activos' THEN 'Consentimientos vigentes'
        WHEN viewname = 'vista_eliminaciones_pendientes' THEN 'Eliminaciones en proceso'
        WHEN viewname = 'vista_accesos_recientes' THEN 'Log de accesos (30 días)'
        ELSE 'Otra'
    END as "Descripción"
FROM pg_views
WHERE schemaname = 'public'
AND viewname LIKE 'vista_%'
ORDER BY viewname;

\echo ''
\echo '======================================================================='
\echo '📖 DOCUMENTACIÓN: database/README_DATABASE.md'
\echo '======================================================================='
\echo ''
