/**
 * 📊 CalculationService - Servicio para formatear y validar datos de cálculos
 */

import StorageService from './StorageService';

/**
 * Formatear datos de Huella de Carbono
 */
const formatCarbonFootprintData = (data) => {
  const {
    datosEmpresa = {},
    alcances = {}
  } = data;
  
  // Calcular totales por alcance
  const alcance1 = Object.keys(alcances)
    .filter(key => key.startsWith('alcance1'))
    .reduce((sum, key) => sum + (parseFloat(alcances[key]) || 0), 0);
    
  const alcance2 = Object.keys(alcances)
    .filter(key => key.startsWith('alcance2'))
    .reduce((sum, key) => sum + (parseFloat(alcances[key]) || 0), 0);
    
  const alcance3 = Object.keys(alcances)
    .filter(key => key.startsWith('alcance3'))
    .reduce((sum, key) => sum + (parseFloat(alcances[key]) || 0), 0);
  
  const totalCO2 = alcance1 + alcance2 + alcance3;
  
  return {
    type: 'carbonFootprint',
    datosEmpresa: {
      nombreEmpresa: datosEmpresa.nombreEmpresa || '',
      nit: datosEmpresa.nit || '',
      sector: datosEmpresa.sector || '',
      ciudad: datosEmpresa.ciudad || ''
    },
    alcance1,
    alcance2,
    alcance3,
    totalCO2,
    detalles: alcances,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formatear datos de Autogestión
 */
const formatAutoManagementData = (data) => {
  const {
    datosEmpresa = {},
    respuestas = {},
    promedios = {}
  } = data;
  
  // Calcular promedio general
  const promedioGeneral = promedios.general || 0;
  const promediosPorSeccion = promedios.porSeccion || {};
  
  return {
    type: 'autoManagement',
    datosEmpresa: {
      nombreEmpresa: datosEmpresa.nombreEmpresa || '',
      nit: datosEmpresa.nit || '',
      sector: datosEmpresa.sector || '',
      ciudad: datosEmpresa.ciudad || ''
    },
    promedioGeneral,
    promediosPorSeccion,
    respuestas,
    timestamp: new Date().toISOString()
  };
};

/**
 * Validar estructura de datos de empresa
 */
const validateCompanyData = (datosEmpresa) => {
  const errors = [];
  
  if (!datosEmpresa.nombreEmpresa || datosEmpresa.nombreEmpresa.trim() === '') {
    errors.push('Nombre de empresa es requerido');
  }
  
  if (!datosEmpresa.nit || datosEmpresa.nit.trim() === '') {
    errors.push('NIT es requerido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validar cálculo completo
 */
const validateCalculation = (calculation) => {
  const errors = [];
  
  // Validar datos de empresa
  const companyValidation = validateCompanyData(calculation.datosEmpresa || {});
  if (!companyValidation.isValid) {
    errors.push(...companyValidation.errors);
  }
  
  // Validar tipo de cálculo
  if (!calculation.type || !['carbonFootprint', 'autoManagement'].includes(calculation.type)) {
    errors.push('Tipo de cálculo no válido');
  }
  
  // Validar datos específicos según tipo
  if (calculation.type === 'carbonFootprint') {
    if (calculation.totalCO2 === undefined || calculation.totalCO2 < 0) {
      errors.push('Total de CO2 no válido');
    }
  } else if (calculation.type === 'autoManagement') {
    if (calculation.promedioGeneral === undefined || 
        calculation.promedioGeneral < 0 || 
        calculation.promedioGeneral > 100) {
      errors.push('Promedio general no válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Guardar cálculo con validación
 */
const saveCalculation = (data, type = 'carbonFootprint') => {
  try {
    // Formatear según tipo
    let formattedData;
    if (type === 'carbonFootprint') {
      formattedData = formatCarbonFootprintData(data);
    } else if (type === 'autoManagement') {
      formattedData = formatAutoManagementData(data);
    } else {
      throw new Error('Tipo de cálculo no reconocido');
    }
    
    // Validar
    const validation = validateCalculation(formattedData);
    if (!validation.isValid) {
      console.warn('Validación de cálculo falló:', validation.errors);
      // Continuar de todos modos para no bloquear al usuario
    }
    
    // Guardar en localStorage
    const savedCalculation = StorageService.saveCalculation(formattedData);
    
    return {
      success: true,
      calculation: savedCalculation,
      errors: validation.errors
    };
  } catch (error) {
    console.error('Error al guardar cálculo:', error);
    return {
      success: false,
      error: error.message,
      errors: []
    };
  }
};

/**
 * Obtener resumen de cálculo para mostrar en UI
 */
const getCalculationSummary = (calculation) => {
  if (!calculation) return null;
  
  const fecha = new Date(calculation.timestamp).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const hora = new Date(calculation.timestamp).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  if (calculation.type === 'carbonFootprint') {
    return {
      id: calculation.id,
      type: 'Huella de Carbono',
      icon: '🌱',
      title: calculation.datosEmpresa.nombreEmpresa,
      subtitle: `${calculation.totalCO2.toFixed(2)} kg CO₂e`,
      fecha,
      hora,
      timestamp: calculation.timestamp
    };
  } else if (calculation.type === 'autoManagement') {
    return {
      id: calculation.id,
      type: 'Autogestión',
      icon: '🌿',
      title: calculation.datosEmpresa.nombreEmpresa,
      subtitle: `${calculation.promedioGeneral.toFixed(1)}% promedio`,
      fecha,
      hora,
      timestamp: calculation.timestamp
    };
  }
  
  return null;
};

/**
 * Obtener todos los cálculos con resumen
 */
const getAllCalculationsSummary = () => {
  const calculations = StorageService.getCalculations();
  return calculations.map(getCalculationSummary).filter(Boolean);
};

/**
 * Limpiar datos antiguos (más de 30 días)
 */
const cleanOldCalculations = () => {
  const calculations = StorageService.getCalculations();
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  let cleaned = 0;
  calculations.forEach(calc => {
    const calcDate = new Date(calc.timestamp).getTime();
    if (calcDate < thirtyDaysAgo) {
      StorageService.deleteCalculation(calc.id);
      cleaned++;
    }
  });
  
  return cleaned;
};

const CalculationService = {
  formatCarbonFootprintData,
  formatAutoManagementData,
  validateCompanyData,
  validateCalculation,
  saveCalculation,
  getCalculationSummary,
  getAllCalculationsSummary,
  cleanOldCalculations
};

export default CalculationService;
