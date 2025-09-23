import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Footer from '../component/Footer/Footer';

import FeatherIcon from 'feather-icons-react';

const autogestionDocs = [
  {
    nombre: 'Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx',
    archivo: '/Autodiagnostico_docs/1. Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx',
    descripcion: 'Herramienta para que las organizaciones realicen un autodiagnóstico integral de su desempeño en sostenibilidad ambiental, social y económica. Incluye preguntas clave y criterios de evaluación para identificar fortalezas y oportunidades de mejora en la gestión sostenible.'
  },
  {
    nombre: 'Cuestionario de Sostenibilidad Organizaciones.xls',
    archivo: '/Autodiagnostico_docs/2. Cuestionario de Sostenibilidad Organizaciones.xls',
    descripcion: 'Cuestionario detallado para recopilar información sobre prácticas sostenibles, consumo de recursos, políticas internas y acciones de responsabilidad social. Permite establecer una línea base y comparar avances en el tiempo.'
  },
  {
    nombre: 'formato diagnóstico eléctricidad.xlsx',
    archivo: '/Autodiagnostico_docs/3. formato diagnóstico eléctricidad.xlsx',
    descripcion: 'Formato especializado para registrar y analizar el consumo de energía eléctrica en la organización. Facilita la identificación de patrones de uso, áreas de alto consumo y oportunidades para implementar medidas de eficiencia energética.'
  },
  {
    nombre: 'Formato diagnóstico Combustibles.xlsx',
    archivo: '/Autodiagnostico_docs/4. Formato diagnóstico Combustibles.xlsx',
    descripcion: 'Documento para el registro y evaluación del consumo de combustibles fósiles (gasolina, diésel, gas, etc.) en vehículos, maquinaria y procesos. Ayuda a calcular emisiones asociadas y a diseñar estrategias de reducción.'
  },
  {
    nombre: 'formato diagnóstico agua.xlsx',
    archivo: '/Autodiagnostico_docs/5. formato diagnóstico agua.xlsx',
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
  const downloadFile = async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error descargando archivo:', error);
    }
  };

  return (
    <React.Fragment>
      <section style={{
        minHeight: '420px',
        paddingTop: '120px',
        background: 'linear-gradient(120deg, #43e97b 0%, #2ecc40 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} className="text-center text-white">
              <div style={{fontSize: 64, marginBottom: 16, color: '#fff', opacity: 0.9}}>
                <FeatherIcon icon="download" size={64} />
              </div>
              <h1 className="fw-bold mb-3" style={{fontSize: '2.7rem', letterSpacing: '-1px'}}>Autogestión de Sostenibilidad</h1>
              <h4 className="mb-3" style={{color: '#b2f7ef', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.2px', lineHeight: 1.18}}>
                Herramientas para la Gestión Ambiental
              </h4>
              <p className="lead text-white-70 mb-4" style={{fontSize: '1.18rem', color: 'rgba(255,255,255,0.92)'}}>
                Descarga los formatos y documentos necesarios para la autogestión de sostenibilidad en tu organización.
              </p>
            </Col>
          </Row>
        </Container>
        <div style={{position: 'absolute', top: -80, right: -120, width: 320, height: 320, background: 'radial-gradient(circle, #b2f7ef 0%, #43e97b 100%)', opacity: 0.18, borderRadius: '50%'}}></div>
      </section>

      <section className="section" style={{background: 'linear-gradient(120deg, #e8f5e9 0%, #f8fafc 100%)', minHeight: 600}}>
        <Container>
          <Row>
            <Col lg={3} md={4} className="order-2 order-md-1">
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(46,125,50,0.1)',
                border: '1px solid rgba(67,233,123,0.2)',
                position: 'sticky',
                top: '120px',
              }}>
                <h6 className="fw-bold text-success mb-3" style={{fontSize: '0.95rem'}}>Documentos Disponibles</h6>
                <div className="d-flex flex-column gap-2">
                  {autogestionDocs.map((doc, idx) => (
                    <button
                      key={idx}
                      className="btn btn-outline-success btn-sm text-start p-2"
                      style={{
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: '1px solid rgba(67,233,123,0.3)',
                      }}
                      onClick={() => downloadFile(doc.archivo)}
                    >
                      <FeatherIcon icon="download" size={14} className="me-2" />
                      {doc.nombre.length > 25 ? `${doc.nombre.substring(0, 25)}...` : doc.nombre}
                    </button>
                  ))}
                </div>
              </div>
            </Col>

            <Col lg={9} md={8} className="order-1 order-md-2">
              <Row className="g-4">
                {autogestionDocs.map((doc, idx) => {
                  const extension = doc.nombre.split('.').pop().toLowerCase();
                  const isExcel = ['xlsx', 'xls'].includes(extension);
                  
                  return (
                    <Col lg={6} key={idx}>
                      <div 
                        style={{
                          ...glassStyle,
                          cursor: 'pointer',
                        }}
                        className="h-100"
                        onClick={() => downloadFile(doc.archivo)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(46,125,50,0.2)';
                          e.currentTarget.style.border = '1.5px solid rgba(67,233,123,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(46,125,50,0.13)';
                          e.currentTarget.style.border = '1.5px solid #e0e7ff';
                        }}
                      >
                        <div>
                          <div className="d-flex align-items-center mb-3">
                            <div style={{
                              width: 48, 
                              height: 48, 
                              borderRadius: '12px', 
                              background: isExcel ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <FeatherIcon icon={isExcel ? "file-text" : "download"} size={24} color="#fff" />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-0" style={{fontSize: '0.95rem', color: '#1f2937', lineHeight: 1.3}}>
                                {doc.nombre.length > 40 ? `${doc.nombre.substring(0, 40)}...` : doc.nombre}
                              </h6>
                              <span className="text-muted" style={{fontSize: '0.8rem'}}>{extension.toUpperCase()}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted mb-4" style={{fontSize: '0.9rem', lineHeight: 1.5}}>
                            {doc.descripcion.length > 120 ? `${doc.descripcion.substring(0, 120)}...` : doc.descripcion}
                          </p>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <button 
                            className="btn btn-success btn-sm d-flex align-items-center" 
                            style={{borderRadius: '8px', fontWeight: 600}}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile(doc.archivo);
                            }}
                          >
                            <FeatherIcon icon="download" size={16} className="me-2" />
                            Descargar
                          </button>
                          <div className="text-success" style={{fontSize: '0.85rem', fontWeight: 600}}>
                            Gratuito
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default AutogestionPage;
