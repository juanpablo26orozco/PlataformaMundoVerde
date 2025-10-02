import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = {
    es: { flag: '🇪🇸', label: 'Español', code: 'ES' },
    en: { flag: '🇺🇸', label: 'English', code: 'EN' }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontWeight: '600',
          background: '#43a047',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 15,
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 6px rgba(67, 160, 71, 0.3)'
        }}
        aria-label="Cambiar idioma"
        title="Cambiar idioma"
      >
        <span>{languages[currentLang].flag}</span>
        <span>{languages[currentLang].code}</span>
        <span style={{ fontSize: 12, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          background: '#fff',
          border: '1.5px solid #e0f2f1',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          zIndex: 9999,
          minWidth: 140
        }}>
          {Object.keys(languages).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: currentLang === lang ? '#f1f8e9' : '#fff',
                color: '#217a3a',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: currentLang === lang ? '700' : '500',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'background 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f8e9'}
              onMouseLeave={(e) => e.target.style.background = currentLang === lang ? '#f1f8e9' : '#fff'}
            >
              <span>{languages[lang].flag}</span>
              <span>{languages[lang].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
