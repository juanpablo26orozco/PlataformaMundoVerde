# 🗄️ Base de Datos - Plataforma Mundo Verde

## 📋 Índice de Archivos

Esta carpeta contiene todos los scripts SQL y documentación de la base de datos PostgreSQL.

---

## 📂 Estructura Organizada

```
database/
├── 00_README_DATABASE.md              ⭐ ESTE ARCHIVO
│
├── scripts_principales/               Scripts esenciales
│   ├── 01_schema.sql                 25 tablas (21 operativas + 4 legales)
│   ├── 02_seed_factores.sql          66 factores de emisión
│   ├── 03_functions.sql              Funciones y triggers PostgreSQL
│   └── 04_verificar.sql              Script de verificación completo
│
├── backups/                          Backups de PostgreSQL
│   └── mundo_verde_backup_2025-10-09.backup
│
└── utils/                            Scripts auxiliares
    └── verificar_datos.sql           Queries de consulta
```

---

## 🚀 Instalación Rápida

### Paso 1: Crear Base de Datos

```bash
# Windows (PowerShell)
psql -U postgres -c "CREATE DATABASE mundoverde_db;"

# Linux/Mac
sudo -u postgres psql -c "CREATE DATABASE mundoverde_db;"
```

---

### Paso 2: Ejecutar Scripts en Orden

```bash
cd database/scripts_principales

# 1. Crear tablas (21 tablas)
psql -U postgres -d mundoverde_db -f 01_schema.sql

# 2. Cargar factores de emisión (66 registros)
psql -U postgres -d mundoverde_db -f 02_seed_factores.sql

# 3. Crear funciones y triggers
psql -U postgres -d mundoverde_db -f 03_functions.sql

# 4. Verificar instalación
psql -U postgres -d mundoverde_db -f 04_verificar.sql
```

**Resultado esperado:**
```
✅ Tablas creadas: 21
✅ Factores insertados: 66
✅ Funciones creadas: 8+
✅ Triggers creados: 12+
✅ ¡TODO CORRECTO! La base de datos está lista.
```

---

## 📊 Contenido de la Base de Datos

### Tablas Operativas (17)

**Huella de Carbono (8 tablas):**
- `calculos_huella_carbono` - Registro principal con totales
- `combustibles_solidos` - Carbón, biomasa, etc.
- `combustibles_liquidos` - Gasolina, diesel, etc.
- `combustibles_gaseosos` - Gas natural, GLP, etc.
- `consumo_electricidad` - Consumo mensual kWh
- `vuelos_aereos` - Vuelos corporativos/comerciales
- `extintores` - Recargas de extintores
- `documentos_generados` - PDFs generados

**Autogestión (3 tablas):**
- `calculos_autogestion` - Cálculo profesional con PDF embebido
- `respuestas_autogestion` - Respuestas individuales (1-60)
- `promedios_bloques_autogestion` - Promedios por bloque (6 bloques)

**Catálogos (6 tablas):**
- `catalogo_combustibles_solidos` - 25 tipos IPCC 2006
- `catalogo_combustibles_liquidos` - 16 tipos IPCC 2006
- `catalogo_combustibles_gaseosos` - 11 tipos IPCC 2006
- `factores_electricidad_pais` - Colombia 2020-2024 (UPME)
- `factores_vuelos` - Factores de emisión por clase de vuelo
- `auditoria` - Log de auditoría general

**Totales:** 17 tablas operativas

---

### Tablas Legales (4) - GDPR/Ley 1581

- `consentimientos_usuario` - Registro de aceptaciones (GDPR Art. 7)
- `historial_politicas` - Versiones de términos
- `log_acceso_datos` - Auditoría de accesos (GDPR Art. 30)
- `solicitudes_eliminacion` - Derecho al olvido (GDPR Art. 17)

---

### Factores de Emisión (66 registros)

| Categoría | Cantidad | Fuente |
|-----------|----------|--------|
| Combustibles sólidos | 25 | IPCC 2006 |
| Combustibles líquidos | 16 | IPCC 2006 |
| Combustibles gaseosos | 11 | IPCC 2006 |
| Electricidad Colombia | 14 | UPME 2020-2024 |
| **Total** | **66** | |

---

## 🔧 Scripts Disponibles

### Scripts Principales

#### 1. `01_schema.sql`
**Propósito:** Crear todas las 25 tablas  
**Contenido:**
- Extensiones (uuid-ossp, pgcrypto)
- 21 tablas operativas
- 4 tablas legales
- Índices de optimización
- Constraints y validaciones

**Uso:**
```bash
psql -U postgres -d mundoverde_db -f scripts_principales/01_schema.sql
```

---

#### 2. `02_seed_factores.sql`
**Propósito:** Cargar factores de emisión  
**Contenido:**
- 25 combustibles sólidos
- 16 combustibles líquidos
- 11 combustibles gaseosos
- 14 factores eléctricos (Colombia 2020-2024)

**Uso:**
```bash
psql -U postgres -d mundoverde_db -f scripts_principales/02_seed_factores.sql
```

---

#### 3. `03_functions.sql`
**Propósito:** Funciones y triggers PostgreSQL  
**Contenido:**
- `generar_codigo_seguimiento('HC'/'AG')` - Códigos únicos
- Triggers de actualización automática de emisiones
- Funciones auxiliares

**Ejemplo:**
```sql
SELECT generar_codigo_seguimiento('HC');  -- HC-2025-000001
SELECT generar_codigo_seguimiento('AG');  -- AG-2025-000001
```

---

#### 4. `04_verificar.sql`
**Propósito:** Verificar instalación completa  
**Verifica:**
- ✅ 25 tablas creadas
- ✅ 66 factores insertados
- ✅ Funciones disponibles
- ✅ Secuencias funcionando

**Uso:**
```bash
psql -U postgres -d mundoverde_db -f scripts_principales/04_verificar.sql
```

---

## 💾 Backups

### Restaurar desde Backup

```bash
# Restaurar backup completo
psql -U postgres -d mundoverde_db < backups/mundo_verde_backup_2025-10-09.backup
```

### Crear Nuevo Backup

```bash
# Backup completo
pg_dump -U postgres -d mundoverde_db -F c -f backups/mundo_verde_backup_$(date +%Y-%m-%d).backup

# Backup solo schema
pg_dump -U postgres -d mundoverde_db -s -f backups/schema_only_$(date +%Y-%m-%d).sql

# Backup solo datos
pg_dump -U postgres -d mundoverde_db -a -f backups/data_only_$(date +%Y-%m-%d).sql
```

---

## 🔍 Scripts de Utilidad

### Verificar Datos en BD

```sql
-- Ver todos los cálculos de huella de carbono
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    nit,
    emisiones_totales,
    fecha_creacion
FROM calculos_huella_carbono
ORDER BY fecha_creacion DESC
LIMIT 10;

-- Ver autogestiones con PDF
SELECT 
    codigo_seguimiento,
    nombre_empresa,
    LENGTH(pdf_reporte) as tamaño_pdf,
    resumen_ejecutivo->>'porcentajeFinal' as porcentaje
FROM calculos_autogestion
ORDER BY fecha_creacion DESC;

-- Contar factores de emisión
SELECT 
    'Sólidos' as tipo, COUNT(*) as cantidad 
FROM catalogo_combustibles_solidos
UNION ALL
SELECT 'Líquidos', COUNT(*) FROM catalogo_combustibles_liquidos
UNION ALL
SELECT 'Gaseosos', COUNT(*) FROM catalogo_combustibles_gaseosos
UNION ALL
SELECT 'Eléctricos', COUNT(*) FROM factores_electricidad_pais;
```

---

## 🗑️ Archivos Eliminados (Redundantes)

Los siguientes archivos fueron eliminados por ser redundantes o temporales:

- ❌ `verificar_simple.sql`
- ❌ `verificar_rapido.sql`
- ❌ `verificar_completo_profesional.sql`
- ❌ `verificar_datos_reales.sql`
- ❌ `verificar_estructura.sql`
- ❌ `verificar_factores.sql`
- ❌ `verificar_guardado_completo.sql`
- ❌ `verificar_optimizacion.sql`
- ❌ `apply_optimization.sql`
- ❌ `optimizar_autogestion.sql`
- ❌ `CORRECCION_CRITICA_AUTOGESTION.sql`
- ❌ `fix_table_now.sql`
- ❌ `extraer_pdfs.sql`
- ❌ `add_flight_factors_table.sql`
- ❌ `nueva_funcion_autogestion.js`
- ❌ `optimized_assessment_function.js`
- ❌ Documentación markdown redundante

**Todos fueron consolidados en:**
- ✅ `scripts_principales/01_schema.sql` (versión final)
- ✅ `scripts_principales/02_seed_factores.sql` (versión final)
- ✅ `scripts_principales/03_functions.sql` (versión final)
- ✅ `scripts_principales/04_verificar.sql` (consolidado)

---

## 📊 Estadísticas de la BD

### Tamaño de Tablas (típico)

| Tabla | Registros Típicos | Tamaño |
|-------|-------------------|--------|
| `calculos_huella_carbono` | 1 por cálculo | ~5 KB/registro |
| `combustibles_solidos` | 0-10 por cálculo | ~2 KB/registro |
| `calculos_autogestion` | 1 por diagnóstico | ~160 KB/registro (con PDF) |
| `catalogo_combustibles_*` | 52 total | ~100 KB |
| `consentimientos_usuario` | 1 por aceptación | ~1 KB/registro |

**Total típico para 100 cálculos:** ~50 MB

---

## 🔐 Seguridad

### Configuración Recomendada

```bash
# En .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundoverde_db
DB_USER=mundoverde_user  # NO usar postgres en producción
DB_PASSWORD=contraseña_segura_aquí
DB_SSL=true  # En producción
```

### Crear Usuario Específico

```sql
-- Crear usuario con permisos limitados
CREATE USER mundoverde_user WITH PASSWORD 'contraseña_segura';

-- Dar permisos solo a mundoverde_db
GRANT CONNECT ON DATABASE mundoverde_db TO mundoverde_user;
GRANT USAGE ON SCHEMA public TO mundoverde_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mundoverde_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mundoverde_user;
```

---

## ⚠️ Notas Importantes

### Requisitos
- PostgreSQL 14.0 o superior
- Extensiones: `uuid-ossp`, `pgcrypto`
- 500 MB espacio en disco mínimo

### Limitaciones
- Solo factores de emisión de Colombia 🇨🇴
- Sin rutas de vuelos precargadas
- Sin autenticación/usuarios en BD

### Mantenimiento
- Backup diario recomendado
- Limpieza de logs cada 6 meses
- Actualizar factores eléctricos anualmente (UPME)

---

## 🆘 Problemas Comunes

### Error: "extension uuid-ossp does not exist"
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Error: "relation already exists"
```sql
-- Eliminar base de datos y empezar de nuevo
DROP DATABASE IF EXISTS mundoverde_db;
CREATE DATABASE mundoverde_db;
```

### Error: "permission denied"
```bash
# Usar usuario postgres
psql -U postgres -d mundoverde_db -f schema.sql
```

---

## 📞 Soporte

**Desarrollador:** Juan Pablo Orozco  
**Email:** juanpablo26orozco@gmail.com  
**Proyecto:** Plataforma Mundo Verde  
**Cliente:** Cámara de Comercio de Manizales

---

**Última actualización:** Octubre 9, 2025  
**Versión BD:** 1.0.0  
**PostgreSQL mínimo:** 14.0
