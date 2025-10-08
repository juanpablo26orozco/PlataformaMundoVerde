# ✅ CORRECCIÓN APLICADA - FACTORES DE VUELOS REALES

## 🔍 PROBLEMA IDENTIFICADO

Tenías razón: Los factores que puse inicialmente **NO coincidían** con los que la aplicación usa actualmente.

## 📊 FACTORES CORRECTOS (los que usa tu app ahora):

### En el código actual (`FormularioHuella.js` línea 486-490):

```javascript
if (newRows[idx].clase === "Ejecutiva") {
  factorEmision = 0.237;
} else if (newRows[idx].clase === "Economica" || newRows[idx].clase === "Económica") {
  factorEmision = 0.158;
}
```

### ✅ Factores reales:

| Clase | Factor (kg CO2e/pasajero/km) |
|-------|------------------------------|
| **Economica** | **0.158** |
| **Ejecutiva** | **0.237** |

**Características:**
- ✅ Solo 2 clases (NO 4)
- ✅ Un factor único por clase (NO por distancia)
- ✅ Sin distinción corta/media/larga distancia

---

## 📝 ARCHIVOS ACTUALIZADOS:

### 1️⃣ `add_flight_factors_table.sql`
**ANTES (INCORRECTO):**
- 4 clases: Económica, Premium Economy, Business, Primera Clase
- 3 factores por clase: corta/media/larga distancia
- Factores de DEFRA UK 2024

**AHORA (CORRECTO):**
```sql
CREATE TABLE factores_vuelos (
    clase VARCHAR(100) UNIQUE NOT NULL,
    factor_emision DECIMAL(10,6) NOT NULL,  -- Factor único
    ...
);

INSERT INTO factores_vuelos (clase, factor_emision) VALUES
('Economica', 0.158),
('Ejecutiva', 0.237);
```

### 2️⃣ `setupProxy.js`
**Query actualizada:**
```javascript
SELECT clase, factor_emision, fuente, año_publicacion
FROM factores_vuelos
WHERE activo = true
```

### 3️⃣ `EmissionFactorsContext.js`
**Función simplificada:**
```javascript
const getFlightFactor = (cabinClass = 'Economica') => {
  // Ya NO recibe distancia
  // Ya NO calcula factor por distancia
  // Solo devuelve el factor único de la clase
  return factors.vuelos.find(f => 
    f.clase?.toLowerCase() === cabinClass.toLowerCase()
  );
};
```

### 4️⃣ `INSTRUCCIONES_FACTORES.md`
- Ejemplos actualizados con factores correctos
- Documentación corregida

---

## 🚀 EJECUTA LOS SCRIPTS AHORA:

```powershell
# 1. Combustibles y electricidad
psql -U postgres -d mundoverde_db -f "c:\Proyectos\Qexal_React_v2.3.0\database\verify_and_seed.sql"

# 2. Factores de vuelos (CORREGIDOS)
psql -U postgres -d mundoverde_db -f "c:\Proyectos\Qexal_React_v2.3.0\database\add_flight_factors_table.sql"
```

---

## ✅ RESULTADO ESPERADO:

```
Tabla factores_vuelos creada correctamente

clase      | Factor (kg CO2e/pasajero/km)
-----------+-----------------------------
Economica  | 0.158
Ejecutiva  | 0.237
```

---

## 🎯 USO EN EL CÓDIGO:

```javascript
const { getFlightFactor } = useEmissionFactors();

// Obtener factor
const factorEconomica = getFlightFactor('Economica');
console.log(factorEconomica.factor_emision); // 0.158

// Calcular emisiones
const distancia = 5000; // km
const pasajeros = 2;
const emisiones = distancia * pasajeros * factorEconomica.factor_emision;
// = 5000 * 2 * 0.158 = 1,580 kg CO2e
```

---

## 💡 BENEFICIO:

Ahora cuando actualices los factores de vuelos en la base de datos, **no tienes que tocar el código**. Solo actualizas la tabla y reinicia el servidor.

¡Gracias por corregirme! 🙏
