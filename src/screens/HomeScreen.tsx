import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  Home,
  MapPin,
  Search,
  Target,
  TrendingUp,
  User
} from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useProfileCompletion } from '../context/ProfileCompletionContext';
import { useThemedColors } from '../hooks/useThemedColors';
import { RootStackParamList } from "../navigation/AppNavigator";
import ApplicationsScreen from "./ApplicationsScreen";
import ExploreScreen from "./ExploreScreen";
import MatchesScreen from "./MatchesScreen";
import ProfileScreen from "./ProfileScreen";

// ---------------- Types ----------------
type School = {
  id: string;
  name: string;
  location: string;
  fee: string;
  image: string;
};

type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Matches: undefined;
  Applications: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Tab = createBottomTabNavigator<RootTabParamList>();

// ---------------- Screens ----------------
function HomeTabScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const colors = useThemedColors();
  const { completionPercentage } = useProfileCompletion();
  const styles = createStyles(colors);

  const handleSchoolPress = (school: School) => {
    navigation.navigate('SchoolProfile', {
      schoolId: school.id,
      schoolData: {
        id: school.id,
        name: school.name,
        location: school.location,
        tuitionRange: school.fee,
        description: `${school.name} is a prestigious institution offering world-class education and research opportunities.`,
        ranking: '#25 in National Universities',
        founded: '1901',
        studentCount: '15,000+',
        acceptanceRate: '15%',
        programCategories: [
          {
            id: '1',
            name: 'Engineering',
            isExpanded: false,
            programs: [
              { id: '1', name: 'Computer Science', duration: '4 years', degree: 'Bachelor of Science' },
              { id: '2', name: 'Electrical Engineering', duration: '4 years', degree: 'Bachelor of Science' },
            ],
          },
          {
            id: '2',
            name: 'Business',
            isExpanded: false,
            programs: [
              { id: '3', name: 'Business Administration', duration: '2 years', degree: 'Master of Business Administration' },
            ],
          },
        ],
        gallery: [
          'https://via.placeholder.com/300x200/4285F4/FFFFFF?text=Campus+1',
          'https://via.placeholder.com/300x200/34A853/FFFFFF?text=Campus+2',
        ],
      },
    });
  };
  
  const recommended: School[] = [
    { 
      id: "1", 
      name: "Southwestern University", 
      location: "Urgello, Cebu",
      fee: "₱ 80,000/year",
      image: "https://placehold.co/64x64"
    },
    { 
      id: "2", 
      name: "University of Cebu", 
      location: "Sancianko St, Cebu",
      fee: "₱ 70,000/year",
      image: "https://placehold.co/64x64"
    },
    { 
      id: "3", 
      name: "University of San Carlos", 
      location: "Sitio Nasipit, Cebu",
      fee: "₱ 100,000/year",
      image: "https://placehold.co/64x64"
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Welcome to EduMatch!</Text>
          <Text style={styles.subtitle}>
            Let's find your perfect college match
          </Text>
        </View>
      </View>

      {/* Confidence Tracker */}
      <View style={styles.confidenceCard}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confidenceGradient}
        >
          <View style={styles.confidenceHeader}>
            <TrendingUp size={20} color="#ffffff" />
            <Text style={styles.confidenceTitle}>Confidence Tracker</Text>
          </View>
          <View style={styles.confidenceContent}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Profile Completion</Text>
              <Text style={styles.progressPercent}>{completionPercentage}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressSubtext}>
              Complete your profile to get better matches
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Explore')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#2A71D0' }]}>
              <Search size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>Find Schools</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Matches')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#2ECC71' }]}>
              <Target size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>My Matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Applications')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFB800' }]}>
              <FileText size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>Applications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#0C5441' }]}>
              <User size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommended Section */}
      <View style={styles.recommendedSection}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recommended}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.carouselContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.schoolCarouselCard}
              onPress={() => handleSchoolPress(item)}
              accessibilityLabel={`View ${item.name} profile`}
              accessibilityRole="button"
            >
              <Image
                source={require('../../assets/images/logomark.png')}
                style={styles.schoolCarouselImage}
                resizeMode="cover"
              />
              <View style={styles.schoolCarouselInfo}>
                <Text style={styles.schoolCarouselName}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.schoolCarouselLocation}>{item.location}</Text>
                </View>
                <Text style={styles.tuitionCarouselFee}>{item.fee}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}



/* Dummy Screen for non-implemented tabs */
function DummyScreen() {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  
  return (
    <View style={styles.center}>
      <Text>Coming Soon...</Text>
    </View>
  );
}

// ---------------- Navigation ----------------
export default function HomeScreen() {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  
  return (
    <Tab.Navigator
        screenOptions={({
          route,
        }: {
          route: RouteProp<RootTabParamList, keyof RootTabParamList>;
        }) => ({
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => {
            switch (route.name) {
              case "Home":
                return <Home size={20} color={color} />;
              case "Explore":
                return <Search size={20} color={color} />;
              case "Matches":
                return <Target size={20} color={color} />;
              case "Applications":
                return <FileText size={20} color={color} />;
              case "Profile":
                return <User size={20} color={color} />;
              default:
                return null;
            }
          },
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeTabScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Applications" component={ApplicationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

// ---------------- Styles ----------------
const createStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40, // Safe area padding
    paddingBottom: 10, // Extra bottom padding for tab bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  greeting: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: colors.text,
    fontFamily: "Poppins",
    lineHeight: 32,
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textSecondary,
    fontFamily: "Inter",
    fontWeight: "400",
    lineHeight: 25.6,
    marginTop: 4,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confidenceCard: {
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1.26,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  confidenceGradient: {
    padding: 24,
  },
  confidenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  confidenceTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  confidenceContent: {
    gap: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "500",
    color: "#ffffff",
  },
  progressPercent: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#ffffff",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    borderRadius: 42152500,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#ffffff",
    borderRadius: 42152500,
  },
  progressSubtext: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.80)",
    lineHeight: 20,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#111827",
    fontFamily: "Arimo",
    lineHeight: 28,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 42152500,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionLabel: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#111827",
    lineHeight: 24,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  schoolCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  schoolImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: { 
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  schoolLocation: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 4,
  },
  tuitionFee: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: colors.background
  },
  carouselContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  schoolCarouselCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 0,
    marginRight: 12,
    width: 280,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  schoolCarouselInfo: {
    flex: 1,
    padding: 16,
  },
  schoolCarouselName: { 
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 8,
  },
  schoolCarouselLocation: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
    marginLeft: 4,
  },
  tuitionCarouselFee: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 4,
  },
  schoolCarouselImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginBottom: 0,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textMuted,
  },
});
