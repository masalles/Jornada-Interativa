/**
 * Progress Service
 * Handles user progress tracking and achievements
 */

const ProgressService = {
  userProgressKey: 'user_progress',
  achievementsKey: 'achievements',

  init() {
    console.log('Initializing Progress Service');

    // Initialize user progress if it doesn't exist
    if (!StorageService.get(this.userProgressKey)) {
      this.initializeUserProgress();
    }

    // Initialize achievements if they don't exist
    if (!StorageService.get(this.achievementsKey)) {
      this.initializeAchievements();
    }

    // Record last visit time
    this.updateLastVisit();
  },

  initializeUserProgress() {
    console.log('Initializing user progress');

    const initialProgress = {
      currentStage: 1,
      lastVisit: Date.now(),
      completedActivities: []
    };

    StorageService.set(this.userProgressKey, JSON.stringify(initialProgress));
  },

  initializeAchievements() {
    console.log('Initializing achievements');

    // Get all achievements from content service
    const allAchievements = {};

    // Set all achievements to false (not unlocked)
    ContentService.getAllAchievements().forEach(achievement => {
      allAchievements[achievement.id] = false;
    });

    StorageService.set(this.achievementsKey, JSON.stringify(allAchievements));
  },

  updateLastVisit() {
    return StorageService.updateObject(this.userProgressKey, (progress) => {
      progress.lastVisit = Date.now();
      return progress;
    });
  },

  getUserProgress() {
    const progress = StorageService.get(this.userProgressKey);

    if (!progress) {
      return null;
    }

    try {
      return JSON.parse(progress);
    } catch (e) {
      console.error('Error parsing user progress:', e);
      return null;
    }
  },

  advanceStage(newStageId) {
    console.log(`Advancing to stage ${newStageId}`);

    return StorageService.updateObject(this.userProgressKey, (progress) => {
      // Only advance if new stage is higher
      if (newStageId > progress.currentStage) {
        progress.currentStage = newStageId;

        // Check for first stage completion achievement
        if (newStageId > 1) {
          this.unlockAchievement('completedFirstStage');
        }
      }

      return progress;
    });
  },

  completeActivity(activityId) {
    console.log(`Completing activity ${activityId}`);

    return StorageService.updateObject(this.userProgressKey, (progress) => {
      // Don't add duplicates
      if (!progress.completedActivities.includes(activityId)) {
        progress.completedActivities.push(activityId);

        // Check activity count achievements
        const count = progress.completedActivities.length;
        if (count >= 3) {
          this.unlockAchievement('completedThreeActivities');
        }
        if (count >= 10) {
          this.unlockAchievement('completedTenActivities');
        }
      }

      return progress;
    });
  },

  getCompletedActivities(stageId = null) {
    const progress = this.getUserProgress();

    if (!progress) {
      return [];
    }

    if (stageId === null) {
      return progress.completedActivities;
    } else {
      // Filter activities by stage
      const stageActivities = ContentService.getStageActivities(stageId);
      const stageActivityIds = stageActivities.map(activity => activity.id);

      return progress.completedActivities.filter(id =>
        stageActivityIds.includes(id)
      );
    }
  },

  unlockAchievement(achievementId) {
    console.log(`Unlocking achievement: ${achievementId}`);

    // Get achievement details
    const achievement = ContentService.getAchievementById(achievementId);

    if (!achievement) {
      console.error(`Achievement not found: ${achievementId}`);
      return false;
    }

    return StorageService.updateObject(this.achievementsKey, (achievements) => {
      // Only unlock if not already unlocked
      if (!achievements[achievementId]) {
        achievements[achievementId] = true;

        // Show achievement notification
        this.showAchievementNotification(achievement);
      }

      return achievements;
    });
  },

  showAchievementNotification(achievement) {
    // Use the notification service
    NotificationService.notify({
      title: 'Conquista Desbloqueada!',
      message: achievement.title,
      type: 'success',
      duration: 5000
    });
  },

  getAchievements() {
    const achievements = StorageService.get(this.achievementsKey);

    if (!achievements) {
      return {};
    }

    try {
      return JSON.parse(achievements);
    } catch (e) {
      console.error('Error parsing achievements:', e);
      return {};
    }
  },

  hasAchievement(achievementId) {
    const achievements = this.getAchievements();
    return achievements[achievementId] === true;
  },

  resetProgress() {
    console.log('Resetting all user progress');

    // Clear progress and achievements
    StorageService.remove(this.userProgressKey);
    StorageService.remove(this.achievementsKey);

    // Re-initialize
    this.initializeUserProgress();
    this.initializeAchievements();

    return true;
  }
};