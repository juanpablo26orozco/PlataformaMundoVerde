# 🛡️ TABLAS DE PRIVACIDAD Y TRATAMIENTO DE DATOS

## ✅ IMPLEMENTACIÓN COMPLETADA EN BASE DE DATOS

---

## 📊 RESUMEN EJECUTIVO

Se han implementado **4 tablas adicionales** para cumplir con:
- ✅ **GDPR** (Reglamento General de Protección de Datos - Unión Europea)
- ✅ **Ley 1581 de 2012** (Protección de Datos Personales - Colombia)
- ✅ **LOPD** (Ley Orgánica de Protección de Datos)

**Total de tablas en el sistema**: 21
- 17 tablas operativas (huella de carbono, autogestión, catálogos)
- **4 tablas legales** (privacidad y cumplimiento)

---

## 📋 TABLAS IMPLEMENTADAS

### 1️⃣ **consentimientos_usuario**

**Propósito**: Registrar todos los consentimientos otorgados por usuarios

**Cumplimiento Legal**:
- GDPR Art. 7 (Condiciones para el consentimiento)
- Ley 1581 de 2012 Art. 9 (Autorización del titular)

**Características**:
```sql
✅ 23 columnas
✅ Registro de consentimientos múltiples:
   - Términos y Condiciones
   - Política de Privacidad
   - Cookies (necesarias, analíticas, marketing)
   - Emails promocionales
✅ Versionado de documentos aceptados
✅ Auditoría legal (IP, user agent, timestamp)
✅ Gestión de revocación de consentimientos
✅ Índices optimizados para búsquedas
```

**Datos Almacenados**:
| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| `email_usuario` | Email del usuario | Sí |
| `acepta_terminos` | Aceptación T&C | Sí |
| `acepta_privacidad` | Aceptación política | Sí |
| `acepta_cookies_necesarias` | Cookies funcionales | Sí (siempre true) |
| `acepta_cookies_analiticas` | Google Analytics | Opcional |
| `acepta_cookies_marketing` | Publicidad | Opcional |
| `acepta_emails_promocionales` | Newsletter | Opcional |
| `version_terminos` | Versión aceptada (v1.0) | Sí |
| `version_privacidad` | Versión aceptada (v1.0) | Sí |
| `ip_address` | IP del usuario | Auditoría |
| `user_agent` | Navegador/SO | Auditoría |
| `fecha_consentimiento` | Cuándo aceptó | Sí |
| `consentimiento_revocado` | Si revocó | No (default false) |
| `fecha_revocacion` | Cuándo revocó | Opcional |

**Constraint de Validación**:
```sql
CHECK (acepta_terminos = true AND acepta_privacidad = true)
-- Ambos consentimientos obligatorios deben estar aceptados
```

---

### 2️⃣ **historial_politicas**

**Propósito**: Almacenar versiones históricas de documentos legales

**Cumplimiento Legal**:
- GDPR Art. 13 (Información que deberá facilitarse)
- Ley 1581 Art. 12 (Deber de informar)

**Características**:
```sql
✅ 14 columnas
✅ Múltiples tipos de políticas:
   - TERMINOS (Términos y Condiciones)
   - PRIVACIDAD (Política de Privacidad)
   - COOKIES (Política de Cookies)
   - CONFIDENCIALIDAD (Avisos específicos)
✅ Control de versiones (v1.0, v1.1, v2.0, etc.)
✅ Contenido completo de cada versión
✅ Fechas de vigencia
✅ Estado activo/inactivo
✅ Trazabilidad de cambios
```

**Datos Preinstalados**:
```
✅ Términos y Condiciones v1.0 (vigente desde 03/10/2025)
✅ Política de Privacidad v1.0 (vigente desde 03/10/2025)
✅ Política de Cookies v1.0 (vigente desde 03/10/2025)
```

**Uso**:
- Cuando un usuario acepta términos, se asocia a una versión específica
- Si se actualizan políticas, se crea nueva versión
- Se puede demostrar qué versión aceptó cada usuario en cada momento

---

### 3️⃣ **log_acceso_datos**

**Propósito**: Auditoría de accesos a datos sensibles

**Cumplimiento Legal**:
- GDPR Art. 30 (Registro de actividades de tratamiento)
- ISO 27001 (Gestión de seguridad de la información)

**Características**:
```sql
✅ 17 columnas
✅ Registro de TODAS las operaciones:
   - VIEW (ver datos)
   - VIEW_ALL (ver listados)
   - EXPORT (exportar)
   - EXPORT_PDF / EXPORT_JSON
   - DELETE / DELETE_ALL
   - MODIFY / CREATE
   - DOWNLOAD / SHARE / PRINT
✅ Tipos de datos registrados:
   - DATOS_EMPRESA
   - CALCULO_HUELLA
   - CALCULO_AUTOGESTION
   - COMBUSTIBLES, ELECTRICIDAD, VUELOS, EXTINTORES
   - RESPUESTAS_AUTOGESTION
   - DOCUMENTOS_PDF, REPORTES
   - DATOS_PERSONALES
   - CONSENTIMIENTOS
   - PERFIL_USUARIO
✅ Metadata de auditoría:
   - IP address
   - User agent
   - Timestamp
   - Endpoint accedido
   - Resultado de la operación
```

**Ejemplo de Registro**:
```json
{
  "usuario_id": "uuid-123",
  "email_usuario": "empresa@ejemplo.com",
  "accion": "EXPORT_PDF",
  "tipo_dato": "CALCULO_HUELLA",
  "descripcion": "Exportación de reporte HC-2025-000123",
  "ip_address": "192.168.1.100",
  "fecha_acceso": "2025-10-03T14:30:00Z",
  "resultado": "SUCCESS"
}
```

**Retención**: 2 años (según política)

---

### 4️⃣ **solicitudes_eliminacion**

**Propósito**: Gestión de solicitudes de eliminación de datos (Derecho al Olvido)

**Cumplimiento Legal**:
- GDPR Art. 17 (Derecho de supresión "derecho al olvido")
- Ley 1581 Art. 15 (Derecho de supresión)

**Características**:
```sql
✅ 21 columnas
✅ Tipos de eliminación:
   - CUENTA_COMPLETA
   - CALCULOS_ESPECIFICOS
   - DATOS_EMPRESA
   - CONSENTIMIENTOS
   - HISTORIAL_COMPLETO
   - DATOS_PERSONALES
✅ Estados del proceso:
   - PENDIENTE
   - EN_REVISION
   - APROBADA
   - PROCESANDO
   - COMPLETADA
   - RECHAZADA
   - CANCELADA
✅ SLA Legal automático: 30 días
✅ Prioridades: BAJA, NORMAL, ALTA, URGENTE
✅ Trazabilidad completa del proceso
✅ Evidencia de eliminación (hash, certificado)
```

**Flujo de Procesamiento**:
```
1. Usuario solicita eliminación
   ↓
2. Sistema registra solicitud (estado: PENDIENTE)
   ↓
3. Trigger calcula fecha_limite_legal (+30 días)
   ↓
4. Admin revisa solicitud (estado: EN_REVISION)
   ↓
5. Admin aprueba (estado: APROBADA)
   ↓
6. Sistema procesa eliminación (estado: PROCESANDO)
   ↓
7. Eliminación completada (estado: COMPLETADA)
   ↓
8. Se genera certificado de eliminación
   ↓
9. Usuario notificado por email
```

---

## ⚡ TRIGGERS AUTOMÁTICOS

### Trigger 1: `actualizar_updated_at()`
**Aplicado a**: `consentimientos_usuario`, `historial_politicas`, `solicitudes_eliminacion`

**Función**: Actualiza automáticamente el campo `updated_at` en cada UPDATE

```sql
-- Se ejecuta automáticamente
UPDATE consentimientos_usuario SET acepta_cookies_analiticas = true WHERE id = 'xxx';
-- ↑ updated_at se actualiza solo
```

---

### Trigger 2: `calcular_fecha_limite_eliminacion()`
**Aplicado a**: `solicitudes_eliminacion`

**Función**: Calcula automáticamente la fecha límite legal (30 días) al crear solicitud

```sql
INSERT INTO solicitudes_eliminacion (email_solicitante, tipo_eliminacion)
VALUES ('user@example.com', 'CUENTA_COMPLETA');
-- ↑ fecha_limite_legal = fecha_solicitud + 30 días (automático)
```

---

### Trigger 3: `registrar_revocacion_consentimiento()`
**Aplicado a**: `consentimientos_usuario`

**Función**: Registra en el log cuando un usuario revoca consentimientos

```sql
UPDATE consentimientos_usuario 
SET consentimiento_revocado = true,
    motivo_revocacion = 'Ya no deseo usar el servicio'
WHERE id = 'xxx';
-- ↑ Se crea automáticamente registro en log_acceso_datos
```

---

## 👁️ VISTAS SQL DISPONIBLES

### Vista 1: `vista_consentimientos_activos`
**Propósito**: Listar solo consentimientos vigentes (no revocados)

```sql
SELECT * FROM vista_consentimientos_activos;
-- Retorna: email, versiones, tipos de consentimiento, fechas
-- Filtro: consentimiento_revocado = false
```

**Uso**: Reportes de cumplimiento, verificación de estado

---

### Vista 2: `vista_eliminaciones_pendientes`
**Propósito**: Alertar sobre solicitudes de eliminación pendientes

```sql
SELECT * FROM vista_eliminaciones_pendientes;
-- Retorna: solicitudes con estado IN ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'PROCESANDO')
-- Incluye: días_restantes para cumplir SLA de 30 días
-- Ordenado por: fecha_limite_legal ASC (más urgente primero)
```

**Uso**: Dashboard administrativo, alertas de vencimiento

---

### Vista 3: `vista_accesos_recientes`
**Propósito**: Auditoría de accesos de los últimos 30 días

```sql
SELECT * FROM vista_accesos_recientes;
-- Retorna: últimos 30 días de accesos a datos
-- Útil para: investigaciones, reportes de seguridad
```

---

## 📊 ÍNDICES PARA PERFORMANCE

### En `consentimientos_usuario`:
```sql
✅ idx_consenti_usuario (usuario_id)
✅ idx_consenti_email (email_usuario)
✅ idx_consenti_fecha (fecha_consentimiento)
✅ idx_consenti_revocado (consentimiento_revocado)
```

### En `historial_politicas`:
```sql
✅ idx_politicas_tipo (tipo)
✅ idx_politicas_activa (activa)
✅ idx_politicas_vigencia (fecha_vigencia)
```

### En `log_acceso_datos`:
```sql
✅ idx_log_usuario (usuario_id)
✅ idx_log_email (email_usuario)
✅ idx_log_empresa (empresa_id)
✅ idx_log_fecha (fecha_acceso)
✅ idx_log_accion (accion)
✅ idx_log_tipo_dato (tipo_dato)
```

### En `solicitudes_eliminacion`:
```sql
✅ idx_elim_email (email_solicitante)
✅ idx_elim_usuario (usuario_id)
✅ idx_elim_estado (estado)
✅ idx_elim_fecha_solicitud (fecha_solicitud)
✅ idx_elim_fecha_limite (fecha_limite_legal)
```

---

## 🔄 INTEGRACIÓN CON BACKEND (PENDIENTE)

### Endpoints Necesarios (NO IMPLEMENTADOS AÚN):

```javascript
// 1. Guardar consentimiento
POST /api/guardar-consentimiento
Body: {
  email_usuario: "user@example.com",
  acepta_terminos: true,
  acepta_privacidad: true,
  acepta_cookies_analiticas: false,
  version_terminos: "v1.0",
  version_privacidad: "v1.0"
}

// 2. Obtener datos de usuario (GDPR Art. 15)
GET /api/obtener-mis-datos/:email

// 3. Exportar datos (GDPR Art. 20)
POST /api/exportar-datos
Body: { email: "user@example.com" }
Response: ZIP con JSON/PDF de todos los cálculos

// 4. Solicitar eliminación (GDPR Art. 17)
POST /api/solicitar-eliminacion
Body: {
  email_solicitante: "user@example.com",
  tipo_eliminacion: "CUENTA_COMPLETA",
  motivo: "Ya no uso el servicio"
}

// 5. Obtener historial de consentimientos
GET /api/consentimientos/:email

// 6. Revocar consentimiento
POST /api/revocar-consentimiento
Body: {
  email: "user@example.com",
  motivo_revocacion: "No deseo cookies analíticas"
}
```

---

## 🎯 PRÓXIMOS PASOS

### ✅ **YA HECHO** (Base de Datos):
- [x] 4 tablas creadas
- [x] 3 triggers implementados
- [x] 3 vistas SQL creadas
- [x] Índices optimizados
- [x] Políticas iniciales insertadas (v1.0)
- [x] Constraints de validación
- [x] Script de verificación actualizado

---

### ❌ **FALTA IMPLEMENTAR** (Backend + Frontend):

#### Backend (`Landing/src/setupProxy.js`):
- [ ] 6 endpoints API (ver lista arriba)
- [ ] Middleware de auditoría (registrar en `log_acceso_datos`)
- [ ] Sistema de notificación de cambios en políticas
- [ ] Exportación de datos en ZIP

#### Frontend (React):
- [ ] Componente `TermsModal.js`
- [ ] Componente `PrivacyModal.js`
- [ ] Componente `CookieBanner.js`
- [ ] Checkboxes de consentimiento en formularios
- [ ] Página `/mi-privacidad` (gestión de datos)
- [ ] Página `/terminos` (vista completa)
- [ ] Página `/privacidad` (vista completa)

#### Documentos PDF:
- [ ] `terminos_condiciones_v1.0.pdf`
- [ ] `politica_privacidad_v1.0.pdf`
- [ ] `politica_cookies_v1.0.pdf`

---

## 📖 DOCUMENTACIÓN LEGAL

### Artículos GDPR Cubiertos:
- ✅ **Art. 7**: Condiciones para el consentimiento → `consentimientos_usuario`
- ✅ **Art. 13**: Información que deberá facilitarse → `historial_politicas`
- ✅ **Art. 15**: Derecho de acceso → (backend pendiente)
- ✅ **Art. 17**: Derecho de supresión → `solicitudes_eliminacion`
- ✅ **Art. 20**: Derecho a la portabilidad → (backend pendiente)
- ✅ **Art. 30**: Registro de actividades → `log_acceso_datos`

### Artículos Ley 1581/2012 Cubiertos:
- ✅ **Art. 9**: Autorización del titular → `consentimientos_usuario`
- ✅ **Art. 12**: Deber de informar → `historial_politicas`
- ✅ **Art. 14**: Derecho de acceso → (backend pendiente)
- ✅ **Art. 15**: Derecho de supresión → `solicitudes_eliminacion`
- ✅ **Art. 17**: Deberes de los responsables → `log_acceso_datos`

---

## 🚀 ESTADO ACTUAL

| Componente | Estado | Completado |
|-----------|--------|------------|
| **Tablas BD** | ✅ Implementadas | 100% |
| **Triggers** | ✅ Implementados | 100% |
| **Vistas SQL** | ✅ Implementadas | 100% |
| **Índices** | ✅ Implementados | 100% |
| **Políticas Iniciales** | ✅ Insertadas | 100% |
| **Endpoints API** | ❌ Pendiente | 0% |
| **Componentes React** | ❌ Pendiente | 0% |
| **Documentos PDF** | ❌ Pendiente | 0% |
| **Integración Frontend** | ❌ Pendiente | 0% |

---

## ✅ CONCLUSIÓN

**La base de datos está 100% preparada** para cumplir con GDPR y Ley 1581 de 2012.

**Lo que tienes ahora**:
- 4 tablas legales funcionando
- Triggers automáticos
- Vistas SQL para reportes
- Políticas v1.0 precargadas
- Sistema de auditoría completo
- Gestión de derecho al olvido

**Lo que falta**:
- Implementación en backend (API endpoints)
- Implementación en frontend (modales, formularios)
- Documentos legales en PDF

**Tiempo estimado de implementación completa**: 3-4 horas de desarrollo adicional.

---

## 📞 CONTACTO

Para consultas sobre esta implementación:
- **Email**: legal@mundoverde.com
- **DPO**: dpo@mundoverde.com
- **Documentación**: `database/README_DATABASE.md`

---

**Fecha de Implementación**: 3 de Octubre, 2025
**Versión**: 1.0.0
**Autor**: Sistema Mundo Verde
