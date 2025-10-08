# Corrección de Sección de Extintores - Huella de Carbono

## Fecha
${new Date().toLocaleDateString('es-CO')} - ${new Date().toLocaleTimeString('es-CO')}

## Problema Identificado
La sección de extintores (recargas de extintores) en el formulario de Huella de Carbono no estaba funcionando correctamente. Los factores de emisión no se auto-poblaban y las emisiones no se calculaban.

## Solución Implementada

### 1. Actualización de Factores de Emisión
**Archivo:** `Landing/src/component/HuellaCarbono/FormularioHuella.js`

Se actualizó el objeto `FACTORES_EXTINTORES` con los valores correctos de PCG (Potencial de Calentamiento Global):

```javascript
const FACTORES_EXTINTORES = [
  { tipo: "Dioxido de Carbono (CO2)", pcg: 1 },
  { tipo: "Multipropósito", pcg: 0 },
  { tipo: "Solkaflam", pcg: 77 }
];
```

**Fuente de datos:** Documento "5. Documento factores de Emisión.pdf"

### 2. Corrección de la Función handleExtintorChange

Se modificó la función `handleExtintorChange` para que funcione como las demás secciones del formulario:

**Funcionalidad implementada:**
- ✅ Auto-población del PCG cuando se selecciona el tipo de extintor
- ✅ Cálculo automático de emisiones parciales: `Cantidad × PCG`
- ✅ Actualización en tiempo real de los valores calculados

```javascript
const handleExtintorChange = (idx, field, value) => {
  let newRows = [...extintores];
  
  if (field === "tipo") {
    // Cuando se selecciona un tipo, auto-rellenar el PCG
    const found = FACTORES_EXTINTORES.find(f => f.tipo === value);
    if (found) {
      newRows[idx] = {
        ...newRows[idx],
        tipo: value,
        pcg: found.pcg
      };
    } else {
      newRows[idx] = {
        ...newRows[idx],
        tipo: value,
        pcg: ""
      };
    }
  } else {
    newRows[idx][field] = value;
  }
  
  // Calcular emisiones parciales: Cantidad × PCG
  const row = newRows[idx];
  const cantidad = parseFloat(row.cantidad) || 0;
  const pcg = parseFloat(row.pcg) || 0;
  const emisionesParciales = cantidad * pcg;
  
  newRows[idx].emisionesParciales = emisionesParciales > 0 ? emisionesParciales : "";
  
  setExtintores(newRows);
};
```

### 3. Interfaz de Usuario

La tabla ya estaba correctamente estructurada con las siguientes columnas:

| No. | Tipo de extintor | Cantidad anual recargada (Kg) | PCG ó GWP | Emisiones Parciales (kg CO2) |
|-----|------------------|-------------------------------|-----------|------------------------------|
| 1   | Dropdown         | Input numérico                | Auto      | Calculado automáticamente    |

**EMISIONES TOTALES (Ton CO2 eq):** Se calcula automáticamente como la suma de todas las emisiones parciales dividido entre 1000.

## Fórmulas de Cálculo

### Emisiones Parciales
```
Emisiones Parciales (kg CO2) = Cantidad (Kg) × PCG
```

### Emisiones Totales
```
Emisiones Totales (Ton CO2 eq) = Σ(Emisiones Parciales) / 1000
```

## Valores de PCG por Tipo de Extintor

| Tipo de Extintor              | PCG (Potencial de Calentamiento Global) |
|-------------------------------|------------------------------------------|
| Dioxido de Carbono (CO2)      | 1 Kg                                     |
| Multipropósito                | 0 Kg                                     |
| Solkaflam                     | 77 Kg                                    |

## Ejemplo de Cálculo

**Datos de entrada:**
- Tipo: Solkaflam
- Cantidad: 10 Kg

**Cálculo:**
- PCG: 77 (auto-poblado)
- Emisiones Parciales: 10 × 77 = 770 kg CO2
- Emisiones Totales: 770 / 1000 = 0.77 Ton CO2 eq

## Patrón Seguido

La implementación sigue el mismo patrón usado en las otras secciones del formulario:
- ✅ Combustibles sólidos (`handleSolidoChange`)
- ✅ Combustibles líquidos estacionarios (`handleLiquidoChange`)
- ✅ Combustibles líquidos móviles (`handleLiquidoMovilChange`)
- ✅ Combustibles gaseosos (`handleGaseosoChange`)
- ✅ Combustibles gaseosos móviles (`handleGaseosoMovilChange`)

## Estado de la Funcionalidad

✅ **COMPLETADO** - La sección de extintores ahora funciona correctamente:
- Auto-población de PCG al seleccionar tipo
- Cálculo automático de emisiones parciales
- Cálculo de emisiones totales
- Interfaz consistente con el resto del formulario

## Archivos Modificados

1. `Landing/src/component/HuellaCarbono/FormularioHuella.js`
   - Líneas 280-320: Actualización de FACTORES_EXTINTORES y handleExtintorChange

## Próximos Pasos

Según la conversación, el usuario mencionó: **"Antes de hacer la base de datos"**, indicando que después de esta corrección se procederá con:
1. Implementación de base de datos PostgreSQL
2. Migración de datos desde localStorage
3. Integración con backend para persistencia

## Notas Adicionales

- La funcionalidad ya estaba parcialmente implementada en el render
- Solo faltaba la lógica de auto-población y cálculo en el handler
- No se requirieron cambios en la interfaz visual
- Compatible con el sistema de guardado actual (localStorage)
