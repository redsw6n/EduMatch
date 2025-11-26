// Chatbot knowledge base for specialized responses

export interface ProgramInfo {
  name: string;
  duration: string;
  degree: string;
  category: string;
}

export interface SchoolData {
  name: string;
  totalStudents: string;
  campuses: string[];
  acceptanceRate: string;
  establishedYear: string;
  type: string;
  address: string;
}

// Complete program listings organized by category
export const AVAILABLE_PROGRAMS: ProgramInfo[] = [
  // IT & Engineering
  { name: 'Information Technology', duration: '4 years', degree: 'Bachelor of Science', category: 'IT & Engineering' },
  { name: 'Architecture', duration: '5 years', degree: 'Bachelor of Science', category: 'IT & Engineering' },
  { name: 'Communication', duration: '4 years', degree: 'Bachelor of Arts', category: 'IT & Engineering' },

  // Health & Allied Sciences
  { name: 'Nursing', duration: '4 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },
  { name: 'Medical Technology', duration: '4 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },
  { name: 'Pharmacy', duration: '4 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },
  { name: 'Radiologic Technology', duration: '4 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },
  { name: 'Optometry', duration: '5 years', degree: 'Doctor of Optometry', category: 'Health & Allied Sciences' },
  { name: 'Physical Therapy', duration: '5 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },
  { name: 'Occupational Therapy', duration: '5 years', degree: 'Bachelor of Science', category: 'Health & Allied Sciences' },

  // Specialized Health
  { name: 'Dental Medicine', duration: '6 years', degree: 'Doctor of Dental Medicine', category: 'Specialized Health' },
  { name: 'Veterinary Medicine', duration: '6 years', degree: 'Doctor of Veterinary Medicine', category: 'Specialized Health' },

  // Business
  { name: 'Business Administration - Marketing Management', duration: '4 years', degree: 'Bachelor of Science', category: 'Business' },
  { name: 'Business Administration - Financial Management', duration: '4 years', degree: 'Bachelor of Science', category: 'Business' },
  { name: 'Accountancy', duration: '4 years', degree: 'Bachelor of Science', category: 'Business' },
  { name: 'Hotel and Restaurant Management', duration: '4 years', degree: 'Bachelor of Science', category: 'Business' },

  // Arts & Sciences
  { name: 'Fine Arts with Focus on Animation and Visual Communication', duration: '4 years', degree: 'Bachelor of Arts', category: 'Arts & Sciences' },
  { name: 'Psychology', duration: '4 years', degree: 'Bachelor of Science', category: 'Arts & Sciences' },
  { name: 'Biology', duration: '4 years', degree: 'Bachelor of Science', category: 'Arts & Sciences' },
];

// Application requirements data
export const APPLICATION_REQUIREMENTS = {
  documents: [
    { name: 'Birth Certificate', description: 'NSO/PSA certified copy required' },
    { name: 'Official Transcript of Records', description: 'Must include all grades and be authenticated' },
    { name: 'Student ID or School Certificate', description: 'Valid identification from previous school' }
  ],
  personalInfo: [
    'Complete personal details (name, contact information, address)',
    'Program selection (1st and 2nd choice)',
    'Campus preference',
    'Academic goals statement (up to 500 characters)'
  ],
  process: [
    'Submit online application through EduMatch',
    'Upload all required documents',
    'Pay application fee (if applicable)',
    'Wait for admission committee review',
    'Receive notification of application status'
  ],
  deadlines: [
    'Applications typically close 2-3 months before semester start',
    'Early application is recommended',
    'Check specific program deadlines as they may vary'
  ]
};

// School population and demographic data
export const SCHOOL_POPULATION: SchoolData = {
  name: 'Southwestern University PHINMA',
  totalStudents: '18,000+',
  campuses: ['Urgello Campus (Cebu)', 'Tabunok Campus (Cebu)', 'Dumaguete Campus', 'Ormoc Campus', 'Lipa Campus'],
  acceptanceRate: '15%',
  establishedYear: '1946',
  type: 'Private University',
  address: 'Villa Aznar, Urgello Street, Cebu City, Philippines'
};

// Quick facts about class sizes and student life
export const STUDENT_LIFE_INFO = {
  classSize: '25-40 students per class on average',
  studentToFacultyRatio: '18:1',
  campusLife: [
    'Active student organizations and clubs',
    'Sports and recreational facilities',
    'Cultural and academic events',
    'Student government participation',
    'Community service programs'
  ],
  support: [
    'Academic counseling services',
    'Career guidance and placement',
    'Student wellness programs',
    'Library and research facilities',
    'Modern laboratories and equipment'
  ]
};

// Program categories for easy filtering
export const PROGRAM_CATEGORIES = {
  'IT & Engineering': ['Information Technology', 'Architecture', 'Communication'],
  'Health & Allied Sciences': ['Nursing', 'Medical Technology', 'Pharmacy', 'Radiologic Technology', 'Optometry', 'Physical Therapy', 'Occupational Therapy'],
  'Specialized Health': ['Dental Medicine', 'Veterinary Medicine'],
  'Business': ['Business Administration - Marketing Management', 'Business Administration - Financial Management', 'Accountancy', 'Hotel and Restaurant Management'],
  'Arts & Sciences': ['Fine Arts with Focus on Animation and Visual Communication', 'Psychology', 'Biology']
};

// Function to get programs by category
export const getProgramsByCategory = (category: string): ProgramInfo[] => {
  return AVAILABLE_PROGRAMS.filter(program => program.category === category);
};

// Function to search programs by name
export const searchPrograms = (query: string): ProgramInfo[] => {
  const lowerQuery = query.toLowerCase();
  return AVAILABLE_PROGRAMS.filter(program => 
    program.name.toLowerCase().includes(lowerQuery) ||
    program.category.toLowerCase().includes(lowerQuery)
  );
};

// Function to get formatted program list text
export const getFormattedProgramsList = (): string => {
  const categories = Object.keys(PROGRAM_CATEGORIES);
  let response = '🎓 **Available Programs at Southwestern University PHINMA:**\n\n';
  
  categories.forEach(category => {
    const programs = getProgramsByCategory(category);
    const icon = getCategoryIcon(category);
    
    response += `**${icon} ${category}:**\n`;
    programs.forEach(program => {
      response += `• ${program.name} (${program.duration})\n`;
    });
    response += '\n';
  });
  
  response += 'All programs lead to recognized degrees. Would you like details about a specific program?';
  return response;
};

// Helper function to get category icons
const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    'IT & Engineering': '💻',
    'Health & Allied Sciences': '🏥',
    'Specialized Health': '🦷',
    'Business': '💼',
    'Arts & Sciences': '🎨'
  };
  return icons[category] || '📚';
};