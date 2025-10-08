# 📊 EMISSION FACTORS CACHING IMPLEMENTATION

## ✅ WHAT WAS IMPLEMENTED

### 1. API Endpoint `/api/factores/todos` (setupProxy.js)
- **File:** `Landing/src/setupProxy.js` (line ~792)
- **Queries REAL existing tables:**
  - `catalogo_combustibles_solidos`
  - `catalogo_combustibles_liquidos`
  - `catalogo_combustibles_gaseosos`
  - `factores_electricidad_pais`

### 2. EmissionFactorsContext (EmissionFactorsContext.js)
- **File:** `Landing/src/context/EmissionFactorsContext.js`
- **Functions:**
  - `getFactorByName(type, name)` - Search by exact name
  - `getElectricityFactor(country, year)` - Get electricity factor
  - 24-hour cache in localStorage

### 3. Integrated in index.js
- `<EmissionFactorsProvider>` wraps entire app
- Hook `useEmissionFactors()` available in any component

---

## 🚀 HOW TO USE IN YOUR COMPONENTS

### Basic Example: Gasoline

```javascript
import { useEmissionFactors } from '../../context/EmissionFactorsContext';

const MyComponent = () => {
  const { getFactorByName } = useEmissionFactors();
  
  // Search factor by EXACT name from DB
  const gasolineFactor = getFactorByName('liquid', 'Gasolina para motor');
  
  if (!gasolineFactor) {
    console.error('Factor not found');
    return;
  }
  
  // Calculate emission
  const liters = 100;
  const mass = liters * gasolineFactor.densidad; // kg
  const energy = mass * gasolineFactor.poder_calorifico / 1000; // TJ
  const emissionCO2 = energy * gasolineFactor.factor_co2 / 1000; // Ton CO₂
  
  return <div>{emissionCO2} Ton CO₂</div>;
};
```

### Example: Colombia Electricity 2024

```javascript
const { getElectricityFactor } = useEmissionFactors();

const electricityFactor = getElectricityFactor('Colombia', 2024);
// electricityFactor.factor_emision = 0.391 kg CO₂/kWh

const kwh = 1000;
const emissionKg = kwh * electricityFactor.factor_emision;
const emissionTon = emissionKg / 1000;
```

---

## 📋 EXACT FUEL NAMES

### Liquid Fuels (real catalog)
- `'Gasolina para motor'`
- `'Aceite liviano (ACPM/Diesel)'`
- `'Fuel oil (Aceite combustible pesado)'`
- `'Gas licuado de petróleo (GLP)'`
- `'Kerosene tipo jet (Jet A1)'`
- `'Biodiesel'`

### Gaseous Fuels
- `'Gas natural'`
- `'Gas natural comprimido (GNC)'`
- `'Propano'`
- `'Butano'`
- `'Biogás'`

### Solid Fuels
- `'Carbón mineral - Bituminoso'`
- `'Carbón vegetal'`
- `'Leña'`
- `'Bagazo'`

### Electricity
- Country: `'Colombia'`
- Available years: 2020, 2021, 2022, 2023, 2024

---

## 🧪 TEST THE SYSTEM

### 1. Restart server (IMPORTANT)
```bash
cd Landing
npm start
```

### 2. Open DevTools (F12)
- **Network tab:** See call to `/api/factores/todos`
- **Console:** See logs "✅ Emission factors loaded..."
- **Application → LocalStorage:** See `emission_factors`

### 3. Verify it works
Open: http://localhost:3000

In console you should see:
```
📊 Consultando factores de emisión desde BD...
✅ Factores consultados:
  - Sólidos: 22
  - Líquidos: 13
  - Gaseosos: 10
  - Electricidad: 5
```

---

## 🔍 VERIFY DATA IN POSTGRESQL

Run in pgAdmin or DBeaver:

```sql
-- Check if tables exist and have data
SELECT 'Solid' as type, COUNT(*) FROM catalogo_combustibles_solidos WHERE activo = true
UNION ALL
SELECT 'Liquid', COUNT(*) FROM catalogo_combustibles_liquidos WHERE activo = true
UNION ALL
SELECT 'Gas', COUNT(*) FROM catalogo_combustibles_gaseosos WHERE activo = true
UNION ALL
SELECT 'Electricity', COUNT(*) FROM factores_electricidad_pais WHERE activo = true;
```

---

## ⚠️ IMPORTANT

### If tables DON'T have data yet:

1. Execute seed:
```bash
psql -U postgres -d mundoverde_db -f database/seed_factores.sql
```

2. If you don't have `psql` installed:
   - Open pgAdmin
   - Connect to `mundoverde_db`
   - Query Tool → Paste content from `database/seed_factores.sql`
   - Execute (F5)

### If tables have data but different names:

Tell me the EXACT names you see in your DB and we'll adapt the code.

---

## 📂 FILES CREATED/MODIFIED

### Created:
- ✅ `Landing/src/context/EmissionFactorsContext.js` (NEW - English)
- ✅ `database/verificar_datos_reales.sql` (NEW)
- ✅ `IMPLEMENTATION_PLAN.md` (this file - English)

### Modified:
- ✅ `Landing/src/setupProxy.js` - Added endpoint `/api/factores/todos`
- ✅ `Landing/src/index.js` - Changed to use `EmissionFactorsProvider`
- ❌ `Landing/src/context/FactoresContext.js` - DEPRECATED (delete this file)

---

## ✅ NEXT STEP

**Test that it works:**

1. Restart server: `npm start` in Landing folder
2. Open http://localhost:3000
3. Open browser console (F12)
4. Should show: "✅ Emission factors loaded..."
5. In localStorage should have: `emission_factors`

**If errors:**
- Verify that the 4 tables exist in PostgreSQL
- Verify they have data (execute seed if they don't)
- See errors in backend console (terminal running `npm start`)

**Need help?**
Tell me what error you see and we'll fix it together.
