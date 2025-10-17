# 🛠️ Corrección Huella de Carbono - Oct 2025

## 1. Resumen Ejecutivo
- **Incidencia:** Inserciones en PostgreSQL fallaban con `la sintaxis de entrada no es válida para tipo integer: «NaN»` y el front no mostraba el banner con el código HC generado.
- **Componentes afectados:** `Landing/src/setupProxy.js` (endpoint `/api/huella-carbono/guardar`) y `Landing/src/component/HuellaCarbono/FormularioHuella.js`.
- **Resultado:** Se normaliza todo el payload antes de persistir, se evita la generación de `NaN/null` y se muestra siempre el identificador `HC-YYYY-NNNNNN` en la cabecera del resumen.

## 2. Causa Raíz
1. **Payload heterogéneo:** El formulario enviaba cantidades como strings, con comas, puntos, símbolos o campos vacíos.
2. **Unidades mixtas:** Consumos líquidos podían venir en galones, litros o m³ sin conversión automática.
3. **Registros incompletos:** Filas sin combustible o consumo llegaban al backend y terminaban en `NULL`, generando errores en los inserts.
4. **Respuesta backend inconsistente:** Dependiendo del camino, el endpoint podía devolver `{ success, data: { codigo, id } }`, lo que dejaba el banner vacío si el front solo leía `resultado.codigo`.

## 3. Normalización en el Backend (`setupProxy.js`)
Se añadió una fase de saneamiento antes de llamar a `DatabaseService.guardarHuellaCarbono`:

- **Helpers numéricos y de texto**
  ```js
  const toNumber = (value) => { /* elimina separadores, valida NaN */ };
  const sanitizeText = (value, { allowEmpty = false } = {}) => { /* trim + null safe */ };
  const ensureDate = (value) => { /* fallback ISO yyyy-mm-dd */ };
  const parseYear = (value, fallbackYear) => { /* rango 1900-9999 */ };
  ```

- **Mapeos por categoría**
  - `mapCombustiblesSolidos`: descarta filas sin tipo o consumo, fija `unidad: 'kg'`.
  - `mapCombustiblesLiquidos`: convierte galones → litros, m³ → litros, agrega `tipoFuente`.
  - `mapCombustiblesGaseosos`: asegura unidad (`m³` por defecto) y factores numéricos.
  - `mapElectricidad`: recorre enero-diciembre, suma consumo, genera nombre placeholder si falta.
  - `mapVuelos`: valida ciudades, distancia y arma estructura `origen/destino`.
  - `mapExtintores`: exige tipo de gas, cantidad y PCG > 0.

- **Evaluación y fechas**
  - `fechaReporte` se controla con `ensureDate` y `añoReporte` con `parseYear`.
  - Si no llega `arbolesCompensar`, se calcula como `Math.ceil(totalEmisionesTon * 18.3)`.

- **Consolidación final**
  ```js
  const datosParaBD = {
    empresa: { ...sanitizeText(...) },
    añoReporte,
    fechaReporte,
    combustiblesSolidos,
    combustiblesLiquidos,
    combustiblesGaseosos,
    electricidad,
    vuelosAereos,
    extintores,
    evaluacion: { nivel, arbolesCompensar },
    notas: sanitizeText(datosCompletos?.notas)
  };
  ```

## 4. Ajustes en el Front (`FormularioHuella.js`)
- Se agregó un banner destacado (igual al de Autogestión) que muestra el código HC.
- Se hizo robusto el consumo de la respuesta:
  ```js
  const codigoGenerado = resultado.codigo || resultado.data?.codigo || null;
  const idGenerado = resultado.id || resultado.data?.id || null;
  setCodigoSeguimiento(codigoGenerado);
  ```
- Logs amigables para verificar en consola: “✅ Cálculo guardado en BD: HC-…”.

## 5. Archivos Intervenidos
- `Landing/src/setupProxy.js`
  - Se añadió capa de sanitización (`toNumber`, `sanitizeText`, `ensureDate`, `parseYear`).
  - Nuevos mapeadores (`mapCombustiblesSolidos`, `mapCombustiblesLiquidos`, `mapElectricidad`, etc.) previos al insert.
  - Se consolida `datosParaBD` solo con filas válidas, evitando `NaN` y normalizando unidades.
- `Landing/src/component/HuellaCarbono/FormularioHuella.js`
  - Banner superior con el identificador de cálculo de huella.
  - Manejo defensivo del payload de respuesta (`resultado.data?.codigo` / `resultado.data?.id`).
  - Logs de verificación alineados con la respuesta del backend.
- `docs/06_CORRECCION_HUELLA_2025-10-17.md`
  - Registro detallado de la incidencia, solución y pruebas.

## 6. Pruebas Manuales Recomendadas
1. **Flujo completo desde el formulario**
   - Ingresar datos con distintos formatos (galones, números con comas, celdas vacías).
   - Verificar consola: se deben registrar los contadores por categoría.
   - Confirmar que el banner azul muestra el código `HC-YYYY-NNNNNN`.
2. **Verificación en BD**
   - `SELECT emisiones_totales FROM calculos_huella_carbono WHERE codigo_seguimiento = 'HC-…';`
   - Revisar tablas hijas (`combustibles_liquidos`, etc.) para descartar valores nulos/NaN.
3. **Reintentos con datos vacíos**
   - Filas sin combustible o sin consumo deben omitirse sin romper el insert.

## 7. Impacto y Consideraciones
- **Compatibilidad:** No rompe guardados previos; solamente limpia datos antes de insertar.
- **Mantenimiento:** Si se agregan nuevas categorías en el formulario, replicar el patrón `mapX` para garantizar la sanitización.
- **UI:** El resumen ahora depende únicamente de `setCodigoSeguimiento`; mantener esta lógica si se refactoriza el flujo de pasos.



---

