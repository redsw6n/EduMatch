# University Matching System

## Overview
The University Matching System provides personalized university recommendations based on user profile data including academic background and preferences.

## How It Works

### Matching Algorithm
The algorithm calculates match scores based on weighted criteria:

- **Course Match (40%)**: Checks if the user's preferred course is available at the university
- **Location Match (30%)**: Matches university location with user's preferred location
- **Budget Compatibility (20%)**: Ensures university fees fit within user's budget (with 20% flexibility)
- **GPA Consideration (10%)**: Factors in academic performance

### Requirements
- **Minimum Profile Completion**: 75% profile completion required to show matches
- **Minimum Match Score**: 50% compatibility required for a university to appear in matches

### Features
1. **Visual Indicators**: Green borders distinguish matched universities
2. **Match Percentage**: Each university shows its compatibility percentage
3. **Match Reasons**: Explains why each university is a good fit
4. **Sortable Results**: Universities sorted by match percentage (highest first)

## Implementation

### Core Files
- `src/screens/MatchesScreen.tsx` - Main matches interface
- `src/utils/matchingUtils.ts` - Matching algorithm and utilities
- `src/context/ProfileCompletionContext.tsx` - Profile data management

### Key Components
```typescript
// Calculate matches for a user
const matches = getMatchedUniversities(universities, profileData, completionPercentage);

// Get reasons why a university matches
const reasons = getMatchReasons(university, profileData);

// Calculate individual match score
const score = calculateMatchScore(university, profileData);
```

## User Flow

### Before Profile Completion (<75%)
- Shows completion prompt with actionable buttons
- Progress indicator showing current completion percentage
- Motivational hints to complete profile

### After Profile Completion (≥75%)
- Displays matched universities with green borders
- Shows match percentage and reasons
- Scrollable list for multiple matches
- Clickable cards leading to university details

## Data Structure

### University Interface
```typescript
interface University {
  id: string;
  name: string;
  location: string;
  fee: string;
  programs: string[];
  acceptanceRate: string;
  ranking: string;
  matchPercentage: number;
}
```

### Profile Data
```typescript
interface ProfileData {
  academicBackground: {
    strand: string;
    gpa: string;
    school: string;
  };
  preferences: {
    budget: string;
    course: string;
    location: string;
  };
}
```

## Customization

### Adding New Match Criteria
1. Update `MATCH_WEIGHTS` in `matchingUtils.ts`
2. Add new criteria logic in `calculateMatchScore()`
3. Update `getMatchReasons()` for user feedback

### Adjusting Thresholds
- `MIN_MATCH_SCORE`: Minimum score to show university (default: 50)
- Profile completion requirement (default: 75%)
- Budget flexibility buffer (default: 20%)

## Future Enhancements
- Machine learning-based matching
- User feedback integration
- Advanced filters (scholarship availability, campus size, etc.)
- Match confidence intervals
- A/B testing for algorithm improvements