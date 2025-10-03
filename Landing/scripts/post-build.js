/**
 * 🔧 Script Post-Build - Copiar Service Worker
 * 
 * Este script se ejecuta automáticamente después de `npm run build`
 * para asegurar que el Service Worker esté en la ubicación correcta.
 */

const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '../public/service-worker.js');
const DESTINATION = path.join(__dirname, '../build/service-worker.js');

console.log('\n🔧 Post-Build: Verificando Service Worker...');

// Verificar que el archivo fuente existe
if (!fs.existsSync(SOURCE)) {
  console.error('❌ Error: service-worker.js no encontrado en /public/');
  process.exit(1);
}

// Verificar que el directorio build existe
if (!fs.existsSync(path.join(__dirname, '../build'))) {
  console.error('❌ Error: Directorio /build no existe');
  process.exit(1);
}

try {
  // Copiar service-worker.js a build
  fs.copyFileSync(SOURCE, DESTINATION);
  
  const stats = fs.statSync(DESTINATION);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  
  console.log('✅ Service Worker copiado correctamente');
  console.log(`   📄 Tamaño: ${fileSizeKB} KB`);
  console.log(`   📍 Ubicación: ${DESTINATION}`);
  
  // Verificar que el contenido es válido
  const content = fs.readFileSync(DESTINATION, 'utf8');
  
  if (content.includes('CACHE_VERSION') && content.includes('CACHE_FIRST')) {
    console.log('✅ Service Worker validado correctamente');
  } else {
    console.warn('⚠️  Advertencia: Service Worker puede estar corrupto');
  }
  
  console.log('🎉 Build completado exitosamente\n');
  
} catch (error) {
  console.error('❌ Error al copiar Service Worker:', error.message);
  process.exit(1);
}
