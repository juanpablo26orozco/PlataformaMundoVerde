-- ============================================================================
-- VERIFICAR DATOS DE FACTORES DE EMISIÓN
-- ============================================================================

-- 1. Contar total de factores activos
SELECT COUNT(*) as total_factores_activos
FROM factores_emision
WHERE activo = true;

-- 2. Ver categorías disponibles
SELECT categoria, COUNT(*) as cantidad
FROM factores_emision
WHERE activo = true
GROUP BY categoria
ORDER BY categoria;

-- 3. Ver todos los factores de combustibles
SELECT 
  tipo_combustible,
  factor_emision,
  unidad,
  fuente,
  ano_referencia
FROM factores_emision
WHERE categoria = 'combustibles'
  AND activo = true
ORDER BY tipo_combustible;

-- 4. Ver todos los factores de electricidad
SELECT 
  tipo_combustible,
  factor_emision,
  unidad,
  fuente,
  ano_referencia
FROM factores_emision
WHERE categoria = 'electricidad'
  AND activo = true
ORDER BY tipo_combustible;

-- 5. Verificar si hay factores esenciales
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM factores_emision 
      WHERE categoria = 'combustibles' AND tipo_combustible = 'gasolina' AND activo = true
    ) THEN '✅ Gasolina existe'
    ELSE '❌ Falta gasolina'
  END as gasolina,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM factores_emision 
      WHERE categoria = 'combustibles' AND tipo_combustible = 'diesel' AND activo = true
    ) THEN '✅ Diesel existe'
    ELSE '❌ Falta diesel'
  END as diesel,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM factores_emision 
      WHERE categoria = 'electricidad' AND tipo_combustible = 'red_nacional' AND activo = true
    ) THEN '✅ Electricidad existe'
    ELSE '❌ Falta electricidad'
  END as electricidad;

-- 6. Ver estructura completa (igual a lo que devuelve la API)
SELECT 
  categoria,
  tipo_combustible,
  factor_emision,
  unidad,
  fuente,
  ano_referencia,
  alcance
FROM factores_emision
WHERE activo = true
ORDER BY categoria, tipo_combustible;

-- ============================================================================
-- EJEMPLOS DE INSERCIÓN (SI NO HAY DATOS)
-- ============================================================================

-- Insertar factores básicos de combustibles (Colombia - IPCC 2023)
INSERT INTO factores_emision (categoria, tipo_combustible, factor_emision, unidad, fuente, ano_referencia, alcance, activo)
VALUES
  ('combustibles', 'gasolina', 2.31, 'kg CO2e/litro', 'IPCC', 2023, 1, true),
  ('combustibles', 'diesel', 2.68, 'kg CO2e/litro', 'IPCC', 2023, 1, true),
  ('combustibles', 'gas_natural', 1.93, 'kg CO2e/m3', 'IPCC', 2023, 1, true),
  ('combustibles', 'gnv', 1.93, 'kg CO2e/m3', 'IPCC', 2023, 1, true),
  ('electricidad', 'red_nacional', 0.164, 'kg CO2e/kWh', 'UPME', 2023, 2, true),
  ('transporte', 'taxi', 0.21, 'kg CO2e/km', 'FECOC', 2023, 3, true),
  ('transporte', 'bus', 0.11, 'kg CO2e/km', 'FECOC', 2023, 3, true),
  ('transporte', 'avion_nacional', 0.26, 'kg CO2e/km', 'IDEAM', 2023, 3, true),
  ('transporte', 'avion_internacional', 0.18, 'kg CO2e/km', 'IDEAM', 2023, 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TESTING
-- ============================================================================

-- Simular la consulta que hace el endpoint GET /api/factores/todos
SELECT 
  categoria, 
  tipo_combustible, 
  factor_emision, 
  unidad, 
  fuente, 
  ano_referencia, 
  alcance
FROM factores_emision
WHERE activo = true
ORDER BY categoria, tipo_combustible;
