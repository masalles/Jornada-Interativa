/**
 * Achievements Component
 * Displays all achievements and their status
 */

const AchievementsComponent = {
  render(container) {
    console.log('Rendering Achievements component');

    // Get achievements data
    const allAchievements = ContentService.getAllAchievements();
    const userAchievements = ProgressService.getAchievements();

    // Count unlocked achievements
    const unlockedCount = Object.values(userAchievements).filter(Boolean).length;
    const totalCount = allAchievements.length;
    const progress = Math.round((unlockedCount / totalCount) * 100);

    container.innerHTML = `
      <div class="achievements-container min-h-screen flex flex-col">
        <header class="p-4 bg-white shadow-sm flex items-center">
          <button id="back-button" class="mr-auto p-2 text-gray-600 hover:text-gray-900">
            ← Voltar
          </button>
          <h1 class="text-lg font-semibold text-center">Conquistas</h1>
          <div class="ml-auto w-10"></div> <!-- Spacer for alignment -->
        </header>

        <div class="achievements-content flex-grow p-6 bg-gray-50">
          <div class="max-w-md mx-auto">
            <div class="progress-card bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
              <h2 class="text-xl font-bold mb-3">Seu Progresso</h2>

              <div class="flex items-center justify-center gap-4 mb-4">
                <div class="text-3xl font-bold text-primary">${unlockedCount} / ${totalCount}</div>
                <div class="text-lg text-gray-600">conquistas</div>
              </div>

              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div class="bg-primary h-2.5 rounded-full" style="width: ${progress}%"></div>
              </div>

              <p class="text-sm text-gray-600">
                Você desbloqueou ${progress}% das conquistas disponíveis
              </p>
            </div>

            <div class="achievements-list space-y-4">
              <h2 class="text-xl font-bold mb-4">Todas as Conquistas</h2>

              ${allAchievements.map(achievement => {
                const isUnlocked = userAchievements[achievement.id] === true;

                return `
                  <div class="achievement-card bg-white rounded-lg shadow-sm p-4 ${isUnlocked ? '' : 'opacity-75'}">
                    <div class="flex items-start">
                      <div class="achievement-icon ${isUnlocked ? 'bg-yellow-400' : 'bg-gray-200'} text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        ${isUnlocked ?
                          `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>` :
                          `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 9.586V7z" clip-rule="evenodd" />
                          </svg>`
                        }
                      </div>
                      <div class="achievement-details flex-grow">
                        <h3 class="font-bold">${achievement.title}</h3>
                        <p class="text-sm text-gray-600">
                          ${isUnlocked ? achievement.description : achievement.criteria}
                        </p>
                      </div>
                      <div class="achievement-status ml-2 flex-shrink-0">
                        ${isUnlocked ?
                          `<span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Desbloqueado</span>` :
                          `<span class="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Bloqueado</span>`
                        }
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listener for back button
    document.getElementById('back-button').addEventListener('click', () => {
      Router.navigate('journey-map');
    });

    // Add animations
    AnimationService.animateElements('.progress-card', 'fade-in');
    AnimationService.animateSequence('.achievements-list', '.achievement-card', 'fade-in', 200, 100);
  }
};