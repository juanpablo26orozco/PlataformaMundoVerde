

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Footer from '../../component/Footer/Footer';
import '../../assets/scss/_mundo-verde.scss';

// Documentos reales en la carpeta Documentation
const documentos = [
  {
    nombre: 'Infografía Conceptos Básicos Huella de Carbono',
    resumen: 'Resumen visual de los conceptos fundamentales sobre la huella de carbono y su importancia.',
    archivo: '/PlataformaMundoVerde/Documentation/1. Infografía Conceptos Básicos Huella de Carbono.pdf',
  },
  {
    nombre: 'Infografía Alcances y Limites de la Medición de Huella de Carbono',
    resumen: 'Explicación de los diferentes alcances y límites en la medición de la huella de carbono.',
    archivo: '/PlataformaMundoVerde/Documentation/3. Infografía Alcances y Limites de la Medición de Huella de Carbono.pdf',
  },
  {
    nombre: 'Documento factores de Emisión',
    resumen: 'Documento detallado sobre los factores de emisión utilizados en los cálculos de huella.',
    archivo: '/PlataformaMundoVerde/Documentation/5. Documento factores de Emisión.pdf',
  },
  {
    nombre: 'Infografía Acciones para reducir la huella de CO2',
    resumen: 'Acciones recomendadas para reducir la huella de carbono en organizaciones y personas.',
    archivo: '/PlataformaMundoVerde/Documentation/7. Infografía Acciones para reducir la huella de CO2.pdf',
  },
  {
    nombre: 'Infografía Elaboración de reportes de medición',
    resumen: 'Guía visual para la elaboración de reportes de medición de huella de carbono.',
    archivo: '/PlataformaMundoVerde/Documentation/8. Infografía Elaboración de reportes de medición.pdf',
  },
];


const DocumentosPage = () => {
  return (
    <React.Fragment>
      <section className="section" style={{background: '#4CAF50', minHeight: '420px', paddingTop: '120px', paddingBottom: '80px'}}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="fw-bold mb-3">Herramientas y Documentos</h1>
              <p className="lead mb-4">
                Accede y descarga documentos clave sobre huella de carbono. Cada recurso incluye un breve resumen para ayudarte a identificar el contenido más relevante para ti.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section" style={{background: '#f8f9fa', paddingTop: '80px'}}>
        <Container>
          <Row className="justify-content-center">
            {documentos.map((doc, idx) => (
              <Col lg={4} md={6} key={idx} className="mb-4">
                <div className="card h-100 shadow border-0" style={{borderRadius: '12px'}}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-dark mb-3" style={{color: '#4CAF50'}}>{doc.nombre}</h5>
                    <p className="text-muted mb-4">{doc.resumen}</p>
                    <a href={doc.archivo} target="_blank" rel="noopener noreferrer" 
                       className="btn btn-success" 
                       style={{backgroundColor: '#4CAF50', borderColor: '#4CAF50', borderRadius: '8px'}}>
                      Descargar
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default DocumentosPage;
