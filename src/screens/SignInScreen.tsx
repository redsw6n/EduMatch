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
  
  // Focus states for floating labels
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { signIn, isLoading } = useAuth();

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

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={styles.content}>
          {/* Header with logo */}
          <View style={styles.headerContainer}>
            <Image 
              source={require('../../assets/images/logomark.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          
          {/* Sign In Title */}
          <Text style={styles.title}>Sign In</Text>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={[styles.inputGroup, styles.fullWidthInput]}>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => {
                  setEmailFocused(false);
                  const emailError = validateEmail(email);
                  setErrors(prev => ({ ...prev, email: emailError }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={[
                styles.floatingLabel,
                shouldLabelFloat(emailFocused, email) && styles.floatingLabelActive
              ]}>Email</Text>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            
            {/* Password Field */}
            <View style={[styles.inputGroup, styles.fullWidthInput, { top: 390 }]}>
              <TextInput
                style={[styles.passwordInput, errors.password && styles.inputError]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  const passwordError = validatePassword(password);
                  setErrors(prev => ({ ...prev, password: passwordError }));
                }}
                secureTextEntry={!showPassword}
              />
              <Text style={[
                styles.floatingLabel,
                shouldLabelFloat(passwordFocused, password) && styles.floatingLabelActive
              ]}>Password</Text>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.text} />
                ) : (
                  <Eye size={20} color={colors.text} />
                )}
              </TouchableOpacity>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            
            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
              accessibilityLabel="Forgot Password"
              accessibilityRole="button"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            </View>
        </View>
        
        {/* Footer - positioned absolutely */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUpPress}>
            <Text style={styles.footerLink}>Sign Up</Text>
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
    position: 'relative',
  },
  // Red curved header
  // Header with icon background
  headerContainer: {
    position: 'absolute',
    width: 390,
    height: 220,
    left: 0,
    top: 0,
    backgroundColor: colors.backgroundSecondary,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerIcon: {
    width: 120,
    height: 120,
  },
  // Sign In title positioned below red header
  title: {
    position: 'absolute',
    width: 181.34,
    height: 50.54,
    left: 104.33,
    top: 240,
    textAlign: 'center',
    color: colors.text,
    fontSize: 40,
    fontFamily: 'Inter',
    fontWeight: '700',
    zIndex: 10,
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  inputGroup: {
    position: 'relative',
    width: 340,
  },
  fullWidthInput: {
    position: 'absolute',
    left: 25,
    width: 340,
    top: 320,
  },
  textInput: {
    width: '100%',
    height: 52,
    fontSize: 14,
    color: colors.text,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  passwordInput: {
    width: '100%',
    height: 52,
    fontSize: 14,
    color: colors.text,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'transparent',
    paddingRight: 45, // Make room for eye icon
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    fontSize: 12,
    color: '#EF4444',
    fontFamily: 'Inter',
    fontWeight: '400',
    zIndex: 10,
  },
  floatingLabel: {
    position: 'absolute',
    left: 12,
    top: 16,
    fontSize: 14,
    color: colors.text,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 1,
    pointerEvents: 'none',
  },
  floatingLabelActive: {
    top: -8,
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: 5,
  },
  eyeIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 15,
    top: 16,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Forgot password
  forgotPasswordContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 480,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2A71D0',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  // Sign In button
  signInButton: {
    position: 'absolute',
    width: 340,
    left: 25,
    top: 530,
    padding: 16,
    backgroundColor: '#2A71D0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    textAlign: 'center',
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 20,
  },
  // Footer - positioned absolutely at bottom
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  footerLink: {
    textAlign: 'center',
    color: '#2A71D0',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
});
