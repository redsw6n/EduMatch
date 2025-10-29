import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';

/**
 * Hook that provides theme-aware colors and theme state
 * Use this hook instead of importing colors directly for theme support
 */
export const useThemedColors = () => {
  const { isDarkMode } = useTheme();
  return getColors(isDarkMode);
};

/**
 * Hook that provides both theme state and colors
 * One-stop hook for all theme-related needs
 */
export const useAppTheme = () => {
  const theme = useTheme();
  const colors = useThemedColors();
  
  return {
    ...theme,
    colors,
  };
};