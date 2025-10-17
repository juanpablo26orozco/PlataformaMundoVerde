# 📚 Documentación Técnica - Plataforma Mundo Verde

## 🎯 Índice de Documentación

Esta carpeta contiene la documentación técnica completa del sistema. Lee los documentos en orden para comprender la implementación.

---

## 📖 Documentos Disponibles

### 1. [ARQUITECTURA_SISTEMA.md](./01_ARQUITECTURA_SISTEMA.md)
**Contenido:**
- Arquitectura monolítica React + Express
- Flujo de datos completo
- Estructura de archivos del proyecto
- Seguridad implementada
- Limitaciones actuales
- Métricas del sistema

**Para quién:** Desarrolladores que necesitan entender la arquitectura general

---

### 2. [DEPENDENCIAS_LIBRERIAS.md](./02_DEPENDENCIAS_LIBRERIAS.md)
**Contenido:**
- Todas las 35 dependencias del proyecto
- Configuración de cada librería
- Ejemplos de uso
- Versiones críticas
- Conflictos conocidos (Bootstrap 4 vs 5)
- Tamaños de bundle

**Para quién:** Desarrolladores que necesitan instalar o actualizar dependencias

---

### 3. [BASE_DATOS_POSTGRESQL.md](./03_BASE_DATOS_POSTGRESQL.md)
**Contenido:**
- 25 tablas del sistema (21 operativas + 4 legales)
- Esquema completo con columnas y tipos
- Funciones y triggers de PostgreSQL
- Sistema de códigos únicos (HC-YYYY-NNNNNN / AG-YYYY-NNNNNN)
- Índices de optimización
- Tablas GDPR/Ley 1581

**Para quién:** Desarrolladores que trabajan con la base de datos

---

### 4. [API_ENDPOINTS.md](./04_API_ENDPOINTS.md)
**Contenido:**
- 13 endpoints REST documentados
- Request/Response ejemplos completos
- Códigos de error y manejo
- Endpoints de huella de carbono
- Endpoints de autogestión
- Endpoints de catálogos
- Endpoints de email
- Endpoints legales (consentimiento)

**Para quién:** Desarrolladores frontend/backend, integradores

---

### 5. [COMPONENTES_REACT.md](./05_COMPONENTES_REACT.md)
**Contenido:**
- 30+ componentes React
- FormularioHuella.js (calculadora)
- FormularioAutogestion.js (210 preguntas)
- ModalPoliticas.js (GDPR)
- EmissionFactorsContext (caché 24h)
- Servicios y hooks personalizados
- Optimizaciones (React.memo, useMemo, useCallback)

**Para quién:** Desarrolladores React

---

### 6. [CORRECCION_HUELLA_2025-10-17.md](./06_CORRECCION_HUELLA_2025-10-17.md)
**Contenido:**
- Análisis del error `NaN` al guardar cálculos HC
- Normalización de datos en `/api/huella-carbono/guardar`
- Conversión de unidades y sanitización numérica
- Nuevo banner de código en `FormularioHuella`
- Pruebas manuales recomendadas post-fix

**Para quién:** Equipo de mantenimiento (frontend/backend)

---

## 🚀 Guía Rápida

### Para empezar desde cero:
1. Lee `ARQUITECTURA_SISTEMA.md` primero
2. Revisa `BASE_DATOS_POSTGRESQL.md` para entender la BD
3. Consulta `API_ENDPOINTS.md` para endpoints
4. Lee `COMPONENTES_REACT.md` para frontend

### Para instalar el proyecto:
1. `DEPENDENCIAS_LIBRERIAS.md` - Lista todas las librerías
2. Ejecuta scripts de `database/` para crear BD
3. Configura `.env` según `ARQUITECTURA_SISTEMA.md`

### Para integrar con API:
1. `API_ENDPOINTS.md` - Todos los endpoints documentados
2. Ejemplos de Request/Response incluidos

---

## 📊 Resumen Técnico

### Stack Tecnológico
- **Frontend:** React 18.3.1 + Reactstrap 9.2.3
- **Backend:** Express 5.1.0 (en setupProxy.js)
- **Base de Datos:** PostgreSQL 14+
- **PDF:** PDFKit 0.17.2
- **Email:** SendGrid 8.1.6
- **Gráficos:** Chart.js 4.5.0

### Arquitectura
- Monolítica (React + Express integrados)
- Sin autenticación (sistema público)
- Pool de conexiones PostgreSQL (2-10)
- Caché de 24h en localStorage

### Base de Datos
- 25 tablas (21 operativas + 4 legales)
- 66 factores de emisión precargados
- Códigos únicos con secuencias
- Transacciones ACID

### API REST
- 13 endpoints
- Sin autenticación
- Formato JSON
- Códigos HTTP estándar

### Componentes
- 30+ componentes React
- Context API para caché
- Hooks personalizados
- Optimizaciones con React.memo

---

## 🔍 Información Específica

### ¿Cómo funciona la calculadora de huella de carbono?
Ver: `COMPONENTES_REACT.md` → FormularioHuella.js  
Ver: `API_ENDPOINTS.md` → POST /api/guardar-huella

### ¿Cómo se guardan los 210 preguntas?
Ver: `BASE_DATOS_POSTGRESQL.md` → Tabla `calculos_autogestion`  
Ver: `COMPONENTES_REACT.md` → FormularioAutogestion.js  
**Respuesta:** 1 registro único con PDF embebido en BYTEA

### ¿Cómo se generan los códigos HC-2025-000001?
Ver: `BASE_DATOS_POSTGRESQL.md` → Función `generar_codigo_seguimiento()`  
**Respuesta:** Secuencias PostgreSQL automáticas

### ¿Cómo funciona el caché de factores de emisión?
Ver: `COMPONENTES_REACT.md` → EmissionFactorsContext  
**Respuesta:** localStorage por 24 horas

### ¿Qué tablas son de GDPR?
Ver: `BASE_DATOS_POSTGRESQL.md` → Tablas Legales  
**Respuesta:** 
- `consentimientos_usuario`
- `historial_politicas`
- `log_acceso_datos`
- `solicitudes_eliminacion`

### ¿Hay autenticación?
**Respuesta:** NO. Sistema público sin login/JWT.

---

## 📝 Notas Importantes

### ⚠️ Limitaciones Conocidas
1. **NO hay autenticación** - Sistema completamente público
2. **NO hay panel administrativo** - Consultas solo por código o BD
3. **Conflicto Bootstrap 4 vs 5** - Usar solo Reactstrap

### ✅ Características Implementadas
1. ✅ Calculadora de Huella de Carbono (8 categorías)
2. ✅ Autodiagnóstico de 210 preguntas
3. ✅ PostgreSQL con 25 tablas
4. ✅ Códigos únicos de seguimiento
5. ✅ PDFs con PDFKit
6. ✅ Email con SendGrid
7. ✅ Sistema de consentimiento GDPR/Ley 1581
8. ✅ Caché de factores de emisión (24h)

### 🔮 Mejoras Futuras (NO IMPLEMENTADAS)
1. ❌ Sistema de autenticación
2. ❌ Panel administrativo
3. ❌ Exportación a Excel
4. ❌ Notificaciones automáticas
5. ❌ Comparativas y benchmarking

---

## 🆘 Soporte

**Desarrollador:** Juan Pablo Orozco  
**Email:** juanpablo26orozco@gmail.com  
**WhatsApp:** +57 300 627 9039  
**GitHub:** [@juanpablo26orozco](https://github.com/juanpablo26orozco)

**Cliente:** Cámara de Comercio de Manizales  
**Proyecto:** Plataforma Mundo Verde  
**Fecha Entrega:** Octubre 7, 2025  
**Estado:** ✅ COMPLETADO Y FUNCIONAL

---

## 📅 Actualizaciones

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-10-09 | 1.0.0 | Documentación técnica completa creada |
| 2025-10-07 | 2.3.0 | Proyecto completado y entregado |

---

## 📂 Estructura de esta Carpeta

```
docs/
├── 00_INDICE.md                          ⭐ ESTE ARCHIVO
├── 01_ARQUITECTURA_SISTEMA.md            Arquitectura monolítica
├── 02_DEPENDENCIAS_LIBRERIAS.md          35 dependencias documentadas
├── 03_BASE_DATOS_POSTGRESQL.md           25 tablas + funciones
├── 04_API_ENDPOINTS.md                   13 endpoints REST
└── 05_COMPONENTES_REACT.md               30+ componentes
```

---

## 🎓 Recomendaciones de Lectura

### Si eres nuevo en el proyecto:
1. `00_INDICE.md` (este archivo) ← **Estás aquí**
2. `01_ARQUITECTURA_SISTEMA.md`
3. `03_BASE_DATOS_POSTGRESQL.md`
4. Los demás según necesites

### Si solo necesitas consultar algo específico:
- Usa el índice de arriba para encontrar tu tema
- Cada documento tiene tabla de contenidos

### Si vas a hacer mantenimiento:
- Lee todos los documentos en orden
- Presta atención a "Limitaciones" y "Conflictos Conocidos"

---

**Última actualización:** Octubre 9, 2025  
**Versión Documentación:** 1.0.0  
**Versión Proyecto:** 2.3.0
