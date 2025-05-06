/**
 * Reset Script
 * Resets all user data to provide a "first time" experience
 * This script is executed BEFORE the application is initialized
 */

(function() {
  console.log('Executing hard reset script...');

  // Limpar TODOS os dados do localStorage diretamente
  try {
    console.log('Clearing all localStorage data...');
    localStorage.clear();
    console.log('All localStorage data cleared successfully');

    // Limpar também cookies relacionados à aplicação
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    console.log('Cookies cleared');

    // Forçar limpeza de cache do service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
          console.log('Service Worker unregistered');
        }
      });
    }

    console.log('Hard reset complete. Application is ready for a "first time" experience.');
  } catch (e) {
    console.error('Error during hard reset:', e);
  }
})();
