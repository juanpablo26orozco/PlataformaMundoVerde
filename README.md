# 🌱 Plataforma Mundo Verde - Sistema de Gestión Ambiental

![Version](https://img.shields.io/badge/version-2.3.0-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

---

## 📋 DOCUMENTO DE ENTREGA - MIES GROUP

**Proyecto:** Plataforma Mundo Verde - Sistema de Gestión Ambiental  
**Cliente:** Camara de Comercio de Manizales 
**Desarrollador:** Juan Pablo Orozco  
**Email:** juanpablo26orozco@gmail.com  
**WhatsApp:** +57 300 627 9039  
**Fecha de Entrega:** Octubre 7, 2025  
**Estado:** ✅ COMPLETADO Y FUNCIONAL

---

## 📖 Descripción del Proyecto

Sistema web desarrollado para **Mies Group** que permite calcular la huella de carbono empresarial y realizar autodiagnósticos de sostenibilidad. Incluye generación automática de reportes en PDF y almacenamiento en base de datos PostgreSQL.

### 🎯 Funcionalidades Entregadas

- ✅ **Calculadora de Huella de Carbono** - 8 categorías de emisiones
- ✅ **Autodiagnóstico de Sostenibilidad** - 210 preguntas estructuradas
- ✅ **Generación de PDFs** - Reportes profesionales automáticos
- ✅ **Base de Datos PostgreSQL** - Almacenamiento y consulta de datos
- ✅ **Códigos Únicos** - Trazabilidad con formatos HC-YYYY-NNNNNN y AG-YYYY-NNNNNN
- ✅ **Envío por Email** - Sistema integrado con SendGrid
- ✅ **Interfaz Responsiva** - Funciona en desktop, tablet y móvil

---

## 🚀 Instalación para Mies Group

### Requisitos del Sistema

- **Node.js** versión 18.0 o superior
- **PostgreSQL** versión 14.0 o superior
- **Windows 10/11**, **Ubuntu 20.04+** o **macOS 12+**
- **8 GB RAM** mínimo (recomendado 16 GB)
- **Conexión a Internet** para servicios de email

### Pasos de Instalación

#### 1. Configurar Base de Datos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE mies_group_env;"

# Ejecutar scripts (en orden)
psql -U postgres -d mies_group_env -f database/schema.sql
psql -U postgres -d mies_group_env -f database/seed_factores.sql
psql -U postgres -d mies_group_env -f database/functions.sql
```

#### 2. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `Landing/`:

```bash
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mies_group_env
DB_USER=postgres
DB_PASSWORD=[CONTRASEÑA_POSTGRESQL]

# Empresa
REACT_APP_COMPANY_NAME=Mies Group
REACT_APP_COMPANY_EMAIL=contacto@miesgroup.com
REACT_APP_WHATSAPP_NUMBER=573006279039

# Email (SendGrid - Opcional)
SENDGRID_API_KEY=[API_KEY_SENDGRID]
SENDER_EMAIL=[EMAIL_VERIFICADO]

# Sistema
PORT=3000
NODE_ENV=production
```

#### 3. Instalar y Ejecutar

```bash
cd Landing
npm install
npm start
```

**Resultado:** Sistema disponible en `http://localhost:3000`

---

## � Cómo Funciona la Aplicación

### 🏗️ Arquitectura del Sistema

La aplicación funciona con una **arquitectura monolítica** donde el frontend React y el backend Express están integrados en un solo proyecto:

```
Frontend (React) ↔ setupProxy.js (Express) ↔ PostgreSQL
```

#### Flujo de Datos
1. **Usuario interactúa** con la interfaz React
2. **Componentes React** envían datos via fetch() a endpoints internos
3. **setupProxy.js** (Express) recibe las peticiones
4. **Validación y procesamiento** de datos en el backend
5. **Consultas SQL** a PostgreSQL para almacenar/consultar
6. **Generación de PDFs** con PDFKit
7. **Respuesta** al frontend con resultados

### ⚙️ Funcionamiento Técnico Detallado

#### 🧮 Calculadora de Huella de Carbono

**Proceso:**
1. **FormularioHuellaCarbono.js** → Recolecta datos del usuario
2. **DatabaseService.js** → Envía datos a `/api/calcular-huella`
3. **setupProxy.js** → Valida y estructura datos
4. **Cálculos automáticos:** 
   - Consulta factores de emisión de catálogos
   - Multiplica consumos × factores = kg CO₂
   - Suma todas las categorías = huella total
5. **Generación de código único:** HC-YYYY-NNNNNN
6. **Almacenamiento:** 7 tablas relacionadas simultáneamente
7. **PDF automático** con gráficos y resumen ejecutivo
8. **Email opcional** vía SendGrid

**Fórmulas Aplicadas:**
```javascript
// Combustibles
emisiones = cantidad × factor_emision × poder_calorifico

// Electricidad  
emisiones = kWh_consumidos × factor_pais (0.391 kg CO₂/kWh)

// Vuelos
emisiones = distancia_km × factor_vuelo × numero_pasajeros

// Total
huella_total = suma_todas_categorias
```

#### 📋 Autodiagnóstico de Sostenibilidad

**Proceso:**
1. **FormularioAutogestion.js** → 210 preguntas en 6 bloques
2. **Validación en tiempo real** → Cada pregunta 1-5 puntos
3. **Cálculos automáticos por bloque:**
   ```javascript
   porcentaje_bloque = (puntos_obtenidos / puntos_maximos) × 100
   ```
4. **Almacenamiento distribuido:**
   - `calculos_autogestion` → Datos principales
   - `respuestas_autogestion` → 210 respuestas individuales  
   - `promedios_bloques_autogestion` → Porcentajes por sección
5. **Generación de código único:** AG-YYYY-NNNNNN
6. **PDF con diagnóstico completo** y recomendaciones
7. **Dashboard visual** con gráficos por bloques

#### 🗄️ Sistema de Base de Datos

**Triggers Automáticos:**
- **Códigos únicos:** Generación automática secuencial
- **Cálculos:** Triggers que calculan totales al insertar
- **Validaciones:** Checks de integridad referencial

**Optimizaciones:**
- **Índices** en campos de búsqueda frecuente
- **Transacciones** para operaciones complejas
- **Preparación de consultas** para prevenir SQL injection

#### 📄 Generación de PDFs

**PDFKit Integration:**
```javascript
// Estructura de PDF
1. Header con logo y datos empresa
2. Resumen ejecutivo con totales
3. Gráficos circulares (Chart.js → Canvas → PDF)
4. Tablas detalladas por categoría  
5. Metodología y factores utilizados
6. Footer con código único y fecha
```

**Características:**
- **Responsive:** Adapta contenido según datos
- **Professional:** Colores corporativos y formato limpio
- **Completo:** Incluye todos los cálculos y metodología
- **Trazable:** Código único para consultas posteriores

### 🌐 Interfaz de Usuario

#### Navegación Principal
```
Landing Page → Calculadora → Formularios → Resultados → PDF
     ↓              ↓           ↓          ↓         ↓
  Información    Huella/Auto   Datos    Dashboard   Reporte
```

#### Componentes React Clave

**HuellaCarbono.js:**
- 8 secciones de datos ambientales
- Validación en tiempo real
- Cálculos preliminares en frontend
- Integración con catálogos de factores

**Autogestion.js:**
- 210 preguntas estructuradas
- Navegación por bloques
- Guardado automático de progreso  
- Cálculo de porcentajes dinámico

**ResultadoHuella.js / ResultadoAutogestion.js:**
- Dashboard con gráficos interactivos
- Resumen ejecutivo automático
- Generación de PDF on-demand
- Opciones de envío por email

#### Responsive Design
- **Desktop:** Formularios completos en pantalla
- **Tablet:** Navegación adaptada por secciones
- **Móvil:** Un campo por pantalla, navegación simplificada

### 📡 APIs y Endpoints

**Principales endpoints en setupProxy.js:**

```javascript
// Huella de Carbono
POST /api/calcular-huella          → Guardar cálculo completo
GET  /api/huella/:codigo           → Consultar por código
GET  /api/factores/:tipo           → Obtener factores de emisión

// Autodiagnóstico  
POST /api/guardar-autogestion      → Guardar diagnóstico completo
GET  /api/autogestion/:codigo      → Consultar por código
POST /api/calcular-promedios       → Calcular porcentajes por bloque

// Utilidades
POST /api/enviar-email             → Envío de PDFs por email
GET  /api/generar-pdf/:tipo/:id    → Generar PDF on-demand
GET  /api/verificar-conexion       → Health check de DB
```

### 🔄 Flujo de Trabajo Completo

#### Ejemplo: Calculadora de Huella de Carbono

1. **Usuario entra** → `http://localhost:3000/huella-carbono`
2. **React Router** → Carga `HuellaCarbono.js`
3. **Formulario carga** → Consulta factores desde DB
4. **Usuario completa datos** → Validación en tiempo real
5. **Envío al backend** → `POST /api/calcular-huella`
6. **setupProxy.js procesa:**
   ```javascript
   // Generar código único
   codigo = `HC-${año}-${contador.toString().padStart(6, '0')}`
   
   // Calcular emisiones por categoría
   emisiones_totales = calcular_por_categoria(datos)
   
   // Insertar en 7 tablas relacionadas
   await insertarDatosCompletos(datos, emisiones_totales)
   ```
7. **Respuesta a frontend** → Código único + totales
8. **Redirect automático** → Página de resultados
9. **Dashboard carga** → Gráficos y resumen
10. **PDF disponible** → Generación on-demand

---

## 💼 Manual de Uso

### 🧮 Calculadora de Huella de Carbono

1. **Acceder:** Menú principal → "Calculadora" → "Huella de Carbono"
2. **Completar datos:**
   - Información empresarial
   - Combustibles sólidos (carbón, biomasa)
   - Combustibles líquidos (gasolina, diesel)
   - Combustibles gaseosos (gas natural)
   - Consumo eléctrico mensual
   - Vuelos corporativos
   - Recargas de extintores
3. **Generar reporte:** Botón "Generar PDF"
4. **Resultado:** PDF con código único HC-2025-XXXXXX

### 📋 Autodiagnóstico de Sostenibilidad

1. **Acceder:** Menú principal → "Autogestión"
2. **Responder 210 preguntas** organizadas en 6 secciones:
   - **A. Gestión Económica** (35 preguntas)
   - **B. Gestión Ambiental** (36 preguntas)
   - **C. Gestión de Energía** (27 preguntas)
   - **D. Seguridad y Salud** (60 preguntas)
   - **E. Gestión Social** (18 preguntas)
   - **F. Almacén y Logística** (35 preguntas)
3. **Generar diagnóstico:** Sistema calcula automáticamente porcentajes
4. **Resultado:** PDF con código único AG-2025-XXXXXX

### 📊 Consulta de Históricos

- Usar códigos únicos para consultar cálculos anteriores
- Ver todos los datos guardados en la base de datos
- Regenerar PDFs cuando sea necesario

---

## 📦 Tecnologías Utilizadas

### Frontend
- **React** 18.3.1 - Framework principal
- **Bootstrap** 5.3.3 - Diseño responsivo
- **Reactstrap** 9.2.3 - Componentes UI
- **React Router** 6.28.0 - Navegación
- **Chart.js** 4.5.0 - Gráficos
- **i18next** 25.5.2 - Internacionalización

### Backend
- **Node.js** 18+ - Runtime
- **Express** 5.1.0 - Framework web
- **PostgreSQL** 14+ - Base de datos
- **PDFKit** 0.17.2 - Generación de PDFs
- **SendGrid** 8.1.6 - Envío de emails

### Base de Datos
- **21 tablas** en PostgreSQL
- **Triggers automáticos** para cálculos
- **Índices optimizados** para consultas
- **50+ factores de emisión** precargados (Colombia)

---

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### Huella de Carbono
- `calculos_huella_carbono` - Datos principales
- `combustibles_solidos` - Carbón, biomasa
- `combustibles_liquidos` - Gasolina, diesel
- `combustibles_gaseosos` - Gas natural, GLP
- `consumo_electricidad` - Facturas eléctricas
- `vuelos_aereos` - Viajes corporativos
- `extintores` - Emisiones fugitivas

#### Autodiagnóstico
- `calculos_autogestion` - Datos principales
- `respuestas_autogestion` - 210 respuestas individuales
- `promedios_bloques_autogestion` - Cálculos por sección

#### Catálogos
- `catalogo_combustibles_solidos` - 22 factores Colombia
- `catalogo_combustibles_liquidos` - 13 factores Colombia
- `catalogo_combustibles_gaseosos` - 10 factores Colombia
- `factores_electricidad_pais` - Factor Colombia 2024: 0.391 kg CO₂/kWh

### Códigos Únicos Automáticos
- **Huella de Carbono:** HC-2025-000001, HC-2025-000002...
- **Autodiagnóstico:** AG-2025-000001, AG-2025-000002...

---

## 📁 Archivos del Proyecto

```
PlataformaMundoVerde/
├── Landing/                    # Aplicación React
│   ├── src/
│   │   ├── component/         # 25+ componentes React
│   │   │   ├── HuellaCarbono.js     # Calculadora principal
│   │   │   ├── Autogestion.js       # Autodiagnóstico 210 preguntas
│   │   │   ├── ResultadoHuella.js   # Dashboard huella carbono
│   │   │   ├── ResultadoAutogestion.js # Dashboard autogestión
│   │   │   ├── FormularioHuellaCarbono.js # Formulario principal
│   │   │   ├── FormularioAutogestion.js   # Formulario autogestión
│   │   │   └── Navigation.js        # Menú principal
│   │   ├── pages/            # 6 páginas principales
│   │   │   ├── LandingPage.js       # Página de inicio
│   │   │   ├── CalculadoraPage.js   # Página calculadora
│   │   │   ├── AutogestionPage.js   # Página autogestión
│   │   │   └── ResultadosPage.js    # Página resultados
│   │   ├── services/         # Servicios de integración
│   │   │   ├── DatabaseService.js   # Comunicación con API
│   │   │   ├── EmailService.js      # Envío de emails
│   │   │   └── PDFService.js        # Generación de PDFs
│   │   ├── setupProxy.js     # ⭐ Backend Express integrado
│   │   │   # Contiene todos los endpoints API
│   │   │   # Maneja conexión PostgreSQL
│   │   │   # Lógica de cálculos y validaciones
│   │   │   # Generación de PDFs
│   │   │   # Envío de emails
│   │   └── database/         # Configuración PostgreSQL
│   ├── package.json          # Dependencias y scripts
│   └── .env                  # Variables de entorno
├── database/                 # Scripts SQL
│   ├── schema.sql           # 21 tablas principales
│   ├── seed_factores.sql    # Factores de emisión Colombia
│   ├── functions.sql        # Triggers y funciones automáticas
│   └── README_DATABASE.md   # Documentación técnica DB
└── README.md                # Este archivo
```

### 📋 Componentes React Principales

#### **setupProxy.js - Corazón del Sistema**
El archivo más importante que contiene toda la lógica backend:

```javascript
// Principales funcionalidades:
- Conexión PostgreSQL
- 15+ endpoints API
- Validaciones de datos
- Cálculos de emisiones
- Generación de códigos únicos
- Creación de PDFs
- Envío de emails
- Manejo de errores
```

#### **FormularioHuellaCarbono.js**
Calculadora de huella de carbono con 8 categorías:
- Combustibles sólidos, líquidos, gaseosos
- Consumo eléctrico
- Transporte aéreo
- Extintores y refrigerantes
- Validación en tiempo real
- Conexión con catálogos de factores

#### **FormularioAutogestion.js**
Sistema de autodiagnóstico empresarial:
- 210 preguntas estructuradas
- 6 bloques temáticos
- Cálculo automático de porcentajes
- Navegación secuencial
- Guardado automático de progreso

#### **DatabaseService.js**
Servicio de comunicación con API:
```javascript
// Métodos principales:
- calcularHuellaCarbono()
- guardarAutogestion()
- consultarPorCodigo()
- obtenerFactores()
- enviarEmail()
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar servidor desarrollo
npm run build         # Compilar para producción
npm test              # Ejecutar tests

# Base de datos
npm run db:check      # Verificar conexión
npm run db:backup     # Hacer respaldo

# Despliegue
npm run deploy        # Desplegar a GitHub Pages
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module 'pg'"
```bash
cd Landing
npm install pg
```

### Error: "password authentication failed"
- Verificar contraseña en archivo `.env`
- Confirmar que PostgreSQL esté ejecutándose

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
echo "PORT=3001" >> .env
```

### Error: "Database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE mies_group_env;"
```

---

## 📞 Soporte y Contacto

**Desarrollador:** Juan Pablo Orozco  
**Email:** juanpablo26orozco@gmail.com  
**WhatsApp:** +57 300 627 9039  
**Disponibilidad:** Lunes a Viernes, 8:00 AM - 6:00 PM

### Documentación Adicional Disponible

- **`database/README_DATABASE.md`** - Guía completa de base de datos
- **`IMPLEMENTATION_COMPLETE.md`** - Estado de implementación
- **`RESUMEN_IMPLEMENTACION_EMAIL.md`** - Configuración de emails

---

## 🎯 Lo Que Recibe Mies Group

### ✅ Sistema Completo Funcional
- [x] Aplicación web React completamente funcional
- [x] Base de datos PostgreSQL con 21 tablas
- [x] Calculadora de huella de carbono (8 categorías)
- [x] Autodiagnóstico de sostenibilidad (210 preguntas)
- [x] Generación automática de PDFs profesionales
- [x] Sistema de códigos únicos para trazabilidad
- [x] Envío de reportes por email

### ✅ Código Fuente y Configuración
- [x] Código fuente completo del frontend y backend
- [x] Scripts SQL para instalación de base de datos
- [x] Factores de emisión colombianos precargados
- [x] Configuración de variables de entorno
- [x] Documentación técnica completa

### ✅ Soporte Inicial
- [x] Instalación y configuración inicial
- [x] Resolución de problemas técnicos
- [x] Contacto directo con el desarrollador
- [x] Documentación para uso y mantenimiento

---

## ⚠️ Aspectos Legales y de Privacidad

**IMPORTANTE:** Mies Group debe implementar sus propias políticas de privacidad y términos legales según sus necesidades y jurisdicción. El sistema incluye:

- **Almacenamiento en base de datos** - Datos empresariales guardados localmente
- **Generación de códigos únicos** - Para trazabilidad interna
- **Envío de emails** - Configuración de SendGrid incluida
- **Sin autenticación de usuarios** - Sistema abierto para uso interno

**Mies Group es responsable de:**
- Políticas de privacidad propias
- Términos y condiciones de uso
- Compliance con normativas aplicables
- Backup y seguridad de datos
- Configuración de accesos y permisos

---

**🎉 PROYECTO ENTREGADO PARA MIES GROUP 🌱**

*Sistema de Gestión Ambiental - Listo para Uso*

**Fecha de Entrega:** Octubre 7, 2025  
**Desarrollado por:** Juan Pablo Orozco  
**Contacto:** +57 300 627 9039
