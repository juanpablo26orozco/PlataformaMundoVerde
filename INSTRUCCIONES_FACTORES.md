# 🚀 INSTRUCCIONES PARA POBLAR BASE DE DATOS Y USAR FACTORES

## PASO 1: POBLAR LA BASE DE DATOS

### Paso 1A: Insertar factores de combustibles y electricidad

#### Opción A: Usando pgAdmin (Interfaz Gráfica)

1. **Abre pgAdmin**
2. **Conéctate a tu servidor** PostgreSQL 18.0
3. **Selecciona la base de datos** `mundoverde_db`
4. **Click derecho** en `mundoverde_db` → **Query Tool**
5. **Abre el archivo** `verify_and_seed.sql`:
   - Menú: **File** → **Open**
   - Navega a: `c:\Proyectos\Qexal_React_v2.3.0\database\verify_and_seed.sql`
6. **Ejecuta el script**: Presiona **F5** o click en el botón ▶️ **Execute**
7. **Revisa los resultados** en la pestaña **Data Output**:
   - Deberías ver conteos como:
     ```
     catalogo_combustibles_solidos: 25 registros
     catalogo_combustibles_liquidos: 13 registros
     catalogo_combustibles_gaseosos: 11 registros
     factores_electricidad_pais: 5 registros
     ```

#### Opción B: Usando psql (Línea de Comandos)

```powershell
# Conéctate a PostgreSQL
psql -U postgres -d mundoverde_db

# Ejecuta el script
\i c:/Proyectos/Qexal_React_v2.3.0/database/verify_and_seed.sql

# O en una sola línea desde PowerShell:
psql -U postgres -d mundoverde_db -f "c:\Proyectos\Qexal_React_v2.3.0\database\verify_and_seed.sql"
```

---

### Paso 1B: **AGREGAR FACTORES DE VUELOS** (tabla nueva)

La tabla `factores_vuelos` NO existía en el schema original. Debes crearla:

#### Opción A: Usando pgAdmin

1. **En pgAdmin**, abre otra **Query Tool**
2. **Abre el archivo** `add_flight_factors_table.sql`:
   - Navega a: `c:\Proyectos\Qexal_React_v2.3.0\database\add_flight_factors_table.sql`
3. **Ejecuta el script**: Presiona **F5**
4. **Revisa los resultados** - deberías ver:
   ```
   Tabla factores_vuelos creada correctamente
   clase | Factor (kg CO2e/pasajero/km)
   Economica | 0.158
   Ejecutiva | 0.237
   ```

#### Opción B: Usando psql

```powershell
psql -U postgres -d mundoverde_db -f "c:\Proyectos\Qexal_React_v2.3.0\database\add_flight_factors_table.sql"
```

---

## PASO 2: REINICIAR EL SERVIDOR (IMPORTANTE)

**⚠️ MUY IMPORTANTE:** Después de modificar `setupProxy.js`, DEBES reiniciar el servidor.

### En la terminal donde está corriendo el servidor:

```powershell
# 1. Detener el servidor: Presiona Ctrl+C

# 2. Limpiar caché y reiniciar
cd c:\Proyectos\Qexal_React_v2.3.0\Landing
npm start
```

---

## PASO 3: VERIFICAR QUE LOS FACTORES SE CARGAN CORRECTAMENTE

1. **Abre la aplicación** en el navegador: `http://localhost:3000`

2. **Abre las DevTools** (F12)

3. **Ve a la pestaña Network**

4. **Recarga la página** (Ctrl+R)

5. **Busca la petición** `/api/factores/todos`

6. **Revisa la respuesta** - deberías ver algo como:

```json
{
  "success": true,
  "factores": {
    "combustibles_solidos": [
      {
        "nombre": "Carbón Genérico",
        "poder_calorifico": 28.76,
        "factor_co2": 88136.063,
        ...
      }
    ],
    "combustibles_liquidos": [
      {
        "nombre": "ACPM o Diesel",
        "densidad": 0.845,
        "poder_calorifico": 42.6,
        "factor_co2": 74035.554,
        ...
      }
    ],
    "combustibles_gaseosos": [...],
    "electricidad": [
      {
        "pais": "Colombia",
        "año": 2024,
        "factor_emision": 0.164
      }
    ],
    "vuelos": [
      {
        "clase": "Economica",
        "factor_emision": 0.158,
        "fuente": "Factor actualmente usado en la aplicación"
      },
      {
        "clase": "Ejecutiva",
        "factor_emision": 0.237,
        "fuente": "Factor actualmente usado en la aplicación"
      }
    ]
  },
  "totales": {
    "solidos": 25,
    "liquidos": 13,
    "gaseosos": 11,
    "electricidad": 5,
    "vuelos": 2,
    "total": 56
  }
}
```

7. **Ve a la pestaña Application** → **Local Storage** → `http://localhost:3000`

8. **Verifica que existan estas claves:**
   - `emission_factors` (con todos los datos)
   - `emission_factors_date` (fecha actual)

---

## PASO 4: USAR LOS FACTORES EN TU CÓDIGO

### En cualquier componente React:

```javascript
import { useEmissionFactors } from '../context/EmissionFactorsContext';

function MiComponente() {
  const { 
    factors,           // Todos los factores
    loading,           // true mientras carga
    error,             // mensaje de error si hay
    getFactorByName,   // Buscar por nombre
    getElectricityFactor,  // Factor eléctrico
    getFlightFactor    // Factor de vuelos
  } = useEmissionFactors();

  // Esperar a que cargue
  if (loading) return <div>Cargando factores...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ejemplo 1: Obtener factor de combustible líquido
  const diesel = getFactorByName('liquid', 'ACPM o Diesel');
  console.log('Factor CO2 del diesel:', diesel.factor_co2);

  // Ejemplo 2: Obtener factor eléctrico Colombia 2024
  const electricidad = getElectricityFactor('Colombia', 2024);
  console.log('Factor eléctrico 2024:', electricidad.factor_emision);

  // Ejemplo 3: Obtener factor de vuelo
  const vueloEconomica = getFlightFactor('Economica');
  const vueloEjecutiva = getFlightFactor('Ejecutiva');
  
  console.log('Factor vuelo Económica:', vueloEconomica.factor_emision); // 0.158
  console.log('Factor vuelo Ejecutiva:', vueloEjecutiva.factor_emision); // 0.237
  
  // Calcular emisiones del vuelo
  const distanciaKm = 2500;
  const pasajeros = 1;
  const emisionesKg = distanciaKm * pasajeros * vueloEconomica.factor_emision;
  
  return (
    <div>
      <h3>Emisiones calculadas: {emisionesKg.toFixed(2)} kg CO2e</h3>
    </div>
  );
}
```

### Factores de vuelos disponibles:

**La aplicación actualmente usa UN SOLO FACTOR por clase** (sin distinción por distancia):

**Clases disponibles:**
- `"Economica"` → Factor: **0.158** kg CO2e/pasajero/km
- `"Ejecutiva"` → Factor: **0.237** kg CO2e/pasajero/km

**Ejemplo de cálculo completo:**

```javascript
// Usuario selecciona vuelo de Bogotá a Madrid (clase Ejecutiva)
const distancia = 8500; // km (calculada con haversineDistance)
const clase = "Ejecutiva";
const pasajeros = 2;

// Obtener factor
const flightFactor = getFlightFactor(clase);

// Calcular emisiones totales
const emisionesTotales = distancia * pasajeros * flightFactor.factor_emision;
// = 8500 * 2 * 0.237 = 4,029 kg CO2e
```

---

## RESUMEN DE LO QUE HICIMOS

✅ **Creado `verify_and_seed.sql`:**
   - Verifica datos existentes
   - Inserta 25 combustibles sólidos
   - Inserta 13 combustibles líquidos
   - Inserta 11 combustibles gaseosos
   - Inserta 5 factores eléctricos Colombia (2020-2024)
   - **NUEVO:** Inserta 4 factores de vuelos por clase
   - Usa `ON CONFLICT` para no duplicar datos

✅ **Actualizado `setupProxy.js`:**
   - Endpoint `/api/factores/todos` ahora incluye tabla `factores_vuelos`
   - Devuelve 5 categorías en lugar de 4

✅ **Actualizado `EmissionFactorsContext.js`:**
   - **Nueva función:** `getFlightFactor(cabinClass, distance)`
   - Selecciona automáticamente el factor correcto según distancia
   - Devuelve objeto con `factor_aplicado` listo para usar

✅ **Caché de 24 horas:**
   - Primera carga: consulta base de datos
   - Siguientes 24h: usa localStorage
   - Después de 24h: recarga automáticamente

---

## PRÓXIMO PASO: INTEGRAR EN FormularioHuella.js

**Ahora que todo está listo**, el siguiente paso es modificar `FormularioHuella.js` para:

1. **Importar el hook:**
   ```javascript
   import { useEmissionFactors } from '../../context/EmissionFactorsContext';
   ```

2. **Reemplazar arrays hardcodeados** `FACTORES_GASEOSOS`, `FACTORES_SOLIDOS`, `FACTORES_LIQUIDOS`

3. **Usar `getFactorByName()`** en lugar de buscar en arrays

4. **Usar `getElectricityFactor()`** en lugar de `const FACTOR_ELECTRICO = 0.391`

5. **Usar `getFlightFactor()`** en lugar de los hardcoded `0.237`, `0.158`

¿Quieres que haga esa integración ahora? 🚀
