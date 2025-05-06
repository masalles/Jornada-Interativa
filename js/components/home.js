/**
 * Home Component
 * Landing page with login/register options
 */

const HomeComponent = {
  render(container) {
    console.log('Rendering Home component');

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
      <div class="home-screen min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-10 relative z-10">
        <div class="relative z-10 max-w-xl mx-auto">
          <!-- Main Title Section with improved styling -->
          <div id="title-container" class="mb-10 transform transition-all duration-500 hover:scale-105">
            <h1 id="main-title" class="text-5xl md:text-6xl font-bold mb-3 text-white">Jornada Interativa</h1>
            <p id="subtitle" class="text-xl md:text-2xl text-white font-light">Uma experiência de aprendizado personalizada</p>
          </div>

          <!-- Welcome Card with stable design (no hover effects) -->
          <div class="welcome-card p-8 mb-10 bg-white bg-opacity-90 rounded-xl backdrop-filter backdrop-blur-sm">
            <p class="mb-6 text-lg text-gray-700 leading-relaxed">
              Bem-vindo à Jornada Interativa! Este guia o conduzirá por três etapas de desenvolvimento, combinando conteúdo informativo, momentos de reflexão e atividades práticas.
            </p>

            <!-- Improved login prompt - stable, non-moving design with smaller text -->
            <div class="mb-4">
              <p class="text-base font-medium text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Faça login ou crie uma conta para começar sua jornada</span>
              </p>
            </div>
          </div>

          <!-- Redesigned buttons with more elegant styling -->
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
            <button id="login-btn" class="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg">
              Entrar
            </button>

            <button id="register-btn" class="bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold py-4 px-10 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg">
              Cadastrar
            </button>
          </div>

          <!-- Footer with white text as per user preference -->
          <div class="mt-12 text-sm text-white">
            <p>© ${new Date().getFullYear()} Jornada Interativa</p>
          </div>
        </div>
      </div>
    `;

    // Add custom styles for the animations
    this.addAnimationStyles();

    // Add event listeners
    document.getElementById('login-btn').addEventListener('click', () => {
      this.removeBackgroundAnimation();
      Router.navigate('login');
    });

    document.getElementById('register-btn').addEventListener('click', () => {
      this.removeBackgroundAnimation();
      Router.navigate('register');
    });

    // Setup title interaction
    this.setupTitleInteraction();
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



  setupTitleInteraction() {
    const titleContainer = document.getElementById('title-container');
    const mainTitle = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');

    // Set up the title container
    titleContainer.style.position = 'relative';
    titleContainer.style.zIndex = '20';

    // Add enhanced text shadow to improve readability against the gradient background
    mainTitle.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2)';
    subtitle.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2)';

    // Add a subtle animation to the title
    titleContainer.addEventListener('mouseenter', () => {
      mainTitle.style.transform = 'translateY(-5px)';
      mainTitle.style.transition = 'transform 0.3s ease';
      subtitle.style.transform = 'translateY(-3px)';
      subtitle.style.transition = 'transform 0.4s ease';
    });

    titleContainer.addEventListener('mouseleave', () => {
      mainTitle.style.transform = 'translateY(0)';
      subtitle.style.transform = 'translateY(0)';
    });
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
    // Add enhanced animation styles while keeping the background animation intact
    if (!document.getElementById('welcome-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'welcome-animations';
      styleEl.textContent = `
        /* Gradient background animation styles - kept for reference but not used directly */
        #gradient-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Enhanced welcome card styling - no hover movement */
        .welcome-card {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        /* Info icon subtle animation - more refined */
        svg.text-primary {
          animation: gentle-pulse 4s infinite ease-in-out;
        }

        @keyframes gentle-pulse {
          0% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
        }

        /* Button hover effects */
        #login-btn, #register-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        #login-btn:hover, #register-btn:hover {
          transform: translateY(-3px);
        }

        #login-btn::after, #register-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
          -webkit-animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          30%, 100% { transform: translateX(100%) rotate(45deg); }
        }

        @-webkit-keyframes shine {
          0% { -webkit-transform: translateX(-100%) rotate(45deg); }
          30%, 100% { -webkit-transform: translateX(100%) rotate(45deg); }
        }

        /* Subtle fade-in animation for the entire home screen */
        .home-screen {
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
          #gradient-background, #login-btn::after, #register-btn::after, svg.text-primary, .home-screen {
            animation: none !important;
            -webkit-animation: none !important;
            transition: none !important;
            -webkit-transition: none !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
};
