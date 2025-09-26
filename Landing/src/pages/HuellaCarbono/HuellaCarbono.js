import React, { Component } from "react";
import { createRef } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

//Import Components
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";
import DocumentViewer from "../../component/DocumentViewer";
import ConceptSidebarNav from '../../component/ConceptSection/ConceptSidebarNav';

export default class HuellaCarbono extends Component {
  constructor(props) {
    super(props);
    this.state = { showSidebar: true };
    this.infoWebRef = createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    document.body.classList = "";
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const infoWeb = document.getElementById("informacion-web");
    if (infoWeb) {
      const rect = infoWeb.getBoundingClientRect();
      // Si la parte superior de la sección está visible en el viewport, ocultar sidebar
      const shouldHide = rect.top < window.innerHeight && rect.bottom > 0;
      if (shouldHide !== !this.state.showSidebar) {
        this.setState({ showSidebar: !shouldHide });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.showSidebar && <ConceptSidebarNav />}
        {/* CSS Variables for Light/Dark Mode */}
        <style>{`
          :root {
            --section-bg-light: #f6f8fa;
            --section-bg-dark: #23272f;
            --section-text-light: #1a2e22;
            --section-text-dark: #e0f2f1;
            --section-subtext-light: #4b5c53;
            --section-subtext-dark: #b2dfdb;
            --section-box-light: #F1F8E9;
            --section-box-dark: #2e3a2f;
            --section-list-light: #2E7D32;
            --section-list-dark: #81c784;
            --section-list2-light: #183D2D;
            --section-list2-dark: #b2dfdb;
            --section-alert-light: #D32F2F;
            --section-alert-dark: #ef9a9a;
          }
          [data-bs-theme="dark"] {
            --section-bg: var(--section-bg-dark);
            --section-text: var(--section-text-dark);
            --section-subtext: var(--section-subtext-dark);
            --section-box: var(--section-box-dark);
            --section-list: var(--section-list-dark);
            --section-list2: var(--section-list2-dark);
            --section-alert: var(--section-alert-dark);
          }
          [data-bs-theme="light"], :root {
            --section-bg: var(--section-bg-light);
            --section-text: var(--section-text-light);
            --section-subtext: var(--section-subtext-light);
            --section-box: var(--section-box-light);
            --section-list: var(--section-list-light);
            --section-list2: var(--section-list2-light);
            --section-alert: var(--section-alert-light);
          }
        `}</style>
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



        {/* Sección 1: Problemas Medio Ambientales (split-screen, sin pérdida de espacio) */}
  <section className="section" id="problemas-ambientales" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Problemas Medio Ambientales</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    Comprende los principales desafíos ambientales que enfrentamos y su impacto en el cambio climático global.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="alert-triangle" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>¿Qué son los problemas medioambientales?</span>
                      </div>
                      <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        Son alteraciones negativas en el entorno natural causadas principalmente por actividades humanas. Estos problemas afectan el clima, la biodiversidad, la salud y la calidad de vida en el planeta.
                      </div>
                      <ul style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>Calentamiento Global:</b> Aumento de la temperatura media del planeta por emisiones de gases de efecto invernadero.</li>
                        <li><b>Contaminación del Aire y Agua:</b> Presencia de sustancias tóxicas que dañan la salud y los ecosistemas.</li>
                        <li><b>Deforestación:</b> Pérdida de bosques por tala y expansión agrícola, reduciendo la biodiversidad.</li>
                        <li><b>Generación de Residuos:</b> Acumulación de basura y plásticos que contaminan suelos y océanos.</li>
                        <li><b>Consumo Energético:</b> Uso excesivo de energía proveniente de fuentes no renovables.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Causas principales:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Quema de combustibles fósiles (carbón, petróleo, gas).</li>
                        <li>Deforestación y cambio de uso del suelo.</li>
                        <li>Uso excesivo de recursos naturales.</li>
                        <li>Producción y consumo desmedido.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-alert)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Consecuencias:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Incremento de fenómenos climáticos extremos (huracanes, sequías, inundaciones).</li>
                        <li>Pérdida de biodiversidad y especies.</li>
                        <li>Problemas de salud pública (enfermedades respiratorias, falta de agua potable).</li>
                        <li>Desplazamiento de comunidades y aumento de la pobreza.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Dato clave:</b> Más del 70% de los gases de efecto invernadero provienen de la energía, la industria y la agricultura.<br/>
                      <b>¿Sabías que?</b> Cada año se pierden millones de hectáreas de bosque y se generan más de 300 millones de toneladas de plástico.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/1.Los_Problemas_medio_ambientales.pdf"
                        title="Los Problemas Medio Ambientales"
                        description="Documento introductorio que explica los principales problemas ambientales actuales, sus causas y consecuencias para el planeta y la sociedad."
                        icon="alert-triangle"
                        buttonText="Ver Documento Completo"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección 2: Guía para Elaborar Reportes de Sostenibilidad (rediseñada, info sin card, full-width, UI moderna) */}
        <section className="section" id="guia-reportes-sostenibilidad" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Guía para Elaborar Reportes de Sostenibilidad</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    Aprende cómo comunicar el desempeño ambiental, social y económico de tu organización y fortalecer la transparencia y sostenibilidad.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="clipboard" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>¿Qué es un Reporte de Sostenibilidad?</span>
                      </div>
                      <p style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        Es un documento que comunica el desempeño ambiental, social y económico de una organización. Informa a los grupos de interés sobre el impacto de las actividades y el compromiso con el desarrollo sostenible.
                      </p>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>Contexto Organizacional:</b> Descripción de la empresa, misión, visión y valores.</li>
                        <li><b>Materialidad:</b> Temas relevantes para la organización y sus grupos de interés.</li>
                        <li><b>Desempeño Ambiental:</b> Consumo de recursos, emisiones, gestión de residuos y acciones ambientales.</li>
                        <li><b>Desempeño Social:</b> Condiciones laborales, derechos humanos, diversidad, salud y seguridad.</li>
                        <li><b>Desempeño Económico:</b> Resultados financieros, generación de valor y desarrollo local.</li>
                        <li><b>Gobernanza:</b> Estructura de gobierno, ética y transparencia.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Beneficios de elaborar un reporte:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Mejora la transparencia y la confianza con los grupos de interés.</li>
                        <li>Identifica riesgos y oportunidades.</li>
                        <li>Facilita la toma de decisiones estratégicas.</li>
                        <li>Contribuye al cumplimiento de normativas y estándares internacionales (GRI).</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Pasos para elaborar el reporte:</b>
                      <ol style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li><b>Planificación:</b> Definir equipo responsable y alcance.</li>
                        <li><b>Identificación de temas materiales:</b> Consultar a los grupos de interés y priorizar temas.</li>
                        <li><b>Recolección de información:</b> Recopilar datos cuantitativos y cualitativos.</li>
                        <li><b>Redacción y validación:</b> Elaborar y validar el documento internamente.</li>
                        <li><b>Comunicación:</b> Publicar y difundir el reporte.</li>
                      </ol>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Estándares y referencias:</b> El marco GRI (Global Reporting Initiative) es el más utilizado. Integra los ODS (Objetivos de Desarrollo Sostenible) en la estrategia y el reporte.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/2.Guía_para_elaborar_el_reporte_de_Sostenibilidad.docx.pdf"
                        title="Guía para Elaborar Reportes de Sostenibilidad"
                        description="Manual práctico para diseñar estrategias de sostenibilidad alineadas con los ODS, con pasos, ejemplos y recomendaciones."
                        icon="clipboard"
                        buttonText="Ver Guía Completa"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>





  {/* Sección: Componentes Socioambientales */}
  <section className="section" id="componentes-socioambientales" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
    <Container fluid>
      <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
        <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
          <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
            <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Componentes Sociambientales de una Organización</h2>
            <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
              Descubre cómo los componentes sociales y ambientales interactúan en la gestión sostenible de una organización.
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <FeatherIcon icon="users" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>¿Qué son los componentes sociambientales?</span>
                </div>
                <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                  Son los elementos sociales y ambientales que conforman la estructura y funcionamiento de una organización, y que influyen en su sostenibilidad y responsabilidad.
                </div>
                <ul style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                  <li><b>Componente social:</b> Personas, cultura organizacional, relaciones laborales, bienestar, equidad, diversidad e inclusión. Implica promover un ambiente de trabajo saludable, participación y responsabilidad social.</li>
                  <li><b>Componente ambiental:</b> Recursos naturales utilizados (agua, energía, materiales), emisiones, residuos y el impacto de las actividades sobre el entorno. Busca minimizar el impacto negativo, promover la eficiencia y el cumplimiento normativo.</li>
                </ul>
              </div>
              <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                <b>Importancia:</b>
                <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                  <li>Integrar ambos componentes permite a la organización ser sostenible, mejorar su reputación y cumplir con regulaciones.</li>
                  <li>La sostenibilidad requiere equilibrio entre el desarrollo económico, el bienestar social y la protección ambiental.</li>
                </ul>
              </div>
              <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                <b>Acciones clave:</b>
                <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                  <li>Diagnóstico de aspectos sociales y ambientales.</li>
                  <li>Implementación de políticas de responsabilidad social y ambiental.</li>
                  <li>Educación y sensibilización interna.</li>
                  <li>Medición y reporte de indicadores de desempeño.</li>
                </ul>
              </div>
              <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                <b>Dato clave:</b> Una gestión sociambiental efectiva impulsa la sostenibilidad, la innovación y la competitividad organizacional.
              </div>
            </div>
          </div>
        </Col>
        <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
              <CardBody className="p-4">
                <DocumentViewer 
                  pdfPath="/Concepts_docs/3.Componentes_sociambientales_de_una_organización.pdf"
                  title="Componentes Sociambientales"
                  description="Marco conceptual sobre los elementos sociales y ambientales que integran la gestión sostenible de una organización."
                  icon="users"
                  buttonText="Ver Documento"
                  cardStyle="featured"
                  customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                />
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  </section>


        {/* Sección: Amenazas, Impactos y Aspectos Ambientales */}
        <section className="section" id="amenazas-impactos-aspectos" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Amenazas, Impactos y Aspectos Ambientales</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    Aprende a identificar, evaluar y gestionar los riesgos y consecuencias ambientales en tu organización para impulsar la sostenibilidad.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="shield" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>¿Qué son las amenazas, impactos y aspectos ambientales?</span>
                      </div>
                      <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        <b>Amenazas Ambientales:</b> Factores o actividades que pueden causar daño al medio ambiente, como la contaminación, la deforestación, el uso excesivo de recursos naturales y el cambio climático.<br/>
                        <b>Impactos Ambientales:</b> Consecuencias directas o indirectas de las amenazas, como la pérdida de biodiversidad, la degradación del suelo, la contaminación del agua y del aire, y el calentamiento global.<br/>
                        <b>Aspectos Ambientales:</b> Elementos de las actividades, productos o servicios de una organización que pueden interactuar con el medio ambiente, por ejemplo, el consumo de energía, la generación de residuos, las emisiones atmosféricas y el uso del agua.
                      </div>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Gestión de Amenazas e Impactos:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Identificar y evaluar los aspectos ambientales significativos.</li>
                        <li>Implementar controles y buenas prácticas para minimizar los impactos negativos.</li>
                        <li>Adoptar políticas de sostenibilidad y tecnologías limpias.</li>
                        <li>Fomentar la educación y la sensibilización ambiental.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Beneficios de una gestión ambiental efectiva:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Reducción de riesgos y cumplimiento normativo.</li>
                        <li>Mejora de la reputación y competitividad organizacional.</li>
                        <li>Conservación de recursos y reducción de costos.</li>
                        <li>Contribución a la protección del planeta y el bienestar social.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Dato clave:</b> La gestión proactiva de amenazas y aspectos ambientales es fundamental para lograr la sostenibilidad y prevenir daños irreversibles al entorno.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/4.Amenazas_impactos_y_aspectos_ambientales.pdf"
                        title="Amenazas, Impactos y Aspectos Ambientales"
                        description="Guía para identificar y evaluar amenazas, impactos y aspectos ambientales en el contexto organizacional."
                        icon="shield"
                        buttonText="Ver Documento"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>


        {/* Sección: Acciones de Consumo Responsable (rediseñada, info sin card, full-width, UI moderna) */}
        <section className="section" id="consumo-responsable" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Acciones para el Consumo Responsable</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    El consumo responsable implica tomar decisiones informadas y conscientes sobre los productos y servicios que adquirimos, considerando su impacto ambiental, social y económico. Adoptar hábitos de consumo responsable es fundamental para reducir la huella de carbono y promover la sostenibilidad.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="shopping-cart" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>Principales acciones:</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>Reducir el consumo innecesario:</b> Antes de comprar, pregúntate si realmente lo necesitas.</li>
                        <li><b>Elegir productos locales y sostenibles:</b> Prefiere productos con bajo impacto ambiental, de origen local y con certificaciones ecológicas.</li>
                        <li><b>Reutilizar y reciclar:</b> Da una segunda vida a los objetos y separa correctamente los residuos para su reciclaje.</li>
                        <li><b>Ahorrar energía y agua:</b> Apaga luces y dispositivos cuando no los uses, y utiliza el agua de manera eficiente.</li>
                        <li><b>Optar por transporte sostenible:</b> Camina, usa bicicleta o transporte público para reducir emisiones.</li>
                        <li><b>Consumir alimentos de temporada:</b> Favorece la agricultura local y reduce la huella de transporte.</li>
                        <li><b>Evitar productos de un solo uso:</b> Prefiere envases reutilizables y reduce el uso de plásticos.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Beneficios del consumo responsable:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Disminución de residuos y contaminación.</li>
                        <li>Ahorro de recursos naturales.</li>
                        <li>Fomento de economías locales y justas.</li>
                        <li>Reducción de la huella de carbono personal y colectiva.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Dato clave:</b> Cada pequeña acción cuenta. El consumo responsable es una herramienta poderosa para cuidar el planeta y construir una sociedad más justa y sostenible.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/5.Acciones_consumo_responsable.pdf"
                        title="Acciones de Consumo Responsable"
                        description="Estrategias y recomendaciones para implementar prácticas de consumo responsable."
                        icon="shopping-cart"
                        buttonText="Ver Documento"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección: Uso Eficiente y Ahorro de Agua */}
        <section className="section" id="uso-agua" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Uso Eficiente y Ahorro de Agua</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    El agua es un recurso vital y limitado. Su uso eficiente y el ahorro son fundamentales para la sostenibilidad ambiental, la reducción de costos y la protección de los ecosistemas. Adoptar buenas prácticas permite garantizar su disponibilidad para las generaciones presentes y futuras.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="droplet" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>Principios clave para el uso eficiente del agua:</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>Detectar y reparar fugas:</b> Revisa periódicamente instalaciones y equipos para evitar pérdidas.</li>
                        <li><b>Optimizar procesos:</b> Utiliza tecnologías y métodos que reduzcan el consumo de agua en actividades diarias y productivas.</li>
                        <li><b>Reutilizar y reciclar:</b> Implementa sistemas de recolección y reutilización de aguas grises o pluviales.</li>
                        <li><b>Concientizar y educar:</b> Promueve campañas internas y externas sobre la importancia del ahorro de agua.</li>
                        <li><b>Uso responsable en el hogar y la empresa:</b> Cierra grifos mientras no los uses, utiliza electrodomésticos eficientes y riega en horarios adecuados.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Beneficios del uso eficiente y el ahorro de agua:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Reducción de costos operativos y facturas.</li>
                        <li>Disminución del impacto ambiental y preservación de fuentes hídricas.</li>
                        <li>Mejora de la imagen y responsabilidad social de la organización.</li>
                        <li>Contribución a la seguridad hídrica y adaptación al cambio climático.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Acciones prácticas:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Instalar dispositivos ahorradores (aireadores, inodoros de bajo consumo, sensores).</li>
                        <li>Capacitar al personal y a la comunidad sobre hábitos responsables.</li>
                        <li>Monitorear y registrar el consumo para identificar oportunidades de mejora.</li>
                        <li>Fomentar la innovación en el uso y tratamiento del agua.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: '#F1F8E9', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Dato clave:</b> Solo el 2.5% del agua del planeta es dulce y menos del 1% está disponible para consumo humano. Cada gota cuenta.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/6.Uso_eficiente_y_ahorro_de_agua.pdf"
                        title="Uso Eficiente y Ahorro de Agua"
                        description="Guía práctica para optimizar el uso del agua y reducir el desperdicio."
                        icon="droplet"
                        buttonText="Ver Documento"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>


        {/* Sección: Uso Eficiente y Ahorro de Energía */}
        <section className="section" id="uso-energia" style={{ background: 'var(--section-bg)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <Container fluid>
            <Row className="align-items-center justify-content-center" style={{ minHeight: '420px', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
              <Col xl={8} lg={8} md={12} sm={12} className="d-flex flex-column justify-content-center px-3 px-md-5">
                <div style={{ width: '100%', fontFamily: 'Inter, Poppins, Nunito, Segoe UI, Arial, sans-serif' }}>
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>Uso Eficiente y Ahorro de Energía</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    El uso eficiente de la energía es clave para reducir costos, disminuir la huella de carbono y proteger el medio ambiente. Adoptar buenas prácticas y tecnologías eficientes permite optimizar el consumo energético en hogares, empresas e instituciones.
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="zap" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>Principios clave para el uso eficiente de la energía:</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>Apagar equipos y luces:</b> Desconecta dispositivos y apaga luces cuando no se utilicen.</li>
                        <li><b>Aprovechar la luz natural:</b> Utiliza la iluminación natural siempre que sea posible.</li>
                        <li><b>Usar electrodomésticos eficientes:</b> Prefiere equipos con certificación energética (A, A+ o superior).</li>
                        <li><b>Mantenimiento preventivo:</b> Realiza revisiones periódicas a equipos eléctricos y sistemas de climatización.</li>
                        <li><b>Optimizar el uso de aire acondicionado y calefacción:</b> Ajusta la temperatura y aísla espacios para evitar pérdidas de energía.</li>
                        <li><b>Implementar tecnologías LED:</b> Sustituye bombillas tradicionales por LED de bajo consumo.</li>
                        <li><b>Fomentar la cultura del ahorro:</b> Capacita y sensibiliza a colaboradores y familiares sobre la importancia del uso racional de la energía.</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Beneficios del uso eficiente y el ahorro de energía:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Reducción de costos en facturas de energía.</li>
                        <li>Disminución de emisiones de gases de efecto invernadero.</li>
                        <li>Mayor vida útil de equipos y sistemas.</li>
                        <li>Contribución a la sostenibilidad y al cuidado del planeta.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>Acciones prácticas:</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>Realizar auditorías energéticas para identificar oportunidades de mejora.</li>
                        <li>Invertir en tecnologías limpias y renovables.</li>
                        <li>Promover la movilidad sostenible y el teletrabajo.</li>
                        <li>Establecer metas y monitorear el consumo energético.</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: '#F1F8E9', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>Dato clave:</b> El sector energético es responsable de más del 70% de las emisiones globales de gases de efecto invernadero. Cada acción cuenta para lograr la transición energética.
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/7.Uso_eficiente_y_ahorro_de_energia.pdf"
                        title="Uso Eficiente y Ahorro de Energía"
                        description="Recomendaciones y estrategias para optimizar el consumo energético y reducir el impacto ambiental."
                        icon="zap"
                        buttonText="Ver Documento"
                        cardStyle="featured"
                        customCardStyle={{ paddingTop: '1.2rem', paddingBottom: '1.2rem', background: 'transparent' }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>



        {/* Sección: Información Web */}
        <section className="section" id="informacion-web" style={{ background: 'var(--section-bg)', paddingTop: '1.2rem', paddingBottom: '1.2rem' }}>
          <Container fluid>
            <Row className="justify-content-center mb-3">
              <Col lg={12} className="text-center">
                <h2 className="fw-bold mb-2" style={{ color: 'var(--section-text)' }}>Información Web y Recursos de Referencia</h2>
                <p className="mb-3" style={{ color: 'var(--section-subtext)', fontSize: '1.08rem' }}>
                  Accede a fuentes oficiales, herramientas, normativas y recursos internacionales para profundizar en sostenibilidad, cambio climático y huella de carbono.
                </p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={12}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  width: '100%'
                }}>
                  {/* Lista de links */}
                  {[
                    { url: 'https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-10/', desc: 'Grupo de Trabajo III del Sexto Informe de Evaluación del IPCC: Mitigación del cambio climático.' },
                    { url: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub', desc: 'Centro de factores de emisión de GEI (EPA).' },
                    { url: 'http://www.siac.gov.co/vulnerabilidad', desc: 'Sistema de Información Ambiental de Colombia.' },
                    { url: 'https://unfccc.int/es/kyoto_protocol', desc: 'Información sobre el Protocolo de Kyoto.' },
                    { url: 'https://ghgprotocol.org/about-us', desc: 'Protocolo de Gases de Efecto Invernadero: estándares y herramientas.' },
                    { url: 'https://www.aec.es/conocimiento/centro-del-conocimiento/norma-pas-2050', desc: 'Norma PAS 2050:2008 Verificación de la Huella de Carbono.' },
                    { url: 'https://www.ipcc.ch/languages-2/spanish', desc: 'IPCC: Ciencia del cambio climático (ONU).' },
                    { url: 'https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol4.html', desc: 'Directrices del IPCC de 2006 para inventarios nacionales de GEI.' },
                    { url: 'https://www.undp.org/es/sustainable-development-goals', desc: '17 Objetivos de Desarrollo Sostenible (ONU).' },
                    { url: 'https://www.cepal.org/es/temas/agenda-2030-desarrollo-sostenible/foro-paises-america-latina-caribe-desarrollo-sostenible', desc: 'Foro de los Países de América Latina y el Caribe sobre Desarrollo Sostenible.' },
                    { url: 'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1LA-twZopnh0o8EfhCi2CM9rOksQiT80MbztFzUEzQUI&font=Default&lang=en&initial_zoom=2&height=650', desc: 'Historia del Desarrollo Sostenible.' },
                    { url: 'https://www.minambiente.gov.co/cambio-climatico-y-gestion-del-riesgo/inventario-nacional-de-emisiones-y-absorciones-de-gases-de-efecto-invernadero-ingei', desc: 'Inventario Nacional de Emisiones y Absorciones de GEI - MinAmbiente Colombia.' },
                    { url: 'https://repositorio.cepal.org/bitstream/handle/11362/39781/S1501265_es.pdf', desc: 'Medidas de adaptación y mitigación frente al cambio climático en América Latina y el Caribe.' },
                    { url: 'https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-2', desc: 'Sexto reporte del IPCC.' },
                    { url: 'https://espanol.epa.gov/la-energia-y-el-medioambiente/calculadora-de-equivalencias-de-gases-de-efecto-invernadero-calculos', desc: 'Calculadora de equivalencias de GEI (EPA).' },
                    { url: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub', desc: 'EPA GHG Emission Factors Hub.' },
                    { url: 'https://www1.upme.gov.co/siame/Paginas/calculo-factor-de-emision-de-Co2-del-SIN.aspx', desc: 'UPME Colombia: Cálculo factor de emisión de CO2 del SIN.' },
                    { url: 'https://www1.upme.gov.co/Normatividad/705_2024.pdf', desc: 'RESOLUCIÓN No. 000705 de 2024.' },
                    { url: 'https://www1.upme.gov.co/Normatividad/1198_2024.pdf', desc: 'RESOLUCIÓN No. 001198 de 2024.' },
                    { url: 'https://www.andi.com.co/Uploads/1198_2024.pdf', desc: 'RESOLUCIÓN No. 001198 de 26-12-2024: Actualización factor de emisión del SIN 2023.' },
                    { url: 'https://ghgprotocol.org/calculation-tools-and-guidance#cross_sector_tools_id', desc: 'Herramientas del Protocolo de GEI para inventarios y seguimiento climático.' },
                    { url: 'https://ghgprotocol.org/life-cycle-databases', desc: 'Bases de datos del ciclo de vida para inventarios de GEI.' },
                    { url: 'https://ghgprotocol.org/calculation-tools-and-guidance', desc: 'Calculation Tools and Guidance (GHG Protocol).' },
                    { url: 'https://www.cepal.org/es/publicaciones/46728-economia-circular-oportunidad-america-latina-caribe', desc: 'CEPAL: Economía circular en América Latina y el Caribe.' },
                    { url: 'https://www.ellenmacarthurfoundation.org', desc: 'Fundación Ellen MacArthur: Economía circular.' },
                    { url: 'https://www.gob.mx/inecc', desc: 'INECC México: Manual para la evaluación de la huella de carbono.' },
                    { url: 'https://doi.org/10.3390/su8090937', desc: 'Sustainability: Marco conceptual para el diseño circular.' },
                    { url: 'https://www.unido.org', desc: 'ONUDI: Guía de producción y consumo sostenible.' },
                    { url: 'https://www.unep.org', desc: 'PNUMA: Impulsando el consumo sostenible en América Latina y el Caribe.' },
                  ].map((item, idx) => (
                    <a
                      key={item.url + idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        background: 'var(--section-box)',
                        borderRadius: 12,
                        padding: '0.85rem 1.1rem',
                        minWidth: 0,
                        width: '100%',
                        boxShadow: '0 1px 4px rgba(33, 122, 58, 0.07)',
                        textDecoration: 'none',
                        color: 'var(--section-text)',
                        transition: 'box-shadow 0.18s, background 0.18s',
                        fontSize: '1.01rem',
                        margin: 0
                      }}
                      title={item.desc}
                    >
                      <span style={{ fontWeight: 700, fontSize: '1.04rem', marginBottom: 4, color: 'var(--section-list)' }}>{item.desc}</span>
                      <span style={{ fontSize: '0.93rem', color: 'var(--section-subtext)', wordBreak: 'break-all' }}>{item.url}</span>
                    </a>
                  ))}
                </div>
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