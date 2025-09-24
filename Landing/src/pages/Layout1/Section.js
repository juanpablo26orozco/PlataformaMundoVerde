import React, { Component } from "react";

import { Container, Row, Col } from "reactstrap";

// Import Background Image
import Background from "../../assets/images/hero-1-bg.png";
import herolight from "../../assets/images/hero-1-bottom-shape.png";
import herodark from "../../assets/images/hero-1-bottom-shape-dark.png"
import { Link } from "react-router-dom";
import HeroImage from "../../assets/images/mundo-verde/iot-de-agricultura-inteligente-con-fondo-de-arbol-de-plantacion-manual.jpg";

class Section extends Component {
  render() {
    return (
      <div className="mundo-verde-theme">
        {/* Hero Start */}
        <section
          className="hero-1 bg-center  position-relative"
          // Define Background Image with Green Gradient Overlay
          style={{ 
            background: `linear-gradient(135deg, rgba(76, 175, 80, 0.8), rgba(46, 125, 50, 0.9)), url(${Background})`,
            backgroundColor: "#4CAF50",  
          }}
          id="home"
        >
          <Container>
            <Row className="align-items-center hero-content">
              <Col lg={5} className="hero-text-content">
                <h1 className="text-white display-4 font-weight-semibold mb-4 hero-1-title">
                  Mundo Verde
                </h1>
                <p className="text-white-70 mb-4 mb-lg-5">
                  Una apuesta por la adopción e implementación de prácticas sostenibles
                  que beneficien tanto a nuestras empresas como al medio ambiente.
                  Construyamos juntos un futuro más verde y próspero.
                </p>
                <a 
                  href="#modules" 
                  className="btn btn-lg btn-light rounded-pill me-2"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('modules');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  Comenzar Ahora
                </a>
              </Col>
              <Col lg={6} sm={10} className="mx-auto ms-lg-auto me-lg-0">
                <div className="mt-lg-0 mt-4 hero-image-container">
                  <div className="hero-image-wrapper">
                    <div className="hero-image-bg-effect"></div>
                    <div className="hero-image-mask"></div>
                    <div className="floating-elements">
                      <div className="floating-circle floating-circle-1"></div>
                      <div className="floating-circle floating-circle-2"></div>
                      <div className="floating-circle floating-circle-3"></div>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        minHeight: 340,
                        height: 340,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '24px',
                        background: '#f8faf8',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.07)'
                      }}
                    >
                      <img
                        src={HeroImage}
                        alt="Hero principal Mundo Verde"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '24px',
                          maxHeight: 340,
                          maxWidth: 617,
                          margin: '0 auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          <div className="hero-bottom-shape shape-light">
                <img src={herolight} alt="" className="img-fluid d-block mx-auto" />
            </div>
            <div className="hero-bottom-shape shape-dark">
                <img src={herodark} alt="" className="img-fluid d-block mx-auto" />
            </div>
        </section>
        {/* Hero End */}
      </div>
    );
  }
}

export default Section;
