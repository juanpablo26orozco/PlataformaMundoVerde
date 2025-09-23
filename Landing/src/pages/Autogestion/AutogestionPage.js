
import React, { useRef } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Footer from '../../component/Footer/Footer';

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
  // Refs para scroll suave
  const docRefs = useRef(autogestionDocs.map(() => React.createRef()));

  const handleNavClick = idx => {
    docRefs.current[idx].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <React.Fragment>
      {/* Hero innovador */}
      <section style={{
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
              <h1 className="fw-bold mb-3" style={{fontSize: '2.7rem', letterSpacing: '-1px'}}>Autogestión</h1>
              <p className="lead text-white-70 mb-4" style={{fontSize: '1.25rem', color: 'rgba(255,255,255,0.92)'}}>
                Descarga los formatos y documentos necesarios para la autogestión de sostenibilidad en tu organización.
              </p>
            </Col>
          </Row>
        </Container>
        {/* Efecto decorativo */}
        <div style={{position: 'absolute', top: -80, right: -120, width: 320, height: 320, background: 'radial-gradient(circle, #4caf50 0%, #66bb6a 100%)', opacity: 0.15, borderRadius: '50%'}}></div>
      </section>
      {/* Layout con barra lateral y contenido */}
      <section className="section" style={{background: 'linear-gradient(120deg, #e8f5e9 0%, #f8fafc 100%)', minHeight: 600}}>
        <Container fluid>
          <Row className="justify-content-center">
            {/* Barra lateral */}
            <Col md={3} lg={2} className="d-none d-md-block" style={{paddingRight: 0}}>
              <nav style={{
                position: 'sticky',
                top: 120,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 2px 16px 0 rgba(46,125,50,0.10)',
                  padding: '44px 22px 44px 22px',
                  margin: 0,
                  minHeight: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}>
                  <h4 style={{color: '#2E7D32', fontWeight: 900, fontSize: '1.18rem', marginBottom: 32, letterSpacing: 0.5, textAlign: 'left'}}>Formatos disponibles</h4>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0, flex: 1}}>
                    {autogestionDocs.map((doc, idx) => (
                      <li key={idx} style={{marginBottom: 22}}>
                        <button
                          onClick={() => handleNavClick(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#388e3c',
                            fontWeight: 700,
                            fontSize: '1.13rem',
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left',
                            width: '100%',
                            transition: 'color 0.15s',
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#2E7D32'}
                          onMouseOut={e => e.currentTarget.style.color = '#388e3c'}
                        >
                          <FeatherIcon icon="file" size={22} className="me-2" /> {doc.nombre.replace('.xlsx','').replace('.xls','')}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </Col>
            {/* Contenido principal */}
            <Col xs={12} md={9} lg={8}>
              {autogestionDocs.map((doc, idx) => {
                const ext = doc.archivo.split('.').pop().toLowerCase();
                let icon = 'file-text';
                if (ext === 'pdf') icon = 'file';
                if (ext === 'xlsx' || ext === 'xls') icon = 'bar-chart-2';
                if (ext === 'doc' || ext === 'docx') icon = 'file';
                return (
                  <div
                    ref={docRefs.current[idx]}
                    id={`doc-${idx}`}
                    className="documento-card mb-5"
                    style={{
                      ...glassStyle,
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      padding: 36,
                      minHeight: 180,
                      gap: 32,
                    }}
                    key={idx}
                  >
                    <div style={{width: 64, height: 64, marginRight: 32, flexShrink: 0, background: '#f1f8e9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(76,175,80,0.08)'}}>
                      <FeatherIcon icon={icon} size={40} color="#43e97b" />
                    </div>
                    <div style={{flex: 1}}>
                      <h2 style={{color: '#2E7D32', fontWeight: 800, fontSize: '1.25rem', marginBottom: 12, wordBreak: 'break-word'}}>{doc.nombre}</h2>
                      <p style={{color: '#388e3c', fontSize: '1.08rem', marginBottom: 18, lineHeight: 1.7}}>{doc.descripcion}</p>
                      <a
                        className="btn btn-mundo-verde d-inline-flex align-items-center"
                        href={doc.archivo}
                        download
                        style={{fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 2px 12px 0 rgba(76,175,80,0.10)', borderRadius: 10, transition: 'background 0.18s, box-shadow 0.18s, transform 0.18s'}}
                        onMouseOver={e => {e.currentTarget.style.transform='scale(1.07)';e.currentTarget.style.boxShadow='0 6px 24px 0 rgba(76,175,80,0.18)';}}
                        onMouseOut={e => {e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 2px 12px 0 rgba(76,175,80,0.10)';}}
                      >
                        <FeatherIcon icon="download" className="me-2" size={20} /> Descargar
                      </a>
                    </div>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default AutogestionPage;
