import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Filter,
  Heart,
  MapPin,
  Search,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from "../navigation/AppNavigator";

// ---------------- Types ----------------
type University = {
  id: string;
  name: string;
  address: string;
  tuition: string;
};

type Category = {
  id: string;
  name: string;
  active: boolean;
};

type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Matches: undefined;
  Applications: undefined;
  Profile: undefined;
};

type ExploreScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Explore'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// ---------------- Component ----------------
export default function ExploreScreen() {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minTuition, setMinTuition] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [location, setLocation] = useState("");
  
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "STEM", active: false },
    { id: "2", name: "Business", active: false },
    { id: "3", name: "Arts", active: false },
    { id: "4", name: "Health", active: false },
    { id: "5", name: "Liberal Arts", active: false },
  ]);

  const [universities] = useState<University[]>([
    {
      id: "1",
      name: "Southwestern University",
      address: "Urgello, Cebu",
      tuition: "₱80,000/year",
    },
    {
      id: "2",
      name: "University of Cebu",
      address: "Sancianko St, Cebu",
      tuition: "₱70,000/year",
    },
    {
      id: "3",
      name: "University of Visayas",
      address: "Colon St, Cebu",
      tuition: "₱60,000/year",
    },
    {
      id: "4",
      name: "University of San Carlos",
      address: "Sitio Nasipit, Cebu",
      tuition: "₱100,000/year",
    },
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, active: !cat.active } : cat
    ));
  };

  const toggleFavorite = (university: University) => {
    if (isFavorite(university.id)) {
      removeFromFavorites(university.id);
    } else {
      addToFavorites({
        id: university.id,
        name: university.name,
        location: university.address,
        fee: university.tuition,
      });
    }
  };

  const handleUniversityPress = (university: University) => {
    navigation.navigate('SchoolProfile', {
      schoolId: university.id,
      schoolData: {
        id: university.id,
        name: university.name,
        location: university.address,
        tuitionRange: university.tuition,
        description: `${university.name} is a prestigious institution offering world-class education and research opportunities.`,
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

  const openGoogleMaps = () => {
    const query = "universities near me";
    let url = "";

    if (Platform.OS === 'ios') {
      // For iOS, try to open Google Maps app first, fallback to Apple Maps
      url = `comgooglemaps://?q=${encodeURIComponent(query)}`;
    } else {
      // For Android, use Google Maps intent
      url = `geo:0,0?q=${encodeURIComponent(query)}`;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to web version of Google Maps
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
          Linking.openURL(webUrl);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to open maps application");
        console.error("Error opening maps:", error);
      });
  };

  // Filter universities based on search query and other filters
  const getFilteredUniversities = () => {
    return universities.filter((university) => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation = location === "" || 
        university.address.toLowerCase().includes(location.toLowerCase());

      // Tuition filter
      let matchesTuition = true;
      if (minTuition || maxTuition) {
        const tuitionValue = parseInt(university.tuition.replace(/[^\d]/g, ''));
        const minValue = minTuition ? parseInt(minTuition) : 0;
        const maxValue = maxTuition ? parseInt(maxTuition) : Infinity;
        matchesTuition = tuitionValue >= minValue && tuitionValue <= maxValue;
      }

      return matchesSearch && matchesLocation && matchesTuition;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Universities</Text>
        <Text style={styles.subtitle}>Discover colleges that match your interests</Text>
      </View>

      {/* Search & Actions Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openGoogleMaps}
        >
          <MapPin size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filter Form (Conditional) */}
      {showFilters && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filters</Text>
          
          {/* Location */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Location</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Tuition Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tuition Range</Text>
            <View style={styles.tuitionRow}>
              <TextInput
                style={[styles.filterInput, styles.tuitionInput]}
                placeholder="Min"
                value={minTuition}
                onChangeText={setMinTuition}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.filterInput, styles.tuitionInput]}
                placeholder="Max"
                value={maxTuition}
                onChangeText={setMaxTuition}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Browse by Category */}
        {/* <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    category.active && styles.categoryChipActive
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    category.active && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View> */}

        {/* University List */}
        <View style={styles.universitySection}>
          {getFilteredUniversities().length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No universities found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            getFilteredUniversities().map((university) => (
              <TouchableOpacity 
                key={university.id} 
                style={styles.universityCard}
                onPress={() => handleUniversityPress(university)}
                accessibilityLabel={`View ${university.name} profile`}
                accessibilityRole="button"
              >
                {/* Logo placeholder */}
                <View style={styles.logoPlaceholder} />
                
                {/* Content */}
                <View style={styles.universityContent}>
                  <View style={styles.universityInfo}>
                    <Text style={styles.universityName}>{university.name}</Text>
                    <Text style={styles.universityAddress}>{university.address}</Text>
                    <Text style={styles.universityTuition}>{university.tuition}</Text>
                  </View>
                  
                  {/* Favorite Button */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(university)}
                  >
                    <Heart 
                      size={24} 
                      color={isFavorite(university.id) ? "#FF6B6B" : "#ccc"} 
                      fill={isFavorite(university.id) ? "#FF6B6B" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 40, // Safe area padding
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#111827",
  },
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  filterContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  tuitionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tuitionInput: {
    width: "48%",
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryList: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  categoryChip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
  },
  universitySection: {
    paddingHorizontal: 16,
  },
  universityCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#FF0000",
    borderRadius: 30,
    marginRight: 12,
  },
  universityContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 4,
  },
  universityAddress: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  universityTuition: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
  },

  favoriteButton: {
    padding: 8,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});