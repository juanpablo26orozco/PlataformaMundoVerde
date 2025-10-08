# 🧪 INSTRUCCIONES DE PRUEBA - SISTEMA DE CONSENTIMIENTO

## 📋 CÓMO PROBAR LA INTEGRACIÓN

### PASO 1: Iniciar la aplicación

```powershell
cd c:\Proyectos\Qexal_React_v2.3.0\Landing
npm start
```

Espera a que se abra el navegador en `http://localhost:3000`

---

## ✅ PRUEBA 1: Calculadora de Huella de Carbono

### 1.1 - Primera vez (sin consentimiento)

1. **Abrir consola del navegador** (F12)
2. **Limpiar localStorage**:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```
3. **Navegar a**: `http://localhost:3000/calculadora`
4. **Hacer scroll** hasta ver el botón verde "Iniciar Cálculo"
5. **Hacer clic** en "Iniciar Cálculo"

**✓ RESULTADO ESPERADO**:
- Debe aparecer un modal grande con el título "Políticas de Privacidad y Términos y Condiciones"
- El modal tiene dos secciones largas de texto (scroll)
- Al final hay un checkbox: "He leído y acepto..."
- El botón "Aceptar y Continuar" está **deshabilitado** (gris)

### 1.2 - Aceptar consentimiento

6. **Marcar el checkbox** "He leído y acepto..."

**✓ RESULTADO ESPERADO**:
- El botón "Aceptar y Continuar" cambia a **verde y habilitado**

7. **Hacer clic** en "Aceptar y Continuar"

**✓ RESULTADO ESPERADO**:
- El modal se cierra
- Se abre el formulario de "Calculadora de Huella de Carbono" (modal grande con tabs)
- En la consola del navegador puedes verificar:
  ```javascript
  localStorage.getItem('consentimientoAceptado')
  // Debe retornar: "true"
  ```

### 1.3 - Segunda vez (con consentimiento guardado)

8. **Cerrar** el formulario de cálculo (botón X o "Cerrar")
9. **Hacer clic nuevamente** en "Iniciar Cálculo"

**✓ RESULTADO ESPERADO**:
- El modal de políticas **NO aparece**
- Se abre directamente el formulario de cálculo
- Esto prueba que el consentimiento se guardó correctamente

---

## ✅ PRUEBA 2: Diagnóstico de Autogestión

### 2.1 - Limpiar consentimiento

1. **En consola del navegador**:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```

### 2.2 - Navegar a autogestión

2. **Ir a**: `http://localhost:3000/autogestion`
3. **Hacer scroll** hasta ver el formulario "Datos de la Empresa"

### 2.3 - Llenar datos mínimos

4. **Completar campos obligatorios**:
   - Nombre de empresa: `Test SA`
   - NIT: `123456789`
   - Email: `test@test.com`

5. **Hacer clic** en botón verde "Iniciar Diagnóstico"

**✓ RESULTADO ESPERADO**:
- Aparece el modal de políticas (igual que en calculadora)
- El checkbox no está marcado
- Botón "Aceptar y Continuar" deshabilitado

### 2.4 - Aceptar y continuar

6. **Marcar checkbox**
7. **Hacer clic** en "Aceptar y Continuar"

**✓ RESULTADO ESPERADO**:
- Modal se cierra
- Se abre el wizard de diagnóstico (pantalla completa verde)
- Primera sección: "Diagnóstico Económico"

### 2.5 - Verificar persistencia

8. **Hacer clic** en botón rojo "Salir" del wizard
9. **Volver a hacer clic** en "Iniciar Diagnóstico"

**✓ RESULTADO ESPERADO**:
- Modal de políticas **NO aparece**
- Se abre directamente el wizard
- Se validan datos de empresa pero no pide consentimiento

---

## ✅ PRUEBA 3: Cancelar Modal

### 3.1 - Limpiar y cancelar en calculadora

1. **Limpiar localStorage**:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```
2. **Navegar a** `/calculadora`
3. **Hacer clic** en "Iniciar Cálculo"
4. **Modal aparece**
5. **Hacer clic** en botón "Cancelar" o en la X de la esquina

**✓ RESULTADO ESPERADO**:
- Modal se cierra
- Formulario de cálculo **NO se abre**
- En consola:
  ```javascript
  localStorage.getItem('consentimientoAceptado')
  // Debe retornar: null (no se guardó nada)
  ```

6. **Hacer clic nuevamente** en "Iniciar Cálculo"

**✓ RESULTADO ESPERADO**:
- Modal aparece **de nuevo** (porque no aceptó)

---

## ✅ PRUEBA 4: Base de Datos

### 4.1 - Verificar registro guardado

1. **Abrir pgAdmin o terminal PostgreSQL**

2. **Ejecutar query**:
   ```sql
   SELECT 
     id,
     email,
     nombre,
     acepta_terminos,
     acepta_privacidad,
     fecha_aceptacion,
     version,
     ip_address,
     navegador,
     sistema_operativo
   FROM consentimientos_usuario
   ORDER BY fecha_aceptacion DESC
   LIMIT 5;
   ```

**✓ RESULTADO ESPERADO**:
```
id                                   | email | nombre | acepta_terminos | acepta_privacidad | fecha_aceptacion       | version | ip_address  | navegador | sistema_operativo
-------------------------------------|-------|--------|-----------------|-------------------|------------------------|---------|-------------|-----------|------------------
e7b8c4d2-a1f3-4567-89ab-cdef01234567 | NULL  | NULL   | true            | true              | 2025-01-13 10:30:45.123| v1.0    | ::1         | Chrome    | Windows
```

**Verificar**:
- ✓ `acepta_terminos` = true
- ✓ `acepta_privacidad` = true
- ✓ `version` = 'v1.0'
- ✓ `ip_address` capturado (::1 es localhost IPv6)
- ✓ `navegador` detectado correctamente
- ✓ `sistema_operativo` detectado correctamente
- ✓ `fecha_aceptacion` con timestamp correcto

### 4.2 - Múltiples aceptaciones

3. **Limpiar localStorage**:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```

4. **Aceptar consentimiento de nuevo** en calculadora

5. **Ejecutar query nuevamente**

**✓ RESULTADO ESPERADO**:
- Ahora hay **2 registros** (o más si probaste varias veces)
- Cada aceptación crea un registro nuevo con UUID único
- Esto es correcto para auditoría legal

---

## 🔍 PRUEBA 5: Comportamiento entre Módulos

### 5.1 - Consentimiento compartido

1. **Limpiar localStorage**:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```

2. **Navegar a** `/calculadora`
3. **Aceptar consentimiento** en modal
4. **Navegar a** `/autogestion`
5. **Llenar datos de empresa**
6. **Hacer clic** en "Iniciar Diagnóstico"

**✓ RESULTADO ESPERADO**:
- Modal **NO aparece** en autogestión
- El consentimiento de calculadora sirve para ambos módulos
- Esto es correcto: un solo consentimiento para toda la plataforma

---

## 🐛 DEBUGGING

### Si el modal no aparece:

**Verificar en consola**:
```javascript
localStorage.getItem('consentimientoAceptado')
```

Si retorna `"true"`, limpiarlo:
```javascript
localStorage.removeItem('consentimientoAceptado')
location.reload()
```

### Si el modal aparece pero botón no se habilita:

1. **Abrir consola del navegador**
2. **Buscar errores en rojo**
3. **Verificar que el checkbox funciona**:
   - Debe cambiar de desmarcado a marcado al hacer clic
   - Debe habilitar botón al marcar

### Si no se guarda en base de datos:

**Verificar en Network tab del navegador**:
1. Abrir DevTools (F12)
2. Ir a tab "Network"
3. Aceptar consentimiento
4. Buscar llamada a `/api/consentimiento`
5. Ver Response:

**Respuesta exitosa**:
```json
{
  "success": true,
  "id": "uuid-generado",
  "fecha": "2025-01-13T10:30:45.123Z",
  "mensaje": "Consentimiento registrado exitosamente"
}
```

**Respuesta con error**:
```json
{
  "error": "Debe aceptar los términos y condiciones"
}
```

---

## ✅ CHECKLIST DE PRUEBAS

### Calculadora
- [ ] Modal aparece en primer acceso
- [ ] Checkbox se puede marcar/desmarcar
- [ ] Botón deshabilitado sin checkbox
- [ ] Botón habilitado con checkbox
- [ ] Modal se cierra al aceptar
- [ ] Formulario se abre al aceptar
- [ ] Modal NO aparece en siguientes accesos
- [ ] Cancelar cierra modal sin abrir formulario
- [ ] Consentimiento se guarda en BD
- [ ] localStorage guarda flag correctamente

### Autogestión
- [ ] Modal aparece en primer acceso
- [ ] Validación de datos de empresa funciona
- [ ] Modal se muestra antes de validación
- [ ] Wizard se abre al aceptar
- [ ] Modal NO aparece en siguientes accesos
- [ ] Consentimiento compartido con calculadora

### Base de Datos
- [ ] Registro se crea en tabla `consentimientos_usuario`
- [ ] UUID único generado
- [ ] IP capturada correctamente
- [ ] Navegador detectado
- [ ] Sistema operativo detectado
- [ ] Timestamp guardado
- [ ] Versión v1.0 guardada

---

## 📊 RESULTADOS ESPERADOS

| Prueba | Estado | Tiempo |
|--------|--------|--------|
| Calculadora - Primera vez | ✅ Pasa | 30s |
| Calculadora - Segunda vez | ✅ Pasa | 10s |
| Autogestión - Primera vez | ✅ Pasa | 45s |
| Autogestión - Segunda vez | ✅ Pasa | 15s |
| Cancelar modal | ✅ Pasa | 20s |
| Base de datos | ✅ Pasa | 30s |
| Consentimiento compartido | ✅ Pasa | 60s |

**TIEMPO TOTAL DE PRUEBAS**: ~3-5 minutos

---

## 🎯 CRITERIOS DE ACEPTACIÓN

### ✅ PASA si:
1. Modal aparece en primer acceso a calculadora
2. Modal aparece en primer acceso a autogestión
3. Checkbox es obligatorio para habilitar botón
4. Consentimiento se guarda en PostgreSQL
5. localStorage previene múltiples modales
6. Cancelar no guarda consentimiento
7. Consentimiento se comparte entre módulos
8. IP, navegador y OS se detectan correctamente

### ❌ FALLA si:
1. Modal no aparece nunca
2. Modal aparece en cada clic (no respeta localStorage)
3. Botón habilitado sin marcar checkbox
4. No se guarda en base de datos
5. Cancelar abre formulario
6. Errores de consola JavaScript
7. Consentimiento no se comparte entre módulos

---

## 📞 SOPORTE

Si alguna prueba falla, revisar:
- `LEGAL_PRIVACY_COMPLETED.md` - Documentación completa
- `Landing/src/component/Legal/ModalPoliticas.js` - Componente modal
- `Landing/src/setupProxy.js` - Línea ~790 - Endpoint backend
- `Landing/src/component/Calculadora/CalculadoraSection.js` - Integración calculadora
- `Landing/src/component/Autogestion/FormularioAutogestion.js` - Integración autogestión

---

**¡Listo para probar! 🚀**

Fecha: 2025-01-13
