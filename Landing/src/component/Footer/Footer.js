import React from "react";
import logo from "../../assets/images/logo-positive.png"; // Ajusta la ruta si tu logo está en otro lugar

const Footer = () => (
  <footer
    style={{
      background: "#217a3a",
      color: "#fff",
      padding: "32px 0 16px 0",
      textAlign: "center",
      fontSize: "1rem",
      marginTop: 48,
      borderTop: "2px solid #388e3c",
    }}
  >
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt="Mundo Verde"
        style={{ height: 128, marginBottom: 12 }}
      />
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.15rem",
          marginBottom: 8,
        }}
      >
        Mundo Verde
      </div>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto 18px auto",
          fontSize: "0.98rem",
          opacity: 0.85,
        }}
      >
        Plataforma para la gestión ambiental, medición de huella de carbono y
        sostenibilidad en organizaciones.
      </div>
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <a
          href="mailto:contacto@mundoverde.com"
          style={{
            color: "#fff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Contacto
        </a>
        {/* <a href="/privacidad" style={{color: "#fff", textDecoration: "underline", fontWeight: 500}}>Aviso de privacidad</a> */}
        {/* <a href="/terminos" style={{color: "#fff", textDecoration: "underline", fontWeight: 500}}>Términos y condiciones</a> */}
      </div>
    </div>
    <div
      style={{
        marginTop: 18,
        fontSize: "0.95rem",
        opacity: 0.8,
      }}
    >
      © 2025 Platform Develop By MIES GROUP.
    </div>
  </footer>
);

export default Footer;
