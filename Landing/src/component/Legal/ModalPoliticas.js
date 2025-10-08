import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Alert } from 'reactstrap';

/**
 * Modal de Aceptación de Políticas
 * Muestra términos y condiciones + política de privacidad
 * Guarda consentimiento en base de datos
 */
export default function ModalPoliticas({ show, onHide, onAceptar, tipo = 'calculo' }) {
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Detectar navegador simplificado
  const detectarNavegador = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Desconocido';
  };

  // Detectar sistema operativo simplificado
  const detectarSO = () => {
    const platform = navigator.platform;
    const ua = navigator.userAgent;
    if (platform.includes('Win')) return 'Windows';
    if (platform.includes('Mac')) return 'macOS';
    if (platform.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return platform;
  };

  const handleAceptar = async () => {
    if (!acepta) {
      setError('Debe aceptar los términos y condiciones para continuar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📤 Enviando consentimiento a /api/consentimiento...');
      
      // Guardar consentimiento en base de datos
      const response = await fetch('/api/consentimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acepta_terminos: true,
          acepta_privacidad: true,
          acepta_cookies_necesarias: true,
          acepta_cookies_analiticas: false,
          version_terminos: 'v1.0',
          version_privacidad: 'v1.0',
          navegador: detectarNavegador(),
          sistema_operativo: detectarSO()
        })
      });

      console.log('📥 Respuesta recibida:', response.status, response.statusText);

      // Verificar que la respuesta sea OK
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      // Verificar que sea JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Respuesta no es JSON:', textResponse.substring(0, 200));
        throw new Error('El servidor no devolvió una respuesta JSON válida. Por favor, verifique que el servidor esté funcionando correctamente.');
      }

      const resultado = await response.json();
      console.log('📦 Resultado parseado:', resultado);

      if (resultado.success) {
        console.log('✅ Consentimiento guardado:', resultado.id);
        
        // Guardar en localStorage para no volver a mostrar
        localStorage.setItem('consentimientoAceptado', 'true');
        localStorage.setItem('consentimientoId', resultado.id);
        localStorage.setItem('consentimientoFecha', resultado.fecha);
        
        // Llamar callback de éxito
        onAceptar();
      } else {
        throw new Error(resultado.error || 'Error al guardar consentimiento');
      }
    } catch (err) {
      console.error('❌ Error completo:', err);
      
      // Mensaje de error más amigable
      let mensajeError = err.message;
      if (err.message.includes('<!DOCTYPE')) {
        mensajeError = 'El servidor no está respondiendo correctamente. Por favor, verifique que el servidor backend esté iniciado y funcionando.';
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setAcepta(false);
    setError(null);
    onHide();
  };

  return (
    <Modal 
      isOpen={show} 
      toggle={handleCancelar}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader toggle={handleCancelar}>
        📋 Términos y Condiciones
      </ModalHeader>
      
      <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {error && (
          <Alert color="danger" isOpen={!!error} toggle={() => setError(null)} fade={false}>
            <strong>⚠️ Error:</strong> {error}
          </Alert>
        )}
        
        <div className="mb-4">
          <h5 className="text-primary">🔒 Política de Privacidad y Protección de Datos</h5>
          <p className="text-muted mb-3">
            <small>Versión 1.0 - Vigente desde el 3 de octubre de 2025</small>
          </p>
          
          <div className="p-3 bg-light rounded">
            <h6>1. RESPONSABLE DEL TRATAMIENTO DE DATOS</h6>
            <p>
              <strong>Mundo Verde S.A.S.</strong> es responsable del tratamiento de sus datos personales.
              Puede contactarnos en: <a href="mailto:privacidad@mundoverde.com">privacidad@mundoverde.com</a>
            </p>

            <h6>2. DATOS QUE RECOPILAMOS</h6>
            <ul>
              <li><strong>Datos de empresa:</strong> Nombre, NIT, sector, ubicación, contacto</li>
              <li><strong>Datos de cálculos:</strong> Consumos energéticos, emisiones, actividades</li>
              <li><strong>Datos técnicos:</strong> IP, navegador, fecha/hora de acceso</li>
            </ul>

            <h6>3. FINALIDAD DEL TRATAMIENTO</h6>
            <p>
              Sus datos serán utilizados exclusivamente para:
            </p>
            <ul>
              <li>Proveer servicios de cálculo de huella de carbono</li>
              <li>Generar reportes y documentos PDF</li>
              <li>Almacenar historial de cálculos</li>
              <li>Cumplir obligaciones legales</li>
            </ul>

            <h6>4. BASE LEGAL</h6>
            <p>
              El tratamiento se basa en su <strong>consentimiento explícito</strong> y en la 
              <strong> ejecución del servicio contratado</strong>.
            </p>

            <h6>5. COMPARTICIÓN DE DATOS</h6>
            <p>
              <strong>NO compartimos</strong> sus datos con terceros, excepto:
            </p>
            <ul>
              <li>Proveedores de infraestructura (bajo acuerdos de confidencialidad)</li>
              <li>Autoridades cuando sea legalmente requerido</li>
            </ul>

            <h6>6. SUS DERECHOS (GDPR / Ley 1581 de 2012)</h6>
            <ul>
              <li>✅ <strong>Acceso:</strong> Conocer qué datos tenemos</li>
              <li>✅ <strong>Rectificación:</strong> Corregir datos inexactos</li>
              <li>✅ <strong>Supresión:</strong> Solicitar eliminación (derecho al olvido)</li>
              <li>✅ <strong>Oposición:</strong> Oponerse al tratamiento</li>
              <li>✅ <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
              <li>✅ <strong>Revocar consentimiento:</strong> En cualquier momento</li>
            </ul>

            <h6>7. RETENCIÓN DE DATOS</h6>
            <ul>
              <li>Cálculos activos: Mientras la cuenta esté activa</li>
              <li>Cálculos históricos: 5 años o hasta que solicite eliminación</li>
              <li>Logs de auditoría: 2 años</li>
            </ul>

            <h6>8. SEGURIDAD</h6>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas:
            </p>
            <ul>
              <li>Cifrado de datos en tránsito (SSL/TLS)</li>
              <li>Cifrado de datos en reposo (AES-256)</li>
              <li>Control de acceso y autenticación</li>
              <li>Copias de seguridad diarias</li>
              <li>Auditorías de seguridad periódicas</li>
            </ul>

            <h6>9. COOKIES</h6>
            <p>
              Utilizamos únicamente <strong>cookies estrictamente necesarias</strong> para:
            </p>
            <ul>
              <li>Mantener su sesión activa</li>
              <li>Recordar preferencias básicas</li>
              <li>Seguridad CSRF</li>
            </ul>
            <p>
              <strong>NO utilizamos</strong> cookies de marketing o publicidad.
            </p>

            <h6>10. CONTACTO - OFICIAL DE PROTECCIÓN DE DATOS</h6>
            <p>
              Para ejercer sus derechos o consultas sobre privacidad:<br />
              📧 Email: <a href="mailto:dpo@mundoverde.com">dpo@mundoverde.com</a><br />
              📞 Teléfono: +57 300 627 9039
            </p>

            <h6>11. AUTORIDAD DE SUPERVISIÓN</h6>
            <p>
              Colombia: <strong>Superintendencia de Industria y Comercio (SIC)</strong><br />
              Puede presentar una queja si considera que se han vulnerado sus derechos.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-success">📜 Términos y Condiciones de Uso</h5>
          
          <div className="p-3 bg-light rounded">
            <h6>1. ACEPTACIÓN</h6>
            <p>
              Al utilizar esta plataforma, usted acepta estar vinculado por estos términos.
              Si no está de acuerdo, no utilice el servicio.
            </p>

            <h6>2. SERVICIOS OFRECIDOS</h6>
            <p>
              Mundo Verde proporciona herramientas para:
            </p>
            <ul>
              <li>Cálculo de huella de carbono corporativa</li>
              <li>Autodiagnóstico de sostenibilidad empresarial</li>
              <li>Generación de reportes PDF</li>
              <li>Almacenamiento de historial de cálculos</li>
            </ul>

            <h6>3. CONFIDENCIALIDAD</h6>
            <p>
              Todos los datos empresariales son tratados como <strong>estrictamente confidenciales</strong> 
              y NO serán compartidos con terceros sin su consentimiento explícito.
            </p>

            <h6>4. USO PERMITIDO</h6>
            <p>
              Usted se compromete a:
            </p>
            <ul>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener la confidencialidad de sus credenciales</li>
              <li>No utilizar el servicio para fines ilegales</li>
              <li>No intentar vulnerar la seguridad del sistema</li>
            </ul>

            <h6>5. PROPIEDAD INTELECTUAL</h6>
            <p>
              Los algoritmos, metodologías, contenido y diseño son propiedad de 
              <strong> Mundo Verde S.A.S.</strong> y están protegidos por leyes de propiedad intelectual.
            </p>

            <h6>6. PRECISIÓN DE RESULTADOS</h6>
            <p>
              Los cálculos se basan en factores de emisión reconocidos internacionalmente 
              (IPCC 2006, UPME 2024). Los resultados son <strong>estimaciones</strong> y 
              deben ser validados por profesionales especializados para usos oficiales.
            </p>

            <h6>7. LIMITACIÓN DE RESPONSABILIDAD</h6>
            <p>
              Mundo Verde no se hace responsable por:
            </p>
            <ul>
              <li>Decisiones tomadas basándose únicamente en los resultados</li>
              <li>Errores derivados de datos incorrectos proporcionados por el usuario</li>
              <li>Interrupciones temporales del servicio por mantenimiento</li>
            </ul>

            <h6>8. RETENCIÓN Y ELIMINACIÓN DE DATOS</h6>
            <p>
              Puede solicitar la <strong>eliminación de sus datos</strong> en cualquier momento 
              enviando un correo a: <a href="mailto:dpo@mundoverde.com">dpo@mundoverde.com</a>
            </p>
            <p>
              Procesaremos su solicitud en un plazo máximo de <strong>30 días hábiles</strong>.
            </p>

            <h6>9. MODIFICACIONES</h6>
            <p>
              Nos reservamos el derecho de modificar estos términos. Los cambios serán 
              notificados con <strong>30 días de anticipación</strong>.
            </p>

            <h6>10. LEY APLICABLE</h6>
            <p>
              Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>, 
              especialmente la <strong>Ley 1581 de 2012</strong> (Protección de Datos Personales).
            </p>

            <h6>11. CONTACTO</h6>
            <p>
              Para consultas sobre estos términos:<br />
              📧 Email: <a href="mailto:legal@mundoverde.com">legal@mundoverde.com</a><br />
              📞 Teléfono: +57 300 627 9039
            </p>
          </div>
        </div>

        <div className="border-top pt-3">
          <FormGroup check>
            <Label check>
              <Input 
                type="checkbox"
                id="acepta-politicas"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
              />
              {' '}
              <span style={{ fontSize: '0.95em' }}>
                <strong>He leído y acepto</strong> los Términos y Condiciones y la Política de Privacidad. 
                Entiendo que mis datos serán tratados conforme a la Ley 1581 de 2012 y que puedo 
                ejercer mis derechos en cualquier momento.
              </span>
            </Label>
          </FormGroup>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          color="secondary" 
          outline
          onClick={handleCancelar}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          color="success" 
          onClick={handleAceptar}
          disabled={!acepta || loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Procesando...
            </>
          ) : (
            '✅ Aceptar y Continuar'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
