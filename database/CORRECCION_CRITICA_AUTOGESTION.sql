-- =====================================================
-- CORRECCIÓN CRÍTICA PARA AUTOGESTIÓN OPTIMIZADA
-- =====================================================
-- Fecha: 7 de Octubre 2025
-- Problema: Función obtener_siguiente_secuencia no existe
-- Solución: Crear función y verificar secuencias
-- =====================================================

\c mundoverde_db

-- =====================================================
-- 1. VERIFICAR Y CREAR SECUENCIAS SI NO EXISTEN
-- =====================================================

-- Secuencia para códigos de Huella de Carbono (HC-YYYY-NNNNNN)
CREATE SEQUENCE IF NOT EXISTS seq_huella_carbono_codigo
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999
    CACHE 1;

-- Secuencia para códigos de Autogestión (AG-YYYY-NNNNNN)
CREATE SEQUENCE IF NOT EXISTS seq_autogestion_codigo
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999
    CACHE 1;

-- =====================================================
-- 2. CREAR/REEMPLAZAR FUNCIÓN PRINCIPAL
-- =====================================================

CREATE OR REPLACE FUNCTION generar_codigo_seguimiento(
    p_prefijo VARCHAR(5)  -- 'HC' o 'AG'
) RETURNS VARCHAR(20) AS $$
DECLARE
    v_año VARCHAR(4);
    v_secuencia INTEGER;
    v_codigo VARCHAR(20);
BEGIN
    -- Obtener año actual
    v_año := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    -- Obtener siguiente número de la secuencia correspondiente
    IF p_prefijo = 'HC' THEN
        v_secuencia := nextval('seq_huella_carbono_codigo');
    ELSIF p_prefijo = 'AG' THEN
        v_secuencia := nextval('seq_autogestion_codigo');
    ELSE
        RAISE EXCEPTION 'Prefijo inválido: %. Use HC o AG', p_prefijo;
    END IF;
    
    -- Formatear código: PREFIJO-YYYY-NNNNNN (6 dígitos con ceros a la izquierda)
    v_codigo := p_prefijo || '-' || v_año || '-' || LPAD(v_secuencia::VARCHAR, 6, '0');
    
    -- Verificar que no exceda 20 caracteres
    IF LENGTH(v_codigo) > 20 THEN
        RAISE EXCEPTION 'Código generado excede 20 caracteres: %', v_codigo;
    END IF;
    
    RETURN v_codigo;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. VERIFICAR ESTRUCTURA DE TABLA calculos_autogestion
-- =====================================================

-- Verificar que tenga todas las columnas necesarias
DO $$
DECLARE
    columna_existe BOOLEAN;
BEGIN
    -- Verificar pdf_reporte
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calculos_autogestion' 
        AND column_name = 'pdf_reporte'
    ) INTO columna_existe;
    
    IF NOT columna_existe THEN
        ALTER TABLE calculos_autogestion ADD COLUMN pdf_reporte BYTEA;
        RAISE NOTICE 'Columna pdf_reporte agregada';
    END IF;
    
    -- Verificar pdf_nombre
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calculos_autogestion' 
        AND column_name = 'pdf_nombre'
    ) INTO columna_existe;
    
    IF NOT columna_existe THEN
        ALTER TABLE calculos_autogestion ADD COLUMN pdf_nombre VARCHAR(255);
        RAISE NOTICE 'Columna pdf_nombre agregada';
    END IF;
    
    -- Verificar pdf_size
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calculos_autogestion' 
        AND column_name = 'pdf_size'
    ) INTO columna_existe;
    
    IF NOT columna_existe THEN
        ALTER TABLE calculos_autogestion ADD COLUMN pdf_size BIGINT;
        RAISE NOTICE 'Columna pdf_size agregada';
    END IF;
    
    -- Verificar resumen_ejecutivo
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calculos_autogestion' 
        AND column_name = 'resumen_ejecutivo'
    ) INTO columna_existe;
    
    IF NOT columna_existe THEN
        ALTER TABLE calculos_autogestion ADD COLUMN resumen_ejecutivo JSONB;
        RAISE NOTICE 'Columna resumen_ejecutivo agregada';
    END IF;
END
$$;

-- =====================================================
-- 4. VERIFICAR LONGITUD DE CAMPO codigo_seguimiento
-- =====================================================

-- Asegurar que codigo_seguimiento tenga espacio suficiente
DO $$
DECLARE
    longitud_actual INTEGER;
BEGIN
    SELECT character_maximum_length INTO longitud_actual
    FROM information_schema.columns 
    WHERE table_name = 'calculos_autogestion' 
    AND column_name = 'codigo_seguimiento';
    
    IF longitud_actual IS NULL OR longitud_actual < 20 THEN
        ALTER TABLE calculos_autogestion 
        ALTER COLUMN codigo_seguimiento TYPE VARCHAR(20);
        RAISE NOTICE 'Campo codigo_seguimiento ajustado a VARCHAR(20)';
    END IF;
END
$$;

-- =====================================================
-- 5. PROBAR FUNCIÓN
-- =====================================================

-- Probar generación de códigos
SELECT 
    'PRUEBA FUNCIÓN' as tipo,
    generar_codigo_seguimiento('AG') as codigo_ag,
    generar_codigo_seguimiento('HC') as codigo_hc,
    LENGTH(generar_codigo_seguimiento('AG')) as longitud_ag,
    LENGTH(generar_codigo_seguimiento('HC')) as longitud_hc;

-- =====================================================
-- 6. CREAR ÍNDICES DE OPTIMIZACIÓN
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_autogestion_pdf_optimizado 
ON calculos_autogestion(pdf_nombre) 
WHERE pdf_reporte IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_autogestion_empresa_optimizado 
ON calculos_autogestion(nombre_empresa);

CREATE INDEX IF NOT EXISTS idx_autogestion_año_optimizado 
ON calculos_autogestion(año_reporte);

-- =====================================================
-- 7. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON FUNCTION generar_codigo_seguimiento IS 'Genera códigos únicos AG-YYYY-NNNNNN o HC-YYYY-NNNNNN (máximo 20 chars)';
COMMENT ON COLUMN calculos_autogestion.pdf_reporte IS 'PDF optimizado con 210 respuestas - evita guardar respuestas individuales';
COMMENT ON COLUMN calculos_autogestion.resumen_ejecutivo IS 'JSON con resúmenes ejecutivos por sección para consultas rápidas';

-- =====================================================
-- 8. REPORTE FINAL
-- =====================================================

SELECT 
    '✅ CORRECCIÓN APLICADA EXITOSAMENTE' as estado,
    'Función generar_codigo_seguimiento() creada' as funcion,
    'Secuencias verificadas y disponibles' as secuencias,
    'Columnas de optimización agregadas' as columnas,
    'Índices de rendimiento creados' as indices;

\echo ''
\echo '✅ CORRECCIÓN CRÍTICA COMPLETADA'
\echo '📊 FUNCIÓN: generar_codigo_seguimiento() disponible'
\echo '🔢 SECUENCIAS: seq_autogestion_codigo y seq_huella_carbono_codigo listas'
\echo '📁 COLUMNAS: pdf_reporte, pdf_nombre, pdf_size, resumen_ejecutivo verificadas'
\echo '⚡ ÍNDICES: Optimización aplicada'
\echo ''
\echo '🎯 AHORA PROBAR EL SISTEMA DE AUTOGESTIÓN'