/**
 * Content Service
 * Manages application content and data
 */

const ContentService = {
  stages: null,
  activities: null,
  prayers: null,
  achievements: null,
  
  init() {
    console.log('Initializing Content Service');
    
    // Populate from imported data files
    this.stages = STAGES;
    this.activities = ACTIVITIES;
    this.prayers = PRAYERS;
    this.achievements = ACHIEVEMENTS;
    
    console.log(`Loaded: ${this.stages.length} stages, ${this.activities.length} activities, ${this.prayers.length} prayers, ${this.achievements.length} achievements`);
  },
  
  // Stage methods
  getAllStages() {
    return this.stages;
  },
  
  getStage(stageId) {
    return this.stages.find(stage => stage.id === parseInt(stageId));
  },
  
  getNextStage(currentStageId) {
    const nextStageId = parseInt(currentStageId) + 1;
    return this.getStage(nextStageId);
  },
  
  // Activity methods
  getAllActivities() {
    return this.activities;
  },
  
  getActivity(activityId) {
    return this.activities.find(activity => activity.id === parseInt(activityId));
  },
  
  getStageActivities(stageId) {
    return this.activities.filter(activity => activity.stageId === parseInt(stageId));
  },
  
  // Prayer methods
  getAllPrayers() {
    return this.prayers;
  },
  
  getPrayer(prayerId) {
    return this.prayers.find(prayer => prayer.id === parseInt(prayerId));
  },
  
  getStagePrayer(stageId) {
    return this.prayers.find(prayer => prayer.stageId === parseInt(stageId));
  },
  
  // Achievement methods
  getAllAchievements() {
    return this.achievements;
  },
  
  getAchievementById(achievementId) {
    return this.achievements.find(achievement => achievement.id === achievementId);
  },
  
  getStageAchievement(stageId) {
    return this.achievements.find(achievement => achievement.stageId === parseInt(stageId));
  },
  
  // Scripture methods
  getStageScriptures(stageId) {
    const stage = this.getStage(stageId);
    return stage ? stage.scriptures : [];
  }
};