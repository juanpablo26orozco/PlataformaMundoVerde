// ============================================================================
// TEST: Verificar endpoint /api/consentimiento
// ============================================================================
// 
// Cómo usar:
// 1. Abrir la aplicación en el navegador (http://localhost:3000)
// 2. Abrir la consola del navegador (F12 > Console)
// 3. Copiar y pegar este código completo
// 4. Presionar Enter
//
// ============================================================================

console.log('🧪 INICIANDO TEST DEL ENDPOINT /api/consentimiento\n');

async function testEndpoint() {
  try {
    console.log('📤 1. Enviando petición POST a /api/consentimiento...');
    
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
        navegador: navigator.userAgent,
        sistema_operativo: navigator.platform,
        email_usuario: 'test@test.com',
        nombre_usuario: 'Usuario de Prueba'
      })
    });

    console.log(`📥 2. Respuesta recibida: ${response.status} ${response.statusText}`);
    
    // Verificar Content-Type
    const contentType = response.headers.get('content-type');
    console.log(`📋 3. Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ ERROR: La respuesta NO es JSON');
      const texto = await response.text();
      console.log('📄 Contenido recibido (primeros 500 caracteres):');
      console.log(texto.substring(0, 500));
      console.log('\n');
      console.log('💡 SOLUCIÓN:');
      console.log('   1. Detén el servidor (Ctrl+C)');
      console.log('   2. Ejecuta: npm start');
      console.log('   3. Espera a que cargue completamente');
      console.log('   4. Ejecuta este test de nuevo');
      return;
    }
    
    // Parsear respuesta
    const data = await response.json();
    console.log('📦 4. Datos parseados correctamente:');
    console.log(data);
    
    if (data.success) {
      console.log('\n✅ ¡TEST EXITOSO!');
      console.log(`   ID guardado: ${data.id}`);
      console.log(`   Fecha: ${data.fecha}`);
      console.log(`   Mensaje: ${data.mensaje}`);
      console.log('\n🎉 El endpoint está funcionando correctamente.');
      console.log('   Ahora puedes probar el modal de políticas.');
    } else {
      console.error('\n❌ ERROR: El servidor respondió pero con error');
      console.error(`   Error: ${data.error}`);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:');
    console.error(error);
    console.log('\n💡 POSIBLES CAUSAS:');
    console.log('   • El servidor no está ejecutando setupProxy.js');
    console.log('   • La base de datos no está conectada');
    console.log('   • Hay un error en el código del endpoint');
  }
}

// Ejecutar test
testEndpoint();

// Instrucciones adicionales
console.log('\n📚 DOCUMENTACIÓN:');
console.log('   Ver: SOLUCION_ENDPOINT_CONSENTIMIENTO.md');
console.log('   Para más información sobre cómo solucionar problemas.');
