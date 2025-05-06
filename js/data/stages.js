/**
 * Stages Data
 * Contains the 3 etapas of the interactive journey
 */

const STAGES = [
  {
    id: 1,
    title: "Etapa Inicial",
    theme: "Introdução",
    description: "Primeiros passos na jornada interativa",
    longDescription: "Bem-vindo ao início da sua jornada interativa. Esta etapa irá ajudá-lo a entender os fundamentos e estabelecer a base para seu progresso nas próximas etapas.",
    isLocked: false,
    scriptures: [
      {
        reference: "João 3:16",
        description: "Exemplo de referência bíblica (API ativa)"
      }
    ],
    prayerId: 1,
    activityIds: [1, 2, 3]
  },
  {
    id: 2,
    title: "Etapa Intermediária",
    theme: "Desenvolvimento",
    description: "Aprofunde seus conhecimentos",
    longDescription: "Nesta etapa intermediária, você irá expandir sua compreensão e desenvolver habilidades mais avançadas para continuar sua jornada de aprendizado.",
    isLocked: true,
    scriptures: [
      {
        reference: "Salmos 119:105",
        description: "Exemplo de referência bíblica (API ativa)"
      },
      {
        reference: "2 Timóteo 3:16-17",
        description: "Outro exemplo de referência (API ativa)"
      }
    ],
    prayerId: 2,
    activityIds: [4, 5, 6]
  },
  {
    id: 3,
    title: "Etapa Final",
    theme: "Conclusão e Aplicação",
    description: "Consolide seu aprendizado e aplique-o",
    longDescription: "Na etapa final, você irá consolidar todo o conhecimento adquirido e aprender como aplicá-lo de forma prática em diferentes contextos.",
    isLocked: true,
    scriptures: [
      {
        reference: "Mateus 6:9-13",
        description: "Exemplo de referência bíblica (API ativa)"
      },
      {
        reference: "Filipenses 4:6-7",
        description: "Outro exemplo de referência (API ativa)"
      }
    ],
    prayerId: 3,
    activityIds: [7, 8, 9]
  }
];