# 📦 Dependencias y Librerías - Plataforma Mundo Verde

## 📋 Tabla de Contenidos

1. [Dependencias Principales](#dependencias-principales)
2. [Dependencias de Desarrollo](#dependencias-desarrollo)
3. [Configuración de Cada Librería](#configuración)
4. [Versiones Críticas](#versiones-críticas)

---

## 🎯 Dependencias Principales

### React & Ecosistema

#### `react` v18.3.1
**Propósito:** Framework principal del frontend  
**Uso:**
```javascript
import React, { useState, useEffect } from 'react';
```
**Características usadas:**
- Hooks (useState, useEffect, useContext, useRef)
- Context API (EmissionFactorsContext)
- Componentes funcionales
- React.memo para optimización

---

#### `react-dom` v18.3.1
**Propósito:** Renderizado en el DOM  
**Uso:**
```javascript
import ReactDOM from 'react-dom/client';
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

#### `react-router-dom` v6.28.0
**Propósito:** Navegación entre páginas  
**Uso:**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/calculadora" element={<HuellaCarbono />} />
  <Route path="/autogestion" element={<AutogestionPage />} />
</Routes>
```

**Rutas configuradas:**
- `/` - Landing Page
- `/calculadora` - Huella de Carbono
- `/autogestion` - Autodiagnóstico
- `/about` - Acerca de
- `/servicios` - Servicios

---

#### `react-scripts` v5.0.1
**Propósito:** Scripts de Create React App  
**Comandos:**
```json
{
  "start": "react-scripts start",    // Puerto 3000
  "build": "react-scripts build",    // Producción
  "test": "react-scripts test"       // Jest testing
}
```

---

### Backend & Base de Datos

#### `express` v5.1.0
**Propósito:** Servidor HTTP + API REST  
**Ubicación:** `setupProxy.js`  
**Configuración:**
```javascript
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));

// 13 endpoints API
app.post('/api/guardar-huella', async (req, res) => { ... });
app.get('/api/catalogos/combustibles', async (req, res) => { ... });
```

**Endpoints implementados:** 13 (ver ARQUITECTURA_SISTEMA.md)

---

#### `pg` v8.16.3
**Propósito:** Driver PostgreSQL para Node.js  
**Ubicación:** `database/config.js`  
**Configuración:**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mundoverde_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  min: 2,        // Mínimo 2 conexiones
  max: 10,       // Máximo 10 conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});
```

**Características usadas:**
- Pool de conexiones reutilizables
- Prepared statements (prevención SQL injection)
- Transacciones ACID
- Conexión SSL/TLS opcional

**Ejemplo de uso:**
```javascript
// Query simple
const result = await pool.query('SELECT * FROM calculos_huella_carbono');

// Prepared statement
const result = await pool.query(
  'SELECT * FROM calculos_huella_carbono WHERE codigo_seguimiento = $1',
  ['HC-2025-000001']
);

// Transacción
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO ...');
  await client.query('INSERT INTO ...');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

---

#### `dotenv` v17.2.3
**Propósito:** Variables de entorno  
**Ubicación:** Carga `.env` al inicio  
**Variables configuradas:**
```bash
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundoverde_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxx
SENDER_EMAIL=noreply@mundoverde.com

# Empresa
REACT_APP_COMPANY_NAME=Mundo Verde
REACT_APP_COMPANY_EMAIL=contacto@mundoverde.com
REACT_APP_WHATSAPP_NUMBER=573001234567
```

---

#### `cors` v2.8.5
**Propósito:** Cross-Origin Resource Sharing  
**Uso:**
```javascript
const cors = require('cors');
app.use(cors());
```

---

### Generación de PDFs

#### `pdfkit` v0.17.2
**Propósito:** Generación de PDFs en backend  
**Ubicación:** `setupProxy.js` (líneas 514-680)  
**Uso:**
```javascript
const PDFDocument = require('pdfkit');

async function generateAssessmentPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: 40, 
      size: 'LETTER' 
    });
    
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    
    // Header
    doc.fontSize(24)
       .fillColor('#43a047')
       .text('SUSTAINABILITY SELF-ASSESSMENT', { align: 'center' });
    
    // Content
    doc.fontSize(11)
       .fillColor('#000')
       .text('Company: ' + data.empresa.nombre);
    
    // Finalize
    doc.end();
  });
}
```

**Características usadas:**
- Fuentes y colores
- Tablas personalizadas
- Gráficos (líneas, rectángulos)
- Múltiples páginas
- Encabezados y pies de página

**PDFs generados:**
1. **Huella de Carbono:** 15-20 páginas
2. **Autodiagnóstico:** 210 páginas (1 por pregunta + resumen)

---

#### `jspdf` v3.0.3
**Propósito:** Generación de PDFs en frontend (LEGACY - NO USADO)  
**Estado:** Instalado pero no implementado actualmente

---

### UI & Diseño

#### `reactstrap` v9.2.3
**Propósito:** Componentes Bootstrap 4 para React  
**⚠️ IMPORTANTE:** Usa Bootstrap 4, NO Bootstrap 5  
**Componentes usados:**
```javascript
import {
  Container, Row, Col,
  Button, Input, Label, Form, FormGroup,
  Card, CardBody, CardTitle, CardText,
  Nav, NavItem, NavLink,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Table, Progress, Badge, Alert
} from 'reactstrap';
```

**Ejemplo:**
```jsx
<Container>
  <Row>
    <Col md="6">
      <Card>
        <CardBody>
          <CardTitle>Huella de Carbono</CardTitle>
          <Button color="success">Calcular</Button>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
```

---

#### `bootstrap` v5.3.3
**Propósito:** Estilos CSS (solo para compatibilidad)  
**⚠️ CONFLICTO:** Reactstrap usa Bootstrap 4, pero está instalado Bootstrap 5  
**Solución:** Usar solo componentes de Reactstrap, no mezclar

---

#### `feather-icons-react` v0.7.0
**Propósito:** Iconos SVG minimalistas  
**Uso:**
```javascript
import FeatherIcon from 'feather-icons-react';

<FeatherIcon icon="check-circle" size={24} color="green" />
<FeatherIcon icon="alert-triangle" size={20} />
```

**Iconos usados:**
- `check-circle` - Éxito
- `alert-triangle` - Advertencia
- `info` - Información
- `users` - Usuarios
- `globe` - Global
- `bar-chart` - Estadísticas

---

#### `chart.js` v4.5.0
**Propósito:** Gráficos interactivos  
**Ubicación:** `EmisionesGEIChart.js`  
**Uso:**
```javascript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Gráfico de dona
const config = {
  type: 'doughnut',
  data: {
    labels: ['Alcance 1', 'Alcance 2', 'Alcance 3'],
    datasets: [{
      data: [45.2, 10.6, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  }
};

new Chart(ctx, config);
```

**Gráficos implementados:**
- **Dona:** Distribución de emisiones por alcance
- **Barras:** Comparación de categorías

---

### Email

#### `@sendgrid/mail` v8.1.6
**Propósito:** Envío de emails  
**Configuración:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'usuario@empresa.com',
  from: process.env.SENDER_EMAIL,
  subject: 'Reporte Huella de Carbono',
  text: 'Adjunto encontrarás tu reporte',
  attachments: [
    {
      content: pdfBase64,
      filename: 'huella-carbono-HC-2025-000001.pdf',
      type: 'application/pdf',
      disposition: 'attachment'
    }
  ]
};

await sgMail.send(msg);
```

**Emails enviados:**
1. Reporte de Huella de Carbono con PDF adjunto
2. Reporte de Autodiagnóstico con PDF adjunto

---

### Internacionalización

#### `i18next` v25.5.2
**Propósito:** Sistema de traducción (NO COMPLETAMENTE IMPLEMENTADO)  
**Estado:** Instalado pero solo español activo

#### `react-i18next` v16.0.0
**Propósito:** Integración i18next con React  
**Estado:** Preparado para futuro multilenguaje

---

### Utilidades

#### `http-proxy-middleware` v3.0.5
**Propósito:** Proxy para desarrollo (Create React App)  
**Ubicación:** `setupProxy.js` exporta configuración

---

#### `sass` v1.77.6
**Propósito:** Preprocesador CSS  
**Ubicación:** Archivos `.scss` en componentes  
**Ejemplo:**
```scss
// src/assets/scss/_variables.scss
$primary-color: #43a047;
$secondary-color: #2e7d32;
$font-family: 'Roboto', sans-serif;
```

---

#### `html2canvas` v1.4.1
**Propósito:** Capturas de pantalla (NO USADO ACTUALMENTE)  
**Estado:** Instalado pero no implementado

---

### Testing

#### `@testing-library/react` v16.0.1
**Propósito:** Testing de componentes React  
**Ejemplo:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

#### `@testing-library/jest-dom` v6.6.3
**Propósito:** Matchers de Jest para DOM

---

#### `@testing-library/user-event` v14.5.2
**Propósito:** Simulación de eventos de usuario

---

## 🔧 Dependencias de Desarrollo

#### `gh-pages` v6.3.0
**Propósito:** Deploy a GitHub Pages  
**Script:**
```json
{
  "predeploy": "yarn build",
  "deploy": "gh-pages -d build"
}
```

---

## ⚠️ Versiones Críticas

### Compatibilidad React 18
**Requiere:**
- `react` v18.3.1
- `react-dom` v18.3.1
- `react-scripts` v5.0.1+
- Componentes compatibles con Concurrent Mode

### Compatibilidad PostgreSQL
**Requiere:**
- PostgreSQL 14.0 o superior
- `pg` v8.16.3
- Función `uuid_generate_v4()` (extensión `uuid-ossp`)

### Compatibilidad Node.js
**Requiere:**
- Node.js 18.0 o superior
- npm 8.0+ o yarn 1.22+

---

## 🚨 Conflictos Conocidos

### Bootstrap 4 vs 5
```
reactstrap v9.2.3 → Bootstrap 4
bootstrap v5.3.3 → Bootstrap 5
```

**Problema:** Clases incompatibles  
**Solución actual:** Usar solo Reactstrap, ignorar Bootstrap 5

---

## 📊 Tamaños de Bundle

| Librería | Tamaño (min+gzip) | Impacto |
|----------|-------------------|---------|
| `react` + `react-dom` | ~130 KB | Alto |
| `chart.js` | ~54 KB | Medio |
| `reactstrap` | ~45 KB | Medio |
| `pdfkit` | ~180 KB | Alto |
| `pg` | ~80 KB | Solo backend |

**Bundle final producción:** ~1.2 MB (optimizado)

---

## 🔄 Comandos de Instalación

### Instalación completa
```bash
cd Landing
npm install
```

### Instalar dependencia específica
```bash
npm install pg@8.16.3
npm install pdfkit@0.17.2
npm install @sendgrid/mail@8.1.6
```

### Actualizar dependencias
```bash
npm update          # Actualizaciones menores
npm outdated        # Ver versiones disponibles
```

---

**Última actualización:** Octubre 9, 2025  
**Versión:** 2.3.0  
**Total dependencias:** 35 (31 producción + 4 desarrollo)
