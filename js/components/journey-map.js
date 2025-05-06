/**
 * Journey Map Component
 * Visual representation of the journey etapas and progress
 */

const JourneyMapComponent = {
  render(container) {
    console.log('Rendering Journey Map component');

    // Get user progress
    const userProgress = ProgressService.getUserProgress();
    const currentStage = userProgress.currentStage;
    const achievements = ProgressService.getAchievements();

    // Get all stages
    const stages = ContentService.getAllStages();

    container.innerHTML = `
      <div class="journey-map-container py-6">
        <header class="mb-6 text-center">
          <h1 class="text-2xl md:text-3xl font-bold text-primary mb-2">Sua Jornada Interativa</h1>
          <p class="text-gray-600">Toque em uma etapa para começar ou continuar</p>
        </header>

        <div class="achievements-summary bg-yellow-50 rounded-lg p-4 mb-6 text-center">
          <h2 class="font-semibold text-yellow-800 mb-2">Conquistas</h2>
          <p class="text-yellow-700">
            <span class="text-2xl font-bold">${Object.values(achievements).filter(Boolean).length}</span> /
            <span>${ContentService.getAllAchievements().length}</span> desbloqueadas
          </p>
          <button id="view-achievements" class="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline">
            Ver todas
          </button>
        </div>



        <div class="journey-stages space-y-4">
          ${stages.map(stage => {
            const isUnlocked = currentStage >= stage.id;
            const isActive = currentStage === stage.id;
            const stageAchievement = ContentService.getStageAchievement(stage.id);
            const isAchievementUnlocked = stageAchievement ? achievements[stageAchievement.id] : false;

            return `
              <div class="stage-card ${isUnlocked ? 'cursor-pointer' : 'opacity-60'} ${isActive ? 'border-l-4 border-primary' : ''} bg-white rounded-lg shadow p-4 transition duration-300 hover:shadow-md relative"
                   data-stage-id="${stage.id}" ${isUnlocked ? '' : 'aria-disabled="true"'}>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-sm text-gray-500">Etapa ${stage.id}</span>
                    <h3 class="font-bold text-lg">${stage.title}</h3>
                    <p class="text-gray-600 text-sm mt-1">${stage.description}</p>
                  </div>
                  <div class="stage-status">
                    ${isAchievementUnlocked ?
                      `<span class="achievement-badge bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center" title="Conquista: ${stageAchievement.title}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                      </span>` :
                      isUnlocked ?
                        `<span class="status-badge bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Desbloqueado</span>` :
                        `<span class="status-badge bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Bloqueado</span>`
                    }
                  </div>
                </div>
                ${isUnlocked ?
                  `<button class="w-full mt-3 py-2 px-4 ${isActive ? 'bg-primary' : 'bg-gray-200'} ${isActive ? 'text-white' : 'text-gray-800'} rounded hover:bg-primary hover:text-white transition duration-300">
                    ${isActive ? 'Continuar' : 'Visualizar'}
                  </button>` :
                  `<button disabled class="w-full mt-3 py-2 px-4 bg-gray-100 text-gray-400 rounded cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Bloqueado
                  </button>`
                }
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Add event listeners for stage cards
    document.querySelectorAll('.stage-card[data-stage-id]').forEach(card => {
      const stageId = parseInt(card.dataset.stageId);

      if (userProgress.currentStage >= stageId) {
        card.addEventListener('click', () => {
          Router.navigate('stage', { stageId });
        });
      }
    });

    // Add event listener for achievements button
    document.getElementById('view-achievements').addEventListener('click', () => {
      Router.navigate('achievements');
    });

    // Add animations
    AnimationService.animateSequence('.journey-map-container', '.stage-card', 'fade-in', 100, 100);
  }
};