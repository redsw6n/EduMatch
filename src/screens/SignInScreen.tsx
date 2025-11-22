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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useThemedColors } from '../hooks/useThemedColors';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const { signIn, isLoading } = useAuth();

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
    } else if (passwordValue.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email.trim(), password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Sign In Failed', 'Please check your credentials and try again.');
    }
  };

  const handleTabPress = (tab: 'login' | 'signup') => {
    if (tab === 'signup') {
      navigation.navigate('SignUp');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
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

            {/* Login Card */}
            <View style={styles.loginCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to your student account</Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
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
                      placeholder="Enter your password"
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

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                  onPress={handleSignIn}
                  disabled={isLoading}
                  accessibilityLabel="Sign In"
                  accessibilityRole="button"
                >
                  <Text style={styles.signInButtonText}>SIGN IN</Text>
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  accessibilityLabel="Forgot Password"
                  accessibilityRole="button"
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    minHeight: 384,
    maxHeight: 450,
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
  // Login Card Styles
  loginCard: {
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
    height: 74,
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
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 26,
  },
  // Form Section
  formSection: {
    width: '100%',
    flex: 1,
    gap: 12,
    justifyContent: 'flex-start',
  },
  inputGroup: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 8,
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
    marginTop: 2,
    alignSelf: 'flex-start',
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
  // Sign In Button
  signInButton: {
    width: '100%',
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  // Forgot Password Button
  forgotPasswordButton: {
    width: '100%',
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 20,
  },
});
