-- ============================================================================
-- SCRIPT: Verificar y poblar factores de emisión
-- ============================================================================
-- Fecha: 3 de Octubre, 2025
-- Descripción: 
--   1. Verifica cuántos registros hay en cada tabla
--   2. Si están vacías, inserta los datos
-- 
-- INSTRUCCIONES:
--   1. Abre pgAdmin o psql
--   2. Conéctate a la base de datos: mundoverde_db
--   3. Ejecuta este script completo
-- ============================================================================

\c mundoverde_db

-- ============================================================================
-- PASO 1: VERIFICAR DATOS EXISTENTES
-- ============================================================================

SELECT 'Verificando datos existentes...' AS status;

SELECT 
    'catalogo_combustibles_solidos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_solidos 
WHERE activo = true;

SELECT 
    'catalogo_combustibles_liquidos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_liquidos 
WHERE activo = true;

SELECT 
    'catalogo_combustibles_gaseosos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_gaseosos 
WHERE activo = true;

SELECT 
    'factores_electricidad_pais' AS tabla,
    COUNT(*) AS registros_activos
FROM factores_electricidad_pais 
WHERE activo = true;

-- ============================================================================
-- PASO 2: LIMPIAR TABLAS (OPCIONAL - descomenta si necesitas reiniciar)
-- ============================================================================

-- TRUNCATE TABLE catalogo_combustibles_solidos CASCADE;
-- TRUNCATE TABLE catalogo_combustibles_liquidos CASCADE;
-- TRUNCATE TABLE catalogo_combustibles_gaseosos CASCADE;
-- TRUNCATE TABLE factores_electricidad_pais CASCADE;

-- ============================================================================
-- PASO 3: INSERTAR DATOS - COMBUSTIBLES SÓLIDOS
-- ============================================================================

INSERT INTO catalogo_combustibles_solidos (
    nombre, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2,
    fuente, año_publicacion, pais_aplicable
) VALUES
-- Carbón mineral por región (Colombia)
('Carbón Genérico', 28.7600, 88136.0630, 1.00, 1.50, 3101.7541, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Guajira - Cesar', 26.6220, 81163.1560, 1.00, 1.50, 1133.7889, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Guajira', 30.4170, 95146.4460, 1.00, 1.50, 427.5182, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Cundinamarca', 29.1720, 75915.0750, 1.00, 1.50, 578.8202, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Cauca - Valle del Cauca', 31.2120, 80341.1980, 1.00, 1.50, 10011.7045, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Norte de Santander', 31.2920, 90087.8940, 1.20, 1.50, 671.8226, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Córdoba-Norte de Antioquia', 20.9480, 90854.3910, 1.00, 1.50, 1430.7775, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Santander', 33.0770, 77405.1450, 1.00, 1.50, 11860.2824, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Santander Sogamoso', 29.2050, 92142.0410, 1.00, 1.50, 738.9073, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Boyacá', 35.2060, 86711.4470, 1.00, 1.50, 308.9193, 'UPME Colombia', 2025, 'Colombia'),
('Carbón Antioquia', 24.4050, 93317.3110, 1.00, 1.50, 1399.6315, 'UPME Colombia', 2025, 'Colombia'),

-- Biomasa sólida
('Bagazo', 14.7430, 112371.9450, 30.00, 4.00, 47.4357, 'IPCC 2006', 2006, 'Global'),
('Fibra de palma', 16.9600, 115524.9500, 30.00, 4.00, 240.1597, 'IPCC 2006', 2006, 'Colombia'),
('Cuesco de palma', 18.9790, 107438.3300, 30.00, 4.00, 32.6761, 'IPCC 2006', 2006, 'Colombia'),
('Raquis de palma', 18.9790, 107438.3300, 30.00, 4.00, 153.6714, 'IPCC 2006', 2006, 'Colombia'),
('Cascarilla de Arroz', 14.5600, 103875.9900, 30.00, 4.00, 122.3044, 'IPCC 2006', 2006, 'Colombia'),
('Borra de Café', 24.5600, 90676.9600, 30.00, 4.00, 78.0258, 'IPCC 2006', 2006, 'Colombia'),
('Cisco de Café', 19.9500, 89525.0270, 30.00, 4.00, 0.0000, 'IPCC 2006', 2006, 'Colombia'),
('Leña', 16.9930, 89525.0270, 30.00, 4.00, 0.0000, 'IPCC 2006', 2006, 'Global'),

-- Madera
('Madera Genérico', 18.9790, 115524.9500, 30.00, 4.00, 21.6142, 'IPCC 2006', 2006, 'Global'),
('Madera Eucalipto', 18.9690, 103923.9300, 30.00, 4.00, 5.2668, 'IPCC 2006', 2006, 'Colombia'),
('Madera Pino', 18.9690, 103923.9300, 30.00, 4.00, 21.3772, 'IPCC 2006', 2006, 'Colombia'),
('Madera Acacia', 18.9690, 103923.9300, 30.00, 4.00, 21.3772, 'IPCC 2006', 2006, 'Colombia'),
('Madera Melina', 18.9690, 103923.9300, 30.00, 4.00, 21.3772, 'IPCC 2006', 2006, 'Colombia'),

-- Residuos
('Residuos de llantas', 37.9210, 77577.4880, 30.00, 0.10, 1124.9715, 'IPCC 2006', 2006, 'Global')

ON CONFLICT (nombre) DO UPDATE SET
    poder_calorifico = EXCLUDED.poder_calorifico,
    factor_co2 = EXCLUDED.factor_co2,
    factor_ch4 = EXCLUDED.factor_ch4,
    factor_n2o = EXCLUDED.factor_n2o,
    factor_so2 = EXCLUDED.factor_so2,
    actualizado_en = CURRENT_TIMESTAMP;

-- ============================================================================
-- PASO 4: INSERTAR DATOS - COMBUSTIBLES LÍQUIDOS
-- ============================================================================

INSERT INTO catalogo_combustibles_liquidos (
    nombre, densidad, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2,
    fuente, año_publicacion, pais_aplicable
) VALUES
('Kerosene', 0.803, 42.8168, 73399.639, 3, 0.6, 42.0002, 'UPME Colombia', 2025, 'Colombia'),
('Combustoleo', 0.97, 39.3469, 80460.272, 3, 0.6, 1269.5595, 'UPME Colombia', 2025, 'Colombia'),
('Crudo de Castilla', 0.9414, 40.6705, 77841.778, 3, 0.6, 1080.8539, 'UPME Colombia', 2025, 'Colombia'),
('ACPM o Diesel', 0.845, 42.6, 74035.554, 3, 0.6, 280.5, 'UPME Colombia', 2025, 'Colombia'),
('Gasolina de motor', 0.7395, 43.0, 71478.9855, 3, 0.6, 28.0013, 'UPME Colombia', 2025, 'Colombia'),
('Fuel Oil No. 2', 0.8699, 39.7, 78081.0132, 3, 0.6, 316.8, 'UPME Colombia', 2025, 'Colombia'),
('Fuel Oil No. 6', 0.9659, 39.8, 80071.9988, 3, 0.6, 1021.2, 'UPME Colombia', 2025, 'Colombia'),
('Bioetanol (anhydrous)', 0.789, 26.7, 70781.4, 3, 0.6, 0, 'IPCC 2006', 2006, 'Global'),
('Biodiesel', 0.88, 37.2, 70781.4, 3, 0.6, 0, 'IPCC 2006', 2006, 'Global'),
('Nafta', 0.725, 44.3, 73338.6, 3, 0.6, 0, 'IPCC 2006', 2006, 'Global'),
('GLP (Gas licuado del petróleo)', 0.54, 47.3, 63066.6, 3, 0.1, 0, 'IPCC 2006', 2006, 'Global'),
('Jet Kerosene (Combustible para aviones)', 0.796, 44.1, 71476.8, 3, 0.6, 0, 'UPME Colombia', 2025, 'Colombia'),
('Etano', 0.36, 46.4, 61595.4, 3, 0.1, 0, 'IPCC 2006', 2006, 'Global')

ON CONFLICT (nombre) DO UPDATE SET
    densidad = EXCLUDED.densidad,
    poder_calorifico = EXCLUDED.poder_calorifico,
    factor_co2 = EXCLUDED.factor_co2,
    factor_ch4 = EXCLUDED.factor_ch4,
    factor_n2o = EXCLUDED.factor_n2o,
    factor_so2 = EXCLUDED.factor_so2,
    actualizado_en = CURRENT_TIMESTAMP;

-- ============================================================================
-- PASO 5: INSERTAR DATOS - COMBUSTIBLES GASEOSOS
-- ============================================================================

INSERT INTO catalogo_combustibles_gaseosos (
    nombre, poder_calorifico, factor_co2, factor_ch4, factor_n2o,
    fuente, año_publicacion, pais_aplicable
) VALUES
('Biogas Genérico', 22.0001, 84364.4183, 1, 0.1, 'IPCC 2006', 2006, 'Global'),
('Coke Gas Genérico', 15.0252, 40784.0416, 1, 0.1, 'IPCC 2006', 2006, 'Global'),
('Gas Natural Cusiana', 38.6735, 56647.7825, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Natural Guajira', 33.4943, 54911.3424, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Natural Guepaje', 33.2687, 54689.5797, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Natural Neiva - Huila', 37.259, 54618.0888, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Opon Payoa', 35.4292, 55801.0446, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Cupiagua', 37.935, 56980.0106, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas La Creciente', 13.5056, 54667.7823, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas Natural Genérico', 35.6522, 55539.0869, 1, 0.1, 'UPME Colombia', 2025, 'Colombia'),
('Gas de Pozo Cupiagua', 40.5725, 56225.4566, 1, 0.1, 'UPME Colombia', 2025, 'Colombia')

ON CONFLICT (nombre) DO UPDATE SET
    poder_calorifico = EXCLUDED.poder_calorifico,
    factor_co2 = EXCLUDED.factor_co2,
    factor_ch4 = EXCLUDED.factor_ch4,
    factor_n2o = EXCLUDED.factor_n2o,
    actualizado_en = CURRENT_TIMESTAMP;

-- ============================================================================
-- PASO 6: INSERTAR DATOS - FACTORES DE ELECTRICIDAD
-- ============================================================================

INSERT INTO factores_electricidad_pais (
    pais, año, factor_emision, fuente
) VALUES
('Colombia', 2020, 0.259, 'UPME - Factor de emisión SIN Colombia'),
('Colombia', 2021, 0.216, 'UPME - Factor de emisión SIN Colombia'),
('Colombia', 2022, 0.252, 'UPME - Factor de emisión SIN Colombia'),
('Colombia', 2023, 0.184, 'UPME - Factor de emisión SIN Colombia'),
('Colombia', 2024, 0.164, 'UPME - Factor de emisión SIN Colombia')

ON CONFLICT (pais, año) DO UPDATE SET
    factor_emision = EXCLUDED.factor_emision,
    fuente = EXCLUDED.fuente,
    actualizado_en = CURRENT_TIMESTAMP;

-- ============================================================================
-- PASO 7: VERIFICAR DATOS INSERTADOS
-- ============================================================================

SELECT '✅ Datos insertados correctamente' AS status;

SELECT 
    'catalogo_combustibles_solidos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_solidos 
WHERE activo = true;

SELECT 
    'catalogo_combustibles_liquidos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_liquidos 
WHERE activo = true;

SELECT 
    'catalogo_combustibles_gaseosos' AS tabla,
    COUNT(*) AS registros_activos
FROM catalogo_combustibles_gaseosos 
WHERE activo = true;

SELECT 
    'factores_electricidad_pais' AS tabla,
    COUNT(*) AS registros_activos
FROM factores_electricidad_pais 
WHERE activo = true;

-- ============================================================================
-- FINALIZADO
-- ============================================================================

SELECT '✅ SCRIPT COMPLETADO - Revisa los conteos arriba' AS resultado;

\echo '';
\echo '⚠️  IMPORTANTE: Los factores de vuelos NO están incluidos aquí.';
\echo '    Para agregar factores de vuelos, ejecuta:';
\echo '    \\i c:/Proyectos/Qexal_React_v2.3.0/database/add_flight_factors_table.sql';
\echo '';
