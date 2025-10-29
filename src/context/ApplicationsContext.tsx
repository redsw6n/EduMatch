import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Application {
  id: string;
  universityName: string;
  program: string;
  logo: string;
  status: 'submitted' | 'in-review' | 'accepted' | 'rejected';
  deadline: string;
  submittedDate: string;
  campus?: string;
  startTerm?: string;
}

interface ApplicationsContextType {
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'submittedDate' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  getApplicationById: (id: string) => Application | undefined;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};

interface ApplicationsProviderProps {
  children: ReactNode;
}

export const ApplicationsProvider: React.FC<ApplicationsProviderProps> = ({ children }) => {
  // Initial mock data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      universityName: 'Southwestern University',
      program: 'Computer Science',
      logo: 'https://placehold.co/64x64',
      status: 'submitted',
      deadline: '2/1/2024',
      submittedDate: 'October 10, 2025',
      campus: 'Main Campus',
      startTerm: 'A.Y 2024-2025',
    },
    {
      id: '2',
      universityName: 'University of Cebu',
      program: 'Electrical Engineering',
      logo: 'https://placehold.co/64x64',
      status: 'in-review',
      deadline: '1/31/2024',
      submittedDate: 'October 10, 2025',
      campus: 'Main Campus',
      startTerm: 'A.Y 2024-2025',
    },
    {
      id: '3',
      universityName: 'University of San Carlos',
      program: 'Business Administration',
      logo: 'https://placehold.co/64x64',
      status: 'accepted',
      deadline: '1/25/2024',
      submittedDate: 'October 10, 2025',
      campus: 'Main Campus',
      startTerm: 'A.Y 2024-2025',
    },
    {
      id: '4',
      universityName: 'University of Visayas',
      program: 'Computer Science',
      logo: 'https://placehold.co/51x64',
      status: 'submitted',
      deadline: '2/15/2024',
      submittedDate: 'October 10, 2025',
      campus: 'Main Campus',
      startTerm: 'A.Y 2024-2025',
    },
  ]);

  const addApplication = (newApplication: Omit<Application, 'id' | 'submittedDate' | 'status'>) => {
    const currentDate = new Date();
    const formattedDate = `${(currentDate.getMonth() + 1)}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    
    const application: Application = {
      ...newApplication,
      id: (applications.length + 1).toString(),
      submittedDate: formattedDate,
      status: 'submitted',
      campus: newApplication.campus || 'Main Campus',
      startTerm: newApplication.startTerm || 'A.Y 2024-2025',
    };

    setApplications(prev => [...prev, application]);
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const getApplicationById = (id: string): Application | undefined => {
    return applications.find(app => app.id === id);
  };

  return (
    <ApplicationsContext.Provider 
      value={{ 
        applications, 
        addApplication, 
        updateApplicationStatus, 
        getApplicationById 
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};