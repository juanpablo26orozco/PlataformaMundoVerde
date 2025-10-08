# 🚀 PLAN DE IMPLEMENTACIÓN PROFESIONAL - BASE DE DATOS
## Plataforma Mundo Verde - 8 HORAS

**Fecha:** 3 de Octubre, 2025  
**Tiempo disponible:** 8 horas  
**Objetivo:** Implementación completa y profesional de base de datos PostgreSQL

---

## ⏱️ CRONOGRAMA DETALLADO

### **HORA 1-2: Configuración PostgreSQL + Scripts SQL Completos** (2h)
- ✅ Instalar/Verificar PostgreSQL 14+
- ✅ Crear base de datos `mundoverde_db`
- ✅ Ejecutar script completo de 17 tablas
- ✅ Insertar factores de emisión predefinidos
- ✅ Verificar integridad de tablas

### **HORA 3-4: Backend - setupProxy.js + DatabaseService** (2h)
- ✅ Configurar conexión PostgreSQL en `setupProxy.js`
- ✅ Crear `DatabaseService.js` profesional
- ✅ Implementar generación de IDs únicos (HC-2025-XXXXXX)
- ✅ Crear endpoints para guardar Huella de Carbono
- ✅ Crear endpoints para guardar Autogestión

### **HORA 5-6: Integración Frontend** (2h)
- ✅ Actualizar `FormularioHuella.js` para usar DatabaseService
- ✅ Actualizar `AutogestionPage.js` para usar DatabaseService
- ✅ Mostrar ID único después de guardar
- ✅ Agregar ID único al PDF generado

### **HORA 7-8: Testing + Validación Final** (2h)
- ✅ Probar flujo completo Huella de Carbono
- ✅ Probar flujo completo Autogestión
- ✅ Verificar que IDs únicos aparecen en PDF
- ✅ Validar que datos se guardan correctamente en PostgreSQL
- ✅ Crear documentación final

---

## 📋 ADAPTACIONES PARA TU APLICACIÓN

### **IMPORTANTE: SIN SISTEMA DE USUARIOS**
Tu aplicación NO tiene login/registro, los datos se guardan **directamente**:

```javascript
// ANTES (localStorage):
localStorage.setItem('calculation_1234', JSON.stringify(data))

// AHORA (PostgreSQL):
await DatabaseService.guardarHuellaCarbono(data)
// Retorna: { id: "uuid", codigo: "HC-2025-001234" }
```

### **Tablas Simplificadas** (porque no hay usuarios)

Las tablas de tu documento se adaptan así:

```sql
-- NO SE USA: usuarios, empresas con usuario_id
-- SÍ SE USA: Todas las demás tablas sin referencias a usuarios

CREATE TABLE calculos_huella_carbono (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(20) UNIQUE NOT NULL,  -- HC-2025-001234
    
    -- Datos de empresa (sin foreign key, guardado directo)
    nombre_empresa VARCHAR(500) NOT NULL,
    nit VARCHAR(50) NOT NULL,
    sector VARCHAR(255),
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    
    -- Persona responsable
    persona_elabora VARCHAR(255),
    cargo VARCHAR(255),
    
    -- Año y fechas
    año_reporte INTEGER NOT NULL,
    fecha_reporte DATE NOT NULL,
    
    -- Resultados totales
    emisiones_alcance_1 DECIMAL(15,4) DEFAULT 0,
    emisiones_alcance_2 DECIMAL(15,4) DEFAULT 0,
    emisiones_alcance_3 DECIMAL(15,4) DEFAULT 0,
    emisiones_totales DECIMAL(15,4) GENERATED ALWAYS AS (
        emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3
    ) STORED,
    
    -- Evaluación
    nivel_evaluacion VARCHAR(50),
    arboles_compensar INTEGER,
    
    -- Control
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 CARACTERÍSTICAS CLAVE

### **1. Código de Seguimiento Único**

```javascript
// Formato: HC-2025-001234 (Huella de Carbono)
//          AG-2025-001234 (Autogestión)

function generarCodigoSeguimiento(tipo) {
  const prefijo = tipo === 'HUELLA' ? 'HC' : 'AG';
  const año = new Date().getFullYear();
  const numero = obtenerProximoNumero(tipo, año); // De secuencia en BD
  return `${prefijo}-${año}-${numero.toString().padStart(6, '0')}`;
}

// Ejemplo de salida:
// "HC-2025-000001"
// "HC-2025-000002"
// "AG-2025-000001"
```

### **2. Mostrar al Usuario**

```jsx
// En FormularioHuella.js después de guardar:
<div className="success-message">
  <h3>✅ ¡Cálculo completado exitosamente!</h3>
  <div className="codigo-seguimiento">
    <p>📋 Tu código de seguimiento es:</p>
    <h2 style={{color: '#43a047'}}>{codigoSeguimiento}</h2>
    <small>Guarda este código para futuras referencias</small>
  </div>
  <p>📧 Hemos enviado el reporte a: {email}</p>
</div>
```

### **3. ID en PDF**

```javascript
// En setupProxy.js - generarPDFHuella():
doc.fontSize(14).text('Código de Seguimiento:', 40, 50);
doc.fontSize(18).fillColor('#43a047').text(datos.codigo_seguimiento, 40, 65);
doc.fontSize(11).fillColor('#000').text('Fecha: ' + (datos.fecha || ''), 40, 85);
```

---

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR

```
Landing/
├── src/
│   ├── database/
│   │   ├── config.js              # Configuración PostgreSQL
│   │   ├── DatabaseService.js     # Servicio principal
│   │   └── queries.js             # Queries SQL organizadas
│   └── setupProxy.js              # Endpoints agregados aquí (MONOLITO)
├── database/
│   ├── schema.sql                 # Todas las 17 tablas
│   ├── seed_factores.sql          # Factores de emisión iniciales
│   └── functions.sql              # Funciones y triggers
└── .env                           # Variables de entorno
```

---

## 🔧 PRÓXIMOS PASOS INMEDIATOS

### **PASO 1: Verificar PostgreSQL** (5 min)

```bash
# En PowerShell:
psql --version

# Si no está instalado:
# Descargar de: https://www.postgresql.org/download/windows/
# Instalar con valores por defecto
```

### **PASO 2: Crear Base de Datos** (5 min)

```bash
# Abrir SQL Shell (psql) desde inicio de Windows
# Credenciales por defecto:
# Server: localhost
# Database: postgres
# Port: 5432
# Username: postgres
# Password: [la que pusiste en instalación]

CREATE DATABASE mundoverde_db;
\c mundoverde_db
```

### **PASO 3: Ejecutar Scripts SQL** (10 min)

Voy a generar los scripts completos en los siguientes archivos.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Configuración Inicial**
- [ ] PostgreSQL instalado y funcionando
- [ ] Base de datos `mundoverde_db` creada
- [ ] Todas las tablas creadas sin errores
- [ ] Factores de emisión insertados
- [ ] Archivo `.env` configurado

### **Backend**
- [ ] `DatabaseService.js` creado
- [ ] Conexión a PostgreSQL funcionando
- [ ] Función `generarCodigoSeguimiento()` implementada
- [ ] Endpoint `/api/guardar-huella` funcionando
- [ ] Endpoint `/api/guardar-autogestion` funcionando

### **Frontend**
- [ ] `FormularioHuella.js` actualizado
- [ ] `AutogestionPage.js` actualizado
- [ ] ID único se muestra al usuario
- [ ] ID único aparece en PDF

### **Testing**
- [ ] Guardar cálculo Huella completo
- [ ] Guardar cálculo Autogestión completo
- [ ] PDF incluye código de seguimiento
- [ ] Email incluye código de seguimiento
- [ ] Datos correctos en PostgreSQL

---

## 🚨 PUNTOS CRÍTICOS A RECORDAR

1. **NO HAY USUARIOS**: Las tablas no tienen `usuario_id`, todo se guarda directo
2. **MONOLITO**: Todo el backend va en `setupProxy.js`, NO crear servidor separado
3. **ID ÚNICO**: Debe aparecer en pantalla, PDF y email
4. **ESPAÑOL**: Todas las tablas y campos en español
5. **PROFESIONAL**: Usar el esquema completo de 17 tablas, no simplificar

---

## 🎯 RESULTADO FINAL ESPERADO

Al terminar las 8 horas tendrás:

1. ✅ **Base de datos PostgreSQL** con 17 tablas completas
2. ✅ **Sistema de IDs únicos** (HC-2025-XXXXXX / AG-2025-XXXXXX)
3. ✅ **Guardado automático** de todos los cálculos
4. ✅ **IDs visibles** en pantalla, PDF y email
5. ✅ **localStorage como respaldo** temporal (opcional)
6. ✅ **Sistema 100% funcional** y profesional

---

**¿Listo para empezar? Voy a generar todos los archivos necesarios ahora mismo.** 🚀
