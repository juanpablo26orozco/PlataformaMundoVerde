import React, { useState } from 'react';
import { Button } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import SimplePDFModal from '../SimplePDFModal';

const PDFViewer = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Ruta específica para el primer documento
  const pdfPath = '/Concepts_docs/1.Los_Problemas_medio_ambientales.pdf';
  const title = 'Los Problemas medio ambientales';

  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

  const downloadPDF = () => {
    // Usar la URL del servidor PDF para descarga
    const pdfServerUrl = `http://localhost:3001${pdfPath}`;
    const link = document.createElement('a');
    link.href = pdfServerUrl;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPDFInNewTab = () => {
    // Usar la URL del servidor PDF directamente
    const pdfServerUrl = `http://localhost:3001${pdfPath}`;
    window.open(pdfServerUrl, '_blank');
  };

  return (
    <div className="pdf-viewer p-3 border rounded shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="d-flex align-items-center mb-3">
        <FeatherIcon icon="file-text" size={24} className="me-2 text-mundo-verde" />
        <h5 className="mb-0">Vista Previa PDF</h5>
      </div>
      
      <p className="text-muted mb-3">
        <strong>{title}</strong>
      </p>
      
      <div className="alert alert-info border-0 small mb-3">
        <div className="d-flex align-items-center">
          <FeatherIcon icon="info" size={16} className="me-2" />
          <div>
            <strong>Vista previa disponible</strong><br/>
            Puedes ver, descargar o abrir este documento en una nueva ventana
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="d-flex flex-wrap gap-2">
        <Button color="success" onClick={togglePreview}>
          <FeatherIcon icon="eye" size={16} className="me-2" />
          Ver Vista Previa
        </Button>
        
        <Button color="primary" outline onClick={openPDFInNewTab}>
          <FeatherIcon icon="external-link" size={16} className="me-2" />
          Abrir en Nueva Ventana
        </Button>
        
        <Button color="secondary" outline onClick={downloadPDF}>
          <FeatherIcon icon="download" size={16} className="me-2" />
          Descargar
        </Button>
      </div>

      {/* Modal de vista previa */}
      <SimplePDFModal
        isOpen={isPreviewOpen}
        toggle={togglePreview}
        pdfPath={pdfPath}
        title={title}
      />
    </div>
  );
};

export default PDFViewer;