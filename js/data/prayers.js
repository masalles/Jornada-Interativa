/**
 * Prayers Data
 * Contains guided reflections for each etapa
 * Note: Mantém estrutura compatível com API bíblica, mas com conteúdo genérico
 */

const PRAYERS = [
  // Etapa 1: Etapa Inicial
  {
    id: 1,
    stageId: 1,
    title: "Momento de Reflexão Inicial",
    description: "Uma reflexão guiada para iniciar sua jornada de aprendizado",
    content: `
      Momento de Reflexão

      Agradeço pela oportunidade de iniciar esta jornada de aprendizado. Estou aqui para expandir meus conhecimentos e crescer.

      Reconheço a importância deste momento e me comprometo a estar presente e aberto(a) a novas ideias e perspectivas.

      Neste momento, reflito sobre minhas motivações:
      (Tire um momento para identificar o que o trouxe até aqui)

      Que esta jornada seja enriquecedora e transformadora, ajudando-me a alcançar meus objetivos.

      Estou pronto(a) para começar.
    `,
    duration: 3, // minutos
    guidance: "Encontre um lugar tranquilo. Respire profundamente para se centralizar. Leia a reflexão lentamente, fazendo pausas para pensar. Personalize este momento com suas próprias motivações e objetivos."
  },

  // Etapa 2: Etapa Intermediária
  {
    id: 2,
    stageId: 2,
    title: "Reflexão sobre o Progresso",
    description: "Um momento para avaliar seu progresso e renovar seu compromisso",
    content: `
      Momento de Avaliação

      Ao chegar neste ponto intermediário da jornada, pauso para refletir sobre o caminho percorrido até aqui.

      Reconheço os conhecimentos que adquiri e as habilidades que desenvolvi. Cada desafio superado representa um passo em minha evolução.

      Observo meu progresso com clareza, identificando:
      - O que aprendi até agora
      - Quais desafios enfrentei
      - Como superei os obstáculos

      Renovo meu compromisso com esta jornada, sabendo que ainda há muito a descobrir e aprender.

      Sigo em frente com determinação renovada.
    `,
    duration: 4,
    guidance: "Reserve este momento para uma avaliação honesta. Reconheça tanto seus sucessos quanto áreas que precisam de mais atenção. Use este tempo para ajustar suas estratégias de aprendizado para a próxima etapa."
  },

  // Etapa 3: Etapa Final
  {
    id: 3,
    stageId: 3,
    title: "Reflexão de Consolidação",
    description: "Uma reflexão para consolidar o aprendizado e planejar a aplicação prática",
    content: `
      Momento de Consolidação

      Chegando ao final desta jornada, dedico este tempo para consolidar tudo o que aprendi.

      Primeiro passo: Reconhecimento
      (Pause para identificar os principais conceitos e habilidades adquiridos)

      Segundo passo: Integração
      (Pause para considerar como esses conhecimentos se conectam entre si)

      Terceiro passo: Aplicação
      (Pause para visualizar como aplicará este conhecimento em situações reais)

      Quarto passo: Continuidade
      (Pause para definir como continuará desenvolvendo estas habilidades)

      Quinto passo: Gratidão
      (Pause para expressar gratidão pelo crescimento alcançado)

      Este não é um fim, mas um novo começo. O verdadeiro valor do conhecimento está em sua aplicação.
    `,
    duration: 5,
    guidance: "Dedique tempo a cada passo. Não se apresse. As pausas são tão importantes quanto as palavras. Considere anotar seus insights para referência futura."
  }
];