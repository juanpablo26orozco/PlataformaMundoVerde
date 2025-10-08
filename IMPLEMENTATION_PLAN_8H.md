# 🚀 PLAN DE IMPLEMENTACIÓN - BASE DE DATOS (8 HORAS)

## ⏰ CRONOGRAMA OPTIMIZADO

### 🕐 HORA 1-2: PostgreSQL Setup & Tablas Core
- ✅ Instalar PostgreSQL 16
- ✅ Crear base de datos `mundoverde_db`
- ✅ Crear 5 tablas esenciales (no las 17, solo lo necesario)
- ✅ Insertar factores de emisión predefinidos

### 🕑 HORA 3-4: Backend API en setupProxy.js
- ✅ Instalar dependencias: `pg`, `uuid`
- ✅ Crear `DatabaseService.js` con conexión a PostgreSQL
- ✅ Crear 4 endpoints críticos:
  - POST `/api/guardar-huella`
  - POST `/api/guardar-autogestion`
  - GET `/api/calculos/:id`
  - GET `/api/factores-emision`

### 🕒 HORA 5-6: Frontend Integration
- ✅ Modificar `StorageService.js` → llamar API en vez de localStorage
- ✅ Generar ID único legible: `HC-2025-001234`
- ✅ Mostrar ID al usuario al terminar cálculo
- ✅ Mantener localStorage como fallback

### 🕓 HORA 7-8: PDF + Testing
- ✅ Agregar ID único en PDF (header)
- ✅ Agregar ID en email
- ✅ Probar flujo completo
- ✅ Verificar datos guardados en PostgreSQL

---

## 📊 ESQUEMA DE BD SIMPLIFICADO (Solo 5 tablas)

```sql
-- 1. calculos_huella (tabla principal)
CREATE TABLE calculos_huella (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(20) UNIQUE NOT NULL, -- HC-2025-001234
    datos_empresa JSONB NOT NULL,
    datos_calculos JSONB NOT NULL, -- Todo el JSON del cálculo
    emisiones_alcance_1 DECIMAL(15,4),
    emisiones_alcance_2 DECIMAL(15,4),
    emisiones_alcance_3 DECIMAL(15,4),
    emisiones_totales DECIMAL(15,4),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. calculos_autogestion (tabla principal)
CREATE TABLE calculos_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(20) UNIQUE NOT NULL, -- AG-2025-001234
    datos_empresa JSONB NOT NULL,
    respuestas JSONB NOT NULL, -- Todas las respuestas
    porcentaje_final DECIMAL(5,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. factores_combustibles (catálogo)
CREATE TABLE factores_combustibles (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50), -- 'solido', 'liquido', 'gaseoso'
    nombre VARCHAR(255) UNIQUE NOT NULL,
    factores JSONB NOT NULL, -- Todos los factores de emisión
    activo BOOLEAN DEFAULT true
);

-- 4. contador_secuencias (para IDs legibles)
CREATE TABLE contador_secuencias (
    tipo VARCHAR(20) PRIMARY KEY, -- 'HC', 'AG'
    año INTEGER NOT NULL,
    contador INTEGER DEFAULT 0
);

-- 5. auditoria_simple (log básico)
CREATE TABLE auditoria_simple (
    id SERIAL PRIMARY KEY,
    tipo_calculo VARCHAR(20), -- 'HUELLA', 'AUTOGESTION'
    codigo_seguimiento VARCHAR(20),
    accion VARCHAR(50), -- 'CREADO', 'CONSULTADO'
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 INSTALACIÓN POSTGRESQL (15 MINUTOS)

### Opción 1: Windows Installer (Recomendado)
```bash
# 1. Descargar PostgreSQL 16
# https://www.postgresql.org/download/windows/

# 2. Ejecutar instalador
# - Puerto: 5432
# - Password: mundoverde2025

# 3. Agregar a PATH
setx PATH "%PATH%;C:\Program Files\PostgreSQL\16\bin"
```

### Opción 2: Chocolatey (Rápido)
```bash
choco install postgresql16
```

### Crear Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE mundoverde_db;

# Conectar a la nueva BD
\c mundoverde_db

# Ejecutar script de creación de tablas (ver abajo)
```

---

## 📦 DEPENDENCIAS NPM (5 MINUTOS)

```bash
cd Landing
npm install pg uuid
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS (Monolito con Buenas Prácticas)

```
Landing/
├── src/
│   ├── services/
│   │   ├── StorageService.js (MODIFICAR - agregar fallback)
│   │   ├── DatabaseService.js (NUEVO - conexión PostgreSQL)
│   │   ├── EmailService.js (MODIFICAR - agregar ID en email)
│   │   └── CalculationService.js
│   ├── setupProxy.js (MODIFICAR - agregar endpoints)
│   └── utils/
│       └── idGenerator.js (NUEVO - generar IDs legibles)
├── database/
│   ├── schema.sql (NUEVO - script de creación de tablas)
│   ├── seed_factores.sql (NUEVO - datos iniciales)
│   └── .env.example (NUEVO - template de configuración)
└── package.json
```

---

## 🔐 CONFIGURACIÓN (.env)

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundoverde_db
DB_USER=postgres
DB_PASSWORD=mundoverde2025

# Aplicación
PORT=3000
NODE_ENV=development
```

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

1. **Instalar PostgreSQL** (15 min)
2. **Crear archivos base** (10 min)
3. **Instalar dependencias** (5 min)
4. **Crear tablas en PostgreSQL** (10 min)
5. **Implementar DatabaseService** (30 min)
6. **Agregar endpoints en setupProxy** (30 min)
7. **Modificar StorageService** (30 min)
8. **Generar IDs legibles** (20 min)
9. **Actualizar PDFs con ID** (30 min)
10. **Testing final** (60 min)

**TOTAL: ~4.5 horas + 3.5 horas de buffer**

---

## ✅ VALIDACIÓN FINAL

Al terminar, podremos:

1. ✅ Usuario hace cálculo de Huella de Carbono
2. ✅ Se genera ID legible: `HC-2025-000001`
3. ✅ Se guarda en PostgreSQL (tabla `calculos_huella`)
4. ✅ Se muestra al usuario: "Tu código de seguimiento es: HC-2025-000001"
5. ✅ Se incluye en el PDF (header)
6. ✅ Se incluye en el email
7. ✅ localStorage mantiene copia como fallback
8. ✅ Mismo flujo para Autogestión con ID: `AG-2025-000001`

---

## 🚨 DECISIONES CLAVE TOMADAS

- ✅ **JSONB en PostgreSQL**: Para no crear 100 columnas, guardamos JSON completo
- ✅ **5 tablas en vez de 17**: Simplificación radical para cumplir 8 horas
- ✅ **Contador secuencial**: Para IDs legibles increméntales por año
- ✅ **Fallback a localStorage**: Por si falla la BD, no se pierde el cálculo
- ✅ **Sin autenticación**: Como no hay usuarios, no necesitamos JWT
- ✅ **Monolito con buenas prácticas**: Todo en setupProxy.js pero bien organizado

---

## 🎯 MÉTRICAS DE ÉXITO

- [ ] PostgreSQL instalado y funcionando
- [ ] 5 tablas creadas correctamente
- [ ] Factores de emisión cargados
- [ ] 4 endpoints API funcionando
- [ ] ID legible generado correctamente
- [ ] Cálculo guardado en PostgreSQL
- [ ] ID mostrado al usuario
- [ ] ID incluido en PDF
- [ ] ID incluido en email
- [ ] localStorage funciona como fallback
- [ ] Testing completo exitoso

---

**¿LISTO PARA EMPEZAR? 🚀**

Responde "SÍ" y empezamos con la instalación de PostgreSQL y creación de archivos base.
