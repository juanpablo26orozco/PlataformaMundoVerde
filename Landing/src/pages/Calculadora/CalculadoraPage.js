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
            <a href="#calculadora-huella" className="btn btn-success btn-lg rounded-pill" style={{fontWeight:700, fontSize:18, padding:'12px 36px', boxShadow:'0 2px 8px #b7e4c7'}}>
              Ir a la Calculadora
              <FeatherIcon icon="arrow-down" className="ms-2" />
            </a>
          </div>
        </Container>
      </section>
      <div id="calculadora-huella">
        <CalculadoraSection />
      </div>
      <Footer />
      <Switch />
    </React.Fragment>
  );
};

export default CalculadoraPage;
