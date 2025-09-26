import SidebarNav from "../../component/Calculadora/SidebarNav";

import React from "react";
import CalculadoraSection from "../../component/Calculadora/CalculadoraSection";
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";
import FeatherIcon from "feather-icons-react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

const CalculadoraPage = () => {
  React.useEffect(() => {
    // Reset any potential body classes or styles
    document.body.classList = "";
    document.body.style.paddingTop = '';
  }, []);

  return (
    <React.Fragment>
      <SidebarNav />
      {/* Hero institucional */}
      <section style={{
        minHeight: '340px',
        paddingTop: '100px',
        background: 'linear-gradient(120deg, #217a3a 0%, #28a745 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        marginTop: '0px',
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center text-white">
              <div style={{fontSize: 64, marginBottom: 16, color: '#fff', opacity: 0.9}}>
                <i className="feather icon-calculator" style={{fontSize: 64}}></i>
              </div>
              <h1 className="fw-bold mb-3" style={{fontSize: '2.7rem', letterSpacing: '-1px'}}>Herramientas de Medición Ambiental</h1>
              <h4 className="mb-3" style={{color: '#e8f5e8', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.2px', lineHeight: 1.18}}>
                Calcula y gestiona las emisiones de carbono de tu organización
              </h4>
              <p className="lead text-white-70 mb-4" style={{fontSize: '1.18rem', color: 'rgba(255,255,255,0.92)'}}>
                Nuestra calculadora está basada en <b>estándares internacionales</b> y factores de emisión específicos para Colombia.
              </p>
            </div>
          </div>
        </div>
        {/* Efecto decorativo */}
        <div style={{position: 'absolute', top: -80, right: -120, width: 320, height: 320, background: 'radial-gradient(circle, #4caf50 0%, #66bb6a 100%)', opacity: 0.15, borderRadius: '50%'}}></div>
      </section>
      {/* Sección informativa: ¿Qué es la Huella de Carbono? */}
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
          <div className="text-center mt-4">
            <a href="#calculadora-huella" className="btn btn-success btn-lg rounded-pill" style={{fontWeight:700, fontSize:18, padding:'12px 36px', boxShadow:'none'}}>
              Ir a la Calculadora
              <FeatherIcon icon="arrow-down" className="ms-2" />
            </a>
          </div>
        </Container>
      </section>

      <div id="calculadora-huella">
        <CalculadoraSection />
      </div>


      {/* Factores de Emisión para Colombia - Rediseñado */}

      <section
        className="section py-5"
        id="factores-emision"
        style={{
          background: typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
            ? '#151c23'
            : '#fff',
          transition: 'background 0.3s',
        }}
      >
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={12} className="text-center">
              <div
                style={{
                  display: 'inline-block',
                  background:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? 'linear-gradient(135deg,#1a232a 60%,#26323a 100%)'
                      : 'linear-gradient(135deg,#e0f7fa 60%,#e8f5e9 100%)',
                  borderRadius: 60,
                  padding: 18,
                  marginBottom: 18,
                  boxShadow:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? '0 4px 24px #111b22bb'
                      : '0 4px 24px #b2dfdb55',
                }}
              >
                <FeatherIcon icon="cloud" size={48} className={typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark' ? 'text-info' : 'text-info'} />
              </div>
              <h2
                className="fw-bold mb-2"
                style={{
                  color:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? '#e0f7fa'
                      : '#217a3a',
                  fontSize: '2.3rem',
                  letterSpacing: '-1px',
                }}
              >
                Factores de Emisión para Colombia
              </h2>
              <p
                className="mb-0"
                style={{
                  fontSize: '1.18rem',
                  color:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? '#b2dfdb'
                      : '#4a4a4a',
                }}
              >
                Valores oficiales y metodologías para convertir datos de actividad en emisiones de GEI.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card
                className="shadow border-0"
                style={{
                  borderRadius: 28,
                  overflow: 'hidden',
                  background:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? 'linear-gradient(120deg,#1a232a 60%,#232f38 100%)'
                      : 'linear-gradient(120deg,#f8fff8 60%,#e0f7fa 100%)',
                  color:
                    typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                      ? '#e0f7fa'
                      : undefined,
                }}
              >
                <CardBody className="p-4 p-md-5">
                  <Row>
                    <Col
                      md={5}
                      className="mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start justify-content-center"
                    >
                      <div className="d-flex align-items-center mb-3">
                        <FeatherIcon icon="zap" className="text-success me-2" size={32} />
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: '1.25rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#b2dfdb'
                                : '#217a3a',
                          }}
                        >
                          Electricidad
                        </span>
                      </div>
                      <div
                        className="border rounded-4 px-4 py-3 mb-3 w-100"
                        style={{
                          background:
                            typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                              ? '#232f38'
                              : '#f8fff8',
                          borderColor:
                            typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                              ? '#26323a'
                              : undefined,
                          maxWidth: 340,
                        }}
                      >
                        <span
                          className="d-block mb-1"
                          style={{
                            fontSize: '1.05rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#b2dfdb'
                                : '#4a4a4a',
                          }}
                        >
                          Factor de emisión (SIN):
                        </span>
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: '1.35rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#e0f7fa'
                                : '#217a3a',
                          }}
                        >
                          0.164 kg CO₂e/kWh
                        </span>
                        <span className="badge bg-success ms-2 align-middle">UPME 2023</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 mt-4">
                        <FeatherIcon icon="droplet" className="text-info me-2" size={26} />
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: '1.18rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#b2dfdb'
                                : '#217a3a',
                          }}
                        >
                          Combustibles Fósiles
                        </span>
                      </div>
                      <div className="w-100" style={{ maxWidth: 340 }}>
                        <div className="d-flex align-items-center mb-2">
                          <FeatherIcon icon="truck" className="text-warning me-2" size={18} />
                          <span style={{ color: typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark' ? '#e0f7fa' : undefined }}><b>Gasolina:</b> 2.296 kg CO₂e/litro</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FeatherIcon icon="settings" className="text-secondary me-2" size={18} />
                          <span style={{ color: typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark' ? '#e0f7fa' : undefined }}><b>Diésel:</b> 2.671 kg CO₂e/litro</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FeatherIcon icon="wind" className="text-info me-2" size={18} />
                          <span style={{ color: typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark' ? '#e0f7fa' : undefined }}><b>Gas Natural:</b> 2.108 kg CO₂e/m³</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={7} className="d-flex flex-column justify-content-center align-items-center align-items-md-start">
                      <div className="d-flex align-items-center mb-3">
                        <FeatherIcon icon="book-open" className="text-primary me-2" size={28} />
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: '1.18rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#b2dfdb'
                                : '#217a3a',
                          }}
                        >
                          Fuentes Oficiales
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="badge bg-success me-2 mb-2">UPME</span>
                        <span className="badge bg-info me-2 mb-2">IDEAM</span>
                        <span className="badge bg-primary me-2 mb-2">FECOC</span>
                      </div>
                      <div
                        className="alert alert-info d-flex align-items-center mt-2"
                        role="alert"
                        style={{
                          borderRadius: 16,
                          background:
                            typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                              ? '#1a232a'
                              : '#e3f7fd',
                          color:
                            typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                              ? '#b2dfdb'
                              : '#217a3a',
                          fontSize: '1.05rem',
                          boxShadow:
                            typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                              ? '0 2px 12px #111b22bb'
                              : '0 2px 12px #b2ebf255',
                        }}
                      >
                        <FeatherIcon icon="info" className="me-2" size={20} />
                        <span>
                          <b>Nota:</b> Los factores de emisión se actualizan periódicamente. Consulta siempre las fuentes oficiales más recientes.
                        </span>
                      </div>
                      <div className="mt-4">
                        <FeatherIcon icon="award" className="text-warning me-2" size={22} />
                        <span
                          className="text-muted"
                          style={{
                            fontSize: '1.08rem',
                            color:
                              typeof document !== 'undefined' && document.body.getAttribute('data-bs-theme') === 'dark'
                                ? '#b2dfdb'
                                : undefined,
                          }}
                        >
                          Basado en estándares internacionales y datos nacionales.
                        </span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
      <Switch />
    </React.Fragment>
  );
};

export default CalculadoraPage;
