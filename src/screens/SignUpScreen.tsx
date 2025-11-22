import { Eye, EyeOff } from 'lucide-react-native';
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

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  
  const { signUp, isLoading } = useAuth();

  // Hide navigation header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Real-time validation functions
  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValue.trim()) {
      return 'Email is required';
    } else if (!emailRegex.test(emailValue.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (passwordValue: string) => {
    if (!passwordValue) {
      return 'Password is required';
    } else if (passwordValue.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(passwordValue)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPasswordValue: string, passwordValue: string) => {
    if (!confirmPasswordValue) {
      return 'Please confirm your password';
    } else if (passwordValue !== confirmPasswordValue) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Parse full name into first and last name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await signUp(firstName, lastName, email.trim(), password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Please try again.');
    }
  };

  const handleTabPress = (tab: 'login' | 'signup') => {
    if (tab === 'login') {
      navigation.navigate('SignIn');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -60 : -80}
      >
        <View style={styles.content}>
          {/* Logo - Absolutely positioned within the 120px space */}
          <Image 
            source={require('../../assets/images/logomark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Main Container */}
          <View style={styles.mainContainer}>
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  styles.loginTab,
                  activeTab === 'login' ? styles.activeTab : styles.inactiveTab
                ]}
                onPress={() => handleTabPress('login')}
                accessibilityLabel="Login Tab"
                accessibilityRole="button"
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'login' && styles.activeTabText
                ]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  styles.signupTab,
                  activeTab === 'signup' ? styles.activeTab : styles.inactiveTab
                ]}
                onPress={() => handleTabPress('signup')}
                accessibilityLabel="Sign Up Tab"
                accessibilityRole="button"
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'signup' && styles.activeTabText
                ]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Card */}
            <View style={styles.signUpCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeTitle}>Create Account</Text>
                <Text style={styles.welcomeSubtitle}>Join as a student to find your perfect college match</Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                {/* Full Name Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name (First Name, M.I., Last Name)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      errors.fullName && styles.inputError
                    ]}
                    value={fullName}
                    onChangeText={setFullName}
                    onBlur={() => {
                      const fullNameError = fullName.trim() ? '' : 'Full name is required';
                      setErrors(prev => ({ ...prev, fullName: fullNameError }));
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    autoCorrect={false}
                    accessibilityLabel="Full name input"
                  />
                  {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                </View>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      errors.email && styles.inputError
                    ]}
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => {
                      const emailError = validateEmail(email);
                      setErrors(prev => ({ ...prev, email: emailError }));
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Email input"
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.passwordInput,
                        errors.password && styles.inputError
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      onBlur={() => {
                        const passwordError = validatePassword(password);
                        setErrors(prev => ({ ...prev, password: passwordError }));
                      }}
                      placeholder="Create a password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showPassword}
                      accessibilityLabel="Password input"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                      accessibilityRole="button"
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} />
                      ) : (
                        <Eye size={20} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* Confirm Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.passwordInput,
                        errors.confirmPassword && styles.inputError
                      ]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onBlur={() => {
                        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
                        setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
                      }}
                      placeholder="Re-enter password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showConfirmPassword}
                      accessibilityLabel="Confirm password input"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      accessibilityRole="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} />
                      ) : (
                        <Eye size={20} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                {/* Create Account Button */}
                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                  accessibilityLabel="Create Account"
                  accessibilityRole="button"
                >
                  <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  logo: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    width: 60,
    height: 60,
    zIndex: 1,
  },
  mainContainer: {
    width: 345,
    height: 544,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  // Tab Switcher Styles
  tabContainer: {
    width: 345,
    height: 36,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    width: 169.63,
    height: 29.46,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 3.47,
  },
  loginTab: {
    left: 2.98,
  },
  signupTab: {
    left: 172.62,
  },
  activeTab: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1.26,
    borderColor: 'rgba(0, 0, 0, 0)',
    shadowColor: colors.gray?.[300] || colors.border,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
    borderWidth: 1.26,
    borderColor: 'rgba(0, 0, 0, 0)',
  },
  tabText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 20,
  },
  activeTabText: {
    color: colors.text,
  },
  // Sign Up Card Styles
  signUpCard: {
    width: 345,
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },
  // Card Header
  cardHeader: {
    width: '100%',
    height: 99,
  },
  welcomeTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    width: 279,
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 26,
  },
  // Form Section
  formSection: {
    width: '100%',
    height: 376,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 16,
  },
  inputGroup: {
    width: '100%',
    height: 58,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 14,
  },
  textInput: {
    width: '100%',
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.text,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    width: '100%',
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 4,
    paddingRight: 40,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontFamily: 'Inter',
    fontWeight: '400',
    marginTop: 4,
    position: 'absolute',
    bottom: -20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sign Up Button
  signUpButton: {
    width: '100%',
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
});
