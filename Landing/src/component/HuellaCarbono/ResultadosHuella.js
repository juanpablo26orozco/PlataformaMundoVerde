import React from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Button,
  Table,
  Alert
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

const ResultadosHuella = ({ formData, onNewCalculation }) => {
  
  // Factores de emisión (kg CO2 equivalente por unidad)
  const factoresEmision = {
    // Combustibles (kg CO2e/litro o kg CO2e/m³)
    gasolina: 2.31,      // kg CO2e/litro
    diesel: 2.68,        // kg CO2e/litro  
    gasNatural: 1.96,    // kg CO2e/m³
    glp: 3.01,           // kg CO2e/kg
    carbon: 2.42,        // kg CO2e/kg
    
    // Electricidad Colombia (kg CO2e/kWh)
    electricidadColombia: 0.164,
    electricidadRenovable: 0.02,
    
    // Transporte (kg CO2e/km)
    vehiculoGasolina: 0.21,
    vehiculoDiesel: 0.27,
    vehiculoElectrico: 0.05,
    vehiculoHibrido: 0.12,
    vueloNacional: 0.25,
    vueloInternacional: 0.31,
    transportePublico: 0.08,
    
    // Residuos (kg CO2e/kg)
    residuosOrganicos: 0.57,
    residuosReciclables: 0.02,
    residuosPeligrosos: 1.84,
    
    // Agua (kg CO2e/m³)
    agua: 0.34,
    aguaTratada: 0.71
  };

  // Calcular emisiones por alcance
  const calcularAlcance1 = () => {
    const { combustibles } = formData;
    return (
      (combustibles.gasolina * factoresEmision.gasolina) +
      (combustibles.diesel * factoresEmision.diesel) +
      (combustibles.gasNatural * factoresEmision.gasNatural) +
      (combustibles.glp * factoresEmision.glp) +
      (combustibles.carbon * factoresEmision.carbon)
    );
  };

  const calcularAlcance2 = () => {
    const { electricidad } = formData;
    let factor = factoresEmision.electricidadColombia;
    
    if (electricidad.tipoEnergia === 'renovable') {
      factor = factoresEmision.electricidadRenovable;
    } else if (electricidad.tipoEnergia === 'mixta') {
      factor = (factoresEmision.electricidadColombia + factoresEmision.electricidadRenovable) / 2;
    }
    
    return electricidad.consumoKwh * factor;
  };

  const calcularAlcance3 = () => {
    const { transporte, residuos, agua } = formData;
    
    // Transporte
    let factorVehiculo = factoresEmision.vehiculoGasolina;
    if (transporte.tipoVehiculo === 'diesel') factorVehiculo = factoresEmision.vehiculoDiesel;
    else if (transporte.tipoVehiculo === 'electrico') factorVehiculo = factoresEmision.vehiculoElectrico;
    else if (transporte.tipoVehiculo === 'hibrido') factorVehiculo = factoresEmision.vehiculoHibrido;
    
    const emisionesTransporte = (
      (transporte.kmVehiculos * factorVehiculo) +
      (transporte.vuelosNacionales * factoresEmision.vueloNacional) +
      (transporte.vuelosInternacionales * factoresEmision.vueloInternacional) +
      (transporte.transportePublico * factoresEmision.transportePublico)
    );
    
    // Residuos
    const emisionesResiduos = (
      (residuos.residuosOrganicos * factoresEmision.residuosOrganicos) +
      (residuos.residuosReciclables * factoresEmision.residuosReciclables) +
      (residuos.residuosPeligrosos * factoresEmision.residuosPeligrosos)
    );
    
    // Agua
    const factorAgua = agua.tratamientoAguas ? factoresEmision.aguaTratada : factoresEmision.agua;
    const emisionesAgua = agua.consumoM3 * factorAgua;
    
    return emisionesTransporte + emisionesResiduos + emisionesAgua;
  };

  const alcance1 = calcularAlcance1();
  const alcance2 = calcularAlcance2();
  const alcance3 = calcularAlcance3();
  const totalEmisiones = alcance1 + alcance2 + alcance3;

  // Generar recomendaciones basadas en los resultados
  const generarRecomendaciones = () => {
    const recomendaciones = [];
    
    if (alcance1 > alcance2 && alcance1 > alcance3) {
      recomendaciones.push({
        prioridad: "Alta",
        area: "Combustibles",
        accion: "Considere migrar a vehículos eléctricos o híbridos, y optimizar el uso de combustibles fósiles.",
        impacto: "Puede reducir hasta un 30% de sus emisiones"
      });
    }
    
    if (alcance2 > 1000) {
      recomendaciones.push({
        prioridad: "Media",
        area: "Electricidad",
        accion: "Implemente medidas de eficiencia energética y considere fuentes de energía renovable.",
        impacto: "Puede reducir hasta un 20% de sus emisiones"
      });
    }
    
    if (formData.transporte.vuelosInternacionales > 0) {
      recomendaciones.push({
        prioridad: "Media",
        area: "Viajes",
        accion: "Promueva reuniones virtuales y compense las emisiones de viajes necesarios.",
        impacto: "Puede reducir hasta un 15% de sus emisiones"
      });
    }
    
    recomendaciones.push({
      prioridad: "Baja",
      area: "General",
      accion: "Implemente un programa de gestión ambiental y monitore regularmente sus emisiones.",
      impacto: "Mejora continua en la gestión de emisiones"
    });
    
    return recomendaciones;
  };

  const recomendaciones = generarRecomendaciones();

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getClasificacion = (emisiones) => {
    if (emisiones < 10) return { nivel: "Muy Bajo", color: "success", icon: "check-circle" };
    if (emisiones < 50) return { nivel: "Bajo", color: "info", icon: "info" };
    if (emisiones < 100) return { nivel: "Medio", color: "warning", icon: "alert-triangle" };
    return { nivel: "Alto", color: "danger", icon: "alert-circle" };
  };

  const clasificacion = getClasificacion(totalEmisiones);

  return (
    <section className="section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="text-center mb-5">
              <h2 className="text-primary">Resultados de Huella de Carbono</h2>
              <p className="text-muted">
                Reporte para: <strong>{formData.nombreEmpresa}</strong> - Año base: {formData.añoBase}
              </p>
            </div>

            {/* Resumen Ejecutivo */}
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="shadow">
                  <CardBody className="text-center p-5">
                    <div className="mb-4">
                      <FeatherIcon 
                        icon={clasificacion.icon} 
                        size={48} 
                        className={`text-${clasificacion.color}`} 
                      />
                    </div>
                    <h3 className="mb-3">
                      Huella de Carbono Total: {" "}
                      <span className={`text-${clasificacion.color}`}>
                        {formatNumber(totalEmisiones)} kg CO₂e
                      </span>
                    </h3>
                    <Alert color={clasificacion.color} className="d-inline-block">
                      <strong>Nivel: {clasificacion.nivel}</strong>
                    </Alert>
                    <p className="text-muted mt-3">
                      Equivalente a <strong>{formatNumber(totalEmisiones / 1000)} toneladas</strong> de CO₂ al año
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Desglose por Alcances */}
            <Row className="mb-4">
              <Col md={4}>
                <Card className="shadow h-100">
                  <CardBody className="text-center">
                    <FeatherIcon icon="zap" size={32} className="text-danger mb-3" />
                    <h5>Alcance 1</h5>
                    <p className="text-muted small">Emisiones Directas</p>
                    <h4 className="text-danger">{formatNumber(alcance1)} kg CO₂e</h4>
                    <div className="progress mt-3">
                      <div 
                        className="progress-bar bg-danger" 
                        style={{width: `${(alcance1/totalEmisiones)*100}%`}}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {((alcance1/totalEmisiones)*100).toFixed(1)}% del total
                    </small>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow h-100">
                  <CardBody className="text-center">
                    <FeatherIcon icon="battery" size={32} className="text-warning mb-3" />
                    <h5>Alcance 2</h5>
                    <p className="text-muted small">Electricidad</p>
                    <h4 className="text-warning">{formatNumber(alcance2)} kg CO₂e</h4>
                    <div className="progress mt-3">
                      <div 
                        className="progress-bar bg-warning" 
                        style={{width: `${(alcance2/totalEmisiones)*100}%`}}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {((alcance2/totalEmisiones)*100).toFixed(1)}% del total
                    </small>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow h-100">
                  <CardBody className="text-center">
                    <FeatherIcon icon="truck" size={32} className="text-info mb-3" />
                    <h5>Alcance 3</h5>
                    <p className="text-muted small">Emisiones Indirectas</p>
                    <h4 className="text-info">{formatNumber(alcance3)} kg CO₂e</h4>
                    <div className="progress mt-3">
                      <div 
                        className="progress-bar bg-info" 
                        style={{width: `${(alcance3/totalEmisiones)*100}%`}}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {((alcance3/totalEmisiones)*100).toFixed(1)}% del total
                    </small>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Desglose Detallado */}
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="shadow">
                  <CardBody>
                    <h5 className="mb-4">
                      <FeatherIcon icon="pie-chart" className="me-2" />
                      Desglose Detallado de Emisiones
                    </h5>
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th>Categoría</th>
                          <th>Subcategoría</th>
                          <th>Cantidad</th>
                          <th>Factor Emisión</th>
                          <th>Emisiones (kg CO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-danger">
                          <td rowSpan="5"><strong>Alcance 1</strong></td>
                          <td>Gasolina</td>
                          <td>{formData.combustibles.gasolina} L</td>
                          <td>{factoresEmision.gasolina} kg CO₂e/L</td>
                          <td>{formatNumber(formData.combustibles.gasolina * factoresEmision.gasolina)}</td>
                        </tr>
                        <tr>
                          <td>Diesel</td>
                          <td>{formData.combustibles.diesel} L</td>
                          <td>{factoresEmision.diesel} kg CO₂e/L</td>
                          <td>{formatNumber(formData.combustibles.diesel * factoresEmision.diesel)}</td>
                        </tr>
                        <tr>
                          <td>Gas Natural</td>
                          <td>{formData.combustibles.gasNatural} m³</td>
                          <td>{factoresEmision.gasNatural} kg CO₂e/m³</td>
                          <td>{formatNumber(formData.combustibles.gasNatural * factoresEmision.gasNatural)}</td>
                        </tr>
                        <tr>
                          <td>GLP</td>
                          <td>{formData.combustibles.glp} kg</td>
                          <td>{factoresEmision.glp} kg CO₂e/kg</td>
                          <td>{formatNumber(formData.combustibles.glp * factoresEmision.glp)}</td>
                        </tr>
                        <tr>
                          <td>Carbón</td>
                          <td>{formData.combustibles.carbon} kg</td>
                          <td>{factoresEmision.carbon} kg CO₂e/kg</td>
                          <td>{formatNumber(formData.combustibles.carbon * factoresEmision.carbon)}</td>
                        </tr>
                        <tr className="table-warning">
                          <td><strong>Alcance 2</strong></td>
                          <td>Electricidad ({formData.electricidad.tipoEnergia})</td>
                          <td>{formData.electricidad.consumoKwh} kWh</td>
                          <td>{formData.electricidad.tipoEnergia === 'renovable' ? factoresEmision.electricidadRenovable : factoresEmision.electricidadColombia} kg CO₂e/kWh</td>
                          <td>{formatNumber(alcance2)}</td>
                        </tr>
                        <tr className="table-info">
                          <td rowSpan="3"><strong>Alcance 3</strong></td>
                          <td>Transporte</td>
                          <td>Varios</td>
                          <td>Varios</td>
                          <td>{formatNumber((formData.transporte.kmVehiculos * (formData.transporte.tipoVehiculo === 'gasolina' ? factoresEmision.vehiculoGasolina : factoresEmision.vehiculoDiesel)) + (formData.transporte.vuelosNacionales * factoresEmision.vueloNacional) + (formData.transporte.vuelosInternacionales * factoresEmision.vueloInternacional) + (formData.transporte.transportePublico * factoresEmision.transportePublico))}</td>
                        </tr>
                        <tr>
                          <td>Residuos</td>
                          <td>Varios</td>
                          <td>Varios</td>
                          <td>{formatNumber((formData.residuos.residuosOrganicos * factoresEmision.residuosOrganicos) + (formData.residuos.residuosReciclables * factoresEmision.residuosReciclables) + (formData.residuos.residuosPeligrosos * factoresEmision.residuosPeligrosos))}</td>
                        </tr>
                        <tr>
                          <td>Agua</td>
                          <td>{formData.agua.consumoM3} m³</td>
                          <td>{formData.agua.tratamientoAguas ? factoresEmision.aguaTratada : factoresEmision.agua} kg CO₂e/m³</td>
                          <td>{formatNumber(formData.agua.consumoM3 * (formData.agua.tratamientoAguas ? factoresEmision.aguaTratada : factoresEmision.agua))}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="table-success">
                          <th colSpan="4"><strong>TOTAL</strong></th>
                          <th><strong>{formatNumber(totalEmisiones)} kg CO₂e</strong></th>
                        </tr>
                      </tfoot>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Recomendaciones */}
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="shadow">
                  <CardBody>
                    <h5 className="mb-4">
                      <FeatherIcon icon="lightbulb" className="me-2" />
                      Recomendaciones para Reducir Emisiones
                    </h5>
                    {recomendaciones.map((rec, index) => (
                      <Alert key={index} color="light" className="border-start border-5 border-primary">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="alert-heading">
                              <FeatherIcon icon="arrow-right" size={16} className="me-2" />
                              {rec.area}
                            </h6>
                            <p className="mb-1">{rec.accion}</p>
                            <small className="text-success">
                              <strong>Impacto potencial:</strong> {rec.impacto}
                            </small>
                          </div>
                          <span className={`badge bg-${rec.prioridad === 'Alta' ? 'danger' : rec.prioridad === 'Media' ? 'warning' : 'info'}`}>
                            {rec.prioridad}
                          </span>
                        </div>
                      </Alert>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Datos de la Empresa */}
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="shadow">
                  <CardBody>
                    <h5 className="mb-4">
                      <FeatherIcon icon="file-text" className="me-2" />
                      Información del Reporte
                    </h5>
                    <Row>
                      <Col md={6}>
                        <Table borderless size="sm">
                          <tbody>
                            <tr>
                              <td><strong>Empresa:</strong></td>
                              <td>{formData.nombreEmpresa}</td>
                            </tr>
                            <tr>
                              <td><strong>NIT:</strong></td>
                              <td>{formData.nit}</td>
                            </tr>
                            <tr>
                              <td><strong>Dirección:</strong></td>
                              <td>{formData.direccion}</td>
                            </tr>
                            <tr>
                              <td><strong>Ciudad:</strong></td>
                              <td>{formData.municipio}, {formData.departamento}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <Table borderless size="sm">
                          <tbody>
                            <tr>
                              <td><strong>Año Base:</strong></td>
                              <td>{formData.añoBase}</td>
                            </tr>
                            <tr>
                              <td><strong>Fecha del Reporte:</strong></td>
                              <td>{formData.fechaReporte}</td>
                            </tr>
                            <tr>
                              <td><strong>Elaborado por:</strong></td>
                              <td>{formData.personaElabora}</td>
                            </tr>
                            <tr>
                              <td><strong>Cargo:</strong></td>
                              <td>{formData.cargo}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Acciones */}
            <Row>
              <Col lg={12} className="text-center">
                <Button
                  color="primary"
                  size="lg"
                  onClick={onNewCalculation}
                  className="me-3 btn-mundo-verde"
                >
                  <FeatherIcon icon="refresh-cw" className="me-2" />
                  Nuevo Cálculo
                </Button>
                <Button
                  color="success"
                  size="lg"
                  outline
                  onClick={() => window.print()}
                >
                  <FeatherIcon icon="download" className="me-2" />
                  Descargar Reporte
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ResultadosHuella;
