import { useNavigation } from '@react-navigation/native';
import {
  AlertTriangle,
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Palette,
  User
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';

// ---------------- Types ----------------
type SettingItem = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'switch' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showChevron?: boolean;
};

// ---------------- Helper Components ----------------
const SettingRow = ({ 
  icon, 
  title, 
  subtitle, 
  type, 
  value, 
  onPress, 
  onToggle, 
  showChevron = true,
  styles
}: SettingItem & { styles: any }) => (
  <TouchableOpacity 
    style={styles.settingRow} 
    onPress={type === 'navigation' ? onPress : undefined}
    disabled={type === 'switch'}
  >
    <View style={styles.settingIcon}>
      {icon}
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {type === 'switch' && (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
        thumbColor={value ? "#2563EB" : "#F3F4F6"}
      />
    )}
    {type === 'navigation' && showChevron && (
      <ChevronRight size={20} color="#6B7280" />
    )}
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
export default function SettingsScreen() {
  const { signOut, user: authUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = useThemedColors();
  const navigation = useNavigation();
  
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);

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

  const handleUpdatePassword = () => {
    (navigation as any).navigate('UpdatePassword');
  };

  // Create styles with theme colors
  const styles = createStyles(colors);

  const SettingsSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingRow
            icon={<User size={20} color="#2A71D0" />}
            title="Profile Information"
            subtitle="Manage your personal details"
            type="navigation"
            onPress={() => (navigation as any).navigate('EditProfile')}
            styles={styles}
          />
          <SettingRow
            icon={<Lock size={20} color="#2A71D0" />}
            title="Change Password"
            subtitle="Update your account password"
            type="navigation"
            onPress={handleUpdatePassword}
            styles={styles}
          />
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection title="App Preferences">
          <SettingRow
            icon={<Bell size={20} color="#2A71D0" />}
            title="Notifications"
            subtitle="Receive app notifications"
            type="switch"
            value={notifications}
            onToggle={setNotifications}
            styles={styles}
          />
          <SettingRow
            icon={<Moon size={20} color="#2A71D0" />}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            type="switch"
            value={isDarkMode}
            onToggle={toggleTheme}
            styles={styles}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingRow
            icon={<HelpCircle size={20} color="#2A71D0" />}
            title="Help Center"
            subtitle="Get help and support"
            type="navigation"
            onPress={() => navigation.navigate('Support' as never)}
            styles={styles}
          />
          <SettingRow
            icon={<Palette size={20} color="#2A71D0" />}
            title="About"
            subtitle="Version 1.0.0"
            type="navigation"
            onPress={() => {/* Navigate to About */}}
            showChevron={false}
            styles={styles}
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account Actions">
          <SettingRow
            icon={<LogOut size={20} color="#EF4444" />}
            title="Sign Out"
            subtitle="Sign out of your account"
            type="navigation"
            onPress={() => setShowSignOutModal(true)}
            showChevron={false}
            styles={styles}
          />
        </SettingsSection>

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: colors.text,
    lineHeight: 32,
  },
  headerSpacer: {
    width: 40,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
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
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.text,
    lineHeight: 24,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
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
    backgroundColor: colors.error,
  },
  modalConfirmText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});