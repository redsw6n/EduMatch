import { ArrowLeft, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useThemedColors } from '../hooks/useThemedColors';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const { user, updateProfile, isLoading } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [errors, setErrors] = useState<{ 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Hide navigation header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Helper function to determine if label should be floating
  const shouldLabelFloat = (focused: boolean, value: string) => {
    return focused || value.length > 0;
  };

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      return 'First name is required';
    } else if (name.trim().length < 2) {
      return 'First name must be at least 2 characters';
    }
    return '';
  };

  const validateLastName = (name: string) => {
    if (!name.trim()) {
      return 'Last name is required';
    } else if (name.trim().length < 2) {
      return 'Last name must be at least 2 characters';
    }
    return '';
  };

  const validateEmail = (emailAddress: string) => {
    if (!emailAddress.trim()) {
      return 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      return 'Please enter a valid email';
    }
    return '';
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    // Validate all fields
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    
    if (firstNameError || lastNameError || emailError) {
      setErrors({
        firstName: firstNameError,
        lastName: lastNameError,
        email: emailError,
      });
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      await updateProfile(firstName.trim(), lastName.trim(), email.trim());
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Update Failed', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logomark.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Edit Profile</Text>

          {/* First Name Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              firstNameFocused && styles.textInputContainerFocused,
              errors.firstName && styles.textInputContainerError
            ]}>
              <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(firstNameFocused, firstName) && styles.floatingLabelActive
                ]}>
                  First Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: '' });
                    }
                  }}
                  onFocus={() => setFirstNameFocused(true)}
                  onBlur={() => setFirstNameFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="given-name"
                  textContentType="givenName"
                  accessibilityLabel="First name"
                  accessibilityRole="text"
                />
              </View>
            </View>
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          {/* Last Name Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              lastNameFocused && styles.textInputContainerFocused,
              errors.lastName && styles.textInputContainerError
            ]}>
              <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(lastNameFocused, lastName) && styles.floatingLabelActive
                ]}>
                  Last Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: '' });
                    }
                  }}
                  onFocus={() => setLastNameFocused(true)}
                  onBlur={() => setLastNameFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="family-name"
                  textContentType="familyName"
                  accessibilityLabel="Last name"
                  accessibilityRole="text"
                />
              </View>
            </View>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              emailFocused && styles.textInputContainerFocused,
              errors.email && styles.textInputContainerError
            ]}>
              <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(emailFocused, email) && styles.floatingLabelActive
                ]}>
                  Email Address
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  accessibilityLabel="Email address"
                  accessibilityRole="text"
                />
              </View>
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, (isSaving || isLoading) && styles.updateButtonDisabled]}
            onPress={handleUpdateProfile}
            disabled={isSaving || isLoading}
            accessibilityLabel="Update profile"
            accessibilityRole="button"
          >
            <Text style={styles.updateButtonText}>
              {isSaving ? 'Updating...' : 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 25,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 40,
  },
  logo: {
    width: 196,
    height: 196,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 54,
    width: 320.8,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    position: 'relative',
  },
  textInputContainerFocused: {
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#2A71D0',
  },
  textInputContainerError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputContent: {
    flex: 1,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    left: 0,
    top: 16,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.text,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  floatingLabelActive: {
    top: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.text,
    paddingTop: 20,
    paddingBottom: 4,
    height: 52,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '400',
    marginTop: 4,
    marginLeft: 16,
  },
  updateButton: {
    backgroundColor: '#2A71D0',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EditProfileScreen;