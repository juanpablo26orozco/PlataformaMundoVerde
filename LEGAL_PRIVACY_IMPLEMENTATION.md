# 🔐 SISTEMA DE PRIVACIDAD Y TÉRMINOS LEGALES

## IMPLEMENTACIÓN GDPR/RGPD COMPLIANT

---

## 📋 COMPONENTES NECESARIOS

### 1. **Términos y Condiciones**
### 2. **Política de Privacidad**
### 3. **Consentimiento de Cookies**
### 4. **Aviso de Confidencialidad de Datos**
### 5. **Sistema de Gestión de Consentimientos**

---

## 🛡️ PARTE 1: BASE DE DATOS - TABLAS LEGALES

```sql
-- Tabla de consentimientos de usuario
CREATE TABLE consentimientos_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Tipos de consentimiento
    acepta_terminos BOOLEAN NOT NULL DEFAULT false,
    acepta_privacidad BOOLEAN NOT NULL DEFAULT false,
    acepta_cookies_necesarias BOOLEAN NOT NULL DEFAULT true,
    acepta_cookies_analiticas BOOLEAN DEFAULT false,
    acepta_cookies_marketing BOOLEAN DEFAULT false,
    acepta_emails_promocionales BOOLEAN DEFAULT false,
    
    -- Versiones aceptadas
    version_terminos VARCHAR(20) NOT NULL, -- 'v1.0', 'v1.1', etc.
    version_privacidad VARCHAR(20) NOT NULL,
    
    -- IP y user agent (para auditoría legal)
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Timestamps
    fecha_consentimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    
    -- Revocación
    consentimiento_revocado BOOLEAN DEFAULT false,
    fecha_revocacion TIMESTAMP,
    
    CONSTRAINT consentimiento_valido CHECK (
        acepta_terminos = true AND acepta_privacidad = true
    )
);

CREATE INDEX idx_consenti_usuario ON consentimientos_usuario(usuario_id);
CREATE INDEX idx_consenti_fecha ON consentimientos_usuario(fecha_consentimiento);

-- Historial de cambios en políticas
CREATE TABLE historial_politicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL, -- 'TERMINOS', 'PRIVACIDAD'
    version VARCHAR(20) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_vigencia DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT true,
    
    CONSTRAINT tipo_politica CHECK (tipo IN ('TERMINOS', 'PRIVACIDAD', 'COOKIES'))
);

-- Log de acceso a datos sensibles (GDPR Article 30)
CREATE TABLE log_acceso_datos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    empresa_id UUID REFERENCES empresas(id),
    
    accion VARCHAR(100) NOT NULL, -- 'VIEW', 'EXPORT', 'DELETE', 'MODIFY'
    tipo_dato VARCHAR(100) NOT NULL, -- 'DATOS_EMPRESA', 'CALCULO_HUELLA', etc.
    
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_usuario ON log_acceso_datos(usuario_id);
CREATE INDEX idx_log_fecha ON log_acceso_datos(fecha_acceso);

-- Solicitudes de eliminación de datos (Derecho al Olvido)
CREATE TABLE solicitudes_eliminacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    
    motivo TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'PROCESANDO', 'COMPLETADA', 'RECHAZADA'
    
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_procesamiento TIMESTAMP,
    fecha_completada TIMESTAMP,
    
    procesado_por UUID REFERENCES usuarios(id),
    notas_admin TEXT,
    
    CONSTRAINT estado_valido CHECK (
        estado IN ('PENDIENTE', 'PROCESANDO', 'COMPLETADA', 'RECHAZADA')
    )
);
```

---

## 🎨 PARTE 2: COMPONENTES REACT

### Componente 1: Modal de Términos y Condiciones

```javascript
// Landing/src/component/Legal/TermsModal.js
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import './LegalModals.css';

const TermsModal = ({ isOpen, toggle, onAccept, version = 'v1.0' }) => {
  const { t } = useTranslation();
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setHasScrolled(true);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable className="legal-modal">
      <ModalHeader toggle={toggle}>
        {t('legal.terms.title')} <span className="version-badge">{version}</span>
      </ModalHeader>
      <ModalBody onScroll={handleScroll} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <div className="legal-content">
          <h3>1. ACEPTACIÓN DE LOS TÉRMINOS</h3>
          <p>
            Al acceder y utilizar la plataforma Mundo Verde ("la Plataforma"), usted acepta estar 
            legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno 
            de estos términos, no debe utilizar esta Plataforma.
          </p>

          <h3>2. DESCRIPCIÓN DEL SERVICIO</h3>
          <p>
            Mundo Verde es una plataforma digital que proporciona herramientas para:
          </p>
          <ul>
            <li>Cálculo de Huella de Carbono empresarial</li>
            <li>Autodiagnóstico de Sostenibilidad Ambiental</li>
            <li>Generación de reportes y documentación ambiental</li>
          </ul>

          <h3>3. CONFIDENCIALIDAD DE DATOS</h3>
          <p>
            La información ingresada por el usuario, incluyendo pero no limitado a:
          </p>
          <ul>
            <li><strong>Datos empresariales</strong>: NIT, nombre, ubicación, sector</li>
            <li><strong>Datos operacionales</strong>: consumos energéticos, emisiones, procesos</li>
            <li><strong>Resultados de cálculos</strong>: emisiones de CO₂, porcentajes de cumplimiento</li>
          </ul>
          <p>
            Se considera <strong>información confidencial y estratégica</strong> de la empresa. 
            Mundo Verde se compromete a:
          </p>
          <ul>
            <li>✅ NO compartir con terceros sin consentimiento explícito</li>
            <li>✅ Almacenar con cifrado AES-256</li>
            <li>✅ Permitir exportación y eliminación de datos en cualquier momento</li>
            <li>✅ Notificar en caso de brecha de seguridad (dentro de 72 horas)</li>
          </ul>

          <h3>4. USO PERMITIDO</h3>
          <p>Usted se compromete a:</p>
          <ul>
            <li>✅ Proporcionar información veraz y actualizada</li>
            <li>✅ Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>✅ Utilizar la plataforma únicamente con fines legítimos</li>
            <li>❌ NO intentar acceder a cuentas de otros usuarios</li>
            <li>❌ NO utilizar la plataforma para actividades ilegales</li>
            <li>❌ NO realizar ingeniería inversa del software</li>
          </ul>

          <h3>5. PROPIEDAD INTELECTUAL</h3>
          <p>
            Los algoritmos de cálculo, factores de emisión, diseño, código fuente y contenido de 
            la Plataforma son propiedad de Mundo Verde. Los datos ingresados por el usuario 
            permanecen siendo propiedad del usuario.
          </p>

          <h3>6. LIMITACIÓN DE RESPONSABILIDAD</h3>
          <p>
            Los cálculos y resultados proporcionados por la Plataforma son estimaciones basadas en 
            factores de emisión reconocidos internacionalmente (IPCC, EPA, UPME). Mundo Verde no 
            se hace responsable de:
          </p>
          <ul>
            <li>Decisiones empresariales tomadas basándose únicamente en estos resultados</li>
            <li>Sanciones regulatorias derivadas de reportes inexactos</li>
            <li>Pérdidas económicas por uso inadecuado de la plataforma</li>
          </ul>

          <h3>7. RETENCIÓN Y ELIMINACIÓN DE DATOS</h3>
          <p>
            Sus datos se almacenan mientras mantenga una cuenta activa. Usted tiene derecho a:
          </p>
          <ul>
            <li>🗑️ Eliminar cálculos individuales en cualquier momento</li>
            <li>🗑️ Solicitar eliminación completa de su cuenta (procesado en 30 días)</li>
            <li>📥 Exportar todos sus datos en formato JSON/PDF</li>
          </ul>

          <h3>8. MODIFICACIONES</h3>
          <p>
            Nos reservamos el derecho de modificar estos términos. Los cambios serán notificados 
            por email con 30 días de anticipación. El uso continuado de la Plataforma después de 
            la notificación constituye aceptación de los nuevos términos.
          </p>

          <h3>9. LEY APLICABLE</h3>
          <p>
            Estos términos se rigen por las leyes de Colombia y la Ley 1581 de 2012 (Protección 
            de Datos Personales) y el GDPR/RGPD cuando aplique.
          </p>

          <h3>10. CONTACTO</h3>
          <p>
            Para consultas sobre estos términos:<br/>
            Email: legal@mundoverde.com<br/>
            Teléfono: +57 (XXX) XXX-XXXX
          </p>

          <div className="legal-footer">
            <small>Última actualización: {new Date().toLocaleDateString('es-CO')}</small>
            <small>Versión: {version}</small>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="legal-actions">
          <div className="scroll-warning">
            {!hasScrolled && (
              <small className="text-warning">
                ⚠️ Por favor, desplázate hasta el final para aceptar
              </small>
            )}
          </div>
          <div className="buttons">
            <Button color="secondary" onClick={toggle}>
              {t('legal.decline')}
            </Button>
            <Button 
              color="success" 
              onClick={onAccept}
              disabled={!hasScrolled}
            >
              {t('legal.accept')}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default TermsModal;
```

### Componente 2: Política de Privacidad

```javascript
// Landing/src/component/Legal/PrivacyModal.js
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const PrivacyModal = ({ isOpen, toggle, onAccept, version = 'v1.0' }) => {
  const { t } = useTranslation();
  const [hasScrolled, setHasScrolled] = useState(false);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
      <ModalHeader toggle={toggle}>
        {t('legal.privacy.title')} <span className="version-badge">{version}</span>
      </ModalHeader>
      <ModalBody onScroll={(e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) setHasScrolled(true);
      }}>
        <div className="legal-content">
          <h3>POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS</h3>
          
          <h4>1. RESPONSABLE DEL TRATAMIENTO</h4>
          <p>
            <strong>Mundo Verde S.A.S.</strong><br/>
            NIT: XXX.XXX.XXX-X<br/>
            Dirección: Calle XX #XX-XX, Bogotá, Colombia<br/>
            Email: privacidad@mundoverde.com
          </p>

          <h4>2. TIPOS DE DATOS QUE RECOPILAMOS</h4>
          
          <h5>2.1 Datos Personales Básicos</h5>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Teléfono (opcional)</li>
            <li>Cargo en la empresa</li>
          </ul>

          <h5>2.2 Datos Empresariales (Confidenciales)</h5>
          <ul>
            <li><strong>Identificación</strong>: Nombre de empresa, NIT, sector económico</li>
            <li><strong>Ubicación</strong>: Departamento, municipio, dirección</li>
            <li><strong>Datos Operacionales Sensibles</strong>:
              <ul>
                <li>Consumos energéticos (kWh)</li>
                <li>Consumos de combustibles (litros, m³, kg)</li>
                <li>Emisiones de CO₂ (Alcance 1, 2, 3)</li>
                <li>Prácticas de sostenibilidad</li>
                <li>Respuestas de autodiagnóstico</li>
              </ul>
            </li>
          </ul>

          <h5>2.3 Datos Técnicos</h5>
          <ul>
            <li>Dirección IP</li>
            <li>Tipo de navegador y dispositivo</li>
            <li>Cookies técnicas (necesarias para el funcionamiento)</li>
            <li>Logs de acceso y uso de la plataforma</li>
          </ul>

          <h4>3. FINALIDAD DEL TRATAMIENTO</h4>
          <p>Utilizamos sus datos exclusivamente para:</p>
          <ul>
            <li>✅ Proveer los servicios de cálculo de huella de carbono</li>
            <li>✅ Generar reportes personalizados</li>
            <li>✅ Almacenar su historial de cálculos</li>
            <li>✅ Enviar notificaciones importantes sobre la plataforma</li>
            <li>✅ Mejorar la experiencia de usuario</li>
            <li>✅ Cumplir con obligaciones legales</li>
          </ul>

          <h4>4. BASE LEGAL DEL TRATAMIENTO</h4>
          <ul>
            <li><strong>Consentimiento explícito</strong>: Para datos empresariales sensibles</li>
            <li><strong>Ejecución contractual</strong>: Para proveer el servicio</li>
            <li><strong>Interés legítimo</strong>: Para mejora del servicio</li>
            <li><strong>Obligación legal</strong>: Cuando lo requiera la ley</li>
          </ul>

          <h4>5. COMPARTICIÓN DE DATOS CON TERCEROS</h4>
          <p><strong>NO compartimos</strong> sus datos empresariales con terceros, EXCEPTO:</p>
          <ul>
            <li>🔒 <strong>Proveedores de infraestructura</strong>: AWS/Azure (con NDA y certificación ISO 27001)</li>
            <li>⚖️ <strong>Autoridades</strong>: Solo cuando sea legalmente obligatorio</li>
            <li>👤 <strong>Con su consentimiento explícito</strong>: Si usted nos autoriza expresamente</li>
          </ul>

          <h4>6. MEDIDAS DE SEGURIDAD</h4>
          <p>Implementamos las siguientes medidas técnicas y organizativas:</p>
          <ul>
            <li>🔐 Cifrado AES-256 de datos en reposo</li>
            <li>🔒 SSL/TLS para datos en tránsito</li>
            <li>🛡️ Firewall de aplicaciones web (WAF)</li>
            <li>👥 Control de acceso basado en roles</li>
            <li>📝 Auditorías de seguridad periódicas</li>
            <li>💾 Backups diarios cifrados</li>
            <li>🚨 Monitoreo 24/7 de intrusiones</li>
          </ul>

          <h4>7. SUS DERECHOS (GDPR/LEY 1581 DE 2012)</h4>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li>📖 <strong>Acceso</strong>: Conocer qué datos tenemos sobre usted</li>
            <li>✏️ <strong>Rectificación</strong>: Corregir datos inexactos</li>
            <li>🗑️ <strong>Supresión (Derecho al Olvido)</strong>: Eliminar sus datos</li>
            <li>🚫 <strong>Oposición</strong>: Oponerse al tratamiento</li>
            <li>📦 <strong>Portabilidad</strong>: Recibir sus datos en formato estructurado</li>
            <li>⏸️ <strong>Limitación</strong>: Restringir el procesamiento</li>
            <li>🔕 <strong>Revocar consentimiento</strong>: En cualquier momento</li>
          </ul>

          <h4>8. RETENCIÓN DE DATOS</h4>
          <table className="retention-table">
            <thead>
              <tr>
                <th>Tipo de Dato</th>
                <th>Tiempo de Retención</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cuenta de usuario activa</td>
                <td>Mientras esté activa</td>
              </tr>
              <tr>
                <td>Cálculos y reportes</td>
                <td>5 años (o hasta eliminación manual)</td>
              </tr>
              <tr>
                <td>Logs de auditoría</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>Cuenta eliminada</td>
                <td>30 días (luego eliminación permanente)</td>
              </tr>
            </tbody>
          </table>

          <h4>9. COOKIES</h4>
          <p>Utilizamos las siguientes cookies:</p>
          <ul>
            <li><strong>Estrictamente necesarias</strong>: Autenticación, sesión (no requieren consentimiento)</li>
            <li><strong>Analíticas</strong>: Google Analytics (requiere consentimiento)</li>
            <li><strong>Marketing</strong>: NO utilizamos cookies de marketing</li>
          </ul>

          <h4>10. TRANSFERENCIAS INTERNACIONALES</h4>
          <p>
            Sus datos pueden ser procesados en servidores ubicados en la Unión Europea o Estados Unidos, 
            siempre bajo estándares GDPR y con cláusulas contractuales estándar.
          </p>

          <h4>11. MENORES DE EDAD</h4>
          <p>
            Esta plataforma no está dirigida a menores de 18 años. No recopilamos intencionalmente 
            datos de menores.
          </p>

          <h4>12. CAMBIOS EN LA POLÍTICA</h4>
          <p>
            Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán 
            notificados por email con 30 días de anticipación.
          </p>

          <h4>13. CONTACTO - OFICIAL DE PROTECCIÓN DE DATOS</h4>
          <p>
            Para ejercer sus derechos o realizar consultas:<br/>
            <strong>Email:</strong> dpo@mundoverde.com<br/>
            <strong>Teléfono:</strong> +57 (XXX) XXX-XXXX<br/>
            <strong>Dirección:</strong> Calle XX #XX-XX, Bogotá, Colombia
          </p>

          <h4>14. AUTORIDAD DE CONTROL</h4>
          <p>
            En Colombia: <strong>Superintendencia de Industria y Comercio (SIC)</strong><br/>
            Web: www.sic.gov.co<br/>
            En la UE: Autoridad de protección de datos de su país
          </p>

          <div className="legal-footer">
            <small>Última actualización: {new Date().toLocaleDateString('es-CO')}</small>
            <small>Versión: {version}</small>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          {t('legal.decline')}
        </Button>
        <Button 
          color="success" 
          onClick={onAccept}
          disabled={!hasScrolled}
        >
          {t('legal.accept')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PrivacyModal;
```

### Componente 3: Banner de Cookies

```javascript
// Landing/src/component/Legal/CookieBanner.js
import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import './CookieBanner.css';

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre true, no se puede desactivar
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
      version: 'v1.0'
    }));
    setShow(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...allAccepted,
      timestamp: new Date().toISOString(),
      version: 'v1.0'
    }));
    setShow(false);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...onlyNecessary,
      timestamp: new Date().toISOString(),
      version: 'v1.0'
    }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <div className="cookie-text">
          <h4>🍪 Uso de Cookies</h4>
          <p>
            Utilizamos cookies para mejorar tu experiencia. Las cookies necesarias son obligatorias 
            para el funcionamiento de la plataforma. Puedes personalizar tus preferencias.
          </p>
        </div>

        {!showSettings ? (
          <div className="cookie-actions">
            <Button color="link" onClick={() => setShowSettings(true)}>
              Personalizar
            </Button>
            <Button color="secondary" onClick={rejectAll}>
              Rechazar Todo
            </Button>
            <Button color="success" onClick={acceptAll}>
              Aceptar Todo
            </Button>
          </div>
        ) : (
          <div className="cookie-settings">
            <div className="cookie-option">
              <label>
                <input 
                  type="checkbox" 
                  checked={true} 
                  disabled 
                />
                <strong>Cookies Necesarias</strong> (obligatorias)
                <small>Autenticación, sesión, seguridad</small>
              </label>
            </div>

            <div className="cookie-option">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                />
                <strong>Cookies Analíticas</strong> (opcionales)
                <small>Google Analytics, métricas de uso</small>
              </label>
            </div>

            <div className="cookie-option">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                />
                <strong>Cookies de Marketing</strong> (opcionales)
                <small>Publicidad personalizada</small>
              </label>
            </div>

            <div className="cookie-actions">
              <Button color="secondary" onClick={() => setShowSettings(false)}>
                Cancelar
              </Button>
              <Button color="success" onClick={savePreferences}>
                Guardar Preferencias
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
```

---

## 🎯 PARTE 3: INTEGRACIÓN EN LA APLICACIÓN

### Paso 1: Componente de Registro con Consentimientos

```javascript
// Landing/src/pages/Register/Register.js
import React, { useState } from 'react';
import TermsModal from '../../component/Legal/TermsModal';
import PrivacyModal from '../../component/Legal/PrivacyModal';

const Register = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    emails: false
  });

  const handleRegister = async () => {
    if (!consents.terms || !consents.privacy) {
      alert('Debes aceptar los Términos y la Política de Privacidad para continuar');
      return;
    }

    const userData = {
      // ... otros datos de registro
      consentimientos: {
        acepta_terminos: consents.terms,
        acepta_privacidad: consents.privacy,
        acepta_emails_promocionales: consents.emails,
        version_terminos: 'v1.0',
        version_privacidad: 'v1.0',
        ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip),
        user_agent: navigator.userAgent,
        fecha_consentimiento: new Date().toISOString()
      }
    };

    // Enviar a API
    console.log('Registrando usuario:', userData);
  };

  return (
    <div className="register-page">
      {/* ... otros campos del formulario ... */}

      <div className="consent-section">
        <div className="form-check">
          <input
            type="checkbox"
            id="terms"
            checked={consents.terms}
            onChange={(e) => setConsents({...consents, terms: e.target.checked})}
          />
          <label htmlFor="terms">
            Acepto los{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>
              Términos y Condiciones
            </a>
            {' '}* (obligatorio)
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="privacy"
            checked={consents.privacy}
            onChange={(e) => setConsents({...consents, privacy: e.target.checked})}
          />
          <label htmlFor="privacy">
            Acepto la{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>
              Política de Privacidad
            </a>
            {' '}* (obligatorio)
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="emails"
            checked={consents.emails}
            onChange={(e) => setConsents({...consents, emails: e.target.checked})}
          />
          <label htmlFor="emails">
            Acepto recibir emails promocionales (opcional)
          </label>
        </div>
      </div>

      <Button onClick={handleRegister} disabled={!consents.terms || !consents.privacy}>
        Registrarse
      </Button>

      <TermsModal 
        isOpen={showTerms}
        toggle={() => setShowTerms(false)}
        onAccept={() => {
          setConsents({...consents, terms: true});
          setShowTerms(false);
        }}
      />

      <PrivacyModal 
        isOpen={showPrivacy}
        toggle={() => setShowPrivacy(false)}
        onAccept={() => {
          setConsents({...consents, privacy: true});
          setShowPrivacy(false);
        }}
      />
    </div>
  );
};

export default Register;
```

### Paso 2: Agregar Banner de Cookies al App.js

```javascript
// Landing/src/App.js
import CookieBanner from './component/Legal/CookieBanner';

function App() {
  return (
    <div className="App">
      {/* ... resto de tu aplicación ... */}
      <CookieBanner />
    </div>
  );
}
```

---

## 📄 PARTE 4: DOCUMENTOS LEGALES EXPORTABLES

### Archivo descargable de Términos y Condiciones

```javascript
// Landing/src/utils/exportLegal.js
export const exportTermsAsPDF = async () => {
  // Usando jsPDF
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('TÉRMINOS Y CONDICIONES', 20, 20);
  doc.setFontSize(12);
  doc.text('Mundo Verde - Plataforma de Sostenibilidad Ambiental', 20, 30);
  
  // ... agregar todo el contenido ...
  
  doc.save('terminos_condiciones_mundoverde.pdf');
};

export const exportPrivacyAsPDF = async () => {
  // Similar implementación
};
```

---

## ✅ CHECKLIST DE CUMPLIMIENTO LEGAL

### GDPR/RGPD (Europa)
- [ ] Consentimiento explícito antes de procesar datos
- [ ] Información clara sobre qué datos se recopilan
- [ ] Derecho de acceso (Art. 15)
- [ ] Derecho de rectificación (Art. 16)
- [ ] Derecho al olvido (Art. 17)
- [ ] Derecho a la portabilidad (Art. 20)
- [ ] Notificación de brechas en 72 horas (Art. 33)
- [ ] DPO (Data Protection Officer) designado
- [ ] Registro de actividades de tratamiento (Art. 30)
- [ ] Evaluación de impacto de privacidad (cuando aplique)

### Ley 1581 de 2012 (Colombia)
- [ ] Autorización previa y expresa del titular
- [ ] Política de tratamiento publicada
- [ ] Aviso de privacidad visible
- [ ] Procedimiento para consultas y reclamos
- [ ] Registro ante SIC (si aplica)
- [ ] Medidas de seguridad implementadas

---

## 📊 PRÓXIMOS PASOS

### Semana 1: Legal Básico
1. ✅ Crear componentes de modales legales
2. ✅ Agregar checkboxes en registro
3. ✅ Implementar banner de cookies

### Semana 2: Base de Datos
1. ✅ Crear tablas de consentimientos
2. ✅ Implementar log de acceso a datos
3. ✅ Sistema de solicitudes de eliminación

### Semana 3: Backend API
1. ✅ Endpoint para guardar consentimientos
2. ✅ Endpoint para exportar datos (GDPR Art. 20)
3. ✅ Endpoint para eliminar cuenta

### Semana 4: Testing y Auditoría
1. ✅ Verificar flujo completo de consentimientos
2. ✅ Probar exportación de datos
3. ✅ Simular solicitud de eliminación

---

¿Quieres que implemente alguno de estos componentes específicamente? 🚀
