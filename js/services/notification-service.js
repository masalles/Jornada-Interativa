/**
 * Notification Service
 * Handles in-app notifications, alerts, and confirmations
 */

const NotificationService = {
  /**
   * Show a notification message
   * @param {Object} options - Notification options
   * @param {string} options.title - Title of the notification
   * @param {string} options.message - Message content
   * @param {string} options.type - Type of notification: 'info', 'success', 'warning', 'error'
   * @param {number} options.duration - Duration in ms (default: 5000, 0 for persistent)
   */
  notify(options) {
    const { title, message, type = 'info', duration = 5000 } = options;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `app-notification fixed bottom-4 right-4 p-4 rounded shadow-lg z-50 ${this.getTypeClass(type)}`;
    notification.setAttribute('role', 'alert');
    
    // Create notification content
    notification.innerHTML = `
      <div class="flex">
        <div class="py-1 mr-3">
          ${this.getIconForType(type)}
        </div>
        <div>
          ${title ? `<p class="font-bold">${title}</p>` : ''}
          <p class="text-sm">${message}</p>
        </div>
        <button class="ml-4 text-sm close-notification" aria-label="Fechar">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add close button event listener
    notification.querySelector('.close-notification').addEventListener('click', () => {
      this.removeNotification(notification);
    });
    
    // Auto-remove after duration (if not persistent)
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }
    
    return notification;
  },
  
  /**
   * Show a confirmation dialog
   * @param {Object} options - Confirmation options
   * @param {string} options.title - Title of the confirmation
   * @param {string} options.message - Message content
   * @param {string} options.confirmText - Text for confirm button
   * @param {string} options.cancelText - Text for cancel button
   * @param {string} options.type - Type of confirmation: 'info', 'warning', 'danger'
   * @returns {Promise} Resolves with true (confirm) or false (cancel)
   */
  confirm(options) {
    return new Promise((resolve) => {
      const { 
        title, 
        message, 
        confirmText = 'Confirmar', 
        cancelText = 'Cancelar',
        type = 'warning'
      } = options;
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      
      // Create confirmation dialog
      overlay.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="p-4 ${this.getHeaderClass(type)}">
            <h3 class="text-lg font-medium">${title}</h3>
          </div>
          <div class="p-4">
            <p>${message}</p>
          </div>
          <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
            <button class="cancel-button px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded">
              ${cancelText}
            </button>
            <button class="confirm-button px-4 py-2 ${this.getButtonClass(type)} rounded">
              ${confirmText}
            </button>
          </div>
        </div>
      `;
      
      // Add to DOM
      document.body.appendChild(overlay);
      
      // Focus the cancel button (safer default)
      setTimeout(() => {
        overlay.querySelector('.cancel-button').focus();
      }, 100);
      
      // Add event listeners
      overlay.querySelector('.confirm-button').addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(true);
      });
      
      overlay.querySelector('.cancel-button').addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(false);
      });
      
      // Close on escape key
      document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
          document.body.removeChild(overlay);
          document.removeEventListener('keydown', escapeHandler);
          resolve(false);
        }
      });
    });
  },
  
  /**
   * Show an alert dialog
   * @param {Object} options - Alert options
   * @param {string} options.title - Title of the alert
   * @param {string} options.message - Message content
   * @param {string} options.buttonText - Text for the button
   * @param {string} options.type - Type of alert: 'info', 'success', 'warning', 'error'
   * @returns {Promise} Resolves when the alert is closed
   */
  alert(options) {
    return new Promise((resolve) => {
      const { 
        title, 
        message, 
        buttonText = 'OK',
        type = 'info'
      } = options;
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      
      // Create alert dialog
      overlay.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="p-4 ${this.getHeaderClass(type)}">
            <h3 class="text-lg font-medium">${title}</h3>
          </div>
          <div class="p-4">
            <p>${message}</p>
          </div>
          <div class="px-4 py-3 bg-gray-50 flex justify-end">
            <button class="ok-button px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded">
              ${buttonText}
            </button>
          </div>
        </div>
      `;
      
      // Add to DOM
      document.body.appendChild(overlay);
      
      // Focus the button
      setTimeout(() => {
        overlay.querySelector('.ok-button').focus();
      }, 100);
      
      // Add event listener
      overlay.querySelector('.ok-button').addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve();
      });
      
      // Close on escape key
      document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
          document.body.removeChild(overlay);
          document.removeEventListener('keydown', escapeHandler);
          resolve();
        }
      });
    });
  },
  
  // Helper methods
  removeNotification(notification) {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },
  
  getTypeClass(type) {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-l-4 border-green-500 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-l-4 border-red-500 text-red-700';
      case 'info':
      default:
        return 'bg-blue-100 border-l-4 border-blue-500 text-blue-700';
    }
  },
  
  getHeaderClass(type) {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800';
      case 'danger':
        return 'bg-red-50 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800';
    }
  },
  
  getButtonClass(type) {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'info':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  },
  
  getIconForType(type) {
    switch (type) {
      case 'success':
        return `<svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`;
      case 'warning':
        return `<svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`;
      case 'error':
        return `<svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`;
      case 'info':
      default:
        return `<svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`;
    }
  }
};
