import { useNavigation } from '@react-navigation/native';
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronRight,
  Edit3,
  GraduationCap,
  LogOut,
  MapPin,
  User,
  Wallet
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from '../context/AuthContext';
import { useFavorites, type FavoriteUniversity } from '../context/FavoritesContext';

// ---------------- Types ----------------
type AcademicBackground = {
  strand: string;
  gpa: string;
  school: string;
};

type Preferences = {
  budget: string;
  course: string;
  location: string;
};

// ---------------- Helper Components ----------------
const InfoRow = ({ 
  icon, 
  label, 
  value,
  isEditing = false,
  onChangeText
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  isEditing?: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      {icon}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.infoInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
        />
      ) : (
        <Text style={[styles.infoValue, !value && styles.placeholderText]}>
          {value || `No ${label.toLowerCase()} added`}
        </Text>
      )}
    </View>
  </View>
);

const FavoriteUniversityCard = ({ university }: { university: FavoriteUniversity }) => (
  <TouchableOpacity style={styles.favoriteUniversityCard}>
    <View style={styles.universityLogoPlaceholder} />
    <View style={styles.universityInfo}>
      <Text style={styles.universityName}>{university.name}</Text>
      <View style={styles.universityLocationRow}>
        <MapPin size={12} color="#6B7280" />
        <Text style={styles.universityLocation}>{university.location}</Text>
      </View>
      <Text style={styles.universityFee}>{university.fee}</Text>
    </View>
    <ChevronRight size={20} color="#6B7280" />
  </TouchableOpacity>
);

// ---------------- Sign Out Modal Component ----------------
const SignOutConfirmationModal = ({ 
  visible, 
  onConfirm, 
  onCancel 
}: { 
  visible: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.modalIconContainer}>
            <AlertTriangle size={24} color="#F59E0B" />
          </View>
          <Text style={styles.modalTitle}>Sign Out</Text>
        </View>
        
        <Text style={styles.modalMessage}>
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </Text>
        
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={styles.modalCancelButton} 
            onPress={onCancel}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalConfirmButton} 
            onPress={onConfirm}
          >
            <Text style={styles.modalConfirmText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// ---------------- Component ----------------
export default function ProfileScreen() {
  const { favoriteUniversities } = useFavorites();
  const { signOut, user: authUser } = useAuth();
  const navigation = useNavigation();
  
  const [user] = useState({
    name: "John Doe",
    email: authUser?.email || "user@example.com",
    avatar: null, // Will use placeholder
  });

  // Edit mode states
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const [academicBackground, setAcademicBackground] = useState<AcademicBackground>({
    strand: "",
    gpa: "",
    school: "",
  });

  const [preferences, setPreferences] = useState<Preferences>({
    budget: "",
    course: "",
    location: "",
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowSignOutModal(false);
      // Navigate to onboarding screen
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setShowSignOutModal(false);
    }
  };

  const ProfileSection = ({ 
    title, 
    children, 
    showEdit = false, 
    isEditing = false,
    onEdit,
    onSave
  }: { 
    title: string; 
    children: React.ReactNode; 
    showEdit?: boolean;
    isEditing?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showEdit && (
          <TouchableOpacity 
            onPress={isEditing ? onSave : onEdit} 
            style={[styles.editButton, isEditing && styles.saveButton]}
          >
            {isEditing ? (
              <Check size={16} color="#FFFFFF" />
            ) : (
              <Edit3 size={16} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#9CA3AF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Academic Background */}
        <ProfileSection 
          title="Academic Background" 
          showEdit={true}
          isEditing={isEditingAcademic}
          onEdit={() => setIsEditingAcademic(true)}
          onSave={() => setIsEditingAcademic(false)}
        >
          <InfoRow
            icon={<BookOpen size={20} color="#6B7280" />}
            label="Strand"
            value={academicBackground.strand}
            isEditing={isEditingAcademic}
            onChangeText={(text) => setAcademicBackground(prev => ({ ...prev, strand: text }))}
          />
          <InfoRow
            icon={<User size={20} color="#6B7280" />}
            label="GPA"
            value={academicBackground.gpa}
            isEditing={isEditingAcademic}
            onChangeText={(text) => setAcademicBackground(prev => ({ ...prev, gpa: text }))}
          />
          <InfoRow
            icon={<GraduationCap size={20} color="#6B7280" />}
            label="University"
            value={academicBackground.school}
            isEditing={isEditingAcademic}
            onChangeText={(text) => setAcademicBackground(prev => ({ ...prev, school: text }))}
          />
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection 
          title="Preferences" 
          showEdit={true}
          isEditing={isEditingPreferences}
          onEdit={() => setIsEditingPreferences(true)}
          onSave={() => setIsEditingPreferences(false)}
        >
          <InfoRow
            icon={<Wallet size={20} color="#6B7280" />}
            label="Budget Range"
            value={preferences.budget}
            isEditing={isEditingPreferences}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, budget: text }))}
          />
          <InfoRow
            icon={<BookOpen size={20} color="#6B7280" />}
            label="Preferred Course"
            value={preferences.course}
            isEditing={isEditingPreferences}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, course: text }))}
          />
          <InfoRow
            icon={<MapPin size={20} color="#6B7280" />}
            label="Preferred Location"
            value={preferences.location}
            isEditing={isEditingPreferences}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, location: text }))}
          />
        </ProfileSection>

        {/* Favorite Universities */}
        <ProfileSection title="Favorite Universities">
          {favoriteUniversities.length > 0 ? (
            <>
              <View style={styles.favoriteUniversitiesList}>
                {favoriteUniversities.map((university) => (
                  <FavoriteUniversityCard key={university.id} university={university} />
                ))}
              </View>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All Favorite Universities</Text>
                <ChevronRight size={16} color="#2A71D0" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No favorite universities yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add universities to favorites by tapping the heart icon on university cards in the Explore page
              </Text>
            </View>
          )}
        </ProfileSection>

        {/* Profile Settings */}
        <ProfileSection title="Profile Settings">
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Edit3 size={20} color="#2A71D0" />
            </View>
            <Text style={styles.settingText}>Edit Profile</Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowSignOutModal(true)}
          >
            <View style={styles.settingIcon}>
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={styles.settingText}>Sign Out</Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </ProfileSection>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        visible={showSignOutModal}
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 32,
  },

  profileCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 28,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 28,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  saveButton: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  sectionContent: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },
  placeholderText: {
    color: "#9CA3AF",
    fontStyle: "italic",
    fontWeight: "400",
  },
  infoInput: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A71D0",
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  favoriteUniversitiesList: {
    gap: 12,
  },
  favoriteUniversityCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  universityLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
    marginBottom: 2,
  },
  universityLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  universityLocation: {
    fontSize: 12,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 16,
    marginLeft: 4,
  },
  universityFee: {
    fontSize: 12,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#2A71D0",
    lineHeight: 20,
    marginRight: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#9CA3AF",
    lineHeight: 20,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#111827",
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  modalConfirmText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});