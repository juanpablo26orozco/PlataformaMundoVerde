import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import "./AliadosSection.css";

import LogoArmenia from "../../assets/images/logos-aliados/Cámara Armenia.jpg";
import LogoBucaramanga from "../../assets/images/logos-aliados/Cámara Bucaramanga.jpg";
import LogoChinchina from "../../assets/images/logos-aliados/Cámara Chinchina.jpg";
import LogoDosquebradas from "../../assets/images/logos-aliados/Cámara Dosquebradas.jpg";
import LogoPereira from "../../assets/images/logos-aliados/Cámara Pereira.jpg";
import LogoValencia from "../../assets/images/logos-aliados/Cámara Valencia.jpg";
import LogoTexfor from "../../assets/images/logos-aliados/Texfor.jpg";
import LogoCatolica from "../../assets/images/logos-aliados/Universidad Católica.jpg";
import LogoManizales from "../../assets/images/logos-aliados/Universidad Manizales.jpg";


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
      scrollContainer.classList.add('dragging');
    };
    const handleMouseLeave = () => {
      setIsDragging(false);
      scrollContainer.classList.remove('dragging');
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      scrollContainer.classList.remove('dragging');
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
    <section className="section bg-white aliados-section" id="aliados">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className="fw-bold mb-4 aliados-title">Aliados</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="shadow border-0 rounded-4 p-3 w-100 aliados-card">
              <CardBody className="d-flex flex-column align-items-center p-0">
                <div
                  ref={scrollRef}
                  className="aliados-carousel"
                >
                  {aliados.map((logo, idx) => (
                    <div key={idx} className="aliado-item">
                      <img
                        src={logo.src}
                        alt={logo.alt}
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
    </section>
  );
};

export default AliadosSection;
