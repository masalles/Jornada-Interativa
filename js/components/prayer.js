/**
 * Reflection Component
 * Guided reflection experience
 * (Mantém o nome PrayerComponent para compatibilidade com o código existente)
 */

const PrayerComponent = {
  timer: null,

  render(container, params) {
    console.log('Rendering Prayer component');

    const { prayerId, stageId } = params;
    const prayer = ContentService.getPrayer(prayerId);

    if (!prayer) {
      console.error(`Reflection not found: ${prayerId}`);
      container.innerHTML = `
        <div class="error-message p-4">
          <h2 class="text-xl font-bold text-red-600">Erro</h2>
          <p>Momento de reflexão não encontrado. Por favor, retorne à etapa e tente novamente.</p>
          <button id="back-to-stage" class="mt-4 px-4 py-2 bg-primary text-white rounded">
            Voltar - Etapa
          </button>
        </div>
      `;

      document.getElementById('back-to-stage').addEventListener('click', () => {
        Router.navigate('stage', { stageId });
      });

      return;
    }

    container.innerHTML = `
      <div class="prayer-container min-h-screen flex flex-col">
        <header class="p-4 bg-white shadow-sm flex items-center">
          <button id="back-button" class="mr-auto p-2 text-gray-600 hover:text-gray-900">
            ← Voltar
          </button>
          <h1 class="text-lg font-semibold text-center">${prayer.title}</h1>
          <div class="ml-auto w-10"></div> <!-- Spacer for alignment -->
        </header>

        <div class="prayer-content flex-grow p-6 bg-blue-50">
          <div class="max-w-md mx-auto">
            <!-- Prayer intro -->
            <div class="prayer-intro bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold mb-3">Momento de Reflexão</h2>
              <p class="mb-4">${prayer.description}</p>

              <div class="guidance-box bg-blue-50 p-4 rounded-lg mb-4">
                <h3 class="font-semibold mb-2">Orientações:</h3>
                <p class="text-sm">${prayer.guidance}</p>
              </div>

              <div class="text-sm text-gray-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Duração aproximada: ${prayer.duration} minutos
              </div>

              <button id="begin-prayer" class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                Começar Reflexão
              </button>
            </div>

            <!-- Prayer content (hidden initially) -->
            <div id="prayer-display" class="prayer-display bg-white rounded-lg shadow-sm p-6 mb-6 hidden">
              <div class="text-center mb-4">
                <div class="prayer-timer-display text-lg font-light mb-2">
                  <span id="timer-minutes">00</span>:<span id="timer-seconds">00</span>
                </div>
              </div>

              <div id="prayer-text" class="prayer-text scripture-text mb-6">
                ${prayer.content.split('\n\n').map(paragraph => `<p class="mb-4">${paragraph.trim()}</p>`).join('')}
              </div>

              <div class="text-center">
                <button id="finish-prayer" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                  Finalizar Reflexão
                </button>
              </div>
            </div>

            <!-- Prayer completion (hidden initially) -->
            <div id="prayer-completion" class="prayer-completion bg-white rounded-lg shadow-sm p-6 hidden">
              <div class="text-center mb-6">
                <div class="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold mb-2">Reflexão Concluída</h2>
                <p>Você concluiu este momento de reflexão.</p>
              </div>

              <div class="space-y-3">
                <button id="return-to-stage" class="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                  Voltar - Etapa
                </button>
                <button id="repeat-prayer" class="w-full py-2 bg-transparent border border-primary text-primary rounded-lg hover:bg-primary-50 transition">
                  Repetir Reflexão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('back-button').addEventListener('click', () => {
      // Clear timer if running
      if (this.timer) {
        clearInterval(this.timer);
      }

      Router.navigate('stage', { stageId });
    });

    document.getElementById('begin-prayer').addEventListener('click', () => {
      document.querySelector('.prayer-intro').classList.add('hidden');
      document.getElementById('prayer-display').classList.remove('hidden');

      // Start timer
      this.startTimer(prayer.duration * 60);

      // Check for prayer achievement (increment prayer count)
      this.incrementPrayerCount();
    });

    document.getElementById('finish-prayer').addEventListener('click', () => {
      // Clear timer if running
      if (this.timer) {
        clearInterval(this.timer);
      }

      document.getElementById('prayer-display').classList.add('hidden');
      document.getElementById('prayer-completion').classList.remove('hidden');
    });

    document.getElementById('return-to-stage').addEventListener('click', () => {
      Router.navigate('stage', { stageId });
    });

    document.getElementById('repeat-prayer').addEventListener('click', () => {
      document.getElementById('prayer-completion').classList.add('hidden');
      document.getElementById('prayer-display').classList.remove('hidden');

      // Restart timer
      this.startTimer(prayer.duration * 60);
    });

    // Add breathing animation to prayer text
    setTimeout(() => {
      const prayerText = document.getElementById('prayer-text');
      if (prayerText) {
        AnimationService.addAnimation(prayerText, 'prayer-breathe', 10000);
      }
    }, 1000);
  },

  startTimer(seconds) {
    // Clear any existing timer
    if (this.timer) {
      clearInterval(this.timer);
    }

    const minutesDisplay = document.getElementById('timer-minutes');
    const secondsDisplay = document.getElementById('timer-seconds');

    // Set initial display
    this.updateTimerDisplay(minutesDisplay, secondsDisplay, seconds);

    // Start timer
    this.timer = setInterval(() => {
      seconds--;

      this.updateTimerDisplay(minutesDisplay, secondsDisplay, seconds);

      if (seconds <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  },

  updateTimerDisplay(minutesDisplay, secondsDisplay, totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  },

  incrementPrayerCount() {
    // Get current count from storage
    const reflectionCountKey = 'reflection_count';
    let count = parseInt(StorageService.get(reflectionCountKey) || '0');

    // Increment count
    count++;

    // Save back to storage
    StorageService.set(reflectionCountKey, count.toString());

    // Check for achievement
    if (count >= 5) {
      ProgressService.unlockAchievement('reflectedFiveTimes');
    }
  }
};