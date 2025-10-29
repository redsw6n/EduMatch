import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  authToken: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  updateProfile: (firstName: string, lastName: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrateFromStorage: () => Promise<{ hasOnboarded: boolean; authToken: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = '@auth_token';
const HAS_ONBOARDED_KEY = '@has_onboarded';
const USER_PROFILE_KEY = '@user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate fake token
      const token = `token_${Date.now()}`;
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Load existing user profile or create default
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      let userProfile: User;
      
      if (storedProfile) {
        userProfile = JSON.parse(storedProfile);
      } else {
        // Default profile for existing users
        userProfile = {
          firstName: '',
          lastName: '',
          email: email,
        };
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      }
      
      // Update state
      setAuthToken(token);
      setUser(userProfile);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate fake token
      const token = `token_${Date.now()}`;
      
      // Create user profile
      const userProfile: User = {
        firstName,
        lastName,
        email,
      };
      
      // Save token and profile to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile)),
      ]);
      
      // Update state
      setAuthToken(token);
      setUser(userProfile);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      
      // Update state
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const hydrateFromStorage = async (): Promise<{ hasOnboarded: boolean; authToken: string | null }> => {
    try {
      // TEMPORARY: Clear storage for testing - remove this later
      // await AsyncStorage.clear();
      
      const [hasOnboardedValue, tokenValue, profileValue] = await Promise.all([
        AsyncStorage.getItem(HAS_ONBOARDED_KEY),
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_PROFILE_KEY),
      ]);

      const hasOnboarded = hasOnboardedValue === 'true';
      
      // If we have a token, set it in state
      if (tokenValue) {
        setAuthToken(tokenValue);
        
        // Load user profile if available
        if (profileValue) {
          const userProfile = JSON.parse(profileValue);
          setUser(userProfile);
        } else {
          // Create default profile for existing users
          const defaultProfile: User = {
            firstName: '',
            lastName: '',
            email: 'user@example.com',
          };
          setUser(defaultProfile);
        }
      }

      return { hasOnboarded, authToken: tokenValue };
    } catch (error) {
      console.error('Hydrate from storage error:', error);
      return { hasOnboarded: false, authToken: null };
    }
  };

  const updateProfile = async (firstName: string, lastName: string, email: string): Promise<void> => {
    try {
      const updatedProfile: User = {
        firstName,
        lastName,
        email,
      };
      
      // Save updated profile to AsyncStorage
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      
      // Update state
      setUser(updatedProfile);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Helper function to set onboarding status
  const setOnboardingCompleted = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
    } catch (error) {
      console.error('Set onboarding completed error:', error);
    }
  };

  const value: AuthContextType = {
    authToken,
    user,
    isLoading,
    signIn,
    signUp,
    updateProfile,
    signOut,
    hydrateFromStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export helper function for onboarding
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
  } catch (error) {
    console.error('Set onboarding completed error:', error);
  }
};

// Development helper - use this to reset app state
export const clearAppStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('App storage cleared successfully');
  } catch (error) {
    console.error('Clear storage error:', error);
  }
};
