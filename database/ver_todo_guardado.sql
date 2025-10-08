-- VERIFICACIÓN DIRECTA - VER TODO LO GUARDADO
-- Ejecuta esto en pgAdmin para ver TODOS los datos guardados

-- 1. TABLA PRINCIPAL - calculos_huella_carbono
SELECT 'CALCULOS_HUELLA_CARBONO' as tabla;
ELECT * FROM combustibles_solidos ORDER BY id DESC; 

-- 2. COMBUSTIBLES SÓLIDOS
SELECT 'COMBUSTIBLES_SOLIDOS' as tabla;
SELECT * FROM combustibles_solidos ORDER BY id DESC;

-- 3. COMBUSTIBLES LÍQUIDOS  
SELECT 'COMBUSTIBLES_LIQUIDOS' as tabla;
SELECT * FROM combustibles_liquidos ORDER BY id DESC;

-- 4. COMBUSTIBLES GASEOSOS
SELECT 'COMBUSTIBLES_GASEOSOS' as tabla;
SELECT * FROM combustibles_gaseosos ORDER BY id DESC;

-- 5. CONSUMO ELECTRICIDAD
SELECT 'CONSUMO_ELECTRICIDAD' as tabla;
SELECT * FROM consumo_electricidad ORDER BY id DESC;

-- 6. VUELOS AÉREOS
SELECT 'VUELOS_AEREOS' as tabla;
SELECT * FROM vuelos_aereos ORDER BY id DESC;

-- 7. EXTINTORES
SELECT 'EXTINTORES' as tabla;
SELECT * FROM extintores ORDER BY id DESC;

-- CONTEO RÁPIDO
SELECT 'CONTEO_TOTAL' as resumen;
SELECT 'calculos_huella_carbono' as tabla, COUNT(*) as total FROM calculos_huella_carbono
UNION ALL
SELECT 'combustibles_solidos' as tabla, COUNT(*) as total FROM combustibles_solidos
UNION ALL
SELECT 'combustibles_liquidos' as tabla, COUNT(*) as total FROM combustibles_liquidos
UNION ALL
SELECT 'combustibles_gaseosos' as tabla, COUNT(*) as total FROM combustibles_gaseosos
UNION ALL
SELECT 'consumo_electricidad' as tabla, COUNT(*) as total FROM consumo_electricidad
UNION ALL
SELECT 'vuelos_aereos' as tabla, COUNT(*) as total FROM vuelos_aereos
UNION ALL
SELECT 'extintores' as tabla, COUNT(*) as total FROM extintores;