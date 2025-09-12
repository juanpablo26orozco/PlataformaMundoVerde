import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Switch = () => {
  const [isSwitchToggle, setIsSwitchToggle] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Verificar el tema guardado en localStorage o el tema actual del body
    const savedTheme = localStorage.getItem("theme");
    const currentTheme = document.body.getAttribute("data-bs-theme");
    
    if (savedTheme) {
      document.body.setAttribute("data-bs-theme", savedTheme);
      setIsDarkMode(savedTheme === "dark");
    } else if (currentTheme) {
      setIsDarkMode(currentTheme === "dark");
    } else {
      // Por defecto tema claro
      document.body.setAttribute("data-bs-theme", "light");
      setIsDarkMode(false);
    }
  }, []);

  const toggleThem = () => {
    const currentTheme = document.body.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.body.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  const toggleSwitcher = () => {
    setIsSwitchToggle(!isSwitchToggle);
  };

  return (
    <React.Fragment>
      <div id="style-switcher" className={isSwitchToggle ? "open" : ""}>
        <div className="bottom">
          <Link
            to="#"
            id="mode"
            className="mode-btn text-white"
            onClick={toggleThem}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? (
              <i className="mdi mdi-white-balance-sunny"></i>
            ) : (
              <i className="mdi mdi-moon-waning-crescent"></i>
            )}
          </Link>
          <Link
            to="#"
            onClick={toggleSwitcher}
            className="settings rounded-right"
            title="Configuraciones"
          >
            <i className="mdi mdi-cog mdi-spin"></i>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Switch;
