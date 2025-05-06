/**
 * Animation Service
 * Handles animations and transitions
 */

const AnimationService = {
  prefersReducedMotion: false,
  
  init() {
    console.log('Initializing Animation Service');
    
    // Check if user prefers reduced motion
    this.checkReducedMotion();
    
    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
      this.checkReducedMotion();
    });
  },
  
  checkReducedMotion() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log(`Reduced motion preference: ${this.prefersReducedMotion}`);
    
    // Add class to body if reduced motion is preferred
    if (this.prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  },
  
  // Add animation to element(s)
  animateElements(selector, animationClass, delay = 0, staggerDelay = 0) {
    if (this.prefersReducedMotion) {
      return; // Skip animations if reduced motion is preferred
    }
    
    const elements = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : [selector]; // Handle both selector strings and direct elements
    
    Array.from(elements).forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
        
        // For temporary animations, remove class after animation completes
        if (animationClass === 'highlight-pulse' || animationClass === 'fade-in') {
          setTimeout(() => {
            element.classList.remove(animationClass);
          }, 1500); // Adjust based on animation duration
        }
      }, delay + (staggerDelay * index));
    });
  },
  
  // Add a single temporary animation to an element
  addAnimation(element, animationClass, duration = 1500) {
    if (this.prefersReducedMotion) {
      return; // Skip animations if reduced motion is preferred
    }
    
    element.classList.add(animationClass);
    
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  },
  
  // Page transition animation
  pageTransition(outgoingElement, incomingElement, callback) {
    if (this.prefersReducedMotion) {
      // Skip animation if reduced motion is preferred
      outgoingElement.style.display = 'none';
      incomingElement.style.display = 'block';
      if (callback) callback();
      return;
    }
    
    outgoingElement.classList.add('page-exit');
    outgoingElement.classList.add('page-exit-active');
    
    setTimeout(() => {
      outgoingElement.style.display = 'none';
      incomingElement.style.display = 'block';
      incomingElement.classList.add('page-enter');
      incomingElement.classList.add('page-enter-active');
      
      setTimeout(() => {
        incomingElement.classList.remove('page-enter');
        incomingElement.classList.remove('page-enter-active');
        if (callback) callback();
      }, 300);
    }, 300);
  },
  
  // Card flip animation
  flipCard(cardElement, callback) {
    if (this.prefersReducedMotion) {
      // Skip animation if reduced motion is preferred
      cardElement.classList.toggle('flipped');
      if (callback) callback();
      return;
    }
    
    cardElement.classList.toggle('flipped');
    
    setTimeout(() => {
      if (callback) callback();
    }, 600); // Match the flip transition duration
  },
  
  // Achievement unlock animation
  animateAchievement(achievementElement) {
    if (this.prefersReducedMotion) {
      achievementElement.style.opacity = 1;
      return;
    }
    
    achievementElement.classList.add('achievement-unlock');
  },
  
  // Sequentially animate items in a container
  animateSequence(containerSelector, itemSelector, animationClass, baseDelay = 0, staggerDelay = 100) {
    if (this.prefersReducedMotion) {
      return; // Skip animations if reduced motion is preferred
    }
    
    const container = document.querySelector(containerSelector);
    
    if (!container) return;
    
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add(animationClass);
      }, baseDelay + (index * staggerDelay));
    });
  }
};