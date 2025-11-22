import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocumentStep } from '../components/application/DocumentStep';
import { PersonalInfoStep } from '../components/application/PersonalInfoStep';
import { ProgramChoiceStep } from '../components/application/ProgramChoiceStep';
import { ReviewStep } from '../components/application/ReviewStep';
import { STEPS, TOTAL_STEPS } from '../constants/applicationSteps';
import { useApplicationForm } from '../hooks/useApplicationForm';
import { useThemedColors } from '../hooks/useThemedColors';
import { ApplyScreenProps } from '../types/applicationTypes';

const ApplyScreen: React.FC<ApplyScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const { schoolData } = route.params || {};
  
  const {
    currentStep,
    isLoading,
    showDatePicker,
    selectedDate,
    formData,
    availablePrograms,
    campusOptions,
    setShowDatePicker,
    setSelectedDate,
    updatePersonalInfo,
    updateProgramChoice,
    updateDocument,
    handleDateSelect,
    openDatePicker,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useApplicationForm({ schoolData, navigation });

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={16} color={colors.textInverse} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Application Form</Text>
    </View>
  );

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>Step {currentStep} of {TOTAL_STEPS}</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / TOTAL_STEPS) * 100}%` }]} />
      </View>

      <View style={styles.stepsContainer}>
        {STEPS.map((step) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <View key={step.id} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}>
                <IconComponent 
                  size={20} 
                  color={isActive || isCompleted ? colors.textInverse : colors.textSecondary} 
                />
              </View>
              <Text style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
              ]}>
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderDatePicker = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity onPress={() => handleDateSelect(selectedDate)}>
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      selectedDate.getMonth() === index && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), index, selectedDate.getDate()))}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedDate.getMonth() === index && styles.pickerItemTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {days.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      selectedDate.getDate() === day && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedDate.getDate() === day && styles.pickerItemTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      selectedDate.getFullYear() === year && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedDate(new Date(year, selectedDate.getMonth(), selectedDate.getDate()))}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedDate.getFullYear() === year && styles.pickerItemTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            updatePersonalInfo={updatePersonalInfo}
            onOpenDatePicker={openDatePicker}
          />
        );
      case 2:
        return (
          <DocumentStep
            formData={formData}
            updateDocument={updateDocument}
          />
        );
      case 3:
        return (
          <ProgramChoiceStep
            formData={formData}
            updateProgramChoice={updateProgramChoice}
            availablePrograms={availablePrograms}
            campusOptions={campusOptions}
            schoolName={schoolData?.name}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            schoolData={schoolData}
          />
        );
      default:
        return null;
    }
  };

  const renderBottomButtons = () => (
    <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
      <TouchableOpacity
        style={[styles.bottomButton, styles.previousButton, currentStep === 1 && styles.disabledButton]}
        onPress={handlePrevious}
        disabled={currentStep === 1}
      >
        <ChevronLeft size={16} color={currentStep === 1 ? colors.textSecondary : colors.text} />
        <Text style={[styles.bottomButtonText, styles.previousButtonText, currentStep === 1 && styles.disabledButtonText]}>
          PREVIOUS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.bottomButton, 
          currentStep === 4 ? styles.submitButton : styles.nextButton,
          isLoading && styles.disabledButton
        ]}
        onPress={currentStep === 4 ? handleSubmit : handleNext}
        disabled={isLoading}
      >
        <Text style={[styles.bottomButtonText, styles.nextButtonText]}>
          {isLoading && currentStep === 4 ? 'SUBMITTING...' : 
           currentStep === 4 ? 'SUBMIT APPLICATION' : 'NEXT'}
        </Text>
        {currentStep !== 4 && <ChevronRight size={16} color={colors.textInverse} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      {renderProgressIndicator()}
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>
      
      {renderBottomButtons()}
      {renderDatePicker()}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 68,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  progressContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(42, 113, 208, 0.20)',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomButton: {
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  previousButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 128,
  },
  nextButton: {
    backgroundColor: colors.primary,
    minWidth: 91,
  },
  submitButton: {
    backgroundColor: colors.success,
    minWidth: 189,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.35,
    lineHeight: 20,
  },
  previousButtonText: {
    color: colors.text,
  },
  nextButtonText: {
    color: colors.textInverse,
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
  // Date picker modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalDoneText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: 250,
    paddingHorizontal: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary,
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerItemTextSelected: {
    color: colors.textInverse,
    fontWeight: '600',
  },
});

export default ApplyScreen;