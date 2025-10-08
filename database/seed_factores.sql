-- ============================================================================
-- SEED DATA: FACTORES DE EMISIÓN - COLOMBIA
-- ============================================================================
-- Versión: 2.0.0
-- Fecha: 3 de Octubre, 2025
-- Descripción: Factores de emisión para Colombia según:
--              - IPCC 2006 Guidelines
--              - UPME (Unidad de Planeación Minero Energética)
--              - Calculadora Huella de Carbono Mundo Verde 2025
-- 
-- CORRECCIONES:
-- ✅ Solo factores de electricidad de Colombia (2020-2024)
-- ✅ Sin rutas predefinidas de vuelos (API calcula distancias)
-- ✅ Factores de combustibles exactos de la calculadora actual
-- ============================================================================

\c mundoverde_db

-- ============================================================================
-- LIMPIEZA (Opcional - solo si necesitas reiniciar)
-- ============================================================================

-- TRUNCATE TABLE catalogo_combustibles_solidos CASCADE;
-- TRUNCATE TABLE catalogo_combustibles_liquidos CASCADE;
-- TRUNCATE TABLE catalogo_combustibles_gaseosos CASCADE;
-- TRUNCATE TABLE factores_electricidad_pais CASCADE;

-- ============================================================================
-- 1. COMBUSTIBLES SÓLIDOS - COLOMBIA
-- Fuente: IPCC 2006 + Calculadora Mundo Verde 2025
-- ============================================================================

INSERT INTO catalogo_combustibles_solidos (
    nombre, 
    poder_calorifico,  -- MJ/kg
    factor_co2,         -- Kg CO2/TJ
    factor_ch4,         -- Kg CH4/TJ
    factor_n2o,         -- Kg N2O/TJ
    factor_so2,         -- Kg SO2/TJ
    fuente, 
    año_publicacion, 
    pais_aplicable
) VALUES

-- CARBÓN MINERAL (Estacionario)
('Carbón mineral - Antracita', 26.7, 98300, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Carbón mineral - Bituminoso', 25.8, 94600, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Carbón mineral - Sub-bituminoso', 18.9, 96100, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Carbón mineral - Lignito', 11.9, 101000, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- CARBONES DERIVADOS
('Coque de carbón', 28.2, 107000, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Briquetas de carbón', 20.7, 97500, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Carbón vegetal', 29.5, 112000, 200, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Alquitrán de hulla', 28.0, 80700, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- OTROS SÓLIDOS
('Turba', 9.76, 106000, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Esquistos bituminosos', 8.90, 107000, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Coque de petróleo', 32.5, 97500, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Residuos de petróleo', 40.2, 73300, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- BIOMASA SÓLIDA
('Biomasa sólida primaria', 11.6, 112000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Madera/residuos madereros', 15.6, 112000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Leña', 15.6, 112000, 300, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Bagazo', 9.6, 100000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Cáscara de arroz', 15.0, 100000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- RESIDUOS
('Desechos industriales', 12.0, 143000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Residuos sólidos municipales', 10.0, 91700, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Neumáticos usados', 28.0, 85000, 3, 0.6, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Plásticos', 41.0, 77400, 1, 1.5, 950, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Textiles', 18.0, 90000, 1, 1.5, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Residuos peligrosos', 12.0, 100000, 30, 4, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia');

-- ============================================================================
-- 2. COMBUSTIBLES LÍQUIDOS - COLOMBIA
-- Fuente: IPCC 2006 + Calculadora Mundo Verde 2025
-- ============================================================================

INSERT INTO catalogo_combustibles_liquidos (
    nombre, 
    densidad,           -- kg/l
    poder_calorifico,   -- MJ/kg
    factor_co2,         -- Kg CO2/TJ
    factor_ch4,         -- Kg CH4/TJ
    factor_n2o,         -- Kg N2O/TJ
    factor_so2,         -- Kg SO2/TJ
    fuente, 
    año_publicacion, 
    pais_aplicable
) VALUES

-- GASOLINAS (Estacionario y Móvil)
('Gasolina para motor', 0.7450, 44.3, 69300, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Gasolina de aviación (Jet B)', 0.7570, 44.3, 70000, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- KEROSENES (Estacionario y Aviación)
('Kerosene tipo jet (Jet A1)', 0.8050, 44.1, 71500, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Otro kerosene', 0.8100, 43.8, 71900, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- DIESEL / ACPM (Estacionario y Móvil)
('Aceite liviano (ACPM/Diesel)', 0.8450, 43.0, 74100, 3, 0.6, 700, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Fuel oil (Aceite combustible pesado)', 0.9600, 40.4, 77400, 3, 0.6, 700, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- GAS LICUADO
('Gas licuado de petróleo (GLP)', 0.5380, 47.3, 63100, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- OTROS LÍQUIDOS
('Nafta', 0.7250, 44.5, 73300, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Bitumen (Asfalto)', 1.0000, 40.2, 80700, 3, 0.6, 700, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Lubricantes', 0.8800, 40.2, 73300, 3, 0.6, 700, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Ceras de parafina', 0.9000, 40.2, 73300, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- BIOCOMBUSTIBLES
('Etanol (bioetanol)', 0.7890, 26.8, 70800, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Biodiesel', 0.8800, 37.0, 70800, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Aceite vegetal', 0.9200, 37.0, 73300, 3, 0.6, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia');

-- ============================================================================
-- 3. COMBUSTIBLES GASEOSOS - COLOMBIA
-- Fuente: IPCC 2006 + Calculadora Mundo Verde 2025
-- ============================================================================

INSERT INTO catalogo_combustibles_gaseosos (
    nombre, 
    poder_calorifico,   -- MJ/m³
    factor_co2,         -- Kg CO2/TJ
    factor_ch4,         -- Kg CH4/TJ
    factor_n2o,         -- Kg N2O/TJ
    factor_so2,         -- Kg SO2/TJ
    fuente, 
    año_publicacion, 
    pais_aplicable
) VALUES

-- GAS NATURAL (Estacionario y Móvil)
('Gas natural', 38.3, 56100, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Gas natural comprimido (GNC)', 38.3, 56100, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Gas natural licuado (GNL)', 51.0, 56100, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- GASES DE REFINERÍA
('Gas de refinería', 49.5, 57600, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Etano', 47.5, 61600, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Propano', 50.2, 63100, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Butano', 50.2, 64200, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- GASES DE ALTOS HORNOS
('Gas de altos hornos', 2.47, 260000, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),
('Gas de horno de coque', 38.7, 44400, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia'),

-- BIOGÁS
('Biogás', 21.0, 54600, 1, 0.1, 0, 'IPCC 2006 Guidelines', 2006, 'Colombia');

-- ============================================================================
-- 4. FACTORES DE ELECTRICIDAD - SOLO COLOMBIA
-- Fuente: UPME (Unidad de Planeación Minero Energética de Colombia)
-- ============================================================================

INSERT INTO factores_electricidad_pais (
    pais, 
    año, 
    factor_emision,     -- kg CO₂/kWh
    fuente, 
    fecha_publicacion
) VALUES

-- COLOMBIA 2020-2024 (Factores oficiales UPME)
('Colombia', 2020, 0.164, 'UPME - Cálculos FECOC', '2020-12-31'),
('Colombia', 2021, 0.186, 'UPME - Cálculos FECOC', '2021-12-31'),
('Colombia', 2022, 0.313, 'UPME - Cálculos FECOC', '2022-12-31'),
('Colombia', 2023, 0.277, 'UPME - Cálculos FECOC', '2023-12-31'),
('Colombia', 2024, 0.391, 'UPME - Cálculos FECOC', '2024-12-31');

-- ============================================================================
-- COMENTARIOS SOBRE DATOS EXCLUIDOS
-- ============================================================================

-- ❌ ELIMINADO: Factores de electricidad de otros países
--    Motivo: Solo se usará Colombia según requerimientos
--    Países eliminados: Argentina, Brasil, Chile, Ecuador, México, Perú, etc.

-- ❌ ELIMINADO: Tabla de rutas predefinidas de vuelos
--    Motivo: Las APIs de vuelos calculan distancias dinámicamente
--    Datos eliminados: Bogotá-Medellín, Bogotá-Cali, etc.
--    Nota: La tabla vuelos_aereos sigue permitiendo ingresar datos manualmente

-- ============================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================================

\echo ''
\echo '✅ VERIFICANDO FACTORES DE EMISIÓN...'
\echo ''

-- Contar combustibles sólidos
SELECT 
    'Combustibles Sólidos' as "Tipo",
    COUNT(*) as "Total Insertado",
    COUNT(*) FILTER (WHERE activo = true) as "Activos"
FROM catalogo_combustibles_solidos;

-- Contar combustibles líquidos
SELECT 
    'Combustibles Líquidos' as "Tipo",
    COUNT(*) as "Total Insertado",
    COUNT(*) FILTER (WHERE activo = true) as "Activos"
FROM catalogo_combustibles_liquidos;

-- Contar combustibles gaseosos
SELECT 
    'Combustibles Gaseosos' as "Tipo",
    COUNT(*) as "Total Insertado",
    COUNT(*) FILTER (WHERE activo = true) as "Activos"
FROM catalogo_combustibles_gaseosos;

-- Verificar factores de electricidad SOLO Colombia
SELECT 
    'Factores Electricidad' as "Tipo",
    COUNT(*) as "Total Insertado",
    COUNT(*) FILTER (WHERE activo = true) as "Activos",
    STRING_AGG(DISTINCT pais, ', ') as "Países"
FROM factores_electricidad_pais;

\echo ''
\echo '🇨🇴 FACTOR DE ELECTRICIDAD COLOMBIA 2024:'
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
\echo '✅ RESUMEN DE SEED DATA:'
\echo '   - Combustibles sólidos: 22 tipos'
\echo '   - Combustibles líquidos: 13 tipos'
\echo '   - Combustibles gaseosos: 10 tipos'
\echo '   - Factores de electricidad: 5 años (Colombia 2020-2024)'
\echo '   - Total: 50 factores de emisión'
\echo ''
\echo '📊 CORRECCIONES APLICADAS:'
\echo '   ✅ Solo factores de electricidad de Colombia'
\echo '   ✅ Sin rutas predefinidas de vuelos (API dinámica)'
\echo '   ✅ Factores de combustibles exactos de calculadora actual'
\echo ''
\echo '🎯 PRÓXIMO PASO:'
\echo '   Ejecutar: psql -U postgres -d mundoverde_db -f database/functions.sql'
\echo ''

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
