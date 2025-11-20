import { ArrowLeft, Mail } from 'lucide-react-native';
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
import { useThemedColors } from '../hooks/useThemedColors';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Email validation
  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValue.trim()) {
      return 'Email is required';
    } else if (!emailRegex.test(emailValue.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle password reset submission
  const handleSubmit = async () => {
    // Validate email
    const emailError = validateEmail(email);
    
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Reset Link Sent',
        'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to send reset link. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
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
            onPress={() => navigation.goBack()}
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
          <Text style={styles.title}>Forgot Password</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              emailFocused && styles.textInputContainerFocused,
              errors.email && styles.textInputContainerError
            ]}>
              <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(emailFocused, email) && styles.floatingLabelActive
                ]}>
                  Email
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
                  accessibilityLabel="Email address"
                  accessibilityRole="text"
                />
              </View>
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityLabel="Submit password reset request"
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Sending...' : 'Submit'}
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
    marginBottom: 91,
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
  submitButton: {
    backgroundColor: '#2A71D0',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});