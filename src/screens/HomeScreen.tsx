import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    CompositeNavigationProp,
    RouteProp,
    useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    Bell,
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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import ExploreScreen from "./ExploreScreen";
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Let's find your perfect college match
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={16} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Confidence Tracker */}
      <View style={styles.confidenceCard}>
        <View style={styles.confidenceHeader}>
          <TrendingUp size={20} color="#111827" />
          <Text style={styles.confidenceTitle}>Confidence Tracker</Text>
        </View>
        <View style={styles.confidenceContent}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Profile Completion</Text>
            <Text style={styles.progressPercent}>0%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "0%" }]} />
          </View>
          <Text style={styles.progressSubtext}>
            Complete your profile to get better matches
          </Text>
        </View>
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
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2ECC71' }]}>
              <Target size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>My Matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFB800' }]}>
              <FileText size={16} color="white" />
            </View>
            <Text style={styles.quickActionLabel}>Applications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
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
              <View style={styles.schoolCarouselImagePlaceholder}>
                <Text style={styles.placeholderText}>School Image</Text>
              </View>
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
  return (
    <View style={styles.center}>
      <Text>Coming Soon...</Text>
    </View>
  );
}

// ---------------- Navigation ----------------
export default function HomeScreen() {
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
        <Tab.Screen name="Matches" component={DummyScreen} />
        <Tab.Screen name="Applications" component={DummyScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#F9FAFB" 
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
    color: "#111827",
    fontFamily: "Poppins",
    lineHeight: 32,
  },
  subtitle: { 
    fontSize: 16, 
    color: "#6B7280",
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  confidenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  confidenceTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#111827",
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
    fontWeight: "400",
    color: "#111827",
  },
  progressPercent: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#111827",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(42, 113, 208, 0.20)",
    borderRadius: 42152500,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#2A71D0",
    borderRadius: 42152500,
  },
  progressSubtext: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
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
    color: "#6B7280",
    lineHeight: 20,
    marginLeft: 4,
  },
  tuitionFee: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  carouselContainer: {
    paddingLeft: 16,
    paddingRight: 16,
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
  schoolCarouselImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
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
  schoolCarouselImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#FF0000",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#9CA3AF",
  },
});
