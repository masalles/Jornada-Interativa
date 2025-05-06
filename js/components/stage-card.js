
/**
 * Stage Card Component
 * Displays the content for a specific etapa
 */

const StageCardComponent = {
  render(container, params) {
    console.log('Rendering Stage Card component');

    const { stageId } = params;
    const stage = ContentService.getStage(stageId);
    const userProgress = ProgressService.getUserProgress();

    if (!stage) {
      console.error(`Stage not found: ${stageId}`);
      container.innerHTML = `
        <div class="error-message p-4">
          <h2 class="text-xl font-bold text-red-600">Erro</h2>
          <p>Etapa não encontrada. Por favor, retorne ao mapa da jornada e tente novamente.</p>
          <button id="back-to-map" class="mt-4 px-4 py-2 bg-primary text-white rounded">
            Voltar ao Mapa
          </button>
        </div>
      `;

      document.getElementById('back-to-map').addEventListener('click', () => {
        Router.navigate('journey-map');
      });

      return;
    }

    // Check if stage is locked
    const isLocked = userProgress.currentStage < stageId;

    if (isLocked) {
      this.renderLockedStage(container, stage);
      return;
    }

    // Render stage content
    container.innerHTML = `
      <div class="stage-container">
        <header class="mb-6">
          <div class="flex items-center justify-between">
            <button id="back-button" class="p-2 text-gray-600 hover:text-gray-900">
              ← Voltar ao Mapa
            </button>
            <h1 class="text-2xl font-bold text-primary">${stage.title}</h1>
          </div>
          <p class="text-gray-600 mt-2">${stage.description}</p>
        </header>

        <div id="cards-container" class="space-y-6">
          <!-- Cards will be loaded here -->
          <div class="loading-pulse text-center py-10">
            Carregando cartões...
          </div>
        </div>
      </div>
    `;

    // Add event listener for back button
    document.getElementById('back-button').addEventListener('click', () => {
      Router.navigate('journey-map');
    });

    // Load cards with slight delay for animation
    setTimeout(() => {
      this.loadCards(stage, document.getElementById('cards-container'));
    }, 300);
  },

  renderLockedStage(container, stage) {
    container.innerHTML = `
      <div class="stage-locked text-center py-10">
        <div class="bg-gray-100 rounded-xl p-8 max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-xl font-bold mb-4">Etapa Bloqueada</h2>
          <p class="mb-6">Complete as etapas anteriores para desbloquear "${stage.title}"</p>
          <button id="back-button" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            Voltar ao Mapa da Jornada
          </button>
        </div>
      </div>
    `;

    document.getElementById('back-button').addEventListener('click', () => {
      Router.navigate('journey-map');
    });
  },

  loadCards(stage, container) {
    container.innerHTML = '';

    // Get completion status for activities in this stage
    const completedActivities = ProgressService.getCompletedActivities(stage.id);

    // Render introduction card
    this.renderIntroCard(container, stage);

    // Não renderizar cartões de escritura na versão genérica
    // A API da Bíblia continua integrada, mas os cartões não são exibidos

    // Render prayer card (agora chamado de "momento de reflexão")
    const prayer = ContentService.getStagePrayer(stage.id);
    if (prayer) {
      this.renderPrayerCard(container, prayer, stage.id);
    }

    // Render activity cards
    const activities = ContentService.getStageActivities(stage.id);
    activities.forEach(activity => {
      const isCompleted = completedActivities.includes(activity.id);
      this.renderActivityCard(container, activity, isCompleted, stage.id);
    });

    // Render achievement card
    this.renderAchievementCard(container, stage);

    // Add animation to cards
    AnimationService.animateElements('.card', 'fade-in-up');
  },

  renderIntroCard(container, stage) {
    const card = document.createElement('div');
    card.className = 'card p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-md';
    card.innerHTML = `
      <h2 class="text-xl font-bold mb-3">Bem-vindo à Etapa ${stage.id}</h2>
      <h3 class="text-2xl font-bold mb-4">${stage.title}</h3>
      <p class="mb-6">${stage.longDescription}</p>
      <div class="flex justify-between items-center">
        <span class="opacity-75">Etapa ${stage.id} de 3</span>
        <div class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
          ${stage.theme}
        </div>
      </div>
    `;
    container.appendChild(card);
  },

  renderScriptureCard(container, scripture, stageId) {
    const card = document.createElement('div');
    card.className = 'card p-6 bg-white rounded-xl shadow-md';
    card.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Leitura Bíblica</h3>
        <span class="text-xs text-gray-500">${scripture.reference}</span>
      </div>
      <div class="scripture-placeholder p-4 bg-gray-50 rounded-lg mb-4 min-h-[100px] loading-pulse">
        Carregando escritura...
      </div>
      <div class="flex justify-between items-center">
        <button class="scripture-expand-btn py-2 text-center text-primary hover:text-primary-dark">
          Ler Passagem Completa
        </button>
        <button class="reload-verse-btn text-sm text-blue-600 hover:text-blue-800" style="display: none;">
          Recarregar
        </button>
      </div>
    `;
    container.appendChild(card);

    // Load actual scripture content
    this.loadScripture(scripture.reference, card.querySelector('.scripture-placeholder'), stageId);

    // Add event listener for expand button
    card.querySelector('.scripture-expand-btn').addEventListener('click', () => {
      Router.navigate('scripture', { reference: scripture.reference, stageId });
    });

    // Add event listener for reload button
    card.querySelector('.reload-verse-btn').addEventListener('click', () => {
      // Remove this specific verse from cache
      if (BibleService.cache && BibleService.cache[scripture.reference]) {
        delete BibleService.cache[scripture.reference];
        StorageService.set(BibleService.cacheKey, JSON.stringify(BibleService.cache));
      }

      // Reload the verse from API
      const placeholder = card.querySelector('.scripture-placeholder');
      placeholder.innerHTML = `<div class="text-center">Recarregando passagem bíblica...</div>`;
      placeholder.classList.add('loading-pulse');

      // Add a small delay to show the loading state
      setTimeout(() => {
        this.loadScripture(scripture.reference, placeholder, stageId);
      }, 500);
    });
  },

  async loadScripture(reference, container, stageId) {
    try {
      const verse = await BibleService.getVerse(reference);
      const highlightedWords = BibleService.getHighlights(reference);

      // Garantir que o texto da escritura não contenha o texto de licença
      let scriptureText = verse.text;

      // Verificação adicional para garantir que o texto de licença não esteja presente
      if (scriptureText.includes("Dr. Jonathan Gallagher")) {
        // Remover a licença
        scriptureText = scriptureText.split(/Dr\.\s*Jonathan\s*Gallagher/i)[0].trim();
      }

      // Truncar o texto da escritura para exibir apenas as primeiras 4 linhas
      const truncatedText = BibleService.truncateScripture(scriptureText);

      // Create highlighted version of text
      let highlightableText = BibleService.prepareTextForHighlighting(truncatedText);

      container.innerHTML = `
        <div class="scripture-text scripture-truncated" data-reference="${reference}">${highlightableText}</div>
        <div class="mt-3 text-sm text-gray-600 flex items-center justify-between w-full">
          <span>${reference}</span>
          ${verse.license ? `
            <div class="license-info ml-2 relative">
              <span class="info-icon cursor-help text-gray-500 rounded-full border border-gray-300 inline-flex items-center justify-center w-4 h-4 text-xs">i</span>
              <div class="license-tooltip hidden absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-200 rounded shadow-md text-xs max-w-xs text-left z-10">
                ${verse.license}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Apply existing highlights
      highlightedWords.forEach(word => {
        const spans = container.querySelectorAll('.highlightable');
        spans.forEach(span => {
          if (span.textContent.toLowerCase() === word.toLowerCase()) {
            span.classList.add('highlighted');
          }
        });
      });

      // Adicionar eventos para o tooltip de licença
      const infoIcon = container.querySelector('.info-icon');
      const tooltip = container.querySelector('.license-tooltip');

      if (infoIcon && tooltip) {
        infoIcon.addEventListener('mouseenter', () => {
          tooltip.classList.remove('hidden');
        });

        infoIcon.addEventListener('mouseleave', () => {
          tooltip.classList.add('hidden');
        });
      }

      // Add event listeners for highlighting
      const spans = container.querySelectorAll('.highlightable');
      spans.forEach(span => {
        span.addEventListener('click', () => {
          span.classList.toggle('highlighted');

          // Save highlights
          const newHighlights = [];
          container.querySelectorAll('.highlighted').forEach(highlightedSpan => {
            newHighlights.push(highlightedSpan.textContent.toLowerCase());
          });

          BibleService.saveHighlights(reference, newHighlights);

          // Check for achievement
          if (newHighlights.length >= 10) {
            ProgressService.unlockAchievement('highlightedTenWords');
          }

          // Add highlight animation
          AnimationService.addAnimation(span, 'highlight-pulse');
        });
      });

      // Remove loading state
      container.classList.remove('loading-pulse');

    } catch (error) {
      console.error('Error loading scripture:', error);
      container.innerHTML = `
        <div class="text-red-600 p-4 text-center">
          <p class="mb-1">Não foi possível carregar a passagem bíblica.</p>
          <p class="text-xs">Verifique sua conexão.</p>
          <p class="mt-2 font-semibold">${reference}</p>
        </div>
      `;
      container.classList.remove('loading-pulse');
    }
  },

  renderPrayerCard(container, prayer, stageId) {
    const card = document.createElement('div');
    card.className = 'card p-6 bg-blue-50 rounded-xl shadow-md';
    card.innerHTML = `
      <div class="flex items-center mb-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.707 1.707a1 1 0 101.414 1.414l2-2a1 1 0 00.293-.707V7z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold">Momento de Reflexão</h3>
      </div>
      <p class="mb-4">${prayer.description}</p>
      <button id="prayer-btn-${stageId}" class="w-full py-2 text-center bg-primary text-white rounded-lg hover:bg-primary-dark">
        Iniciar Momento de Reflexão
      </button>
    `;
    container.appendChild(card);

    // Add event listener for prayer button
    document.getElementById(`prayer-btn-${stageId}`).addEventListener('click', () => {
      Router.navigate('prayer', { prayerId: prayer.id, stageId });
    });
  },

  renderActivityCard(container, activity, isCompleted, stageId) {
    const card = document.createElement('div');
    card.className = 'card p-6 bg-white rounded-xl shadow-md';

    let completionClass = isCompleted ? 'bg-green-500' : 'bg-gray-200';
    let completionText = isCompleted ? 'Concluído' : 'A Fazer';
    let buttonText = isCompleted ? 'Ver/Editar Atividade' : 'Iniciar Atividade';
    let buttonClass = isCompleted ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-primary text-white hover:bg-primary-dark';

    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold">${activity.title}</h3>
        <span class="px-2 py-1 rounded-full text-xs text-white ${completionClass}">
          ${completionText}
        </span>
      </div>
      <p class="mb-4">${activity.description}</p>
      <p class="text-sm text-gray-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tempo estimado: ${activity.estimatedTime}
      </p>
      <button id="activity-btn-${activity.id}" class="w-full py-2 text-center ${buttonClass} rounded-lg">
        ${buttonText}
      </button>
    `;
    container.appendChild(card);

    // Add event listener for activity button (for both completed and not completed)
    document.getElementById(`activity-btn-${activity.id}`).addEventListener('click', () => {
      Router.navigate('activity', { activityId: activity.id, stageId });
    });
  },

  renderAchievementCard(container, stage) {
    const achievement = ContentService.getStageAchievement(stage.id);
    const isUnlocked = achievement ? ProgressService.hasAchievement(achievement.id) : false;

    if (!achievement) return;

    const card = document.createElement('div');
    card.className = 'card p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl shadow-md';

    let achievementContent = '';

    if (isUnlocked) {
      achievementContent = `
        <div class="text-center mb-4">
          <div class="w-16 h-16 rounded-full bg-yellow-400 mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-lg text-center mb-2">Conquista Desbloqueada!</h3>
        <h4 class="text-xl font-bold text-center mb-4">${achievement.title}</h4>
        <p class="text-center">${achievement.description}</p>
      `;
    } else {
      achievementContent = `
        <div class="text-center mb-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-lg text-center mb-2">Desafio de Conquista</h3>
        <h4 class="text-xl font-bold text-center mb-4">${achievement.title}</h4>
        <p class="text-center">${achievement.criteria}</p>
      `;
    }

    card.innerHTML = achievementContent;
    container.appendChild(card);
  }
};
