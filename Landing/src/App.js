import React, { Component, Suspense } from "react";
import routes from "../src/routes";
import { Route, Routes } from "react-router-dom";
import NavbarPage from "./component/Navbar/NavBar";

import "./App.css";
import "./assets/css/pe-icon-7.css";
import "./assets/css/materialdesignicons.min.css";
import "./assets/scss/themes.scss";

// Definir los items del navbar globalmente
const navItems = [
  { id: 1, idnm: "home", navheading: "Inicio", link: "/" },
  { id: 3, idnm: "contact", navheading: "Contacto", link: "/#contact" },
  { id: 2, navheading: "Calculadora de huella de carbono", link: "/calculadora" },
  { id: 4, navheading: "Conceptos Claves", link: "/huella-carbono" },
  { id: 5, navheading: "Herramientas", link: "/documentos" },
  { id: 6, navheading: "Autodiagnóstico de sostenibilidad ambiental", link: "/autogestion" },
];

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavbarPage navItems={navItems} />
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {routes.map((route, idx) => (
              <Route path={route.path} element={route.component} key={idx} />
            ))}
          </Routes>
        </Suspense>
      </React.Fragment>
    );
  }
}

export default App;
