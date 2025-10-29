import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MatchesScreenProps {
  navigation: any;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const handleCompleteProfile = () => {
    // Navigate to profile completion or assessment
    navigation.navigate('Profile');
  };

  const handleTakeTest = () => {
    // Navigate to career guidance quiz
    navigation.navigate('CareerGuidance');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <Text style={styles.headerSubtitle}>Discover schools that fit your profile</Text>
        </View>

        {/* Personalized Matches Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#DBEAFE', '#D1FAE5']}
            style={styles.gradientCard}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Want more personalized matches?</Text>
              <Text style={styles.cardDescription}>
                Complete your profile and take our career assessment quiz to get tailored university recommendations.
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
          </LinearGradient>
        </View>

        {/* Placeholder for future matches content */}
        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderTitle}>Your Matches</Text>
          <Text style={styles.placeholderText}>
            Complete your profile to see personalized university matches based on your preferences and academic profile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40, // Safe area padding
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  cardContainer: {
    marginBottom: 32,
  },
  gradientCard: {
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: '#E5E7EB',
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
    color: '#111827',
    fontFamily: 'Poppins',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    maxWidth: 250,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MatchesScreen;