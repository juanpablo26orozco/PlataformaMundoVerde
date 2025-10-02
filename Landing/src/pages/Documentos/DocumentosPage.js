import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import Footer from '../../component/Footer/Footer';
import FeatherIcon from 'feather-icons-react';
import DocumentViewer from '../../component/DocumentViewer';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Estructura base de carpetas/categorías
const getCategorias = (t) => [
  { nombre: t('documentos.categories.ria'), key: 'ria', icon: 'folder' },
  { nombre: t('documentos.categories.lifecycle'), key: 'lifecycle', icon: 'folder' },
  { nombre: t('documentos.categories.production'), key: 'production', icon: 'folder' },
  { nombre: t('documentos.categories.circular'), key: 'circular', icon: 'folder' },
  { nombre: t('documentos.categories.costs'), key: 'costs', icon: 'folder' },
  { nombre: t('documentos.categories.other'), key: 'other', icon: 'folder' },
];

const getSeccionesSidebar = (t) => [
  { id: 'cat-0', label: t('documentos.sidebar.ria'), icon: 'folder' },
  { id: 'cat-1', label: t('documentos.sidebar.lifecycle'), icon: 'folder' },
  { id: 'cat-2', label: t('documentos.sidebar.production'), icon: 'folder' },
  { id: 'cat-3', label: t('documentos.sidebar.circular'), icon: 'folder' },
  { id: 'cat-4', label: t('documentos.sidebar.costs'), icon: 'folder' },
  { id: 'cat-5', label: t('documentos.sidebar.other'), icon: 'folder' },
];

// 1. Cambia DocumentosSidebarNav para recibir props 'open' y 'setOpen'
const DocumentosSidebarNav = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const categorias = getCategorias(t);
  const seccionesSidebar = getSeccionesSidebar(t);
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
  }, [seccionesSidebar]);

  // Nueva función: scroll y abrir carpeta
  const handleNavClick = (id, label) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth',
      });
    }
    setOpen(label); // Abre el Accordion de la carpeta
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 180,
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
      {seccionesSidebar.map((sec, idx) => (
        idx === 0 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[0].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-0');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : idx === 1 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[1].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-1');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : idx === 2 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[2].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-2');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : idx === 3 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[3].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-3');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : idx === 4 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[4].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-4');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : idx === 5 ? (
          <button
            key={sec.id}
            onClick={() => {
              setOpen(categorias[5].nombre);
              setTimeout(() => {
                const el = document.getElementById('cat-5');
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth',
                  });
                }
              }, 100);
            }}
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
        ) : (
          <button
            key={sec.id}
            onClick={() => handleNavClick(sec.id, sec.label)}
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
        )
      ))}
    </nav>
  );
};

const DocumentosPage = () => {
  const { t } = useTranslation();
  const categorias = getCategorias(t);
  const sectionIdToCategoria = {
    'cat-0': categorias[0].nombre,
    'cat-1': categorias[1].nombre,
    'cat-2': categorias[2].nombre,
    'cat-3': categorias[3].nombre,
    'cat-4': categorias[4].nombre,
    'cat-5': categorias[5].nombre,
  };
  const location = useLocation();
  const [open, setOpen] = useState('');
  const toggle = id => setOpen(open === id ? '' : id);

  useEffect(() => {
    if (location.state && location.state.sectionId) {
      const categoria = sectionIdToCategoria[location.state.sectionId];
      if (categoria) {
        setOpen(categoria);
        // Opcional: scroll al marcador de la sección
        const el = document.getElementById(location.state.sectionId);
        if (el) {
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [location.state, sectionIdToCategoria]);

  return (
    <React.Fragment>
      <DocumentosSidebarNav open={open} setOpen={setOpen} />
      <section className="section" style={{background: '#4CAF50', minHeight: '420px', paddingTop: '120px', paddingBottom: '80px'}}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="fw-bold mb-3">{t('documentos.hero.title')}</h1>
              <p className="lead mb-4">
                {t('documentos.hero.description')}
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
                                title={t('documentos.ria.doc1.title')}
                                description={t('documentos.ria.doc1.desc')}
                                icon="file-text"
                                buttonText={t('documentos.buttons.viewPdf')}
                                cardStyle="compact"
                              />
                            </div>
                            <div style={{ minWidth: 220, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div className="card shadow border-0 document-card" style={{ width: '100%', minWidth: 220, borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t('documentos.ria.format.title')}</div>
                                <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t('documentos.ria.format.desc')}</div>
                                <a
                                  href={process.env.PUBLIC_URL + '/Documentation/1.RIA/Formato_RIA.xlsx'}
                                  download
                                  className="btn btn-outline-success"
                                  style={{ minWidth: 140, fontWeight: 600 }}
                                >
                                  <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : idx === 1 ? (
                          <div className="row g-4">
                            {/* PDFs */}
                            {[{
                              file: '1.EL_contexto_del_analisis_del_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc1.title',
                              descKey: 'documentos.lifecycle.doc1.desc'
                            }, {
                              file: '1.1Ejercicio_Ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc1_1.title',
                              descKey: 'documentos.lifecycle.doc1_1.desc'
                            }, {
                              file: '2.Metodologia_del_análisis_del_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc2.title',
                              descKey: 'documentos.lifecycle.doc2.desc'
                            }, {
                              file: '2.1Ejercicio_analisis_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc2_1.title',
                              descKey: 'documentos.lifecycle.doc2_1.desc'
                            }, {
                              file: '3.Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc3.title',
                              descKey: 'documentos.lifecycle.doc3.desc'
                              
                            }, {
                              file: '3.1Ejercicio_Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc3_1.title',
                              descKey: 'documentos.lifecycle.doc3_1.desc'
                            }, {
                              file: '4.Conceptos_clave_del_ciclo_de_vida_un_producto.pdf',
                              titleKey: 'documentos.lifecycle.doc4.title',
                              descKey: 'documentos.lifecycle.doc4.desc'
                            }, {
                              file: '5.Guia_herramienta_ciclo_de_vida.pdf',
                              titleKey: 'documentos.lifecycle.doc5.title',
                              descKey: 'documentos.lifecycle.doc5.desc'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/2.Ciclo_de_Vida/${pdf.file}`}
                                  title={t(pdf.titleKey)}
                                  description={t(pdf.descKey)}
                                  icon="file-text"
                                  buttonText={t('documentos.buttons.viewPdf')}
                                  cardStyle="compact"
                                />
                              </div>
                            ))}
                            {/* Excels */}
                            {[{
                              file: 'ciclo_de_vida_Proceso_Productivo.xlsx',
                              titleKey: 'documentos.lifecycle.excel1.title',
                              descKey: 'documentos.lifecycle.excel1.desc'
                            }, {
                              file: 'Ciclo_de_vida_Producto_o_Servico_especifico.xlsx',
                              titleKey: 'documentos.lifecycle.excel2.title',
                              descKey: 'documentos.lifecycle.excel2.desc'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t(excel.titleKey)}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t(excel.descKey)}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/2.Ciclo_de_Vida/${excel.file}`}
                                    download
                                    className="btn btn-outline-success"
                                    style={{ minWidth: 140, fontWeight: 600 }}
                                  >
                                    <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
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
                              titleKey: 'documentos.production.doc1.title',
                              descKey: 'documentos.production.doc1.desc'
                            }, {
                              file: '2.Evaluacion_Operativa_de_la_organizacion.pdf',
                              titleKey: 'documentos.production.doc2.title',
                              descKey: 'documentos.production.doc2.desc'
                            }, {
                              file: '2.1Guia_para_el_uso_de_la_herramientas_de_Evaluacion_Operativa.pdf',
                              titleKey: 'documentos.production.doc2_1.title',
                              descKey: 'documentos.production.doc2_1.desc'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/3.Criterios_de_PCC_y_CS/${pdf.file}`}
                                  title={t(pdf.titleKey)}
                                  description={t(pdf.descKey)}
                                  icon="file-text"
                                  buttonText={t('documentos.buttons.viewPdf')}
                                  cardStyle="compact"
                                />
                              </div>
                            ))}
                            {/* Excels */}
                            {[{
                              file: '1.1.Herramienta_de_PCC_y_CS_de_una_organizacion.xlsx',
                              titleKey: 'documentos.production.excel1.title',
                              descKey: 'documentos.production.excel1.desc'
                            }, {
                              file: '2.1.1Evaluacion_Operativa_de_la_organizacion.xlsx',
                              titleKey: 'documentos.production.excel2.title',
                              descKey: 'documentos.production.excel2.desc'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t(excel.titleKey)}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t(excel.descKey)}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/3.Criterios_de_PCC_y_CS/${excel.file}`}
                                    download
                                    className="btn btn-outline-success"
                                    style={{ minWidth: 140, fontWeight: 600 }}
                                  >
                                    <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
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
                              titleKey: 'documentos.circular.doc1.title',
                              descKey: 'documentos.circular.doc1.desc'
                            }, {
                              file: '2.Gestion_de_residuos_Economia_circular.pdf',
                              titleKey: 'documentos.circular.doc2.title',
                              descKey: 'documentos.circular.doc2.desc'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/4.Gestion_de_subproductos_EC/${pdf.file}`}
                                  title={t(pdf.titleKey)}
                                  description={t(pdf.descKey)}
                                  icon="file-text"
                                  buttonText={t('documentos.buttons.viewPdf')}
                                  cardStyle="compact"
                                />
                              </div>
                            ))}
                            {/* Excel */}
                            <div className="col-md-6 col-lg-4">
                              <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t('documentos.circular.excel1.title')}</div>
                                <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t('documentos.circular.excel1.desc')}</div>
                                <a
                                  href={process.env.PUBLIC_URL + '/Documentation/4.Gestion_de_subproductos_EC/1.1 Matriz Valoración Economía Circular.xlsx'}
                                  download
                                  className="btn btn-outline-success"
                                  style={{ minWidth: 140, fontWeight: 600 }}
                                >
                                  <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : idx === 4 ? (
                          <div className="row g-4">
                            {/* PDFs */}
                            {[{
                              file: '1.Costos_de_ineficiencia.pdf',
                              titleKey: 'documentos.costs.doc1.title',
                              descKey: 'documentos.costs.doc1.desc'
                            }, {
                              file: '2.Analisis_de_CI.pdf',
                              titleKey: 'documentos.costs.doc2.title',
                              descKey: 'documentos.costs.doc2.desc'
                            }, {
                              file: '3.PARETO_Instructivo.pdf',
                              titleKey: 'documentos.costs.doc3.title',
                              descKey: 'documentos.costs.doc3.desc'
                            }].map((pdf, i) => (
                              <div className="col-md-6 col-lg-4" key={pdf.file}>
                                <DocumentViewer
                                  pdfPath={`/Documentation/5.Costos_de_Ineficiencia_CI/${pdf.file}`}
                                  title={t(pdf.titleKey)}
                                  description={t(pdf.descKey)}
                                  icon="file-text"
                                  buttonText={t('documentos.buttons.viewPdf')}
                                  cardStyle="compact"
                                />
                              </div>
                            ))}
                            {/* Excels */}
                            {[{
                              file: '1.1.Estimacion_de_Costos_de_Ineficiencia.xlsx',
                              titleKey: 'documentos.costs.excel1.title',
                              descKey: 'documentos.costs.excel1.desc'
                            }, {
                              file: '2.1.Analisis_de_CI.xlsx',
                              titleKey: 'documentos.costs.excel2.title',
                              descKey: 'documentos.costs.excel2.desc'
                            }, {
                              file: '3.PARETO_CI.xlsx',
                              titleKey: 'documentos.costs.excel3.title',
                              descKey: 'documentos.costs.excel3.desc'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t(excel.titleKey)}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t(excel.descKey)}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/5.Costos_de_Ineficiencia_CI/${excel.file}`}
                                    download
                                    className="btn btn-outline-success"
                                    style={{ minWidth: 140, fontWeight: 600 }}
                                  >
                                    <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
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
                              titleKey: 'documentos.other.excel1.title',
                              descKey: 'documentos.other.excel1.desc'
                            }, {
                              file: '2.Cuestionario_de_Sostenibilidad_Organizaciones.xls',
                              titleKey: 'documentos.other.excel2.title',
                              descKey: 'documentos.other.excel2.desc'
                            }, {
                              file: '3.Formato_diagnostico_electricidad.xlsx',
                              titleKey: 'documentos.other.excel3.title',
                              descKey: 'documentos.other.excel3.desc'
                            }, {
                              file: '4.Formato_diagnostico_Combustibles.xlsx',
                              titleKey: 'documentos.other.excel4.title',
                              descKey: 'documentos.other.excel4.desc'
                            }, {
                              file: '5.formato_diagnostico_agua.xlsx',
                              titleKey: 'documentos.other.excel5.title',
                              descKey: 'documentos.other.excel5.desc'
                            }].map((excel, i) => (
                              <div className="col-md-6 col-lg-4" key={excel.file}>
                                <div className="card shadow border-0 document-card" style={{ borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <FeatherIcon icon="file" size={28} className="mb-2 text-success" />
                                  <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'center' }}>{t(excel.titleKey)}</div>
                                  <div className="text-muted mb-3" style={{ fontSize: '0.98rem', textAlign: 'center' }}>{t(excel.descKey)}</div>
                                  <a
                                    href={process.env.PUBLIC_URL + `/Documentation/6.Otras_Herramientas/${excel.file}`}
                                    download
                                    className="btn btn-outline-success"
                                    style={{ minWidth: 140, fontWeight: 600 }}
                                  >
                                    <FeatherIcon icon="download" size={16} className="me-1" /> {t('documentos.buttons.downloadExcel')}
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
