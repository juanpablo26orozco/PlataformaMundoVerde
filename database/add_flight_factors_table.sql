-- ============================================================================
-- AGREGAR TABLA: factores_vuelos (faltaba en el schema original)
-- ============================================================================
-- Fecha: 3 de Octubre, 2025
-- Descripción: Tabla de catálogo para factores de emisión de vuelos
--              Similar a las otras tablas de catálogo (combustibles, electricidad)
-- ============================================================================

\c mundoverde_db

-- ============================================================================
-- CREAR TABLA: factores_vuelos
-- ============================================================================

CREATE TABLE IF NOT EXISTS factores_vuelos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Clase de vuelo
    clase VARCHAR(100) UNIQUE NOT NULL,
    
    -- Factor de emisión único (kg CO2e por pasajero por km)
    -- La app actualmente usa un factor fijo por clase, sin distinción de distancia
    factor_emision DECIMAL(10,6) NOT NULL,
    
    -- Metadata
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT factor_positivo CHECK (factor_emision > 0)
);

-- Índices
CREATE INDEX idx_factores_vuelos_clase ON factores_vuelos(clase);
CREATE INDEX idx_factores_vuelos_activo ON factores_vuelos(activo);

COMMENT ON TABLE factores_vuelos IS 'Catálogo de factores de emisión para vuelos aéreos por clase';
COMMENT ON COLUMN factores_vuelos.factor_emision IS 'kg CO2e por pasajero por km (factor único, sin distinción de distancia)';

-- ============================================================================
-- INSERTAR DATOS INICIALES (VALORES ACTUALES DE LA APP)
-- ============================================================================

INSERT INTO factores_vuelos (
    clase, 
    factor_emision,
    fuente,
    año_publicacion
) VALUES
('Economica', 0.158, 'Factor actualmente usado en la aplicación', 2025),
('Ejecutiva', 0.237, 'Factor actualmente usado en la aplicación', 2025)

ON CONFLICT (clase) DO UPDATE SET
    factor_emision = EXCLUDED.factor_emision,
    fuente = EXCLUDED.fuente,
    año_publicacion = EXCLUDED.año_publicacion,
    actualizado_en = CURRENT_TIMESTAMP;

-- ============================================================================
-- VERIFICAR INSERCIÓN
-- ============================================================================

SELECT '✅ Tabla factores_vuelos creada correctamente' AS status;

SELECT 
    clase,
    factor_emision AS "Factor (kg CO2e/pasajero/km)",
    fuente
FROM factores_vuelos
WHERE activo = true
ORDER BY clase;

SELECT '✅ SCRIPT COMPLETADO' AS resultado;
