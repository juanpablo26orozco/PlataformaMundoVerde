# 📋 CORRECCIONES APLICADAS - FACTORES DE EMISIÓN

## Fecha: 3 de Octubre, 2025
## Versión: 2.0.0

---

## ✅ CAMBIOS REALIZADOS

### 1. **Factores de Electricidad - Solo Colombia** 🇨🇴

**❌ ANTES (17 países)**:
```sql
-- Tenía factores de 17 países:
-- Argentina, Bolivia, Brasil, Chile, Colombia, Costa Rica, 
-- Ecuador, Guatemala, Honduras, México, Nicaragua, Panamá, 
-- Paraguay, Perú, Uruguay, España, Estados Unidos
```

**✅ AHORA (Solo Colombia)**:
```sql
-- Solo factores de Colombia 2020-2024 (UPME oficial):
('Colombia', 2020, 0.164 kg CO₂/kWh)
('Colombia', 2021, 0.186 kg CO₂/kWh)
('Colombia', 2022, 0.313 kg CO₂/kWh)
('Colombia', 2023, 0.277 kg CO₂/kWh)
('Colombia', 2024, 0.391 kg CO₂/kWh) ← Factor actual
```

**Razón**: La aplicación solo necesita factores de Colombia.

---

### 2. **Vuelos Aéreos - Sin Rutas Predefinidas** ✈️

**❌ ANTES**:
```sql
-- Tenía tabla de rutas predefinidas:
INSERT INTO rutas_vuelos (
    origen, destino, 
    distancia_km, factor_emision
) VALUES
    ('Bogotá', 'Medellín', 240, 0.115),
    ('Bogotá', 'Cali', 325, 0.115),
    ('Bogotá', 'Barranquilla', 657, 0.115),
    -- 50+ rutas predefinidas...
);
```

**✅ AHORA**:
```sql
-- ❌ TABLA ELIMINADA
-- Las APIs de vuelos calculan distancias dinámicamente
-- La tabla vuelos_aereos permite ingreso manual de datos:
--   - ciudad_origen
--   - ciudad_destino
--   - distancia_km (calculada por API)
--   - numero_pasajeros
--   - factor_emision
```

**Razón**: Las APIs ya calculan el kilometraje entre ciudades. No necesitamos rutas predefinidas.

---

### 3. **Factores de Combustibles - Exactos de la Aplicación Actual** 🔥

**✅ VERIFICADO**:
```sql
-- Se mantienen los factores de IPCC 2006 que está usando la app:

SÓLIDOS (22 tipos):
- Carbón mineral (4 tipos)
- Carbones derivados (4 tipos)
- Biomasa sólida (5 tipos)
- Residuos (6 tipos)
- Otros (3 tipos)

LÍQUIDOS (13 tipos):
- Gasolinas (2 tipos)
- Kerosenes (2 tipos)
- Diesel/ACPM (2 tipos)
- GLP (1 tipo)
- Otros (3 tipos)
- Biocombustibles (3 tipos)

GASEOSOS (10 tipos):
- Gas natural (3 tipos)
- Gases de refinería (4 tipos)
- Gases de altos hornos (2 tipos)
- Biogás (1 tipo)
```

**Razón**: Se mantienen los factores exactos que está usando la calculadora actual de Mundo Verde 2025.

---

## 📊 RESUMEN DE DATOS

| Categoría | Antes | Ahora | Cambio |
|-----------|-------|-------|--------|
| **Combustibles Sólidos** | 25 | 22 | ✅ Ajustado |
| **Combustibles Líquidos** | 16 | 13 | ✅ Ajustado |
| **Combustibles Gaseosos** | 11 | 10 | ✅ Ajustado |
| **Factores Electricidad** | 17 países | 🇨🇴 Colombia | ✅ Corregido |
| **Rutas de Vuelos** | 50+ | 0 (API) | ✅ Eliminado |
| **Total Factores** | 66 | 50 | ✅ Optimizado |

---

## 🎯 VENTAJAS DE LAS CORRECCIONES

### 1. **Base de Datos Más Ligera**
- ✅ 16 factores menos de electricidad (países no usados)
- ✅ 50+ rutas de vuelos eliminadas
- ✅ Menor tamaño de BD
- ✅ Consultas más rápidas

### 2. **Mantenimiento Simplificado**
- ✅ Solo actualizar factores de Colombia
- ✅ No mantener rutas de vuelos desactualizadas
- ✅ APIs calculan distancias en tiempo real

### 3. **Datos Reales de la Aplicación**
- ✅ Factores exactos de la calculadora actual
- ✅ Compatibilidad 100% con frontend existente
- ✅ Sin cambios en lógica de cálculo

---

## 📝 ARCHIVOS MODIFICADOS

```
database/
└── seed_factores.sql ✅ ACTUALIZADO
    - Versión 2.0.0
    - Solo Colombia
    - Sin rutas de vuelos
    - 50 factores totales
```

---

## 🚀 INSTRUCCIONES DE USO

### Ejecutar el Script Corregido:

```powershell
# Conectar a PostgreSQL
psql -U postgres -d mundoverde_db

# Ejecutar seed actualizado
\i C:/Proyectos/Qexal_React_v2.3.0/database/seed_factores.sql
```

### Verificar Resultados:

```sql
-- Ver factores de electricidad (solo Colombia)
SELECT * FROM factores_electricidad_pais;

-- Ver combustibles disponibles
SELECT COUNT(*) FROM catalogo_combustibles_solidos;   -- 22
SELECT COUNT(*) FROM catalogo_combustibles_liquidos;  -- 13
SELECT COUNT(*) FROM catalogo_combustibles_gaseosos;  -- 10

-- Verificar factor Colombia 2024
SELECT * FROM factores_electricidad_pais 
WHERE pais = 'Colombia' AND año = 2024;
-- Resultado: 0.391 kg CO₂/kWh
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] **Electricidad**: Solo factores de Colombia (2020-2024)
- [x] **Vuelos**: Sin rutas predefinidas (API calcula)
- [x] **Combustibles**: Factores exactos de la app actual
- [x] **Total**: 50 factores (22+13+10+5)
- [x] **Documentación**: Actualizada
- [x] **Script**: Verificado y probado

---

## 📖 FUENTES DE DATOS

- **IPCC 2006 Guidelines**: Factores de combustibles
- **UPME Colombia 2024**: Factor de electricidad 0.391 kg CO₂/kWh
- **Calculadora Mundo Verde 2025**: Validación de factores existentes

---

## 🔄 PRÓXIMOS PASOS

1. ✅ Ejecutar `seed_factores.sql` (corregido)
2. ✅ Ejecutar `functions.sql` (triggers y cálculos)
3. ✅ Ejecutar `verificar.sql` (verificación completa)
4. ⏳ Integrar con frontend (mostrar código único)
5. ⏳ Actualizar PDFs (incluir código)

---

**Estado**: ✅ LISTO PARA USAR  
**Versión**: 2.0.0  
**Fecha**: 3 de Octubre, 2025
