import React from "react";
import NavBar from "../../component/Navbar/NavBar";
import ModuleCards from "../../component/ModuleCards";
import Feature from "../../component/Feature";
import BosqueVerdeImage from "../../component/BosqueVerdeImage";
import CalculadoraSection from "../../component/Calculadora";
import Contact from "../../component/Contact";
import Footer from "../../component/Footer/Footer";

const Layout1 = () => {
  return (
    <React.Fragment>
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-home-full bg-light" id="home" style={{
        background: 'linear-gradient(135deg, #2ecc40 0%, #43e97b 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div className="bg-overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center">
                <h1 className="text-white fw-bold mb-4" style={{fontSize: '3.5rem', letterSpacing: '-1px'}}>
                  Mundo Verde
                </h1>
                <h4 className="text-white-70 mb-4" style={{fontSize: '1.5rem', fontWeight: 400}}>
                  Plataforma de Sostenibilidad y Huella de Carbono
                </h4>
                <p className="lead text-white-60 mb-5" style={{fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2rem'}}>
                  Herramientas integrales para medir, gestionar y reducir el impacto ambiental de tu organización. 
                  Calcula tu huella de carbono y accede a recursos especializados en sostenibilidad.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a href="#modules" className="btn btn-light btn-lg shadow" style={{borderRadius: '50px', padding: '12px 30px', fontWeight: 600}}>
                    Explorar Módulos
                  </a>
                  <a href="/#calculadora" className="btn btn-outline-light btn-lg" style={{borderRadius: '50px', padding: '12px 30px', fontWeight: 600}}>
                    Calculadora
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <ModuleCards />

      {/* Features Section */}
      <Feature />

      {/* Bosque Verde Image Section */}
      <BosqueVerdeImage />

      {/* Calculator Section */}
      <CalculadoraSection />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </React.Fragment>
  );
};

export default Layout1;