import { MapPin } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useProfileCompletion } from '../context/ProfileCompletionContext';
import { useThemedColors } from '../hooks/useThemedColors';
import { getMatchedUniversities, getMatchReasons, University } from '../utils/matchingUtils';

// Types
interface MatchesScreenProps {
  navigation: any;
}

// Mock university database - consistent with ExploreScreen
const UNIVERSITIES_DATABASE: University[] = [
  {
    id: '1',
    name: 'Southwestern University PHINMA',
    location: 'Urgello, Cebu',
    fee: '₱80,000/year',
    image: 'https://placehold.co/64x64',
    programs: ['Computer Science', 'Information Technology', 'Engineering', 'Business Administration'],
    acceptanceRate: '75%',
    ranking: '#15 in Regional Universities',
    matchPercentage: 95,
  },
  {
    id: '2',
    name: 'University of San Carlos',
    location: 'Talamban, Cebu',
    fee: '₱95,000/year',
    image: 'https://placehold.co/64x64',
    programs: ['Computer Science', 'Engineering', 'Medicine', 'Business Administration', 'Education'],
    acceptanceRate: '60%',
    ranking: '#8 in Regional Universities',
    matchPercentage: 90,
  },
  {
    id: '3',
    name: 'Cebu Institute of Technology',
    location: 'N. Bacalso Ave, Cebu',
    fee: '₱75,000/year',
    image: 'https://placehold.co/64x64',
    programs: ['Information Technology', 'Computer Engineering', 'Electronics Engineering', 'Business'],
    acceptanceRate: '80%',
    ranking: '#20 in Regional Universities',
    matchPercentage: 85,
  },
  {
    id: '4',
    name: 'University of Cebu',
    location: 'Sanciangko St, Cebu',
    fee: '₱70,000/year',
    image: 'https://placehold.co/64x64',
    programs: ['Business Administration', 'Accounting', 'Education', 'Information Technology', 'Tourism'],
    acceptanceRate: '85%',
    ranking: '#25 in Regional Universities',
    matchPercentage: 80,
  },
];

const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const { profileData, completionPercentage } = useProfileCompletion();
  const styles = createStyles(colors);

  // Calculate matches based on user profile using the utility function
  const matchedUniversities = useMemo(() => {
    return getMatchedUniversities(UNIVERSITIES_DATABASE, profileData, completionPercentage);
  }, [profileData, completionPercentage]);

  const handleCompleteProfile = () => {
    // Navigate to profile completion or assessment
    navigation.navigate('Profile');
  };

  const handleTakeTest = () => {
    // Navigate to career guidance quiz
    navigation.navigate('CareerGuidance');
  };

  const handleUniversityPress = (university: University) => {
    navigation.navigate('SchoolProfile', {
      schoolId: university.id,
      schoolData: {
        id: university.id,
        name: university.name,
        location: university.location,
        tuitionRange: university.fee,
        description: `${university.name} is a prestigious institution offering world-class education and research opportunities.`,
        ranking: university.ranking,
        founded: '1901',
        studentCount: '18,000+',
        acceptanceRate: university.acceptanceRate,
        type: 'Private',
        programCategories: [
          {
            id: '1',
            name: 'College of IT & Engineering',
            isExpanded: false,
            programs: [
              { id: '1', name: 'Information Technology', duration: '4 years', degree: 'Bachelor of Science' },
            ],
          },
          {
            id: '2',
            name: 'Business School',
            isExpanded: false,
            programs: [
              { id: '2', name: 'Business Administration major in Marketing Management', duration: '4 years', degree: 'Bachelor of Science' },
              { id: '3', name: 'Accountancy', duration: '4 years', degree: 'Bachelor of Science' },
            ],
          },
        ],
        gallery: [
          require('../../assets/images/swu phinma hall.png'),
          require('../../assets/images/swu phinma hall.png'),
        ],
      },
    });
  };

  const renderUniversityCard = ({ item }: { item: University }) => {
    const matchReasons = getMatchReasons(item, profileData);
    
    return (
      <TouchableOpacity 
        style={styles.matchCard}
        onPress={() => handleUniversityPress(item)}
        accessibilityLabel={`View ${item.name} profile`}
        accessibilityRole="button"
      >
        <Image
          source={require('../../assets/images/swu phinma hall.png')}
          style={styles.matchImage}
          resizeMode="cover"
        />
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{item.name}</Text>
            <View style={styles.matchBadge}>
              <Text style={styles.matchPercentage}>{Math.round(item.matchPercentage)}%</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={12} color={colors.textSecondary} />
            <Text style={styles.matchLocation}>{item.location}</Text>
          </View>
          <Text style={styles.matchFee}>{item.fee}</Text>
          
          {/* Match reasons */}
          {matchReasons.length > 0 && (
            <View style={styles.matchReasonsContainer}>
              <Text style={styles.matchReasonsTitle}>Why it's a match:</Text>
              {matchReasons.slice(0, 2).map((reason, index) => (
                <Text key={index} style={styles.matchReason}>• {reason}</Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Matches</Text>
      <Text style={styles.headerSubtitle}>Discover schools that fit your profile</Text>
    </View>
  );

  const renderMatchesHeader = () => (
    <View style={styles.matchesSection}>
      <Text style={styles.sectionTitle}>
        Your Matches ({matchedUniversities.length})
      </Text>
      <Text style={styles.sectionSubtitle}>
        Universities that match your profile and preferences
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <>
      {/* Personalized Matches Card */}
      <View style={styles.cardContainer}>
        <View style={styles.gradientCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {completionPercentage < 50 
                ? "Complete your profile to see matches" 
                : "Want more personalized matches?"
              }
            </Text>
            <Text style={styles.cardDescription}>
              {completionPercentage < 50 
                ? `Your profile is ${completionPercentage}% complete. You need at least 50% completion to see university matches.`
                : "Complete your profile and take our career assessment quiz to get tailored university recommendations."
              }
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={handleCompleteProfile}
                accessibilityLabel="Complete Profile"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>COMPLETE PROFILE</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.takeTestButton}
                onPress={handleTakeTest}
                accessibilityLabel="Take Test"
                accessibilityRole="button"
              >
                <Text style={styles.takeTestButtonText}>TAKE QUIZ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Placeholder for future matches content */}
      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderTitle}>Your Matches</Text>
        <Text style={styles.placeholderText}>
          {completionPercentage < 50 
            ? `Profile completion: ${completionPercentage}%. Add your course preferences, location, and budget to see matches.`
            : "Complete your profile to see personalized university matches based on your preferences and academic profile."
          }
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {matchedUniversities.length > 0 ? (
        <FlatList
          data={matchedUniversities}
          keyExtractor={(item) => item.id}
          renderItem={renderUniversityCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={() => (
            <>
              {renderHeader()}
              {renderMatchesHeader()}
            </>
          )}
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={() => (
            <>
              {renderHeader()}
              {renderEmptyState()}
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40, // Safe area padding
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter',
  },
  
  // Matches Section
  matchesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    marginBottom: 20,
  },
  matchesList: {
    paddingBottom: 20,
  },
  
  // Match Card Styles (with green border)
  matchCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2ECC71', // Green border for matches
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  matchImage: {
    width: '100%',
    height: 120,
  },
  matchInfo: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    flex: 1,
    marginRight: 12,
  },
  matchBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    marginLeft: 4,
  },
  matchFee: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  matchReasonsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  matchReasonsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  matchReason: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    lineHeight: 16,
  },
  
  // Existing styles
  cardContainer: {
    marginBottom: 32,
  },
  gradientCard: {
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 196,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    maxWidth: 250,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 287,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110%',
    alignSelf: 'center',
    gap: 15,
  },
  completeButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeTestButton: {
    backgroundColor: '#2A71D0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  takeTestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  placeholderSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MatchesScreen;