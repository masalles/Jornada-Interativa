/**
 * Activities Data
 * Contains all activities across the 3 etapas
 */

const ACTIVITIES = [
  // Etapa 1: Etapa Inicial
  {
    id: 1,
    stageId: 1,
    title: "Atividade de Introdução",
    description: "Conheça os fundamentos básicos do tema",
    steps: [
      "Dedique tempo para ler o material introdutório fornecido",
      "Anote os conceitos principais que você identificou",
      "Identifique áreas que você gostaria de explorar mais"
    ],
    reflection: "Quais aspectos do conteúdo despertaram mais seu interesse? Quais perguntas surgiram?",
    estimatedTime: "20 minutos"
  },
  {
    id: 2,
    stageId: 1,
    title: "Reflexão Pessoal",
    description: "Reflita sobre sua experiência prévia com o tema",
    steps: [
      "Encontre um lugar tranquilo onde você não será perturbado",
      "Pense sobre suas experiências anteriores relacionadas ao tema",
      "Anote momentos-chave que moldaram sua compreensão atual"
    ],
    reflection: "Como sua visão sobre este tema evoluiu ao longo do tempo? Quais experiências mais influenciaram sua perspectiva?",
    estimatedTime: "15 minutos"
  },
  {
    id: 3,
    stageId: 1,
    title: "Definição de Objetivos",
    description: "Estabeleça objetivos específicos para seu aprendizado",
    steps: [
      "Considere áreas de desenvolvimento que você deseja buscar",
      "Anote 3-5 objetivos específicos e alcançáveis",
      "Crie um plano simples para trabalhar em direção a esses objetivos"
    ],
    reflection: "Quais obstáculos você pode enfrentar ao buscar esses objetivos? Como você pode superá-los?",
    estimatedTime: "15 minutos"
  },

  // Etapa 2: Etapa Intermediária
  {
    id: 4,
    stageId: 2,
    title: "Análise de Conteúdo",
    description: "Aprenda a analisar e interpretar informações relevantes",
    steps: [
      "Familiarize-se com as técnicas de análise apresentadas",
      "Pratique aplicando essas técnicas em exemplos fornecidos",
      "Compare suas análises com os exemplos resolvidos"
    ],
    reflection: "Quais técnicas de análise você achou mais úteis? Por quê?",
    estimatedTime: "25 minutos"
  },
  {
    id: 5,
    stageId: 2,
    title: "Exercício Prático",
    description: "Aplique os conhecimentos em um exercício prático",
    steps: [
      "Revise o material de referência fornecido",
      "Complete o exercício prático seguindo as instruções",
      "Reflita sobre os desafios encontrados e como você os superou"
    ],
    reflection: "Como este exercício ajudou a aprofundar sua compreensão? Quais novas percepções você obteve?",
    estimatedTime: "20 minutos"
  },
  {
    id: 6,
    stageId: 2,
    title: "Plano de Estudo",
    description: "Desenvolva um plano de estudo contínuo",
    steps: [
      "Explore diferentes recursos e materiais disponíveis",
      "Selecione os que melhor se adaptam ao seu estilo de aprendizado",
      "Configure um cronograma realista para continuar seus estudos"
    ],
    reflection: "Qual abordagem de estudo funciona melhor para você? O que pode ajudá-lo a manter a consistência?",
    estimatedTime: "15 minutos"
  },

  // Etapa 3: Etapa Final
  {
    id: 7,
    stageId: 3,
    title: "Projeto Final",
    description: "Desenvolva um projeto que demonstre o conhecimento adquirido",
    steps: [
      "Revise todo o conteúdo das etapas anteriores",
      "Planeje seu projeto seguindo as diretrizes fornecidas",
      "Implemente o projeto aplicando os conceitos aprendidos"
    ],
    reflection: "Como este projeto consolidou seu aprendizado? Quais aspectos foram mais desafiadores?",
    estimatedTime: "30 minutos"
  },
  {
    id: 8,
    stageId: 3,
    title: "Avaliação de Progresso",
    description: "Avalie seu progresso e identifique áreas para desenvolvimento futuro",
    steps: [
      "Compare seu nível atual de conhecimento com seus objetivos iniciais",
      "Identifique áreas onde você progrediu e onde ainda precisa melhorar",
      "Crie um plano para abordar as lacunas identificadas"
    ],
    reflection: "Quais foram suas maiores conquistas durante esta jornada? Quais habilidades você ainda deseja desenvolver?",
    estimatedTime: "20 minutos"
  },
  {
    id: 9,
    stageId: 3,
    title: "Plano de Aplicação",
    description: "Desenvolva um plano para aplicar o conhecimento no mundo real",
    steps: [
      "Identifique situações reais onde você pode aplicar o que aprendeu",
      "Crie estratégias específicas para implementação prática",
      "Estabeleça métricas para avaliar o sucesso da aplicação"
    ],
    reflection: "Como você pretende usar este conhecimento no futuro? Quais impactos positivos você espera gerar?",
    estimatedTime: "25 minutos"
  }
];