# 🚀 GUÍA RÁPIDA - CÓDIGO LISTO PARA COPIAR Y PEGAR

## 📋 Tabla de Contenidos
1. [Probar Endpoints (PowerShell)](#probar-endpoints)
2. [Código para FormularioHuella.js](#formulario-huella)
3. [Código para FormularioAutogestion.js](#formulario-autogestion)
4. [Modificar generarPDFHuella()](#pdf-huella)
5. [Crear Página de Consulta](#pagina-consulta)
6. [Banner de Cookies](#banner-cookies)

---

## 🧪 1. PROBAR ENDPOINTS (PowerShell) {#probar-endpoints}

### Test 1: Guardar Huella de Carbono

```powershell
# Crear datos de prueba
$body = @{
  datosEmpresa = @{
    nombreEmpresa = "Mundo Verde Test S.A.S."
    nit = "900123456-7"
    sector = "Servicios"
    departamento = "Cundinamarca"
    municipio = "Bogotá"
    direccion = "Calle 100 #10-20"
    telefono = "3001234567"
    correo = "test@mundoverde.com"
    personaElabora = "Juan Pérez"
    cargo = "Gerente Ambiental"
  }
  fecha = "2025-10-03"
  periodoInicio = "2025-01-01"
  periodoFin = "2025-12-31"
  añoReporte = 2025
  nivel = "Aceptable"
  arbolesCompensar = 100
  
  solidos = @()
  liquidos = @(
    @{
      tipo = "Gasolina corriente"
      tipoFuente = "Móvil"
      consumoAnual = 1000
      factores = @{
        densidad = 0.74
        poderCalorifico = 43020
        factorCO2 = 69300
        factorCH4 = 3.0
        factorN2O = 0.6
      }
    }
  )
  gaseosos = @()
  electricidad = @(
    @{
      nombreInstalacion = "Oficina Principal"
      año = 2025
      consumoMensual = @{
        enero = 500
        febrero = 520
        marzo = 510
        abril = 530
        mayo = 540
        junio = 550
        julio = 560
        agosto = 570
        septiembre = 580
        octubre = 590
        noviembre = 600
        diciembre = 610
      }
      factorEmision = 0.391
    }
  )
  vuelos = @()
  extintores = @()
  
  totalEmisiones = 55.8
  notas = "Cálculo de prueba para validar base de datos"
} | ConvertTo-Json -Depth 10

# Enviar request
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/guardar-huella" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

# Mostrar resultado
$resultado = $response.Content | ConvertFrom-Json
Write-Host "✅ Código generado: $($resultado.codigo)" -ForegroundColor Green
Write-Host "📊 Emisiones totales: $($resultado.emisiones.emisiones_totales) Ton CO₂e"
```

---

### Test 2: Obtener Catálogo de Combustibles

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/catalogos/combustibles" -UseBasicParsing
$catalogos = $response.Content | ConvertFrom-Json

Write-Host "📦 Combustibles sólidos: $($catalogos.data.solidos.Length)" -ForegroundColor Cyan
Write-Host "🚗 Combustibles líquidos: $($catalogos.data.liquidos.Length)" -ForegroundColor Cyan
Write-Host "🔥 Combustibles gaseosos: $($catalogos.data.gaseosos.Length)" -ForegroundColor Cyan
```

---

### Test 3: Buscar Cálculo por Código

```powershell
$codigo = "HC-2025-000001"  # Reemplazar con código real
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/obtener-calculo/$codigo" -UseBasicParsing
$calculo = $response.Content | ConvertFrom-Json

Write-Host "🏢 Empresa: $($calculo.data.nombre_empresa)" -ForegroundColor Yellow
Write-Host "📅 Fecha: $($calculo.data.fecha_reporte)"
Write-Host "📊 Emisiones: $($calculo.data.emisiones_totales) Ton CO₂e"
```

---

### Test 4: Estadísticas

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/estadisticas" -UseBasicParsing
$stats = $response.Content | ConvertFrom-Json

Write-Host "📈 Total cálculos de huella: $($stats.data.totalCalculosHuella)" -ForegroundColor Green
Write-Host "📈 Total autodiagnósticos: $($stats.data.totalCalculosAutogestion)" -ForegroundColor Green
Write-Host "🏢 Total empresas: $($stats.data.totalEmpresas)" -ForegroundColor Green
```

---

## 💾 2. CÓDIGO PARA FormularioHuella.js {#formulario-huella}

### Paso 1: Agregar estados al inicio del componente

```javascript
// AGREGAR ESTOS ESTADOS AL INICIO
const [codigoSeguimiento, setCodigoSeguimiento] = useState(null);
const [calculoGuardado, setCalculoGuardado] = useState(false);
const [guardandoBD, setGuardandoBD] = useState(false);

// Estados para catálogos
const [catalogoSolidos, setCatalogoSolidos] = useState([]);
const [catalogoLiquidos, setCatalogoLiquidos] = useState([]);
const [catalogoGaseosos, setCatalogoGaseosos] = useState([]);
```

---

### Paso 2: Cargar catálogos al inicio

```javascript
// AGREGAR ESTE useEffect AL INICIO DEL COMPONENTE
useEffect(() => {
  const cargarCatalogos = async () => {
    try {
      console.log('🔄 Cargando catálogos desde base de datos...');
      
      const response = await fetch('/api/catalogos/combustibles');
      const data = await response.json();
      
      if (data.success) {
        setCatalogoSolidos(data.data.solidos || []);
        setCatalogoLiquidos(data.data.liquidos || []);
        setCatalogoGaseosos(data.data.gaseosos || []);
        
        console.log(`✅ Catálogos cargados:
          - Sólidos: ${data.data.solidos?.length || 0}
          - Líquidos: ${data.data.liquidos?.length || 0}
          - Gaseosos: ${data.data.gaseosos?.length || 0}`);
      }
    } catch (error) {
      console.error('❌ Error cargando catálogos:', error);
      alert('No se pudieron cargar los catálogos. Verifique la conexión a la base de datos.');
    }
  };
  
  cargarCatalogos();
}, []); // Solo ejecutar una vez al montar
```

---

### Paso 3: Crear función para guardar en BD

```javascript
// AGREGAR ESTA FUNCIÓN ANTES DE LA FUNCIÓN generarPDF()
const guardarEnBaseDatos = async () => {
  try {
    setGuardandoBD(true);
    console.log('💾 Guardando cálculo en base de datos...');
    
    const datosParaBD = {
      datosEmpresa: {
        nombreEmpresa: datosEmpresa.nombreEmpresa,
        nit: datosEmpresa.nit,
        sector: datosEmpresa.sector,
        departamento: datosEmpresa.departamento,
        municipio: datosEmpresa.municipio || datosEmpresa.ciudad,
        direccion: datosEmpresa.direccion,
        telefono: datosEmpresa.telefono,
        correo: datosEmpresa.correo,
        personaElabora: datosEmpresa.personaElabora,
        cargo: datosEmpresa.cargo
      },
      fecha: new Date().toISOString().split('T')[0],
      añoReporte: new Date().getFullYear(),
      periodoInicio: periodoInicio || null,
      periodoFin: periodoFin || null,
      
      // Combustibles
      solidos: combustiblesSolidos || [],
      liquidos: combustiblesLiquidos || [],
      gaseosos: combustiblesGaseosos || [],
      liquidosMoviles: combustiblesLiquidosMoviles || [],
      gaseososMoviles: combustiblesGaseososMoviles || [],
      
      // Alcance 2 y 3
      electricidad: consumosElectricidad || [],
      vuelos: vuelosAereos || [],
      extintores: extintoresRecargados || [],
      
      // Resultados
      totalEmisiones: emisionesTotales,
      nivel: evaluacionNivel,
      arbolesCompensar: arbolesNecesarios,
      
      notas: notasAdicionales || null
    };
    
    const response = await fetch('/api/guardar-huella', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosParaBD)
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      setCodigoSeguimiento(resultado.codigo);
      setCalculoGuardado(true);
      
      console.log(`✅ Guardado exitoso!
        Código: ${resultado.codigo}
        ID: ${resultado.id}
        Emisiones: ${resultado.emisiones?.emisiones_totales || 0} Ton CO₂e`);
      
      // Mostrar alerta de éxito
      alert(`✅ ¡Cálculo Guardado Exitosamente!

Código de seguimiento: ${resultado.codigo}

📊 Emisiones Totales: ${resultado.emisiones?.emisiones_totales || 0} Ton CO₂e
   • Alcance 1: ${resultado.emisiones?.emisiones_alcance_1 || 0} Ton CO₂e
   • Alcance 2: ${resultado.emisiones?.emisiones_alcance_2 || 0} Ton CO₂e
   • Alcance 3: ${resultado.emisiones?.emisiones_alcance_3 || 0} Ton CO₂e

⚠️ Guarde este código para consultar su cálculo en el futuro.`);
      
      return resultado.codigo;
    } else {
      throw new Error(resultado.error || 'Error desconocido al guardar');
    }
    
  } catch (error) {
    console.error('❌ Error guardando en base de datos:', error);
    alert(`❌ Error al guardar en base de datos:\n\n${error.message}\n\nVerifique su conexión a internet y que el servidor esté funcionando.`);
    return null;
  } finally {
    setGuardandoBD(false);
  }
};
```

---

### Paso 4: Modificar función generarPDF()

```javascript
// REEMPLAZAR LA FUNCIÓN generarPDF() EXISTENTE
const generarPDF = async () => {
  try {
    console.log('📄 Iniciando generación de PDF...');
    
    // PRIMERO: Guardar en base de datos
    const codigo = await guardarEnBaseDatos();
    
    if (!codigo) {
      console.error('❌ No se pudo guardar en BD, cancelando PDF');
      return;
    }
    
    console.log('✅ Datos guardados, generando PDF...');
    
    // SEGUNDO: Generar PDF con código
    const datosParaPDF = {
      // ... todos los datos actuales ...
      codigoSeguimiento: codigo  // ← AGREGAR CÓDIGO
    };
    
    // ... resto del código de PDF actual ...
    
  } catch (error) {
    console.error('❌ Error en proceso de PDF:', error);
    alert('Error al generar PDF. Verifique la consola para más detalles.');
  }
};
```

---

### Paso 5: Agregar indicador visual en interfaz

```jsx
{/* AGREGAR ESTE BLOQUE DESPUÉS DEL TÍTULO PRINCIPAL */}
{guardandoBD && (
  <div className="alert alert-info">
    <div className="spinner-border spinner-border-sm me-2" role="status">
      <span className="visually-hidden">Guardando...</span>
    </div>
    Guardando cálculo en base de datos...
  </div>
)}

{calculoGuardado && codigoSeguimiento && (
  <div className="alert alert-success">
    <h5 className="alert-heading">✅ Cálculo Guardado Exitosamente</h5>
    <hr />
    <p className="mb-1">
      <strong>Código de seguimiento:</strong>
    </p>
    <p>
      <code style={{ 
        fontSize: '1.3em', 
        padding: '8px 15px', 
        background: '#e8f5e9',
        border: '2px dashed #4caf50',
        borderRadius: '5px',
        display: 'inline-block'
      }}>
        {codigoSeguimiento}
      </code>
    </p>
    <hr />
    <p className="mb-0">
      <small>
        ⚠️ <strong>Importante:</strong> Guarde este código para consultar su cálculo en el futuro
      </small>
    </p>
  </div>
)}
```

---

## 📝 3. CÓDIGO PARA FormularioAutogestion.js {#formulario-autogestion}

### Paso 1: Agregar estados

```javascript
const [codigoSeguimiento, setCodigoSeguimiento] = useState(null);
const [calculoGuardado, setCalculoGuardado] = useState(false);
```

---

### Paso 2: Crear función de guardado

```javascript
const guardarEnBaseDatos = async () => {
  try {
    console.log('💾 Guardando autogestión en base de datos...');
    
    const datosParaBD = {
      datosEmpresa: {
        nombreEmpresa: datosEmpresa.nombreEmpresa,
        nit: datosEmpresa.nit,
        sector: datosEmpresa.sector,
        departamento: datosEmpresa.departamento,
        municipio: datosEmpresa.municipio,
        direccion: datosEmpresa.direccion,
        telefono: datosEmpresa.telefono,
        correo: datosEmpresa.correo,
        personaElabora: datosEmpresa.personaElabora,
        cargo: datosEmpresa.cargo
      },
      fecha: new Date().toISOString().split('T')[0],
      añoReporte: new Date().getFullYear(),
      
      resultados: {
        porcentajeEconomico: promedios.A.porcentajeFinal,
        porcentajeAmbiental: promedios.B.porcentajeFinal,
        porcentajeEnergia: promedios.C.porcentajeFinal,
        porcentajeSeguridad: promedios.D.porcentajeFinal,
        porcentajeSocial: promedios.E.porcentajeFinal,
        porcentajeAlmacen: promedios.F.porcentajeFinal,
        nivelCumplimiento: nivelCumplimiento
      },
      
      respuestas: [],
      promediosBloques: []
    };
    
    // Procesar respuestas por sección
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(seccion => {
      const esquema = esquemas['seccion' + seccion];
      const respuestasSec = respuestas['seccion' + seccion];
      const opcs = seccion === 'E' ? opciones.seccionE : opciones.standard;
      
      if (esquema && respuestasSec) {
        esquema.blocks.forEach(block => {
          // Guardar promedio del bloque
          const promedioBloque = promedios[seccion].bloques[block.id];
          if (promedioBloque !== undefined) {
            datosParaBD.promediosBloques.push({
              seccion: seccion,
              bloque: block.id,
              nombreBloque: block.title,
              promedioBloque: promedioBloque,
              totalPreguntas: block.questions.length,
              preguntasRespondidas: block.questions.length
            });
          }
          
          // Guardar respuestas individuales
          block.questions.forEach((question, idx) => {
            const resp = respuestasSec[question.id];
            const opcionSeleccionada = opcs.find(opt => opt.value === resp);
            
            datosParaBD.respuestas.push({
              seccion: seccion,
              bloque: block.id,
              preguntaId: question.id,
              numeroPregunta: idx + 1,
              textoPregunta: question.text,
              respuesta: resp,
              puntaje: opcionSeleccionada ? opcionSeleccionada.score : 0
            });
          });
        });
      }
    });
    
    const response = await fetch('/api/guardar-autogestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaBD)
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      setCodigoSeguimiento(resultado.codigo);
      setCalculoGuardado(true);
      
      alert(`✅ Autodiagnóstico guardado exitosamente!\n\nCódigo: ${resultado.codigo}\n\nPorcentaje final: ${resultado.resultados.porcentaje_final}%`);
      
      return resultado.codigo;
    } else {
      throw new Error(resultado.error);
    }
    
  } catch (error) {
    console.error('❌ Error guardando autogestión:', error);
    alert(`❌ Error: ${error.message}`);
    return null;
  }
};
```

---

## 📄 4. MODIFICAR generarPDFHuella() en setupProxy.js {#pdf-huella}

### Buscar la función y agregar al inicio:

```javascript
// En setupProxy.js, dentro de la función generarPDFHuella()
// AGREGAR DESPUÉS DE: const doc = new PDFDocument({ size: 'letter', margin: 50 });

// ========================================
// CÓDIGO DE SEGUIMIENTO EN ENCABEZADO
// ========================================
if (data.codigoSeguimiento) {
  doc.fontSize(10)
     .fillColor('#0066cc')
     .font('Helvetica-Bold')
     .text(`Código de Seguimiento: ${data.codigoSeguimiento}`, 50, 25, {
       align: 'right'
     });
  
  // Línea separadora
  doc.moveTo(50, 40)
     .lineTo(doc.page.width - 50, 40)
     .stroke();
}

// Ajustar posición Y inicial si hay código
let yPosition = data.codigoSeguimiento ? 50 : 30;
```

---

### Agregar en pie de página (antes de doc.end()):

```javascript
// ========================================
// PIE DE PÁGINA CON CÓDIGO
// ========================================
const footerY = doc.page.height - 40;

doc.fontSize(8)
   .fillColor('#666666')
   .font('Helvetica')
   .text(
     `Documento generado el ${new Date().toLocaleDateString('es-CO', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     })}`,
     50,
     footerY,
     { align: 'center' }
   );

if (data.codigoSeguimiento) {
  doc.fontSize(8)
     .fillColor('#0066cc')
     .font('Helvetica-Bold')
     .text(
       `Código: ${data.codigoSeguimiento}`,
       50,
       footerY + 12,
       { align: 'center' }
     );
}

// Línea superior del footer
doc.moveTo(50, footerY - 10)
   .lineTo(doc.page.width - 50, footerY - 10)
   .stroke();
```

---

## 🔍 5. CREAR PÁGINA DE CONSULTA {#pagina-consulta}

### Crear archivo: `Landing/src/pages/Consulta/ConsultaCalculos.js`

```javascript
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Table } from 'react-bootstrap';

export default function ConsultaCalculos() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculo, setCalculo] = useState(null);
  const [error, setError] = useState(null);

  const buscarCalculo = async () => {
    if (!codigo) {
      setError('Por favor ingrese un código');
      return;
    }
    
    setLoading(true);
    setError(null);
    setCalculo(null);
    
    try {
      const response = await fetch(`/api/obtener-calculo/${codigo}`);
      const data = await response.json();
      
      if (data.success) {
        setCalculo(data.data);
        console.log('✅ Cálculo encontrado:', data.data);
      } else {
        setError(data.error || 'Cálculo no encontrado');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error al consultar. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarCalculo();
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row>
        <Col md={10} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">
                🔍 Consultar Cálculo por Código
              </h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Código de Seguimiento
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="HC-2025-000001 o AG-2025-000001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  style={{ fontSize: '1.2em', padding: '12px' }}
                />
                <Form.Text className="text-muted">
                  Ingrese el código que recibió al realizar su cálculo
                </Form.Text>
              </Form.Group>
              
              <Button 
                variant="primary" 
                size="lg"
                onClick={buscarCalculo} 
                disabled={loading || !codigo}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Buscando...
                  </>
                ) : (
                  '🔍 Buscar'
                )}
              </Button>
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  <strong>❌ Error:</strong> {error}
                </Alert>
              )}
              
              {calculo && (
                <div className="mt-4">
                  <Alert variant="success">
                    <h4 className="alert-heading">✅ Cálculo Encontrado</h4>
                  </Alert>
                  
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h5>📋 Información de la Empresa</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table borderless>
                        <tbody>
                          <tr>
                            <td className="fw-bold" width="30%">Empresa:</td>
                            <td>{calculo.nombre_empresa}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">NIT:</td>
                            <td>{calculo.nit}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Sector:</td>
                            <td>{calculo.sector || 'No especificado'}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Ubicación:</td>
                            <td>{calculo.municipio}, {calculo.departamento}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Fecha de reporte:</td>
                            <td>{new Date(calculo.fecha_reporte).toLocaleDateString('es-CO')}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                  
                  {/* Si es Huella de Carbono */}
                  {calculo.emisiones_totales !== undefined && (
                    <Card className="mb-3">
                      <Card.Header className="bg-success text-white">
                        <h5 className="mb-0">📊 Resultados de Huella de Carbono</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={3}>
                            <div className="text-center p-3 bg-light rounded">
                              <h6 className="text-muted">Alcance 1</h6>
                              <h4 className="text-primary">{calculo.emisiones_alcance_1} Ton CO₂e</h4>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="text-center p-3 bg-light rounded">
                              <h6 className="text-muted">Alcance 2</h6>
                              <h4 className="text-info">{calculo.emisiones_alcance_2} Ton CO₂e</h4>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="text-center p-3 bg-light rounded">
                              <h6 className="text-muted">Alcance 3</h6>
                              <h4 className="text-warning">{calculo.emisiones_alcance_3} Ton CO₂e</h4>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="text-center p-3 bg-success text-white rounded">
                              <h6>TOTAL</h6>
                              <h3>{calculo.emisiones_totales} Ton CO₂e</h3>
                            </div>
                          </Col>
                        </Row>
                        
                        {calculo.nivel_evaluacion && (
                          <Alert variant="info" className="mt-3">
                            <strong>Nivel de evaluación:</strong> {calculo.nivel_evaluacion}
                          </Alert>
                        )}
                        
                        {calculo.arboles_compensar && (
                          <Alert variant="success" className="mt-2">
                            <strong>🌳 Árboles para compensar:</strong> {calculo.arboles_compensar} árboles
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                  
                  {/* Si es Autogestión */}
                  {calculo.porcentaje_final !== undefined && (
                    <Card className="mb-3">
                      <Card.Header className="bg-info text-white">
                        <h5 className="mb-0">📊 Resultados de Autodiagnóstico</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center mb-4">
                          <h2 className="display-3 text-primary">{calculo.porcentaje_final}%</h2>
                          <h5 className="text-muted">Porcentaje de Cumplimiento</h5>
                        </div>
                        
                        <Row>
                          <Col md={6}>
                            <Table striped bordered size="sm">
                              <tbody>
                                <tr>
                                  <td>Económico</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_economico}%</td>
                                </tr>
                                <tr>
                                  <td>Ambiental</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_ambiental}%</td>
                                </tr>
                                <tr>
                                  <td>Energía</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_energia}%</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                          <Col md={6}>
                            <Table striped bordered size="sm">
                              <tbody>
                                <tr>
                                  <td>Seguridad</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_seguridad}%</td>
                                </tr>
                                <tr>
                                  <td>Social</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_social}%</td>
                                </tr>
                                <tr>
                                  <td>Almacén</td>
                                  <td className="text-end fw-bold">{calculo.porcentaje_almacen}%</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                        
                        {calculo.nivel_cumplimiento && (
                          <Alert variant="success" className="mt-3">
                            <strong>Nivel de cumplimiento:</strong> {calculo.nivel_cumplimiento}
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                  
                  {calculo.notas && (
                    <Card>
                      <Card.Header className="bg-light">
                        <h5>📝 Notas</h5>
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-0">{calculo.notas}</p>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
```

---

### Agregar ruta en `routes.js`:

```javascript
// Importar componente
import ConsultaCalculos from './pages/Consulta/ConsultaCalculos';

// En el array de rutas:
{
  path: '/consulta',
  element: <ConsultaCalculos />,
  title: 'Consultar Cálculo'
}
```

---

## 🍪 6. BANNER DE COOKIES {#banner-cookies}

### Crear: `Landing/src/component/Legal/CookieBanner.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

export default function CookieBanner() {
  const [mostrar, setMostrar] = useState(false);
  
  useEffect(() => {
    // Verificar si ya aceptó cookies
    const consentimiento = localStorage.getItem('cookieConsent');
    if (!consentimiento) {
      // Mostrar banner después de 2 segundos
      setTimeout(() => {
        setMostrar(true);
      }, 2000);
    }
  }, []);
  
  const aceptarCookies = async () => {
    try {
      // Guardar en localStorage
      localStorage.setItem('cookieConsent', 'true');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      
      // TODO: Guardar en BD cuando se implemente endpoint
      /*
      await fetch('/api/consentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acepta_cookies_necesarias: true,
          acepta_terminos: true,
          acepta_privacidad: true,
          version_terminos: 'v1.0',
          version_privacidad: 'v1.0'
        })
      });
      */
      
      console.log('✅ Consentimiento de cookies aceptado');
      setMostrar(false);
    } catch (error) {
      console.error('❌ Error guardando consentimiento:', error);
      // Aunque falle la BD, cerrar banner
      setMostrar(false);
    }
  };
  
  const rechazarCookies = () => {
    // Por ahora solo cerrar (las cookies necesarias se usan igual)
    localStorage.setItem('cookieConsent', 'minimal');
    setMostrar(false);
  };
  
  if (!mostrar) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.5s ease-out'
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="mb-2">🍪 Uso de Cookies</h5>
            <p className="mb-0">
              Utilizamos cookies estrictamente necesarias para el funcionamiento de la plataforma.
              Al continuar navegando, aceptas nuestra{' '}
              <a href="/privacidad" style={{ color: '#3498db' }}>
                Política de Privacidad
              </a>{' '}
              y nuestros{' '}
              <a href="/terminos" style={{ color: '#3498db' }}>
                Términos y Condiciones
              </a>.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <Button 
              variant="outline-light" 
              className="me-2"
              onClick={rechazarCookies}
            >
              Solo Necesarias
            </Button>
            <Button 
              variant="success"
              onClick={aceptarCookies}
            >
              Aceptar Todas
            </Button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
```

---

### Agregar en App.js:

```javascript
import CookieBanner from './component/Legal/CookieBanner';

// Dentro del return, al final:
function App() {
  return (
    <div className="App">
      {/* ... resto del código ... */}
      
      <CookieBanner />  {/* ← AGREGAR AL FINAL */}
    </div>
  );
}
```

---

## ✅ CHECKLIST FINAL

Después de implementar todo:

- [ ] ✅ Probé endpoints con PowerShell
- [ ] ✅ Guardé un cálculo exitosamente
- [ ] ✅ Obtuve código HC-2025-000001
- [ ] ✅ Consulté el cálculo por código
- [ ] ✅ FormularioHuella.js guarda en BD
- [ ] ✅ FormularioAutogestion.js guarda en BD
- [ ] ✅ PDF muestra código de seguimiento
- [ ] ✅ Página de consulta funciona
- [ ] ✅ Catálogos se cargan desde BD
- [ ] ✅ Banner de cookies aparece

---

**📞 ¿Problemas?** Revisa:
1. PostgreSQL corriendo: `netstat -ano | Select-String ":5432"`
2. Servidor React corriendo: `http://localhost:3000`
3. Módulo pg instalado: `yarn list --pattern pg`
4. Archivo .env tiene credenciales correctas

---

**Última actualización:** 3 de Octubre, 2025  
**Estado:** ✅ Código listo para implementar

