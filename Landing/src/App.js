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
  { id: 1, idnm: "home", navheading: "Inicio" },
  { id: 2, idnm: "services", navheading: "Conceptos" },
  { id: 3, idnm: "calculadora", navheading: "Calculadora" },
  { id: 7, idnm: "contact", navheading: "Contacto" },
  { id: 8, navheading: "Huella de Carbono", link: "/huella-carbono" },
  { id: 9, navheading: "Documentos", link: "/documentos" },
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
