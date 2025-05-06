/**
 * Activity Component
 * Displays and tracks an individual activity
 */

const ActivityComponent = {
  render(container, params) {
    console.log('Rendering Activity component');

    const { activityId, stageId } = params;
    const activity = ContentService.getActivity(activityId);

    if (!activity) {
      console.error(`Activity not found: ${activityId}`);
      container.innerHTML = `
        <div class="error-message p-4">
          <h2 class="text-xl font-bold text-red-600">Erro</h2>
          <p>Atividade não encontrada. Por favor, retorne à etapa e tente novamente.</p>
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

    // Check if activity is already completed
    const completedActivities = ProgressService.getCompletedActivities();
    const isCompleted = completedActivities.includes(activity.id);

    // Get saved reflection if it exists
    const savedReflection = this.getReflection(activityId);

    container.innerHTML = `
      <div class="activity-container min-h-screen flex flex-col">
        <header class="p-4 bg-white shadow-sm flex items-center">
          <button id="back-button" class="mr-auto p-2 text-gray-600 hover:text-gray-900">
            ← Voltar
          </button>
          <h1 class="text-lg font-semibold text-center">${activity.title}</h1>
          <div class="ml-auto w-10"></div> <!-- Spacer for alignment -->
        </header>

        <div class="activity-content flex-grow p-6 bg-gray-50">
          <div class="max-w-md mx-auto">
            <div class="activity-card bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold mb-3">${activity.title}</h2>
              <p class="mb-6">${activity.description}</p>

              <div class="text-sm text-gray-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tempo estimado: ${activity.estimatedTime}
              </div>

              <div class="steps-container mb-6">
                <h3 class="font-semibold mb-3">Passos:</h3>
                <div class="steps space-y-3">
                  ${activity.steps.map((step, index) => `
                    <div class="step flex items-start p-3 bg-gray-50 rounded">
                      <div class="step-number text-sm font-bold bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        ${index + 1}
                      </div>
                      <div class="step-content">
                        <p>${step}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="reflection-container mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 class="font-semibold mb-2">Reflexão:</h3>
                <p class="text-sm mb-4">${activity.reflection}</p>

                <textarea id="reflection-response" class="w-full p-3 border rounded" rows="4"
                  placeholder="Escreva suas reflexões aqui...">${savedReflection || ''}</textarea>
              </div>

              <button id="complete-activity" class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                ${isCompleted ? 'Salvar Alterações' : 'Marcar como Concluído'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('back-button').addEventListener('click', () => {
      Router.navigate('stage', { stageId });
    });

    document.getElementById('complete-activity').addEventListener('click', async () => {
      const reflectionText = document.getElementById('reflection-response').value.trim();

      // Optional: Check if reflection is filled before marking as complete
      if (reflectionText.length < 10) {
        const confirmed = await NotificationService.confirm({
          title: 'Reflexão Curta',
          message: 'Sua reflexão parece curta. Tem certeza que deseja marcar esta atividade como concluída?',
          confirmText: 'Sim, concluir',
          cancelText: 'Voltar à reflexão',
          type: 'warning'
        });

        if (!confirmed) {
          return;
        }
      }

      // Save reflection if provided
      if (reflectionText.length > 0) {
        this.saveReflection(activityId, reflectionText);
      }

      // If activity is not already completed, mark it as complete
      if (!isCompleted) {
        ProgressService.completeActivity(activityId);

        // Show completion message
        this.showCompletionMessage(container, activity, stageId);

        // Check if all stage activities are complete for achievement
        this.checkStageCompletion(stageId);

        // Show success notification
        NotificationService.notify({
          title: 'Atividade Concluída',
          message: 'Sua atividade foi marcada como concluída com sucesso!',
          type: 'success',
          duration: 3000
        });
      } else {
        // Show success notification for update
        NotificationService.notify({
          title: 'Alterações Salvas',
          message: 'Suas alterações foram salvas com sucesso!',
          type: 'success',
          duration: 3000
        });

        // Navigate back to stage
        Router.navigate('stage', { stageId });
      }
    });

    // Add animations
    AnimationService.animateSequence('.steps-container', '.step', 'fade-in', 300, 150);
  },

  getReflection(activityId) {
    const reflections = StorageService.get('activity_reflections');

    if (!reflections) {
      return null;
    }

    try {
      const reflectionsObj = JSON.parse(reflections);
      return reflectionsObj[activityId] || null;
    } catch (e) {
      console.error('Error parsing activity reflections:', e);
      return null;
    }
  },

  saveReflection(activityId, text) {
    StorageService.updateObject('activity_reflections', (reflections) => {
      reflections[activityId] = text;
      return reflections;
    });
  },

  showCompletionMessage(container, activity, stageId) {
    // Replace content with completion message
    const contentDiv = container.querySelector('.activity-content');

    contentDiv.innerHTML = `
      <div class="max-w-md mx-auto">
        <div class="completion-card bg-white rounded-lg shadow-sm p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="text-xl font-bold mb-2">Atividade Concluída!</h2>
          <p class="mb-6">Você completou a atividade "${activity.title}".</p>

          <div class="space-y-3">
            <button id="return-to-stage" class="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              Voltar - Etapa
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listener to new button
    document.getElementById('return-to-stage').addEventListener('click', () => {
      Router.navigate('stage', { stageId });
    });

    // Add animation
    AnimationService.animateElements('.completion-card', 'fade-in');
  },

  checkStageCompletion(stageId) {
    // Get all activities for this stage
    const stageActivities = ContentService.getStageActivities(stageId);
    const completedActivities = ProgressService.getCompletedActivities();

    // Check if all stage activities are completed
    const allCompleted = stageActivities.every(activity =>
      completedActivities.includes(activity.id)
    );

    if (allCompleted) {
      // Find the achievement for this stage
      const stageAchievement = ContentService.getStageAchievement(stageId);

      if (stageAchievement) {
        ProgressService.unlockAchievement(stageAchievement.id);
      }

      // Advance to next stage if available
      const currentStage = ContentService.getStage(stageId);
      const nextStage = ContentService.getNextStage(stageId);

      if (nextStage) {
        ProgressService.advanceStage(nextStage.id);
      }
    }
  }
};