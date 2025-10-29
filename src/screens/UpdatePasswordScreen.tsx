import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
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

interface UpdatePasswordScreenProps {
  navigation: any;
  route?: {
    params?: {
      token?: string;
    };
  };
}

export const UpdatePasswordScreen: React.FC<UpdatePasswordScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
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

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPass: string, newPass: string) => {
    if (!confirmPass) {
      return 'Please confirm your password';
    } else if (confirmPass !== newPass) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    // Validate both passwords
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, newPassword);
    
    if (newPasswordError || confirmPasswordError) {
      setErrors({
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Simulate API call for password update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated. You can now sign in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update password. Please try again.',
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
            <ArrowLeft size={24} color="#000" />
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
          <Text style={styles.title}>Update Password</Text>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              newPasswordFocused && styles.textInputContainerFocused,
              errors.newPassword && styles.textInputContainerError
            ]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(newPasswordFocused, newPassword) && styles.floatingLabelActive
                ]}>
                  New Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: '' });
                    }
                  }}
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="New password"
                  accessibilityRole="text"
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
                accessibilityLabel={showNewPassword ? "Hide password" : "Show password"}
                accessibilityRole="button"
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.textInputContainer,
              confirmPasswordFocused && styles.textInputContainerFocused,
              errors.confirmPassword && styles.textInputContainerError
            ]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <View style={styles.inputContent}>
                <Text style={[
                  styles.floatingLabel,
                  shouldLabelFloat(confirmPasswordFocused, confirmPassword) && styles.floatingLabelActive
                ]}>
                  Confirm Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Confirm password"
                  accessibilityRole="text"
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                accessibilityRole="button"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
            onPress={handleUpdatePassword}
            disabled={isLoading}
            accessibilityLabel="Update password"
            accessibilityRole="button"
          >
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Updating...' : 'Update'}
            </Text>
          </TouchableOpacity>
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
    color: 'black',
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
    backgroundColor: '#D9D9D9',
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
    color: 'black',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  floatingLabelActive: {
    top: 2,
    fontSize: 12,
    color: '#666',
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: 'black',
    paddingTop: 20,
    paddingBottom: 4,
    height: 52,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    padding: 4,
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
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});