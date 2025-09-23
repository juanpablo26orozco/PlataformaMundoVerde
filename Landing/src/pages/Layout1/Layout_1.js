import React, { Component, Suspense } from "react";
import Switch from "../../component/Switch";

// import Team from "../../component/Team";
// import Blog from "../../component/Blog";
// import Contact from "../../component/Contact";
// import Footer from "../../component/Footer/Footer";

// Importing Section
const Section = React.lazy(() => import("./Section"));
const Services = React.lazy(() => import("../../component/Services"));
const Contact = React.lazy(() => import("../../component/Contact"));
const AliadosSection = React.lazy(() => import("../../component/Aliados"));
const Contribuyentes = React.lazy(() => import("../../component/Contribuyentes"));
const Footer = React.lazy(() => import("../../component/Footer/Footer"));

// import { Spinner } from "reactstrap";

class Layout_1 extends Component {

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
          {/* Importing Section */}
          <Section />

          {/* Importing Section */}
          <Services />

          
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
