import { useState } from 'react';
import { Alert } from 'react-native';
import { DocumentUpload, FormData } from '../types/applicationTypes';
import { formatDate, validateCurrentStep } from '../utils/applicationUtils';

interface UseApplicationFormProps {
  schoolData?: any;
  navigation: any;
}

export const useApplicationForm = ({ schoolData, navigation }: UseApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
    },
    documents: {
      birthCertificate: { uploaded: false },
      transcript: { uploaded: false },
      studentId: { uploaded: false },
    },
    programChoice: {
      firstChoice: '',
      secondChoice: '',
      preferredCampus: '',
      academicGoals: '',
    },
  });

  // Extract programs from school data
  const availablePrograms = schoolData?.programCategories 
    ? schoolData.programCategories.flatMap((category: any) => 
        category.programs.map((program: any) => program.name)
      )
    : ['Computer Science', 'Business Administration', 'Engineering', 'Medicine', 'Liberal Arts'];

  // Campus options based on school location
  const campusOptions = schoolData?.location 
    ? [`Main Campus (${schoolData.location})`]
    : ['Main Campus'];

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateProgramChoice = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      programChoice: {
        ...prev.programChoice,
        [field]: value,
      },
    }));
  };

  const updateDocument = (documentType: keyof FormData['documents'], document: DocumentUpload) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: document,
      },
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updatePersonalInfo('dateOfBirth', formatDate(date));
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    if (formData.personalInfo.dateOfBirth) {
      const [month, day, year] = formData.personalInfo.dateOfBirth.split('/');
      if (month && day && year) {
        setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }
    }
    setShowDatePicker(true);
  };

  const handleNext = () => {
    if (!validateCurrentStep(currentStep, formData)) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate submission process
    setTimeout(() => {
      setIsLoading(false);
      
      const applicationData = {
        personalInfo: formData.personalInfo,
        documents: {
          birthCertificate: formData.documents.birthCertificate.uploaded,
          transcript: formData.documents.transcript.uploaded,
          studentId: formData.documents.studentId.uploaded,
        },
        programChoice: formData.programChoice,
        school: schoolData?.name || 'Selected School',
        submittedAt: new Date().toISOString(),
      };
      
      console.log('Application submitted:', applicationData);
      
      Alert.alert(
        'Application Submitted!',
        `Your application to ${schoolData?.name || 'the selected school'} has been submitted successfully. You will receive a confirmation email shortly.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  return {
    // State
    currentStep,
    isLoading,
    showDatePicker,
    selectedDate,
    formData,
    availablePrograms,
    campusOptions,
    
    // Actions
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
  };
};