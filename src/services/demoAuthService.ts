// Demo authentication service for development/demo purposes
export interface DemoUser {
  id: string;
  email: string;
  name: string;
}

// Mock profile data for demo
export const mockProfile = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  organization_name: 'Green Future Solutions Sdn Bhd',
  industry: 'manufacturing',
  established_year: 2018,
  employees: 85,
  description: 'Sustainable manufacturing solutions for Malaysian businesses',
  website: 'https://greenfuture.com.my',
  contact_email: 'info@greenfuture.com.my',
  contact_phone: '+60 3-2123 4567',
  address: 'No. 123, Jalan Sustainability, 50450 Kuala Lumpur, Malaysia',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock company data for demo
export const mockCompany = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  profile_id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'GreenTech Manufacturing',
  industry: 'manufacturing',
  size: 'medium' as const,
  location: 'Selangor, Malaysia',
  employees: 85,
  revenue: 12500000,
  established_year: 2018,
  registration_number: 'SSM-12345678',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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