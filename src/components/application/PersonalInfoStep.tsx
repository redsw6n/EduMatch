import { Calendar } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { FormData } from '../../types/applicationTypes';

interface PersonalInfoStepProps {
  formData: FormData;
  updatePersonalInfo: (field: string, value: string) => void;
  onOpenDatePicker: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  updatePersonalInfo,
  onOpenDatePicker,
}) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Personal Info</Text>
      
      <View style={styles.formContent}>
        <View style={styles.formRow}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>
              First Name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={formData.personalInfo.firstName}
              onChangeText={(value) => updatePersonalInfo('firstName', value)}
              placeholder="Enter first name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>
              Last Name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={formData.personalInfo.lastName}
              onChangeText={(value) => updatePersonalInfo('lastName', value)}
              placeholder="Enter last name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Email Address <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={formData.personalInfo.email}
            onChangeText={(value) => updatePersonalInfo('email', value)}
            placeholder="Enter email address"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Phone Number <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={formData.personalInfo.phone}
            onChangeText={(value) => updatePersonalInfo('phone', value)}
            placeholder="Enter phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Date of Birth <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={onOpenDatePicker}
          >
            <Text style={[
              styles.datePickerText,
              !formData.personalInfo.dateOfBirth && styles.datePickerPlaceholder
            ]}>
              {formData.personalInfo.dateOfBirth || 'Select date of birth'}
            </Text>
            <Calendar size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Home Address <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.personalInfo.address}
            onChangeText={(value) => updatePersonalInfo('address', value)}
            placeholder="Enter your full address"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  formContent: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 14,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  textInput: {
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 16,
    color: colors.text,
  },
  datePickerPlaceholder: {
    color: colors.textSecondary,
  },
});