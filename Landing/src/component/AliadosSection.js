import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import LogoArmenia from "../assets/images/logos-aliados/Cámara Armenia.jpg";
import LogoBucaramanga from "../assets/images/logos-aliados/Cámara Bucaramanga.jpg";
import LogoChinchina from "../assets/images/logos-aliados/Cámara Chinchina.jpg";
import LogoDosquebradas from "../assets/images/logos-aliados/Cámara Dosquebradas.jpg";
import LogoPereira from "../assets/images/logos-aliados/Cámara Pereira.jpg";
import LogoValencia from "../assets/images/logos-aliados/Cámara Valencia.jpg";
import LogoTexfor from "../assets/images/logos-aliados/Texfor.jpg";
import LogoCatolica from "../assets/images/logos-aliados/Universidad Católica.jpg";
import LogoManizales from "../assets/images/logos-aliados/Universidad Manizales.jpg";


const aliados = [
  { src: LogoArmenia, alt: "Cámara Armenia" },
  { src: LogoBucaramanga, alt: "Cámara Bucaramanga" },
  { src: LogoChinchina, alt: "Cámara Chinchina" },
  { src: LogoDosquebradas, alt: "Cámara Dosquebradas" },
  { src: LogoPereira, alt: "Cámara Pereira" },
  { src: LogoValencia, alt: "Cámara Valencia" },
  { src: LogoTexfor, alt: "Texfor" },
  { src: LogoCatolica, alt: "Universidad Católica" },
  { src: LogoManizales, alt: "Universidad Manizales" },
];

const AliadosSection = () => {
  const scrollRef = useRef(null);


  // Scroll state for drag
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    let direction = 1;
    let animationFrame;

    function autoScroll() {
      if (!scrollContainer || isDragging) {
        animationFrame = requestAnimationFrame(autoScroll);
        return;
      }
      scrollAmount = scrollContainer.scrollLeft + direction * 2.5; // velocidad aumentada
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        direction = -1;
      } else if (scrollAmount <= 0) {
        direction = 1;
      }
      scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      animationFrame = requestAnimationFrame(autoScroll);
    }
    animationFrame = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging]);

  // Drag to scroll handlers
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainer.offsetLeft);
      setScrollLeft(scrollContainer.scrollLeft);
      scrollContainer.style.cursor = 'grabbing';
    };
    const handleMouseLeave = () => {
      setIsDragging(false);
      scrollContainer.style.cursor = 'grab';
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      scrollContainer.style.cursor = 'grab';
    };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll sensitivity
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.style.cursor = 'grab';

    // Touch events for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;
    const handleTouchStart = (e) => {
      setIsDragging(true);
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = scrollContainer.scrollLeft;
    };
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const walk = (x - touchStartX) * 1.5;
      scrollContainer.scrollLeft = touchScrollLeft - walk;
    };
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    scrollContainer.addEventListener('touchmove', handleTouchMove);

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <section className="section bg-white" id="aliados" style={{paddingBottom: 0}}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className="fw-bold mb-4" style={{ letterSpacing: 1, color: '#217a3a', fontSize: '2.5rem', textShadow: '0 2px 12px #e0f2f1' }}>Aliados</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="shadow border-0 rounded-4 p-3 w-100" style={{ background: 'linear-gradient(90deg, #e8f5e9 0%, #f8fafc 100%)' }}>
              <CardBody className="d-flex flex-column align-items-center p-0">
                <div
                  ref={scrollRef}
                  style={{
                    width: '100%',
                    minHeight: 180,
                    height: 180,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '2.5px solid #b2dfdb',
                    borderRadius: 18,
                    background: '#fff',
                    padding: '0 32px',
                    gap: 48,
                    overflowX: 'auto',
                    boxShadow: '0 8px 32px rgba(33, 122, 58, 0.07)',
                    scrollbarWidth: 'none',
                  }}
                  className="aliados-carousel"
                >
                  {aliados.map((logo, idx) => (
                    <div key={idx} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 180, minHeight: 120}}>
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        style={{
                          height: 120,
                          maxWidth: 180,
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 8px #b2dfdb)',
                          background: 'white',
                          borderRadius: 12,
                          padding: 12,
                          transition: 'transform 0.3s',
                        }}
                        className="aliado-logo"
                      />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .aliados-carousel::-webkit-scrollbar { display: none; }
        .aliado-logo:hover { transform: scale(1.08); box-shadow: 0 4px 24px #a5d6a7; }
      `}</style>
    </section>
  );
};

export default AliadosSection;
