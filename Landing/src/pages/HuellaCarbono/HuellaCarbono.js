import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

//Import Components
import Navbar from "../../component/Navbar/NavBar";
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";


export default class HuellaCarbono extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        {
          id: 1,
          navheading: "Inicio",
          link: "/"
        },
        {
          id: 2,
          navheading: "Huella de Carbono",
          link: "/huella-carbono"
        }
      ],
    };
  }

  componentDidMount() {
    document.body.classList = "";
    window.addEventListener("scroll", this.scrollNavigation, true);
  }

  // Make sure to remove the DOM listener when the component is unmounted.
  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollNavigation, true);
  }

  scrollNavigation = () => {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var navbar = document.getElementById("navbar");
    if (navbar && top > 80) {
      navbar.classList.add("nav-sticky");
    } else if (navbar) {
      navbar.classList.remove("nav-sticky");
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* Importing Navbar */}
        <Navbar navItems={this.state.navItems} navClass="defaultscroll sticky" />

        {/* Hero Section */}
        <section className="bg-half-170 bg-mundo-verde d-table w-100" id="conceptos-basicos">
          <Container>
            <Row className="align-items-center">
              <Col lg={12} className="text-center text-white">
                <div className="page-next-level">
                  <h1 className="title text-white mb-4 fw-bold">
                    Huella de Carbono
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
                        Huella de Carbono
                      </li>
                    </ul>
                  </nav>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Conceptos Básicos */}
        <section className="section" id="conceptos-basicos-content">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="section-title text-center mb-5">
                  <h2 className="fw-bold text-mundo-verde">
                    <FeatherIcon icon="info" className="me-2" />
                    ¿Qué es la Huella de Carbono?
                  </h2>
                  <div className="title-border-simple"></div>
                </div>
                
                <Card className="shadow border-0 mb-5">
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

        {/* Alcances y Límites */}
        <section className="section bg-light" id="alcances-limites">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="section-title text-center mb-5">
                  <h2 className="fw-bold text-mundo-verde">
                    <FeatherIcon icon="layers" className="me-2" />
                    Alcances y Límites de Medición
                  </h2>
                  <div className="title-border-simple"></div>
                  <p className="text-muted mt-4">
                    La medición de la huella de carbono se divide en tres alcances principales 
                    según el Protocolo de Gases de Efecto Invernadero (GHG Protocol).
                  </p>
                </div>
                
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

        {/* Factores de Emisión */}
        <section className="section" id="factores-emision">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="section-title text-center mb-5">
                  <h2 className="fw-bold text-mundo-verde">
                    <FeatherIcon icon="database" className="me-2" />
                    Factores de Emisión para Colombia
                  </h2>
                  <div className="title-border-simple"></div>
                  <p className="text-muted mt-4">
                    Los factores de emisión son valores que relacionan la cantidad de contaminantes 
                    liberados con una actividad asociada con la liberación de esos contaminantes.
                  </p>
                </div>
                
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

        {/* Acciones para Reducir */}
        <section className="section bg-light" id="acciones-reduccion">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="section-title text-center mb-5">
                  <h2 className="fw-bold text-mundo-verde">
                    <FeatherIcon icon="trending-down" className="me-2" />
                    Acciones para Reducir las Emisiones
                  </h2>
                  <div className="title-border-simple"></div>
                  <p className="text-muted mt-4">
                    Implementa estas estrategias efectivas para reducir la huella de carbono 
                    de tu organización y contribuir a un futuro sostenible.
                  </p>
                </div>
                
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

        {/* Elaboración de Reportes */}
        <section className="section" id="elaboracion-reportes">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="section-title text-center mb-5">
                  <h2 className="fw-bold text-mundo-verde">
                    <FeatherIcon icon="file-text" className="me-2" />
                    Elaboración de Reportes de Huella de Carbono
                  </h2>
                  <div className="title-border-simple"></div>
                  <p className="text-muted mt-4">
                    Aprende a crear reportes profesionales y completos que faciliten 
                    la toma de decisiones estratégicas en sostenibilidad.
                  </p>
                </div>
                
                <Row>
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
                  <Link to="/#contact" className="btn btn-light btn-lg rounded-pill me-3">
                    Contáctanos
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
