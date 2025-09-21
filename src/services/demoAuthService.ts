// Demo authentication service for development/demo purposes
export interface DemoUser {
  id: string;
  email: string;
  name: string;
}

class DemoAuthService {
  private static instance: DemoAuthService;
  private currentUser: DemoUser | null = null;
  private authListeners: ((user: DemoUser | null) => void)[] = [];

  private constructor() {
    // Auto-login with demo user
    this.loginWithDemo();
  }

  static getInstance(): DemoAuthService {
    if (!DemoAuthService.instance) {
      DemoAuthService.instance = new DemoAuthService();
    }
    return DemoAuthService.instance;
  }

  loginWithDemo() {
    this.currentUser = {
      id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
      email: 'demo@esgenius.com',
      name: 'Demo User'
    };
    this.notifyAuthListeners();
  }

  getCurrentUser(): DemoUser | null {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    this.notifyAuthListeners();
  }

  onAuthStateChange(callback: (user: DemoUser | null) => void) {
    this.authListeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthListeners() {
    this.authListeners.forEach(listener => listener(this.currentUser));
  }
}

export const demoAuth = DemoAuthService.getInstance();