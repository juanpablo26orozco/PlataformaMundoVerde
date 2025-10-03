/**
 * Utilidad para registrar el Service Worker
 * Maneja la instalación y actualización automática del SW
 */

const SW_PATH = '/service-worker.js';

/**
 * Registra el Service Worker
 */
export const registerServiceWorker = () => {
  // Solo en producción y si el navegador soporta Service Workers
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(SW_PATH)
        .then((registration) => {
          // Verificar actualizaciones
          checkForUpdates(registration);
          
          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
          
          // Listener para cuando hay una nueva versión esperando
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible - actualizar automáticamente
                skipWaitingAndReload();
              }
            });
          });
        })
        .catch(() => {
          // Silenciosamente fallar - la app funciona sin SW
        });
    });
  }
};

/**
 * Verifica si hay actualizaciones disponibles
 */
const checkForUpdates = (registration) => {
  registration.update().catch(() => {
    // Ignorar errores de actualización
  });
};

/**
 * Fuerza la activación del nuevo Service Worker y recarga la página
 */
const skipWaitingAndReload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        // Enviar mensaje al SW para que se active inmediatamente
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Esperar a que el nuevo SW tome control y recargar
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    });
  }
};
