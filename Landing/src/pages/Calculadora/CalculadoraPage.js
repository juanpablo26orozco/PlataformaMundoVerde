import React from "react";
import CalculadoraSection from "../../component/Calculadora/CalculadoraSection";
import Footer from "../../component/Footer/Footer";
import Switch from "../../component/Switch";

const CalculadoraPage = () => {
  React.useEffect(() => {
    // Reset any potential body classes or styles
    document.body.classList = "";
    document.body.style.paddingTop = '';
  }, []);

  return (
    <React.Fragment>
      {/* Hero institucional */}
      <section style={{
        minHeight: '340px',
        paddingTop: '100px',
        background: 'linear-gradient(120deg, #217a3a 0%, #28a745 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        marginTop: '0px',
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center text-white">
              <div style={{fontSize: 64, marginBottom: 16, color: '#fff', opacity: 0.9}}>
                <i className="feather icon-calculator" style={{fontSize: 64}}></i>
              </div>
              <h1 className="fw-bold mb-3" style={{fontSize: '2.7rem', letterSpacing: '-1px'}}>Herramientas de Medición Ambiental</h1>
              <h4 className="mb-3" style={{color: '#e8f5e8', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.2px', lineHeight: 1.18}}>
                Calcula y gestiona las emisiones de carbono de tu organización
              </h4>
              <p className="lead text-white-70 mb-4" style={{fontSize: '1.18rem', color: 'rgba(255,255,255,0.92)'}}>
                Nuestra calculadora está basada en <b>estándares internacionales</b> y factores de emisión específicos para Colombia.
              </p>
            </div>
          </div>
        </div>
        {/* Efecto decorativo */}
        <div style={{position: 'absolute', top: -80, right: -120, width: 320, height: 320, background: 'radial-gradient(circle, #4caf50 0%, #66bb6a 100%)', opacity: 0.15, borderRadius: '50%'}}></div>
      </section>
      <CalculadoraSection />
      <Footer />
      <Switch />
    </React.Fragment>
  );
};

export default CalculadoraPage;
