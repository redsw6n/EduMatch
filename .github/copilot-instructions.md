# EduMatch Copilot Instructions

## Project Overview
EduMatch is a React Native learning community app built with Expo, featuring dual navigation systems and mock authentication. The app focuses on onboarding flows, user authentication, and educational content discovery.

## Architecture & Navigation Systems

### Dual Navigation Setup
This project contains **two separate navigation systems**:
- **Primary**: React Navigation stack in `src/` (AuthContext-driven flow: Splash → Onboarding → Auth → Dashboard)
- **Secondary**: Expo Router in `app/` (tab-based layout with Home/Explore)

When working on features, identify which system is relevant. The `src/` system handles authentication flow, while `app/` handles content browsing.

### Authentication Flow Pattern
```
SplashScreen → hydrateFromStorage() → 
├── !hasOnboarded → OnboardingScreen → setOnboardingCompleted() → SignUpScreen
├── hasOnboarded && !authToken → SignInScreen  
└── hasOnboarded && authToken → DashboardScreen
```

**Critical AsyncStorage Keys:**
- `@auth_token`: User session persistence
- `@has_onboarded`: First-time user detection

## Development Patterns

### Context Architecture
All contexts are co-located in `src/context/` with hook exports:
```tsx
// Pattern: Export both provider and hook
export const AuthProvider = ({ children }) => { /* ... */ };
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Component Patterns
- **Loading States**: All async operations use `isLoading` state with ActivityIndicator
- **Form Validation**: Real-time validation with error state objects: `{ email?: string; password?: string }`
- **Accessibility**: Every interactive component requires `accessibilityLabel` and `accessibilityRole`

### Screen Navigation Conventions
```tsx
// Navigation reset for auth flows (prevents back navigation)
navigation.reset({
  index: 0,
  routes: [{ name: 'Dashboard' }],
});

// Disable gestures for critical flows
gestureEnabled: false,
headerBackVisible: false,
```

## Key Commands & Workflows

### Development Server
```bash
npx expo start              # Main development command
npx expo start --clear      # Clear Metro cache (first troubleshooting step)
```

### Platform-Specific Testing
```bash
npx expo start --ios        # iOS simulator
npx expo start --android    # Android emulator  
npx expo start --web        # Web browser
```

### Storage Debugging
Use `clearAppStorage()` from AuthContext to reset app state during development. It's already imported and available in SplashScreen.

## Theme & Styling Conventions

### Design System
- **Colors**: Centralized in `src/theme/colors.ts` with semantic naming (`primary`, `error`, `textSecondary`)
- **Typography**: System in `src/theme/typography.ts` 
- **Path Aliases**: Use `@/` imports configured in tsconfig.json

### Component Styling Pattern
```tsx
// Consistent style object pattern
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Responsive padding/margins using percentages
});
```

## Critical Integration Points

### AsyncStorage Persistence
Mock authentication with 800ms delay simulates real API calls. All auth state persists through AsyncStorage with proper error handling.

### Form Components Pattern
- **TextField**: Supports floating labels, validation states, secure entry with toggle visibility
- **PrimaryButton**: Loading states, variants (primary/secondary), accessibility
- Both use theme colors and handle focus/blur states
- **Validation**: Real-time validation with immediate error display

### Component State Management
```tsx
// Focus state pattern for form inputs
const [isFocused, setIsFocused] = useState(false);
const [showPassword, setShowPassword] = useState(false);

// Error state objects for form validation
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
```

### Onboarding System
Flexible slide system with FlatList horizontal scrolling:
- Custom slide data with `backgroundColor`, `titleColor`, `descriptionColor` properties
- Pagination dots with active state indicators
- Skip button and contextual "Next"/"Get Started" buttons
- See `ONBOARDING_INTEGRATION_GUIDE.md` for Figma integration patterns

### Animation Patterns
```tsx
// Splash screen fade/scale animation pattern
const fadeAnim = useRef(new Animated.Value(0)).current;
const scaleAnim = useRef(new Animated.Value(0.8)).current;

Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 800,
    useNativeDriver: true,
  }),
  // Additional animations...
]).start();
```

## Platform Considerations

### React Native Specific
- Always wrap root with `GestureHandlerRootView`
- Use `KeyboardAvoidingView` for forms with `Platform.OS` checks
- SafeAreaView for proper device edge handling

### TypeScript Patterns
Strong typing throughout with navigation param lists:
```tsx
export type RootStackParamList = {
  Splash: undefined;
  Dashboard: undefined;
  // Undefined for screens without params
};
```

### Error Handling Conventions
```tsx
// Consistent async error handling with user feedback
try {
  await signIn(email.trim(), password);
  navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
} catch (error) {
  Alert.alert('Sign In Failed', 'Please check your credentials and try again.');
}
```

## Project Configuration

### Expo Configuration
- **App**: Portrait orientation, light UI style
- **Icons**: Adaptive icons for Android, standard for iOS
- **Splash**: White background with center icon
- **Platform Support**: iOS (tablet), Android, Web

### ESLint & Code Style
- Uses `eslint-config-expo/flat` configuration
- TypeScript strict mode enabled
- Path aliases configured for clean imports (`@/components/*`, `@/screens/*`)

### Build System
```bash
# Development builds
npx expo start --clear              # Clear cache first
npx expo start --ios               # iOS simulator
npx expo start --android           # Android emulator

# Production preparation
npx expo install                    # Ensure compatible versions
npx eas build --platform all       # EAS Build (recommended)
```

## Common Troubleshooting

### Development Issues
1. **Metro cache**: `npx expo start --clear`
2. **AsyncStorage debugging**: Use `clearAppStorage()` helper
3. **Navigation issues**: Check gesture/back button disabled states
4. **Context errors**: Verify component is wrapped in appropriate Provider

### Form & Input Issues
- **Floating labels**: Use `isFocused || value.length > 0` for label positioning
- **Password visibility**: Toggle with `secureTextEntry && !isPasswordVisible`
- **Validation timing**: Validate on form submission, show errors immediately

### Build & Dependencies
- Expo SDK 54 with React Native 0.81.4
- Key deps: React Navigation v7, AsyncStorage, Reanimated, Gesture Handler
- Use `npx expo install` for Expo-compatible versions

### Performance Considerations
- **FlatList**: Used for onboarding slides with `horizontal` scrolling
- **Animation**: Native driver enabled for smooth performance
- **Image loading**: Require statements for bundled assets
- **AsyncStorage**: Batched operations with `Promise.all()` for storage reads