import { FormData } from '../types/applicationTypes';

export const validateCurrentStep = (currentStep: number, formData: FormData): boolean => {
  switch (currentStep) {
    case 1:
      const { firstName, lastName, email, phone, dateOfBirth } = formData.personalInfo;
      return !!(firstName.trim() && lastName.trim() && email.trim() && phone.trim() && dateOfBirth.trim());
    case 2:
      const { birthCertificate, transcript, studentId } = formData.documents;
      return birthCertificate.uploaded && transcript.uploaded && studentId.uploaded;
    case 3:
      const { firstChoice, secondChoice } = formData.programChoice;
      return !!(firstChoice && secondChoice);
    default:
      return true;
  }
};

export const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};