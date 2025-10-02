/**
 * 🔧 Utilidad para validar configuración de variables de entorno
 * 
 * Uso:
 * import { config, validateConfig } from './utils/envConfig';
 * 
 * const whatsapp = config.whatsappNumber;
 */

// Configuración centralizada
export const config = {
  // WhatsApp
  whatsappNumber: process.env.REACT_APP_WHATSAPP_NUMBER || '573006279039',
  
  // Company Info
  companyName: process.env.REACT_APP_COMPANY_NAME || 'Mundo Verde',
  companyEmail: process.env.REACT_APP_COMPANY_EMAIL || 'contacto@mundoverde.com',
  
  // API (para futuro)
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  apiKey: process.env.REACT_APP_API_KEY || '',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

/**
 * Validar que todas las variables requeridas estén configuradas
 */
export const validateConfig = () => {
  const required = [
    'REACT_APP_WHATSAPP_NUMBER',
    'REACT_APP_COMPANY_NAME',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Variables de entorno faltantes:', missing);
    console.warn('Por favor, configura estas variables en tu archivo .env');
    console.warn('Puedes copiar .env.example y renombrarlo a .env');
  }
  
  return missing.length === 0;
};

/**
 * Validar formato de número de WhatsApp
 */
export const validateWhatsAppNumber = (number) => {
  if (!number) return false;
  
  // Debe ser: 57 + 10 dígitos
  const pattern = /^57[3][0-9]{9}$/;
  return pattern.test(number);
};

/**
 * Log de configuración (solo en desarrollo)
 */
export const logConfig = () => {
  if (config.isDevelopment) {
    console.log('🔧 Configuración actual:');
    console.log('- WhatsApp:', config.whatsappNumber);
    console.log('- Empresa:', config.companyName);
    console.log('- Email:', config.companyEmail);
    console.log('- Ambiente:', process.env.NODE_ENV);
    
    if (!validateWhatsAppNumber(config.whatsappNumber)) {
      console.warn('⚠️ Número de WhatsApp con formato inválido');
    }
  }
};

// Validar al cargar el módulo
validateConfig();

export default config;
