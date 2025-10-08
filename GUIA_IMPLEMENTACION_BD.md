# 🚀 GUÍA COMPLETA DE IMPLEMENTACIÓN DE BASE DE DATOS
## Plataforma Mundo Verde - PostgreSQL

---

## 📋 RESUMEN EJECUTIVO

Tu predecesor ya creó **TODO el esquema de base de datos PostgreSQL** con:

- ✅ **21 tablas SQL** completas (17 operativas + 4 de privacidad)
- ✅ **50+ factores de emisión** precargados
- ✅ **Triggers automáticos** para calcular emisiones
- ✅ **Sistema de códigos únicos** (HC-2025-000001, AG-2025-000001)
- ✅ **Archivos backend** listos (`DatabaseService.js`, `config.js`)
- ✅ **Documentación completa** en múltiples archivos

---

## 🎯 LO QUE DEBES HACER (3 PASOS SIMPLES)

### ✅ **PASO 1: Instalar PostgreSQL** (15 minutos)

#### Windows:
1. Descarga PostgreSQL 16 desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante instalación:
   - Usuario: `postgres` (por defecto)
   - Contraseña: **IMPORTANTE** - Anótala (por ejemplo: `mundoverde2025`)
   - Puerto: `5432` (por defecto)
4. Verifica instalación:
   ```powershell
   psql --version
   ```

---

### ✅ **PASO 2: Crear la Base de Datos y Tablas** (10 minutos)

#### Opción A - PowerShell (Recomendado):
```powershell
# 1. Navega a la carpeta del proyecto
cd c:\Proyectos\Qexal_React_v2.3.0

# 2. Crear la base de datos
psql -U postgres -c "CREATE DATABASE mundoverde_db;"

# 3. Ejecutar los 3 scripts SQL en orden:
psql -U postgres -d mundoverde_db -f database\schema.sql
psql -U postgres -d mundoverde_db -f database\seed_factores.sql
psql -U postgres -d mundoverde_db -f database\functions.sql
```

#### Opción B - SQL Shell (psql):
```sql
-- 1. Abre "SQL Shell (psql)" desde el menú inicio de Windows
-- 2. Presiona Enter 4 veces (usa valores por defecto)
-- 3. Ingresa tu contraseña

-- 4. Ejecuta estos comandos:
CREATE DATABASE mundoverde_db;
\c mundoverde_db
\i 'c:/Proyectos/Qexal_React_v2.3.0/database/schema.sql'
\i 'c:/Proyectos/Qexal_React_v2.3.0/database/seed_factores.sql'
\i 'c:/Proyectos/Qexal_React_v2.3.0/database/functions.sql'
```

---

### ✅ **PASO 3: Configurar Variables de Entorno** (2 minutos)

Abre el archivo `Landing/.env` y verifica/actualiza estas líneas:

```env
# ============================================
# PostgreSQL Database Configuration
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundoverde_db
DB_USER=postgres
DB_PASSWORD=mundoverde2025    # 👈 CAMBIA ESTO por tu contraseña real

# Application Configuration
PORT=3000
NODE_ENV=development
```

---

## ✅ **VERIFICACIÓN - ¿Todo funcionó correctamente?**

### Test 1: Verificar tablas creadas
```powershell
psql -U postgres -d mundoverde_db -c "\dt"
```

Deberías ver **21 tablas**:
```
 calculos_huella_carbono
 combustibles_solidos
 combustibles_liquidos
 combustibles_gaseosos
 consumo_electricidad
 vuelos_aereos
 extintores
 calculos_autogestion
 respuestas_autogestion
 promedios_bloques_autogestion
 catalogo_combustibles_solidos
 catalogo_combustibles_liquidos
 catalogo_combustibles_gaseosos
 factores_electricidad_pais
 documentos_generados
 auditoria
 secuencias
 consentimientos_usuario
 historial_politicas
 log_acceso_datos
 solicitudes_eliminacion
```

### Test 2: Verificar factores de emisión
```powershell
psql -U postgres -d mundoverde_db -c "SELECT COUNT(*) FROM catalogo_combustibles_solidos;"
```

Debería mostrar: `22` (factores de combustibles sólidos)

### Test 3: Verificar desde Node.js
```powershell
cd c:\Proyectos\Qexal_React_v2.3.0\Landing
node -e "require('dotenv').config(); const {Pool} = require('pg'); const pool = new Pool({host:process.env.DB_HOST,port:process.env.DB_PORT,database:process.env.DB_NAME,user:process.env.DB_USER,password:process.env.DB_PASSWORD}); pool.query('SELECT NOW()', (err, res) => {console.log(err ? 'ERROR: ' + err : '✅ Conexión exitosa: ' + res.rows[0].now); pool.end();});"
```

Debería mostrar: `✅ Conexión exitosa: [fecha actual]`

---

## 🔄 **ACTIVAR LA BASE DE DATOS EN TU APLICACIÓN**

Ahora que PostgreSQL está instalado y configurado, necesitas **descomentar el código** en `setupProxy.js`:

### Paso 1: Descomentar imports de base de datos

Abre `Landing/src/setupProxy.js` y busca las líneas 9-10:

**CAMBIAR DE:**
```javascript
// TODO: Descomentar cuando se implemente la base de datos
// const { verificarConexion } = require('./src/database/config');
// const DatabaseService = require('./src/database/DatabaseService');
```

**A:**
```javascript
// Base de datos activada ✅
const { verificarConexion } = require('./src/database/config');
const DatabaseService = require('./src/database/DatabaseService');
```

### Paso 2: Descomentar verificación de conexión

Busca las líneas 18-28 y descomentar:

**CAMBIAR DE:**
```javascript
// TODO: Descomentar cuando se implemente la base de datos
/*
verificarConexion().then(success => {
  if (success) {
    console.log('✅ Base de datos conectada y lista!');
  } else {
    console.warn('⚠️  La aplicación seguirá funcionando pero sin base de datos');
  }
});
*/
```

**A:**
```javascript
// Verificar conexión al iniciar
verificarConexion().then(success => {
  if (success) {
    console.log('✅ Base de datos conectada y lista!');
  } else {
    console.warn('⚠️  La aplicación seguirá funcionando pero sin base de datos');
  }
});
```

### Paso 3: Descomentar endpoints de API

Busca la línea 471 y descomenta **TODO EL BLOQUE** hasta la línea 799.

**CAMBIAR DE:**
```javascript
/* ========== ENDPOINTS DE BD DESHABILITADOS TEMPORALMENTE ==========
  
  // POST /api/guardar-huella
  ...
  (todo el código comentado)
  ...
  
  // FIN ENDPOINTS DE BD DESHABILITADOS */
```

**A:**
```javascript
// ========== ENDPOINTS DE BASE DE DATOS ACTIVOS ==========
  
  // POST /api/guardar-huella
  app.post('/api/guardar-huella', async (req, res) => {
    // ... código completo sin comentarios
  });
  
  // ... resto de endpoints ...
```

---

## 🚀 **REINICIAR LA APLICACIÓN**

```powershell
# Detén el servidor actual (Ctrl+C)
# Vuelve a iniciar
cd c:\Proyectos\Qexal_React_v2.3.0\Landing
yarn start
```

**Deberías ver en la consola:**
```
✅ Base de datos conectada y lista!
🎉 ¡CONEXIÓN EXITOSA A POSTGRESQL!
================================================
📅 Hora del servidor: ...
🗄️  Base de datos: mundoverde_db
🐘 Versión: PostgreSQL 16.x
================================================
SendGrid configurado
Compiled successfully!
```

---

## 📊 **LO QUE OBTIENES CON LA BASE DE DATOS**

### 1️⃣ **Códigos Únicos de Seguimiento**

Cada cálculo genera un código único:
```
HC-2025-000001  ← Huella de Carbono #1 del 2025
HC-2025-000002  ← Huella de Carbono #2 del 2025
AG-2025-000001  ← Autogestión #1 del 2025
```

### 2️⃣ **API REST Completa**

#### Guardar Huella de Carbono:
```javascript
POST /api/guardar-huella
{
  "datosEmpresa": { ... },
  "solidos": [ ... ],
  "liquidos": [ ... ],
  // ... más datos
}

// Respuesta:
{
  "success": true,
  "codigo": "HC-2025-000001",  ← Código único
  "id": "uuid...",
  "emisiones": {
    "emisiones_alcance_1": 12.5,
    "emisiones_alcance_2": 8.3,
    "emisiones_totales": 20.8
  }
}
```

#### Consultar Cálculo:
```javascript
GET /api/obtener-calculo/HC-2025-000001

// Respuesta: Todos los datos del cálculo
```

#### Obtener Factores de Emisión:
```javascript
GET /api/catalogos/combustibles

// Respuesta:
{
  "success": true,
  "data": {
    "solidos": [
      { "tipo": "Carbón antracita", "factorCO2": 2.65, ... },
      // ... 22 tipos más
    ],
    "liquidos": [ ... ],  // 13 tipos
    "gaseosos": [ ... ]   // 10 tipos
  }
}
```

### 3️⃣ **Auditoría Completa**

Todas las operaciones quedan registradas:
```sql
SELECT * FROM auditoria ORDER BY fecha DESC LIMIT 10;
```

### 4️⃣ **Cumplimiento Legal (GDPR/Ley 1581)**

4 tablas adicionales para privacidad:
- `consentimientos_usuario` - Registro de aceptaciones
- `historial_politicas` - Versiones de documentos legales
- `log_acceso_datos` - Auditoría de accesos
- `solicitudes_eliminacion` - Derecho al olvido

---

## 🗂️ **ARCHIVOS DE BASE DE DATOS - GUÍA DE REFERENCIA**

### 📁 `database/` - Scripts SQL

| Archivo | Descripción | ¿Cuándo usar? |
|---------|-------------|---------------|
| `schema.sql` | Crea las 21 tablas | Primera vez / Reset completo |
| `seed_factores.sql` | Inserta factores de emisión | Después de schema.sql |
| `functions.sql` | Triggers automáticos | Después de seed_factores.sql |
| `verificar.sql` | Script de diagnóstico | Para verificar instalación |

### 📁 `Landing/src/database/` - Código Node.js

| Archivo | Descripción | Responsabilidad |
|---------|-------------|-----------------|
| `config.js` | Conexión a PostgreSQL | Pool de conexiones |
| `DatabaseService.js` | Métodos CRUD | Guardar/Consultar datos |
| `queries.js` | Queries SQL organizadas | Sentencias SQL |

### 📄 Documentación

| Archivo | Contenido |
|---------|-----------|
| `README_DATABASE.md` | Guía completa con ejemplos |
| `DATABASE_ANALYSIS.md` | Esquema detallado (994 líneas) |
| `DATABASE_IMPLEMENTATION_PLAN_8H.md` | Plan de 8 horas |
| `POSTGRESQL_SETUP.md` | Instalación paso a paso |
| `TABLAS_PRIVACIDAD.md` | Documentación legal |

---

## 🐛 **SOLUCIÓN DE PROBLEMAS COMUNES**

### ❌ Error: "psql: command not found"
**Causa**: PostgreSQL no está en el PATH  
**Solución**:
```powershell
# Agregar al PATH
setx PATH "%PATH%;C:\Program Files\PostgreSQL\16\bin"
# Cerrar y abrir nueva terminal
```

### ❌ Error: "password authentication failed"
**Causa**: Contraseña incorrecta en `.env`  
**Solución**: Verifica que `DB_PASSWORD` en `.env` coincida con la contraseña de PostgreSQL

### ❌ Error: "database mundoverde_db does not exist"
**Causa**: No se ejecutó el comando CREATE DATABASE  
**Solución**:
```powershell
psql -U postgres -c "CREATE DATABASE mundoverde_db;"
```

### ❌ Error: "relation calculos_huella_carbono does not exist"
**Causa**: No se ejecutó `schema.sql`  
**Solución**:
```powershell
psql -U postgres -d mundoverde_db -f database\schema.sql
```

### ❌ Error: "ECONNREFUSED"
**Causa**: PostgreSQL no está corriendo  
**Solución**:
```powershell
# Buscar "Services" en Windows
# Buscar "postgresql-x64-16"
# Click derecho -> Start
```

### ❌ No aparece el código en el PDF
**Causa**: Los endpoints de BD están comentados  
**Solución**: Descomenta el código en `setupProxy.js` (ver sección anterior)

---

## 📚 **CONSULTAS SQL ÚTILES**

### Ver últimos cálculos guardados:
```sql
SELECT 
    codigo_seguimiento, 
    nombre_empresa, 
    fecha_reporte, 
    emisiones_totales 
FROM calculos_huella_carbono 
ORDER BY fecha_creacion DESC 
LIMIT 10;
```

### Estadísticas generales:
```sql
SELECT 
    COUNT(*) as total_calculos,
    SUM(emisiones_totales) as emisiones_totales,
    AVG(emisiones_totales) as promedio_emisiones
FROM calculos_huella_carbono;
```

### Ver factores de emisión por tipo:
```sql
-- Combustibles sólidos
SELECT tipo, factor_co2, unidad FROM catalogo_combustibles_solidos;

-- Combustibles líquidos
SELECT tipo, factor_co2, unidad FROM catalogo_combustibles_liquidos;

-- Factor de electricidad Colombia
SELECT * FROM factores_electricidad_pais WHERE pais = 'Colombia';
```

---

## 🎯 **RESUMEN: ¿QUÉ HACER AHORA?**

1. ✅ **Instalar PostgreSQL** (15 min)
2. ✅ **Crear base de datos y ejecutar scripts SQL** (10 min)
3. ✅ **Configurar archivo .env** (2 min)
4. ✅ **Descomentar código en setupProxy.js** (5 min)
5. ✅ **Reiniciar aplicación** (1 min)
6. ✅ **Hacer prueba completa** (10 min)

**⏰ TIEMPO TOTAL: ~45 minutos**

---

## 🆘 **¿NECESITAS AYUDA?**

Si encuentras algún error:

1. **Revisa los logs de la consola** (donde corre `yarn start`)
2. **Verifica las credenciales** en el archivo `.env`
3. **Comprueba que PostgreSQL esté corriendo** (Services en Windows)
4. **Ejecuta el script de verificación**:
   ```powershell
   psql -U postgres -d mundoverde_db -f database\verificar.sql
   ```

---

## ✅ **CHECKLIST COMPLETO**

- [ ] PostgreSQL instalado (`psql --version` funciona)
- [ ] Base de datos `mundoverde_db` creada
- [ ] Script `schema.sql` ejecutado sin errores
- [ ] Script `seed_factores.sql` ejecutado sin errores
- [ ] Script `functions.sql` ejecutado sin errores
- [ ] Archivo `.env` configurado con contraseña correcta
- [ ] Código de `setupProxy.js` descomentado (imports + verificación + endpoints)
- [ ] Aplicación reiniciada con `yarn start`
- [ ] Mensaje "✅ Base de datos conectada y lista!" aparece en consola
- [ ] Prueba: Hacer un cálculo y verificar código único (HC-2025-XXXXXX)
- [ ] Prueba: Código aparece en el PDF generado
- [ ] Prueba: Datos guardados en PostgreSQL (SELECT * FROM calculos_huella_carbono)

---

**🎉 ¡Listo! Tu aplicación ahora tiene una base de datos profesional PostgreSQL completamente funcional.**

---

**Última actualización:** 3 de Octubre, 2025  
**Versión:** 1.0.0  
**Creado por:** Tu equipo de desarrollo anterior  
**Documentado por:** GitHub Copilot
