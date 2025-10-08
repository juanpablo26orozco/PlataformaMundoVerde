import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class DatabaseService {
  
  // =====================================================
  // AUTOGESTIÓN OPTIMIZADA
  // =====================================================
  
  async guardarAutogestion(datosCalculo) {
    try {
      console.log('💾 Guardando autogestión en BD...');
      
      // Generar PDF usando la función exacta del botón - SOLUCIÓN SIMPLE
      const pdfResponse = await axios.post(`${API_BASE_URL}/generar-pdf-autogestion`, datosCalculo);
      const pdfBuffer = Buffer.from(pdfResponse.data, 'binary');
      
      // Preparar datos optimizados para BD
      const datosParaBD = {
        empresa: datosCalculo.empresa,
        resultados: {
          porcentajeEconomico: datosCalculo.promedios?.A?.porcentajeFinal || 0,
          porcentajeAmbiental: datosCalculo.promedios?.B?.porcentajeFinal || 0,
          porcentajeEnergia: datosCalculo.promedios?.C?.porcentajeFinal || 0,
          porcentajeSeguridad: datosCalculo.promedios?.D?.porcentajeFinal || 0,
          porcentajeSocial: datosCalculo.promedios?.E?.porcentajeFinal || 0,
          porcentajeAlmacen: datosCalculo.promedios?.F?.porcentajeFinal || 0,
          fechaCalculo: new Date().toISOString()
        },
        esquemas: datosCalculo.esquemas,
        opciones: datosCalculo.opciones,
        respuestas: datosCalculo.respuestas,
        promedios: datosCalculo.promedios,
        pdf_content: pdfBuffer
      };

      // Generar código único
      const codigo = await this.generarCodigo('AG');
      datosParaBD.codigo = codigo;

      const response = await axios.post(`${API_BASE_URL}/save-autogestion`, datosParaBD);
      
      console.log('✅ Autogestión guardada exitosamente:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error guardando autogestión:', error);
      throw error;
    }
  }

  async obtenerAutogestion(codigo) {
    try {
      const response = await axios.get(`${API_BASE_URL}/autogestion/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo autogestión:', error);
      throw error;
    }
  }

  async obtenerPDFAutogestion(codigo) {
    try {
      const response = await axios.get(`${API_BASE_URL}/autogestion/${codigo}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo PDF autogestión:', error);
      throw error;
    }
  }

  // =====================================================
  // GENERACIÓN DE CÓDIGOS
  // =====================================================
  
  async generarCodigo(tipo) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generar-codigo`, { tipo });
      return response.data.codigo;
    } catch (error) {
      console.error('❌ Error generando código:', error);
      const año = new Date().getFullYear();
      const secuencia = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const codigo = `${tipo}-${año}-${secuencia}`;
      console.log(`⚠️ Código fallback generado: ${codigo}`);
      return codigo;
    }
  }

  // =====================================================
  // HUELLA DE CARBONO (YA EXISTENTE)
  // =====================================================
  
  async guardarCalculoHuellaCarbono(datosCalculoCompleto) {
    try {
      console.log('💾 Guardando cálculo huella de carbono...');
      
      const datosParaBD = {
        empresa: datosCalculoCompleto.empresa,
        factores_emision: datosCalculoCompleto.factores_emision,
        calculo_detallado: datosCalculoCompleto.calculo_detallado,
        resumen_ejecutivo: datosCalculoCompleto.resumen_ejecutivo,
        fecha_calculo: new Date().toISOString()
      };

      const codigo = await this.generarCodigo('HC');
      datosParaBD.codigo = codigo;

      const response = await axios.post(`${API_BASE_URL}/save-calculo`, datosParaBD);
      
      console.log('✅ Cálculo guardado exitosamente:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error guardando cálculo:', error);
      throw error;
    }
  }

  async obtenerCalculoHuellaCarbono(codigo) {
    try {
      const response = await axios.get(`${API_BASE_URL}/calculo/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo cálculo:', error);
      throw error;
    }
  }

  async obtenerPDFHuellaCarbono(codigo) {
    try {
      const response = await axios.get(`${API_BASE_URL}/calculo/${codigo}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo PDF:', error);
      throw error;
    }
  }

  async listarCalculos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/calculos`);
      return response.data;
    } catch (error) {
      console.error('❌ Error listando cálculos:', error);
      return [];
    }
  }

  async eliminarCalculo(codigo) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/calculo/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando cálculo:', error);
      throw error;
    }
  }
}

export default new DatabaseService();