import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { FormData } from '../../types/applicationTypes';

interface ProgramChoiceStepProps {
  formData: FormData;
  updateProgramChoice: (field: string, value: string) => void;
  availablePrograms: string[];
  campusOptions: string[];
  schoolName?: string;
}

export const ProgramChoiceStep: React.FC<ProgramChoiceStepProps> = ({
  formData,
  updateProgramChoice,
  availablePrograms,
  campusOptions,
  schoolName,
}) => {
  const [showFirstChoiceDropdown, setShowFirstChoiceDropdown] = useState(false);
  const [showSecondChoiceDropdown, setShowSecondChoiceDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    showDropdown: boolean,
    setShowDropdown: (show: boolean) => void,
    placeholder: string,
    isRequired: boolean = true
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(!showDropdown)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownButtonText,
          !value && styles.dropdownPlaceholder
        ]}>
          {value || placeholder}
        </Text>
        <ChevronDown 
          size={16} 
          color={colors.textSecondary}
          style={[
            styles.dropdownIcon,
            showDropdown && styles.dropdownIconRotated
          ]}
        />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  value === option && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  onSelect(option);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  value === option && styles.dropdownItemTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.programFormContainer}>
      <Text style={styles.programFormTitle}>Program Selection</Text>
      
      <View style={styles.programFormContent}>
        <Text style={styles.programFormSubtitle}>
          Choose your preferred academic programs from {schoolName || 'our available offerings'}
        </Text>

        {renderDropdown(
          'First Choice Program',
          formData.programChoice.firstChoice,
          availablePrograms,
          (value) => updateProgramChoice('firstChoice', value),
          showFirstChoiceDropdown,
          setShowFirstChoiceDropdown,
          'Select your primary program of interest'
        )}

        {renderDropdown(
          'Second Choice Program',
          formData.programChoice.secondChoice,
          availablePrograms.filter((program: string) => program !== formData.programChoice.firstChoice),
          (value) => updateProgramChoice('secondChoice', value),
          showSecondChoiceDropdown,
          setShowSecondChoiceDropdown,
          'Select your alternative program'
        )}

        {renderDropdown(
          'Preferred Campus',
          formData.programChoice.preferredCampus,
          campusOptions,
          (value) => updateProgramChoice('preferredCampus', value),
          showCampusDropdown,
          setShowCampusDropdown,
          'Select your preferred campus location',
          false // Optional field
        )}

        <View style={styles.programInfoSection}>
          <Text style={styles.programInfoTitle}>Why are you interested in these programs?</Text>
          <TextInput
            style={styles.programInfoTextArea}
            value={formData.programChoice.academicGoals || ''}
            onChangeText={(value) => updateProgramChoice('academicGoals', value)}
            placeholder="Tell us about your academic goals and why you chose these programs..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {(formData.programChoice.academicGoals || '').length}/500 characters
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  programFormContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
  },
  programFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  programFormContent: {
    gap: 20,
  },
  programFormSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
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
  dropdownButton: {
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  dropdownIcon: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  dropdownItemSelected: {
    backgroundColor: colors.primary,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownItemTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  programInfoSection: {
    marginTop: 8,
  },
  programInfoTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 14,
  },
  programInfoTextArea: {
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
});