/**
 * Router
 * Handles navigation between components and manages browser history
 */

const Router = {
  currentRoute: null,
  routes: {
    'home': HomeComponent,
    'login': LoginComponent,
    'register': RegisterComponent,
    'welcome': WelcomeComponent,
    'journey-map': JourneyMapComponent,
    'stage': StageCardComponent,
    'scripture': ScriptureComponent,
    'prayer': PrayerComponent,
    'activity': ActivityComponent,
    'achievements': AchievementsComponent
  },

  // Routes that require authentication
  protectedRoutes: [
    'welcome',
    'journey-map',
    'stage',
    'scripture',
    'prayer',
    'activity',
    'achievements'
  ],

  init() {
    console.log('Initializing router');

    // Handle browser back button
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.renderRoute(e.state.route, e.state.params, false);
      }
    });

    // Handle hash changes (for direct links)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash && this.routes[hash.split('/')[0]]) {
        const [route, paramStr] = hash.split('/');
        const params = paramStr ? JSON.parse(decodeURIComponent(paramStr)) : {};
        this.renderRoute(route, params, false);
      }
    });

    // Check initial hash
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash && this.routes[hash.split('/')[0]]) {
        const [route, paramStr] = hash.split('/');
        const params = paramStr ? JSON.parse(decodeURIComponent(paramStr)) : {};
        this.renderRoute(route, params, false);
        return; // Skip default navigation
      }
    }
  },

  navigate(route, params = {}, addToHistory = true) {
    console.log(`Navigating to: ${route}`, params);

    // Check if route requires authentication
    if (this.protectedRoutes.includes(route)) {
      const isAuthenticated = AuthService.isAuthenticated();

      if (!isAuthenticated) {
        console.log('Authentication required, redirecting to login');
        this.renderRoute('home', {}, addToHistory);
        return;
      }
    }

    this.renderRoute(route, params, addToHistory);
  },

  renderRoute(route, params = {}, addToHistory = true) {
    const appContent = document.getElementById('app-content');

    // Add exit animation
    if (this.currentRoute) {
      appContent.classList.add('page-exit');
      appContent.classList.add('page-exit-active');

      setTimeout(() => {
        // Render new content
        this.renderContent(route, params, appContent);

        // Remove exit classes and add enter animation
        appContent.classList.remove('page-exit');
        appContent.classList.remove('page-exit-active');
        appContent.classList.add('page-enter');
        appContent.classList.add('page-enter-active');

        setTimeout(() => {
          appContent.classList.remove('page-enter');
          appContent.classList.remove('page-enter-active');
        }, 300);
      }, 300);
    } else {
      // First render, no animation needed
      this.renderContent(route, params, appContent);
    }

    // Update current route
    this.currentRoute = { route, params };

    // Add to browser history
    if (addToHistory) {
      const paramStr = Object.keys(params).length ? `/${encodeURIComponent(JSON.stringify(params))}` : '';
      window.history.pushState({ route, params }, '', `#${route}${paramStr}`);
    }
  },

  renderContent(route, params, container) {
    const Component = this.routes[route];

    if (!Component) {
      console.error(`Route not found: ${route}`);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Remove background animation if navigating away from home
    if (route !== 'home') {
      const bgAnimation = document.getElementById('background-animation');
      if (bgAnimation) {
        bgAnimation.remove();
      }
    }

    // Render navbar for protected routes (before rendering the component)
    if (this.protectedRoutes.includes(route) && AuthService.isAuthenticated()) {
      // Render navbar (it will insert itself at the top of the body)
      NavbarComponent.render(container);
    } else {
      // Remove navbar if it exists and we're on a non-protected route
      const existingNavbar = document.getElementById('app-navbar');
      if (existingNavbar) {
        existingNavbar.remove();
        document.body.classList.remove('has-navbar');
      }
    }

    // Render component
    Component.render(container, params);
  },

  // Helper function to get URL parameters
  getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');

    for (let i = 0; i < pairs.length; i++) {
      if (!pairs[i]) continue;
      const pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }

    return params;
  }
};