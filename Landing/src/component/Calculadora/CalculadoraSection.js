import React, { useState, useEffect } from "react";
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
import DocumentViewer from "../DocumentViewer";
import BosqueVerdeImage from "../../assets/images/mundo-verde/vista-de-los-arboles-del-bosque-verde-con-co2.jpg";
import { useTranslation } from 'react-i18next';
import ModalPoliticas from "../Legal/ModalPoliticas";


const CalculadoraSection = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [showInstructivo, setShowInstructivo] = useState(false);
  const [showModalPoliticas, setShowModalPoliticas] = useState(false);
  const [consentimientoAceptado, setConsentimientoAceptado] = useState(false);
  
  const handleOpenInstructivo = () => setShowInstructivo(true);
  const handleCloseInstructivo = () => setShowInstructivo(false);

  // Verificar si el usuario ya aceptó el consentimiento
  useEffect(() => {
    const consentimiento = localStorage.getItem('consentimientoAceptado');
    if (consentimiento === 'true') {
      setConsentimientoAceptado(true);
    }
  }, []);

  const handleIniciarCalculo = () => {
    // Si no ha aceptado el consentimiento, mostrar el modal de políticas
    if (!consentimientoAceptado) {
      setShowModalPoliticas(true);
    } else {
      // Si ya aceptó, abrir directamente el formulario
      toggle();
    }
  };

  const handleAceptarPoliticas = () => {
    setConsentimientoAceptado(true);
    setShowModalPoliticas(false);
    // Abrir el formulario después de aceptar
    toggle();
  };

  const handleCancelarPoliticas = () => {
    setShowModalPoliticas(false);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleFormComplete = (formData) => {
    // El formulario se completa automáticamente, no necesitamos hacer nada aquí
    console.log('Formulario completado:', formData);
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
                        }}>{t('calculadora.calculatorCard.title')}</h2>
                        <p style={{
                          color: '#4b5c4b',
                          fontSize: '1.13rem',
                          marginBottom: 22,
                          lineHeight: 1.6,
                          fontWeight: 400
                        }}>
                          {t('calculadora.calculatorCard.description')}
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
                            <span style={{ fontWeight: 800, color: '#217a3a', fontSize: '1.13rem', letterSpacing: '-0.2px' }}>{t('calculadora.calculatorCard.quickInstructive')}</span>
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
                            {t('calculadora.calculatorCard.viewFullInstructive')}
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
                          <span className="alcance-title">{t('calculadora.calculatorCard.scope1')}</span>
                          <span className="alcance-desc">{t('calculadora.calculatorCard.scope1Desc')}</span>
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
                          <span className="alcance-title">{t('calculadora.calculatorCard.scope2')}</span>
                          <span className="alcance-desc">{t('calculadora.calculatorCard.scope2Desc')}</span>
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
                          <span className="alcance-title">{t('calculadora.calculatorCard.scope3')}</span>
                          <span className="alcance-desc">{t('calculadora.calculatorCard.scope3Desc')}</span>
                        </li>
                      </ul>

                      <Button 
                        className="calculadora-btn"
                        size="lg"
                        onClick={handleIniciarCalculo}
                      >
                        <span className="calculadora-btn-icon">
                          <FeatherIcon icon="play" size={18} />
                        </span>
                        <span>{t('calculadora.calculatorCard.startCalculation')}</span>
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
                    border: '1.5px solid #e0e0e0',
                    width: '100%',
                    maxWidth: 340,
                    padding: '2.5rem 2rem 2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    {/* Solo visor PDF */}
                      <DocumentViewer
                        pdfPath="/Huella_docs/1.Huella_de_Carbono.pdf"
                        title={t('calculadora.documents.certifiedMethodology')}
                        showDescription={false}
                        cardStyle="buttons-only"
                        buttonText={t('calculadora.documents.viewDocument')}
                      />
                  </div>
                </Col>
                <Col xs={12} lg={4} className="text-center mb-4 d-flex justify-content-center">
                  <div className="calculadora-feature-card" style={{
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
                    {/* Solo visor PDF */}
                      <DocumentViewer
                        pdfPath="/Huella_docs/2.Factores_de_Emision.pdf"
                        title={t('calculadora.documents.emissionFactors')}
                        showDescription={false}
                        cardStyle="buttons-only"
                        buttonText={t('calculadora.documents.viewDocument')}
                      />
                  </div>
          {/* Modal instructivo (fuera del Col) */}
          <Modal isOpen={showInstructivo} toggle={handleCloseInstructivo} size="lg">
            <div className="modal-header">
              <h5 className="modal-title">{t('calculadora.instructiveModal.title')}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseInstructivo}></button>
            </div>
            <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
              <ul>
                <li>{t('calculadora.instructiveModal.instruction1')}</li>
                <li>{t('calculadora.instructiveModal.instruction2')}</li>
                <li>{t('calculadora.instructiveModal.instruction3')}</li>
                <li>{t('calculadora.instructiveModal.instruction4')}</li>
                <li>{t('calculadora.instructiveModal.instruction5')}</li>
                <li>{t('calculadora.instructiveModal.instruction6')}</li>
                <li>{t('calculadora.instructiveModal.instruction7')}</li>
                <li>{t('calculadora.instructiveModal.instruction8')}</li>
              </ul>
              <hr />
              <h6>{t('calculadora.instructiveModal.glossaryTitle')}</h6>
              <ul>
                <li><b>{t('calculadora.instructiveModal.carbonDeposits')}</b> {t('calculadora.instructiveModal.carbonDepositsDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.co2')}</b> {t('calculadora.instructiveModal.co2Desc')}</li>
                <li><b>{t('calculadora.instructiveModal.co2e')}</b> {t('calculadora.instructiveModal.co2eDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.ghgEmission')}</b> {t('calculadora.instructiveModal.ghgEmissionDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.directEmissions')}</b> {t('calculadora.instructiveModal.directEmissionsDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.fugitiveEmissions')}</b> {t('calculadora.instructiveModal.fugitiveEmissionsDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.indirectEmissions')}</b> {t('calculadora.instructiveModal.indirectEmissionsDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.referenceScenario')}</b> {t('calculadora.instructiveModal.referenceScenarioDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.emissionFactor')}</b> {t('calculadora.instructiveModal.emissionFactorDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.ghg')}</b> {t('calculadora.instructiveModal.ghgDesc')}</li>
                <li><b>{t('calculadora.instructiveModal.gwp')}</b> {t('calculadora.instructiveModal.gwpDesc')}</li>
              </ul>
            </div>
            <div className="modal-footer">
              <Button color="secondary" onClick={handleCloseInstructivo}>{t('calculadora.instructiveModal.close')}</Button>
            </div>
          </Modal>
                </Col>
                <Col xs={12} lg={4} className="d-flex justify-content-center mb-4">
                  <div className="calculadora-feature-card" style={{
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
                    {/* Solo visor PDF */}
                      <DocumentViewer
                        pdfPath="/Huella_docs/3.Acciones_para_reducir_la_Huella_de_CO2.pdf"
                        title={t('calculadora.documents.reductionPlan')}
                        showDescription={false}
                        cardStyle="buttons-only"
                        buttonText={t('calculadora.documents.viewDocument')}
                      />
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
          {t('calculadora.modal.calculator')}
        </ModalHeader>
        <ModalBody className="p-0">
          <FormularioHuella 
            onFormComplete={handleFormComplete}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {t('calculadora.modal.close')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Políticas y Consentimiento */}
      <ModalPoliticas
        show={showModalPoliticas}
        onHide={handleCancelarPoliticas}
        onAceptar={handleAceptarPoliticas}
        tipo="calculo"
      />
    </React.Fragment>
  );
};

export default CalculadoraSection;
