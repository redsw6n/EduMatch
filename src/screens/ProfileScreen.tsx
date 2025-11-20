import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    AlertTriangle,
    Bell,
    BookOpen,
    ChevronRight,
    Edit3,
    GraduationCap,
    LogOut,
    MapPin,
    MessageCircle,
    Settings,
    User,
    Wallet
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    Image,
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
import { useNotifications } from '../context/NotificationsContext';
import { useProfileCompletion } from '../context/ProfileCompletionContext';
import { useThemedColors } from '../hooks/useThemedColors';

// ---------------- Helper Components ----------------
const InfoRow = ({ 
  icon, 
  label, 
  value,
  iconBgColor = "#F3F4F6",
  styles
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  iconBgColor?: string;
  styles: any;
}) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: iconBgColor }]}>
      {icon}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !value && styles.placeholderText]}>
        {value || `No ${label.toLowerCase()} added`}
      </Text>
    </View>
  </View>
);

const FavoriteUniversityCard = ({ 
  university, 
  styles,
  colors
}: { 
  university: FavoriteUniversity;
  styles: any;
  colors: any;
}) => (
  <TouchableOpacity style={styles.favoriteUniversityCard}>
    <View style={styles.universityLogoContainer}>
      <Image 
        source={require('../../assets/images/logomark.png')}
        style={styles.universityLogo}
        resizeMode="contain"
      />
    </View>
    <View style={styles.universityInfo}>
      <Text style={styles.universityName}>{university.name}</Text>
      <View style={styles.universityLocationRow}>
        <MapPin size={12} color={colors.textSecondary} />
        <Text style={styles.universityLocation}>{university.location}</Text>
      </View>
      <Text style={styles.universityFee}>{university.fee}</Text>
    </View>
    <ChevronRight size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

// ---------------- Sign Out Modal Component ----------------
const SignOutConfirmationModal = ({ 
  visible, 
  onConfirm, 
  onCancel,
  styles
}: { 
  visible: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
  styles: any;
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
  const colors = useThemedColors();
  const { favoriteUniversities } = useFavorites();
  const { signOut, user: authUser } = useAuth();
  const { unreadCount } = useNotifications();
  const { profileData, updateAcademicBackground, updatePreferences } = useProfileCompletion();
  const navigation = useNavigation();
  
  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const user = {
    name: authUser?.firstName && authUser?.lastName 
      ? `${authUser.firstName} ${authUser.lastName}`.trim()
      : authUser?.firstName || authUser?.lastName || "User",
    email: authUser?.email || "user@example.com",
    avatar: null, // Will use placeholder
  };

  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showFavoriteUniversitiesModal, setShowFavoriteUniversitiesModal] = useState(false);

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
    onEdit
  }: { 
    title: string; 
    children: React.ReactNode; 
    showEdit?: boolean;
    onEdit?: () => void;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showEdit && (
          <TouchableOpacity 
            onPress={onEdit} 
            style={styles.editButton}
          >
            <Edit3 size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  // Academic Background Modal Component
  const AcademicBackgroundModal = () => {
    const [tempAcademicBackground, setTempAcademicBackground] = useState(profileData.academicBackground);

    const handleSave = async () => {
      try {
        await updateAcademicBackground(tempAcademicBackground);
        setShowAcademicModal(false);
      } catch (error) {
        console.error('Failed to save academic background:', error);
      }
    };

    const handleCancel = () => {
      setTempAcademicBackground(profileData.academicBackground); // Reset to original values
      setShowAcademicModal(false);
    };

    return (
      <Modal
        visible={showAcademicModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.editModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Academic Background</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.editModalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.editModalContent}>
            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>Strand</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempAcademicBackground.strand}
                onChangeText={(text) => setTempAcademicBackground(prev => ({ ...prev, strand: text }))}
                placeholder="Enter your strand"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>GPA</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempAcademicBackground.gpa}
                onChangeText={(text) => setTempAcademicBackground(prev => ({ ...prev, gpa: text }))}
                placeholder="Enter your GPA"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>Senior High School</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempAcademicBackground.school}
                onChangeText={(text) => setTempAcademicBackground(prev => ({ ...prev, school: text }))}
                placeholder="Enter your senior high school"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // Preferences Modal Component
  const PreferencesModal = () => {
    const [tempPreferences, setTempPreferences] = useState(profileData.preferences);

    const handleSave = async () => {
      try {
        await updatePreferences(tempPreferences);
        setShowPreferencesModal(false);
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    };

    const handleCancel = () => {
      setTempPreferences(profileData.preferences); // Reset to original values
      setShowPreferencesModal(false);
    };

    return (
      <Modal
        visible={showPreferencesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.editModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Preferences</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.editModalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.editModalContent}>
            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>Budget Range</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempPreferences.budget}
                onChangeText={(text) => setTempPreferences(prev => ({ ...prev, budget: text }))}
                placeholder="Enter your budget range"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>Preferred Course</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempPreferences.course}
                onChangeText={(text) => setTempPreferences(prev => ({ ...prev, course: text }))}
                placeholder="Enter your preferred course"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.editModalField}>
              <Text style={styles.editModalLabel}>Preferred Location</Text>
              <TextInput
                style={styles.editModalInput}
                value={tempPreferences.location}
                onChangeText={(text) => setTempPreferences(prev => ({ ...prev, location: text }))}
                placeholder="Enter your preferred location"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // Favorite Universities Modal Component
  const FavoriteUniversitiesModal = () => {
    return (
      <Modal
        visible={showFavoriteUniversitiesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFavoriteUniversitiesModal(false)}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={() => setShowFavoriteUniversitiesModal(false)}>
              <Text style={styles.editModalCancelText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Favorite Universities</Text>
            <View style={{ width: 60 }} />
          </View>
          
          <ScrollView style={styles.editModalContent}>
            {favoriteUniversities.length > 0 ? (
              <View style={styles.favoriteUniversitiesList}>
                {favoriteUniversities.map((university) => (
                  <View key={university.id} style={styles.favoriteUniversityCard}>
                    <View style={styles.universityLogoContainer}>
                      <Image 
                        source={require('../../assets/images/logomark.png')}
                        style={styles.universityLogo}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.universityInfo}>
                      <Text style={styles.universityName}>{university.name}</Text>
                      <View style={styles.universityLocationRow}>
                        <MapPin size={12} color={colors.textSecondary} />
                        <Text style={styles.universityLocation}>{university.location}</Text>
                      </View>
                      <Text style={styles.universityFee}>{university.fee}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No favorite universities yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Add universities to favorites by tapping the heart icon on university cards in the Explore page
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.notificationIcon}
            onPress={() => (navigation as any).navigate('Notifications')}
          >
            <Bell size={24} color="#2A71D0" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#2A71D0', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#9CA3AF" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Academic Background */}
        <ProfileSection 
          title="Academic Background"
          showEdit={true}
          onEdit={() => setShowAcademicModal(true)}
        >
          <InfoRow
            icon={<BookOpen size={20} color="#ffffff" />}
            label="Strand"
            value={profileData.academicBackground.strand}
            iconBgColor="#FFB800"
            styles={styles}
          />
          <InfoRow
            icon={<User size={20} color="#ffffff" />}
            label="GPA"
            value={profileData.academicBackground.gpa}
            iconBgColor="#FFB800"
            styles={styles}
          />
          <InfoRow
            icon={<GraduationCap size={20} color="#ffffff" />}
            label="Senior High School"
            value={profileData.academicBackground.school}
            iconBgColor="#FFB800"
            styles={styles}
          />
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection 
          title="Preferences"
          showEdit={true}
          onEdit={() => setShowPreferencesModal(true)}
        >
          <InfoRow
            icon={<Wallet size={20} color="#ffffff" />}
            label="Budget Range"
            value={profileData.preferences.budget}
            iconBgColor="#2ECC71"
            styles={styles}
          />
          <InfoRow
            icon={<BookOpen size={20} color="#ffffff" />}
            label="Preferred Course"
            value={profileData.preferences.course}
            iconBgColor="#2ECC71"
            styles={styles}
          />
          <InfoRow
            icon={<MapPin size={20} color="#ffffff" />}
            label="Preferred Location"
            value={profileData.preferences.location}
            iconBgColor="#2ECC71"
            styles={styles}
          />
        </ProfileSection>

        {/* Favorite Universities */}
        <ProfileSection title="Favorite Universities">
          {favoriteUniversities.length > 0 ? (
            <>
              <View style={styles.favoriteUniversitiesList}>
                {favoriteUniversities.slice(0, 2).map((university) => (
                  <FavoriteUniversityCard key={university.id} university={university} styles={styles} colors={colors} />
                ))}
              </View>
              {favoriteUniversities.length > 2 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setShowFavoriteUniversitiesModal(true)}
                >
                  <Text style={styles.viewAllText}>View All Favorite Universities ({favoriteUniversities.length})</Text>
                  <ChevronRight size={16} color="#2A71D0" />
                </TouchableOpacity>
              )}
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
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => (navigation as any).navigate('Settings')}
          >
            <View style={styles.settingIcon}>
              <Settings size={20} color="#2A71D0" />
            </View>
            <Text style={styles.settingText}>Settings</Text>
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
        styles={styles}
      />

      {/* Academic Background Modal */}
      <AcademicBackgroundModal />

      {/* Preferences Modal */}
      <PreferencesModal />

      {/* Favorite Universities Modal */}
      <FavoriteUniversitiesModal />
      
      {/* Floating Messages Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          // Navigate to Conversations List screen
          (navigation as any).navigate('ConversationsList');
        }}
        accessibilityRole="button"
        accessibilityLabel="Open conversations"
        activeOpacity={0.8}
      >
        <MessageCircle size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

// ---------------- Styles ----------------
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
    lineHeight: 32,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1.26,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Arimo",
    fontWeight: "700",
    textAlign: "center",
  },

  profileCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1.26,
    borderColor: "#E5E7EB",
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.20)",
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
    color: "#ffffff",
    lineHeight: 28,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.80)",
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
    color: colors.text,
    lineHeight: 28,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
  },
  placeholderText: {
    color: colors.textMuted,
    fontStyle: "italic",
    fontWeight: "400",
  },
  infoInput: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
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
    borderBottomColor: colors.border,
  },
  universityLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  universityLogo: {
    width: 32,
    height: 32,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.text,
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
    color: colors.textSecondary,
    lineHeight: 16,
    marginLeft: 4,
  },
  universityFee: {
    fontSize: 12,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textSecondary,
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
    color: colors.primary,
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
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textMuted,
    lineHeight: 20,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.text,
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    shadowColor: colors.text,
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
    color: colors.text,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.textSecondary,
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
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: colors.text,
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
  
  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A71D0', // Keep primary blue color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },

  // Edit Modal Styles
  editModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editModalTitle: {
    fontSize: 18,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: colors.text,
  },
  editModalCancelText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  editModalSaveText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: colors.primary,
  },
  editModalContent: {
    flex: 1,
    padding: 16,
  },
  editModalField: {
    marginBottom: 20,
  },
  editModalLabel: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  editModalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Arimo',
    backgroundColor: colors.surface,
    color: colors.text,
  },
});