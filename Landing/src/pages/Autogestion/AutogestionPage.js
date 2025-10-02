import React, { useRef } from 'react';
import SidebarNav from '../../component/Autogestion/SidebarNav';
import FormularioAutogestion from '../../component/Autogestion/FormularioAutogestion';
import { Card, CardBody } from 'reactstrap';
import DocumentViewer from '../../component/DocumentViewer';
import { Container, Row, Col } from 'reactstrap';
import Footer from '../../component/Footer/Footer';
import { useTranslation } from 'react-i18next';

import FeatherIcon from 'feather-icons-react';

const autogestionDocs = [
  {
    nombre: 'Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx',
    archivo: '/PlataformaMundoVerde/Autodiagnostico_docs/1. Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx',
    descripcion: 'Herramienta para que las organizaciones realicen un autodiagnóstico integral de su desempeño en sostenibilidad ambiental, social y económica. Incluye preguntas clave y criterios de evaluación para identificar fortalezas y oportunidades de mejora en la gestión sostenible.'
  },
  {
    nombre: 'Cuestionario de Sostenibilidad Organizaciones.xls',
    archivo: '/PlataformaMundoVerde/Autodiagnostico_docs/2. Cuestionario de Sostenibilidad Organizaciones.xls',
    descripcion: 'Cuestionario detallado para recopilar información sobre prácticas sostenibles, consumo de recursos, políticas internas y acciones de responsabilidad social. Permite establecer una línea base y comparar avances en el tiempo.'
  },
  {
    nombre: 'formato diagnóstico eléctricidad.xlsx',
    archivo: '/PlataformaMundoVerde/Autodiagnostico_docs/3. formato diagnóstico eléctricidad.xlsx',
    descripcion: 'Formato especializado para registrar y analizar el consumo de energía eléctrica en la organización. Facilita la identificación de patrones de uso, áreas de alto consumo y oportunidades para implementar medidas de eficiencia energética.'
  },
  {
    nombre: 'Formato diagnóstico Combustibles.xlsx',
    archivo: '/PlataformaMundoVerde/Autodiagnostico_docs/4. Formato diagnóstico Combustibles.xlsx',
    descripcion: 'Documento para el registro y evaluación del consumo de combustibles fósiles (gasolina, diésel, gas, etc.) en vehículos, maquinaria y procesos. Ayuda a calcular emisiones asociadas y a diseñar estrategias de reducción.'
  },
  {
    nombre: 'formato diagnóstico agua.xlsx',
    archivo: '/PlataformaMundoVerde/Autodiagnostico_docs/5. formato diagnóstico agua.xlsx',
    descripcion: 'Herramienta para monitorear el uso de agua en la organización, identificar fugas, consumos excesivos y proponer acciones para el ahorro y la gestión eficiente del recurso hídrico.'
  },
];

const glassStyle = {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '22px',
    boxShadow: '0 8px 32px 0 rgba(46,125,50,0.13)',
    border: '1.5px solid #e0e7ff',
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    padding: 32,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
};


const AutogestionPage = () => {
  const { t } = useTranslation();
  const formRef = useRef(null);

  return (
    <React.Fragment>
      <SidebarNav />
  {/* Hero innovador */}
  <section id="autogestion-hero" style={{
        minHeight: '340px',
        paddingTop: '120px',
        background: 'linear-gradient(120deg, #217a3a 0%, #28a745 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} className="text-center text-white">
              <div style={{fontSize: 64, marginBottom: 16, color: '#fff', opacity: 0.9}}>
                <FeatherIcon icon="activity" size={64} />
              </div>
              <h1 className="fw-bold mb-3" style={{fontSize: '2.7rem', letterSpacing: '-1px'}}>{t('autogestion.hero.title')}</h1>
              <p className="lead text-white-70 mb-4" style={{fontSize: '1.25rem', color: 'rgba(255,255,255,0.92)'}}>
                {t('autogestion.hero.description')}
              </p>
            </Col>
          </Row>
        </Container>
        {/* Efecto decorativo */}
        <div style={{position: 'absolute', top: -80, right: -120, width: 320, height: 320, background: 'radial-gradient(circle, #4caf50 0%, #66bb6a 100%)', opacity: 0.15, borderRadius: '50%'}}></div>
      </section>



      {/* Sección de descarga de Excel debajo del formulario */}


      {/* Card con PDF instructivo y formulario juntos */}
      <Container className="my-4" id="autogestion-instructivo">
        <Row className="justify-content-center">
          <Col lg={10} md={12} sm={12}>
            <Card className="shadow border-0" style={{ borderRadius: '18px', background: '#f8fff8' }}>
              <CardBody className="p-4">
                <h3 className="fw-bold mb-3 w-100 text-center" style={{ color: '#217a3a' }}>{t('autogestion.instructive.title')}</h3>
                <p className="mb-3 w-100 text-center" style={{ color: '#4b5c53', fontSize: '1.08rem' }}>
                  {t('autogestion.instructive.description')}
                </p>
                <div className="d-flex flex-row w-100 justify-content-center align-items-stretch gap-4" style={{flexWrap: 'wrap'}}>
                  {/* Card PDF instructivo */}
                  <div style={{flex: '1 1 340px', minWidth: 320, maxWidth: 420, display: 'flex', alignItems: 'stretch'}}>
                    <Card className="shadow border-0 w-100" style={{ borderRadius: '18px', background: '#f8fff8', width: '100%' }}>
                      <CardBody className="p-3">
                        <DocumentViewer
                          pdfPath="/Autodiagnostico_docs/1.Instructivo_para_diligenciar_Autodiagnostico_de_Sostenibilidad.pdf"
                          title={t('autogestion.instructive.viewInstructive')}
                          description={t('autogestion.instructive.pdfDescription')}
                          icon="file-text"
                          buttonText={t('autogestion.instructive.viewInstructive')}
                          cardStyle="featured"
                          customCardStyle={{ paddingTop: 0, paddingBottom: '1.2rem', background: 'transparent', height: '100%', marginTop: 0 }}
                        />
                      </CardBody>
                    </Card>
                  </div>
                  {/* Formulario autogestión */}
                  <div ref={formRef} id="autogestion-formulario" style={{flex: '1 1 340px', minWidth: 320, maxWidth: 520, display: 'flex', alignItems: 'flex-start'}}>
                    <FormularioAutogestion noCard />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Sección de descarga de Excel debajo del formulario */}
      <Container className="mt-5" id="autogestion-descargas">
        <Row className="justify-content-center">
          <Col lg={5} md={6} sm={12} className="mb-4">
            <Card className="shadow border-0 w-100" style={{ borderRadius: '18px', background: '#f8fff8', width: '100%' }}>
              <CardBody className="p-3 d-flex flex-column justify-content-center align-items-center">
                <h5 style={{color:'#217a3a', fontWeight:900, marginBottom:'12px', textAlign:'center'}}>{t('autogestion.downloads.selfDiagnosis.title')}</h5>
                <p style={{color:'#4b5c53', fontSize:'1rem', textAlign:'center', marginBottom:'18px'}}>{t('autogestion.downloads.selfDiagnosis.description')}</p>
                <a
                  href="/Autodiagnostico_docs/1. Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx"
                  download
                  style={{
                    display: 'inline-block',
                    background: '#217a3a',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    fontSize: '1.08rem',
                    boxShadow: '0 2px 8px 0 rgba(46,125,50,0.10)',
                    transition: 'background 0.18s',
                  }}
                >
                  {t('autogestion.downloads.selfDiagnosis.button')}
                </a>
              </CardBody>
            </Card>
          </Col>
          <Col lg={5} md={6} sm={12} className="mb-4">
            <Card className="shadow border-0 w-100" style={{ borderRadius: '18px', background: '#f8fff8', width: '100%' }}>
              <CardBody className="p-3 d-flex flex-column justify-content-center align-items-center">
                <h5 style={{color:'#217a3a', fontWeight:900, marginBottom:'12px', textAlign:'center'}}>{t('autogestion.downloads.questionnaire.title')}</h5>
                <p style={{color:'#4b5c53', fontSize:'1rem', textAlign:'center', marginBottom:'18px'}}>{t('autogestion.downloads.questionnaire.description')}</p>
                <a
                  href="/Autodiagnostico_docs/2. Cuestionario de Sostenibilidad Organizaciones.xls"
                  download
                  style={{
                    display: 'inline-block',
                    background: '#217a3a',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    fontSize: '1.08rem',
                    boxShadow: '0 2px 8px 0 rgba(46,125,50,0.10)',
                    transition: 'background 0.18s',
                  }}
                >
                  {t('autogestion.downloads.questionnaire.button')}
                </a>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default AutogestionPage;
