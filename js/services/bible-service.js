
/**
 * Bible Service
 * Handles fetching and managing scripture passages
 */

const BibleService = {
  apiBase: 'https://api.scripture.api.bible/v1',
  apiToken: 'd9a13d64ab6be72298f24ee82aba3b14',
  cacheKey: 'bible_verses_cache',
  cache: {},
  bibleId: null, // Será definido durante a inicialização
  languageCode: 'por', // Código ISO 639-3 para português

  // Mapeamento de nomes de livros da Bíblia do português para o inglês
  bookNameMapping: {
    // Antigo Testamento
    'gênesis': 'genesis',
    'êxodo': 'exodus',
    'levítico': 'leviticus',
    'números': 'numbers',
    'deuteronômio': 'deuteronomy',
    'josué': 'joshua',
    'juízes': 'judges',
    'rute': 'ruth',
    '1 samuel': '1 samuel',
    '2 samuel': '2 samuel',
    '1 reis': '1 kings',
    '2 reis': '2 kings',
    '1 crônicas': '1 chronicles',
    '2 crônicas': '2 chronicles',
    'esdras': 'ezra',
    'neemias': 'nehemiah',
    'ester': 'esther',
    'jó': 'job',
    'salmos': 'psalms',
    'provérbios': 'proverbs',
    'eclesiastes': 'ecclesiastes',
    'cantares': 'song of solomon',
    'isaías': 'isaiah',
    'jeremias': 'jeremiah',
    'lamentações': 'lamentations',
    'ezequiel': 'ezekiel',
    'daniel': 'daniel',
    'oséias': 'hosea',
    'joel': 'joel',
    'amós': 'amos',
    'obadias': 'obadiah',
    'jonas': 'jonah',
    'miquéias': 'micah',
    'naum': 'nahum',
    'habacuque': 'habakkuk',
    'sofonias': 'zephaniah',
    'ageu': 'haggai',
    'zacarias': 'zechariah',
    'malaquias': 'malachi',

    // Novo Testamento
    'mateus': 'matthew',
    'marcos': 'mark',
    'lucas': 'luke',
    'joão': 'john',
    'atos': 'acts',
    'romanos': 'romans',
    '1 coríntios': '1 corinthians',
    '2 coríntios': '2 corinthians',
    'gálatas': 'galatians',
    'efésios': 'ephesians',
    'filipenses': 'philippians',
    'colossenses': 'colossians',
    '1 tessalonicenses': '1 thessalonians',
    '2 tessalonicenses': '2 thessalonians',
    '1 timóteo': '1 timothy',
    '2 timóteo': '2 timothy',
    'tito': 'titus',
    'filemom': 'philemon',
    'hebreus': 'hebrews',
    'tiago': 'james',
    '1 pedro': '1 peter',
    '2 pedro': '2 peter',
    '1 joão': '1 john',
    '2 joão': '2 john',
    '3 joão': '3 john',
    'judas': 'jude',
    'apocalipse': 'revelation'
  },

  async init() {
    console.log('Initializing Bible Service');

    // Clear cache to ensure we use the new API
    this.clearCache();

    // Iniciar com cache vazio
    this.cache = {};

    try {
      // Primeiro, buscar uma versão da Bíblia em português
      await this.findPortugueseBible();

      // Depois, carregar o cache se disponível
      const cachedVerses = StorageService.get(this.cacheKey);
      if (cachedVerses) {
        try {
          this.cache = JSON.parse(cachedVerses);
          console.log(`Loaded ${Object.keys(this.cache).length} cached verses`);
        } catch (e) {
          console.error('Error parsing verse cache:', e);
          this.cache = {};
        }
      }
    } catch (error) {
      console.error('Error initializing Bible Service:', error);
    }
  },

  // Busca uma versão da Bíblia em português
  async findPortugueseBible() {
    try {
      // Verificar se já temos um bibleId salvo
      const savedBibleId = StorageService.get('selected_bible_id');
      if (savedBibleId) {
        this.bibleId = savedBibleId;
        console.log(`Using saved Bible ID: ${this.bibleId}`);
        return;
      }

      // Buscar todas as Bíblias disponíveis
      const response = await fetch(`${this.apiBase}/bibles?language=${this.languageCode}`, {
        headers: {
          'api-key': this.apiToken
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Bibles: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Available Bibles:', data);

      // Encontrar uma versão em português
      if (data.data && data.data.length > 0) {
        // Preferir versões populares como NVI, ARA, etc.
        const preferredVersions = ['ARA', 'NVI', 'ACF', 'NAA', 'NTLH'];

        // Tentar encontrar uma das versões preferidas
        let selectedBible = null;

        for (const version of preferredVersions) {
          const bible = data.data.find(b => b.abbreviation === version || b.abbreviationLocal === version);
          if (bible) {
            selectedBible = bible;
            break;
          }
        }

        // Se não encontrou uma versão preferida, usar a primeira disponível
        if (!selectedBible && data.data.length > 0) {
          selectedBible = data.data[0];
        }

        if (selectedBible) {
          this.bibleId = selectedBible.id;
          console.log(`Selected Bible: ${selectedBible.name} (${selectedBible.abbreviationLocal || selectedBible.abbreviation}) - ID: ${this.bibleId}`);

          // Salvar o bibleId para uso futuro
          StorageService.set('selected_bible_id', this.bibleId);
        } else {
          throw new Error('No Portuguese Bible found');
        }
      } else {
        throw new Error('No Bibles found');
      }
    } catch (error) {
      console.error('Error finding Portuguese Bible:', error);
      // Definir um ID padrão como fallback (ARA - Almeida Revista e Atualizada)
      this.bibleId = '90799bb5b996fddc-01';
      console.log(`Using fallback Bible ID: ${this.bibleId}`);
    }
  },

  clearCache() {
    console.log('Clearing Bible verse cache');
    this.cache = {};
    StorageService.remove(this.cacheKey);

    // Also try to clear the browser's cache for scripture.api.bible
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.open(cacheName).then(cache => {
            cache.keys().then(requests => {
              requests.forEach(request => {
                if (request.url.includes('api.scripture.api.bible')) {
                  cache.delete(request);
                  console.log(`Deleted from cache: ${request.url}`);
                }
              });
            });
          });
        });
      }).catch(error => {
        console.error('Error clearing cache:', error);
      });
    }
  },

  // Formata a referência para o formato esperado pela API scripture.api.bible
  async formatReferenceForApi(reference) {
    if (!reference) return null;

    try {
      // Primeiro, obter os IDs dos livros disponíveis na Bíblia selecionada
      const bookIds = await this.getBookIds();
      if (!bookIds || bookIds.length === 0) {
        throw new Error('No book IDs available');
      }

      // Separa o nome do livro do capítulo e versículo
      // Exemplo: "João 3:16" -> ["João", "3:16"]
      const parts = reference.split(/\s+(?=\d)/);
      if (parts.length < 2) return null; // Formato inválido

      const bookName = parts[0].toLowerCase();
      const chapterVerse = parts.slice(1).join(' ');

      // Traduz o nome do livro se existir no mapeamento
      const translatedBookName = this.bookNameMapping[bookName] || bookName;

      // Encontrar o ID do livro correspondente
      const bookId = this.findBookId(bookIds, translatedBookName);
      if (!bookId) {
        throw new Error(`Book not found: ${bookName} (${translatedBookName})`);
      }

      // Processar capítulo e versículo
      // Formatos possíveis: "3:16", "3:16-18", "3"
      let chapter, verse;
      if (chapterVerse.includes(':')) {
        // Formato: "3:16" ou "3:16-18"
        const [chapterStr, verseStr] = chapterVerse.split(':');
        chapter = chapterStr.trim();

        // Se for um intervalo de versículos, pegar apenas o primeiro
        if (verseStr.includes('-')) {
          verse = verseStr.split('-')[0].trim();
        } else {
          verse = verseStr.trim();
        }
      } else {
        // Formato: "3" (capítulo inteiro)
        chapter = chapterVerse.trim();
        verse = '1'; // Usar o primeiro versículo como padrão
      }

      // Formatar a referência no formato esperado pela API: {bookId}.{chapter}.{verse}
      const formattedRef = `${bookId}.${chapter}.${verse}`;
      console.log(`Formatted reference: "${reference}" -> "${formattedRef}"`);
      return formattedRef;
    } catch (error) {
      console.error('Error formatting reference:', error);
      return null;
    }
  },

  // Obtém os IDs dos livros disponíveis na Bíblia selecionada
  async getBookIds() {
    try {
      // Verificar se já temos os IDs dos livros em cache
      const cachedBookIds = StorageService.get(`book_ids_${this.bibleId}`);
      if (cachedBookIds) {
        return JSON.parse(cachedBookIds);
      }

      // Buscar os livros da Bíblia selecionada
      const response = await fetch(`${this.apiBase}/bibles/${this.bibleId}/books`, {
        headers: {
          'api-key': this.apiToken
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Available books:', data);

      if (!data.data || data.data.length === 0) {
        throw new Error('No books found');
      }

      // Extrair os IDs dos livros
      const bookIds = data.data.map(book => ({
        id: book.id,
        name: book.name,
        nameLong: book.nameLong,
        abbreviation: book.abbreviation
      }));

      // Salvar os IDs dos livros em cache
      StorageService.set(`book_ids_${this.bibleId}`, JSON.stringify(bookIds));

      return bookIds;
    } catch (error) {
      console.error('Error getting book IDs:', error);
      return null;
    }
  },

  // Encontra o ID do livro correspondente ao nome
  findBookId(bookIds, bookName) {
    if (!bookIds || bookIds.length === 0 || !bookName) return null;

    // Normalizar o nome do livro (remover acentos, converter para minúsculas)
    const normalizedName = bookName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Tentar encontrar o livro pelo nome exato
    let book = bookIds.find(b =>
      b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedName ||
      b.nameLong.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedName ||
      b.abbreviation.toLowerCase() === normalizedName
    );

    // Se não encontrou, tentar encontrar pelo início do nome
    if (!book) {
      book = bookIds.find(b =>
        b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(normalizedName) ||
        b.nameLong.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(normalizedName)
      );
    }

    // Se ainda não encontrou, tentar encontrar pelo nome em inglês
    if (!book) {
      // Mapeamento de nomes em inglês para possíveis IDs
      const englishToId = {
        'genesis': 'GEN',
        'exodus': 'EXO',
        'leviticus': 'LEV',
        'numbers': 'NUM',
        'deuteronomy': 'DEU',
        'joshua': 'JOS',
        'judges': 'JDG',
        'ruth': 'RUT',
        '1 samuel': '1SA',
        '2 samuel': '2SA',
        '1 kings': '1KI',
        '2 kings': '2KI',
        '1 chronicles': '1CH',
        '2 chronicles': '2CH',
        'ezra': 'EZR',
        'nehemiah': 'NEH',
        'esther': 'EST',
        'job': 'JOB',
        'psalms': 'PSA',
        'proverbs': 'PRO',
        'ecclesiastes': 'ECC',
        'song of solomon': 'SNG',
        'isaiah': 'ISA',
        'jeremiah': 'JER',
        'lamentations': 'LAM',
        'ezekiel': 'EZK',
        'daniel': 'DAN',
        'hosea': 'HOS',
        'joel': 'JOL',
        'amos': 'AMO',
        'obadiah': 'OBA',
        'jonah': 'JON',
        'micah': 'MIC',
        'nahum': 'NAM',
        'habakkuk': 'HAB',
        'zephaniah': 'ZEP',
        'haggai': 'HAG',
        'zechariah': 'ZEC',
        'malachi': 'MAL',
        'matthew': 'MAT',
        'mark': 'MRK',
        'luke': 'LUK',
        'john': 'JHN',
        'acts': 'ACT',
        'romans': 'ROM',
        '1 corinthians': '1CO',
        '2 corinthians': '2CO',
        'galatians': 'GAL',
        'ephesians': 'EPH',
        'philippians': 'PHP',
        'colossians': 'COL',
        '1 thessalonians': '1TH',
        '2 thessalonians': '2TH',
        '1 timothy': '1TI',
        '2 timothy': '2TI',
        'titus': 'TIT',
        'philemon': 'PHM',
        'hebrews': 'HEB',
        'james': 'JAS',
        '1 peter': '1PE',
        '2 peter': '2PE',
        '1 john': '1JN',
        '2 john': '2JN',
        '3 john': '3JN',
        'jude': 'JUD',
        'revelation': 'REV'
      };

      const possibleId = englishToId[normalizedName];
      if (possibleId) {
        book = bookIds.find(b => b.id === possibleId);
      }
    }

    return book ? book.id : null;
  },

  async getVerse(reference) {
    console.log(`Getting verse: ${reference}`);

    // Check cache first
    if (this.cache[reference]) {
      console.log(`Found "${reference}" in cache`);
      return this.cache[reference];
    }

    try {
      // Verificar se temos um bibleId
      if (!this.bibleId) {
        await this.findPortugueseBible();
      }

      // Formatar a referência para a API
      // A API scripture.api.bible usa um formato diferente: {bookId}.{chapter}.{verse}
      const formattedRef = await this.formatReferenceForApi(reference);

      if (!formattedRef) {
        throw new Error(`Could not format reference: ${reference}`);
      }

      // Construir a URL da API
      const apiUrl = `${this.apiBase}/bibles/${this.bibleId}/verses/${formattedRef}`;
      console.log(`Fetching "${reference}" (as "${formattedRef}") from API: ${apiUrl}`);

      // Fetch from API with API key
      const response = await fetch(apiUrl, {
        headers: {
          'api-key': this.apiToken
        }
      });

      if (!response.ok) {
        const errorMessage = `Failed to fetch verse: ${response.status} - ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API response for "${reference}":`, data);

      // Limpar o conteúdo da escritura
      const cleanContent = this.cleanScriptureContent(data.data.content);

      // Process verse data
      const verse = {
        reference: reference, // Mantém a referência original em português
        text: cleanContent.text, // Texto limpo da escritura
        license: cleanContent.license, // Informações de licença
        verses: [{
          book_id: data.data.bookId,
          book_name: data.data.reference,
          chapter: data.data.chapterId,
          verse: data.data.verseId,
          text: cleanContent.text
        }],
        translation: data.data.copyright || 'Bíblia em Português'
      };

      // Save to cache
      this.cache[reference] = verse;
      StorageService.set(this.cacheKey, JSON.stringify(this.cache));

      console.log(`Cached verse: ${reference}`);
      return verse;
    } catch (error) {
      console.error('Error fetching Bible verse:', error);

      // Return fallback for offline mode or API errors
      return {
        reference: reference,
        text: "Não foi possível carregar o versículo. Por favor, verifique sua conexão com a internet ou contate o suporte se o problema persistir.",
        verses: [],
        translation: "Offline",
        error: error.message
      };
    }
  },

  // Mantém o método translateReference para compatibilidade com código existente
  translateReference(reference) {
    console.log(`translateReference is deprecated, using formatReferenceForApi instead`);
    return reference;
  },

  // Prepare text for highlighting by wrapping words in spans
  prepareTextForHighlighting(text) {
    return text.replace(/(\w+)/g, '<span class="highlightable">$1</span>');
  },

  // Save highlighted words for a verse
  saveHighlights(reference, highlightedWords) {
    console.log(`Saving highlights for ${reference}:`, highlightedWords);

    return StorageService.updateObject('scripture_highlights', (highlights) => {
      highlights[reference] = highlightedWords;
      return highlights;
    });
  },

  // Get highlighted words for a verse
  getHighlights(reference) {
    const highlights = StorageService.get('scripture_highlights');

    if (!highlights) {
      return [];
    }

    try {
      const highlightsObj = JSON.parse(highlights);
      return highlightsObj[reference] || [];
    } catch (e) {
      console.error('Error parsing highlights:', e);
      return [];
    }
  },

  // Limpa o conteúdo da escritura removendo tags HTML expostas e descartando o texto de licença
  cleanScriptureContent(content) {
    if (!content) return { text: '', license: '' };

    // Separar o texto principal da licença
    // Padrão para identificar o início do texto de licença
    const licensePattern = /Dr\.\s*Jonathan\s*Gallagher/i;

    // Verificar se o texto contém a licença
    if (licensePattern.test(content)) {
      // Dividir o conteúdo no ponto onde começa a licença
      const parts = content.split(licensePattern);
      let mainText = parts[0] || '';

      // Armazenar a licença apenas para o tooltip de informação
      // Formato simplificado para o tooltip
      let licenseText = "Dr. Jonathan Gallagher – CC BY-SA 4.0 License – jonathangallagherfbv@gmail.com";

      // Corrigir tags HTML mal formadas
      mainText = this.cleanHtmlTags(mainText);

      return {
        text: mainText.trim(),
        license: licenseText
      };
    } else {
      // Se não encontrou o padrão de licença, limpar o conteúdo inteiro
      const cleanedText = this.cleanHtmlTags(content);

      return {
        text: cleanedText.trim(),
        license: "Dr. Jonathan Gallagher – CC BY-SA 4.0 License – jonathangallagherfbv@gmail.com"
      };
    }
  },

  // Função auxiliar para limpar tags HTML
  cleanHtmlTags(text) {
    return text
      .replace(/<span/g, '<span') // Corrigir abertura de span
      .replace(/span>/g, '</span>') // Corrigir fechamento de span
      .replace(/<p/g, '<p') // Corrigir abertura de p
      .replace(/p>/g, '</p>') // Corrigir fechamento de p
      .replace(/<\/span>\s*<\/p>/g, '</span></p>') // Corrigir fechamento de span e p
      .replace(/<p class="p">/g, '') // Remover abertura de p
      .replace(/<\/p>/g, '') // Remover fechamento de p
      .replace(/<span[^>]*data-number[^>]*>(.*?)<\/span>/g, '') // Remover spans com números de versículos
      .replace(/<span[^>]*data-sid[^>]*>(.*?)<\/span>/g, ''); // Remover spans com IDs
  },

  // Trunca o texto da escritura para exibir apenas as primeiras 4 linhas
  truncateScripture(text, maxLines = 4) {
    if (!text) return '';

    // Dividir o texto em linhas
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

    // Se o texto tiver mais de maxLines linhas, truncar e adicionar [...]
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + ' [...]';
    }

    return text;
  }
};

