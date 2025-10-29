import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ---------------- Types ----------------
export interface AcademicBackground {
  strand: string;
  gpa: string;
  school: string;
}

export interface Preferences {
  budget: string;
  course: string;
  location: string;
}

export interface ProfileData {
  academicBackground: AcademicBackground;
  preferences: Preferences;
}

interface ProfileCompletionContextType {
  profileData: ProfileData;
  completionPercentage: number;
  updateAcademicBackground: (academicBackground: AcademicBackground) => Promise<void>;
  updatePreferences: (preferences: Preferences) => Promise<void>;
  calculateCompletion: () => number;
  hydrateProfileData: () => Promise<void>;
}

// ---------------- Context ----------------
const ProfileCompletionContext = createContext<ProfileCompletionContextType | undefined>(undefined);

// ---------------- Storage Keys ----------------
const PROFILE_DATA_KEY = '@profile_data';

// ---------------- Provider ----------------
export const ProfileCompletionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    academicBackground: {
      strand: '',
      gpa: '',
      school: '',
    },
    preferences: {
      budget: '',
      course: '',
      location: '',
    },
  });

  const [completionPercentage, setCompletionPercentage] = useState(25); // 25% for having a name by default

  // Calculate completion percentage based on filled fields
  const calculateCompletion = (): number => {
    const fields = [
      // Name is always 25% (assumption that user has a name from auth)
      profileData.academicBackground.strand,
      profileData.academicBackground.gpa,
      profileData.academicBackground.school,
      profileData.preferences.budget,
      profileData.preferences.course,
      profileData.preferences.location,
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const totalFields = fields.length;
    
    // Base 25% for name + additional percentage for other fields
    const additionalPercentage = (filledFields / totalFields) * 75;
    return Math.round(25 + additionalPercentage);
  };

  // Update academic background
  const updateAcademicBackground = async (academicBackground: AcademicBackground): Promise<void> => {
    try {
      const updatedProfileData = {
        ...profileData,
        academicBackground,
      };
      
      setProfileData(updatedProfileData);
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(updatedProfileData));
      
      const newPercentage = calculateCompletionForData(updatedProfileData);
      setCompletionPercentage(newPercentage);
    } catch (error) {
      console.error('Failed to update academic background:', error);
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = async (preferences: Preferences): Promise<void> => {
    try {
      const updatedProfileData = {
        ...profileData,
        preferences,
      };
      
      setProfileData(updatedProfileData);
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(updatedProfileData));
      
      const newPercentage = calculateCompletionForData(updatedProfileData);
      setCompletionPercentage(newPercentage);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  // Helper function to calculate completion for given data
  const calculateCompletionForData = (data: ProfileData): number => {
    const fields = [
      data.academicBackground.strand,
      data.academicBackground.gpa,
      data.academicBackground.school,
      data.preferences.budget,
      data.preferences.course,
      data.preferences.location,
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const totalFields = fields.length;
    
    // Base 25% for name + additional percentage for other fields
    const additionalPercentage = (filledFields / totalFields) * 75;
    return Math.round(25 + additionalPercentage);
  };

  // Hydrate profile data from storage
  const hydrateProfileData = async (): Promise<void> => {
    try {
      const storedData = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      if (storedData) {
        const parsedData: ProfileData = JSON.parse(storedData);
        setProfileData(parsedData);
        
        const newPercentage = calculateCompletionForData(parsedData);
        setCompletionPercentage(newPercentage);
      }
    } catch (error) {
      console.error('Failed to hydrate profile data:', error);
    }
  };

  // Update completion percentage when profile data changes
  useEffect(() => {
    const newPercentage = calculateCompletion();
    setCompletionPercentage(newPercentage);
  }, [profileData]);

  // Hydrate data on mount
  useEffect(() => {
    hydrateProfileData();
  }, []);

  return (
    <ProfileCompletionContext.Provider
      value={{
        profileData,
        completionPercentage,
        updateAcademicBackground,
        updatePreferences,
        calculateCompletion,
        hydrateProfileData,
      }}
    >
      {children}
    </ProfileCompletionContext.Provider>
  );
};

// ---------------- Hook ----------------
export const useProfileCompletion = (): ProfileCompletionContextType => {
  const context = useContext(ProfileCompletionContext);
  if (!context) {
    throw new Error('useProfileCompletion must be used within ProfileCompletionProvider');
  }
  return context;
};