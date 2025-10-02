import React from "react";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useTranslation } from 'react-i18next';

const Modules = () => {
  const { t } = useTranslation();
  
  const modules = [
    {
      titleKey: "modules.keyConcepts.title",
      descriptionKey: "modules.keyConcepts.description",
      icon: "book-open",
      to: "/huella-carbono"
    },
    {
      titleKey: "modules.calculator.title",
      descriptionKey: "modules.calculator.description",
      icon: "activity",
      to: "/calculadora"
    },
    {
      titleKey: "modules.tools.title",
      descriptionKey: "modules.tools.description",
      icon: "file-text",
      to: "/documentos"
    },
    {
      titleKey: "modules.autodiagnosis.title",
      descriptionKey: "modules.autodiagnosis.description",
      icon: "check-circle",
      to: "/autogestion"
    }
  ];

  return (
  <section className="section" id="modules" style={{background: '#fff', padding: '2.5rem 0 2.5rem 0'}}>
    <div className="container">
      <Row className="justify-content-center mb-5">
        <Col lg={8} className="text-center">
          <h2 className="fw-bold text-mundo-verde">{t('modules.title')}</h2>
          <p className="text-muted">
            {t('modules.subtitle')}
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {modules.map((mod, idx) => (
          <Col key={idx} lg={3} md={6} sm={12} className="mb-4">
            <Link to={mod.to} className="text-decoration-none">
              <div
                className="service-box text-center position-relative module-card-hover"
                style={{
                  cursor: 'pointer',
                  minHeight: '80px',
                  height: '100%',
                  maxWidth: '440px',
                  minWidth: '280px',
                  margin: '0px auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  padding: '32px 24px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(40, 167, 69, 0.3)';
                  
                  // Cambiar colores del contenido a blanco
                  const icon = e.currentTarget.querySelector('svg');
                  const title = e.currentTarget.querySelector('.card-title');
                  const description = e.currentTarget.querySelector('.card-description');
                  
                  if (icon) icon.style.color = '#ffffff';
                  if (title) title.style.color = '#ffffff';
                  if (description) description.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  
                  // Restaurar colores originales
                  const icon = e.currentTarget.querySelector('svg');
                  const title = e.currentTarget.querySelector('.card-title');
                  const description = e.currentTarget.querySelector('.card-description');
                  
                  if (icon) icon.style.color = '#28a745';
                  if (title) title.style.color = '#28a745';
                  if (description) description.style.color = '#6c757d';
                }}
              >
                <div 
                  className="icon-container"
                  style={{
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.3s ease'
                  }}
                >
                  <FeatherIcon icon={mod.icon} style={{color: '#28a745', transition: 'color 0.3s ease'}} size={48} />
                </div>
                <div style={{textAlign: 'center'}}>
                  <h4 className="card-title mb-3" style={{
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    lineHeight: '1.3',
                    color: '#28a745',
                    marginBottom: '16px',
                    transition: 'color 0.3s ease'
                  }}>{t(mod.titleKey)}</h4>
                  <p className="card-description mb-0" style={{
                    fontSize: '0.95rem', 
                    lineHeight: '1.6', 
                    color: '#6c757d',
                    fontWeight: '400',
                    transition: 'color 0.3s ease'
                  }}>{t(mod.descriptionKey)}</p>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  </section>
  );
};

export default Modules;