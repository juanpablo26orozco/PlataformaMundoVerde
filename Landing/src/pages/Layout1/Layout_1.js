import React, { Component, Suspense } from "react";
import Switch from "../../component/Switch";

// import Team from "../../component/Team";
// import Blog from "../../component/Blog";
// import Contact from "../../component/Contact";
// import Footer from "../../component/Footer/Footer";

// Importing Section
const Navbar = React.lazy(() => import("../../component/Navbar/NavBar"));

const Section = React.lazy(() => import("./Section"));
const Services = React.lazy(() => import("../../component/Services"));
const CalculadoraSection = React.lazy(() => import("../../component/CalculadoraSection"));
const Contact = React.lazy(() => import("../../component/Contact"));
const AliadosSection = React.lazy(() => import("../../component/AliadosSection"));
const Contribuyentes = React.lazy(() => import("../../component/Contribuyentes"));
const Footer = React.lazy(() => import("../../component/Footer/Footer"));

// import { Spinner } from "reactstrap";

class Layout_1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        { id: 1, idnm: "home", navheading: "Inicio" },
        { id: 2, idnm: "services", navheading: "Conceptos" },
        { id: 3, idnm: "calculadora", navheading: "Calculadora" },
        { id: 7, idnm: "contact", navheading: "Contacto" },
        { id: 8, navheading: "Huella de Carbono", link: "/huella-carbono" },
        { id: 9, navheading: "Documentos", link: "/documentos" },
      ],
      pos: document.documentElement.scrollTop,
      imglight: true,
      navClass: "",
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollNavigation, true);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollNavigation, true);
  }

  scrollNavigation = () => {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > this.state.pos) {
      this.setState({ navClass: "nav-sticky", imglight: false });
    } else {
      this.setState({ navClass: "", imglight: true });
    }
  };

  //set preloader div
  PreLoader = () => {
    return (
      <div id="preloader">
        <div id="status">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Suspense fallback={this.PreLoader()}>
          {/* Importing Navbar */}
          <Navbar
            navItems={this.state.navItems}
            navClass={this.state.navClass}
            imglight={this.state.imglight}
          />

          {/* Importing Section */}
          <Section />

          {/* Importing Section */}
          <Services />

          {/* Importing Calculadora */}
          <CalculadoraSection />


          
          <Contribuyentes />
          <AliadosSection />
          
          <Contact />

          {/* Importing Footer */}
          <Footer />

          {/* Importing Mode */}
          <Switch />
          
        </Suspense>
      </React.Fragment>
    );
  }
}
export default Layout_1;
