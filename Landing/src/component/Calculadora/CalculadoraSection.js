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
import FormularioHuella from "../HuellaCarbono/FormularioHuella";
import ResultadosHuella from "../HuellaCarbono/ResultadosHuella";


import BosqueVerdeImage from "../../assets/images/mundo-verde/vista-de-los-arboles-del-bosque-verde-con-co2.jpg";


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
        <Container className="calculadora-bg" style={{
          padding: '3.2rem 0 2.7rem 0',
          borderRadius: 32,
          maxWidth: 1200,
          margin: '0 auto',
          minHeight: 720
        }}>
          <Row className="justify-content-center">
            <Col lg={10}>
              

              <Row className="align-items-center" style={{ marginBottom: 10 }}>
                <Col lg={6} style={{ display: 'flex', alignItems: 'stretch', minWidth: 340 }}>
                  <Card className="shadow border-0 h-100 calculadora-card" style={{
                    borderRadius: 28,
                    overflow: 'hidden',
                    marginBottom: 18
                  }}>
                    <CardBody className="calculadora-card-body" style={{
                      padding: '2.6rem 2.1rem 2.1rem 2.1rem',
                      borderRadius: 28,
                      minHeight: 480,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 20
                    }}>

                      <div className="mb-4">
                        <FeatherIcon icon="calculator" size={48} className="text-primary mb-3" />
                        <h2 style={{
                          fontWeight: 900,
                          color: '#217a3a',
                          fontSize: '2.1rem',
                          marginBottom: 14,
                          letterSpacing: '-0.5px',
                          lineHeight: 1.13
                        }}>¡Comienza tu cálculo!</h2>
                        <p style={{
                          color: '#4b5c4b',
                          fontSize: '1.13rem',
                          marginBottom: 22,
                          lineHeight: 1.6,
                          fontWeight: 400
                        }}>
                          Nuestra calculadora te guiará paso a paso para obtener un análisis completo<br />
                          de las emisiones de tu organización en los tres alcances definidos por el GHG Protocol.
                        </p>
                        <div className="alert alert-info calculadora-instructivo" style={{
                          fontSize: '1.01rem',
                          lineHeight: 1.6,
                          maxHeight: 180,
                          overflowY: 'auto',
                          borderRadius: 18,
                          boxShadow: '0 2px 12px rgba(33, 122, 58, 0.07)',
                          padding: '1.1rem 1.3rem 1rem 1.3rem',
                          marginBottom: 0
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 10
                          }}>
                            <div style={{
                              background: '#43b36a',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10,
                              boxShadow: '0 1px 4px rgba(33, 122, 58, 0.10)'
                            }}>
                              <FeatherIcon icon="info" size={18} style={{ color: '#fff' }} />
                            </div>
                            <span style={{ fontWeight: 800, color: '#217a3a', fontSize: '1.13rem', letterSpacing: '-0.2px' }}>Instructivo rápido</span>
                          </div>
                          <ul style={{
                            marginBottom: 10,
                            paddingLeft: 22,
                            color: '#217a3a',
                            fontSize: '1.04rem',
                            lineHeight: 1.7,
                            fontWeight: 500
                          }}>
                            <li>Diligencie los datos en el orden establecido.</li>
                            <li>No incluya unidades en los valores numéricos.</li>
                            <li>Use las listas desplegables donde aparezca “(Escoja Opción)”.</li>
                            <li>Un formulario por cada proceso a calcular.</li>
                            <li>La información debe corresponder al periodo de reporte.</li>
                          </ul>
                          <button
                            type="button"
                            onClick={handleOpenInstructivo}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#217a3a',
                              fontWeight: 700,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              fontSize: '1.01rem',
                              padding: 0,
                              marginTop: 2
                            }}
                          >
                            Ver instructivo completo
                          </button>
                        </div>
                      </div>

                      <ul className="list-unstyled mb-4" style={{ marginTop: 10, marginBottom: 24 }}>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                          <div style={{
                            background: 'var(--calc-feature-bg)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            boxShadow: '0 1px 4px rgba(33, 122, 58, 0.10)'
                          }}>
                            <FeatherIcon icon="check-circle" size={18} className="alcance-icon-1" />
                          </div>
                          <span className="alcance-title">Alcance 1:</span>
                          <span className="alcance-desc">Emisiones directas</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                          <div style={{
                            background: 'var(--calc-feature-bg)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            boxShadow: '0 1px 4px rgba(33, 122, 58, 0.10)'
                          }}>
                            <FeatherIcon icon="zap" size={18} className="alcance-icon-2" />
                          </div>
                          <span className="alcance-title">Alcance 2:</span>
                          <span className="alcance-desc">Electricidad y energía</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                          <div style={{
                            background: 'var(--calc-feature-bg)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            boxShadow: '0 1px 4px rgba(33, 122, 58, 0.10)'
                          }}>
                            <FeatherIcon icon="truck" size={18} className="alcance-icon-3" />
                          </div>
                          <span className="alcance-title">Alcance 3:</span>
                          <span className="alcance-desc">Transporte y residuos</span>
                        </li>
                      </ul>

                      <Button 
                        className="calculadora-btn"
                        size="lg"
                        onClick={toggle}
                      >
                        <span className="calculadora-btn-icon">
                          <FeatherIcon icon="play" size={18} />
                        </span>
                        <span>Iniciar Cálculo</span>
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={6} style={{ minWidth: 340 }} className="d-none d-lg-flex">
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '100%',
                      maxWidth: 420,
                      minHeight: 480,
                      background: 'linear-gradient(90deg, #f6faf6 80%, #eaf7ea 100%)',
                      borderRadius: 28,
                      boxShadow: '0 12px 36px rgba(33, 122, 58, 0.13)',
                      border: '1.5px solid #e0e0e0',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'stretch',
                      justifyContent: 'center',
                      marginBottom: 18
                    }}>
                      <img
                        src={BosqueVerdeImage}
                        alt="Vista de los árboles del bosque verde con CO2"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 28,
                          display: 'block',
                          boxShadow: '0 2px 12px rgba(33, 122, 58, 0.10)'
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Features Row */}
              <Row className="mt-5 flex-column flex-lg-row align-items-stretch" style={{ marginTop: 44 }}>
                <Col xs={12} lg={4} className="text-center mb-4 d-flex justify-content-center">
                  <div className="calculadora-feature-card" style={{
                    borderRadius: 20,
                    background: '#fff',
                    boxShadow: '0 4px 24px rgba(33, 122, 58, 0.10)',
                    border: '1.5px solid #e0e0e0'
                  }}>
                      <div style={{
                        background: '#eaf7ea',
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 18,
                        boxShadow: '0 2px 8px rgba(33, 122, 58, 0.08)'
                      }}>
                        <FeatherIcon icon="award" size={32} style={{ color: '#217a3a' }} />
                      </div>
                      <h5 style={{
                        fontWeight: 700,
                        color: '#217a3a',
                        marginBottom: 10,
                        textAlign: 'center'
                      }}>Metodología Certificada</h5>
                      <p style={{
                        color: '#4b5c4b',
                        fontSize: '1.08rem',
                        textAlign: 'center',
                        marginBottom: 0
                      }}>
                        Basado en el GHG Protocol y factores de emisión oficiales de Colombia
                      </p>
                  </div>
                </Col>
                <Col xs={12} lg={4} className="text-center mb-4 d-flex justify-content-center">
                  <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 4px 24px rgba(33, 122, 58, 0.10)',
                    padding: '2.5rem 2rem 2rem 2rem',
                    minWidth: 270,
                    maxWidth: 340,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1.5px solid #e0e0e0',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{
                      background: '#e9f6fa',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 18,
                      boxShadow: '0 2px 8px rgba(33, 122, 58, 0.08)'
                    }}>
                      <FeatherIcon icon="file-text" size={32} className="text-info" />
                    </div>
                    <h5 style={{
                      fontWeight: 700,
                      color: '#217a3a',
                      marginBottom: 10,
                      textAlign: 'center'
                    }}>Reporte Detallado</h5>
                    <p style={{
                      color: '#4b5c4b',
                      fontSize: '1.08rem',
                      textAlign: 'center',
                      marginBottom: 0
                    }}>
                      Obtén un análisis completo con recomendaciones para reducir emisiones
                    </p>
                  </div>
          {/* Modal instructivo (fuera del Col) */}
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
                </Col>
                <Col xs={12} lg={4} className="d-flex justify-content-center mb-4">
                  <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 4px 24px rgba(33, 122, 58, 0.10)',
                    padding: '2.5rem 2rem 2rem 2rem',
                    minWidth: 270,
                    maxWidth: 340,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1.5px solid #e0e0e0',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{ 
                      background: '#f7fbe9',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 18,
                      boxShadow: '0 2px 8px rgba(33, 122, 58, 0.08)'
                    }}>
                      <FeatherIcon icon="trending-down" size={32} className="text-warning" />
                    </div>
                    <h5 style={{
                      fontWeight: 700,
                      color: '#217a3a',
                      marginBottom: 10,
                      textAlign: 'center'
                    }}>Plan de Reducción</h5>
                    <p style={{
                      color: '#4b5c4b',
                      fontSize: '1.08rem',
                      textAlign: 'center',
                      marginBottom: 0
                    }}>
                      Estrategias personalizadas para minimizar tu impacto ambiental
                    </p>
                  </div>
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
