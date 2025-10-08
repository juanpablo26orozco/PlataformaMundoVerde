-- =====================================================
-- OPTIMIZACIÓN DE AUTOGESTIÓN - NUEVA IMPLEMENTACIÓN
-- Solo guardar lo esencial: resúmenes + PDF
-- =====================================================

-- Modificar tabla principal para incluir PDF
ALTER TABLE calculos_autogestion 
ADD COLUMN IF NOT EXISTS pdf_reporte BYTEA,
ADD COLUMN IF NOT EXISTS pdf_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS pdf_size BIGINT,
ADD COLUMN IF NOT EXISTS resumen_ejecutivo JSONB;

-- Comentar para documentar la optimización
COMMENT ON COLUMN calculos_autogestion.pdf_reporte IS 'PDF completo con las 210 respuestas detalladas';
COMMENT ON COLUMN calculos_autogestion.resumen_ejecutivo IS 'JSON con resúmenes por bloque para consultas rápidas';

-- Crear vista optimizada para consultas frecuentes
CREATE OR REPLACE VIEW vista_autogestion_resumen AS
SELECT 
    id,
    codigo_seguimiento,
    nombre_empresa,
    nit,
    sector,
    año_reporte,
    fecha_reporte,
    
    -- Porcentajes principales (ya existen)
    porcentaje_economico,
    porcentaje_ambiental, 
    porcentaje_energia,
    porcentaje_seguridad,
    porcentaje_social,
    porcentaje_almacen,
    porcentaje_final,
    
    -- Información del PDF
    pdf_nombre,
    pdf_size,
    CASE WHEN pdf_reporte IS NOT NULL THEN true ELSE false END as tiene_pdf,
    
    -- Metadata
    fecha_creacion,
    estado,
    nivel_cumplimiento
FROM calculos_autogestion
ORDER BY fecha_creacion DESC;

-- =====================================================
-- DECISIÓN PROFESIONAL SOBRE TABLAS DETALLADAS
-- =====================================================

-- OPCIÓN 1: Mantener tablas para histórico pero no usar en nuevo guardado
-- Las tablas respuestas_autogestion y promedios_bloques_autogestion 
-- quedan para consultas históricas si las hay

-- OPCIÓN 2: Eliminar tablas innecesarias (más agresivo)
-- DROP TABLE IF EXISTS respuestas_autogestion CASCADE;
-- DROP TABLE IF EXISTS promedios_bloques_autogestion CASCADE;

-- Recomendación: OPCIÓN 1 (mantener para compatibilidad)