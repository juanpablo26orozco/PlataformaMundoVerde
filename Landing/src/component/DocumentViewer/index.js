import React, { useState } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import SimplePDFModal from '../SimplePDFModal';

const DocumentViewer = ({ 
  pdfPath, 
  title, 
  description, 
  icon = "file-text",
  buttonText = "Ver Documento",
  downloadText = "Descargar PDF",
  newTabText = "Abrir en Nueva Ventana",
  showDescription = true,
  cardStyle = "default" // "default", "compact", "featured"
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

  const downloadPDF = () => {
    // Usar ruta absoluta que funciona tanto en dev como en producción
    const fullUrl = `${process.env.PUBLIC_URL}${pdfPath}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title.replace(/[^a-z0-9]/gi, '_') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPDFInNewTab = () => {
    // Usar ruta absoluta que funciona tanto en dev como en producción
    const fullUrl = `${process.env.PUBLIC_URL}${pdfPath}`;
    window.open(fullUrl, '_blank');
  };

  // Estilo compacto
  if (cardStyle === "compact") {
    return (
      <Card className="h-100 shadow border-0 document-card">
        <CardBody className="p-4">
          <div className="d-flex align-items-center mb-3">
            <FeatherIcon icon={icon} size={20} className="me-2 text-mundo-verde" />
            <h6 className="mb-0 text-mundo-verde fw-bold">{title}</h6>
          </div>
          
          {showDescription && description && (
            <p className="text-muted small mb-3">{description}</p>
          )}

          <div className="d-flex flex-wrap gap-2">
            <Button size="sm" color="success" onClick={togglePreview}>
              <FeatherIcon icon="eye" size={14} className="me-1" />
              Ver
            </Button>
            <Button size="sm" color="outline-primary" onClick={openPDFInNewTab}>
              <FeatherIcon icon="external-link" size={14} className="me-1" />
              Abrir
            </Button>
            <Button size="sm" color="outline-secondary" onClick={downloadPDF}>
              <FeatherIcon icon="download" size={14} className="me-1" />
              Descargar
            </Button>
          </div>

          <SimplePDFModal
            isOpen={isPreviewOpen}
            toggle={togglePreview}
            pdfPath={pdfPath}
            title={title}
          />
        </CardBody>
      </Card>
    );
  }

  // Estilo destacado
  if (cardStyle === "featured") {
    return (
      <Card className="h-100 shadow border-0 document-card-featured">
        <CardBody className="p-4 text-center">
          <div className="icon-mono service-icon avatar-lg mx-auto mb-4">
            <FeatherIcon icon={icon} className="text-mundo-verde" size={32} />
          </div>
          <h5 className="text-mundo-verde mb-3">{title}</h5>
          
          {showDescription && description && (
            <p className="text-muted mb-4">{description}</p>
          )}

          <div className="d-flex flex-column gap-2">
            <Button color="success" onClick={togglePreview}>
              <FeatherIcon icon="eye" size={16} className="me-2" />
              {buttonText}
            </Button>
            <div className="d-flex gap-2">
              <Button color="outline-primary" size="sm" onClick={openPDFInNewTab}>
                <FeatherIcon icon="external-link" size={14} className="me-1" />
                {newTabText}
              </Button>
              <Button color="outline-secondary" size="sm" onClick={downloadPDF}>
                <FeatherIcon icon="download" size={14} className="me-1" />
                {downloadText}
              </Button>
            </div>
          </div>

          <SimplePDFModal
            isOpen={isPreviewOpen}
            toggle={togglePreview}
            pdfPath={pdfPath}
            title={title}
          />
        </CardBody>
      </Card>
    );
  }

  // Estilo por defecto (como el PDFViewer actual)
  return (
    <Card className="h-100 shadow border-0 document-card">
      <CardBody className="p-4">
        <div className="d-flex align-items-center mb-3">
          <FeatherIcon icon={icon} size={24} className="me-2 text-mundo-verde" />
          <h5 className="mb-0 text-mundo-verde">{title}</h5>
        </div>
        
        {showDescription && description && (
          <p className="text-muted mb-3">{description}</p>
        )}
        
        <div className="alert alert-info border-0 small mb-3">
          <div className="d-flex align-items-center">
            <FeatherIcon icon="info" size={16} className="me-2 text-primary" />
            <div>
              <strong>Documento disponible</strong><br/>
              Puedes ver, descargar o abrir este documento
            </div>
          </div>
        </div>

        <div className="mt-3 mb-2">
          <div className="d-flex flex-row justify-content-center gap-2 mb-2">
            <Button color="success" onClick={togglePreview} size="sm" style={{ minWidth: '100px' }}>
              <FeatherIcon icon="eye" size={16} className="me-1" /> {buttonText}
            </Button>
            <Button color="outline-success" onClick={openPDFInNewTab} size="sm" style={{ minWidth: '100px' }}>
              <FeatherIcon icon="external-link" size={16} className="me-1" /> {newTabText}
            </Button>
          </div>
          <div className="d-flex justify-content-center">
            <Button color="outline-secondary" onClick={downloadPDF} size="sm" style={{ minWidth: '210px' }}>
              <FeatherIcon icon="download" size={16} className="me-1" /> {downloadText}
            </Button>
          </div>
        </div>

        <SimplePDFModal
          isOpen={isPreviewOpen}
          toggle={togglePreview}
          pdfPath={pdfPath}
          title={title}
        />
      </CardBody>
    </Card>
  );
};

export default DocumentViewer;