import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col } from "reactstrap";

// import { loadFull } from "tsparticles";

//Import Background Image
import Background from "../../assets/images/hero-8-bg.jpg";

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {

        //particales
        // const particlesInit = async (main) => {
        //   console.log(main);
        //   await loadFull(main);
        // };
      
        // const particlesLoaded = (container) => {
        //   console.log(container);
        // };
  
        

    return (
      <React.Fragment>
        {/* Hero Start */}
        <section
          className="hero-8 bg-center position-relative"
          // Define Background Image
          style={{ background: `url(${Background})` }}
          id="home"
        >
          <div className="bg-overlay bg-dark">
            {/* <Particles
              id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                  style:{
                    position:"absolute"
                  },
                  fpsLimit: 120,
                  interactivity: {
                    events: {
                      onClick: {
                        enable: true,
                        mode: "push",
                      },
                      onHover: {
                        enable: true,
                        mode: "repulse",
                      },
                      resize: true,
                    },
                    modes: {
                      push: {
                        quantity: 4,
                      },
                      repulse: {
                        distance: 100,
                        duration: 9,
                      },
                    },
                  },
                  particles: {
                    color: {
                      value: "#ffffff",
                    },
                    links: {
                      color: "#ffffff",
                      distance: 150,
                      enable: true,
                      opacity: 0.3,
                      width: 2,
                    },
                    collisions: {
                      enable: true,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                        default: "bounce",
                      },
                      random: false,
                      speed: 2,
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        area: 900,
                      },
                      value: 100,
                    },
                    opacity: {
                      value: 0.4,
                    },
                    shape: {
                      type: "circle",
                    },
                    size: {
                      value: { min: 1, max: 5 },
                    },
                  },
                  detectRetina: true,
                }}
            /> */}
          </div>
          <Container>
            <Row className="justify-content-center hero-content">
              <Col lg={9}>
                <div className="text-center">
                  <i
                    className="text-white sw-1_5 icon-lg icon-spin mb-4"
                    data-feather="star"
                  ></i>
                  <i
                    className="text-white sw-1_5 icon-lg icon-spin mb-4"
                    data-feather="star"
                  ></i>
                  <h1 className="font-weight-semibold mb-4 text-white hero-8-title">
                    We help startups launch their products with awesome website
                  </h1>
                  <p className="mb-5 text-white-70 w-lg-75 mx-auto">
                    Nemo enim ipsam voluptatem quia voluptas sit aut aspernatur
                    aut fugit sed quia consequuntur magni dolores ratione
                    voluptatem nesciunt.
                  </p>
                  <Link to="#" className="btn btn-light">
                    Get Started{" "}
                    <i className="icon-sm ms-1" data-feather="arrow-right"></i>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Hero End */}
      </React.Fragment>
    );
  }
}

export default Section;
