# 🔍 VERIFICACIÓN PROFESIONAL DE HUELLA DE CARBONO

## 📋 Scripts Disponibles (En orden de importancia)

### 1. **`verificar_simple.sql`** ⭐ **RECOMENDADO PARA EMPEZAR**
- **Descripción:** Verificación rápida pero completa
- **Uso:** Copiar todo el contenido en pgAdmin y ejecutar
- **Tiempo:** 5 segundos
- **Qué muestra:** Estado general, conteos, último cálculo, validación de triggers

### 2. **`verificar_completo_profesional.sql`** 🎯 **ANÁLISIS EXHAUSTIVO**
- **Descripción:** Análisis completo usando todo el schema y triggers
- **Uso:** Para análisis profundo cuando hay problemas
- **Tiempo:** 10-15 segundos
- **Qué muestra:** Todo el diagnóstico con recomendaciones

### 3. **`verificar_estructura.sql`** 🔧 **VERIFICACIÓN TÉCNICA**
- **Descripción:** Verifica tablas, triggers y estructura
- **Uso:** Para problemas técnicos específicos

## 🚀 CÓMO EJECUTAR EN PGADMIN

### **OPCIÓN 1: Verificación Rápida (RECOMENDADA)**

1. Abrir pgAdmin
2. Conectar a tu base de datos `mundoverde_db` 
3. Abrir Query Tool
4. Copiar **TODO** el contenido de `verificar_simple.sql`
5. Ejecutar (botón ▶️ o F5)

### **OPCIÓN 2: Análisis Manual por Partes**

```sql
-- PASO 1: Verificar que tienes datos
SELECT COUNT(*) as total_calculos FROM calculos_huella_carbono;
-- Debe ser > 0

-- PASO 2: Ver último cálculo
SELECT codigo_seguimiento, nombre_empresa, emisiones_totales, fecha_creacion 
FROM calculos_huella_carbono 
ORDER BY fecha_creacion DESC LIMIT 1;

-- PASO 3: Verificar detalles (usar el ID del paso anterior)
SELECT 
    (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = [ID_AQUI]) as solidos,
    (SELECT COUNT(*) FROM combustibles_liquidos WHERE calculo_id = [ID_AQUI]) as liquidos,
    (SELECT COUNT(*) FROM consumo_electricidad WHERE calculo_id = [ID_AQUI]) as electricidad;
```

## ✅ INTERPRETACIÓN DE RESULTADOS

### **🎯 ESTADO IDEAL (Todo funcionando):**
```
CONTEO DE REGISTROS:
✅ calculos_huella_carbono: 1+ registros
✅ combustibles_solidos: 1+ registros  
✅ combustibles_liquidos: 1+ registros
✅ consumo_electricidad: 1+ registros

ÚLTIMO CÁLCULO:
✅ Tiene código de seguimiento (HC-2025-XXXXXX)
✅ emisiones_totales > 0
✅ Detalles en múltiples categorías

VERIFICACIÓN TRIGGER:
✅ CÁLCULO CORRECTO (suma manual = calculado automático)
```

### **⚠️ PROBLEMAS COMUNES:**

#### **Problema 1: Solo tabla principal con datos**
```
❌ calculos_huella_carbono: 1+ registros
⚠️ combustibles_solidos: 0 registros
⚠️ combustibles_liquidos: 0 registros
⚠️ consumo_electricidad: 0 registros
```
**DIAGNÓSTICO:** El backend NO está guardando detalles
**SOLUCIÓN:** Verificar `DatabaseService.js` y `setupProxy.js`

#### **Problema 2: Sin datos en ninguna tabla**
```
❌ calculos_huella_carbono: 0 registros
```
**DIAGNÓSTICO:** El frontend no está enviando datos o hay error en endpoint
**SOLUCIÓN:** Verificar formulario y endpoint `/api/huella-carbono/guardar`

#### **Problema 3: Error en triggers**
```
❌ ERROR EN TRIGGER (suma manual ≠ calculado automático)
```
**DIAGNÓSTICO:** Los triggers de cálculo automático no funcionan
**SOLUCIÓN:** Verificar triggers en la base de datos

## 🔧 SOLUCIÓN DE PROBLEMAS PASO A PASO

### **Si NO hay datos en ninguna tabla:**

1. **Verificar que el formulario envía datos:**
   - Abrir DevTools → Network
   - Llenar formulario y enviar
   - Verificar que se hace POST a `/api/huella-carbono/guardar`

2. **Verificar endpoint:**
   - Revisar que `setupProxy.js` tiene el endpoint actualizado
   - Verificar que usa `DatabaseService.guardarHuellaCarbono`

3. **Verificar base de datos:**
   - Revisar logs de PostgreSQL
   - Verificar conexión con `SELECT 1;`

### **Si hay datos solo en tabla principal:**

1. **Verificar DatabaseService.js:**
   - Confirmar que `guardarHuellaCarbono` tiene toda la implementación nueva
   - Verificar que todas las tablas se están poblando

2. **Verificar frontend:**
   - Confirmar que `FormularioHuella.js` envía estructura completa
   - Verificar que `datosCompletos` incluye todas las categorías

## 📊 COLUMNAS IMPORTANTES A VERIFICAR

### **En `calculos_huella_carbono`:**
- `emisiones_totales` (CALCULADO AUTOMÁTICAMENTE por trigger)
- `codigo_seguimiento` (Formato: HC-2025-XXXXXX)
- `emisiones_alcance_1, _2, _3` (deben sumar = emisiones_totales)

### **En tablas de detalles:**
- `calculo_id` (debe coincidir con ID de tabla principal)
- `emisiones_totales` (debe ser > 0 si hay consumo)
- Campos específicos como `tipo_combustible`, `consumo_anual`, etc.

## 🎯 SCRIPTS ESPECÍFICOS POR PROBLEMA

### **Para verificar triggers:**
```sql
SELECT 
    table_name, 
    trigger_name, 
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY table_name;
```

### **Para verificar última transacción:**
```sql
SELECT 
    codigo_seguimiento,
    fecha_creacion,
    (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = chc.id) as detalles
FROM calculos_huella_carbono chc
ORDER BY fecha_creacion DESC LIMIT 1;
```

### **Para verificar factores de emisión:**
```sql
SELECT tipo_combustible, factor_co2, factor_ch4 
FROM combustibles_solidos 
WHERE calculo_id = (SELECT id FROM calculos_huella_carbono ORDER BY fecha_creacion DESC LIMIT 1);
```

## 📞 FLUJO DE VERIFICACIÓN RECOMENDADO

1. **Ejecutar `verificar_simple.sql`** → Obtener diagnóstico general
2. **Si hay problemas** → Ejecutar `verificar_completo_profesional.sql`
3. **Si sigue con problemas** → Revisar logs del backend y frontend
4. **Si todo OK** → Continuar con más pruebas del formulario

**¿Todo perfecto?** ✅ El sistema está funcionando correctamente
**¿Hay problemas?** ⚠️ Seguir las recomendaciones específicas del diagnóstico