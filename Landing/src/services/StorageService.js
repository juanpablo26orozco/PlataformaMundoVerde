/**
 * 📦 StorageService - Servicio para manejar localStorage
 * Guarda y recupera los últimos 5 cálculos
 */

const STORAGE_KEY = 'mundoverde_calculations';
const MAX_CALCULATIONS = 5;

/**
 * Generar ID único
 */
const generateId = () => {
  return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Guardar un cálculo
 */
export const saveCalculation = (calculationData) => {
  try {
    // Obtener cálculos existentes
    const existing = getCalculations();
    
    // Crear nuevo cálculo con ID y timestamp
    const newCalculation = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...calculationData
    };
    
    // Agregar al inicio del array
    existing.unshift(newCalculation);
    
    // Mantener solo los últimos 5
    const updated = existing.slice(0, MAX_CALCULATIONS);
    
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newCalculation;
  } catch (error) {
    console.error('Error guardando cálculo:', error);
    return null;
  }
};

/**
 * Obtener todos los cálculos guardados
 */
export const getCalculations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error obteniendo cálculos:', error);
    return [];
  }
};

/**
 * Obtener un cálculo por ID
 */
export const getCalculationById = (id) => {
  const calculations = getCalculations();
  return calculations.find(calc => calc.id === id);
};

/**
 * Eliminar un cálculo
 */
export const deleteCalculation = (id) => {
  try {
    const calculations = getCalculations();
    const updated = calculations.filter(calc => calc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error eliminando cálculo:', error);
    return false;
  }
};

/**
 * Limpiar todos los cálculos
 */
export const clearAllCalculations = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error limpiando cálculos:', error);
    return false;
  }
};

/**
 * Obtener el último cálculo
 */
export const getLastCalculation = () => {
  const calculations = getCalculations();
  return calculations.length > 0 ? calculations[0] : null;
};

const StorageService = {
  saveCalculation,
  getCalculations,
  getCalculationById,
  deleteCalculation,
  clearAllCalculations,
  getLastCalculation
};

export default StorageService;
