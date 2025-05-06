/**
 * Login Component
 * Handles user login
 */

const LoginComponent = {
  render(container) {
    console.log('Rendering Login component');

    // Check if user is already authenticated
    const isAuthenticated = AuthService.isAuthenticated();
    if (isAuthenticated) {
      // If already logged in, redirect to journey map
      Router.navigate('journey-map');
      return;
    }

    // Create the background animation
    this.createBackgroundAnimation();

    container.innerHTML = `
      <div class="login-screen min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 relative z-10">
        <div class="max-w-md w-full bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden backdrop-filter backdrop-blur-sm">
          <div class="bg-primary py-4">
            <h2 class="text-2xl font-bold text-white">Entrar</h2>
          </div>

          <div class="p-6">
            <div id="login-error" class="hidden mb-4 p-3 bg-red-100 text-red-700 rounded"></div>

            <form id="login-form" class="space-y-4">
              <div class="text-left">
                <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Nome de Usuário</label>
                <input type="text" id="username" name="username" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary" required>
              </div>

              <div class="text-left">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary" required>
              </div>

              <div>
                <button type="submit" class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                  Entrar
                </button>
              </div>
            </form>

            <div class="mt-4 text-sm">
              <p>Não tem uma conta? <a href="#" id="go-to-register" class="text-primary hover:text-blue-700">Cadastre-se</a></p>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <button id="back-to-home" class="text-white hover:text-gray-200 transition duration-300">
            Voltar para a página inicial
          </button>
        </div>
      </div>
    `;

    // Add animation styles
    this.addAnimationStyles();

    // Add event listeners
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('go-to-register').addEventListener('click', (e) => {
      e.preventDefault();
      this.removeBackgroundAnimation();
      Router.navigate('register');
    });

    document.getElementById('back-to-home').addEventListener('click', () => {
      this.removeBackgroundAnimation();
      Router.navigate('home');
    });
  },

  handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    // Basic validation
    if (!username || !password) {
      errorElement.textContent = 'Por favor, preencha todos os campos.';
      errorElement.classList.remove('hidden');
      return;
    }

    // Attempt login
    const result = AuthService.login(username, password);

    if (result.success) {
      console.log('Login successful');

      // Show success message briefly before redirecting
      errorElement.textContent = 'Login realizado com sucesso! Redirecionando...';
      errorElement.classList.remove('hidden');
      errorElement.classList.remove('bg-red-100', 'text-red-700');
      errorElement.classList.add('bg-green-100', 'text-green-700');

      // Redirect after a short delay
      setTimeout(() => {
        this.removeBackgroundAnimation();
        Router.navigate('journey-map');
      }, 1000);
    } else {
      // Show error message
      errorElement.textContent = result.message || 'Erro ao fazer login. Verifique suas credenciais.';
      errorElement.classList.remove('hidden');
    }
  },

  createBackgroundAnimation() {
    console.log('Creating background animation with iframe approach');

    // Create an iframe element for the gradient background
    const iframe = document.createElement('iframe');
    iframe.id = 'gradient-background-iframe';

    // Set iframe styles
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      border: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      zIndex: '-1', // Behind all content
      pointerEvents: 'none' // Don't capture mouse events
    });

    // Set the source to our gradient background HTML file
    iframe.src = 'gradient-background.html';

    // Add to the document
    document.body.appendChild(iframe);

    console.log('Gradient background iframe added to document');

    // Add a fallback direct implementation in case the iframe doesn't work
    this.addDirectGradientFallback();
  },

  removeBackgroundAnimation() {
    console.log('Removing background animation');

    // Remove the iframe
    const iframe = document.getElementById('gradient-background-iframe');
    if (iframe) {
      iframe.remove();
      console.log('Gradient background iframe removed');
    } else {
      console.log('No gradient background iframe found to remove');
    }

    // Remove the direct gradient fallback
    document.body.classList.remove('gradient-background-active');

    // Remove the CSS file
    const cssLink = document.getElementById('direct-gradient-css');
    if (cssLink) {
      cssLink.remove();
      console.log('Direct gradient CSS removed');
    }
  },

  addDirectGradientFallback() {
    console.log('Adding direct gradient fallback');

    // Add the CSS file if it's not already added
    if (!document.getElementById('direct-gradient-css')) {
      const link = document.createElement('link');
      link.id = 'direct-gradient-css';
      link.rel = 'stylesheet';
      link.href = 'css/direct-gradient.css';
      document.head.appendChild(link);

      console.log('Direct gradient CSS added');
    }

    // Add the class to the body after a short delay
    setTimeout(() => {
      document.body.classList.add('gradient-background-active');
      console.log('Gradient background class added to body');
    }, 100);
  },

  addAnimationStyles() {
    // Add enhanced animation styles for the login screen
    if (!document.getElementById('login-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'login-animations';
      styleEl.textContent = `
        /* Subtle fade-in animation for the entire login screen */
        .login-screen {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Accessibility - respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .login-screen {
            animation: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
};
