
import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import LogoAlInvest from "../assets/images/logos-importantes/Al-Invest-verde.jpg";
import LogoGlobal from "../assets/images/logos-importantes/Global.jpg";
import LogoMundoVerde from "../assets/images/logos-importantes/mundo_verde.jpg";
import LogoSequa from "../assets/images/logos-importantes/Sequa.jpg";
import LogoUnionEuropea from "../assets/images/logos-importantes/Uniion_europea.jpg";



const Contribuyentes = () => (
  <section className="section bg-white" id="contribuyentes">
    <Container>
      <Row className="justify-content-center mb-4">
        <Col lg={8} className="text-center">
          <h2 className="fw-bold mb-4" style={{ letterSpacing: 1, color: '#217a3a', fontSize: '2.5rem', textShadow: '0 2px 12px #e0f2f1' }}>Contribuyentes</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="shadow border-0 rounded-4 p-3 w-100" style={{ background: 'linear-gradient(90deg, #e8f5e9 0%, #f8fafc 100%)' }}>
            <CardBody className="d-flex flex-column align-items-center p-0">
              <div
                style={{
                  width: '100%',
                  minHeight: 180,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2.5px solid #b2dfdb',
                  borderRadius: 18,
                  background: '#fff',
                  padding: '0 32px',
                  gap: 48,
                  overflowX: 'auto',
                  boxShadow: '0 8px 32px rgba(33, 122, 58, 0.07)',
                  scrollbarWidth: 'none',
                }}
                className="contribuyentes-carousel"
              >
                <img src={LogoGlobal} alt="Global" style={{height: 110, maxWidth: 180, objectFit: 'contain', margin: '0 18px', filter: 'drop-shadow(0 2px 8px #b2dfdb)', background: 'white', borderRadius: 12, padding: 12}} />
                <img src={LogoAlInvest} alt="Al-Invest Verde" style={{height: 110, maxWidth: 180, objectFit: 'contain', margin: '0 18px', filter: 'drop-shadow(0 2px 8px #b2dfdb)', background: 'white', borderRadius: 12, padding: 12}} />
                <img src={LogoUnionEuropea} alt="Unión Europea" style={{height: 110, maxWidth: 180, objectFit: 'contain', margin: '0 18px', filter: 'drop-shadow(0 2px 8px #b2dfdb)', background: 'white', borderRadius: 12, padding: 12}} />
                <img src={LogoSequa} alt="Sequa" style={{height: 110, maxWidth: 180, objectFit: 'contain', margin: '0 18px', filter: 'drop-shadow(0 2px 8px #b2dfdb)', background: 'white', borderRadius: 12, padding: 12}} />
                <img src={LogoMundoVerde} alt="Mundo Verde" style={{height: 110, maxWidth: 180, objectFit: 'contain', margin: '0 18px', filter: 'drop-shadow(0 2px 8px #b2dfdb)', background: 'white', borderRadius: 12, padding: 12}} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <style>{`
        .contribuyentes-carousel::-webkit-scrollbar { display: none; }
        .contribuyentes-carousel img:hover { transform: scale(1.08); box-shadow: 0 4px 24px #a5d6a7; transition: transform 0.3s; }
      `}</style>
    </Container>
  </section>  
);

export default Contribuyentes;
