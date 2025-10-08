-- ARREGLO INMEDIATO: Agregar columnas faltantes
ALTER TABLE calculos_autogestion 
ADD COLUMN IF NOT EXISTS pdf_report BYTEA,
ADD COLUMN IF NOT EXISTS executive_summary JSONB;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_autogestion_executive_summary 
ON calculos_autogestion USING gin(executive_summary);

SELECT 'Columnas agregadas exitosamente' as resultado;