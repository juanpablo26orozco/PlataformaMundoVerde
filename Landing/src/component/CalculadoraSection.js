import React, { useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import FormularioHuella from "./HuellaCarbono/FormularioHuella";
import ResultadosHuella from "./HuellaCarbono/ResultadosHuella";


import BosqueVerdeImage from "../assets/images/mundo-verde/vista-de-los-arboles-del-bosque-verde-con-co2.jpg";


const CalculadoraSection = () => {
  const [modal, setModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculationData, setCalculationData] = useState(null);
  const [showInstructivo, setShowInstructivo] = useState(false);
  const handleOpenInstructivo = () => setShowInstructivo(true);
  const handleCloseInstructivo = () => setShowInstructivo(false);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      // Reset state when opening modal
      setShowResults(false);
      setCalculationData(null);
    }
  };

  const handleFormComplete = (formData) => {
    setCalculationData(formData);
    setShowResults(true);
  };

  const handleNewCalculation = () => {
    setShowResults(false);
    setCalculationData(null);
  };

  return (
    <React.Fragment>
      <section className="section bg-light" id="calculadora">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="section-title text-center mb-5">
                <h2 className="mb-4">Calculadora de Huella de Carbono</h2>
                <p className="text-muted">
                  Mide el impacto ambiental de tu organización con nuestra calculadora basada en 
                  estándares internacionales y factores de emisión específicos para Colombia.
                </p>
              </div>

              <Row className="align-items-center">
                <Col lg={6}>
                  <Card className="shadow border-0 h-100">
                    <CardBody className="p-5">

                      <div className="mb-4">
                        <FeatherIcon icon="calculator" size={48} className="text-primary mb-3" />
                        <h4 className="mb-3">¡Comienza tu cálculo!</h4>
                        <p className="text-muted mb-4">
                          Nuestra calculadora te guiará paso a paso para obtener un análisis 
                          completo de las emisiones de tu organización en los tres alcances definidos 
                          por el GHG Protocol.
                        </p>
                        <div className="alert alert-info" style={{fontSize: '0.98rem', lineHeight: 1.5, maxHeight: 160, overflowY: 'auto'}}>
                          <strong>Instructivo rápido:</strong>
                          <ul style={{marginBottom: 0, paddingLeft: 18}}>
                            <li>Diligencie los datos en el orden establecido.</li>
                            <li>No incluya unidades en los valores numéricos.</li>
                            <li>Use las listas desplegables donde aparezca “(Escoja Opción)”.</li>
                            <li>Un formulario por cada proceso a calcular.</li>
                            <li>La información debe corresponder al periodo de reporte.</li>
                          </ul>
                          <span style={{fontSize: '0.95em'}}>
                            <a href="#" onClick={e => {e.preventDefault(); handleOpenInstructivo();}} style={{textDecoration: 'underline', color: '#217a3a', fontWeight: 600}}>Ver instructivo completo</a>
                          </span>
                        </div>
                      </div>

                      <ul className="list-unstyled mb-4">
                        <li className="mb-2">
                          <FeatherIcon icon="check-circle" className="text-success me-2" size={16} />
                          <strong>Alcance 1:</strong> Emisiones directas
                        </li>
                        <li className="mb-2">
                          <FeatherIcon icon="check-circle" className="text-success me-2" size={16} />
                          <strong>Alcance 2:</strong> Electricidad y energía
                        </li>
                        <li className="mb-2">
                          <FeatherIcon icon="check-circle" className="text-success me-2" size={16} />
                          <strong>Alcance 3:</strong> Transporte y residuos
                        </li>
                      </ul>

                      <Button 
                        color="primary" 
                        size="lg" 
                        onClick={toggle}
                        className="btn-mundo-verde"
                      >
                        <FeatherIcon icon="play" className="me-2" />
                        Iniciar Cálculo
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={6}>
                  <div className="text-center w-100 h-100 d-flex align-items-center justify-content-center">
                    <img
                      src={BosqueVerdeImage}
                      alt="Vista de los árboles del bosque verde con CO2"
                      style={{
                        width: '100%',
                        maxWidth: 617,
                        height: 340,
                        objectFit: 'cover',
                        borderRadius: '24px',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.07)'
                      }}
                    />
                  </div>
                </Col>
              </Row>

              {/* Features Row */}
              <Row className="mt-5">
                <Col md={4} className="text-center mb-4">
                  <div className="mb-3">
                    <FeatherIcon icon="shield-check" size={32} className="text-success" />
                  </div>
                  <h5>Metodología Certificada</h5>
                  <p className="text-muted">
                    Basado en el GHG Protocol y factores de emisión oficiales de Colombia
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div className="mb-3">
                    <FeatherIcon icon="file-text" size={32} className="text-info" />
                  </div>
                  <h5>Reporte Detallado</h5>
      {/* Modal instructivo */}
      <Modal isOpen={showInstructivo} toggle={handleCloseInstructivo} size="lg">
        <div className="modal-header">
          <h5 className="modal-title">INSTRUCTIVO - Herramienta Emisiones Gases de Efecto Invernadero</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseInstructivo}></button>
        </div>
        <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
          <ul>
            <li>Diligencie la herramienta de cálculo de emisiones de gases de efecto invernadero ingresando cada dato en el orden establecido.</li>
            <li>Para las celdas que requieran ser diligenciadas con valores numéricos no incluir las unidades, estas son proporcionadas por la herramienta. Ejemplo: kg, galones, m3, grados (°), minutos (´), etcétera.</li>
            <li>Cuando aparezca en el formulario "(Escoja Opción)" despliegue la lista para diligenciar la celda.</li>
            <li>Si desea realizar el cálculo para más de un proceso deberá diligenciar un formulario por cada uno.</li>
            <li>Recuerde que la información que diligencie debe corresponder a las cantidades del periodo de reporte.</li>
            <li>Verifique antes de diligenciar la información de la empresa, que la herramienta no tenga ningún dato diligenciado.</li>
            <li>Evite manipular la pestaña "Resumen". No ingrese ni borre información. Esta hoja de cálculo permite el correcto funcionamiento de la herramienta.</li>
            <li>No elimine hojas de reportes ya creados. Para no afectar el funcionamiento de la herramienta no elimine reportes, déjelos sin diligenciar.</li>
          </ul>
          <hr />
          <h6>GLOSARIO</h6>
          <ul>
            <li><b>Depósitos de carbono:</b> Compartimentos donde se almacena el carbono de los ecosistemas continentales y sus productos. Ej: biomasa aérea y subterránea, materia orgánica muerta, carbono en el suelo, productos cosechados de la madera.</li>
            <li><b>Dióxido de carbono (CO2):</b> Gas producido naturalmente y como subproducto de la combustión de combustibles fósiles y biomasa, cambios en el uso de tierras y procesos industriales. Principal GEI antropogénico.</li>
            <li><b>Dióxido de carbono equivalente (CO2e):</b> Unidad que compara el potencial de calentamiento global de cada GEI respecto al CO2.</li>
            <li><b>Emisión de GEI:</b> Liberación a la atmósfera de la masa de un GEI.</li>
            <li><b>Emisiones directas de GEI:</b> Provenientes de fuentes propiedad o bajo control de la empresa que reporta.</li>
            <li><b>Emisiones fugitivas:</b> No están físicamente controladas pero resultan de liberaciones intencionales o no intencionales de GEI (juntas, sellos, empaques, etc.).</li>
            <li><b>Emisiones indirectas de GEI:</b> Consecuencia de operaciones de la empresa que reporta, pero ocurren en fuentes propiedad/control de otras empresas.</li>
            <li><b>Escenario de referencia de emisiones de GEI:</b> Línea base que representa las emisiones de GEI que se producirían en ausencia de políticas o iniciativas de mitigación.</li>
            <li><b>Factor de emisión:</b> Permite estimar emisiones de GEI a partir de datos de actividades y emisiones totales de GEI.</li>
            <li><b>Gases de Efecto Invernadero (GEI):</b> Componentes gaseosos de la atmósfera que absorben y reemiten radiación infrarroja.</li>
            <li><b>Potencial de Calentamiento Global (PCG):</b> Factor que describe el impacto de una unidad de masa de un GEI respecto al CO2 en un periodo determinado.</li>
          </ul>
        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={handleCloseInstructivo}>Cerrar</Button>
        </div>
      </Modal>
                  <p className="text-muted">
                    Obtén un análisis completo con recomendaciones para reducir emisiones
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div className="mb-3">
                    <FeatherIcon icon="trending-down" size={32} className="text-warning" />
                  </div>
                  <h5>Plan de Reducción</h5>
                  <p className="text-muted">
                    Estrategias personalizadas para minimizar tu impacto ambiental
                                        <Button color="info" outline onClick={handleOpenInstructivo} className="mt-2 mb-2">
                                          Ver instructivo
                                        </Button>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modal for Calculator */}
      <Modal isOpen={modal} toggle={toggle} size="xl" className="modal-dialog-scrollable">
        <ModalHeader toggle={toggle}>
          {showResults ? "Resultados de Huella de Carbono" : "Calculadora de Huella de Carbono"}
        </ModalHeader>
        <ModalBody className="p-0">
          {showResults ? (
            <ResultadosHuella 
              formData={calculationData} 
              onNewCalculation={handleNewCalculation}
            />
          ) : (
            <FormularioHuella 
              onFormComplete={handleFormComplete}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default CalculadoraSection;
