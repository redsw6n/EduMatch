import { ProfileData } from '../context/ProfileCompletionContext';

// University interface for matching
export interface University {
  id: string;
  name: string;
  location: string;
  fee: string;
  image: string;
  programs: string[];
  acceptanceRate: string;
  ranking: string;
  matchPercentage: number;
}

// Matching algorithm weights
const MATCH_WEIGHTS = {
  COURSE: 40,
  LOCATION: 30,
  BUDGET: 20,
  GPA: 10,
};

// Minimum match score threshold
const MIN_MATCH_SCORE = 30;

/**
 * Calculate match score between user profile and university
 * @param university - University data
 * @param profileData - User profile data
 * @returns Match score (0-100)
 */
export const calculateMatchScore = (
  university: University,
  profileData: ProfileData
): number => {
  const { preferences, academicBackground } = profileData;
  let matchScore = 0;

  // Course matching
  if (preferences.course && university.programs.length > 0) {
    const hasExactMatch = university.programs.some(program =>
      program.toLowerCase().includes(preferences.course.toLowerCase()) ||
      preferences.course.toLowerCase().includes(program.toLowerCase())
    );
    
    if (hasExactMatch) {
      matchScore += MATCH_WEIGHTS.COURSE;
    } else {
      // Give partial points for related programs
      const courseKeywords = preferences.course.toLowerCase();
      const hasRelatedProgram = university.programs.some(program => {
        const programLower = program.toLowerCase();
        return (
          (courseKeywords.includes('computer') && (programLower.includes('information') || programLower.includes('engineering'))) ||
          (courseKeywords.includes('business') && programLower.includes('administration')) ||
          (courseKeywords.includes('engineering') && programLower.includes('technology')) ||
          (courseKeywords.includes('information') && programLower.includes('computer'))
        );
      });
      
      if (hasRelatedProgram) {
        matchScore += MATCH_WEIGHTS.COURSE * 0.5; // Half points for related programs
      }
    }
  }

  // Location matching
  if (preferences.location && university.location) {
    const userLocation = preferences.location.toLowerCase();
    const uniLocation = university.location.toLowerCase();
    
    if (uniLocation.includes(userLocation) || userLocation.includes(uniLocation)) {
      matchScore += MATCH_WEIGHTS.LOCATION;
    } else if (
      // Same region matching (e.g., both in Cebu)
      (userLocation.includes('cebu') && uniLocation.includes('cebu')) ||
      (userLocation.includes('manila') && uniLocation.includes('manila')) ||
      (userLocation.includes('davao') && uniLocation.includes('davao'))
    ) {
      matchScore += MATCH_WEIGHTS.LOCATION * 0.7; // Partial points for same region
    }
  }

  // Budget compatibility
  if (preferences.budget && university.fee) {
    try {
      const universityFee = parseInt(university.fee.replace(/[^\d]/g, ''));
      const userBudget = parseInt(preferences.budget.replace(/[^\d]/g, ''));

      if (universityFee <= userBudget) {
        matchScore += MATCH_WEIGHTS.BUDGET;
      } else if (universityFee <= userBudget * 1.2) {
        // 20% buffer for budget flexibility
        matchScore += MATCH_WEIGHTS.BUDGET / 2;
      }
    } catch (error) {
      console.warn('Error parsing budget or fee values:', error);
    }
  }

  // GPA consideration
  if (academicBackground.gpa) {
    try {
      const gpa = parseFloat(academicBackground.gpa);
      if (gpa >= 3.5) {
        matchScore += MATCH_WEIGHTS.GPA;
      } else if (gpa >= 3.0) {
        matchScore += MATCH_WEIGHTS.GPA / 2;
      }
    } catch (error) {
      console.warn('Error parsing GPA value:', error);
    }
  }

  return Math.round(matchScore);
};

/**
 * Filter universities based on user profile and return matched ones
 * @param universities - Array of universities to filter
 * @param profileData - User profile data
 * @param completionPercentage - Profile completion percentage
 * @returns Array of matched universities sorted by match score
 */
export const getMatchedUniversities = (
  universities: University[],
  profileData: ProfileData,
  completionPercentage: number
): University[] => {
  // Require at least 50% profile completion for meaningful matches
  if (completionPercentage < 50) {
    return [];
  }

  const scoredUniversities = universities
    .map(university => {
      const matchScore = calculateMatchScore(university, profileData);
      return {
        ...university,
        matchPercentage: Math.max(matchScore, 50), // Ensure minimum display percentage
      };
    })
    .filter(university => {
      const matchScore = calculateMatchScore(university, profileData);
      return matchScore >= MIN_MATCH_SCORE;
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  // If no matches found but user has some profile data, show top universities anyway
  if (scoredUniversities.length === 0 && completionPercentage >= 25) {
    return universities
      .slice(0, 2) // Show top 2 universities
      .map(university => ({
        ...university,
        matchPercentage: 60, // Default match percentage for fallback
      }));
  }

  return scoredUniversities;
};

/**
 * Get match explanation for a university
 * @param university - University data
 * @param profileData - User profile data
 * @returns Array of match reasons
 */
export const getMatchReasons = (
  university: University,
  profileData: ProfileData
): string[] => {
  const reasons: string[] = [];
  const { preferences, academicBackground } = profileData;

  // Course match
  if (preferences.course && university.programs.length > 0) {
    const matchingPrograms = university.programs.filter(program =>
      program.toLowerCase().includes(preferences.course.toLowerCase()) ||
      preferences.course.toLowerCase().includes(program.toLowerCase())
    );
    if (matchingPrograms.length > 0) {
      reasons.push(`Offers ${matchingPrograms[0]} program`);
    }
  }

  // Location match
  if (preferences.location && university.location.toLowerCase().includes(preferences.location.toLowerCase())) {
    reasons.push(`Located in ${preferences.location}`);
  }

  // Budget compatibility
  if (preferences.budget && university.fee) {
    try {
      const universityFee = parseInt(university.fee.replace(/[^\d]/g, ''));
      const userBudget = parseInt(preferences.budget.replace(/[^\d]/g, ''));
      
      if (universityFee <= userBudget) {
        reasons.push('Fits your budget');
      } else if (universityFee <= userBudget * 1.2) {
        reasons.push('Close to your budget range');
      }
    } catch (error) {
      console.warn('Error parsing budget values:', error);
    }
  }

  // GPA compatibility
  if (academicBackground.gpa) {
    try {
      const gpa = parseFloat(academicBackground.gpa);
      if (gpa >= 3.5) {
        reasons.push('Your GPA exceeds requirements');
      } else if (gpa >= 3.0) {
        reasons.push('Your GPA meets requirements');
      }
    } catch (error) {
      console.warn('Error parsing GPA value:', error);
    }
  }

  return reasons;
};