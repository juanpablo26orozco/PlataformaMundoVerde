import React, { Component } from "react";
import { createRef } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { withTranslation } from 'react-i18next';

//Import Components
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";
import DocumentViewer from "../../component/DocumentViewer";
import ConceptSidebarNav from '../../component/ConceptSection/ConceptSidebarNav';
import withRouter from '../../component/withRouter';

class HuellaCarbono extends Component {
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

    // Scroll automático si viene de búsqueda global
    const sectionId = this.props.router && this.props.router.location && this.props.router.location.state && this.props.router.location.state.sectionId;
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // Espera para asegurar que el DOM esté listo
      }
    }
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
    const { t } = this.props;
    
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
                    {t('huellaCarbono.hero.title')}
                  </h1>
                  <h4 className="text-white-70 mb-4">
                    {t('huellaCarbono.hero.subtitle')}
                  </h4>
                  <p className="text-white-70 para-desc mb-0 mx-auto">
                    {t('huellaCarbono.hero.description')}
                  </p>
                  
                  <nav aria-label="breadcrumb" className="d-inline-block mt-4">
                    <ul className="breadcrumb bg-transparent mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/" className="text-white-70">
                          {t('huellaCarbono.hero.breadcrumbHome')}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-white" aria-current="page">
                        {t('huellaCarbono.hero.breadcrumbConcepts')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.environmentalProblems.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.environmentalProblems.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="alert-triangle" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.environmentalProblems.whatAre')}</span>
                      </div>
                      <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        {t('huellaCarbono.environmentalProblems.description')}
                      </div>
                      <ul style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.environmentalProblems.globalWarming')}</b> {t('huellaCarbono.environmentalProblems.globalWarmingDesc')}</li>
                        <li><b>{t('huellaCarbono.environmentalProblems.pollution')}</b> {t('huellaCarbono.environmentalProblems.pollutionDesc')}</li>
                        <li><b>{t('huellaCarbono.environmentalProblems.deforestation')}</b> {t('huellaCarbono.environmentalProblems.deforestationDesc')}</li>
                        <li><b>{t('huellaCarbono.environmentalProblems.waste')}</b> {t('huellaCarbono.environmentalProblems.wasteDesc')}</li>
                        <li><b>{t('huellaCarbono.environmentalProblems.energy')}</b> {t('huellaCarbono.environmentalProblems.energyDesc')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.environmentalProblems.mainCauses')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.environmentalProblems.cause1')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.cause2')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.cause3')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.cause4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-alert)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.environmentalProblems.consequences')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.environmentalProblems.consequence1')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.consequence2')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.consequence3')}</li>
                        <li>{t('huellaCarbono.environmentalProblems.consequence4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.environmentalProblems.keyFact')}</b> {t('huellaCarbono.environmentalProblems.keyFactDesc')}<br/>
                      <b>{t('huellaCarbono.environmentalProblems.didYouKnow')}</b> {t('huellaCarbono.environmentalProblems.didYouKnowDesc')}
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
                        title={t('huellaCarbono.environmentalProblems.title')}
                        description={t('huellaCarbono.environmentalProblems.cardDescription')}
                        icon="alert-triangle"
                        buttonText={t('huellaCarbono.environmentalProblems.viewDocument')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.sustainabilityReports.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.sustainabilityReports.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="clipboard" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.sustainabilityReports.whatIs')}</span>
                      </div>
                      <p style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        {t('huellaCarbono.sustainabilityReports.description')}
                      </p>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.sustainabilityReports.organizationalContext')}</b> {t('huellaCarbono.sustainabilityReports.organizationalContextDesc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.materiality')}</b> {t('huellaCarbono.sustainabilityReports.materialityDesc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.environmentalPerformance')}</b> {t('huellaCarbono.sustainabilityReports.environmentalPerformanceDesc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.socialPerformance')}</b> {t('huellaCarbono.sustainabilityReports.socialPerformanceDesc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.economicPerformance')}</b> {t('huellaCarbono.sustainabilityReports.economicPerformanceDesc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.governance')}</b> {t('huellaCarbono.sustainabilityReports.governanceDesc')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.sustainabilityReports.benefits')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.sustainabilityReports.benefit1')}</li>
                        <li>{t('huellaCarbono.sustainabilityReports.benefit2')}</li>
                        <li>{t('huellaCarbono.sustainabilityReports.benefit3')}</li>
                        <li>{t('huellaCarbono.sustainabilityReports.benefit4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.sustainabilityReports.steps')}</b>
                      <ol style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.sustainabilityReports.step1')}</b> {t('huellaCarbono.sustainabilityReports.step1Desc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.step2')}</b> {t('huellaCarbono.sustainabilityReports.step2Desc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.step3')}</b> {t('huellaCarbono.sustainabilityReports.step3Desc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.step4')}</b> {t('huellaCarbono.sustainabilityReports.step4Desc')}</li>
                        <li><b>{t('huellaCarbono.sustainabilityReports.step5')}</b> {t('huellaCarbono.sustainabilityReports.step5Desc')}</li>
                      </ol>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.sustainabilityReports.standards')}</b> {t('huellaCarbono.sustainabilityReports.standardsDesc')}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={4} md={10} sm={12} className="d-flex justify-content-center align-items-center" style={{ paddingRight: '2vw', paddingLeft: '1vw' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <Card className="shadow border-0" style={{ background: '#e8f5e9', borderTop: '4px solid #43a047', borderRadius: '18px' }}>
                    <CardBody className="p-4">
                      <DocumentViewer 
                        pdfPath="/Concepts_docs/2.Guia_para_elaborar_el_reporte_de_sostenibilidad.pdf"
                        title={t('huellaCarbono.sustainabilityReports.title')}
                        description={t('huellaCarbono.sustainabilityReports.cardDescription')}
                        icon="clipboard"
                        buttonText={t('huellaCarbono.sustainabilityReports.viewGuide')}
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
            <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.socioEnvironmentalComponents.title')}</h2>
            <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
              {t('huellaCarbono.socioEnvironmentalComponents.subtitle')}
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <FeatherIcon icon="users" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.socioEnvironmentalComponents.whatAre')}</span>
                </div>
                <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                  {t('huellaCarbono.socioEnvironmentalComponents.description')}
                </div>
                <ul style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                  <li><b>{t('huellaCarbono.socioEnvironmentalComponents.socialComponent')}</b> {t('huellaCarbono.socioEnvironmentalComponents.socialComponentDesc')}</li>
                  <li><b>{t('huellaCarbono.socioEnvironmentalComponents.environmentalComponent')}</b> {t('huellaCarbono.socioEnvironmentalComponents.environmentalComponentDesc')}</li>
                </ul>
              </div>
              <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                <b>{t('huellaCarbono.socioEnvironmentalComponents.importance')}</b>
                <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.importance1')}</li>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.importance2')}</li>
                </ul>
              </div>
              <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                <b>{t('huellaCarbono.socioEnvironmentalComponents.keyActions')}</b>
                <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.action1')}</li>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.action2')}</li>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.action3')}</li>
                  <li>{t('huellaCarbono.socioEnvironmentalComponents.action4')}</li>
                </ul>
              </div>
              <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                <b>{t('huellaCarbono.socioEnvironmentalComponents.keyFact')}</b> {t('huellaCarbono.socioEnvironmentalComponents.keyFactDesc')}
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
                  title={t('huellaCarbono.socioEnvironmentalComponents.cardTitle')}
                  description={t('huellaCarbono.socioEnvironmentalComponents.cardDescription')}
                  icon="users"
                  buttonText={t('documentViewer.viewDocument')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.threatsImpactsAspects.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.threatsImpactsAspects.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="shield" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.threatsImpactsAspects.whatAre')}</span>
                      </div>
                      <div style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                        <b>{t('huellaCarbono.threatsImpactsAspects.threats')}</b> {t('huellaCarbono.threatsImpactsAspects.threatsDesc')}<br/>
                        <b>{t('huellaCarbono.threatsImpactsAspects.impacts')}</b> {t('huellaCarbono.threatsImpactsAspects.impactsDesc')}<br/>
                        <b>{t('huellaCarbono.threatsImpactsAspects.aspects')}</b> {t('huellaCarbono.threatsImpactsAspects.aspectsDesc')}
                      </div>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.threatsImpactsAspects.management')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.threatsImpactsAspects.management1')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.management2')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.management3')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.management4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.threatsImpactsAspects.benefits')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.threatsImpactsAspects.benefit1')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.benefit2')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.benefit3')}</li>
                        <li>{t('huellaCarbono.threatsImpactsAspects.benefit4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.threatsImpactsAspects.keyFact')}</b> {t('huellaCarbono.threatsImpactsAspects.keyFactDesc')}
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
                        title={t('huellaCarbono.threatsImpactsAspects.title')}
                        description={t('huellaCarbono.threatsImpactsAspects.cardDescription')}
                        icon="shield"
                        buttonText={t('documentViewer.viewDocument')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.responsibleConsumption.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.responsibleConsumption.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="shopping-cart" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.responsibleConsumption.mainActions')}</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action1')}</b> {t('huellaCarbono.responsibleConsumption.action1Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action2')}</b> {t('huellaCarbono.responsibleConsumption.action2Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action3')}</b> {t('huellaCarbono.responsibleConsumption.action3Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action4')}</b> {t('huellaCarbono.responsibleConsumption.action4Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action5')}</b> {t('huellaCarbono.responsibleConsumption.action5Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action6')}</b> {t('huellaCarbono.responsibleConsumption.action6Desc')}</li>
                        <li><b>{t('huellaCarbono.responsibleConsumption.action7')}</b> {t('huellaCarbono.responsibleConsumption.action7Desc')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.responsibleConsumption.benefits')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.responsibleConsumption.benefit1')}</li>
                        <li>{t('huellaCarbono.responsibleConsumption.benefit2')}</li>
                        <li>{t('huellaCarbono.responsibleConsumption.benefit3')}</li>
                        <li>{t('huellaCarbono.responsibleConsumption.benefit4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: 'var(--section-box)', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.responsibleConsumption.keyFact')}</b> {t('huellaCarbono.responsibleConsumption.keyFactDesc')}
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
                        title={t('huellaCarbono.responsibleConsumption.cardTitle')}
                        description={t('huellaCarbono.responsibleConsumption.cardDescription')}
                        icon="shopping-cart"
                        buttonText={t('documentViewer.viewDocument')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.waterUse.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.waterUse.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="droplet" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.waterUse.keyPrinciples')}</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.waterUse.principle1')}</b> {t('huellaCarbono.waterUse.principle1Desc')}</li>
                        <li><b>{t('huellaCarbono.waterUse.principle2')}</b> {t('huellaCarbono.waterUse.principle2Desc')}</li>
                        <li><b>{t('huellaCarbono.waterUse.principle3')}</b> {t('huellaCarbono.waterUse.principle3Desc')}</li>
                        <li><b>{t('huellaCarbono.waterUse.principle4')}</b> {t('huellaCarbono.waterUse.principle4Desc')}</li>
                        <li><b>{t('huellaCarbono.waterUse.principle5')}</b> {t('huellaCarbono.waterUse.principle5Desc')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.waterUse.benefits')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.waterUse.benefit1')}</li>
                        <li>{t('huellaCarbono.waterUse.benefit2')}</li>
                        <li>{t('huellaCarbono.waterUse.benefit3')}</li>
                        <li>{t('huellaCarbono.waterUse.benefit4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.waterUse.practicalActions')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.waterUse.action1')}</li>
                        <li>{t('huellaCarbono.waterUse.action2')}</li>
                        <li>{t('huellaCarbono.waterUse.action3')}</li>
                        <li>{t('huellaCarbono.waterUse.action4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: '#F1F8E9', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.waterUse.keyFact')}</b> {t('huellaCarbono.waterUse.keyFactDesc')}
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
                        title={t('huellaCarbono.waterUse.title')}
                        description={t('huellaCarbono.waterUse.cardDescription')}
                        icon="droplet"
                        buttonText={t('documentViewer.viewDocument')}
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
                  <h2 className="fw-bold mb-3 text-center w-100 fs-2 fs-md-1" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.energyUse.title')}</h2>
                  <p className="mb-4 text-center mx-auto fs-6 fs-md-5" style={{ color: 'var(--section-subtext)', maxWidth: 700 }}>
                    {t('huellaCarbono.energyUse.subtitle')}
                  </p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0 }}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <FeatherIcon icon="zap" size={24} color="var(--section-list)" style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 600, color: 'var(--section-list)', fontSize: 22 }}>{t('huellaCarbono.energyUse.keyPrinciples')}</span>
                      </div>
                      <ul style={{ color: 'var(--section-list2)', fontSize: 17, marginBottom: 10, paddingLeft: 28, maxWidth: '100%' }}>
                        <li><b>{t('huellaCarbono.energyUse.principle1')}</b> {t('huellaCarbono.energyUse.principle1Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle2')}</b> {t('huellaCarbono.energyUse.principle2Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle3')}</b> {t('huellaCarbono.energyUse.principle3Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle4')}</b> {t('huellaCarbono.energyUse.principle4Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle5')}</b> {t('huellaCarbono.energyUse.principle5Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle6')}</b> {t('huellaCarbono.energyUse.principle6Desc')}</li>
                        <li><b>{t('huellaCarbono.energyUse.principle7')}</b> {t('huellaCarbono.energyUse.principle7Desc')}</li>
                      </ul>
                    </div>
                    <div style={{ color: 'var(--section-list)', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.energyUse.benefits')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.energyUse.benefit1')}</li>
                        <li>{t('huellaCarbono.energyUse.benefit2')}</li>
                        <li>{t('huellaCarbono.energyUse.benefit3')}</li>
                        <li>{t('huellaCarbono.energyUse.benefit4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#1976D2', fontSize: 17, marginBottom: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.energyUse.practicalActions')}</b>
                      <ul style={{ margin: 0, paddingLeft: 28, color: 'var(--section-list2)', maxWidth: '100%' }}>
                        <li>{t('huellaCarbono.energyUse.action1')}</li>
                        <li>{t('huellaCarbono.energyUse.action2')}</li>
                        <li>{t('huellaCarbono.energyUse.action3')}</li>
                        <li>{t('huellaCarbono.energyUse.action4')}</li>
                      </ul>
                    </div>
                    <div style={{ color: '#616161', fontSize: 15, background: '#F1F8E9', borderRadius: 8, padding: 12, marginTop: 10, maxWidth: '100%' }}>
                      <b>{t('huellaCarbono.energyUse.keyFact')}</b> {t('huellaCarbono.energyUse.keyFactDesc')}
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
                        title={t('huellaCarbono.energyUse.title')}
                        description={t('huellaCarbono.energyUse.cardDescription')}
                        icon="zap"
                        buttonText={t('documentViewer.viewDocument')}
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
                <h2 className="fw-bold mb-2" style={{ color: 'var(--section-text)' }}>{t('huellaCarbono.webResources.title')}</h2>
                <p className="mb-3" style={{ color: 'var(--section-subtext)', fontSize: '1.08rem' }}>
                  {t('huellaCarbono.webResources.description')}
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

export default withTranslation()(withRouter(HuellaCarbono));