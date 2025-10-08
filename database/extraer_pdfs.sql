-- =====================================================
-- FUNCIÓN PARA EXTRAER PDFs DE AUTOGESTIÓN
-- =====================================================

\c mundoverde_db

-- Función para extraer PDF como base64
CREATE OR REPLACE FUNCTION extraer_pdf_autogestion(
    p_codigo_seguimiento VARCHAR(20)
) RETURNS TABLE(
    codigo VARCHAR(20),
    nombre_archivo VARCHAR(255),
    tamaño_bytes BIGINT,
    pdf_base64 TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.codigo_seguimiento,
        a.pdf_nombre,
        a.pdf_size,
        encode(a.pdf_reporte, 'base64') as pdf_base64
    FROM calculos_autogestion a
    WHERE a.codigo_seguimiento = p_codigo_seguimiento
    AND a.pdf_reporte IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Uso de la función:
-- SELECT * FROM extraer_pdf_autogestion('AG-2025-000001');

COMMENT ON FUNCTION extraer_pdf_autogestion IS 'Extrae PDF de autogestión como base64 para descarga';

SELECT '✅ Función extraer_pdf_autogestion() creada exitosamente' as resultado;