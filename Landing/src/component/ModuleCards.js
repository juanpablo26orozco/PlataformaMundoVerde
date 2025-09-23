import React from "react";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const modules = [
  {
    title: "Conceptos Claves",
    description: "Aprende los fundamentos esenciales de la huella de carbono, alcances, factores de emisión y acciones para reducir el impacto ambiental.",
    icon: "book-open",
    to: "/huella-carbono"
  },
  {
    title: "Calculadora",
    description: "Calcula la huella de carbono de tu organización de manera sencilla y visualiza resultados para tomar mejores decisiones.",
    icon: "activity",
    to: "/#calculadora"
  },
  {
    title: "Herramientas",
    description: "Accede a formatos, instructivos y recursos descargables para la gestión y reporte de sostenibilidad.",
    icon: "file-text",
    to: "/documentos"
  },
  {
    title: "Autodiagnóstico de sostenibilidad ambiental",
    description: "Descarga herramientas y realiza autodiagnósticos para impulsar la sostenibilidad en tu empresa.",
    icon: "check-circle",
    to: "/autogestion"
  }
];




const ModuleCards = () => (
  <section className="section" id="modules" style={{background: '#fff', padding: '2.5rem 0 2.5rem 0'}}>
    <div className="container">
      <Row className="justify-content-center mb-5">
        <Col lg={8} className="text-center">
          <h2 className="fw-bold text-mundo-verde">Explora los 5 módulos principales</h2>
          <p className="text-muted">
            Navega por los módulos clave de la plataforma Mundo Verde y accede a recursos, herramientas y conocimientos para impulsar la sostenibilidad en tu organización.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {modules.map((mod, idx) => (
          <Col key={idx} lg={3} md={6} sm={12} className="mb-3 d-flex align-items-stretch">
            <Link to={mod.to} className="text-decoration-none w-100">
              <div
                className="service-box text-center px-3 py-3 position-relative card-mundo-verde module-card-hover"
                style={{
                  cursor: 'pointer',
                  minHeight: 160,
                  height: '160px',
                  maxWidth: '100%',
                  width: '100%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}
              >
                <div className="icon-mono service-icon me-3" style={{flexShrink: 0, display: 'flex', alignItems: 'center'}}>
                  <i>
                    <FeatherIcon icon={mod.icon} className="module-card-icon text-mundo-verde" size={48} />
                  </i>
                </div>
                <div className="service-box-content" style={{flex: 1}}>
                  <h4 className="mb-2 font-size-18 text-mundo-verde module-card-title" style={{fontSize: '1rem', fontWeight: '600', lineHeight: '1.2'}}>{mod.title}</h4>
                  <p className="text-muted mb-0 module-card-desc" style={{fontSize: '0.85rem', lineHeight: '1.3', color: '#666'}}>{mod.description}</p>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default ModuleCards;
