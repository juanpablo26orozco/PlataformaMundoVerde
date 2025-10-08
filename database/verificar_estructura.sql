-- VERIFICAR ESTRUCTURA DE LA TABLA calculos_autogestion
-- Ejecuta esto para ver las columnas actuales

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'calculos_autogestion' 
ORDER BY ordinal_position;

-- Ver si existen las nuevas columnas de optimización
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'calculos_autogestion' 
            AND column_name = 'executive_summary'
        ) THEN '✅ executive_summary column exists'
        ELSE '❌ executive_summary column missing'
    END as executive_summary_status,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'calculos_autogestion' 
            AND column_name = 'pdf_report'
        ) THEN '✅ pdf_report column exists'
        ELSE '❌ pdf_report column missing'
    END as pdf_report_status;

-- Contar registros actuales
SELECT 
    COUNT(*) as total_calculos_autogestion,
    'Registros actuales en calculos_autogestion' as descripcion
FROM calculos_autogestion;

-- =====================================================
-- VERIFICAR TABLAS RELACIONADAS (RESPUESTAS INDIVIDUALES)
-- =====================================================

-- Verificar si existen las tablas de respuestas individuales (que queremos eliminar)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'respuestas_autogestion') 
        THEN 'TABLA respuestas_autogestion EXISTE (para eliminar en optimización)'
        ELSE 'TABLA respuestas_autogestion NO EXISTE'
    END as estado_respuestas,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'promedios_bloques_autogestion') 
        THEN 'TABLA promedios_bloques_autogestion EXISTE (para eliminar en optimización)'
        ELSE 'TABLA promedios_bloques_autogestion NO EXISTE'
    END as estado_promedios;

-- Si existen, contar cuántos registros tienen
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'respuestas_autogestion') THEN
        RAISE NOTICE 'La tabla respuestas_autogestion tiene % registros', 
            (SELECT COUNT(*) FROM respuestas_autogestion);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'promedios_bloques_autogestion') THEN
        RAISE NOTICE 'La tabla promedios_bloques_autogestion tiene % registros', 
            (SELECT COUNT(*) FROM promedios_bloques_autogestion);
    END IF;
END $$;