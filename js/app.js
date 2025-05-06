/**
 * Jornada Interativa
 * Main Application Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Jornada Interativa application...');

  // Verificar se há um parâmetro de reset na URL
  const urlParams = new URLSearchParams(window.location.search);
  const resetParam = urlParams.get('reset');

  // Se houver um parâmetro de reset, limpar a URL
  if (resetParam) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Forçar limpeza de localStorage se estiver vindo de um reset
  if (resetParam) {
    console.log('Reset parameter detected, clearing localStorage...');
    localStorage.clear();
  }

  // Initialize services
  StorageService.init();
  ContentService.init();
  ProgressService.init();
  BibleService.init();
  AnimationService.init();
  AuthService.init();

  // Forçar inicialização como novo usuário se estiver vindo de um reset
  if (resetParam) {
    console.log('Forcing initialization as new user...');
    ProgressService.resetProgress();
    AuthService.logout();
  }

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  // Check if returning user
  const userProgress = ProgressService.getUserProgress();

  // Hide loading screen
  document.getElementById('loading').style.display = 'none';

  // Initialize router
  Router.init();

  // Route to appropriate starting point
  if (isAuthenticated) {
    if (userProgress && userProgress.currentStage > 0 && !resetParam) {
      console.log('Returning user detected, navigating to journey map');
      Router.navigate('journey-map');
    } else {
      console.log('New user detected, navigating to welcome screen');
      Router.navigate('welcome');
    }
  } else {
    console.log('User not authenticated, navigating to home page');
    Router.navigate('home');
  }

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // First, try to update existing service workers
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.update();
          console.log('Updating Service Worker:', registration.scope);
        }
      });

      // Then register/update our service worker
      navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);

          // Force update
          registration.update();
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }

  // Check and display offline status
  updateOfflineStatus();
  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', updateOfflineStatus);
});

// Update offline status indicator
function updateOfflineStatus() {
  const isOffline = !navigator.onLine;

  if (isOffline) {
    document.body.classList.add('offline-mode');

    // Show offline notification if not already shown
    if (!document.querySelector('.app-notification')) {
      NotificationService.notify({
        title: 'Modo Offline',
        message: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
        type: 'warning',
        duration: 5000
      });
    }
  } else {
    document.body.classList.remove('offline-mode');
  }
}