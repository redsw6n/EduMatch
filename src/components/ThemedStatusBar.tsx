import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemedStatusBar: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <StatusBar style={isDarkMode ? 'light' : 'dark'} />
  );
};