


import React, { useState } from 'react';
import { Container, Row, Col, Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import Footer from '../../component/Footer/Footer';
import FeatherIcon from 'feather-icons-react';
import DocumentViewer from '../../component/DocumentViewer';

// Estructura base de carpetas/categorías
const categorias = [
  { nombre: '1. RIA', icon: 'folder' },
  { nombre: '2. Ciclo de Vida', icon: 'folder' },
  { nombre: '3. Criterios de PCC y CS', icon: 'folder' },
  { nombre: '4. Gestión de subproductos EC', icon: 'folder' },
  { nombre: '5. Costos de Ineficiencia CI', icon: 'folder' },
  { nombre: '6. Otras Herramientas', icon: 'folder' },
];

const DocumentosPage = () => {
  const [open, setOpen] = useState('');
  const toggle = id => setOpen(open === id ? '' : id);

  return (
    <React.Fragment>
      <section className="section" style={{background: '#4CAF50', minHeight: '420px', paddingTop: '120px', paddingBottom: '80px'}}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="fw-bold mb-3">Herramientas y Documentos</h1>
              <p className="lead mb-4">
                Accede y descarga herramientas y documentos clave organizados por categorías. Haz clic en cada carpeta para explorar los recursos disponibles.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section" style={{background: '#f8f9fa', paddingTop: '60px', paddingBottom: '60px'}}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Accordion open={open} toggle={toggle} className="mb-5">
                {categorias.map((cat, idx) => (
                  <AccordionItem key={cat.nombre}>
                    <AccordionHeader targetId={cat.nombre} style={{fontWeight: 700, fontSize: '1.18rem'}}>
                      <FeatherIcon icon={cat.icon} size={20} className="me-2 text-success" />
                      {cat.nombre}
                    </AccordionHeader>
                    <AccordionBody accordionId={cat.nombre}>
                      {cat.nombre === '1. RIA' ? (
                        <div className="d-flex flex-column flex-md-row gap-4 align-items-stretch">
                          <div style={{ minWidth: 280, flex: 1 }}>
                            <DocumentViewer
                              pdfPath="/Documentation/1.RIA/1.Herramientas_de_Sostenibilidad_y_PML.pdf"
                              title="Herramientas de Sostenibilidad y PML"
                              description="Manual y guía de herramientas para la gestión sostenible y Producción Más Limpia."
                              icon="file-text"
                              buttonText="Ver PDF"
                              cardStyle="compact"
                            />
                          </div>
                          <div style={{ minWidth: 220, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="card shadow border-0 document-card" style={{ width: '100%', minWidth: 220, borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                              <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>Formato RIA (Excel)</div>
                              <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>Plantilla editable para diligenciar el RIA.</div>
                              <a
                                href={process.env.PUBLIC_URL + '/Documentation/1.RIA/Formato_RIA.xlsx'}
                                download
                                className="btn btn-outline-success"
                                style={{ minWidth: 140, fontWeight: 600 }}
                              >
                                <FeatherIcon icon="download" size={16} className="me-1" /> Descargar Excel
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : cat.nombre === '2. Ciclo de Vida' ? (
                        <div className="row g-4">
                          {/* PDFs */}
                          {[{
                            file: '1.1Ejercicio_Ciclo_de_vida.pdf',
                            title: 'Ejercicio Ciclo de Vida',
                            desc: 'Ejercicio práctico sobre el análisis del ciclo de vida.'
                          }, {
                            file: '1.EL_contexto_del_analisis_del_ciclo_de_vida.pdf',
                            title: 'El Contexto del Análisis del Ciclo de Vida',
                            desc: 'Documento sobre el contexto y la importancia del análisis del ciclo de vida.'
                          }, {
                            file: '2.1Ejercicio_analisis_ciclo_de_vida.pdf',
                            title: 'Ejercicio Análisis Ciclo de Vida',
                            desc: 'Ejercicio de análisis aplicado al ciclo de vida.'
                          }, {
                            file: '2.Metodologia_del_análisis_del_ciclo_de_vida.pdf',
                            title: 'Metodología del Análisis del Ciclo de Vida',
                            desc: 'Metodología detallada para el análisis del ciclo de vida.'
                          }, {
                            file: '3.1Ejercicio_Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf',
                            title: 'Ejercicio Datos Usados en el Análisis de Ciclo de Vida',
                            desc: 'Ejercicio sobre los datos utilizados en el análisis de ciclo de vida.'
                          }, {
                            file: '3.Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf',
                            title: 'Datos Usados en el Análisis de Ciclo de Vida',
                            desc: 'Datos empleados en el análisis de ciclo de vida.'
                          }, {
                            file: '4.Conceptos_clave_del_ciclo_de_vida_un_producto.pdf',
                            title: 'Conceptos Clave del Ciclo de Vida de un Producto',
                            desc: 'Conceptos fundamentales sobre el ciclo de vida de un producto.'
                          }, {
                            file: '5.Guia_herramienta_ciclo_de_vida.pdf',
                            title: 'Guía Herramienta Ciclo de Vida',
                            desc: 'Guía para el uso de la herramienta de ciclo de vida.'
                          }].map((pdf, i) => (
                            <div className="col-md-6 col-lg-4" key={pdf.file}>
                              <DocumentViewer
                                pdfPath={`/Documentation/2.Ciclo_de_Vida/${pdf.file}`}
                                title={pdf.title}
                                description={pdf.desc}
                                icon="file-text"
                                buttonText="Ver PDF"
                                cardStyle="compact"
                              />
                            </div>
                          ))}
                          {/* Excels */}
                          {[{
                            file: 'ciclo_de_vida_Proceso_Productivo.xlsx',
                            title: 'Ciclo de Vida - Proceso Productivo',
                            desc: 'Plantilla Excel para el análisis de ciclo de vida de un proceso productivo.'
                          }, {
                            file: 'Ciclo_de_vida_Producto_o_Servico_especifico.xlsx',
                            title: 'Ciclo de Vida - Producto o Servicio Específico',
                            desc: 'Plantilla Excel para el análisis de ciclo de vida de un producto o servicio.'
                          }].map((excel, i) => (
                            <div className="col-md-6 col-lg-4" key={excel.file}>
                              <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{excel.title}</div>
                                <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{excel.desc}</div>
                                <a
                                  href={process.env.PUBLIC_URL + `/Documentation/2.Ciclo_de_Vida/${excel.file}`}
                                  download
                                  className="btn btn-outline-success"
                                  style={{ minWidth: 140, fontWeight: 600 }}
                                >
                                  <FeatherIcon icon="download" size={16} className="me-1" /> Descargar Excel
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#888', fontStyle: 'italic', padding: '12px 0' }}>
                          (Aquí aparecerán los archivos de la carpeta <b>{cat.nombre}</b>)
                        </div>
                      )}
                    </AccordionBody>
                  </AccordionItem>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default DocumentosPage;
