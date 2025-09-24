import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

//Import Components
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";
import DocumentViewer from "../../component/DocumentViewer";

export default class HuellaCarbono extends Component {
  componentDidMount() {
    document.body.classList = "";
  }

  render() {
    return (
      <React.Fragment>
        {/* Hero Section */}
        <section className="bg-half-170 bg-mundo-verde d-table w-100" id="conceptos-basicos">
          <Container>
            <Row className="align-items-center">
              <Col lg={12} className="text-center text-white">
                <div className="page-next-level">
                  <h1 className="title text-white mb-4 fw-bold">
                    Conceptos Claves
                  </h1>
                  <h4 className="text-white-70 mb-4">
                    Mundo Verde - Prácticas Sostenibles
                  </h4>
                  <p className="text-white-70 para-desc mb-0 mx-auto">
                    Descubre todo lo que necesitas saber sobre la medición, gestión y reducción 
                    de la huella de carbono para crear un futuro más sostenible.
                  </p>
                  <nav aria-label="breadcrumb" className="d-inline-block mt-4">
                    <ul className="breadcrumb bg-transparent mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/" className="text-white-70">
                          Inicio
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-white" aria-current="page">
                        Conceptos Claves
                      </li>
                    </ul>
                  </nav>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección Introducción: Problemas Medio Ambientales (Lectura a la izquierda, documento a la derecha) */}
        <section className="section bg-light" id="problemas-ambientales">
          <Container>
            <Row className="align-items-stretch justify-content-center">
              <Col lg={7} md={12} className="mb-4">
                <Card className="shadow border-0 h-100">
                  <CardBody className="p-5">
                    <div className="text-center mb-4">
                      <FeatherIcon icon="alert-triangle" className="text-mundo-verde mb-3" size={48} />
                      <h2 className="text-mundo-verde mb-3">Problemas Medio Ambientales</h2>
                      <p className="text-muted">
                        Comprende los principales desafíos ambientales que enfrentamos y su impacto en el cambio climático global.
                      </p>
                    </div>
                    <h5 className="text-mundo-verde mb-4">
                      <FeatherIcon icon="info" className="me-2" />
                      Problemas Ambientales Clave
                    </h5>
                    <Row>
                      <Col lg={6}>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="thermometer" className="text-danger me-2" size={20} />
                          <h6 className="d-inline text-dark">Calentamiento Global</h6>
                          <p className="text-muted mt-2 ms-4">
                            Aumento de la temperatura promedio de la Tierra debido a las emisiones de gases de efecto invernadero.
                          </p>
                        </div>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="droplet" className="text-primary me-2" size={20} />
                          <h6 className="d-inline text-dark">Contaminación del Agua</h6>
                          <p className="text-muted mt-2 ms-4">
                            Degradación de la calidad del agua por desechos industriales, agrícolas y urbanos.
                          </p>
                        </div>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="wind" className="text-info me-2" size={20} />
                          <h6 className="d-inline text-dark">Contaminación del Aire</h6>
                          <p className="text-muted mt-2 ms-4">
                            Emisión de contaminantes que afectan la calidad del aire y la salud humana.
                          </p>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="trash-2" className="text-warning me-2" size={20} />
                          <h6 className="d-inline text-dark">Generación de Residuos</h6>
                          <p className="text-muted mt-2 ms-4">
                            Acumulación excesiva de desechos que impactan negativamente el medio ambiente.
                          </p>
                        </div>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="tree-pine" className="text-success me-2" size={20} />
                          <h6 className="d-inline text-dark">Deforestación</h6>
                          <p className="text-muted mt-2 ms-4">
                            Pérdida de bosques que reduce la capacidad de absorción de CO2 del planeta.
                          </p>
                        </div>
                        <div className="feature-item mb-4">
                          <FeatherIcon icon="zap" className="text-secondary me-2" size={20} />
                          <h6 className="d-inline text-dark">Consumo Energético</h6>
                          <p className="text-muted mt-2 ms-4">
                            Uso excesivo de energía no renovable que incrementa las emisiones de GEI.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={5} md={12} className="mb-4 d-flex align-items-stretch">
                <div className="w-100">
                  <DocumentViewer 
                    pdfPath="/Concepts_docs/1.Los_Problemas_medio_ambientales.pdf"
                    title="Los Problemas Medio Ambientales"
                    description="Documento introductorio que explica los principales problemas ambientales actuales, sus causas y consecuencias para el planeta y la sociedad."
                    icon="alert-triangle"
                    buttonText="Ver Documento Completo"
                    cardStyle="featured"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 1: Conceptos Básicos de Huella de Carbono */}
        <section className="section" id="conceptos-basicos-content">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="info" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">¿Qué es la Huella de Carbono?</h2>
                <p className="text-muted">
                  Conoce los fundamentos de la medición de gases de efecto invernadero y su impacto en el cambio climático.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={10}>
          <Card className="shadow border-0 mb-4">
            <CardBody className="p-5">
              <p className="text-muted mb-4 lead">
                La <strong>huella de carbono</strong> es una medida del total de emisiones de gases 
                de efecto invernadero (GEI) causadas directa o indirectamente por una actividad, 
                organización, evento o producto, expresada como equivalente de dióxido de carbono (CO2eq).
              </p>
              
              <Row className="mt-4">
                <Col lg={6}>
                  <div className="feature-icon mb-4">
                    <FeatherIcon icon="globe" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Importancia Global</h5>
                  </div>
                  <p className="text-muted">
                    El cálculo de la huella de carbono es fundamental para entender nuestro 
                    impacto en el cambio climático y tomar medidas para reducirlo.
                  </p>
                </Col>
                <Col lg={6}>
                  <div className="feature-icon mb-4">
                    <FeatherIcon icon="trending-up" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Beneficios Empresariales</h5>
                  </div>
                  <p className="text-muted">
                    Las empresas que miden y reducen su huella de carbono mejoran su 
                    reputación, reducen costos operativos y se preparan para futuras regulaciones.
                  </p>
                </Col>
              </Row>

              <div className="alert alert-mundo-verde mt-4" role="alert">
                <FeatherIcon icon="lightbulb" className="me-2" size={18} />
                <strong>Dato Importante:</strong> Colombia se comprometió a reducir sus emisiones 
                de GEI en un 51% para el 2030 según el Acuerdo de París.
              </div>
            </CardBody>
          </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 2: Alcances y Límites */}
        <section className="section bg-light" id="alcances-limites">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="layers" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">Alcances y Límites de Medición</h2>
                <p className="text-muted">
                  Comprende la clasificación de emisiones según el Protocolo de Gases de Efecto Invernadero (GHG Protocol).
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={12}>
          <Row>
            <Col lg={4} className="mb-4">
              <Card className="card-mundo-verde h-100 shadow">
                <CardBody className="text-center p-4">
                  <div className="icon-mono service-icon avatar-lg mx-auto mb-4">
                    <FeatherIcon icon="home" className="text-mundo-verde" size={32} />
                  </div>
                  <h4 className="text-mundo-verde mb-3">Alcance 1</h4>
                  <h6 className="text-muted mb-3">Emisiones Directas</h6>
                  <p className="text-muted">
                    Emisiones que ocurren de fuentes que son propiedad o están controladas 
                    por la organización:
                  </p>
                  <ul className="list-unstyled text-start">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Combustión estacionaria
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Combustión móvil
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Emisiones fugitivas
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card className="card-mundo-verde h-100 shadow">
                <CardBody className="text-center p-4">
                  <div className="icon-mono service-icon avatar-lg mx-auto mb-4">
                    <FeatherIcon icon="zap" className="text-mundo-verde" size={32} />
                  </div>
                  <h4 className="text-mundo-verde mb-3">Alcance 2</h4>
                  <h6 className="text-muted mb-3">Emisiones Indirectas por Energía</h6>
                  <p className="text-muted">
                    Emisiones indirectas de GEI por la generación de electricidad, 
                    vapor, calefacción y refrigeración adquirida:
                  </p>
                  <ul className="list-unstyled text-start">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Electricidad comprada
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Vapor adquirido
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Calefacción/refrigeración
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card className="card-mundo-verde h-100 shadow">
                <CardBody className="text-center p-4">
                  <div className="icon-mono service-icon avatar-lg mx-auto mb-4">
                    <FeatherIcon icon="truck" className="text-mundo-verde" size={32} />
                  </div>
                  <h4 className="text-mundo-verde mb-3">Alcance 3</h4>
                  <h6 className="text-muted mb-3">Otras Emisiones Indirectas</h6>
                  <p className="text-muted">
                    Todas las demás emisiones indirectas que ocurren en la 
                    cadena de valor de la organización:
                  </p>
                  <ul className="list-unstyled text-start">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Transporte y distribución
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Bienes y servicios comprados
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={16} />
                      Viajes de negocios
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 3: Factores de Emisión */}
        <section className="section" id="factores-emision">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="database" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">Factores de Emisión para Colombia</h2>
                <p className="text-muted">
                  Conoce los valores oficiales y metodologías para convertir datos de actividad en emisiones de GEI.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={10}>
          <Card className="shadow border-0">
            <CardBody className="p-5">
              <Row>
                <Col lg={6}>
                  <h5 className="text-mundo-verde mb-3">
                    <FeatherIcon icon="zap" className="me-2" />
                    Factor de Emisión Eléctrico
                  </h5>
                  <p className="text-muted">
                    Para Colombia, el Sistema Interconectado Nacional (SIN) tiene un factor 
                    de emisión de aproximadamente <strong>0.164 kg CO2eq/kWh</strong> (UPME, 2023).
                  </p>
                  
                  <h5 className="text-mundo-verde mb-3 mt-4">
                    <FeatherIcon icon="droplet" className="me-2" />
                    Combustibles Fósiles
                  </h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Gasolina:</strong> 2.296 kg CO2eq/litro
                    </li>
                    <li className="mb-2">
                      <strong>Diésel:</strong> 2.671 kg CO2eq/litro
                    </li>
                    <li className="mb-2">
                      <strong>Gas Natural:</strong> 2.108 kg CO2eq/m³
                    </li>
                  </ul>
                </Col>
                
                <Col lg={6}>
                  <h5 className="text-mundo-verde mb-3">
                    <FeatherIcon icon="activity" className="me-2" />
                    Fuentes de Información
                  </h5>
                  <div className="mb-3">
                    <span className="badge bg-mundo-verde me-2 mb-2">UPME</span>
                    <span className="badge bg-mundo-verde me-2 mb-2">IDEAM</span>
                    <span className="badge bg-mundo-verde me-2 mb-2">FECOC</span>
                  </div>
                  
                  <div className="alert alert-info" role="alert">
                    <FeatherIcon icon="info" className="me-2" size={18} />
                    <strong>Nota:</strong> Los factores de emisión se actualizan periódicamente. 
                    Siempre consulta las fuentes oficiales más recientes.
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección Nueva: Componentes Socioambientales */}
        <section className="section bg-light" id="componentes-socioambientales">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="users" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">Componentes Socioambientales</h2>
                <p className="text-muted">
                  Explora los elementos sociales y ambientales que toda organización debe considerar para su sostenibilidad integral.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={6} className="mb-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/3.Componentes_sociambientales_de_una_organización.pdf"
                  title="Componentes Socioambientales"
                  description="Marco conceptual sobre los elementos sociales y ambientales que integran la gestión sostenible de una organización."
                  icon="users"
                  cardStyle="featured"
                />
              </Col>
              <Col lg={6} className="mb-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/4.Amenazas_impactos_y_aspectos_ambientales.pdf"
                  title="Amenazas, Impactos y Aspectos Ambientales"
                  description="Guía para identificar y evaluar amenazas, impactos y aspectos ambientales en el contexto organizacional."
                  icon="shield"
                  cardStyle="featured"
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12}>
                <Card className="shadow border-0">
                  <CardBody className="p-5">
                    <h5 className="text-mundo-verde mb-4">
                      <FeatherIcon icon="target" className="me-2" />
                      Dimensiones de la Sostenibilidad Organizacional
                    </h5>
                    <Row>
                      <Col lg={4} className="mb-4">
                        <div className="text-center">
                          <div className="icon-mono service-icon avatar-md mx-auto mb-3">
                            <FeatherIcon icon="heart" className="text-success" size={24} />
                          </div>
                          <h6 className="text-success mb-3">Dimensión Social</h6>
                          <ul className="list-unstyled text-start">
                            <li className="text-muted mb-2">• Bienestar de empleados</li>
                            <li className="text-muted mb-2">• Impacto en comunidades</li>
                            <li className="text-muted mb-2">• Derechos humanos</li>
                            <li className="text-muted mb-2">• Inclusión y diversidad</li>
                          </ul>
                        </div>
                      </Col>
                      <Col lg={4} className="mb-4">
                        <div className="text-center">
                          <div className="icon-mono service-icon avatar-md mx-auto mb-3">
                            <FeatherIcon icon="leaf" className="text-mundo-verde" size={24} />
                          </div>
                          <h6 className="text-mundo-verde mb-3">Dimensión Ambiental</h6>
                          <ul className="list-unstyled text-start">
                            <li className="text-muted mb-2">• Gestión de recursos</li>
                            <li className="text-muted mb-2">• Control de emisiones</li>
                            <li className="text-muted mb-2">• Manejo de residuos</li>
                            <li className="text-muted mb-2">• Biodiversidad</li>
                          </ul>
                        </div>
                      </Col>
                      <Col lg={4} className="mb-4">
                        <div className="text-center">
                          <div className="icon-mono service-icon avatar-md mx-auto mb-3">
                            <FeatherIcon icon="trending-up" className="text-primary" size={24} />
                          </div>
                          <h6 className="text-primary mb-3">Dimensión Económica</h6>
                          <ul className="list-unstyled text-start">
                            <li className="text-muted mb-2">• Viabilidad financiera</li>
                            <li className="text-muted mb-2">• Creación de valor</li>
                            <li className="text-muted mb-2">• Innovación sostenible</li>
                            <li className="text-muted mb-2">• Cadena de suministro</li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 4: Acciones para Reducir */}
        <section className="section" id="acciones-reduccion">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="trending-down" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">Acciones para Reducir las Emisiones</h2>
                <p className="text-muted">
                  Implementa estrategias efectivas para reducir la huella de carbono de tu organización.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center mb-5">
              <Col lg={4} className="mb-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/5.Acciones_consumo_responsable.pdf"
                  title="Acciones de Consumo Responsable"
                  description="Estrategias y recomendaciones para implementar prácticas de consumo responsable."
                  icon="shopping-cart"
                  cardStyle="compact"
                />
              </Col>
              <Col lg={4} className="mb-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/6.Uso_eficiente_y_ahorro_de_agua.pdf"
                  title="Uso Eficiente y Ahorro de Agua"
                  description="Guía práctica para optimizar el uso del agua y reducir el desperdicio."
                  icon="droplet"
                  cardStyle="compact"
                />
              </Col>
              <Col lg={4} className="mb-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/7.Uso_eficiente_y_ahorro_de_energia.pdf"
                  title="Uso Eficiente y Ahorro de Energía"
                  description="Técnicas y mejores prácticas para reducir el consumo energético."
                  icon="zap"
                  cardStyle="compact"
                />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={12}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="h-100 shadow border-0">
                <CardBody className="p-4">
                  <div className="feature-icon mb-3">
                    <FeatherIcon icon="sun" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Energías Renovables</h5>
                  </div>
                  <ul className="list-unstyled">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Instalación de paneles solares
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Compra de energía verde certificada
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Sistemas de energía eólica
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="h-100 shadow border-0">
                <CardBody className="p-4">
                  <div className="feature-icon mb-3">
                    <FeatherIcon icon="zap-off" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Eficiencia Energética</h5>
                  </div>
                  <ul className="list-unstyled">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      LED y iluminación eficiente
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Equipos con certificación ENERGY STAR
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Sistemas de climatización eficientes
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="h-100 shadow border-0">
                <CardBody className="p-4">
                  <div className="feature-icon mb-3">
                    <FeatherIcon icon="users" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Movilidad Sostenible</h5>
                  </div>
                  <ul className="list-unstyled">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Teletrabajo y reuniones virtuales
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Vehículos eléctricos o híbridos
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Incentivos para transporte público
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="h-100 shadow border-0">
                <CardBody className="p-4">
                  <div className="feature-icon mb-3">
                    <FeatherIcon icon="refresh-cw" className="text-mundo-verde me-2" size={24} />
                    <h5 className="d-inline text-mundo-verde">Economía Circular</h5>
                  </div>
                  <ul className="list-unstyled">
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Programas de reciclaje
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Reducción de residuos
                    </li>
                    <li className="text-muted mb-2">
                      <FeatherIcon icon="arrow-right" className="text-mundo-verde me-2" size={16} />
                      Proveedores sostenibles
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 5: Elaboración de Reportes */}
        <section className="section" id="elaboracion-reportes">
          <Container>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mb-5">
                <FeatherIcon icon="file-text" className="text-mundo-verde mb-3" size={48} />
                <h2 className="text-mundo-verde mb-4">Elaboración de Reportes de Huella de Carbono</h2>
                <p className="text-muted">
                  Aprende a crear reportes profesionales que faciliten la toma de decisiones en sostenibilidad.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center mb-5">
              <Col lg={8}>
                <DocumentViewer 
                  pdfPath="/Concepts_docs/2.Guia_para_elaborar_el_reporte_de_Sostenibilidad.pdf"
                  title="Guía para Elaborar Reportes de Sostenibilidad"
                  description="Manual completo con metodologías, formatos y mejores prácticas para crear reportes de sostenibilidad efectivos."
                  icon="clipboard"
                  buttonText="Ver Guía Completa"
                  cardStyle="featured"
                />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={10}>
          <Row className="mb-4">
            <Col lg={4} className="mb-4">
              <div className="process-step text-center">
                <div className="process-circle mx-auto mb-3">
                  <span className="text-white fw-bold">1</span>
                </div>
                <h5 className="text-mundo-verde mb-3">Recolección de Datos</h5>
                <p className="text-muted">
                  Recopila información precisa sobre consumos energéticos, 
                  combustibles, viajes y demás actividades emisoras.
                </p>
              </div>
            </Col>

            <Col lg={4} className="mb-4">
              <div className="process-step text-center">
                <div className="process-circle mx-auto mb-3">
                  <span className="text-white fw-bold">2</span>
                </div>
                <h5 className="text-mundo-verde mb-3">Cálculo y Análisis</h5>
                <p className="text-muted">
                  Aplica los factores de emisión correspondientes y calcula 
                  las emisiones por cada alcance y categoría.
                </p>
              </div>
            </Col>

            <Col lg={4} className="mb-4">
              <div className="process-step text-center">
                <div className="process-circle mx-auto mb-3">
                  <span className="text-white fw-bold">3</span>
                </div>
                <h5 className="text-mundo-verde mb-3">Documentación</h5>
                <p className="text-muted">
                  Elabora un reporte detallado con metodología, resultados, 
                  gráficos y recomendaciones de mejora.
                </p>
              </div>
            </Col>
          </Row>

          <Card className="shadow border-0 mt-5">
            <CardBody className="p-5">
              <h5 className="text-mundo-verde mb-4">
                <FeatherIcon icon="clipboard" className="me-2" />
                Elementos Clave del Reporte
              </h5>
              <Row>
                <Col lg={6}>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Resumen Ejecutivo:</strong> Resultados principales y conclusiones
                    </li>
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Metodología:</strong> Estándares y protocolos utilizados
                    </li>
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Inventario:</strong> Detalle de fuentes de emisión por alcance
                    </li>
                  </ul>
                </Col>
                <Col lg={6}>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Análisis:</strong> Comparación con años anteriores y benchmarks
                    </li>
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Plan de Acción:</strong> Metas de reducción y estrategias
                    </li>
                    <li className="mb-3">
                      <FeatherIcon icon="check-circle" className="text-mundo-verde me-2" size={18} />
                      <strong>Verificación:</strong> Proceso de validación independiente
                    </li>
                  </ul>
                </Col>
              </Row>
            </CardBody>
          </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Call to Action */}
        <section className="section bg-mundo-verde">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <h3 className="text-white mb-4 fw-bold">
                  ¿Listo para comenzar tu journey hacia la sostenibilidad?
                </h3>
                <p className="text-white-70 mb-4">
                  Únete a la iniciativa Mundo Verde y ayuda a crear un futuro más sostenible 
                  para todos. Comienza midiendo tu huella de carbono hoy mismo.
                </p>
                <div>
                  <Link to="/#modules" className="btn btn-light btn-lg rounded-pill me-3">
                    Explora los Módulos
                    <FeatherIcon icon="arrow-right" className="ms-2 icon-sm" />
                  </Link>
                  <Link to="/" className="btn btn-outline-light btn-lg rounded-pill">
                    Volver al Inicio
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Importing footer */}
        <Footer />

        {/* Importing Mode Switcher */}
        <Switch />
      </React.Fragment>
    );
  }
}