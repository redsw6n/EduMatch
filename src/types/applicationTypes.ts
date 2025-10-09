export interface DocumentUpload {
  uploaded: boolean;
  fileName?: string;
  uri?: string;
  size?: number;
  mimeType?: string;
}

export interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  documents: {
    birthCertificate: DocumentUpload;
    transcript: DocumentUpload;
    studentId: DocumentUpload;
  };
  programChoice: {
    firstChoice: string;
    secondChoice: string;
    preferredCampus: string;
    academicGoals?: string;
  };
}

export interface ApplyScreenProps {
  navigation: any;
  route: any;
}

export interface Step {
  id: number;
  title: string;
  icon: any;
}