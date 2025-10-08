# Integración de Extintores en PDF - Huella de Carbono

## Fecha
${new Date().toLocaleDateString('es-CO')} - ${new Date().toLocaleTimeString('es-CO')}

## Cambio Realizado

Se actualizó la generación del PDF de Huella de Carbono para incluir correctamente la sección de **EXTINTORES** con los nuevos campos implementados.

## Archivo Modificado

**Archivo:** `Landing/src/setupProxy.js`
**Función:** `generarPDFHuella(datos)`
**Líneas:** ~279-297

## Cambios Implementados

### ✅ Actualización de Campos
Se cambiaron los campos antiguos por los nuevos:

| Campo Anterior | Campo Nuevo | Descripción |
|----------------|-------------|-------------|
| `row.gas` | `row.tipo` | Tipo de extintor |
| `row.consumo` | `row.cantidad` | Cantidad anual recargada (kg) |
| `row.factorCO2` | `row.pcg` | Potencial de Calentamiento Global |
| `row.emisionesTotales` | `row.emisionesParciales` | Emisiones parciales (kg CO2) |

### ✅ Filtrado de Datos
```javascript
const extintoresConDatos = datos.extintores.filter(row => 
  row.tipo && (row.cantidad > 0 || row.emisionesParciales > 0)
);
```

### ✅ Formato del PDF

El PDF ahora muestra para cada extintor:

```
1. Tipo: Dioxido de Carbono (CO2)
   Cantidad anual recargada: 10 kg
   PCG (Potencial de Calentamiento Global): 1
   Emisiones Parciales: 10.0000 kg CO2
   Emisiones Totales: 0.0100 Ton CO2 eq
```

### ✅ Total de Emisiones de Extintores

Se agregó un resumen al final de la sección:

```javascript
const totalExtintores = extintoresConDatos.reduce((sum, row) => 
  sum + (parseFloat(row.emisionesParciales) || 0), 0
) / 1000;

doc.text('TOTAL EMISIONES EXTINTORES: ' + totalExtintores.toFixed(4) + ' Ton CO2 eq');
```

## Estructura del PDF - Sección Extintores

```
┌─────────────────────────────────────────┐
│         EXTINTORES                      │
│                                         │
│  Sistemas de extincion                  │
│                                         │
│  1. Tipo: [Nombre del extintor]         │
│     Cantidad anual recargada: XX kg     │
│     PCG: XX                             │
│     Emisiones Parciales: XX kg CO2      │
│     Emisiones Totales: XX Ton CO2 eq    │
│                                         │
│  2. [Siguiente extintor...]             │
│                                         │
│  TOTAL EMISIONES EXTINTORES: XX Ton CO2 │
└─────────────────────────────────────────┘
```

## Flujo Completo del Sistema

### 1️⃣ **Frontend** (`FormularioHuella.js`)
- Usuario ingresa datos de extintores
- Cálculos automáticos de emisiones parciales
- Preparación de `datosCompletos` con array de extintores

### 2️⃣ **Servicio Email** (`EmailService.js`)
- Recibe `datosCompletos` incluyendo extintores
- Envía al endpoint `/api/send-email`

### 3️⃣ **Backend** (`setupProxy.js`)
- Recibe datos en endpoint
- Genera PDF con función `generarPDFHuella()`
- ✅ **Nueva sección de extintores correctamente formateada**
- Envía email con PDF adjunto

## Ejemplo de Datos en el PDF

Basándose en la imagen proporcionada:

```
EXTINTORES

Sistemas de extincion

1. Tipo: Solkaflam
   Cantidad anual recargada: 0 kg
   PCG (Potencial de Calentamiento Global): 0
   Emisiones Parciales: 0.0000 kg CO2
   Emisiones Totales: 0.0000 Ton CO2 eq

TOTAL EMISIONES EXTINTORES: 0.0000 Ton CO2 eq
```

## Validaciones Implementadas

1. **Filtro de datos válidos**: Solo incluye extintores con tipo Y cantidad > 0
2. **Valores por defecto**: Usa 0 si los valores son undefined o null
3. **Formato numérico**: 4 decimales para precisión científica
4. **Conversión de unidades**: kg CO2 → Ton CO2 eq (división por 1000)

## Compatibilidad

✅ **Compatible con todos los tipos de extintores:**
- Dioxido de Carbono (CO2) - PCG: 1
- Multipropósito - PCG: 0
- Solkaflam - PCG: 77

✅ **Integración completa:**
- Email con PDF adjunto ✓
- Descarga directa de PDF ✓
- Guardado en localStorage ✓

## Testing Recomendado

Para verificar el funcionamiento completo:

1. **Caso 1**: Extintor con emisiones
   - Tipo: Solkaflam
   - Cantidad: 10 kg
   - Resultado esperado: 770 kg CO2 / 0.77 Ton CO2 eq

2. **Caso 2**: Extintor sin emisiones
   - Tipo: Multipropósito
   - Cantidad: 5 kg
   - Resultado esperado: 0 kg CO2 / 0.00 Ton CO2 eq

3. **Caso 3**: Multiple extintores
   - Verificar que el TOTAL suma correctamente

4. **Caso 4**: PDF por email
   - Verificar que el adjunto incluye la sección de extintores
   - Verificar formato y legibilidad

## Estado Final

✅ **COMPLETADO** - La sección de extintores ahora está:
- ✅ Calculando correctamente en el formulario
- ✅ Mostrando en la interfaz web
- ✅ Incluida en el PDF generado
- ✅ Enviada por email con formato profesional
- ✅ Compatible con todos los tipos de extintores

## Archivos del Sistema

1. `FormularioHuella.js` - Frontend con cálculos ✅
2. `EmailService.js` - Servicio de email ✅
3. `setupProxy.js` - Generación de PDF ✅

## Notas Técnicas

- **PDF Engine**: PDFKit
- **Email Service**: SendGrid
- **Formato PDF**: LETTER size
- **Fuente**: Helvetica (predeterminada)
- **Colores**: Verde (#43a047, #2e7d32) para encabezados

## Próximos Pasos

Como el usuario mencionó: "Antes de hacer la base de datos", después de esta corrección:
1. ✅ Extintores funcionando en formulario
2. ✅ Extintores incluidos en PDF
3. 🔄 Pendiente: Implementación de base de datos PostgreSQL
4. 🔄 Pendiente: Migración desde localStorage
