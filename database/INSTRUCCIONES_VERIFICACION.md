# 🔍 VERIFICACIÓN DE GUARDADO DE HUELLA DE CARBONO

## Scripts de Verificación Disponibles

### 1. Verificación Completa
**Archivo:** `verificar_guardado_completo.sql`
**Descripción:** Script completo que verifica todas las tablas y relaciones

```bash
psql -h localhost -U postgres -d mundo_verde_dev -f database/verificar_guardado_completo.sql
```

### 2. Verificación Rápida
**Archivo:** `verificar_rapido.sql`
**Descripción:** Script rápido para verificar el último cálculo guardado

```bash
psql -h localhost -U postgres -d mundo_verde_dev -f database/verificar_rapido.sql
```

## Tablas que DEBEN ser Afectadas

Cuando guardas un cálculo de huella de carbono, estas tablas DEBEN tener datos:

### ✅ TABLA PRINCIPAL
- **`calculos_huella_carbono`** - Información principal del cálculo

### ✅ TABLAS DE COMBUSTIBLES  
- **`combustibles_solidos`** - Si hay combustibles sólidos en el formulario
- **`combustibles_liquidos`** - Si hay combustibles líquidos (estacionarios y móviles)
- **`combustibles_gaseosos`** - Si hay combustibles gaseosos (estacionarios y móviles)

### ✅ TABLAS DE CONSUMO
- **`consumo_electricidad`** - Si hay datos de consumo eléctrico mensual
- **`vuelos_aereos`** - Si hay vuelos corporativos registrados
- **`extintores`** - Si hay recargas de extintores

## Verificación Manual Rápida

```sql
-- Ver el último cálculo
SELECT * FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1;

-- Ver si tiene datos detallados (reemplaza ID con el ID del cálculo)
SELECT 
    (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = [ID]) as solidos,
    (SELECT COUNT(*) FROM combustibles_liquidos WHERE calculo_id = [ID]) as liquidos,
    (SELECT COUNT(*) FROM combustibles_gaseosos WHERE calculo_id = [ID]) as gaseosos,
    (SELECT COUNT(*) FROM consumo_electricidad WHERE calculo_id = [ID]) as electricidad,
    (SELECT COUNT(*) FROM vuelos_aereos WHERE calculo_id = [ID]) as vuelos,
    (SELECT COUNT(*) FROM extintores WHERE calculo_id = [ID]) as extintores;
```

## Indicadores de Problemas

### ❌ PROBLEMAS CRÍTICOS
- Cálculo en `calculos_huella_carbono` pero SIN datos en tablas detalladas
- Emisiones totales = 0 cuando debería haber datos
- Registros "huérfanos" en tablas detalladas sin relación con cálculo principal

### ⚠️ ADVERTENCIAS
- Suma de alcances no coincide con emisiones_totales
- Datos faltantes en campos obligatorios
- Factores de emisión = 0

## Conectar a la Base de Datos

```bash
# Conectar a PostgreSQL
psql -h localhost -U postgres -d mundo_verde_dev

# O si tienes configurada la conexión con variables de entorno
psql $DATABASE_URL
```

## Ejemplo de Resultado Esperado

Después de guardar un cálculo, deberías ver algo como:

```
ÚLTIMO CÁLCULO GUARDADO
----------------------
HC-2025-000001 | Empresa XYZ | 2025-10-06 | 45.67

DETALLES DEL ÚLTIMO CÁLCULO
---------------------------
Combustibles Sólidos: 3
Combustibles Líquidos: 5  
Combustibles Gaseosos: 2
Consumo Eléctrico: 1
Vuelos Aéreos: 8
Extintores: 2
```

Si alguna categoría tiene 0 registros pero enviaste datos del formulario, hay un problema en el guardado.