
import React, { useState } from "react";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardBody, Button, Form, FormGroup, Label, Input, Row, Col, Progress, Table } from "reactstrap";
import FeatherIcon from "feather-icons-react";

// Registrar componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);


const pasos = [
  "Datos Generales",
  "Combustibles Líquidos",
  "Combustibles Sólidos",
  "Vuelos Corporativos",
  "Resumen y Resultados"
];

const OPCIONES_COMBUSTIBLES_SOL = [
  "Carbón Genérico",
  "Leña",
  "Carbón Santander",
  "Otro"
];

const initialFilaCombSol = {
  combustible: "",
  consumoKg: "",
  poderCalorifico: "",
  energiaTJ: "",
  factorCO2: "",
  factorCH4: "",
  factorN2O: "",
  factorSO2: ""
};

const initialDatosGenerales = {
  organizacion: "",
  responsable: "",
  trabajadores: "",
  departamento: "",
  municipio: "",
  coordenadaX: "",
  coordenadaY: "",
  area: "",
  periodo: "2024",
  fecha: "",
  quien: "",
  correo: ""
};


// Opciones de combustibles líquidos (puedes ampliar según tu Excel)
const OPCIONES_COMBUSTIBLES_LIQ = [
  "Biodiesel palma",
  "Etanol Anhidro",
  "Fuel Oil # 4 -",
  "Gasolina E10 (Comercial)",
  "Otro"
];

const initialFilaCombLiq = {
  combustible: "",
  consumoGal: "",
  consumoL: "",
  densidad: "",
  masa: "",
  poderCalorifico: "",
  energiaTJ: "",
  factorCO2: "",
  factorCH4: "",
  factorN2O: "",
  factorSO2: ""
};

// Opciones y objeto inicial para vuelos corporativos
const OPCIONES_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const OPCIONES_CLASE = ["Económica", "Ejecutiva"];
const OPCIONES_TIPO_VUELO = [
  "Short Haul (< 482.8 km)",
  "Medium Haul (>= 482.8 km, < 3701.49 km)",
  "Long Haul (>= 3701.49 km)"
];
const initialFilaVuelo = {
  mes: "",
  origen: "",
  destino: "",
  clase: "",
  personas: "",
  tipoVuelo: "",
  factorEmision: "",
  emisionTCO2: "",
  emisionKGCO2: ""
};

const CalculadoraEjemplo = () => {
  const [step, setStep] = useState(0);
  const [datosGenerales, setDatosGenerales] = useState(initialDatosGenerales);
  const [combustiblesLiq, setCombustiblesLiq] = useState([{ ...initialFilaCombLiq }]);
  const [combustiblesSol, setCombustiblesSol] = useState([{ ...initialFilaCombSol }]);
  const [vuelos, setVuelos] = useState([{ ...initialFilaVuelo }]);
  // Estados para mostrar/ocultar detalles en dashboard
  const [showLiq, setShowLiq] = useState(false);
  const [showSol, setShowSol] = useState(false);
  const [showVuelos, setShowVuelos] = useState(false);

  // Combustibles sólidos handlers
  const handleCombSolChange = (idx, e) => {
    const arr = [...combustiblesSol];
    arr[idx][e.target.name] = e.target.value;
    setCombustiblesSol(arr);
  };

  const addCombSolRow = () => {
    setCombustiblesSol([...combustiblesSol, { ...initialFilaCombSol }]);
  };

  const removeCombSolRow = idx => {
    if (combustiblesSol.length === 1) return;
    setCombustiblesSol(combustiblesSol.filter((_, i) => i !== idx));
  };

  // Vuelos handlers
  const handleVueloChange = (idx, e) => {
    const arr = [...vuelos];
    arr[idx][e.target.name] = e.target.value;
    setVuelos(arr);
  };

  const addVueloRow = () => {
    setVuelos([...vuelos, { ...initialFilaVuelo }]);
  };

  const removeVueloRow = idx => {
    if (vuelos.length === 1) return;
    setVuelos(vuelos.filter((_, i) => i !== idx));
  };

  // Handlers
  const handleGenerales = e => {
    setDatosGenerales({ ...datosGenerales, [e.target.name]: e.target.value });
  };

  const handleCombLiqChange = (idx, e) => {
    const arr = [...combustiblesLiq];
    arr[idx][e.target.name] = e.target.value;
    setCombustiblesLiq(arr);
  };

  const addCombLiqRow = () => {
    setCombustiblesLiq([...combustiblesLiq, { ...initialFilaCombLiq }]);
  };

  const removeCombLiqRow = idx => {
    if (combustiblesLiq.length === 1) return;
    setCombustiblesLiq(combustiblesLiq.filter((_, i) => i !== idx));
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Form className="p-2">
            <h5 className="mb-2">Información General de la Organización</h5>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="organizacion">Nombre de la organización</Label>
                  <Input
                    id="organizacion"
                    name="organizacion"
                    value={datosGenerales.organizacion}
                    onChange={handleGenerales}
                    required
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="responsable">Nombre del responsable</Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={datosGenerales.responsable}
                    onChange={handleGenerales}
                    required
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="trabajadores">Número de trabajadores</Label>
                  <Input
                    id="trabajadores"
                    name="trabajadores"
                    type="number"
                    value={datosGenerales.trabajadores}
                    onChange={handleGenerales}
                    required
                    min="1"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    name="departamento"
                    value={datosGenerales.departamento}
                    onChange={handleGenerales}
                    required
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="municipio">Municipio</Label>
                  <Input
                    id="municipio"
                    name="municipio"
                    value={datosGenerales.municipio}
                    onChange={handleGenerales}
                    required
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="coordenadaX">Coordenada X</Label>
                  <Input
                    id="coordenadaX"
                    name="coordenadaX"
                    value={datosGenerales.coordenadaX}
                    onChange={handleGenerales}
                    required
                    step="any"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="coordenadaY">Coordenada Y</Label>
                  <Input
                    id="coordenadaY"
                    name="coordenadaY"
                    value={datosGenerales.coordenadaY}
                    onChange={handleGenerales}
                    required
                    step="any"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="area">Área construida (m²)</Label>
                  <Input
                    id="area"
                    name="area"
                    value={datosGenerales.area}
                    onChange={handleGenerales}
                    required
                    type="number"
                    min="0"
                    step="any"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="periodo">Periodo</Label>
                  <Input
                    id="periodo"
                    name="periodo"
                    value={datosGenerales.periodo}
                    onChange={handleGenerales}
                    required
                    type="number"
                    min="2020"
                    max="2099"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="fecha">Fecha de diligenciamiento</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    value={datosGenerales.fecha}
                    onChange={handleGenerales}
                    required
                    type="date"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="quien">Quién diligencia</Label>
                  <Input
                    id="quien"
                    name="quien"
                    value={datosGenerales.quien}
                    onChange={handleGenerales}
                    required
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="correo">Correo electrónico</Label>
                  <Input
                    id="correo"
                    name="correo"
                    value={datosGenerales.correo}
                    onChange={handleGenerales}
                    required
                    type="email"
                    className="form-control-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-2">
              <Button color="primary" size="sm" onClick={() => setStep(1)} className="rounded-pill">
                Siguiente <FeatherIcon icon="arrow-right" className="ms-2" />
              </Button>
            </div>
          </Form>
        );
      case 1:
        return (
          <Card className="shadow-sm border-0 bg-white rounded-3 mb-2">
            <CardBody>
              <h6 className="mb-2">Combustibles Líquidos - Consumo anual</h6>
              <p className="text-muted mb-2" style={{fontSize: '0.95rem'}}>Agrega los combustibles líquidos consumidos por la organización durante el año. Completa los campos según tu información disponible.</p>
              <div style={{overflowX: 'auto'}}>
                <table className="table table-bordered table-sm align-middle mb-2" style={{minWidth: 900}}>
                  <thead className="bg-success text-white rounded-3">
                    <tr>
                      <th>Combustible</th>
                      <th>Consumo anual (gal)</th>
                      <th>Consumo anual (l)</th>
                      <th>Densidad (kg/l)</th>
                      <th>Masa (kg)</th>
                      <th>Poder calorífico (MJ/kg)</th>
                      <th>Consumo energía (TJ)</th>
                      <th>Factor CO₂ (Kg/TJ)</th>
                      <th>Factor CH₄ (Kg/TJ)</th>
                      <th>Factor N₂O (Kg/TJ)</th>
                      <th>Factor SO₂ (Kg/TJ)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {combustiblesLiq.map((fila, idx) => (
                      <tr key={idx}>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            name="combustible"
                            value={fila.combustible}
                            onChange={e => handleCombLiqChange(idx, e)}
                          >
                            <option value="">Seleccione</option>
                            {OPCIONES_COMBUSTIBLES_LIQ.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td><input type="number" className="form-control form-control-sm" name="consumoGal" value={fila.consumoGal} onChange={e => handleCombLiqChange(idx, e)} min="0" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="consumoL" value={fila.consumoL} onChange={e => handleCombLiqChange(idx, e)} min="0" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="densidad" value={fila.densidad} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="masa" value={fila.masa} onChange={e => handleCombLiqChange(idx, e)} min="0" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="poderCalorifico" value={fila.poderCalorifico} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="energiaTJ" value={fila.energiaTJ} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="factorCO2" value={fila.factorCO2} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="factorCH4" value={fila.factorCH4} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="factorN2O" value={fila.factorN2O} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td><input type="number" className="form-control form-control-sm" name="factorSO2" value={fila.factorSO2} onChange={e => handleCombLiqChange(idx, e)} min="0" step="0.0001" /></td>
                        <td>
                          <Button color="danger" size="sm" onClick={() => removeCombLiqRow(idx)} disabled={combustiblesLiq.length === 1}>
                            <FeatherIcon icon="trash-2" size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <Button color="secondary" size="sm" onClick={() => setStep(0)}>
                  Volver
                </Button>
                <div>
                  <Button color="info" size="sm" className="me-2 rounded-pill px-3 py-1 d-inline-flex align-items-center" onClick={addCombLiqRow}>
                    <FeatherIcon icon="plus" size={16} className="me-1" />Agregar fila
                  </Button>
                  <Button color="primary" size="sm" onClick={() => setStep(2)}>
                    Siguiente <FeatherIcon icon="arrow-right" className="ms-2" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      case 2:
        return (
          <div className="p-2">
            <h5 className="mb-2">Combustibles Sólidos - Consumo anual</h5>
            <p className="text-muted mb-3">Agrega los combustibles sólidos consumidos por la organización durante el año. Completa los campos según tu información disponible.</p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle mb-2">
                <thead className="bg-success text-white rounded-3">
                  <tr>
                    <th>Combustible</th>
                    <th>Consumo anual (kg)</th>
                    <th>Poder calorífico (MJ/kg)</th>
                    <th>Consumo energía (TJ)</th>
                    <th>Factor CO₂ (Kg/TJ)</th>
                    <th>Factor CH₄ (Kg/TJ)</th>
                    <th>Factor N₂O (Kg/TJ)</th>
                    <th>Factor SO₂ (Kg/TJ)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {combustiblesSol.map((fila, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          name="combustible"
                          value={fila.combustible}
                          onChange={e => handleCombSolChange(idx, e)}
                        >
                          <option value="">Seleccione</option>
                          {OPCIONES_COMBUSTIBLES_SOL.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" className="form-control form-control-sm" name="consumoKg" value={fila.consumoKg} onChange={e => handleCombSolChange(idx, e)} min="0" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="poderCalorifico" value={fila.poderCalorifico} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="energiaTJ" value={fila.energiaTJ} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="factorCO2" value={fila.factorCO2} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="factorCH4" value={fila.factorCH4} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="factorN2O" value={fila.factorN2O} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="factorSO2" value={fila.factorSO2} onChange={e => handleCombSolChange(idx, e)} min="0" step="0.0001" /></td>
                      <td>
                        <Button color="danger" size="sm" onClick={() => removeCombSolRow(idx)} disabled={combustiblesSol.length === 1} className="rounded-pill">
                          <FeatherIcon icon="trash-2" size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button color="secondary" onClick={() => setStep(1)} className="rounded-pill">
                Volver
              </Button>
              <div>
                <Button color="info" size="sm" className="me-2 rounded-pill px-3 py-1 d-inline-flex align-items-center" onClick={addCombSolRow}>
                  <FeatherIcon icon="plus" size={16} className="me-1" />Agregar fila
                </Button>
                <Button color="primary" onClick={() => setStep(3)} className="rounded-pill">
                  Siguiente <FeatherIcon icon="arrow-right" className="ms-2" />
                </Button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-2">
            <h5 className="mb-2">Vuelos Corporativos</h5>
            <p className="text-muted mb-3">Registra los vuelos corporativos realizados por los colaboradores de la organización durante el año.</p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle mb-2">
                <thead className="bg-success text-white rounded-3">
                  <tr>
                    <th>Mes</th>
                    <th>Ciudad Origen</th>
                    <th>Ciudad Destino</th>
                    <th>Clase</th>
                    <th>Número de personas</th>
                    <th>Tipo de vuelo</th>
                    <th>Factor de Emisión (kgCO2e)</th>
                    <th>Emisión (tCO2e)</th>
                    <th>Emisión (kgCO2e)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {vuelos.map((fila, idx) => (
                    <tr key={idx}>
                      <td>
                        <select className="form-select form-select-sm" name="mes" value={fila.mes} onChange={e => handleVueloChange(idx, e)}>
                          <option value="">Seleccione</option>
                          {OPCIONES_MESES.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="text" className="form-control form-control-sm" name="origen" value={fila.origen} onChange={e => handleVueloChange(idx, e)} /></td>
                      <td><input type="text" className="form-control form-control-sm" name="destino" value={fila.destino} onChange={e => handleVueloChange(idx, e)} /></td>
                      <td>
                        <select className="form-select form-select-sm" name="clase" value={fila.clase} onChange={e => handleVueloChange(idx, e)}>
                          <option value="">Seleccione</option>
                          {OPCIONES_CLASE.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" className="form-control form-control-sm" name="personas" value={fila.personas} onChange={e => handleVueloChange(idx, e)} min="1" /></td>
                      <td>
                        <select className="form-select form-select-sm" name="tipoVuelo" value={fila.tipoVuelo} onChange={e => handleVueloChange(idx, e)}>
                          <option value="">Seleccione</option>
                          {OPCIONES_TIPO_VUELO.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" className="form-control form-control-sm" name="factorEmision" value={fila.factorEmision} onChange={e => handleVueloChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="emisionTCO2" value={fila.emisionTCO2} onChange={e => handleVueloChange(idx, e)} min="0" step="0.0001" /></td>
                      <td><input type="number" className="form-control form-control-sm" name="emisionKGCO2" value={fila.emisionKGCO2} onChange={e => handleVueloChange(idx, e)} min="0" step="0.0001" /></td>
                      <td>
                        <Button color="danger" size="sm" onClick={() => removeVueloRow(idx)} disabled={vuelos.length === 1} className="rounded-pill">
                          <FeatherIcon icon="trash-2" size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button color="secondary" onClick={() => setStep(2)} className="rounded-pill">
                Volver
              </Button>
              <div>
                <Button color="info" size="sm" className="me-2 rounded-pill px-3 py-1 d-inline-flex align-items-center" onClick={addVueloRow}>
                  <FeatherIcon icon="plus" size={16} className="me-1" />Agregar fila
                </Button>
                <Button color="primary" onClick={() => setStep(4)} className="rounded-pill">
                  Siguiente <FeatherIcon icon="arrow-right" className="ms-2" />
                </Button>
              </div>
            </div>
          </div>
        );
      case 4:
        // Calcular totales para dashboard
        const totalLiq = combustiblesLiq.reduce((acc, fila) => acc + (parseFloat(fila.energiaTJ) || 0), 0);
        const totalSol = combustiblesSol.reduce((acc, fila) => acc + (parseFloat(fila.energiaTJ) || 0), 0);
        const totalVuelos = vuelos.reduce((acc, fila) => acc + (parseFloat(fila.emisionTCO2) || 0), 0);

        // Datos para gráficos
        const barData = {
          labels: ["Comb. Líquidos", "Comb. Sólidos", "Vuelos"],
          datasets: [
            {
              label: "Emisiones (tCO₂e/TJ)",
              backgroundColor: ["#198754", "#ffc107", "#0dcaf0"],
              borderColor: ["#157347", "#b68900", "#0a95a0"],
              borderWidth: 1,
              data: [totalLiq, totalSol, totalVuelos],
            },
          ],
        };
        const pieData = {
          labels: ["Comb. Líquidos", "Comb. Sólidos", "Vuelos"],
          datasets: [
            {
              data: [totalLiq, totalSol, totalVuelos],
              backgroundColor: ["#198754", "#ffc107", "#0dcaf0"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        };
        const barOptions = {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Emisiones" } },
          },
        };
        const pieOptions = {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: { enabled: true },
          },
        };
        return (
          <div className="p-2">
            <h5 className="mb-3 text-success fw-bold">
              <FeatherIcon icon="bar-chart-2" className="me-2" />Dashboard de Resultados
            </h5>
            <Row className="mb-4 g-2">
              <Col md={7}>
                <Card className="shadow-sm border-0 bg-white rounded-3 mb-3">
                  <CardBody>
                    <h6 className="fw-bold mb-2">Emisiones por fuente (barras)</h6>
                    <div style={{height: 260}}>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={5}>
                <Card className="shadow-sm border-0 bg-white rounded-3 mb-3">
                  <CardBody>
                    <h6 className="fw-bold mb-2">Proporción de emisiones (torta)</h6>
                    <div style={{height: 260}}>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="mb-2 g-2">
              <Col md={4}>
                <Card className="shadow-sm border-0 bg-white rounded-3 text-center">
                  <CardBody>
                    <FeatherIcon icon="droplet" size={32} className="text-primary mb-1" />
                    <h6 className="fw-bold mb-1">Combustibles Líquidos</h6>
                    <span className="badge bg-success mb-2">{totalLiq.toLocaleString()} TJ</span>
                    <Button color="link" size="sm" onClick={() => setShowLiq(v => !v)}>
                      {showLiq ? 'Ocultar' : 'Ver'} detalle
                    </Button>
                    {showLiq && (
                      <Table bordered responsive size="sm" className="mb-0 mt-2">
                        <thead className="bg-light">
                          <tr>
                            <th>Combustible</th>
                            <th>Energía (TJ)</th>
                            <th>CO₂</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combustiblesLiq.map((fila, idx) => (
                            <tr key={idx}>
                              <td>{fila.combustible}</td>
                              <td>{fila.energiaTJ}</td>
                              <td>{fila.factorCO2}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm border-0 bg-white rounded-3 text-center">
                  <CardBody>
                    <FeatherIcon icon="database" size={32} className="text-warning mb-1" />
                    <h6 className="fw-bold mb-1">Combustibles Sólidos</h6>
                    <span className="badge bg-warning text-dark mb-2">{totalSol.toLocaleString()} TJ</span>
                    <Button color="link" size="sm" onClick={() => setShowSol(v => !v)}>
                      {showSol ? 'Ocultar' : 'Ver'} detalle
                    </Button>
                    {showSol && (
                      <Table bordered responsive size="sm" className="mb-0 mt-2">
                        <thead className="bg-light">
                          <tr>
                            <th>Combustible</th>
                            <th>Energía (TJ)</th>
                            <th>CO₂</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combustiblesSol.map((fila, idx) => (
                            <tr key={idx}>
                              <td>{fila.combustible}</td>
                              <td>{fila.energiaTJ}</td>
                              <td>{fila.factorCO2}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm border-0 bg-white rounded-3 text-center">
                  <CardBody>
                    <FeatherIcon icon="airplay" size={32} className="text-info mb-1" />
                    <h6 className="fw-bold mb-1">Vuelos Corporativos</h6>
                    <span className="badge bg-info text-dark mb-2">{totalVuelos.toLocaleString()} tCO₂e</span>
                    <Button color="link" size="sm" onClick={() => setShowVuelos(v => !v)}>
                      {showVuelos ? 'Ocultar' : 'Ver'} detalle
                    </Button>
                    {showVuelos && (
                      <Table bordered responsive size="sm" className="mb-0 mt-2">
                        <thead className="bg-light">
                          <tr>
                            <th>Mes</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Emisión (tCO2e)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vuelos.map((fila, idx) => (
                            <tr key={idx}>
                              <td>{fila.mes}</td>
                              <td>{fila.origen}</td>
                              <td>{fila.destino}</td>
                              <td>{fila.emisionTCO2}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className="bg-light rounded-3 p-2 mt-3">
              <h6 className="fw-bold mb-2 text-secondary">Datos Generales</h6>
              <ul className="mb-2 small">
                <li><b>Organización:</b> {datosGenerales.organizacion}</li>
                <li><b>Responsable:</b> {datosGenerales.responsable}</li>
                <li><b>Trabajadores:</b> {datosGenerales.trabajadores}</li>
                <li><b>Departamento:</b> {datosGenerales.departamento}</li>
                <li><b>Municipio:</b> {datosGenerales.municipio}</li>
                <li><b>Coordenadas:</b> {datosGenerales.coordenadaX}, {datosGenerales.coordenadaY}</li>
                <li><b>Área construida:</b> {datosGenerales.area} m²</li>
                <li><b>Periodo:</b> {datosGenerales.periodo}</li>
                <li><b>Fecha:</b> {datosGenerales.fecha}</li>
                <li><b>Quién diligencia:</b> {datosGenerales.quien}</li>
                <li><b>Correo:</b> {datosGenerales.correo}</li>
              </ul>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button color="secondary" size="sm" onClick={() => setStep(3)}>
                Volver
              </Button>
              <Button color="primary" size="sm" onClick={() => setStep(0)}>
                Nuevo cálculo
              </Button>
            </div>
          </div>
        );
      // Aquí irán los siguientes pasos: Vuelos, Resumen
      default:
        return (
          <div className="text-center p-5">
            <FeatherIcon icon="tool" size={48} className="text-muted mb-3" />
            <h4>Próximamente: Paso {step + 1} - {pasos[step]}</h4>
            <Button color="secondary" className="mt-4" onClick={() => setStep(step - 1)} disabled={step === 0}>
              Volver
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="shadow-sm border-0 mt-3 rounded-4" style={{background: '#f8fafc'}}>
      <CardBody>
        <div className="mb-2">
          <Progress value={((step + 1) / pasos.length) * 100} color="success" className="mb-2 rounded-pill" style={{height: '8px'}} />
          <div className="text-center text-muted mb-2" style={{fontSize: '0.95rem'}}>Paso {step + 1} de {pasos.length}: <b>{pasos[step]}</b></div>
        </div>
        <div className="bg-light rounded-3 p-2 mb-2">
          {renderStep()}
        </div>
      </CardBody>
    </Card>
  );
};

export default CalculadoraEjemplo;
