import React, { Component, Suspense } from "react";
import routes from "../src/routes";
import { Route, Routes } from "react-router-dom";
import NavbarPage from "./component/Navbar/NavBar";

import "./App.css";
import "./assets/css/pe-icon-7.css";
import "./assets/css/materialdesignicons.min.css";
import "./assets/scss/themes.scss";

// Definir los items del navbar globalmente con claves de traducción
const navItems = [
  { id: 1, idnm: "home", navheadingKey: "navbar.home", link: "/" },
  { id: 3, idnm: "contact", navheadingKey: "navbar.contact", link: "/#contact" },
  { id: 2, navheadingKey: "navbar.calculator", link: "/calculadora" },
  { id: 4, navheadingKey: "navbar.concepts", link: "/huella-carbono" },
  { id: 5, navheadingKey: "navbar.tools", link: "/documentos" },
  { id: 6, navheadingKey: "navbar.autodiagnosis", link: "/autogestion" },
];

class App extends Component {
  componentDidMount() {
    // Configurar el título base de la aplicación
    document.title = "Mundo Verde - Gestión Ambiental";
  }

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
