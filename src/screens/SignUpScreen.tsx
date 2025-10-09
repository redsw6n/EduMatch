import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Focus states for floating labels
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  const { signUp, isLoading } = useAuth();

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
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
      await signUp(email.trim(), password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Please try again.');
    }
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View
          style={styles.content}
        >
          {/* Red curved header */}
          <View style={styles.redHeader} />
          
          {/* Sign Up Title */}
          <Text style={styles.title}>Sign Up</Text>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* First Name and Last Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.nameInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  onFocus={() => setFirstNameFocused(true)}
                  onBlur={() => setFirstNameFocused(false)}
                />
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(firstNameFocused, firstName) && styles.floatingLabelActive
                ]}>First Name</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.nameInput}
                  value={lastName}
                  onChangeText={setLastName}
                  onFocus={() => setLastNameFocused(true)}
                  onBlur={() => setLastNameFocused(false)}
                />
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(lastNameFocused, lastName) && styles.floatingLabelActive
                ]}>Last Name</Text>
              </View>
            </View>
            
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
            <View style={[styles.inputGroup, styles.fullWidthInput, { top: 450 }]}>
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
                  <EyeOff size={20} color="#666666" />
                ) : (
                  <Eye size={20} color="#666666" />
                )}
              </TouchableOpacity>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            
            {/* Confirm Password Field */}
            <View style={[styles.inputGroup, styles.fullWidthInput, { top: 530 }]}>
              <TextInput
                style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => {
                  setConfirmPasswordFocused(false);
                  const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
                  setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <Text style={[
                styles.floatingLabel,
                shouldLabelFloat(confirmPasswordFocused, confirmPassword) && styles.floatingLabelActive
              ]}>Confirm Password</Text>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666666" />
                ) : (
                  <Eye size={20} color="#666666" />
                )}
              </TouchableOpacity>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>
            
            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignInPress}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  // Red curved header - larger placeholder for image
  redHeader: {
    position: 'absolute',
    width: 390,
    height: 220,
    left: 0,
    top: 0,
    backgroundColor: '#FF0000',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  // Sign Up title positioned with more space below red header
  title: {
    position: 'absolute',
    width: 181.34,
    height: 50.54,
    left: 104.33,
    top: 240,
    textAlign: 'center',
    color: 'black',
    fontSize: 40,
    fontFamily: 'Inter',
    fontWeight: '700',
    zIndex: 10, // Ensure title appears above other elements
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  // Name fields row - positioned below title with proper spacing
  nameRow: {
    position: 'absolute',
    top: 300,
    left: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 340,
  },
  inputGroup: {
    position: 'relative',
    width: 161.87,
  },
  fullWidthInput: {
    position: 'absolute',
    left: 25,
    width: 340,
    top: 370,
  },
  nameInput: {
    width: '100%',
    height: 52,
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  textInput: {
    width: '100%',
    height: 52,
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  passwordInput: {
    width: '100%',
    height: 52,
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#D9D9D9',
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
    color: '#666666',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 1,
    pointerEvents: 'none',
  },
  floatingLabelActive: {
    top: -8,
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  // Eye icon positioned exactly as in Figma
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
  // Sign Up button
  signUpButton: {
    position: 'absolute',
    width: 340,
    left: 25,
    top: 620,
    padding: 16,
    backgroundColor: '#2A71D0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 20,
  },
  // Footer
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: 'black',
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
