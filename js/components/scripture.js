
/**
 * Scripture Component
 * Displays a full-screen scripture reading experience with highlighting
 */

const ScriptureComponent = {
  render(container, params) {
    console.log('Rendering Scripture component');

    const { reference, stageId } = params;

    container.innerHTML = `
      <div class="scripture-container min-h-screen flex flex-col">
        <header class="p-4 bg-white shadow-sm flex items-center">
          <button id="back-button" class="mr-auto p-2 text-gray-600 hover:text-gray-900">
            ← Voltar
          </button>
          <h1 class="text-lg font-semibold text-center">${reference}</h1>
          <div class="ml-auto w-10"></div> <!-- Spacer for alignment -->
        </header>

        <div class="scripture-content flex-grow p-6 bg-gray-50">
          <div class="max-w-prose mx-auto bg-white rounded-lg shadow-sm p-6">
            <div id="scripture-text" class="scripture-placeholder loading-pulse min-h-[300px] rounded">
              <div class="text-center">Carregando passagem bíblica...</div>
            </div>

            <div class="text-center mt-6 text-sm text-gray-500">
              <p>Toque em palavras para destacá-las</p>
            </div>
          </div>
        </div>

        <footer class="bg-white p-4 shadow-sm">
          <div class="flex justify-between max-w-prose mx-auto">
            <div>
              <span class="text-sm text-gray-600" id="highlight-count">0 palavras destacadas</span>
            </div>
            <div class="flex space-x-4">
              <button id="reload-verse" class="text-sm text-blue-600 hover:text-blue-800" style="display: none;">
                Recarregar Versículo
              </button>
              <button id="clear-highlights" class="text-sm text-red-600 hover:text-red-800">
                Limpar Destaques
              </button>
            </div>
          </div>
        </footer>
      </div>
    `;

    // Add event listener for back button
    document.getElementById('back-button').addEventListener('click', () => {
      Router.navigate('stage', { stageId });
    });

    // Add event listener for clear highlights
    document.getElementById('clear-highlights').addEventListener('click', async () => {
      const confirmed = await NotificationService.confirm({
        title: 'Limpar Destaques',
        message: 'Tem certeza que deseja limpar todos os destaques desta passagem?',
        confirmText: 'Sim, limpar',
        cancelText: 'Cancelar',
        type: 'warning'
      });

      if (confirmed) {
        BibleService.saveHighlights(reference, []);
        this.loadScripture(reference, document.getElementById('scripture-text'));

        // Show confirmation notification
        NotificationService.notify({
          title: 'Destaques Removidos',
          message: 'Todos os destaques foram removidos desta passagem.',
          type: 'info',
          duration: 3000
        });
      }
    });

    // Add event listener for reload verse
    document.getElementById('reload-verse').addEventListener('click', () => {
      // Remove this specific verse from cache
      if (BibleService.cache && BibleService.cache[reference]) {
        delete BibleService.cache[reference];
        StorageService.set(BibleService.cacheKey, JSON.stringify(BibleService.cache));
      }

      // Reload the verse from API
      const scriptureText = document.getElementById('scripture-text');
      scriptureText.innerHTML = `
        <div class="text-center loading-pulse min-h-[300px] rounded">
          Recarregando passagem bíblica...
        </div>
      `;

      // Add a small delay to show the loading state
      setTimeout(() => {
        this.loadScripture(reference, scriptureText);
      }, 500);
    });

    // Load scripture
    this.loadScripture(reference, document.getElementById('scripture-text'));
  },

  async loadScripture(reference, container) {
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

      // Create highlighted version of text
      let highlightableText = BibleService.prepareTextForHighlighting(scriptureText);

      container.innerHTML = `
        <div class="scripture-text text-lg" data-reference="${reference}">
          ${highlightableText}
        </div>
        <div class="mt-4 text-sm text-gray-600 text-right flex items-center justify-end">
          ${verse.license ? `
            <div class="license-info relative">
              <span class="info-icon cursor-help text-gray-500 rounded-full border border-gray-300 inline-flex items-center justify-center w-5 h-5 text-xs">i</span>
              <div class="license-tooltip hidden absolute bottom-0 right-0 mb-8 p-2 bg-white border border-gray-200 rounded shadow-md text-xs max-w-xs text-left z-10">
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

          // Update highlight count
          document.getElementById('highlight-count').textContent =
            `${newHighlights.length} palavra${newHighlights.length !== 1 ? 's' : ''} destacada${newHighlights.length !== 1 ? 's' : ''}`;
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

    } catch (error) {
      console.error('Error loading scripture:', error);
      container.innerHTML = `
        <div class="text-red-600 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="mb-2">Não foi possível carregar a passagem bíblica.</p>
          <p class="text-sm">Verifique sua conexão com a internet e tente novamente.</p>
          <p class="mt-4 font-semibold">${reference}</p>
        </div>
      `;
      container.classList.remove('loading-pulse');
    }
  }
};
