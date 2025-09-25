import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";

const sections = [
  {
    id: "conceptos-basicos-content",
    label: "¿Qué es la huella?",
    icon: "info"
  },
  {
    id: "calculadora-huella",
    label: "Calculadora",
    icon: "activity"
  }
];

const SidebarNav = () => {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      let found = sections[0].id;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = sec.id;
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 120,
        left: 32,
        zIndex: 1000,
        background: "#f6fff7",
        borderRadius: 16,
        boxShadow: "0 2px 6px #b7e4c7cc",
        padding: "16px 10px",
        minWidth: 64,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        border: "1.5px solid #e0f2f1"
      }}
      className="d-none d-md-flex"
      aria-label="Navegación de secciones"
    >
      {sections.map(sec => (
        <button
          key={sec.id}
          onClick={() => scrollTo(sec.id)}
          style={{
            background: active === sec.id ? "#e0f2f1" : "#f6fff7",
            color: active === sec.id ? "#1b5e20" : "#388e3c",
            border: active === sec.id ? "2px solid #43a047" : "1.2px solid #e0f2f1",
            borderRadius: 12,
            padding: "9px 13px",
            fontWeight: 600,
            fontSize: 15,
            minWidth: 44,
            minHeight: 44,
            boxShadow: active === sec.id ? "0 1px 4px #b7e4c7" : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.18s"
          }}
          aria-current={active === sec.id ? "section" : undefined}
          aria-label={sec.label}
        >
          <FeatherIcon icon={sec.icon} size={22} style={{marginBottom:4}} />
          <span style={{fontSize:13, fontWeight:600}}>{sec.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default SidebarNav;
