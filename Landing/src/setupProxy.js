const express = require('express');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const PDFDocument = require('pdfkit');
require('dotenv').config();

// ============================================================================
// IMPORT SERVICES
// ============================================================================
const { verificarConexion, ejecutarQuery } = require('./database/config');
const DatabaseService = require('./services/DatabaseService');

module.exports = function(app) {
  app.use(express.json({ limit: '50mb' }));

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid configurado');
  }
  
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Generate assessment tracking code - USANDO SECUENCIA DE BD COMO HC
   */
  async function generateAssessmentCode() {
    try {
      // Usar la misma función de la BD que usa Huella de Carbono
      const result = await ejecutarQuery(
        "SELECT generar_codigo_seguimiento('AG') as codigo"
      );
      
      if (result.success && result.data.length > 0) {
        return result.data[0].codigo;
      } else {
        throw new Error('Error al generar código de seguimiento');
      }
    } catch (error) {
      console.error('❌ Error generando código AG:', error);
      // FALLBACK: usar método anterior solo en caso de error
      const year = new Date().getFullYear();
      const now = new Date();
      const timestamp = now.getTime();
      const ms = now.getMilliseconds().toString().padStart(3, '0');
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const unique = (timestamp.toString().slice(-4) + ms + random).slice(0, 6);
      return `AG-${year}-${unique}`;
    }
  }
  
  /**
   * Generate assessment PDF
   */
  async function generateAssessmentPDF(data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // Header
        doc.fontSize(24).fillColor('#43a047').text('SUSTAINABILITY SELF-ASSESSMENT', { align: 'center' });
        doc.moveDown(2);
        
        // Company data
        doc.fontSize(16).fillColor('#2e7d32').text('Company Information', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        doc.text('Name: ' + (data.empresa?.nombre || ''));
        doc.text('NIT: ' + (data.empresa?.nit || ''));
        doc.text('Address: ' + (data.empresa?.direccion || ''));
        doc.text('Location: ' + (data.empresa?.municipio || '') + ', ' + (data.empresa?.departamento || ''));
        doc.text('Phone: ' + (data.empresa?.telefono || ''));
        doc.text('Email: ' + (data.empresa?.correo || ''));
        doc.text('Prepared by: ' + (data.empresa?.personaElabora || '') + ' - ' + (data.empresa?.cargo || ''));
        doc.text('Date: ' + new Date().toLocaleDateString());
        doc.moveDown(2);
        
        // Executive summary
        doc.addPage();
        doc.fontSize(20).fillColor('#43a047').text('EXECUTIVE SUMMARY', { align: 'center' });
        doc.moveDown(1.5);
        
        doc.fontSize(14).fillColor('#2e7d32').text('Results by Dimension');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        
        const results = data.resultados || {};
        doc.text('Economic Management: ' + (results.porcentajeEconomico || 0).toFixed(1) + '%');
        doc.text('Environmental Management: ' + (results.porcentajeAmbiental || 0).toFixed(1) + '%');
        doc.text('Energy Management: ' + (results.porcentajeEnergia || 0).toFixed(1) + '%');
        doc.text('Safety & Health: ' + (results.porcentajeSeguridad || 0).toFixed(1) + '%');
        doc.text('Social Management: ' + (results.porcentajeSocial || 0).toFixed(1) + '%');
        doc.text('Warehouse & Logistics: ' + (results.porcentajeAlmacen || 0).toFixed(1) + '%');
        doc.moveDown(2);
        
        // Detailed sections
        const sections = [
          { key: 'porcentajeEconomico', title: 'ECONOMIC MANAGEMENT' },
          { key: 'porcentajeAmbiental', title: 'ENVIRONMENTAL MANAGEMENT' },
          { key: 'porcentajeEnergia', title: 'ENERGY MANAGEMENT' },
          { key: 'porcentajeSeguridad', title: 'SAFETY & HEALTH' },
          { key: 'porcentajeSocial', title: 'SOCIAL MANAGEMENT' },
          { key: 'porcentajeAlmacen', title: 'WAREHOUSE & LOGISTICS' }
        ];
        
        sections.forEach(section => {
          doc.addPage();
          doc.fontSize(18).fillColor('#43a047').text(section.title, { align: 'center' });
          doc.moveDown(0.5);
          
          const percentage = results[section.key] || 0;
          doc.fontSize(12).fillColor('#2e7d32').text('Final Percentage: ' + percentage.toFixed(1) + '%', { align: 'center' });
          doc.moveDown(1.5);
          
          doc.fontSize(12).text('This section has been properly evaluated.');
          doc.moveDown(0.5);
          doc.fontSize(10).text('Percentage obtained: ' + percentage.toFixed(1) + '%');
          doc.moveDown(1);
          doc.text('Note: Specific details are available in the management system.');
        });
        
        doc.end();
      } catch (error) {
        console.error('❌ Error generating PDF:', error);
        reject(error);
      }
    });
  }
  
  // ============================================================================
  // DATABASE CONNECTION
  // ============================================================================
  // VERIFICAR CONEXIÓN A BASE DE DATOS AL INICIAR
  // ============================================================================
  verificarConexion().then(success => {
    if (success) {
      console.log('✅ Base de datos conectada y lista!');
    } else {
      console.warn('⚠️  La aplicación seguirá funcionando pero sin base de datos');
    }
  });

  // Función para generar PDF del Autodiagnóstico
  function generarPDFAutogestion(datos) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // PORTADA
        doc.fontSize(24).fillColor('#43a047').text('AUTODIAGNOSTICO DE SOSTENIBILIDAD', { align: 'center' });
        doc.moveDown(2);
        
        // DATOS DE EMPRESA
        doc.fontSize(16).fillColor('#2e7d32').text('Datos de la Empresa', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        doc.text('Nombre: ' + (datos.datosEmpresa.nombreEmpresa || ''));
        doc.text('NIT: ' + (datos.datosEmpresa.nit || ''));
        doc.text('Direccion: ' + (datos.datosEmpresa.direccion || ''));
        doc.text('Ubicacion: ' + (datos.datosEmpresa.municipio || '') + ', ' + (datos.datosEmpresa.departamento || ''));
        doc.text('Telefono: ' + (datos.datosEmpresa.telefono || ''));
        doc.text('Correo: ' + (datos.datosEmpresa.correo || ''));
        doc.text('Elaborado por: ' + (datos.datosEmpresa.personaElabora || '') + ' - ' + (datos.datosEmpresa.cargo || ''));
        doc.text('Fecha: ' + (datos.fecha || ''));
        doc.moveDown(2);
        
        // RESUMEN EJECUTIVO
        doc.addPage();
        doc.fontSize(20).fillColor('#43a047').text('RESUMEN EJECUTIVO', { align: 'center' });
        doc.moveDown(1.5);
        
        doc.fontSize(14).fillColor('#2e7d32').text('Resultados por Dimension');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        doc.text('Diagnostico Economico: ' + (datos.promedios.A.porcentajeFinal.toFixed(1)) + '%');
        doc.text('Gestion Ambiental: ' + (datos.promedios.B.porcentajeFinal.toFixed(1)) + '%');
        doc.text('Gestion Energia: ' + (datos.promedios.C.porcentajeFinal.toFixed(1)) + '%');
        doc.text('Seguridad y Salud: ' + (datos.promedios.D.porcentajeFinal.toFixed(1)) + '%');
        doc.text('Diagnostico Social: ' + (datos.promedios.E.porcentajeFinal.toFixed(1)) + '%');
        doc.text('Diagnostico Almacen: ' + (datos.promedios.F.porcentajeFinal.toFixed(1)) + '%');
        doc.moveDown(2);
        
        // SECCION A
        generarSeccionPDF(doc, 'A', 'DIAGNOSTICO ECONOMICO', datos);
        
        // SECCION B
        generarSeccionPDF(doc, 'B', 'GESTION AMBIENTAL', datos);
        
        // SECCION C
        generarSeccionPDF(doc, 'C', 'GESTION ENERGIA', datos);
        
        // SECCION D
        generarSeccionPDF(doc, 'D', 'SEGURIDAD Y SALUD', datos);
        
        // SECCION E
        generarSeccionPDF(doc, 'E', 'DIAGNOSTICO SOCIAL', datos);
        
        // SECCION F
        generarSeccionPDF(doc, 'F', 'DIAGNOSTICO ALMACEN', datos);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Función auxiliar para generar cada sección
  function generarSeccionPDF(doc, seccionId, tituloSeccion, datos) {
    doc.addPage();
    doc.fontSize(18).fillColor('#43a047').text(tituloSeccion, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#2e7d32').text('Porcentaje Final: ' + datos.promedios[seccionId].porcentajeFinal.toFixed(1) + '%', { align: 'center' });
    doc.moveDown(1.5);
    
    const esquema = datos.esquemas['seccion' + seccionId];
    const respuestas = datos.respuestas['seccion' + seccionId];
    const opciones = seccionId === 'E' ? datos.opciones.seccionE : datos.opciones.standard;
    
    esquema.blocks.forEach((block, blockIdx) => {
      // Verificar si hay espacio suficiente en la página
      if (doc.y > 650) {
        doc.addPage();
      }
      
      doc.fontSize(13).fillColor('#2e7d32').text(block.title);
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#666').text('Promedio del bloque: ' + (datos.promedios[seccionId].bloques[block.id]?.toFixed(2) || 'N/A'));
      doc.moveDown(0.5);
      
      block.questions.forEach((question, qIdx) => {
        // Verificar espacio
        if (doc.y > 700) {
          doc.addPage();
        }
        
        const respuesta = respuestas[question.id];
        const opcionSeleccionada = opciones.find(opt => opt.value === respuesta);
        
        doc.fontSize(9).fillColor('#000');
        doc.text((qIdx + 1) + '. ' + question.text, { width: 500 });
        doc.fontSize(9).fillColor('#43a047');
        doc.text('   Respuesta: ' + (opcionSeleccionada ? opcionSeleccionada.label + ' (' + opcionSeleccionada.score + ')' : 'Sin responder'));
        doc.moveDown(0.3);
      });
      
      doc.moveDown(0.5);
    });
  }

  function generarPDFHuella(datos) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // ENCABEZADO
        doc.fontSize(22).fillColor('#43a047').text('REPORTE HUELLA DE CARBONO', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text(datos.datosEmpresa.nombreEmpresa || '', { align: 'center' });
        doc.fontSize(11).text('Fecha: ' + (datos.fecha || ''), { align: 'center' });
        doc.moveDown(2);
        
        // DATOS EMPRESA
        doc.fontSize(14).text('Informacion de la Empresa');
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.text('NIT: ' + (datos.datosEmpresa.nit || ''));
        doc.text('Sector: ' + (datos.datosEmpresa.sector || ''));
        doc.text('Ciudad: ' + (datos.datosEmpresa.ciudad || ''));
        doc.text('Correo: ' + (datos.datosEmpresa.correo || ''));
        doc.moveDown(2);
        
        // RESUMEN
        doc.fontSize(14).text('Resumen Emisiones');
        doc.moveDown(0.5);
        const total = datos.totalEmisiones || 0;
        doc.fontSize(26).fillColor('#43a047').text(total.toFixed(3) + ' Ton CO2e', { align: 'center' });
        doc.moveDown(2);
        
        // DETALLE
        doc.addPage();
        doc.fontSize(18).fillColor('#43a047').text('COMBUSTIBLES');
        doc.moveDown();
        
        // SOLIDOS
        if (datos.solidos && datos.solidos.length > 0) {
          const solidosConDatos = datos.solidos.filter(row => row.tipo || row.combustible || row.consumo > 0);
          if (solidosConDatos.length > 0) {
            doc.fontSize(14).fillColor('#2e7d32').text('Combustibles Solidos');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            solidosConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.combustible || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' kg');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        }
        
        // LIQUIDOS
        if (datos.liquidos && datos.liquidos.length > 0) {
          const liquidosConDatos = datos.liquidos.filter(row => row.tipo || row.combustible || row.consumo > 0);
          if (liquidosConDatos.length > 0) {
            doc.fontSize(14).fillColor('#2e7d32').text('Combustibles Liquidos');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            liquidosConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.combustible || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' galones');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        }
        
        // GASEOSOS
        if (datos.gaseosos && datos.gaseosos.length > 0) {
          const gaseososConDatos = datos.gaseosos.filter(row => row.tipo || row.combustible || row.consumo > 0);
          if (gaseososConDatos.length > 0) {
            doc.fontSize(14).fillColor('#2e7d32').text('Combustibles Gaseosos');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            gaseososConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.combustible || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' m3');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        }
        
        // LIQUIDOS MOVILES
        if (datos.liquidosMoviles && datos.liquidosMoviles.length > 0) {
          const liquidosMovilesConDatos = datos.liquidosMoviles.filter(row => row.tipo || row.combustible || row.consumo > 0);
          if (liquidosMovilesConDatos.length > 0) {
            doc.addPage();
            doc.fontSize(14).fillColor('#2e7d32').text('Liquidos Moviles');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            liquidosMovilesConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.combustible || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' galones');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        }
        
        // GASEOSOS MOVILES
        if (datos.gaseososMoviles && datos.gaseososMoviles.length > 0) {
          const gaseososMovilesConDatos = datos.gaseososMoviles.filter(row => row.tipo || row.combustible || row.consumo > 0);
          if (gaseososMovilesConDatos.length > 0) {
            doc.fontSize(14).fillColor('#2e7d32').text('Gaseosos Moviles');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            gaseososMovilesConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.combustible || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' m3');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        }
        
        // EXTINTORES
        if (datos.extintores && datos.extintores.length > 0) {
          const extintoresConDatos = datos.extintores.filter(row => row.tipo && (row.cantidad > 0 || row.emisionesParciales > 0));
          if (extintoresConDatos.length > 0) {
            doc.addPage();
            doc.fontSize(18).fillColor('#43a047').text('EXTINTORES');
            doc.moveDown();
            doc.fontSize(14).fillColor('#2e7d32').text('Sistemas de extincion');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            extintoresConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || 'N/A'));
              doc.text('   Cantidad anual recargada: ' + (row.cantidad || 0) + ' kg');
              doc.text('   PCG (Potencial de Calentamiento Global): ' + (row.pcg || 0));
              doc.text('   Emisiones Parciales: ' + ((row.emisionesParciales || 0).toFixed(4)) + ' kg CO2');
              doc.text('   Emisiones Totales: ' + (((row.emisionesParciales || 0) / 1000).toFixed(4)) + ' Ton CO2 eq');
              doc.moveDown(0.3);
            });
            
            // Total de extintores
            const totalExtintores = extintoresConDatos.reduce((sum, row) => sum + (parseFloat(row.emisionesParciales) || 0), 0) / 1000;
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#43a047');
            doc.text('TOTAL EMISIONES EXTINTORES: ' + totalExtintores.toFixed(4) + ' Ton CO2 eq', { align: 'right' });
            doc.fontSize(11).fillColor('#000');
            doc.moveDown();
          }
        }
        
        // ELECTRICIDAD
        if (datos.electricidad && datos.electricidad.length > 0) {
          const electricidadConDatos = datos.electricidad.filter(row => row.instalacion || row.consumoAnual > 0);
          if (electricidadConDatos.length > 0) {
            doc.addPage();
            doc.fontSize(18).fillColor('#43a047').text('ELECTRICIDAD');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            electricidadConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Instalacion: ' + (row.instalacion || 'N/A') + ' | Año: ' + (row.año||'undefined'));
              doc.text('   Ene: ' + (row.enero||0) + ' | Feb: ' + (row.febrero||0) + ' | Mar: ' + (row.marzo||0));
              doc.text('   Abr: ' + (row.abril||0) + ' | May: ' + (row.mayo||0) + ' | Jun: ' + (row.junio||0));
              doc.text('   Jul: ' + (row.julio||0) + ' | Ago: ' + (row.agosto||0) + ' | Sep: ' + (row.septiembre||0));
              doc.text('   Oct: ' + (row.octubre||0) + ' | Nov: ' + (row.noviembre||0) + ' | Dic: ' + (row.diciembre||0));
              doc.text('   Consumo Anual: ' + ((row.consumoAnual || 0).toFixed(2)) + ' kWh');
              doc.text('   Emisiones: ' + ((row.emisionesTotales || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.5);
            });
          }
        }
        
        // VUELOS
        if (datos.vuelos && datos.vuelos.length > 0) {
          const vuelosConDatos = datos.vuelos.filter(row => row.origen || row.destino);
          if (vuelosConDatos.length > 0) {
            doc.addPage();
            doc.fontSize(18).fillColor('#43a047').text('VUELOS CORPORATIVOS');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            vuelosConDatos.forEach((row, i) => {
              doc.text((i+1) + '. ' + (row.origen || 'N/A') + ' -> ' + (row.destino || 'N/A'));
              doc.text('   Clase: ' + (row.clase || 'N/A') + ' | Personas: ' + (row.personas || 0));
              doc.text('   Distancia: ' + (row.distancia || 0) + ' km');
              doc.text('   Emisiones: ' + ((row.emisionTon || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.5);
            });
          }
        }
        
        // COMPENSACION
        doc.addPage();
        const arboles = Math.ceil(total * 18.3);
        doc.fontSize(18).fillColor('#43a047').text('COMPENSACION', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text('Plantar ' + arboles.toLocaleString() + ' arboles', { align: 'center' });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  app.post('/api/send-email', async (req, res) => {
    try {
      const { to, subject, html, datosCompletos } = req.body;
      
      if (!to || !subject || !datosCompletos) {
        return res.status(400).json({ success: false, error: 'Faltan campos' });
      }
      
      // DEBUG: Ver qué datos están llegando
      console.log('=== DATOS RECIBIDOS ===');
      console.log('Solidos:', datosCompletos.solidos ? datosCompletos.solidos.length : 0);
      console.log('Liquidos:', datosCompletos.liquidos ? datosCompletos.liquidos.length : 0);
      console.log('Gaseosos:', datosCompletos.gaseosos ? datosCompletos.gaseosos.length : 0);
      console.log('LiquidosMoviles:', datosCompletos.liquidosMoviles ? datosCompletos.liquidosMoviles.length : 0);
      console.log('GaseososMoviles:', datosCompletos.gaseososMoviles ? datosCompletos.gaseososMoviles.length : 0);
      console.log('Extintores:', datosCompletos.extintores ? datosCompletos.extintores.length : 0);
      console.log('Electricidad:', datosCompletos.electricidad ? datosCompletos.electricidad.length : 0);
      console.log('Vuelos:', datosCompletos.vuelos ? datosCompletos.vuelos.length : 0);
      
      const pdfBuffer = await generarPDFHuella(datosCompletos);
      const nombreArchivo = 'Huella_Carbono_' + datosCompletos.datosEmpresa.nombreEmpresa.replace(/\s+/g, '_') + '.pdf';
      
      await sgMail.send({
        to,
        from: process.env.SENDER_EMAIL || 'juanpablo26orozco@gmail.com',
        subject,
        html,
        attachments: [{
          content: pdfBuffer.toString('base64'),
          filename: nombreArchivo,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      });
      
      res.json({ success: true, message: 'Email enviado' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Endpoint para generar PDF de autodiagnóstico (sin enviar email)
  app.post('/api/generar-pdf-autogestion', async (req, res) => {
    try {
      const datosCompletos = req.body;
      
      if (!datosCompletos || !datosCompletos.datosEmpresa) {
        return res.status(400).json({ success: false, error: 'Faltan datos' });
      }
      
      console.log('=== GENERANDO PDF AUTODIAGNOSTICO ===');
      console.log('Empresa:', datosCompletos.datosEmpresa.nombreEmpresa);
      
      const pdfBuffer = await generarPDFAutogestion(datosCompletos);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Autodiagnostico.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Endpoint para enviar autodiagnóstico por email
  app.post('/api/send-email-autogestion', async (req, res) => {
    try {
      const { to, subject, html, datosCompletos } = req.body;
      
      if (!to || !subject || !datosCompletos) {
        return res.status(400).json({ success: false, error: 'Faltan campos' });
      }
      
      console.log('=== ENVIANDO AUTODIAGNOSTICO POR EMAIL ===');
      console.log('Para:', to);
      console.log('Empresa:', datosCompletos.datosEmpresa.nombreEmpresa);
      
      const pdfBuffer = await generarPDFAutogestion(datosCompletos);
      const nombreArchivo = 'Autodiagnostico_' + datosCompletos.datosEmpresa.nombreEmpresa.replace(/\s+/g, '_') + '.pdf';
      
      await sgMail.send({
        to,
        from: process.env.SENDER_EMAIL || 'juanpablo26orozco@gmail.com',
        subject,
        html,
        attachments: [{
          content: pdfBuffer.toString('base64'),
          filename: nombreArchivo,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      });
      
      res.json({ success: true, message: 'Email enviado' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.use('/Documentation', express.static(path.join(__dirname, '../public/Documentation'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    }
  }));
  
  // ============================================================================
  // NUEVOS ENDPOINTS DE BASE DE DATOS
  // ============================================================================
  
  /**
   * POST /api/guardar-huella
   * Guarda un cálculo completo de huella de carbono en la base de datos
   * Retorna: { success: true, codigo: "HC-2025-000001", id: "uuid..." }
   */
  app.post('/api/guardar-huella', async (req, res) => {
    try {
      console.log('\n💾 === GUARDANDO HUELLA DE CARBONO ===');
      const datosCompletos = req.body;
      
      if (!datosCompletos || !datosCompletos.datosEmpresa) {
        return res.status(400).json({ 
          success: false, 
          error: 'Faltan datos de la empresa' 
        });
      }
      
      // Transformar datos del frontend al formato de base de datos
      const datosParaBD = {
        empresa: {
          nombre: datosCompletos.datosEmpresa.nombreEmpresa,
          nit: datosCompletos.datosEmpresa.nit,
          sector: datosCompletos.datosEmpresa.sector,
          departamento: datosCompletos.datosEmpresa.departamento,
          municipio: datosCompletos.datosEmpresa.municipio || datosCompletos.datosEmpresa.ciudad,
          direccion: datosCompletos.datosEmpresa.direccion,
          telefono: datosCompletos.datosEmpresa.telefono,
          correo: datosCompletos.datosEmpresa.correo,
          personaElabora: datosCompletos.datosEmpresa.personaElabora,
          cargo: datosCompletos.datosEmpresa.cargo
        },
        añoReporte: new Date(datosCompletos.fecha).getFullYear(),
        fechaReporte: datosCompletos.fecha,
        periodoInicio: datosCompletos.periodoInicio,
        periodoFin: datosCompletos.periodoFin,
        
        // Combustibles
        combustiblesSolidos: datosCompletos.solidos || [],
        combustiblesLiquidos: (datosCompletos.liquidos || []).map(c => ({
          ...c,
          tipoFuente: 'Estacionario'
        })),
        combustiblesGaseosos: (datosCompletos.gaseosos || []).map(c => ({
          ...c,
          tipoFuente: 'Estacionario'
        })),
        
        // Agregar móviles
        combustiblesLiquidosMoviles: (datosCompletos.liquidosMoviles || []).map(c => ({
          ...c,
          tipoFuente: 'Móvil'
        })),
        combustiblesGaseososMoviles: (datosCompletos.gaseososMoviles || []).map(c => ({
          ...c,
          tipoFuente: 'Móvil'
        })),
        
        // Electricidad y vuelos
        electricidad: datosCompletos.electricidad || [],
        vuelosAereos: datosCompletos.vuelos || [],
        extintores: datosCompletos.extintores || [],
        
        // Evaluación
        evaluacion: {
          nivel: datosCompletos.nivel,
          arbolesCompensar: datosCompletos.arbolesCompensar || Math.ceil((datosCompletos.totalEmisiones || 0) * 18.3)
        },
        
        notas: datosCompletos.notas
      };
      
      // Combinar todos los combustibles líquidos y gaseosos
      datosParaBD.combustiblesLiquidos = [
        ...datosParaBD.combustiblesLiquidos,
        ...datosParaBD.combustiblesLiquidosMoviles
      ];
      
      datosParaBD.combustiblesGaseosos = [
        ...datosParaBD.combustiblesGaseosos,
        ...datosParaBD.combustiblesGaseososMoviles
      ];
      
      // Guardar en base de datos
      const resultado = await DatabaseService.guardarHuellaCarbono(datosParaBD);
      
      if (resultado.success) {
        console.log(`✅ Huella guardada con código: ${resultado.data.codigo}`);
        res.json({
          success: true,
          codigo: resultado.data.codigo,
          id: resultado.data.id,
          emisiones: resultado.data.emisiones,
          mensaje: `Cálculo guardado exitosamente con código: ${resultado.data.codigo}`
        });
      } else {
        throw new Error(resultado.error);
      }
      
    } catch (error) {
      console.error('❌ Error guardando huella:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error al guardar el cálculo' 
      });
    }
  });
  
  /**
   * POST /api/guardar-autogestion
   * Guarda un autodiagnóstico completo de sostenibilidad
   * Retorna: { success: true, codigo: "AG-2025-000001", id: "uuid..." }
   */
  app.post('/api/guardar-autogestion', async (req, res) => {
    try {
      console.log('\n💾 === GUARDANDO AUTOGESTIÓN ===');
      const datosCompletos = req.body;
      
      if (!datosCompletos || !datosCompletos.datosEmpresa) {
        return res.status(400).json({ 
          success: false, 
          error: 'Faltan datos de la empresa' 
        });
      }
      
      // Transformar datos del frontend al formato de base de datos
      const datosParaBD = {
        empresa: {
          nombre: datosCompletos.datosEmpresa.nombreEmpresa,
          nit: datosCompletos.datosEmpresa.nit,
          sector: datosCompletos.datosEmpresa.sector,
          departamento: datosCompletos.datosEmpresa.departamento,
          municipio: datosCompletos.datosEmpresa.municipio,
          direccion: datosCompletos.datosEmpresa.direccion,
          telefono: datosCompletos.datosEmpresa.telefono,
          correo: datosCompletos.datosEmpresa.correo,
          personaElabora: datosCompletos.datosEmpresa.personaElabora,
          cargo: datosCompletos.datosEmpresa.cargo
        },
        añoReporte: datosCompletos.datosEmpresa.añoBase || 2024,
        fechaReporte: datosCompletos.datosEmpresa.fechaReporte || new Date().toISOString().split('T')[0],
        
        // Resultados directos del frontend optimizado
        resultados: {
          porcentajeEconomico: datosCompletos.resultados.porcentajeEconomico,
          porcentajeAmbiental: datosCompletos.resultados.porcentajeAmbiental,
          porcentajeEnergia: datosCompletos.resultados.porcentajeEnergia,
          porcentajeSeguridad: datosCompletos.resultados.porcentajeSeguridad,
          porcentajeSocial: datosCompletos.resultados.porcentajeSocial,
          porcentajeAlmacen: datosCompletos.resultados.porcentajeAlmacen,
          porcentajeFinal: datosCompletos.resultados.porcentajeFinal,
          nivelCumplimiento: datosCompletos.nivelCumplimiento
        },
        
        // Respuestas individuales (para JSON)
        respuestas: datosCompletos.respuestas || {},
        
        // Promedios por bloque (para JSON)
        promediosBloques: datosCompletos.promediosBloques || [],
        
        // AGREGAR: Esquemas y opciones para generar PDF completo
        esquemas: datosCompletos.esquemas || {},
        opciones: datosCompletos.opciones || {},
        
        // Promedios en formato original para PDF
        promedios: datosCompletos.promedios || {}
      };
      
      console.log('📊 Datos preparados para BD:', {
        empresa: datosParaBD.empresa.nombre,
        porcentajes: datosParaBD.resultados,
        respuestas: Object.keys(datosCompletos.respuestas || {}).length,
        promedios: datosParaBD.promediosBloques.length
      });
      
      // Save to PostgreSQL directly (optimized approach)
      // 🆕 GENERAR CÓDIGO SECUENCIAL USANDO LA FUNCIÓN DE BD
      console.log('🔖 Generando código secuencial...');
      const codigoResult = await ejecutarQuery(
        "SELECT generar_codigo_seguimiento('AG') as codigo", 
        []
      );
      
      if (!codigoResult.success) {
        throw new Error('Error generando código de seguimiento: ' + codigoResult.error);
      }
      
      const code = codigoResult.data[0].codigo;
      console.log(`✅ Código secuencial generado: ${code}`);
      
      // 🆕 GENERAR PDF Y CONVERTIR A BASE64 PARA GUARDAR
      console.log('📄 Generando PDF para guardar en BD...');
      console.log('🔍 Estructura de datosCompletos:', {
        datosEmpresa: datosCompletos.datosEmpresa ? 'OK' : 'MISSING',
        resultados: datosCompletos.resultados ? 'OK' : 'MISSING',
        promedios: datosCompletos.promedios ? 'OK' : 'MISSING',
        esquemas: datosCompletos.esquemas ? `OK (${Object.keys(datosCompletos.esquemas).length} secciones)` : 'MISSING',
        respuestas: datosCompletos.respuestas ? `OK (${Object.keys(datosCompletos.respuestas).length} secciones)` : 'MISSING',
        opciones: datosCompletos.opciones ? 'OK' : 'MISSING',
        fecha: datosCompletos.fecha || datosCompletos.datosEmpresa?.fechaReporte
      });
      
      // 🔍 VERIFICAR RESPUESTAS DETALLADAMENTE
      if (datosCompletos.respuestas) {
        console.log('📝 Detalle de respuestas por sección:');
        Object.keys(datosCompletos.respuestas).forEach(seccion => {
          const respuestasSeccion = datosCompletos.respuestas[seccion];
          console.log(`   ${seccion}: ${Object.keys(respuestasSeccion).length} respuestas`);
        });
      }
      
      // 🔍 VERIFICAR ESQUEMAS DETALLADAMENTE  
      if (datosCompletos.esquemas) {
        console.log('📋 Detalle de esquemas por sección:');
        Object.keys(datosCompletos.esquemas).forEach(seccion => {
          const esquema = datosCompletos.esquemas[seccion];
          if (esquema && esquema.blocks) {
            const totalPreguntas = esquema.blocks.reduce((total, block) => total + (block.questions ? block.questions.length : 0), 0);
            console.log(`   ${seccion}: ${esquema.blocks.length} bloques, ${totalPreguntas} preguntas`);
          }
        });
      }
      
      let pdfBase64 = null;
      
      try {
        // 🆕 USAR DATOS COMPLETOS PARA PDF (igual que descarga dinámica)
        console.log('📄 Usando datos completos para PDF...');
        
        // 🔍 VERIFICAR QUÉ DATOS TENEMOS EXACTAMENTE
        console.log('🔍 Verificación detallada de datos:');
        console.log('  - promedios:', datosCompletos.promedios ? 'SÍ' : 'NO');
        console.log('  - esquemas:', datosCompletos.esquemas ? 'SÍ' : 'NO'); 
        console.log('  - respuestas:', datosCompletos.respuestas ? 'SÍ' : 'NO');
        
        if (datosCompletos.respuestas) {
          console.log('📝 Respuestas encontradas:');
          Object.keys(datosCompletos.respuestas).forEach(seccion => {
            const respuestasSeccion = datosCompletos.respuestas[seccion];
            console.log(`   ${seccion}: ${Object.keys(respuestasSeccion).length} respuestas`);
          });
        }
        
        if (datosCompletos.esquemas) {
          console.log('📋 Esquemas encontrados:');
          Object.keys(datosCompletos.esquemas).forEach(seccion => {
            const esquema = datosCompletos.esquemas[seccion];
            if (esquema && esquema.blocks) {
              const totalPreguntas = esquema.blocks.reduce((total, block) => total + (block.questions ? block.questions.length : 0), 0);
              console.log(`   ${seccion}: ${esquema.blocks.length} bloques, ${totalPreguntas} preguntas`);
            } else {
              console.log(`   ${seccion}: SIN ESTRUCTURA DE BLOQUES`);
            }
          });
        }
        
        // Verificar que tenemos todos los datos necesarios
        if (!datosCompletos.promedios || !datosCompletos.esquemas || !datosCompletos.respuestas) {
          console.warn('⚠️ Faltan datos completos para PDF, usando estructura mínima');
          console.warn('   FALTANTE - promedios:', !datosCompletos.promedios ? 'SÍ' : 'NO');
          console.warn('   FALTANTE - esquemas:', !datosCompletos.esquemas ? 'SÍ' : 'NO');
          console.warn('   FALTANTE - respuestas:', !datosCompletos.respuestas ? 'SÍ' : 'NO');
          const datosParaPDF = {
            datosEmpresa: datosCompletos.datosEmpresa,
            fecha: datosCompletos.datosEmpresa?.fechaReporte || new Date().toLocaleDateString(),
            
            // Solo porcentajes finales
            promedios: {
              A: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeEconomico) || 0, bloques: {} },
              B: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeAmbiental) || 0, bloques: {} },
              C: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeEnergia) || 0, bloques: {} },
              D: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeSeguridad) || 0, bloques: {} },
              E: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeSocial) || 0, bloques: {} },
              F: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeAlmacen) || 0, bloques: {} }
            },
            esquemas: { seccionA: { blocks: [] }, seccionB: { blocks: [] }, seccionC: { blocks: [] }, seccionD: { blocks: [] }, seccionE: { blocks: [] }, seccionF: { blocks: [] } },
            opciones: { standard: [], seccionE: [] },
            respuestas: {}
          };
          
          const pdfBuffer = await generarPDFAutogestion(datosParaPDF);
          pdfBase64 = pdfBuffer.toString('base64');
        } else {
          console.log('✅ Datos completos disponibles para PDF detallado');
          
          // 🎯 USAR EXACTAMENTE LOS MISMOS DATOS QUE PARA DESCARGA DINÁMICA
          const datosParaPDFCompleto = {
            datosEmpresa: datosCompletos.datosEmpresa,
            fecha: datosCompletos.datosEmpresa?.fechaReporte || datosCompletos.fecha || new Date().toLocaleDateString(),
            
            // USAR PROMEDIOS REALES CON BLOQUES
            promedios: datosCompletos.promedios || {
              A: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeEconomico) || 0, bloques: {} },
              B: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeAmbiental) || 0, bloques: {} },
              C: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeEnergia) || 0, bloques: {} },
              D: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeSeguridad) || 0, bloques: {} },
              E: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeSocial) || 0, bloques: {} },
              F: { porcentajeFinal: parseFloat(datosCompletos.resultados?.porcentajeAlmacen) || 0, bloques: {} }
            },
            
            // USAR ESQUEMAS Y RESPUESTAS REALES
            esquemas: datosCompletos.esquemas || {},
            opciones: datosCompletos.opciones || { standard: [], seccionE: [] },
            respuestas: datosCompletos.respuestas || {}
          };
          
          console.log('� Datos para PDF completo:', {
            empresa: datosParaPDFCompleto.datosEmpresa?.nombreEmpresa,
            fecha: datosParaPDFCompleto.fecha,
            respuestas: Object.keys(datosParaPDFCompleto.respuestas).length,
            esquemas: Object.keys(datosParaPDFCompleto.esquemas).length,
            promediosA: datosParaPDFCompleto.promedios.A?.porcentajeFinal
          });
          
          const pdfBuffer = await generarPDFAutogestion(datosParaPDFCompleto);
          pdfBase64 = pdfBuffer.toString('base64');
        }
        
        console.log(`✅ PDF generado y convertido a base64: ${pdfBase64.length} caracteres`);
      } catch (pdfError) {
        console.error('❌ Error completo generando PDF:', pdfError);
        console.warn('⚠️ Error generando PDF, guardando sin PDF:', pdfError.message);
        pdfBase64 = null;
      }
      
      // 🔍 VERIFICAR ESTRUCTURA DE LA TABLA PRIMERO
      console.log('🔍 Verificando estructura de la tabla...');
      const schemaQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'calculos_autogestion' 
        ORDER BY ordinal_position
      `;
      
      const schemaResult = await ejecutarQuery(schemaQuery, []);
      if (schemaResult.success) {
        console.log('📋 Columnas disponibles:', schemaResult.data.map(col => `${col.column_name} (${col.data_type})`));
      }

      const query = `
        INSERT INTO calculos_autogestion (
          codigo_seguimiento,
          nombre_empresa,
          nit,
          sector,
          departamento,
          municipio,
          direccion,
          telefono,
          correo,
          persona_elabora,
          cargo,
          año_reporte,
          fecha_reporte,
          porcentaje_economico,
          porcentaje_ambiental,
          porcentaje_energia,
          porcentaje_seguridad,
          porcentaje_social,
          porcentaje_almacen,
          nivel_cumplimiento,
          pdf_reporte,
          resumen_ejecutivo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING id, codigo_seguimiento, fecha_creacion
      `;

      const params = [
        code,
        datosParaBD.empresa.nombre,
        datosParaBD.empresa.nit,
        datosParaBD.empresa.sector || '',
        datosParaBD.empresa.departamento,
        datosParaBD.empresa.municipio,
        datosParaBD.empresa.direccion,
        datosParaBD.empresa.telefono,
        datosParaBD.empresa.correo,
        datosParaBD.empresa.personaElabora,
        datosParaBD.empresa.cargo,
        datosParaBD.añoReporte,
        datosParaBD.fechaReporte,
        parseFloat(datosParaBD.resultados.porcentajeEconomico),
        parseFloat(datosParaBD.resultados.porcentajeAmbiental),
        parseFloat(datosParaBD.resultados.porcentajeEnergia),
        parseFloat(datosParaBD.resultados.porcentajeSeguridad),
        parseFloat(datosParaBD.resultados.porcentajeSocial),
        parseFloat(datosParaBD.resultados.porcentajeAlmacen),
        datosParaBD.resultados.nivelCumplimiento,
        pdfBase64 ? Buffer.from(pdfBase64, 'base64') : null, // PDF EN COLUMNA BYTEA
        JSON.stringify({ 
          optimizado: true, 
          fecha: new Date().toISOString(),
          pdfGenerado: pdfBase64 !== null,
          pdfBase64: pdfBase64 // FALLBACK: también en JSON
        }) // resumen_ejecutivo
      ];

      const result = await ejecutarQuery(query, params);
      
      if (result.success) {
        console.log(`✅ Assessment saved with code: ${code}`);
        res.json({
          success: true,
          data: {
            codigo: code,
            id: result.data[0].id,
            porcentajeFinal: datosParaBD.resultados.porcentajeFinal,
            optimizado: true
          },
          mensaje: `Assessment saved successfully with code: ${code}`
        });
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Error guardando autogestión:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error al guardar el autodiagnóstico' 
      });
    }
  });
  
  /**
   * GET /api/obtener-calculo/:codigo
   * Obtiene un cálculo completo por código de seguimiento
   * Ejemplos: HC-2025-000001, AG-2025-000001
   */
  app.get('/api/obtener-calculo/:codigo', async (req, res) => {
    try {
      const codigo = req.params.codigo;
      console.log(`🔍 Buscando cálculo: ${codigo}`);
      
      // Determinar tipo por prefijo
      let resultado;
      if (codigo.startsWith('HC-')) {
        resultado = await DatabaseService.obtenerHuellaPorCodigo(codigo);
      } else if (codigo.startsWith('AG-')) {
        resultado = await DatabaseService.obtenerAutogestionPorCodigo(codigo);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Código inválido. Debe comenzar con HC- o AG-'
        });
      }
      
      res.json(resultado);
      
    } catch (error) {
      console.error('❌ Error obteniendo cálculo:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  /**
   * GET /api/descargar-pdf-autogestion-bd/:codigo
   * Descarga PDF DIRECTAMENTE desde la base de datos (el que se guardó al momento del guardado)
   */
  app.get('/api/descargar-pdf-autogestion-bd/:codigo', async (req, res) => {
    try {
      const { codigo } = req.params;
      
      if (!codigo || !codigo.startsWith('AG-')) {
        return res.status(400).json({
          success: false,
          error: 'Código inválido. Debe ser un código de autogestión AG-YYYY-NNNNNN'
        });
      }
      
      console.log(`📥 Descargando PDF GUARDADO para código: ${codigo}`);
      
      // INTENTAR OBTENER PDF DESDE COLUMNA BYTEA PRIMERO
      console.log(`📥 Buscando PDF para código: ${codigo}`);
      
      const queryPDF = `
        SELECT pdf_reporte, nombre_empresa 
        FROM calculos_autogestion 
        WHERE codigo_seguimiento = $1 AND pdf_reporte IS NOT NULL
      `;
      
      const resultPDF = await ejecutarQuery(queryPDF, [codigo]);
      
      let pdfBuffer = null;
      
      if (resultPDF.success && resultPDF.data.length > 0 && resultPDF.data[0].pdf_reporte) {
        console.log('✅ PDF encontrado en columna pdf_reporte');
        pdfBuffer = resultPDF.data[0].pdf_reporte;
      } else {
        // FALLBACK: buscar en resumen_ejecutivo JSON
        console.log('⚠️ PDF no encontrado en columna, buscando en JSON...');
        const queryJSON = `
          SELECT resumen_ejecutivo, nombre_empresa 
          FROM calculos_autogestion 
          WHERE codigo_seguimiento = $1
        `;
        
        const resultJSON = await ejecutarQuery(queryJSON, [codigo]);
        
        if (!resultJSON.success || resultJSON.data.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Registro no encontrado para el código proporcionado'
          });
        }
        
        const resumenEjecutivo = resultJSON.data[0].resumen_ejecutivo;
        
        if (resumenEjecutivo && resumenEjecutivo.pdfBase64) {
          console.log('✅ PDF encontrado en JSON');
          pdfBuffer = Buffer.from(resumenEjecutivo.pdfBase64, 'base64');
        } else {
          return res.status(404).json({
            success: false,
            error: 'No hay PDF guardado para este código'
          });
        }
      }
      
      // CONFIGURAR DESCARGA
      const nombreArchivo = `Autogestion_${codigo}_GUARDADO.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      console.log(`✅ PDF GUARDADO descargado: ${nombreArchivo} (${pdfBuffer.length} bytes)`);
      
      // ENVIAR PDF
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('❌ Error descargando PDF GUARDADO:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al descargar el PDF guardado'
      });
    }
  });

  /**
   * GET /api/descargar-pdf-autogestion/:codigo
   * Descarga PDF REAL de autogestión reconstruyendo los datos desde BD
   */
  app.get('/api/descargar-pdf-autogestion/:codigo', async (req, res) => {
    try {
      const { codigo } = req.params;
      
      if (!codigo || !codigo.startsWith('AG-')) {
        return res.status(400).json({
          success: false,
          error: 'Código inválido. Debe ser un código de autogestión AG-YYYY-NNNNNN'
        });
      }
      
      console.log(`📥 Generando PDF REAL para código: ${codigo}`);
      
      // 1. OBTENER DATOS GUARDADOS DE LA BD
      const query = `
        SELECT 
          codigo_seguimiento,
          nombre_empresa, nit, sector, departamento, municipio, direccion, telefono, correo,
          persona_elabora, cargo, fecha_reporte,
          porcentaje_economico, porcentaje_ambiental, porcentaje_energia,
          porcentaje_seguridad, porcentaje_social, porcentaje_almacen, porcentaje_final,
          nivel_cumplimiento, resumen_ejecutivo
        FROM calculos_autogestion 
        WHERE codigo_seguimiento = $1
      `;
      
      const result = await ejecutarQuery(query, [codigo]);
      
      if (!result.success || result.data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Autogestión no encontrada para el código proporcionado'
        });
      }
      
      const registro = result.data[0];
      
      // 2. RECONSTRUIR DATOS EN FORMATO ORIGINAL
      const datosReconstruidos = {
        datosEmpresa: {
          nombreEmpresa: registro.nombre_empresa,
          nit: registro.nit,
          sector: registro.sector,
          departamento: registro.departamento,
          municipio: registro.municipio,
          direccion: registro.direccion,
          telefono: registro.telefono,
          correo: registro.correo,
          personaElabora: registro.persona_elabora,
          cargo: registro.cargo
        },
        fecha: registro.fecha_reporte || new Date().toLocaleDateString(),
        
        // RECONSTRUIR PROMEDIOS desde los resultados guardados
        promedios: {
          A: { porcentajeFinal: parseFloat(registro.porcentaje_economico) || 0, bloques: {} },
          B: { porcentajeFinal: parseFloat(registro.porcentaje_ambiental) || 0, bloques: {} },
          C: { porcentajeFinal: parseFloat(registro.porcentaje_energia) || 0, bloques: {} },
          D: { porcentajeFinal: parseFloat(registro.porcentaje_seguridad) || 0, bloques: {} },
          E: { porcentajeFinal: parseFloat(registro.porcentaje_social) || 0, bloques: {} },
          F: { porcentajeFinal: parseFloat(registro.porcentaje_almacen) || 0, bloques: {} }
        },
        
        // DATOS VACÍOS PARA EVITAR ERRORES (el PDF mostrará solo resúmenes)
        esquemas: {},
        opciones: { standard: [], seccionE: [] },
        respuestas: {}
      };
      
      // 3. USAR LA FUNCIÓN ORIGINAL PARA GENERAR PDF
      const pdfBuffer = await generarPDFAutogestion(datosReconstruidos);
      
      // 4. CONFIGURAR DESCARGA
      const nombreArchivo = `Autogestion_${codigo}_COMPLETO.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      console.log(`✅ PDF REAL generado: ${nombreArchivo} (${pdfBuffer.length} bytes)`);
      
      // 5. ENVIAR PDF
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('❌ Error generando PDF REAL:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor al generar PDF REAL' 
      });
    }
  });

  /**
   * GET /api/catalogos/combustibles
   * Obtiene todos los catálogos de factores de emisión
   */
  app.get('/api/catalogos/combustibles', async (req, res) => {
    try {
      const [solidos, liquidos, gaseosos] = await Promise.all([
        DatabaseService.obtenerCatalogoCombustiblesSolidos(),
        DatabaseService.obtenerCatalogoCombustiblesLiquidos(),
        DatabaseService.obtenerCatalogoCombustiblesGaseosos()
      ]);
      
      res.json({
        success: true,
        data: {
          solidos,
          liquidos,
          gaseosos
        }
      });
    } catch (error) {
      console.error('❌ Error obteniendo catálogos:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  /**
   * GET /api/factor-electricidad/:pais?/:año?
   * Obtiene factor de emisión de electricidad por país y año
   */
  app.get('/api/factor-electricidad/:pais?/:año?', async (req, res) => {
    try {
      const pais = req.params.pais || 'Colombia';
      const año = req.params.año ? parseInt(req.params.año) : null;
      
      const factor = await DatabaseService.obtenerFactorElectricidad(pais, año);
      
      res.json({
        success: true,
        factor: factor,
        pais: pais,
        año: año || new Date().getFullYear()
      });
    } catch (error) {
      console.error('❌ Error obteniendo factor eléctrico:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  /**
   * GET /api/estadisticas
   * Obtiene estadísticas generales de la plataforma
   */
  app.get('/api/estadisticas', async (req, res) => {
    try {
      const stats = await DatabaseService.obtenerEstadisticasGenerales();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  /**
   * GET /api/factores/todos
   * Obtiene TODOS los factores de emisión para caché en el frontend
   * Lee desde las 5 tablas de catálogos que YA EXISTEN
   */
  app.get('/api/factores/todos', async (req, res) => {
    try {
      console.log('📊 Consultando factores de emisión desde BD...');
      
      const { pool } = require('./database/config');
      
      // Consultar las tablas de factores que YA EXISTEN
      const [solidos, liquidos, gaseosos, electricidad] = await Promise.all([
        pool.query(`
          SELECT nombre, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2, fuente, año_publicacion
          FROM catalogo_combustibles_solidos
          WHERE activo = true
          ORDER BY nombre
        `),
        pool.query(`
          SELECT nombre, densidad, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2, fuente, año_publicacion
          FROM catalogo_combustibles_liquidos
          WHERE activo = true
          ORDER BY nombre
        `),
        pool.query(`
          SELECT nombre, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2, fuente, año_publicacion
          FROM catalogo_combustibles_gaseosos
          WHERE activo = true
          ORDER BY nombre
        `),
        pool.query(`
          SELECT pais, año, factor_emision, fuente
          FROM factores_electricidad_pais
          WHERE activo = true
          ORDER BY pais, año DESC
        `)
      ]);

      // Intentar consultar tabla de vuelos (puede no existir aún)
      let vuelos = { rows: [] };
      try {
        vuelos = await pool.query(`
          SELECT clase, factor_emision, fuente, año_publicacion
          FROM factores_vuelos
          WHERE activo = true
          ORDER BY clase
        `);
      } catch (err) {
        console.log('⚠️  Tabla factores_vuelos no existe aún. Ejecuta add_flight_factors_table.sql');
      }
      
      // Organizar datos por tipo
      const factores = {
        combustibles_solidos: solidos.rows,
        combustibles_liquidos: liquidos.rows,
        combustibles_gaseosos: gaseosos.rows,
        electricidad: electricidad.rows,
        vuelos: vuelos.rows
      };
      
      console.log(`✅ Factores consultados: 
        - Sólidos: ${solidos.rows.length}
        - Líquidos: ${liquidos.rows.length}
        - Gaseosos: ${gaseosos.rows.length}
        - Electricidad: ${electricidad.rows.length}
        - Vuelos: ${vuelos.rows.length}`);
      
      res.json({
        success: true,
        factores: factores,
        totales: {
          solidos: solidos.rows.length,
          liquidos: liquidos.rows.length,
          gaseosos: gaseosos.rows.length,
          electricidad: electricidad.rows.length,
          vuelos: vuelos.rows.length,
          total: solidos.rows.length + liquidos.rows.length + gaseosos.rows.length + electricidad.rows.length + vuelos.rows.length
        },
        fecha_consulta: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error consultando factores:', error);
      res.status(500).json({
        success: false,
        error: 'Error consultando factores de emisión',
        detalle: error.message
      });
    }
  });
  
  /**
   * POST /api/consentimiento
   * Guarda el consentimiento de términos y políticas del usuario
   */
  app.post('/api/consentimiento', async (req, res) => {
    try {
      console.log('\n📝 === GUARDANDO CONSENTIMIENTO ===');
      const datos = req.body;
      
      // Validar datos obligatorios
      if (!datos.acepta_terminos || !datos.acepta_privacidad) {
        return res.status(400).json({
          success: false,
          error: 'Debe aceptar los términos y condiciones y la política de privacidad'
        });
      }
      
      // Obtener información de la solicitud
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Guardar en base de datos
      const { pool } = require('./database/config');
      const result = await pool.query(`
        INSERT INTO consentimientos_usuario (
          email_usuario,
          nombre_usuario,
          acepta_terminos,
          acepta_privacidad,
          acepta_cookies_necesarias,
          acepta_cookies_analiticas,
          acepta_cookies_marketing,
          acepta_emails_promocionales,
          version_terminos,
          version_privacidad,
          ip_address,
          user_agent,
          navegador,
          sistema_operativo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, fecha_consentimiento
      `, [
        datos.email_usuario || null,
        datos.nombre_usuario || null,
        datos.acepta_terminos,
        datos.acepta_privacidad,
        datos.acepta_cookies_necesarias !== false, // true por defecto
        datos.acepta_cookies_analiticas || false,
        datos.acepta_cookies_marketing || false,
        datos.acepta_emails_promocionales || false,
        datos.version_terminos || 'v1.0',
        datos.version_privacidad || 'v1.0',
        ip,
        userAgent,
        datos.navegador || null,
        datos.sistema_operativo || null
      ]);
      
      console.log('✅ Consentimiento guardado:', result.rows[0].id);
      
      res.json({
        success: true,
        id: result.rows[0].id,
        fecha: result.rows[0].fecha_consentimiento,
        mensaje: 'Consentimiento registrado exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error guardando consentimiento:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al guardar el consentimiento'
      });
    }
  });

  /**
   * GET /api/factores/todos
   * Obtiene todos los factores de emisión para cachear en el cliente
   */
  app.get('/api/factores/todos', async (req, res) => {
    try {
      console.log('\n📊 === CARGANDO FACTORES DE EMISIÓN ===');
      
      const { pool } = require('./database/config');
      
      // Obtener todos los factores activos
      const result = await pool.query(`
        SELECT 
          categoria,
          tipo_combustible,
          factor_emision,
          unidad,
          fuente,
          ano_referencia,
          alcance
        FROM factores_emision
        WHERE activo = true
        ORDER BY categoria, tipo_combustible
      `);
      
      // Organizar factores por categoría
      const factoresOrganizados = {};
      
      result.rows.forEach(row => {
        if (!factoresOrganizados[row.categoria]) {
          factoresOrganizados[row.categoria] = {};
        }
        
        factoresOrganizados[row.categoria][row.tipo_combustible] = {
          factor: parseFloat(row.factor_emision),
          unidad: row.unidad,
          fuente: row.fuente,
          ano: row.ano_referencia,
          alcance: row.alcance
        };
      });
      
      console.log('✅ Factores cargados:', result.rows.length, 'registros');
      console.log('📦 Categorías:', Object.keys(factoresOrganizados).join(', '));
      
      res.json({
        success: true,
        factores: factoresOrganizados,
        total: result.rows.length,
        categorias: Object.keys(factoresOrganizados),
        fecha_consulta: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error cargando factores:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al cargar factores de emisión'
      });
    }
  });

  // ============================================================================
  // ENDPOINT: Guardar Cálculo de Huella de Carbono
  // ============================================================================
  app.post('/api/huella-carbono/guardar', async (req, res) => {
    try {
      console.log('💾 Recibida solicitud de guardado de huella de carbono...');
      console.log('📊 Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const resultado = await DatabaseService.guardarHuellaCarbono(req.body);
      
      if (resultado.success) {
        console.log('✅ Huella de carbono guardada exitosamente:', resultado.data.codigo);
        res.status(200).json(resultado);
      } else {
        console.error('❌ Error guardando huella de carbono:', resultado.error);
        res.status(500).json(resultado);
      }
    } catch (error) {
      console.error('❌ Error en endpoint guardar huella de carbono:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Error interno del servidor'
      });
    }
  });
};
