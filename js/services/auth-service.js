/**
 * Authentication Service
 * Handles user authentication and session management
 */

const AuthService = {
  usersKey: 'auth_users',
  currentUserKey: 'auth_current_user',
  
  init() {
    console.log('Initializing Authentication Service');
    
    // Initialize users if they don't exist
    if (!StorageService.get(this.usersKey)) {
      this.initializeUsers();
    }
  },
  
  initializeUsers() {
    console.log('Initializing users');
    
    // Create initial user for testing
    const initialUsers = {
      'masalles': {
        username: 'masalles',
        password: '!@#123', // In a real app, this would be hashed
        name: 'M',
        createdAt: Date.now()
      }
    };
    
    StorageService.set(this.usersKey, JSON.stringify(initialUsers));
  },
  
  login(username, password) {
    console.log(`Attempting login for user: ${username}`);
    
    const users = this.getUsers();
    
    if (!users[username]) {
      console.error('User not found');
      return { success: false, message: 'Usuário não encontrado' };
    }
    
    if (users[username].password !== password) {
      console.error('Invalid password');
      return { success: false, message: 'Senha incorreta' };
    }
    
    // Store current user (without password)
    const currentUser = { ...users[username] };
    delete currentUser.password;
    currentUser.lastLogin = Date.now();
    
    StorageService.set(this.currentUserKey, JSON.stringify(currentUser));
    
    return { success: true, user: currentUser };
  },
  
  register(username, password, name) {
    console.log(`Attempting to register user: ${username}`);
    
    const users = this.getUsers();
    
    if (users[username]) {
      console.error('Username already exists');
      return { success: false, message: 'Nome de usuário já existe' };
    }
    
    // Create new user
    const newUser = {
      username,
      password, // In a real app, this would be hashed
      name,
      createdAt: Date.now()
    };
    
    // Add to users
    users[username] = newUser;
    StorageService.set(this.usersKey, JSON.stringify(users));
    
    // Log in the new user
    return this.login(username, password);
  },
  
  logout() {
    console.log('Logging out user');
    StorageService.remove(this.currentUserKey);
    return true;
  },
  
  getCurrentUser() {
    const userData = StorageService.get(this.currentUserKey);
    
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Error parsing current user data:', e);
      return null;
    }
  },
  
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },
  
  getUsers() {
    const usersData = StorageService.get(this.usersKey);
    
    if (!usersData) {
      return {};
    }
    
    try {
      return JSON.parse(usersData);
    } catch (e) {
      console.error('Error parsing users data:', e);
      return {};
    }
  },
  
  updateUser(username, updater) {
    return StorageService.updateObject(this.usersKey, (users) => {
      if (users[username]) {
        users[username] = updater(users[username]);
      }
      return users;
    });
  }
};
