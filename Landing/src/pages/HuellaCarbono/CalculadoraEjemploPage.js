import React from "react";
import { Container, Row, Col } from "reactstrap";
import CalculadoraEjemplo from "../../component/HuellaCarbono/CalculadoraEjemplo";
import Navbar from "../../component/Navbar/NavBar";
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";

const navItems = [
  { id: 1, navheading: "Inicio", link: "/" },
  { id: 2, navheading: "Huella de Carbono", link: "/huella-carbono" },
];

const CalculadoraEjemploPage = () => (
  <React.Fragment>
    <Navbar navItems={navItems} navClass="defaultscroll sticky" />
    <section className="section bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <h2 
              className="fw-bold text-center mb-5"
              style={{
                fontFamily: 'Montserrat, Assistant, sans-serif',
                fontWeight: 800,
                fontSize: '2.8rem',
                color: '#217a3a',
                letterSpacing: '1px',
                textShadow: '0 2px 12px rgba(33,122,58,0.10)',
                background: 'linear-gradient(90deg, #b6e2c6 0%, #eafaf1 100%)',
                borderRadius: '18px',
                padding: '18px 0 14px 0',
                marginBottom: '2.5rem',
                boxShadow: '0 4px 24px rgba(33,122,58,0.08)'
              }}
            >
              <span style={{fontFamily: 'Montserrat, Assistant, sans-serif', fontWeight: 900, color: '#217a3a'}}>Calculadora de Huella de Carbono</span>
            </h2>
            <CalculadoraEjemplo />
          </Col>
        </Row>
      </Container>
    </section>
    <Footer />
    <Switch />
  </React.Fragment>
);

export default CalculadoraEjemploPage;
