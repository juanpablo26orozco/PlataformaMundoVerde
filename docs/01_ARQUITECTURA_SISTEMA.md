# 🏗️ Arquitectura del Sistema - Plataforma Mundo Verde

## 📋 Descripción General

Sistema web monolítico desarrollado con React + Express integrados, que gestiona cálculos de huella de carbono y autodiagnósticos de sostenibilidad para empresas.

---

## 🎯 Arquitectura Monolítica

```
┌─────────────────────────────────────────────────────────────┐
│                FRONTEND - React 18.3.1                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Páginas Principales:                                │   │
│  │  • LandingPage.js                                    │   │
│  │  • HuellaCarbono.js (Calculadora)                    │   │
│  │  • AutogestionPage.js (210 preguntas)               │   │
│  │  • ResultadoHuella.js (Dashboard)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Context API:                                                │
│  • EmissionFactorsContext (caché 24h)                       │
│                                                              │
│  Componentes:                                                │
│  • FormularioHuella.js                                      │
│  • FormularioAutogestion.js                                 │
│  • ModalPoliticas.js (Consentimiento GDPR)                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    fetch() API calls
                           │
┌──────────────────────────▼───────────────────────────────────┐
│              BACKEND - Express (setupProxy.js)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  13 Endpoints API:                                   │   │
│  │                                                      │   │
│  │  POST:                                               │   │
│  │  • /api/guardar-huella                               │   │
│  │  • /api/guardar-autogestion                          │   │
│  │  • /api/send-email                                   │   │
│  │  • /api/send-email-autogestion                       │   │
│  │  • /api/generar-pdf-autogestion                      │   │
│  │  • /api/consentimiento                               │   │
│  │                                                      │   │
│  │  GET:                                                │   │
│  │  • /api/obtener-calculo/:codigo                      │   │
│  │  • /api/descargar-pdf-autogestion/:codigo            │   │
│  │  • /api/descargar-pdf-autogestion-bd/:codigo         │   │
│  │  • /api/catalogos/combustibles                       │   │
│  │  • /api/factor-electricidad/:pais/:año               │   │
│  │  • /api/estadisticas                                 │   │
│  │  • /api/factores/todos                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Servicios:                                                  │
│  • DatabaseService.js (CRUD operations)                     │
│  • EmailService.js (SendGrid)                               │
│  • PDFKit (generación de reportes)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │
                   pg (node-postgres)
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                   PostgreSQL 14+                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  25 Tablas:                                          │   │
│  │  • 21 tablas operativas                              │   │
│  │  • 4 tablas legales (GDPR/Ley 1581)                  │   │
│  │                                                      │   │
│  │  Funciones:                                          │   │
│  │  • generar_codigo_seguimiento('HC'/'AG')             │   │
│  │  • 8+ funciones auxiliares                           │   │
│  │                                                      │   │
│  │  Secuencias:                                         │   │
│  │  • seq_huella_carbono_codigo                         │   │
│  │  • seq_autogestion_codigo                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Calculadora de Huella de Carbono

```
Usuario → FormularioHuella.js
    ↓ (valida datos)
handleGuardarResumen()
    ↓ (prepara JSON)
fetch('/api/guardar-huella')
    ↓
setupProxy.js → app.post('/api/guardar-huella')
    ↓
DatabaseService.guardarHuellaCarbono(datos)
    ↓
BEGIN TRANSACTION
    ├─ INSERT calculos_huella_carbono (genera HC-YYYY-NNNNNN)
    ├─ INSERT combustibles_solidos
    ├─ INSERT combustibles_liquidos
    ├─ INSERT combustibles_gaseosos
    ├─ INSERT consumo_electricidad
    ├─ INSERT vuelos_aereos
    └─ INSERT extintores
COMMIT
    ↓ (triggers calculan totales)
Response: { codigo: "HC-2025-000001", emisiones: {...} }
    ↓
Frontend: Muestra código + Genera PDF con PDFKit
```

### 2. Autodiagnóstico de Sostenibilidad

```
Usuario → FormularioAutogestion.js (210 preguntas)
    ↓ (valida 210 respuestas)
prepararDatosCompletos()
    ↓ (estructura JSON + genera PDF)
fetch('/api/guardar-autogestion')
    ↓
setupProxy.js → app.post('/api/guardar-autogestion')
    ↓
DatabaseService.guardarAutogestion(datos)
    ↓
BEGIN TRANSACTION
    └─ INSERT calculos_autogestion (1 REGISTRO ÚNICO)
        ├─ codigo_seguimiento: AG-YYYY-NNNNNN
        ├─ pdf_reporte: Buffer PDF completo (BYTEA)
        ├─ resumen_ejecutivo: JSON con porcentajes (JSONB)
        └─ 210 respuestas en columnas JSON
COMMIT
    ↓
Response: { codigo: "AG-2025-000001", porcentaje_final: 85.2 }
    ↓
Frontend: Muestra dashboard con resultados
```

**Optimización:**
- **Antes:** 241 registros (1 + 210 respuestas + 30 promedios)
- **Ahora:** 1 registro único con PDF embebido
- **Reducción:** 99%

---

## 📁 Estructura de Archivos

```
PlataformaMundoVerde/
├── Landing/                    # Aplicación React + Express
│   ├── src/
│   │   ├── setupProxy.js       # ⭐ BACKEND EXPRESS (1545 líneas)
│   │   │                       # - 13 endpoints API
│   │   │                       # - Generación PDFs
│   │   │                       # - Lógica de negocio
│   │   │
│   │   ├── database/
│   │   │   ├── config.js       # Pool PostgreSQL (2-10 conexiones)
│   │   │   ├── DatabaseService.js  # CRUD operations
│   │   │   └── queries.js      # 40+ queries SQL preparadas
│   │   │
│   │   ├── services/
│   │   │   ├── DatabaseService.js  # Métodos de BD
│   │   │   └── CalculationService.js  # Cálculos de emisiones
│   │   │
│   │   ├── context/
│   │   │   └── EmissionFactorsContext.js  # Caché 24h localStorage
│   │   │
│   │   ├── component/
│   │   │   ├── HuellaCarbono/
│   │   │   │   ├── FormularioHuella.js    # Formulario principal
│   │   │   │   └── ResultadoHuella.js     # Dashboard
│   │   │   ├── Autogestion/
│   │   │   │   ├── FormularioAutogestion.js  # 210 preguntas
│   │   │   │   └── ResultadoAutogestion.js   # Dashboard
│   │   │   └── Legal/
│   │   │       └── ModalPoliticas.js      # GDPR/Ley 1581
│   │   │
│   │   └── pages/
│   │       ├── LandingPage.js
│   │       ├── HuellaCarbono/
│   │       └── Autogestion/
│   │
│   ├── package.json            # 35+ dependencias
│   └── .env                    # Variables de entorno
│
├── database/                   # Scripts SQL
│   ├── schema.sql              # 25 tablas
│   ├── seed_factores.sql       # 66 factores de emisión
│   ├── functions.sql           # Funciones PostgreSQL
│   └── verificar.sql           # Scripts de verificación
│
└── Documentation/              # Excel metodología IPCC
    └── Calculadora Huella de Carbono.xlsx
```

---

## 🔐 Seguridad Implementada

### 1. Base de Datos
- ✅ **Prepared Statements** (prevención SQL injection)
- ✅ **Pool de conexiones** con límites (2-10)
- ✅ **Transacciones ACID** para integridad
- ✅ **SSL/TLS** opcional para conexión

### 2. API
- ✅ **CORS** configurado
- ✅ **Body size limit** (50MB)
- ✅ **Validación de datos** en backend
- ❌ **NO hay autenticación** (sistema público)

### 3. Frontend
- ✅ **XSS prevention** (React automático)
- ✅ **Sanitización de inputs**
- ✅ **HTTPS** en producción

### 4. Privacidad
- ✅ **Consentimiento explícito** (GDPR Art. 7)
- ✅ **Registro de aceptaciones** con IP/User Agent
- ✅ **Log de accesos** (GDPR Art. 30)
- ✅ **Derecho al olvido** (tabla solicitudes_eliminacion)

---

## 🚀 Despliegue

### Desarrollo
```bash
cd Landing
npm start
# Corre en http://localhost:3000
```

### Producción
```bash
npm run build
# Genera carpeta build/ lista para deploy
```

**Hosting actual:** GitHub Pages  
**URL:** https://juanpablo26orozco.github.io/PlataformaMundoVerde

---

## 📊 Métricas del Sistema

| Métrica | Valor |
|---------|-------|
| **Líneas de código backend** | ~2,500 |
| **Componentes React** | 30+ |
| **Endpoints API** | 13 |
| **Tablas BD** | 25 |
| **Factores de emisión** | 66 |
| **Queries SQL** | 40+ |
| **Tiempo carga inicial** | 2-3s |
| **Tiempo cálculos** | <500ms |

---

## ⚠️ Limitaciones Actuales

1. **NO hay autenticación de usuarios**
   - Sistema público sin login
   - Cualquiera puede crear cálculos

2. **NO hay panel administrativo**
   - No se pueden ver todos los cálculos desde UI
   - Requiere acceso directo a BD

3. **NO hay exportación automática**
   - PDFs se generan pero no se envían automáticamente
   - Requiere clic manual para descargar

4. **NO hay validación de email**
   - Emails se aceptan sin verificar

5. **Códigos de seguimiento públicos**
   - Cualquiera con el código puede consultar resultados
   - No hay protección por contraseña

---

## 🔄 Integración de Servicios

### SendGrid (Email)
```javascript
// Configurado en setupProxy.js
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoints:
// POST /api/send-email
// POST /api/send-email-autogestion
```

### PostgreSQL
```javascript
// Pool de conexiones en database/config.js
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: 2,
  max: 10
});
```

### PDFKit
```javascript
// Generación en setupProxy.js
const PDFDocument = require('pdfkit');

// Genera PDFs para:
// - Huella de Carbono
// - Autodiagnóstico (210 páginas)
```

---

**Última actualización:** Octubre 9, 2025  
**Versión:** 2.3.0
