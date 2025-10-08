# 🐘 GUÍA RÁPIDA DE INSTALACIÓN - POSTGRESQL 16

## ⏱️ TIEMPO ESTIMADO: 15-20 MINUTOS

---

## 📥 OPCIÓN 1: INSTALADOR OFICIAL (Recomendado)

### Paso 1: Descargar PostgreSQL 16
1. Ve a: https://www.postgresql.org/download/windows/
2. Click en "Download the installer"
3. Selecciona PostgreSQL 16.x para Windows x86-64

### Paso 2: Ejecutar Instalador
1. Doble click en el archivo `.exe` descargado
2. **Instalación:**
   - Directory: `C:\Program Files\PostgreSQL\16` (default)
   - Components: Seleccionar TODOS
   - Data Directory: `C:\Program Files\PostgreSQL\16\data` (default)
   - **Password**: `mundoverde2025` ⚠️ **IMPORTANTE: Recuerda esta contraseña**
   - Port: `5432` (default)
   - Locale: `Spanish, Colombia` o `Default locale`

3. **Esperar instalación** (~5 minutos)

### Paso 3: Configurar Variables de Entorno
```powershell
# Abrir PowerShell como Administrador
setx PATH "%PATH%;C:\Program Files\PostgreSQL\16\bin"

# Cerrar y abrir nueva terminal
```

### Paso 4: Verificar Instalación
```powershell
psql --version
# Debe mostrar: psql (PostgreSQL) 16.x
```

---

## 📥 OPCIÓN 2: CHOCOLATEY (Más Rápido)

### Paso 1: Instalar Chocolatey (si no lo tienes)
```powershell
# Abrir PowerShell como Administrador
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Paso 2: Instalar PostgreSQL
```powershell
choco install postgresql16 -y --params '/Password:mundoverde2025'
```

### Paso 3: Verificar
```powershell
psql --version
```

---

## 🗄️ CREAR BASE DE DATOS Y TABLAS

### Paso 1: Conectar a PostgreSQL
```powershell
# En PowerShell
psql -U postgres

# Te pedirá la contraseña: mundoverde2025
```

### Paso 2: Crear Base de Datos
```sql
-- Dentro de psql
CREATE DATABASE mundoverde_db;

-- Verificar que se creó
\l

-- Conectar a la nueva base de datos
\c mundoverde_db
```

### Paso 3: Ejecutar Scripts SQL
```powershell
# Salir de psql
\q

# Ejecutar script de creación de tablas
cd C:\Proyectos\Qexal_React_v2.3.0\Landing\database
psql -U postgres -d mundoverde_db -f schema.sql

# Ejecutar script de datos iniciales
psql -U postgres -d mundoverde_db -f seed_factores.sql
```

### Paso 4: Verificar Tablas Creadas
```sql
-- Conectar nuevamente
psql -U postgres -d mundoverde_db

-- Ver tablas
\dt

-- Debe mostrar:
-- calculos_huella
-- calculos_autogestion
-- factores_combustibles
-- contador_secuencias
-- auditoria_simple

-- Ver cantidad de factores insertados
SELECT COUNT(*) FROM factores_combustibles;
-- Debe mostrar: ~25 registros

-- Ver contadores
SELECT * FROM contador_secuencias;
-- Debe mostrar: HC y AG con contador en 0
```

---

## 🔐 CONFIGURAR ARCHIVO .env

### Paso 1: Crear archivo .env
```powershell
cd C:\Proyectos\Qexal_React_v2.3.0\Landing
copy .env.example .env
```

### Paso 2: Editar .env
```env
# Abrir en tu editor favorito
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundoverde_db
DB_USER=postgres
DB_PASSWORD=mundoverde2025

# ⚠️ IMPORTANTE: Cambia la contraseña si usaste otra durante la instalación
```

---

## 📦 INSTALAR DEPENDENCIAS NPM

```powershell
cd C:\Proyectos\Qexal_React_v2.3.0\Landing
npm install pg uuid dotenv
```

---

## ✅ VERIFICACIÓN FINAL

### Test 1: Conexión desde Node.js
```powershell
node -e "const {Pool} = require('pg'); const pool = new Pool({host:'localhost',port:5432,database:'mundoverde_db',user:'postgres',password:'mundoverde2025'}); pool.query('SELECT NOW()', (err, res) => {console.log(err ? 'ERROR:' + err : 'OK: ' + res.rows[0].now); pool.end();});"
```

Debe mostrar: `OK: [fecha actual]`

### Test 2: Verificar DatabaseService
```powershell
cd C:\Proyectos\Qexal_React_v2.3.0\Landing
node -e "const db = require('./src/services/DatabaseService'); db.healthCheck().then(r => console.log(r));"
```

Debe mostrar: `{ success: true, message: 'Base de datos operativa' }`

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error: "psql: command not found"
**Solución**: Agregar PostgreSQL al PATH
```powershell
setx PATH "%PATH%;C:\Program Files\PostgreSQL\16\bin"
# Cerrar y abrir nueva terminal
```

### Error: "password authentication failed"
**Solución**: 
1. Verificar contraseña en `.env`
2. Resetear contraseña de PostgreSQL:
```powershell
# Abrir pgAdmin (instalado con PostgreSQL)
# Right-click en postgres -> Properties -> Definition -> Nueva contraseña
```

### Error: "database does not exist"
**Solución**:
```sql
psql -U postgres
CREATE DATABASE mundoverde_db;
\q
```

### Error: "could not connect to server"
**Solución**: Iniciar servicio de PostgreSQL
```powershell
# Buscar "Services" en Windows
# Buscar "postgresql-x64-16"
# Click derecho -> Start
```

---

## 📊 SIGUIENTE PASO

Una vez completada esta guía, estarás listo para:

1. ✅ PostgreSQL instalado y funcionando
2. ✅ Base de datos `mundoverde_db` creada
3. ✅ 5 tablas creadas con sus índices
4. ✅ ~25 factores de emisión cargados
5. ✅ Contadores inicializados
6. ✅ Archivo `.env` configurado
7. ✅ Dependencias NPM instaladas

**🚀 Siguiente: Modificar setupProxy.js para agregar endpoints API**

---

## 🆘 NECESITAS AYUDA?

Si encuentras algún error, comparte:
1. El mensaje de error completo
2. El comando que ejecutaste
3. La versión de Windows que usas

---

**⏰ TIEMPO TOTAL: ~20 minutos**
