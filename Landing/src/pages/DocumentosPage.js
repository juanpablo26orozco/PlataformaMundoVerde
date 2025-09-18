import React from 'react';
import './DocumentosPage.css';

// Documentos reales en la carpeta Documentation
const documentos = [
  {
    nombre: 'Infografía Conceptos Básicos Huella de Carbono',
    resumen: 'Resumen visual de los conceptos fundamentales sobre la huella de carbono y su importancia.',
    archivo: '/Documentation/1. Infografía Conceptos Básicos Huella de Carbono.pdf',
  },
  {
    nombre: 'Infografía Alcances y Limites de la Medición de Huella de Carbono',
    resumen: 'Explicación de los diferentes alcances y límites en la medición de la huella de carbono.',
    archivo: '/Documentation/3. Infografía Alcances y Limites de la Medición de Huella de Carbono.pdf',
  },
  {
    nombre: 'Documento factores de Emisión',
    resumen: 'Documento detallado sobre los factores de emisión utilizados en los cálculos de huella.',
    archivo: '/Documentation/5. Documento factores de Emisión.pdf',
  },
  {
    nombre: 'Infografía Acciones para reducir la huella de CO2',
    resumen: 'Acciones recomendadas para reducir la huella de carbono en organizaciones y personas.',
    archivo: '/Documentation/7. Infografía Acciones para reducir la huella de CO2.pdf',
  },
  {
    nombre: 'Infografía Elaboración de reportes de medición',
    resumen: 'Guía visual para la elaboración de reportes de medición de huella de carbono.',
    archivo: '/Documentation/8. Infografía Elaboración de reportes de medición.pdf',
  },
];


const DocumentosPage = () => {
  React.useEffect(() => {
    // Force navbar to be visible and on top, and set text color
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.position = 'fixed';
      navbar.style.zIndex = '10000';
      navbar.style.background = '#fff';
      navbar.style.boxShadow = '0 2px 12px 0 rgba(39,83,255,0.10)';
      navbar.style.width = '100%';
      // Cambiar color de letras
      const navLinks = navbar.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.style.color = '#29344a';
      });
    }
    return () => {
      if (navbar) {
        navbar.style.position = '';
        navbar.style.zIndex = '';
        navbar.style.background = '';
        navbar.style.boxShadow = '';
        navbar.style.width = '';
        // Restaurar color de letras
        const navLinks = navbar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          link.style.color = '';
        });
      }
    };
  }, []);
  return (
    <div className="documentos-page">
      <h1 className="documentos-title">Documentos y Recursos</h1>
      <p className="documentos-desc">Accede y descarga documentos clave sobre huella de carbono. Cada recurso incluye un breve resumen para ayudarte a identificar el contenido más relevante para ti.</p>
      <div className="documentos-list">
        {documentos.map((doc, idx) => (
          <div className="documento-card" key={idx}>
            <div className="documento-info">
              <h2 className="documento-nombre">{doc.nombre}</h2>
              <p className="documento-resumen">{doc.resumen}</p>
            </div>
            <a className="documento-descargar" href={doc.archivo} download>
              Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentosPage;
