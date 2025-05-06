/**
 * Storage Service
 * Handles local storage operations with fallbacks
 */

const StorageService = {
  isAvailable: false,
  
  init() {
    // Check if localStorage is available
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      this.isAvailable = true;
      console.log('LocalStorage is available');
    } catch (e) {
      this.isAvailable = false;
      console.warn('LocalStorage is not available, using fallback');
    }
  },
  
  set(key, value) {
    if (!this.isAvailable) {
      console.warn(`Cannot store ${key} - localStorage not available`);
      return false;
    }
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('Error storing data:', e);
      return false;
    }
  },
  
  get(key) {
    if (!this.isAvailable) {
      return null;
    }
    
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error retrieving data:', e);
      return null;
    }
  },
  
  remove(key) {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing data:', e);
      return false;
    }
  },
  
  clear() {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing data:', e);
      return false;
    }
  },
  
  // Helper method to update a JSON object in localStorage
  updateObject(key, updater) {
    const existing = this.get(key);
    let obj = {};
    
    if (existing) {
      try {
        obj = JSON.parse(existing);
      } catch (e) {
        console.error(`Error parsing ${key} from localStorage:`, e);
      }
    }
    
    const updated = updater(obj);
    return this.set(key, JSON.stringify(updated));
  }
};