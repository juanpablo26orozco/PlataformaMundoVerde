/**
 * EmailService.js
 * Servicio para envío de emails usando SendGrid a través de Azure Functions
 * Mantiene la API Key segura en el backend serverless
 */

class EmailService {
  constructor() {
    // URL del backend integrado en setupProxy.js
    this.functionUrl = '/api/send-email';
    this.fromEmail = process.env.REACT_APP_COMPANY_EMAIL || 'contacto@mundoverde.com';
    this.companyName = process.env.REACT_APP_COMPANY_NAME || 'Mundo Verde';
  }

  /**
   * Verifica si el servicio de email está configurado correctamente
   */
  isConfigured() {
    const configured = !!(this.functionUrl && this.fromEmail);
    if (!configured) {
      console.warn('⚠️ Email service no está configurado. Revisa REACT_APP_EMAIL_FUNCTION_URL y REACT_APP_COMPANY_EMAIL');
    }
    return configured;
  }

  /**
   * Formatea los datos del cálculo de huella de carbono para el email
   */
  formatCarbonFootprintEmail(calculationData) {
    const { datosEmpresa, alcances, totalEmisiones, fecha } = calculationData;
    
    // Proteger contra undefined
    const total = totalEmisiones || 0;
    const alcance1Total = alcances?.alcance1?.total || 0;
    const alcance2Total = alcances?.alcance2?.total || 0;
    const alcance3Total = alcances?.alcance3?.total || 0;
    
    // Calcular árboles necesarios
    const arboles = Math.ceil(total * 18.3); // 1 ton CO2 = 18.3 árboles
    
    return {
      to_email: datosEmpresa?.correo || '',
      to_name: datosEmpresa?.nombreEmpresa || '',
      subject: `🌱 Resultados de Huella de Carbono - ${datosEmpresa?.nombreEmpresa || 'Empresa'}`,
      
      // Datos de la empresa
      empresa_nombre: datosEmpresa?.nombreEmpresa || '-',
      empresa_nit: datosEmpresa?.nit || '-',
      empresa_telefono: datosEmpresa?.telefono || '-',
      empresa_correo: datosEmpresa?.correo || '-',
      
      // Resultados del cálculo
      total_emisiones: total.toFixed(3),
      alcance1: alcance1Total.toFixed(3),
      alcance2: alcance2Total.toFixed(3),
      alcance3: alcance3Total.toFixed(3),
      
      // Cálculos adicionales
      arboles_necesarios: arboles,
      equivalente_autos: Math.ceil(total * 0.22),
      
      // Fecha del cálculo
      fecha_calculo: fecha || new Date().toLocaleDateString('es-CO'),
      
      // Link a la plataforma
      platform_link: window.location.origin,
      
      // Mensaje personalizado
      message: `
📊 RESUMEN DE HUELLA DE CARBONO

🏢 Empresa: ${datosEmpresa.nombreEmpresa}
📅 Fecha: ${fecha || new Date().toLocaleDateString('es-CO')}

═══════════════════════════════════

📈 EMISIONES TOTALES: ${totalEmisiones.toFixed(3)} Ton CO₂e

Distribución por alcances:
• Alcance 1 (Emisiones directas): ${alcances.alcance1?.total?.toFixed(3) || '0.000'} Ton CO₂e
• Alcance 2 (Energía eléctrica): ${alcances.alcance2?.total?.toFixed(3) || '0.000'} Ton CO₂e
• Alcance 3 (Emisiones indirectas): ${alcances.alcance3?.total?.toFixed(3) || '0.000'} Ton CO₂e

═══════════════════════════════════

🌳 PARA COMPENSAR NECESITAS:
• Plantar ${arboles} árboles
• Equivalente a ${Math.ceil(totalEmisiones * 0.22)} autos menos en circulación

═══════════════════════════════════

💚 ¡Gracias por medir tu impacto ambiental!
      `.trim()
    };
  }

  /**
   * Envía el resultado del cálculo de huella de carbono por email usando SendGrid
   * @param {Object} calculationData - Datos del cálculo (resumen)
   * @param {Object} datosCompletos - TODOS los datos del formulario (para el PDF)
   * @returns {Promise<Object>} - {success: boolean, message: string, error?: any}
   */
  async sendCarbonFootprintByEmail(calculationData, datosCompletos) {
    try {
      // Verificar configuración
      if (!this.isConfigured()) {
        alert('⚠️ Servicio de email no configurado.\n\nPor favor contacta al administrador.');
        return {
          success: false,
          message: 'Servicio de email no está configurado.',
          error: 'EMAIL_NOT_CONFIGURED'
        };
      }

      // Validar que hay email del destinatario
      if (!calculationData.datosEmpresa?.correo) {
        alert('⚠️ No se encontró correo electrónico.\n\nPor favor completa el campo de correo en el formulario.');
        return {
          success: false,
          message: 'No se encontró correo electrónico.',
          error: 'NO_EMAIL'
        };
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(calculationData.datosEmpresa.correo)) {
        alert('⚠️ El correo electrónico no es válido.\n\nPor favor verifica el formato.');
        return {
          success: false,
          message: 'Email inválido',
          error: 'INVALID_EMAIL'
        };
      }

      console.log('📧 Preparando envío de email con SendGrid...');
      console.log('📊 Datos del cálculo:', calculationData);

      // Formatear contenido del email
      const emailContent = this.formatCarbonFootprintEmail(calculationData);
      
      const toEmail = calculationData.datosEmpresa.correo;
      console.log('📤 Enviando email a:', toEmail);

      // Preparar request con TODOS los datos para generar el PDF
      const emailData = {
        to: toEmail,
        from: this.fromEmail,
        subject: emailContent.subject,
        text: emailContent.message,
        html: this.generateHTMLEmail(emailContent),
        datosCompletos: datosCompletos // ← NUEVO: Enviar todos los datos para el PDF
      };

      // Enviar email a través del backend integrado (setupProxy.js)
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al enviar email');
      }

      console.log('✅ Email enviado exitosamente:', result);

      alert('✅ ¡Email enviado exitosamente!\n\n📧 Revisa tu bandeja de entrada o spam: ' + toEmail);

      return {
        success: true,
        message: 'Email enviado exitosamente',
        response: result
      };

    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      
      let errorMessage = 'Error al enviar el email. Por favor intenta nuevamente.';
      
      if (error.message) {
        errorMessage = error.message;
      }

      alert('❌ Error al enviar email:\n\n' + errorMessage);

      return {
        success: false,
        message: errorMessage,
        error
      };
    }
  }

  /**
   * Genera HTML para el email
   */
  generateHTMLEmail(emailContent) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; }
    .value { color: #43a047; font-weight: bold; }
    .total { font-size: 24px; color: #2e7d32; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .icon { font-size: 40px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">🌱</div>
      <h1>Resultados de Huella de Carbono</h1>
      <p>${this.companyName}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>🏢 Información de la Empresa</h2>
        <div class="metric">
          <span class="label">Empresa:</span>
          <span class="value">${emailContent.empresa_nombre}</span>
        </div>
        <div class="metric">
          <span class="label">NIT:</span>
          <span class="value">${emailContent.empresa_nit}</span>
        </div>
        <div class="metric">
          <span class="label">Fecha:</span>
          <span class="value">${emailContent.fecha_calculo}</span>
        </div>
      </div>

      <div class="section">
        <h2>📊 Emisiones Totales</h2>
        <div class="total">
          ${emailContent.total_emisiones} Ton CO₂e
        </div>
      </div>

      <div class="section">
        <h2>📈 Distribución por Alcances</h2>
        <div class="metric">
          <span class="label">🏭 Alcance 1 (Directas):</span>
          <span class="value">${emailContent.alcance1} Ton CO₂e</span>
        </div>
        <div class="metric">
          <span class="label">⚡ Alcance 2 (Energía):</span>
          <span class="value">${emailContent.alcance2} Ton CO₂e</span>
        </div>
        <div class="metric">
          <span class="label">🌍 Alcance 3 (Indirectas):</span>
          <span class="value">${emailContent.alcance3} Ton CO₂e</span>
        </div>
      </div>

      <div class="section">
        <h2>🌳 Para Compensar Necesitas:</h2>
        <div class="metric">
          <span class="label">Árboles a plantar:</span>
          <span class="value">${emailContent.arboles_necesarios} árboles</span>
        </div>
        <div class="metric">
          <span class="label">Equivalente a:</span>
          <span class="value">${emailContent.equivalente_autos} autos menos</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p>💚 <strong>¡Gracias por medir tu impacto ambiental!</strong></p>
        <p><a href="${emailContent.platform_link}" style="color: #43a047;">Visitar plataforma</a></p>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 ${this.companyName}. Todos los derechos reservados.</p>
      <p>Este email fue generado automáticamente desde nuestra plataforma de sostenibilidad.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Envía el autodiagnóstico de sostenibilidad por email
   * @param {Object} datosCompletos - Todos los datos del autodiagnóstico
   * @returns {Promise<Object>}
   */
  async sendAutogestionByEmail(datosCompletos) {
    try {
      if (!this.isConfigured()) {
        alert('⚠️ Servicio de email no configurado.\n\nPor favor contacta al administrador.');
        return {
          success: false,
          message: 'Servicio de email no está configurado.',
          error: 'EMAIL_NOT_CONFIGURED'
        };
      }

      if (!datosCompletos.datosEmpresa?.correo) {
        alert('⚠️ No se encontró correo electrónico.\n\nPor favor completa el campo de correo en el formulario.');
        return {
          success: false,
          message: 'No se encontró correo electrónico.',
          error: 'NO_EMAIL'
        };
      }

      console.log('📧 Preparando envío de autodiagnóstico...');

      const toEmail = datosCompletos.datosEmpresa.correo;
      const nombreEmpresa = datosCompletos.datosEmpresa.nombreEmpresa || 'Empresa';

      const emailData = {
        to: toEmail,
        from: this.fromEmail,
        subject: `🌱 Autodiagnóstico de Sostenibilidad - ${nombreEmpresa}`,
        text: `Autodiagnóstico completado para ${nombreEmpresa}. Ver PDF adjunto.`,
        html: this.generateAutogestionHTML(datosCompletos),
        datosCompletos: datosCompletos
      };

      const response = await fetch('/api/send-email-autogestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al enviar email');
      }

      console.log('✅ Email de autodiagnóstico enviado:', result);

      return {
        success: true,
        message: 'Email enviado exitosamente',
        response: result
      };

    } catch (error) {
      console.error('❌ Error al enviar autodiagnóstico:', error);
      throw error;
    }
  }

  /**
   * Genera HTML para el email de autodiagnóstico
   */
  generateAutogestionHTML(datosCompletos) {
    const { datosEmpresa, promedios } = datosCompletos;
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; }
    .value { color: #43a047; font-weight: bold; font-size: 18px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .icon { font-size: 40px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">🌱</div>
      <h1>Autodiagnóstico de Sostenibilidad</h1>
      <p>${this.companyName}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>🏢 ${datosEmpresa.nombreEmpresa}</h2>
        <p><strong>NIT:</strong> ${datosEmpresa.nit || '-'}</p>
        <p><strong>Fecha:</strong> ${datosCompletos.fecha || '-'}</p>
      </div>

      <div class="section">
        <h2>📊 Resultados por Dimensión</h2>
        <div class="metric">
          <span class="label">💼 Diagnóstico Económico:</span>
          <span class="value">${promedios.A.porcentajeFinal.toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="label">🌿 Gestión Ambiental:</span>
          <span class="value">${promedios.B.porcentajeFinal.toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="label">⚡ Gestión Energía:</span>
          <span class="value">${promedios.C.porcentajeFinal.toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="label">🏥 Seguridad y Salud:</span>
          <span class="value">${promedios.D.porcentajeFinal.toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="label">👥 Diagnóstico Social:</span>
          <span class="value">${promedios.E.porcentajeFinal.toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="label">📦 Diagnóstico Almacén:</span>
          <span class="value">${promedios.F.porcentajeFinal.toFixed(1)}%</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p>💚 <strong>¡Gracias por completar el autodiagnóstico!</strong></p>
        <p>Revisa el PDF adjunto para ver el reporte completo con todas las respuestas.</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 ${this.companyName}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Envía un email de contacto simple
   * @param {Object} contactData - {name, email, phone, subject, message}
   * @returns {Promise<Object>}
   */
  async sendContactEmail(contactData) {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: 'Servicio de email no está configurado'
        };
      }

      const emailData = {
        to: this.fromEmail, // Email va a la empresa
        from: this.fromEmail,
        subject: contactData.subject || `Contacto desde ${this.companyName} - ${contactData.name}`,
        text: `
Nombre: ${contactData.name}
Email: ${contactData.email}
Teléfono: ${contactData.phone}

Mensaje:
${contactData.message}
        `.trim(),
        html: `
<h2>Nuevo mensaje de contacto</h2>
<p><strong>Nombre:</strong> ${contactData.name}</p>
<p><strong>Email:</strong> ${contactData.email}</p>
<p><strong>Teléfono:</strong> ${contactData.phone}</p>
<h3>Mensaje:</h3>
<p>${contactData.message}</p>
        `.trim()
      };

      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al enviar email');
      }

      return {
        success: true,
        message: 'Email enviado exitosamente',
        response: result
      };

    } catch (error) {
      console.error('Error enviando email de contacto:', error);
      return {
        success: false,
        message: error.message || 'Error al enviar email',
        error
      };
    }
  }
}

// Exportar instancia única (singleton)
const emailServiceInstance = new EmailService();
export default emailServiceInstance;
