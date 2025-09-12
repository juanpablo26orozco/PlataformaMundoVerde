import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

//import icon
import FeatherIcon from "feather-icons-react";

export default class Services extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section" id="services">
          <Container>
            <Row className="justify-content-center mb-5">
              <Col lg={8} className="text-center">
                <h2 className="fw-bold text-mundo-verde">Conceptos Básicos de Huella de Carbono</h2>
                <p className="text-muted">
                  Conoce los fundamentos esenciales para medir, gestionar y reducir el impacto ambiental 
                  de tu empresa a través de la medición de la huella de carbono.
                </p>
              </Col>
            </Row>

            <Row>
              <Col lg={4}>
                <Link to="/huella-carbono#conceptos-basicos" className="text-decoration-none">
                  <div className="service-box text-center px-4 py-5 position-relative mb-4 card-mundo-verde">
                    <div className="service-box-content p-4">
                      <div className="icon-mono service-icon avatar-md mx-auto mb-4">
                        <i>
                          <FeatherIcon icon="info" className="text-mundo-verde" />
                        </i>
                      </div>
                      <h4 className="mb-3 font-size-22 text-mundo-verde">¿Qué es la Huella de Carbono?</h4>
                      <p className="text-muted mb-0">
                        Comprende el concepto fundamental de huella de carbono, su importancia 
                        para el medio ambiente y cómo se relaciona con las actividades empresariales.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>

              <Col lg={4}>
                <Link to="/huella-carbono#alcances-limites" className="text-decoration-none">
                  <div className="service-box text-center px-4 py-5 position-relative mb-4 active card-mundo-verde">
                    <div className="service-box-content p-4">
                      <div className="icon-mono service-icon avatar-md mx-auto mb-4">
                        <i>
                          <FeatherIcon icon="layers" className="text-white" />
                        </i>
                      </div>
                      <h4 className="mb-3 font-size-22 text-white">Alcances y Límites de Medición</h4>
                      <p className="text-white-70 mb-0">
                        Descubre los diferentes alcances (Scope 1, 2 y 3) para una medición 
                        completa y precisa de las emisiones de gases de efecto invernadero.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>

              <Col lg={4}>
                <Link to="/huella-carbono#factores-emision" className="text-decoration-none">
                  <div className="service-box text-center px-4 py-5 position-relative mb-4 card-mundo-verde">
                    <div className="service-box-content p-4">
                      <div className="icon-mono service-icon avatar-md mx-auto mb-4">
                        <i>
                          <FeatherIcon icon="database" className="text-mundo-verde" />
                        </i>
                      </div>
                      <h4 className="mb-3 font-size-22 text-mundo-verde">Factores de Emisión</h4>
                      <p className="text-muted mb-0">
                        Conoce los factores de emisión específicos para Colombia y aprende 
                        cómo aplicarlos correctamente en el cálculo de tu huella de carbono.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={6}>
                <Link to="/huella-carbono#acciones-reduccion" className="text-decoration-none">
                  <div className="service-box text-center px-4 py-5 position-relative mb-4 card-mundo-verde">
                    <div className="service-box-content p-4">
                      <div className="icon-mono service-icon avatar-md mx-auto mb-4">
                        <i>
                          <FeatherIcon icon="trending-down" className="text-mundo-verde" />
                        </i>
                      </div>
                      <h4 className="mb-3 font-size-22 text-mundo-verde">Acciones para Reducir Emisiones</h4>
                      <p className="text-muted mb-0">
                        Implementa estrategias efectivas para reducir las emisiones de CO2 
                        en tu empresa y contribuir a un futuro más sostenible.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>

              <Col lg={6}>
                <Link to="/huella-carbono#elaboracion-reportes" className="text-decoration-none">
                  <div className="service-box text-center px-4 py-5 position-relative mb-4 card-mundo-verde">
                    <div className="service-box-content p-4">
                      <div className="icon-mono service-icon avatar-md mx-auto mb-4">
                        <i>
                          <FeatherIcon icon="file-text" className="text-mundo-verde" />
                        </i>
                      </div>
                      <h4 className="mb-3 font-size-22 text-mundo-verde">Elaboración de Reportes</h4>
                      <p className="text-muted mb-0">
                        Aprende a crear reportes profesionales y completos sobre la medición 
                        de huella de carbono para la toma de decisiones estratégicas.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>

            <Row className="justify-content-center mt-5">
              <Col lg={8} className="text-center">
                <Link to="/huella-carbono" className="btn btn-mundo-verde btn-lg rounded-pill">
                  Ver Información Completa
                  <i className="ms-2">
                    <FeatherIcon icon="arrow-right" className="icon-sm" />
                  </i>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}
