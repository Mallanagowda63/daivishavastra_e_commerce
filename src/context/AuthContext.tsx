import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberTier: 'Privilege Gold' | 'Royal Platinum' | 'Connoisseur';
  addresses: {
    id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string) => void;
  loginWithPhone: (phone: string, otp: string) => boolean;
  signup: (name: string, email: string, phone: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAccountDashboardOpen: boolean;
  openAccountDashboard: () => void;
  closeAccountDashboard: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-daivisha-vip',
  name: 'Gayatri Devi',
  email: 'gayatri.devi@heritage.in',
  phone: '+91 98201 54321',
  memberTier: 'Royal Platinum',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Gayatri Devi',
      phone: '+91 98201 54321',
      addressLine: 'The Royal Belvedere, Bungalow 7, Malabar Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
      isDefault: true,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('daivisha_user');
      return saved ? JSON.parse(saved) : null; // Visitors start signed out and sign in with their email
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountDashboardOpen, setIsAccountDashboardOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('daivisha_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('daivisha_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = (email: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      phone: '',
      memberTier: 'Privilege Gold',
      addresses: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Namaste, ${newUser.name}. Your royal curation is ready.`,
    });
  };

  const loginWithPhone = (phone: string, otp: string): boolean => {
    if (otp !== '1234' && otp.length < 4) {
      showToast({
        type: 'error',
        title: 'Invalid OTP',
        message: 'Please enter the 4-digit verification code (e.g. 1234).',
      });
      return false;
    }
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: 'Valued Patron',
      email: 'patron@daivishavastra.com',
      phone,
      memberTier: 'Privilege Gold',
      addresses: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast({
      type: 'success',
      title: 'Verified Successfully',
      message: 'Logged in with phone number.',
    });
    return true;
  };

  const signup = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      memberTier: 'Privilege Gold',
      addresses: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast({
      type: 'success',
      title: 'Welcome to Daivisha Circle',
      message: `Account created for ${name}.`,
    });
  };

  const logout = () => {
    setUser(null);
    setIsAccountDashboardOpen(false);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out from your account.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithPhone,
        signup,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAccountDashboardOpen,
        openAccountDashboard: () => setIsAccountDashboardOpen(true),
        closeAccountDashboard: () => setIsAccountDashboardOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
