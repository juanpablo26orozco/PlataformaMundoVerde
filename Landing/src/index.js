import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import './assets/css/calculadora-section.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import './i18n';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';
import { EmissionFactorsProvider } from './context/EmissionFactorsContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <EmissionFactorsProvider>
      <App />
    </EmissionFactorsProvider>
  </BrowserRouter>
);

// Registrar Service Worker para mejorar rendimiento con caché
registerServiceWorker();

