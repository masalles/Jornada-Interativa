/**
 * Achievements Data
 * Contains all unlockable achievements in the application
 */

const ACHIEVEMENTS = [
  // Conquistas específicas de etapa
  {
    id: "completedFirstStage",
    title: "Iniciante",
    description: "Completou todas as atividades da Etapa 1",
    criteria: "Complete todas as três atividades na Etapa Inicial",
    stageId: 1,
    icon: "footprints"
  },
  {
    id: "completedSecondStage",
    title: "Intermediário",
    description: "Completou todas as atividades da Etapa 2",
    criteria: "Complete todas as três atividades na Etapa Intermediária",
    stageId: 2,
    icon: "book-open"
  },
  {
    id: "completedThirdStage",
    title: "Avançado",
    description: "Completou todas as atividades da Etapa 3",
    criteria: "Complete todas as três atividades na Etapa Final",
    stageId: 3,
    icon: "award"
  },

  // Conquistas entre etapas
  {
    id: "highlightedTenWords",
    title: "Pesquisador Atento",
    description: "Destacou 10 palavras significativas nos textos",
    criteria: "Destaque pelo menos 10 palavras em quaisquer passagens de texto",
    icon: "edit"
  },
  {
    id: "completedThreeActivities",
    title: "Entusiasta de Atividades",
    description: "Completou 3 atividades em quaisquer etapas",
    criteria: "Complete quaisquer 3 atividades",
    icon: "check-square"
  },
  {
    id: "completedAllActivities",
    title: "Mestre do Conteúdo",
    description: "Completou todas as 9 atividades da jornada",
    criteria: "Complete todas as atividades nas três etapas",
    icon: "award"
  },
  {
    id: "reflectedFiveTimes",
    title: "Pensador Reflexivo",
    description: "Participou de momentos de reflexão 5 vezes",
    criteria: "Complete qualquer experiência de reflexão guiada 5 vezes",
    icon: "heart"
  },
  {
    id: "scriptureExplorer",
    title: "Explorador de Referências",
    description: "Visualizou 5 passagens bíblicas diferentes",
    criteria: "Visualize 5 passagens bíblicas diferentes usando a API integrada",
    icon: "book"
  },
  {
    id: "sevenDayStreak",
    title: "Usuário Consistente",
    description: "Usou o aplicativo por 7 dias consecutivos",
    criteria: "Abra o aplicativo e complete pelo menos uma atividade por 7 dias seguidos",
    icon: "calendar"
  },
  {
    id: "allStagesUnlocked",
    title: "Jornada Completa",
    description: "Desbloqueou todas as 3 etapas da jornada",
    criteria: "Progrida o suficiente para desbloquear todas as 3 etapas",
    icon: "unlock"
  }
];