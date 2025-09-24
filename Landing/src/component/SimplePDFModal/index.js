import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';

const SimplePDFModal = ({ isOpen, toggle, pdfPath, title }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const downloadPDF = () => {
    // Usar ruta absoluta que funciona tanto en dev como en producción
    const fullUrl = `${process.env.PUBLIC_URL}${pdfPath}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetState = () => {
    setLoading(true);
  };

  const handleToggle = () => {
    if (isOpen) {
      resetState();
    }
    toggle();
  };

  // URL completa del PDF usando PUBLIC_URL para compatibilidad dev/prod
  const fullPdfUrl = `${process.env.PUBLIC_URL}${pdfPath}`;
  
  // Usar Mozilla PDF.js viewer con URL completa
  const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + fullPdfUrl)}`;

  return (
    <Modal isOpen={isOpen} toggle={handleToggle} size="xl">
      <ModalHeader toggle={handleToggle}>
        <div className="d-flex align-items-center">
          <FeatherIcon icon="file-text" size={20} className="me-2 text-mundo-verde" />
          {title}
        </div>
      </ModalHeader>

      <ModalBody className="p-0">
        <div className="pdf-content position-relative" style={{ height: '70vh', background: '#f8f9fa' }}>
          {loading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 10 }}>
              <Spinner color="success" size="lg" />
              <p className="mt-3 text-muted">Cargando documento...</p>
            </div>
          )}

          <iframe
            src={pdfJsUrl}
            width="100%"
            height="100%"
            style={{ 
              border: 'none',
              display: loading ? 'none' : 'block'
            }}
            title={title}
            onLoad={handleLoad}
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex justify-content-between w-100">
          <div>
            <small className="text-muted">
              📄 {title}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button color="info" size="sm" onClick={() => window.open(fullPdfUrl, '_blank')}>
              <FeatherIcon icon="external-link" size={14} className="me-1" />
              Nueva Ventana
            </Button>
            <Button color="success" size="sm" onClick={downloadPDF}>
              <FeatherIcon icon="download" size={14} className="me-1" />
              Descargar
            </Button>
            <Button color="secondary" onClick={handleToggle}>
              <FeatherIcon icon="x" size={14} className="me-1" />
              Cerrar
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default SimplePDFModal;