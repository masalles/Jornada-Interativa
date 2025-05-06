/**
 * Navbar Component
 * Elegant top bar for authenticated users
 */

const NavbarComponent = {
  render(container) {
    console.log('Rendering Navbar component');

    // Create navbar HTML
    const navbarHtml = `
      <div id="app-navbar" class="navbar fixed top-0 left-0 right-0 bg-white bg-opacity-90 border-b border-gray-100 flex items-center justify-between px-6 shadow-xs z-50">
        <div class="flex-1 flex justify-start">
          <div class="relative pl-2" id="hard-reset-container">
            <button id="navbar-hard-reset-btn" class="bg-navRed-600 hover:bg-navRed-700 text-white text-xs px-3 py-1.5 rounded transition-colors duration-200 flex items-center font-semibold">
              <span>Hard Reset</span>
            </button>
            <div id="hard-reset-tooltip" class="hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-white border border-gray-200 rounded shadow-md text-sm max-w-xs text-center z-10">
              <p class="mb-2">Tem certeza que deseja fazer o Hard Reset? Todas as suas informações serão perdidas e você poderá reiniciar a Jornada.</p>
              <div class="flex justify-center space-x-2">
                <button id="confirm-hard-reset" class="bg-navRed-600 hover:bg-navRed-700 text-white px-3 py-1 rounded text-xs">Confirmar</button>
                <button id="cancel-hard-reset" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 flex justify-center">
          <div class="font-bold text-lg px-2 py-1.5 bg-black text-white" style="border-radius: 0;">
            FRANCAL
          </div>
        </div>
        <div class="flex-1 flex justify-end">
          <div class="pr-2">
            <button id="navbar-logout-btn" class="text-navRed-600 hover:text-navRed-800 text-sm px-3 py-1.5 rounded border border-navRed-100 hover:border-navRed-200 transition-colors duration-200 flex items-center">
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert navbar at the beginning of the container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navbarHtml;
    const navbar = tempDiv.firstElementChild;

    // Check if navbar already exists and remove it
    const existingNavbar = document.getElementById('app-navbar');
    if (existingNavbar) {
      existingNavbar.remove();
    }

    // Insert the navbar at the beginning of the body
    document.body.insertBefore(navbar, document.body.firstChild);

    // Add class to body to indicate navbar is present
    document.body.classList.add('has-navbar');

    // Add event listener for Hard Reset button
    document.getElementById('navbar-hard-reset-btn').addEventListener('click', (event) => {
      // Show tooltip
      const tooltip = document.getElementById('hard-reset-tooltip');
      tooltip.classList.remove('hidden');
      event.stopPropagation(); // Prevent event from bubbling up
    });

    // Add event listeners for tooltip buttons
    document.getElementById('confirm-hard-reset').addEventListener('click', async () => {
      // Hide tooltip
      document.getElementById('hard-reset-tooltip').classList.add('hidden');

      // Perform hard reset
      try {
        console.log('Realizando reset completo...');
        localStorage.clear();

        // Limpar cookies relacionados à aplicação
        document.cookie.split(';').forEach(function(c) {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });

        // Forçar limpeza de cache do service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
              registration.unregister();
            }
          });
        }

        // Show success notification
        await NotificationService.alert({
          title: 'Reset Concluído',
          message: 'Jornada reiniciada com sucesso! A página será recarregada.',
          type: 'success'
        });

        setTimeout(() => {
          window.location.href = window.location.pathname + '?reset=' + new Date().getTime();
        }, 500);
      } catch (e) {
        console.error('Erro ao reiniciar jornada:', e);

        // Show error notification
        NotificationService.alert({
          title: 'Erro',
          message: 'Ocorreu um erro ao reiniciar. Por favor, tente novamente.',
          type: 'error'
        });
      }
    });

    document.getElementById('cancel-hard-reset').addEventListener('click', () => {
      // Hide tooltip
      document.getElementById('hard-reset-tooltip').classList.add('hidden');
    });

    // Close tooltip when clicking outside
    document.addEventListener('click', (event) => {
      const tooltip = document.getElementById('hard-reset-tooltip');
      const resetButton = document.getElementById('navbar-hard-reset-btn');

      if (tooltip && !tooltip.classList.contains('hidden') &&
          !tooltip.contains(event.target) &&
          event.target !== resetButton) {
        tooltip.classList.add('hidden');
      }
    });

    // Add event listener for logout button
    document.getElementById('navbar-logout-btn').addEventListener('click', async () => {
      const confirmed = await NotificationService.confirm({
        title: 'Confirmar Logout',
        message: 'Tem certeza que deseja sair da sua conta?',
        confirmText: 'Sim, sair',
        cancelText: 'Cancelar',
        type: 'warning'
      });

      if (confirmed) {
        AuthService.logout();
        Router.navigate('home');
      }
    });
  }
};
