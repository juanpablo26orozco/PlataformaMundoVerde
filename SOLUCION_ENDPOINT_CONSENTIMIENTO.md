# 🔧 SOLUCIÓN: Error de respuesta JSON - Endpoint /api/consentimiento

## ❌ PROBLEMA ACTUAL

```
El servidor no devolvió una respuesta JSON válida. Por favor, verifique que el servidor esté funcionando correctamente.
```

**Consola del navegador muestra:**
```
📤 Enviando consentimiento a /api/consentimiento...
📥 Respuesta recibida: 200 OK
❌ Respuesta no es JSON: <!DOCTYPE html>...
```

---

## 🔍 CAUSA RAÍZ

El endpoint `/api/consentimiento` en `setupProxy.js` **NO se está ejecutando**. En su lugar, el servidor está devolviendo la página HTML de React.

**¿Por qué sucede esto?**

1. **setupProxy.js solo funciona en modo desarrollo** (`npm start`)
2. **Los cambios en setupProxy.js NO se aplican con hot reload**
3. **Necesitas REINICIAR completamente el servidor** después de modificar `setupProxy.js`

---

## ✅ SOLUCIÓN INMEDIATA

### PASO 1: Detener el servidor

En la terminal donde está corriendo el servidor:

**Windows PowerShell:**
```powershell
# Presiona Ctrl+C
# O cierra la terminal
```

**Windows CMD/Bash:**
```bash
# Presiona Ctrl+C
```

### PASO 2: Reiniciar el servidor

```powershell
cd c:\Proyectos\Qexal_React_v2.3.0\Landing
npm start
```

O si usas yarn:

```bash
yarn start
```

### PASO 3: Verificar que setupProxy se carga

Cuando el servidor inicia, deberías ver en la consola:

```
✅ Base de datos conectada y lista!
SendGrid configurado
```

Y cuando abres la aplicación (`http://localhost:3000`), la consola del servidor debería mostrar:

```
📝 === VERIFICANDO CONEXIÓN A BASE DE DATOS ===
✅ Conexión exitosa a PostgreSQL
```

---

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### 1. Abrir consola del navegador (F12)

### 2. Probar el endpoint manualmente:

```javascript
fetch('/api/consentimiento', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    acepta_terminos: true,
    acepta_privacidad: true,
    version_terminos: 'v1.0',
    version_privacidad: 'v1.0'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Respuesta:', data))
.catch(err => console.error('❌ Error:', err));
```

**Respuesta esperada:**
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha": "2025-10-03T10:30:45.123Z",
  "mensaje": "Consentimiento registrado exitosamente"
}
```

**Si ves esto, el endpoint funciona correctamente** ✅

### 3. Probar desde el modal

1. Limpiar localStorage:
   ```javascript
   localStorage.removeItem('consentimientoAceptado')
   ```
2. Ir a `/calculadora`
3. Clic en "Iniciar Cálculo"
4. Marcar checkbox
5. Clic en "Aceptar y Continuar"

**Si todo funciona:**
- ✅ No aparece error rojo
- ✅ Modal se cierra
- ✅ Formulario de cálculo se abre
- ✅ Consola muestra: `✅ Consentimiento guardado: [id]`

---

## 🚨 SI SIGUE SIN FUNCIONAR

### Verificar que setupProxy.js está en la ubicación correcta:

```
Landing/src/setupProxy.js  ✅ CORRECTO
Landing/setupProxy.js      ❌ INCORRECTO
```

### Verificar que tienes las dependencias:

```powershell
cd Landing
npm list express pg
```

Deberías ver:
```
├── express@5.1.0
└── pg@8.16.3
```

### Verificar base de datos PostgreSQL:

```sql
-- Conectar a la base de datos
psql -U postgres -d qexal_db

-- Verificar tabla
\d consentimientos_usuario

-- Debe mostrar la estructura de la tabla
```

Si la tabla no existe:
```sql
-- Ejecutar schema
\i c:/Proyectos/Qexal_React_v2.3.0/database/schema.sql
```

---

## 🔧 ALTERNATIVA: Verificar en consola del servidor

Cuando haces clic en "Aceptar y Continuar", la **consola del servidor** (donde ejecutas `npm start`) debería mostrar:

```
📝 === GUARDANDO CONSENTIMIENTO ===
✅ Consentimiento guardado: 550e8400-e29b-41d4-a716-446655440000
```

**Si NO ves esto**, el endpoint no se está ejecutando.

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de probar:

- [ ] Servidor detenido completamente (Ctrl+C)
- [ ] Servidor reiniciado con `npm start` o `yarn start`
- [ ] No hay errores en consola del servidor al iniciar
- [ ] Base de datos PostgreSQL corriendo
- [ ] Tabla `consentimientos_usuario` existe
- [ ] Archivo `Landing/src/setupProxy.js` en ubicación correcta
- [ ] Dependencias `express` y `pg` instaladas

Después de probar modal:

- [ ] No aparece mensaje de error en el modal
- [ ] Consola del navegador muestra `✅ Consentimiento guardado`
- [ ] Consola del servidor muestra `📝 === GUARDANDO CONSENTIMIENTO ===`
- [ ] localStorage tiene `consentimientoAceptado = "true"`
- [ ] Modal no aparece en siguientes intentos

---

## 💡 NOTA IMPORTANTE

**setupProxy.js solo funciona en desarrollo (`npm start`).**

Para producción, necesitarás:
1. Un servidor backend separado (Express)
2. O usar variables de entorno para la URL de API
3. O usar serverless functions (Vercel, Netlify, etc.)

---

## 🎯 RESUMEN

**PROBLEMA**: El endpoint `/api/consentimiento` devuelve HTML en lugar de JSON

**CAUSA**: setupProxy.js no se está ejecutando (servidor no reiniciado)

**SOLUCIÓN**: 
1. ⏹️ Detener servidor (Ctrl+C)
2. ▶️ Reiniciar servidor (`npm start`)
3. ✅ Probar modal nuevamente

---

**Fecha**: 2025-10-03  
**Estado**: ⏳ Pendiente de reiniciar servidor
