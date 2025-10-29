// Brand Colors (consistent across themes)
export const brandColors = {
  primaryBlue: '#2A71D0',    // Primary blue from logo
  primaryOrange: '#FFB800',  // Primary orange from logo  
  primaryGreen: '#2ECC71',   // Primary green from logo
  primaryDark: '#1E5BB8',
  secondary: '#5856D6',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  white: '#FFFFFF',
  black: '#000000',
};

// Light Theme Colors
export const lightColors = {
  // Brand Colors
  ...brandColors,
  primary: brandColors.primaryBlue, // Alias for primaryBlue
  
  // Background Colors
  background: '#F9FAFB',
  backgroundSecondary: '#F3F4F6',
  backgroundTertiary: '#FFFFFF',
  
  // Text Colors
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // UI Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  
  // Status Bar
  statusBar: 'dark-content' as const,
  
  // Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Dark Theme Colors
export const darkColors = {
  // Brand Colors (slightly adjusted for dark theme)
  ...brandColors,
  primary: brandColors.primaryBlue,
  primaryBlue: '#3B82F6', // Slightly brighter for dark theme
  primaryOrange: '#F59E0B', // Slightly adjusted
  primaryGreen: '#10B981', // Slightly adjusted
  
  // Background Colors
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',
  
  // Text Colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textInverse: '#111827',
  
  // UI Colors
  border: '#374151',
  borderLight: '#4B5563',
  surface: '#1F2937',
  surfaceSecondary: '#111827',
  
  // Status Bar
  statusBar: 'light-content' as const,
  
  // Gray Scale (inverted for dark theme)
  gray: {
    50: '#111827',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB',
  },
};

// Theme-aware color function
export const getColors = (isDarkMode: boolean) => {
  return isDarkMode ? darkColors : lightColors;
};

// Legacy export for backward compatibility
export const colors = lightColors;
