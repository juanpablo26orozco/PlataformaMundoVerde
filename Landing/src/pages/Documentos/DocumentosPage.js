import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import Footer from '../../component/Footer/Footer';
import FeatherIcon from 'feather-icons-react';
import DocumentViewer from '../../component/DocumentViewer';

// Estructura base de carpetas/categorías
const categorias = [
  { nombre: '1. Revisión Inicial Ambiental - RIA', icon: 'folder' },
  { nombre: '2. Ciclo de Vida', icon: 'folder' },
  { nombre: '3. Criterios de Producción y consumo sostenible', icon: 'folder' },
  { nombre: '4. Gestión de subproductos Economía Circular', icon: 'folder' },
  { nombre: '5. Costos de Ineficiencia - CI', icon: 'folder' },
  { nombre: '6. Otras Herramientas', icon: 'folder' },
];

const seccionesSidebar = [
  { id: 'cat-0', label: 'Revisión Inicial Ambiental', icon: 'folder' },
  { id: 'cat-1', label: 'Ciclo de Vida', icon: 'folder' },
  { id: 'cat-2', label: 'Criterios de Producción y Consumo Sostenible', icon: 'folder' },
  { id: 'cat-3', label: 'Gestión de subproductos Economía Circular', icon: 'folder' },
  { id: 'cat-4', label: 'Costos de Ineficiencia', icon: 'folder' },
  { id: 'cat-5', label: 'Otras Herramientas', icon: 'folder' },
];

const DocumentosSidebarNav = () => {
  const [active, setActive] = useState(seccionesSidebar[0].id);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const theme = document.body.getAttribute('data-bs-theme');
      const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDark(isDark);
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-bs-theme'] });
    return () => {
      window.removeEventListener('storage', checkDark);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let found = seccionesSidebar[0].id;
      for (const sec of seccionesSidebar) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = sec.id;
        }
      }
      setActive(found);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 110,
        right: 32,
        zIndex: 1000,
        background: dark ? '#1a232a' : '#f6fff7',
        borderRadius: 16,
        boxShadow: dark ? '0 2px 8px #111b22cc' : '0 2px 6px #b7e4c7cc',
        padding: '16px 10px',
        minWidth: 64,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        border: dark ? '1.5px solid #26323a' : '1.5px solid #e0f2f1',
      }}
      className="d-none d-md-flex"
      aria-label="Navegación de categorías"
    >
      {seccionesSidebar.map(sec => (
        <button
          key={sec.id}
          onClick={() => scrollTo(sec.id)}
          style={{
            background: active === sec.id
              ? (dark ? '#232f38' : '#e0f2f1')
              : (dark ? '#1a232a' : '#f6fff7'),
            color: dark
              ? (active === sec.id ? '#b7e4c7' : '#b7e4c7cc')
              : (active === sec.id ? '#1b5e20' : '#388e3c'),
            border: active === sec.id
              ? (dark ? '2px solid #b7e4c7' : '2px solid #43a047')
              : (dark ? '1.2px solid #26323a' : '1.2px solid #e0f2f1'),
            borderRadius: 12,
            width: 170,
            height: 70,
            fontWeight: 600,
            fontSize: 15,
            boxShadow: active === sec.id
              ? (dark ? '0 1px 4px #111b22cc' : '0 1px 4px #b7e4c7')
              : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.18s',
            margin: 0,
          }}
          aria-current={active === sec.id ? 'section' : undefined}
          aria-label={sec.label}
        >
          <FeatherIcon icon={sec.icon} size={22} style={{marginBottom:4, color: dark ? (active === sec.id ? '#b7e4c7' : '#b7e4c7cc') : undefined}} />
          <span style={{fontSize:13, fontWeight:600}}>{sec.label}</span>
        </button>
      ))}
    </nav>
  );
};

const DocumentosPage = () => {
  const [open, setOpen] = useState('');
  const toggle = id => setOpen(open === id ? '' : id);

  return (
    <React.Fragment>
      <DocumentosSidebarNav />
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
                  <div id={`cat-${idx}`}> {/* Marcador para scroll */}
                    <AccordionItem key={cat.nombre}>
                      <AccordionHeader targetId={cat.nombre} style={{fontWeight: 700, fontSize: '1.18rem'}}>
                        <FeatherIcon icon={cat.icon} size={20} className="me-2 text-success" />
                        {cat.nombre}
                      </AccordionHeader>
                      <AccordionBody accordionId={cat.nombre}>
                        {idx === 0 ? (
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
                        ) : idx === 1 ? (
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
                        ) : idx === 2 ? (
                          <div className="row g-4">
                            {/* PDFs */}
                            {[{
                              file: '1.Criterios_de_PCC_y_CS.pdf',
                              title: 'Criterios de PCC y CS',
                              desc: 'Documento con los criterios de Producción más limpia y Consumo Sostenible.'
                            }, {
                              file: '2.Evaluacion_Operativa_de_la_organizacion.pdf',
                              title: 'Evaluación Operativa de la Organización',
                              desc: 'Documento de evaluación operativa para organizaciones.'
                            }, {
                              file: '2.1Guia_para_el_uso_de_la_herramientas_de_Evaluacion_Operativa.pdf',
                              title: 'Guía para el Uso de la Herramienta de Evaluación Operativa',
                              desc: 'Guía de uso para la herramienta de evaluación operativa.'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/3.Criterios_de_PCC_y_CS/${pdf.file}`}
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
                              file: '1.1.Herramienta_de_PCC_y_CS_de_una_organizacion.xlsx',
                              title: 'Herramienta de PCC y CS de una Organización',
                              desc: 'Plantilla Excel para aplicar criterios de PCC y CS.'
                            }, {
                              file: '2.1.1Evaluacion_Operativa_de_la_organizacion.xlsx',
                              title: 'Evaluación Operativa de la Organización (Excel)',
                              desc: 'Plantilla Excel para la evaluación operativa.'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{excel.title}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{excel.desc}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/3.Criterios_de_PCC_y_CS/${excel.file}`}
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
                        ) : idx === 3 ? (
                          <div className="row g-4">
                            {/* PDFs */}
                            {[{
                              file: '1.Instructivo_para_diligenciar_Matriz_de_Valoracion_Economia_Circular.pdf',
                              title: 'Instructivo para diligenciar Matriz de Valoración Economía Circular',
                              desc: 'Guía para completar la matriz de valoración de economía circular.'
                            }, {
                              file: '2.Gestion_de_residuos_Economia_circular.pdf',
                              title: 'Gestión de residuos Economía Circular',
                              desc: 'Documento sobre la gestión de residuos en el contexto de economía circular.'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/4.Gestion_de_subproductos_EC/${pdf.file}`}
                                  title={pdf.title}
                                  description={pdf.desc}
                                  icon="file-text"
                                  buttonText="Ver PDF"
                                  cardStyle="compact"
                                />
                              </div>
                            ))}
                            {/* Excel */}
                            <div className="col-md-6 col-lg-4">
                              <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>Matriz Valoración Economía Circular (Excel)</div>
                                <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>Plantilla Excel para valoración de economía circular.</div>
                                <a
                                  href={process.env.PUBLIC_URL + '/Documentation/4.Gestion_de_subproductos_EC/1.1 Matriz Valoración Economía Circular.xlsx'}
                                  download
                                  className="btn btn-outline-success"
                                  style={{ minWidth: 140, fontWeight: 600 }}
                                >
                                  <FeatherIcon icon="download" size={16} className="me-1" /> Descargar Excel
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : idx === 4 ? (
                          <div className="row g-4">
                            {/* PDFs */}
                            {[{
                              file: '1.Costos_de_ineficiencia.pdf',
                              title: 'Costos de Ineficiencia',
                              desc: 'Documento sobre la estimación y análisis de costos de ineficiencia.'
                            }, {
                              file: '2.Analisis_de_CI.pdf',
                              title: 'Análisis de CI',
                              desc: 'Documento de análisis de costos de ineficiencia.'
                            }, {
                              file: '3.PARETO_Instructivo.pdf',
                              title: 'PARETO Instructivo',
                              desc: 'Instructivo para el análisis PARETO de costos de ineficiencia.'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/5.Costos_de_Ineficiencia_CI/${pdf.file}`}
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
                              file: '1.1.Estimacion_de_Costos_de_Ineficiencia.xlsx',
                              title: 'Estimación de Costos de Ineficiencia (Excel)',
                              desc: 'Plantilla Excel para estimar costos de ineficiencia.'
                            }, {
                              file: '2.1.Analisis_de_CI.xlsx',
                              title: 'Análisis de CI (Excel)',
                              desc: 'Plantilla Excel para análisis de costos de ineficiencia.'
                            }, {
                              file: '3.PARETO_CI.xlsx',
                              title: 'PARETO CI (Excel)',
                              desc: 'Plantilla Excel para análisis PARETO de costos de ineficiencia.'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{excel.title}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{excel.desc}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/5.Costos_de_Ineficiencia_CI/${excel.file}`}
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
                        ) : idx === 5 ? (
                          <div className="row g-4">
                            {/* Excels */}
                            {[{
                              file: '1.Autodiagnostico de sostenibilidad_SuperSociedades_GRI.xlsx',
                              title: 'Autodiagnóstico de Sostenibilidad SuperSociedades (Excel)',
                              desc: 'Plantilla Excel para autodiagnóstico de sostenibilidad según GRI.'
                            }, {
                              file: '2.Cuestionario_de_Sostenibilidad_Organizaciones.xls',
                              title: 'Cuestionario de Sostenibilidad Organizaciones (Excel)',
                              desc: 'Cuestionario Excel para evaluar la sostenibilidad en organizaciones.'
                            }, {
                              file: '3.Formato_diagnostico_electricidad.xlsx',
                              title: 'Formato Diagnóstico Electricidad (Excel)',
                              desc: 'Plantilla Excel para diagnóstico de consumo eléctrico.'
                            }, {
                              file: '4.Formato_diagnostico_Combustibles.xlsx',
                              title: 'Formato Diagnóstico Combustibles (Excel)',
                              desc: 'Plantilla Excel para diagnóstico de consumo de combustibles.'
                            }, {
                              file: '5.formato_diagnostico_agua.xlsx',
                              title: 'Formato Diagnóstico Agua (Excel)',
                              desc: 'Plantilla Excel para diagnóstico de consumo de agua.'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{excel.title}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{excel.desc}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/6.Otras_Herramientas/${excel.file}`}
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
                  </div>
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
