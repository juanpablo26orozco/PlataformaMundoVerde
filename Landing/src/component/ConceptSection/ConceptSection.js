import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import SimplePDFViewer from '../SimplePDFViewer';

const ConceptSection = ({ 
  id,
  title,
  icon,
  description,
  pdfPath,
  pdfTitle,
  children,
  bgClass = "",
  summary = []
}) => {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const togglePdfModal = () => setPdfModalOpen(!pdfModalOpen);

  return (
    <section className={`section ${bgClass}`} id={id}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="section-title text-center mb-5">
              <h2 className="fw-bold text-mundo-verde">
                <FeatherIcon icon={icon} className="me-2" />
                {title}
              </h2>
              <div className="title-border-simple"></div>
              {description && (
                <p className="text-muted mt-4">{description}</p>
              )}
            </div>

            <Row className="align-items-start">
              <Col lg={8} className="mb-4">
                {children}
              </Col>

              <Col lg={4} className="mb-4">
                <Card className="shadow border-0 h-100">
                  <CardBody className="p-4">
                    <div className="text-center mb-3">
                      <h5 className="text-mundo-verde mb-3">
                        <FeatherIcon icon="file-text" size={20} className="me-2" />
                        Documento de Referencia
                      </h5>
                    </div>

                    <div className="mb-3">
                      <SimplePDFViewer
                        pdfPath={pdfPath}
                        title={pdfTitle}
                        isOpen={pdfModalOpen}
                        toggle={togglePdfModal}
                        showPreview={true}
                        previewHeight={250}
                      />
                    </div>
                    
                    
                    

                    {summary.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-mundo-verde mb-2">Contenido del documento:</h6>
                        <ul className="list-unstyled small">
                          {summary.map((item, index) => (
                            <li key={index} className="text-muted mb-1">
                              <FeatherIcon icon="chevron-right" size={14} className="text-mundo-verde me-1" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ConceptSection;