const express = require('express');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const PDFDocument = require('pdfkit');
require('dotenv').config();

module.exports = function(app) {
  app.use(express.json({ limit: '50mb' }));

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid configurado');
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
          const extintoresConDatos = datos.extintores.filter(row => row.tipo || row.gas || row.consumo > 0);
          if (extintoresConDatos.length > 0) {
            doc.addPage();
            doc.fontSize(18).fillColor('#43a047').text('EXTINTORES');
            doc.moveDown();
            doc.fontSize(14).fillColor('#2e7d32').text('Sistemas de extincion');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000');
            extintoresConDatos.forEach((row, i) => {
              doc.text((i+1) + '. Tipo: ' + (row.tipo || row.gas || 'N/A'));
              doc.text('   Consumo: ' + (row.consumo || 0) + ' kg');
              doc.text('   Factor Emision: ' + (row.factorCO2 || row.factor || 0));
              doc.text('   Emisiones: ' + ((row.emisionesTotales || row.emision || 0).toFixed(4)) + ' Ton CO2e');
              doc.moveDown(0.3);
            });
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

  app.use('/Documentation', express.static(path.join(__dirname, '../public/Documentation'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    }
  }));
};