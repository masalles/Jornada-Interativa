/**
 * Welcome Component
 * First screen users see when starting the application
 */

const WelcomeComponent = {
  render(container) {
    console.log('Rendering Welcome component');

    // Check if returning user
    const userProgress = ProgressService.getUserProgress();
    const isReturningUser = userProgress && userProgress.currentStage > 1;

    container.innerHTML = `
      <div class="welcome-screen min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 relative overflow-hidden">
        <!-- Background animation elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="light-rays"></div>
          <div class="floating-particles"></div>
        </div>

        <div class="welcome-content max-w-md relative z-10 bg-white bg-opacity-90 p-8 rounded-xl shadow-lg fade-in">
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Jornada Interativa</h1>
          <p class="text-lg mb-8">Uma experiência de aprendizado personalizada</p>

          <div class="welcome-card p-6 mb-8 bg-blue-50 rounded-lg">
            <p class="mb-4">${isReturningUser
              ? 'Bem-vindo de volta! Continue sua jornada de aprendizado.'
              : 'Este guia interativo o conduzirá por três etapas de desenvolvimento, combinando conteúdo informativo, momentos de reflexão e atividades práticas para consolidar seu aprendizado.'}</p>

            ${isReturningUser ? `
              <p class="text-sm text-gray-600 mb-4">Você está atualmente na Etapa ${userProgress.currentStage}</p>
              <p class="text-sm text-gray-600 mb-4">Última visita: ${new Date(userProgress.lastVisit).toLocaleDateString()}</p>
            ` : ''}
          </div>

          <button id="begin-journey" class="begin-button bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg">
            ${isReturningUser ? 'Continuar Jornada' : 'Iniciar Jornada'}
          </button>
        </div>
      </div>
    `;

    // Add custom styles for the animations
    this.addAnimationStyles();

    // Add event listeners
    document.getElementById('begin-journey').addEventListener('click', () => {
      Router.navigate('journey-map');
    });

    // Add animations
    AnimationService.animateElements('.welcome-content', 'fade-in');
  },

  addAnimationStyles() {
    // Check if styles already exist
    if (document.getElementById('welcome-animation-styles')) {
      return;
    }

    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = 'welcome-animation-styles';

    // Add animation styles
    styleElement.textContent = `
      /* Light rays animation */
      .light-rays {
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        background: radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 100%);
        opacity: 0.4;
        transform-origin: center center;
        animation: rotate 40s linear infinite, pulse 10s ease-in-out infinite;
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.5; }
      }

      /* Floating particles animation */
      .floating-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .floating-particles::before,
      .floating-particles::after {
        content: '';
        position: absolute;
        background-color: rgba(59, 130, 246, 0.1);
        border-radius: 50%;
      }

      .floating-particles::before {
        width: 15vw;
        height: 15vw;
        top: 20%;
        left: 10%;
        animation: float 20s ease-in-out infinite;
      }

      .floating-particles::after {
        width: 10vw;
        height: 10vw;
        bottom: 15%;
        right: 15%;
        animation: float 15s ease-in-out infinite reverse;
      }

      @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(5%, 5%); }
        50% { transform: translate(0, 10%); }
        75% { transform: translate(-5%, 5%); }
      }

      /* Make sure animations respect reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        .light-rays, .floating-particles::before, .floating-particles::after {
          animation: none !important;
        }
      }
    `;

    // Add to document head
    document.head.appendChild(styleElement);
  }
};