
import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import LogoAlInvest from "../../assets/images/logos-importantes/Al-Invest-verde.jpg";
import LogoGlobal from "../../assets/images/logos-importantes/Global.jpg";
import LogoSequa from "../../assets/images/logos-importantes/Sequa.jpg";
import LogoUnionEuropea from "../../assets/images/logos-importantes/Uniion_europea.jpg";
import "./Contribuyentes.css";

const contribuyentes = [
  { src: LogoGlobal, alt: "Global" },
  { src: LogoAlInvest, alt: "Al-Invest Verde" },
  { src: LogoUnionEuropea, alt: "Unión Europea" },
  { src: LogoSequa, alt: "Sequa" }
];

const Contribuyentes = () => {
  const scrollRef = useRef(null);

  // Scroll state for drag
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil o tablet
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1024); // Tablets y móviles
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto scroll solo para móviles y tablets
  useEffect(() => {
    if (!isMobile) return; // No hacer scroll automático en desktop

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
  }, [isDragging, isMobile]);

  // Drag to scroll handlers - solo para móviles y tablets
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Desktop: sin interactividad de drag
    if (!isMobile) {
      return;
    }

    // Mobile/Tablet: con interactividad de drag
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
  }, [isDragging, startX, scrollLeft, isMobile]);

  return (
    <section className="section bg-white contribuyentes-section" id="contribuyentes">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className="fw-bold mb-4 contribuyentes-title">Contribuyentes</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="shadow border-0 rounded-4 p-3 w-100 contribuyentes-card">
              <CardBody className="d-flex flex-column align-items-center p-0">
                <div
                  ref={scrollRef}
                  className={`contribuyentes-carousel ${isMobile ? 'mobile' : 'desktop'}`}
                >
                  {contribuyentes.map((logo, idx) => (
                    <div key={idx} className="contribuyente-item">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="contribuyente-logo"
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

export default Contribuyentes;
