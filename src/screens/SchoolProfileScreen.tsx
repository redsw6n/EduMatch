import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MapPin
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useThemedColors } from '../hooks/useThemedColors';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { typography } from '../theme/typography';

type SchoolProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SchoolProfile'
>;

const { width: screenWidth } = Dimensions.get('window');

interface Program {
  id: string;
  name: string;
  duration: string;
  degree: string;
}

interface ProgramCategory {
  id: string;
  name: string;
  programs: Program[];
  isExpanded: boolean;
}

interface SchoolProfileData {
  id: string;
  name: string;
  location: string;
  tuitionRange: string;
  description: string;
  ranking: string;
  type: string;
  studentCount: string;
  acceptanceRate: string;
  programCategories: ProgramCategory[];
  gallery: string[];
}

interface SchoolProfileScreenProps {
  route?: {
    params?: {
      schoolId?: string;
      schoolData?: SchoolProfileData;
    };
  };
}

// Mock data - this would come from props or API
const mockSchoolData: SchoolProfileData = {
  id: '1',
  name: 'Stanford University',
  location: 'Stanford, California, USA',
  tuitionRange: '$55,000 - $65,000 per year',
  description: 'Stanford University is a private research university in Stanford, California. Known for its academic strength, wealth, proximity to Silicon Valley, and ranking as one of the world\'s top universities.',
  ranking: '#3 in National Universities',
  type: 'Private',
  studentCount: '17,000+',
  acceptanceRate: '4.3%',
  programCategories: [
    {
      id: '1',
      name: 'Engineering',
      isExpanded: false,
      programs: [
        { id: '1', name: 'Computer Science', duration: '4 years', degree: 'Bachelor of Science' },
        { id: '2', name: 'Electrical Engineering', duration: '4 years', degree: 'Bachelor of Science' },
        { id: '3', name: 'Mechanical Engineering', duration: '4 years', degree: 'Bachelor of Science' },
        { id: '4', name: 'Bioengineering', duration: '4 years', degree: 'Bachelor of Science' },
      ],
    },
    {
      id: '2',
      name: 'Business',
      isExpanded: false,
      programs: [
        { id: '5', name: 'Business Administration', duration: '2 years', degree: 'Master of Business Administration' },
        { id: '6', name: 'Finance', duration: '4 years', degree: 'Bachelor of Science' },
        { id: '7', name: 'Economics', duration: '4 years', degree: 'Bachelor of Arts' },
      ],
    },
    {
      id: '3',
      name: 'Medicine',
      isExpanded: false,
      programs: [
        { id: '8', name: 'Medicine', duration: '4 years', degree: 'Doctor of Medicine' },
        { id: '9', name: 'Biomedical Sciences', duration: '4 years', degree: 'Bachelor of Science' },
        { id: '10', name: 'Public Health', duration: '2 years', degree: 'Master of Public Health' },
      ],
    },
    {
      id: '4',
      name: 'Liberal Arts',
      isExpanded: false,
      programs: [
        { id: '11', name: 'Psychology', duration: '4 years', degree: 'Bachelor of Arts' },
        { id: '12', name: 'English Literature', duration: '4 years', degree: 'Bachelor of Arts' },
        { id: '13', name: 'History', duration: '4 years', degree: 'Bachelor of Arts' },
      ],
    },
  ],
  gallery: [
    'https://via.placeholder.com/300x200/4285F4/FFFFFF?text=Campus+1',
    'https://via.placeholder.com/300x200/34A853/FFFFFF?text=Campus+2',
    'https://via.placeholder.com/300x200/FBBC04/FFFFFF?text=Campus+3',
    'https://via.placeholder.com/300x200/EA4335/FFFFFF?text=Campus+4',
  ],
};

export const SchoolProfileScreen: React.FC<SchoolProfileScreenProps> = ({
  route,
}) => {
  const themedColors = useThemedColors();
  const styles = createStyles(themedColors);
  const navigation = useNavigation<SchoolProfileScreenNavigationProp>();
  const schoolData = route?.params?.schoolData || mockSchoolData;
  const insets = useSafeAreaInsets();
  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>(
    schoolData.programCategories
  );

  const toggleProgramCategory = (categoryId: string) => {
    setProgramCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    );
  };

  const handleChat = () => {
    try {
      navigation.navigate('Messages', { 
        schoolData: {
          id: schoolData.id,
          name: schoolData.name,
          location: schoolData.location,
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleApply = () => {
    try {
      navigation.navigate('Apply', { schoolData: schoolData });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const renderProgramItem = ({ item }: { item: Program }) => (
    <View style={styles.programItem}>
      <View style={styles.programInfo}>
        <Text style={styles.programName}>{item.name}</Text>
        <Text style={styles.programDetails}>
          {item.degree} • {item.duration}
        </Text>
      </View>
      <GraduationCap size={20} color={themedColors.textSecondary} />
    </View>
  );

  const renderProgramCategory = ({ item }: { item: ProgramCategory }) => (
    <View style={styles.programCategory}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleProgramCategory(item.id)}
        accessibilityLabel={`${item.name} programs`}
        accessibilityRole="button"
      >
        <Text style={styles.categoryName}>{item.name}</Text>
        <View style={styles.categoryToggle}>
          <Text style={styles.programCount}>
            {item.programs.length} program{item.programs.length !== 1 ? 's' : ''}
          </Text>
          {item.isExpanded ? (
            <ChevronUp size={20} color={themedColors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={themedColors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>

      {item.isExpanded && (
        <View style={styles.programsList}>
          <FlatList
            data={item.programs}
            renderItem={renderProgramItem}
            keyExtractor={(program) => program.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner and Logo Section */}
        <View style={styles.bannerSection}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* School Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.schoolName}>{schoolData.name}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={themedColors.textSecondary} />
            <Text style={styles.locationText}>{schoolData.location}</Text>
          </View>

          <Text style={styles.tuitionText}>{schoolData.tuitionRange}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>-</Text>
            <Text style={styles.statLabel}>Ranking</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>-</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{schoolData.type}</Text>
            <Text style={styles.statLabel}>Type</Text>
          </View>
        </View>

        {/* Programs Section */}
        <View style={styles.programsSection}>
          <Text style={styles.sectionTitle}>Programs Offered</Text>
          <FlatList
            data={programCategories}
            renderItem={renderProgramCategory}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Gallery Section */}
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Campus Gallery</Text>
          <View style={styles.galleryPlaceholder}>
            <Text style={styles.galleryPlaceholderText}>No photos yet</Text>
          </View>
        </View>

        {/* Bottom spacing for fixed buttons */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={[styles.bottomButtons, { paddingBottom: insets.bottom }]}>
        <PrimaryButton
          title="Chat"
          onPress={handleChat}
          variant="secondary"
          style={styles.chatButton}
          accessibilityLabel="Chat with university admissions"
        />
        <PrimaryButton
          title="Apply"
          onPress={handleApply}
          style={styles.applyButton}
          accessibilityLabel="Apply to this university"
        />
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Normal padding instead of space for fixed buttons
  },
  bannerSection: {
    position: 'relative',
    marginBottom: 40,
  },
  bannerImage: {
    height: 200,
    width: '100%',
  },
  placeholderText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  schoolName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tuitionText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.text,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  programsSection: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 16,
  },
  programCategory: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  categoryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginRight: 8,
  },
  programsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  programItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  programDetails: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  gallerySection: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  galleryPlaceholder: {
    height: 150,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderStyle: 'dashed',
  },
  galleryPlaceholderText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  bottomSpacing: {
    height: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  chatButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 12,
  },
});

export default SchoolProfileScreen;