# 🔄 LIMPIAR CACHÉ Y RECARGAR FACTORES

## Problema
Los factores de vuelos no se están cargando porque el localStorage tiene datos viejos (de antes de crear la tabla `factores_vuelos`).

## Solución Rápida

### Opción 1: Desde la Consola del Navegador (F12)
```javascript
// Limpiar cache
localStorage.removeItem('emission_factors');
localStorage.removeItem('emission_factors_date');

// Recargar página
location.reload();
```

### Opción 2: Desde DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña **Application** (o **Aplicación**)
3. En el menú izquierdo, expande **Local Storage**
4. Haz clic en `http://localhost:3000`
5. Busca y elimina las claves:
   - `emission_factors`
   - `emission_factors_date`
6. Recarga la página (F5)

### Opción 3: Limpiar todo el Local Storage
```javascript
localStorage.clear();
location.reload();
```

## Verificación

Después de limpiar el cache, en la consola deberías ver:

```
📡 Fetching emission factors from API...
✅ Emission factors loaded and cached: 5 categories
```

Y luego al seleccionar la clase de vuelo:

```
✈️ getFlightFactor - Available flights: [{clase: 'Economica', factor_emision: 0.158, ...}, {clase: 'Ejecutiva', factor_emision: 0.237, ...}]
✈️ getFlightFactor - Searching for class: Ejecutiva
✈️ getFlightFactor - Result: {clase: 'Ejecutiva', factor_emision: 0.237, ...}
```

## ¿Por qué pasó esto?

El localStorage guardó los factores ANTES de que existiera la tabla `factores_vuelos`. El cache es válido por 24 horas, por lo que no se actualizó automáticamente.

Al limpiar el cache, el contexto hará una nueva llamada a `/api/factores/todos` y obtendrá los factores de vuelos.
