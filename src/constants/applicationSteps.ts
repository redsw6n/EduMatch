import { CheckCircle, FileText, GraduationCap, User } from 'lucide-react-native';
import { Step } from '../types/applicationTypes';

export const STEPS: Step[] = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Program Choice', icon: GraduationCap },
  { id: 4, title: 'Submit', icon: CheckCircle },
];

export const TOTAL_STEPS = STEPS.length;