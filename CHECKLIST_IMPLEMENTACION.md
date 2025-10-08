# ✅ CHECKLIST DE IMPLEMENTACIÓN - BASE DE DATOS

## 🎯 ANTES DE EMPEZAR

- [ ] Tienes **PostgreSQL 14+** instalado
- [ ] Tienes acceso a `psql` desde terminal
- [ ] Conoces tu contraseña de PostgreSQL
- [ ] Tienes **Node.js 16+** instalado
- [ ] Tienes **8 horas** disponibles (o menos si sigues la guía)

---

## 📦 PASO 1: INSTALACIÓN DE BASE DE DATOS (30 min)

### Crear base de datos
```powershell
psql -U postgres -c "CREATE DATABASE mundoverde_db;"
```
- [ ] Base de datos `mundoverde_db` creada sin errores

### Ejecutar script de schema
```powershell
cd c:\Proyectos\Qexal_React_v2.3.0
psql -U postgres -d mundoverde_db -f database\schema.sql
```
- [ ] Script ejecutado sin errores
- [ ] Mensaje: "✅ Script ejecutado exitosamente!"
- [ ] Mensaje: "📊 Tablas creadas: 17"

### Ejecutar script de factores
```powershell
psql -U postgres -d mundoverde_db -f database\seed_factores.sql
```
- [ ] Script ejecutado sin errores
- [ ] Mensaje: "✅ Factores de emisión insertados exitosamente!"
- [ ] Factores insertados: 25 sólidos + 16 líquidos + 11 gaseosos + 14 electricidad

### Ejecutar script de funciones
```powershell
psql -U postgres -d mundoverde_db -f database\functions.sql
```
- [ ] Script ejecutado sin errores
- [ ] Mensaje: "✅ Funciones y triggers creados exitosamente!"
- [ ] 8+ funciones creadas
- [ ] 12+ triggers creados

### Verificar instalación
```powershell
psql -U postgres -d mundoverde_db -f database\verificar.sql
```
- [ ] Todas las verificaciones pasan ✅
- [ ] Mensaje final: "✅ ¡TODO CORRECTO! La base de datos está lista para usar."

---

## ⚙️ PASO 2: CONFIGURACIÓN DEL BACKEND (15 min)

### Configurar archivo .env
- [ ] Archivo `.env` existe en la raíz del proyecto
- [ ] `DB_HOST=localhost` configurado
- [ ] `DB_PORT=5432` configurado
- [ ] `DB_USER=postgres` configurado (o tu usuario)
- [ ] `DB_PASSWORD=TU_CONTRASEÑA` **CAMBIADO** con tu contraseña real
- [ ] `DB_NAME=mundoverde_db` configurado

### Verificar .gitignore
```powershell
git check-ignore .env
```
- [ ] Comando retorna: `.env` (confirmando que está ignorado)
- [ ] ⚠️ Si no aparece, **AGREGAR .env A .gitignore INMEDIATAMENTE**

### Instalar dependencia PostgreSQL
```powershell
cd Landing
npm install pg
```
- [ ] Dependencia `pg` instalada sin errores
- [ ] Aparece en `package.json` como `"pg": "^8.11.3"`

### Verificar archivos de database
- [ ] `Landing/src/database/config.js` existe
- [ ] `Landing/src/database/DatabaseService.js` existe
- [ ] `Landing/src/database/queries.js` existe

### Verificar setupProxy.js
- [ ] `Landing/src/setupProxy.js` importa DatabaseService
- [ ] Endpoint `/api/guardar-huella` existe
- [ ] Endpoint `/api/guardar-autogestion` existe
- [ ] Endpoint `/api/obtener-calculo/:codigo` existe
- [ ] Endpoint `/api/catalogos/combustibles` existe
- [ ] Endpoint `/api/factor-electricidad` existe

---

## 🚀 PASO 3: PROBAR EL SISTEMA (30 min)

### Iniciar el servidor
```powershell
cd Landing
npm start
```
- [ ] Servidor inicia sin errores
- [ ] Mensaje: "✅ Nueva conexión establecida con PostgreSQL"
- [ ] Mensaje: "🎉 ¡CONEXIÓN EXITOSA A POSTGRESQL!"
- [ ] Aparece hora, base de datos y versión de PostgreSQL

### Probar API con navegador
Abre: http://localhost:3000

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Test 1: Estadísticas
fetch('/api/estadisticas')
  .then(r => r.json())
  .then(d => console.log('✅ Estadísticas:', d));
```
- [ ] Respuesta: `{ success: true, data: { totalCalculosHuella: 0, ... } }`

```javascript
// Test 2: Catálogos
fetch('/api/catalogos/combustibles')
  .then(r => r.json())
  .then(d => console.log('✅ Catálogos:', d.data.solidos.length, 'sólidos'));
```
- [ ] Respuesta: Muestra 25 combustibles sólidos

```javascript
// Test 3: Factor eléctrico Colombia
fetch('/api/factor-electricidad/Colombia/2024')
  .then(r => r.json())
  .then(d => console.log('✅ Factor Colombia:', d.factor));
```
- [ ] Respuesta: `{ success: true, factor: 0.391, ... }`

### Probar guardado completo (con datos reales)
- [ ] Completar formulario de Huella de Carbono en el frontend
- [ ] Al finalizar, debería guardarse automáticamente
- [ ] Verificar en consola del navegador que aparece código único (HC-2025-XXXXXX)
- [ ] Abrir PostgreSQL y verificar:
  ```sql
  SELECT codigo_seguimiento, nombre_empresa, emisiones_totales 
  FROM calculos_huella_carbono 
  ORDER BY fecha_creacion DESC 
  LIMIT 1;
  ```
- [ ] Registro guardado correctamente con código único

---

## 🎨 PASO 4: INTEGRACIÓN CON FRONTEND (2-3 horas)

### En FormularioHuella.js

#### 1. Importar servicio (arriba del archivo)
```javascript
// No necesitas importar nada, usas fetch directamente
```
- [ ] Listo (no requiere cambios de import)

#### 2. Llamar API después del cálculo (antes de generar PDF)
```javascript
const guardarEnBaseDatos = async () => {
  try {
    const respuesta = await fetch('/api/guardar-huella', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCompletos)
    });
    
    const resultado = await respuesta.json();
    
    if (resultado.success) {
      console.log('✅ Guardado con código:', resultado.codigo);
      return resultado.codigo; // HC-2025-000001
    }
  } catch (error) {
    console.error('Error guardando:', error);
    return null; // No bloquear si falla
  }
};

// Llamar antes de generar PDF
const codigo = await guardarEnBaseDatos();
```
- [ ] Código agregado
- [ ] Probado y funciona
- [ ] Código único retornado correctamente

#### 3. Mostrar código al usuario
```javascript
if (codigo) {
  alert(`✅ Tu cálculo ha sido guardado.\nCódigo: ${codigo}\n\nUsa este código para consultar tu reporte en el futuro.`);
  
  // O mejor: mostrar en un modal bonito
  setMensajeExito(`Cálculo guardado con código: ${codigo}`);
  setMostrarModal(true);
}
```
- [ ] Usuario ve el código único después de calcular
- [ ] Código es copiable o visible claramente

#### 4. Pasar código al PDF
```javascript
// Al generar el PDF, incluir el código
generarPDF(datosCompletos, codigo);
```
- [ ] Código pasado a la función de generación de PDF

### En setupProxy.js

#### Modificar generarPDFHuella()
```javascript
// Cambiar firma de función
function generarPDFHuella(datos, codigo = null) {
  // ...
  
  // En la primera página, después del título
  if (codigo) {
    doc.fontSize(14).fillColor('#43a047')
       .text(`Código de Seguimiento: ${codigo}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666')
       .text('Use este código para consultar su cálculo en el futuro', 
             { align: 'center' });
    doc.moveDown(1);
  }
  
  // ... resto del código
}
```
- [ ] Función modificada para aceptar parámetro `codigo`
- [ ] Código se muestra en el PDF en lugar visible
- [ ] PDF generado incluye el código correctamente

#### Actualizar endpoint de email
```javascript
app.post('/api/send-email', async (req, res) => {
  // ...
  
  // ANTES de generar PDF, guardar en BD
  const resultadoBD = await DatabaseService.guardarHuellaCarbono(transformarDatos(datosCompletos));
  const codigo = resultadoBD.success ? resultadoBD.data.codigo : null;
  
  // Generar PDF con código
  const pdfBuffer = await generarPDFHuella(datosCompletos, codigo);
  
  // ...
});
```
- [ ] Endpoint actualizado
- [ ] PDF enviado por email incluye código único

### En AutogestionPage.js (mismo proceso)

- [ ] Llamada a `/api/guardar-autogestion` agregada
- [ ] Código AG-YYYY-NNNNNN mostrado al usuario
- [ ] Código incluido en PDF de autogestión

---

## 📊 PASO 5: FUNCIONALIDADES ADICIONALES (OPCIONAL)

### Página de consulta de cálculos anteriores

```javascript
// Nuevo componente: ConsultaCalculos.js
const ConsultaCalculos = () => {
  const [codigo, setCodigo] = useState('');
  const [datos, setDatos] = useState(null);
  
  const consultar = async () => {
    const res = await fetch(`/api/obtener-calculo/${codigo}`);
    const result = await res.json();
    
    if (result.success) {
      setDatos(result.data);
    } else {
      alert('Cálculo no encontrado');
    }
  };
  
  return (
    <div>
      <h2>Consultar Cálculo Anterior</h2>
      <input 
        placeholder="HC-2025-000001 o AG-2025-000001"
        value={codigo}
        onChange={e => setCodigo(e.target.value.toUpperCase())}
      />
      <button onClick={consultar}>Buscar</button>
      
      {datos && (
        <div>
          <h3>{datos.nombre_empresa}</h3>
          <p>NIT: {datos.nit}</p>
          <p>Fecha: {new Date(datos.fecha_reporte).toLocaleDateString()}</p>
          {/* Mostrar más datos según tipo */}
        </div>
      )}
    </div>
  );
};
```
- [ ] Componente creado (opcional)
- [ ] Ruta agregada en React Router
- [ ] Funcionalidad probada

### Dashboard de estadísticas

```javascript
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch('/api/estadisticas')
      .then(r => r.json())
      .then(data => setStats(data.data));
  }, []);
  
  return stats ? (
    <div>
      <h2>Estadísticas de la Plataforma</h2>
      <p>Total cálculos de huella: {stats.totalCalculosHuella}</p>
      <p>Total autogestiones: {stats.totalCalculosAutogestion}</p>
      <p>Total empresas: {stats.totalEmpresas}</p>
    </div>
  ) : <p>Cargando...</p>;
};
```
- [ ] Componente creado (opcional)
- [ ] Visualización implementada

---

## ✅ PASO 6: VERIFICACIÓN FINAL

### Base de datos
- [ ] Tablas creadas correctamente (17 tablas)
- [ ] Factores de emisión insertados (66 registros)
- [ ] Funciones y triggers funcionando
- [ ] Secuencias generando códigos únicos

### Backend
- [ ] Conexión a PostgreSQL exitosa
- [ ] 5 endpoints funcionando
- [ ] Manejo de errores implementado
- [ ] Logging informativo activo

### Frontend
- [ ] Código único generado después de cada cálculo
- [ ] Código mostrado al usuario claramente
- [ ] Código incluido en PDFs
- [ ] Usuario puede consultar cálculos anteriores (opcional)

### Seguridad
- [ ] Archivo `.env` NO está en GitHub
- [ ] `.gitignore` configurado correctamente
- [ ] Credenciales no expuestas en código
- [ ] SQL injection prevenido (prepared statements)

### Documentación
- [ ] `README_DATABASE.md` leído y entendido
- [ ] `IMPLEMENTACION_COMPLETADA.md` revisado
- [ ] Scripts de verificación ejecutados
- [ ] Todo funciona como se esperaba

---

## 🎉 IMPLEMENTACIÓN COMPLETADA

Si todos los checkboxes están marcados ✅, ¡FELICITACIONES!

Has implementado exitosamente un sistema de base de datos profesional con:

✅ 17 tablas normalizadas  
✅ Generación automática de códigos únicos  
✅ Cálculos automáticos con triggers  
✅ API REST completa con 5 endpoints  
✅ Integración con frontend React  
✅ PDFs con código de seguimiento  
✅ Auditoría completa  
✅ Factores de emisión precargados  
✅ Documentación exhaustiva  

**Tiempo estimado**: 6-8 horas  
**Nivel de calidad**: ⭐⭐⭐⭐⭐ PROFESIONAL  

---

## 🐛 SI ALGO FALLA...

### Error en PostgreSQL
1. Revisar `.env` - contraseña correcta
2. Verificar que PostgreSQL esté corriendo
3. Revisar puerto (default: 5432)
4. Ejecutar `database/verificar.sql`

### Error en Node.js
1. Verificar que `pg` esté instalado
2. Reiniciar servidor (`npm start`)
3. Revisar consola para mensajes de error
4. Verificar que `setupProxy.js` tenga los endpoints

### Error en Frontend
1. Abrir DevTools → Network
2. Buscar peticiones a `/api/guardar-*`
3. Ver si hay errores 500 o 400
4. Revisar payload enviado
5. Ver respuesta del servidor

### Código no se genera
1. Verificar que secuencias existan en PostgreSQL
2. Ejecutar manualmente: `SELECT generar_codigo_seguimiento('HC');`
3. Debe retornar: `HC-2025-000001`
4. Si falla, re-ejecutar `functions.sql`

---

## 📞 AYUDA

Si después de revisar este checklist sigues teniendo problemas:

1. **Ejecuta el script de verificación**:
   ```powershell
   psql -U postgres -d mundoverde_db -f database\verificar.sql
   ```

2. **Revisa la documentación completa**:
   - `database/README_DATABASE.md`
   - `IMPLEMENTACION_COMPLETADA.md`

3. **Revisa logs del servidor**:
   - Consola donde ejecutaste `npm start`
   - Busca mensajes con ❌ o ERROR

---

**¡Éxito con tu implementación!** 🚀
