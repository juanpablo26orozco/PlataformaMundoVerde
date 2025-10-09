# 🔌 API Endpoints - Plataforma Mundo Verde

## 📋 Tabla de Contenidos

1. [Resumen de Endpoints](#resumen)
2. [Endpoints de Huella de Carbono](#huella-carbono)
3. [Endpoints de Autogestión](#autogestion)
4. [Endpoints de Catálogos](#catalogos)
5. [Endpoints de Email](#email)
6. [Endpoints Legales](#legales)
7. [Códigos de Error](#errores)

---

## 📊 Resumen de Endpoints

**Total:** 13 endpoints activos  
**Base URL desarrollo:** `http://localhost:3000`  
**Base URL producción:** `https://juanpablo26orozco.github.io/PlataformaMundoVerde`

### Por tipo de operación

**POST (6):**
- `/api/guardar-huella`
- `/api/guardar-autogestion`
- `/api/send-email`
- `/api/send-email-autogestion`
- `/api/generar-pdf-autogestion`
- `/api/consentimiento`

**GET (7):**
- `/api/obtener-calculo/:codigo`
- `/api/descargar-pdf-autogestion/:codigo`
- `/api/descargar-pdf-autogestion-bd/:codigo`
- `/api/catalogos/combustibles`
- `/api/factor-electricidad/:pais/:año`
- `/api/estadisticas`
- `/api/factores/todos`

---

## 🌱 Endpoints de Huella de Carbono

### 1. Guardar Cálculo de Huella de Carbono

```http
POST /api/guardar-huella
Content-Type: application/json
```

**Request Body:**
```json
{
  "datosEmpresa": {
    "nombreEmpresa": "Mundo Verde S.A.S.",
    "nit": "900123456-7",
    "sector": "Servicios",
    "departamento": "Cundinamarca",
    "municipio": "Bogotá",
    "direccion": "Calle 100 #10-20",
    "telefono": "3001234567",
    "correo": "contacto@mundoverde.com",
    "personaElabora": "Juan Pérez",
    "cargo": "Gerente Ambiental"
  },
  "fecha": "2025-10-09",
  "añoReporte": 2025,
  "solidos": [
    {
      "tipo": "Carbón Bituminoso",
      "consumoAnual": 1000,
      "factores": {
        "poderCalorifico": 25.80,
        "factorCO2": 94600,
        "factorCH4": 1.0,
        "factorN2O": 1.5
      }
    }
  ],
  "liquidos": [
    {
      "tipo": "Gasolina corriente",
      "tipoFuente": "Móvil",
      "consumoAnual": 5000,
      "factores": {
        "densidad": 0.74,
        "poderCalorifico": 43.02,
        "factorCO2": 69300
      }
    }
  ],
  "gaseosos": [],
  "electricidad": [
    {
      "nombreInstalacion": "Oficina Principal",
      "año": 2025,
      "consumoMensual": {
        "enero": 500,
        "febrero": 520,
        "marzo": 510,
        "abril": 530,
        "mayo": 540,
        "junio": 550,
        "julio": 560,
        "agosto": 570,
        "septiembre": 550,
        "octubre": 540,
        "noviembre": 530,
        "diciembre": 520
      },
      "factorEmision": 0.391,
      "pais": "Colombia"
    }
  ],
  "vuelos": [
    {
      "origen": "Bogotá",
      "destino": "Madrid",
      "clase": "Economica",
      "distancia": 8300,
      "pasajeros": 2
    }
  ],
  "extintores": [],
  "totalEmisiones": 85.5
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "codigo": "HC-2025-000001",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "emisiones": {
    "emisiones_alcance_1": 65.2,
    "emisiones_alcance_2": 10.6,
    "emisiones_alcance_3": 9.7,
    "emisiones_totales": 85.5
  },
  "fecha_creacion": "2025-10-09T15:30:45.123Z",
  "mensaje": "Huella de carbono guardada exitosamente"
}
```

**Response 400 Bad Request:**
```json
{
  "success": false,
  "error": "Datos incompletos",
  "mensaje": "Faltan datos de empresa"
}
```

**Response 500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Error al guardar en base de datos",
  "details": "Connection timeout"
}
```

---

### 2. Consultar Cálculo por Código

```http
GET /api/obtener-calculo/HC-2025-000001
```

**Response 200 OK (Huella de Carbono):**
```json
{
  "success": true,
  "tipo": "huella_carbono",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo_seguimiento": "HC-2025-000001",
    "nombre_empresa": "Mundo Verde S.A.S.",
    "nit": "900123456-7",
    "sector": "Servicios",
    "departamento": "Cundinamarca",
    "municipio": "Bogotá",
    "fecha_reporte": "2025-10-09",
    "año_reporte": 2025,
    "emisiones_alcance_1": 65.2,
    "emisiones_alcance_2": 10.6,
    "emisiones_alcance_3": 9.7,
    "emisiones_totales": 85.5,
    "nivel_evaluacion": "Aceptable",
    "arboles_compensar": 192,
    "fecha_creacion": "2025-10-09T15:30:45.123Z",
    "combustibles_solidos": [ /* array de registros */ ],
    "combustibles_liquidos": [ /* array de registros */ ],
    "consumo_electricidad": [ /* array de registros */ ],
    "vuelos_aereos": [ /* array de registros */ ]
  }
}
```

**Response 200 OK (Autogestión):**
```json
{
  "success": true,
  "tipo": "autogestion",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "codigo_seguimiento": "AG-2025-000001",
    "nombre_empresa": "Mundo Verde S.A.S.",
    "nit": "900123456-7",
    "resumen_ejecutivo": {
      "porcentajeEconomico": 85.5,
      "porcentajeAmbiental": 78.2,
      "porcentajeEnergia": 82.0,
      "porcentajeSeguridad": 90.1,
      "porcentajeSocial": 75.5,
      "porcentajeAlmacen": 80.0,
      "porcentajeFinal": 81.8,
      "nivelCumplimiento": "Bueno"
    },
    "tiene_pdf": true,
    "fecha_creacion": "2025-10-09T16:00:00.000Z"
  }
}
```

**Response 404 Not Found:**
```json
{
  "success": false,
  "error": "Código no encontrado",
  "mensaje": "No existe ningún cálculo con el código HC-2025-999999"
}
```

---

## 📋 Endpoints de Autogestión

### 3. Guardar Autodiagnóstico

```http
POST /api/guardar-autogestion
Content-Type: application/json
```

**Request Body:**
```json
{
  "datosEmpresa": {
    "nombreEmpresa": "Mundo Verde S.A.S.",
    "nit": "900123456-7",
    "correo": "contacto@mundoverde.com"
  },
  "respuestas": [
    {
      "seccion": "A",
      "bloque": "A1",
      "preguntaId": "A_q_1",
      "respuesta": "IMP",
      "puntaje": 3
    },
    // ... 209 respuestas más
  ],
  "promedios": {
    "A": {
      "porcentajeFinal": 85.5,
      "totalPreguntas": 26,
      "puntajeObtenido": 67
    },
    "B": { "porcentajeFinal": 78.2 },
    "C": { "porcentajeFinal": 82.0 },
    "D": { "porcentajeFinal": 90.1 },
    "E": { "porcentajeFinal": 75.5 },
    "F": { "porcentajeFinal": 80.0 }
  },
  "porcentajeFinal": 81.8,
  "esquemas": { /* estructura de bloques */ },
  "opciones": { /* opciones de respuesta */ }
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "codigo": "AG-2025-000001",
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "resultados": {
    "porcentaje_economico": 85.5,
    "porcentaje_ambiental": 78.2,
    "porcentaje_energia": 82.0,
    "porcentaje_seguridad": 90.1,
    "porcentaje_social": 75.5,
    "porcentaje_almacen": 80.0,
    "porcentaje_final": 81.8,
    "nivel_cumplimiento": "Bueno"
  },
  "pdf_guardado": true,
  "pdf_size": 156789,
  "fecha_creacion": "2025-10-09T16:00:00.000Z",
  "mensaje": "Autodiagnóstico guardado exitosamente con PDF embebido"
}
```

---

### 4. Descargar PDF de Autogestión (desde BD)

```http
GET /api/descargar-pdf-autogestion-bd/AG-2025-000001
```

**Response 200 OK:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="autogestion-AG-2025-000001.pdf"

<Buffer PDF de 156KB>
```

**Response 404:**
```json
{
  "success": false,
  "error": "PDF no encontrado",
  "mensaje": "No hay PDF almacenado para el código AG-2025-000001"
}
```

---

### 5. Generar PDF de Autogestión (regenerar)

```http
POST /api/generar-pdf-autogestion
Content-Type: application/json
```

**Request Body:** (igual que `/api/guardar-autogestion`)

**Response 200 OK:**
```
Content-Type: application/pdf

<Buffer PDF generado al vuelo>
```

---

## 📚 Endpoints de Catálogos

### 6. Obtener Catálogos de Combustibles

```http
GET /api/catalogos/combustibles
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "solidos": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "nombre": "Carbón Genérico",
        "poder_calorifico": 28.76,
        "factor_co2": 88136.063,
        "factor_ch4": 1.0,
        "factor_n2o": 1.5,
        "factor_so2": 0.7,
        "unidad": "kg",
        "fuente": "IPCC 2006"
      }
      // ... 24 más
    ],
    "liquidos": [
      {
        "nombre": "Gasolina corriente",
        "densidad": 0.740,
        "poder_calorifico": 43.02,
        "factor_co2": 69300,
        "unidad": "litros",
        "fuente": "IPCC 2006"
      }
      // ... 15 más
    ],
    "gaseosos": [
      {
        "nombre": "Gas Natural",
        "poder_calorifico": 38.00,
        "factor_co2": 56100,
        "unidad": "m³",
        "fuente": "IPCC 2006"
      }
      // ... 10 más
    ]
  },
  "totales": {
    "solidos": 25,
    "liquidos": 16,
    "gaseosos": 11,
    "total": 52
  },
  "fecha_consulta": "2025-10-09T17:00:00.000Z"
}
```

---

### 7. Factor de Electricidad por País

```http
GET /api/factor-electricidad/Colombia/2024
```

**Response 200 OK:**
```json
{
  "success": true,
  "factor": 0.391,
  "pais": "Colombia",
  "año": 2024,
  "unidad": "kg CO₂/kWh",
  "fuente": "UPME (Unidad de Planeación Minero Energética)",
  "fecha_consulta": "2025-10-09T17:05:00.000Z"
}
```

**Con valores por defecto:**
```http
GET /api/factor-electricidad
GET /api/factor-electricidad/Colombia
```

Retorna factor de Colombia para año actual.

---

### 8. Estadísticas Generales

```http
GET /api/estadisticas
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "totalCalculosHuella": 45,
    "totalCalculosAutogestion": 23,
    "totalEmpresas": 38,
    "totalEmisionesTonCO2": 1250.5,
    "promedioEmisionesEmpresa": 32.9,
    "ultimoCodigoHuella": "HC-2025-000045",
    "ultimoCodigoAutogestion": "AG-2025-000023",
    "sectoresRepresentados": [
      "Servicios",
      "Manufactura",
      "Comercio"
    ]
  },
  "fecha_consulta": "2025-10-09T17:10:00.000Z"
}
```

---

### 9. Todos los Factores (Caché)

```http
GET /api/factores/todos
```

**Uso:** Para caché de 24h en localStorage  
**Response:** Igual que `/api/catalogos/combustibles` + factores eléctricos

---

## 📧 Endpoints de Email

### 10. Enviar Email con Reporte Huella de Carbono

```http
POST /api/send-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "usuario@empresa.com",
  "empresa": "Mundo Verde S.A.S.",
  "codigo": "HC-2025-000001",
  "emisiones": 85.5,
  "pdfBase64": "JVBERi0xLjQKJeLjz9MKMy...",
  "fecha": "2025-10-09"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "mensaje": "Email enviado exitosamente a usuario@empresa.com",
  "messageId": "abc123def456",
  "fecha_envio": "2025-10-09T17:15:00.000Z"
}
```

**Response 500 (SendGrid Error):**
```json
{
  "success": false,
  "error": "Error al enviar email",
  "details": "Invalid API key"
}
```

---

### 11. Enviar Email con Reporte Autogestión

```http
POST /api/send-email-autogestion
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "usuario@empresa.com",
  "empresa": "Mundo Verde S.A.S.",
  "codigo": "AG-2025-000001",
  "porcentajeFinal": 81.8,
  "pdfBase64": "JVBERi0xLjQKJeLjz9MKMy..."
}
```

**Response:** Igual formato que `/api/send-email`

---

## 🔒 Endpoints Legales

### 12. Registrar Consentimiento

```http
POST /api/consentimiento
Content-Type: application/json
```

**Request Body:**
```json
{
  "acepta_terminos": true,
  "acepta_privacidad": true,
  "acepta_cookies_necesarias": true,
  "acepta_cookies_analiticas": false,
  "acepta_emails_promocionales": false,
  "email_usuario": "usuario@empresa.com",
  "nombre_usuario": "Juan Pérez"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "fecha_aceptacion": "2025-10-09T17:20:00.000Z",
  "version_terminos": "v1.0",
  "version_privacidad": "v1.0",
  "ip_address": "192.168.1.100",
  "navegador": "Chrome 120",
  "sistema_operativo": "Windows 10",
  "mensaje": "Consentimiento registrado exitosamente"
}
```

**Detección automática:**
- IP del cliente
- User Agent completo
- Navegador y versión
- Sistema operativo

---

## ❌ Códigos de Error

### Códigos HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 400 | Bad Request | Datos inválidos o incompletos |
| 404 | Not Found | Código de seguimiento no existe |
| 500 | Internal Server Error | Error de BD o servidor |
| 502 | Bad Gateway | PostgreSQL no responde |

### Estructura de Error

```json
{
  "success": false,
  "error": "Tipo de error",
  "mensaje": "Descripción legible para humanos",
  "details": "Detalles técnicos (solo en desarrollo)",
  "code": "ERROR_CODE_INTERNO"
}
```

### Errores Comunes

**Error de conexión BD:**
```json
{
  "success": false,
  "error": "Database connection failed",
  "mensaje": "No se pudo conectar a la base de datos",
  "code": "DB_CONNECTION_ERROR"
}
```

**Código no encontrado:**
```json
{
  "success": false,
  "error": "Código no encontrado",
  "mensaje": "No existe ningún cálculo con el código HC-2025-999999",
  "code": "NOT_FOUND"
}
```

**Datos incompletos:**
```json
{
  "success": false,
  "error": "Validation error",
  "mensaje": "Faltan campos obligatorios: nombreEmpresa, nit",
  "code": "VALIDATION_ERROR",
  "campos_faltantes": ["nombreEmpresa", "nit"]
}
```

---

## 🔐 Autenticación

**⚠️ NO IMPLEMENTADA**

Actualmente la API es **pública** sin autenticación. Cualquiera puede:
- ✅ Crear cálculos
- ✅ Consultar por código
- ✅ Descargar PDFs

**Futura implementación recomendada:**
- JWT tokens
- API keys por empresa
- Rate limiting

---

**Última actualización:** Octubre 9, 2025  
**Versión API:** 1.0.0  
**Total endpoints:** 13
