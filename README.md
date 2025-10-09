# EduMatch - Learning Community App

A complete React Native app built with Expo that connects students and facilitates collaborative learning.

## Features

- **Onboarding Flow**: Swipeable introduction screens with pagination
- **Authentication**: Mock sign up and sign in functionality
- **Persistent Sessions**: User sessions persist across app restarts
- **Modern UI**: Clean, mobile-first design with TypeScript support
- **Navigation**: Smooth navigation flow with React Navigation

## Tech Stack

- **Framework**: Expo & React Native
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage for persistence
- **UI**: Custom components with modern design
- **Animation**: React Native Reanimated

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edumatch_user
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo dependencies**
   ```bash
   npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Project Structure

```
├── App.tsx                          # Main app entry point
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── OnboardingSlide.tsx     # Onboarding slide component
│   │   ├── PrimaryButton.tsx       # Primary button component
│   │   └── TextField.tsx           # Text input component
│   ├── context/                    # React Context providers
│   │   └── AuthContext.tsx         # Authentication context
│   ├── navigation/                 # Navigation configuration
│   │   └── AppNavigator.tsx        # Main navigator
│   ├── screens/                    # App screens
│   │   ├── SplashScreen.tsx        # Initial loading screen
│   │   ├── OnboardingScreen.tsx    # Onboarding flow
│   │   ├── SignInScreen.tsx        # Sign in screen
│   │   ├── SignUpScreen.tsx        # Sign up screen
│   │   └── DashboardScreen.tsx     # Main dashboard
│   └── theme/                      # Design system
│       ├── colors.ts               # Color palette
│       └── typography.ts           # Typography system
├── babel.config.js                 # Babel configuration
└── package.json                    # Project dependencies
```

## App Flow

1. **Splash Screen**: Checks onboarding status and authentication
2. **Onboarding**: 3-slide introduction (first-time users only)
3. **Authentication**: Sign up or sign in forms with validation
4. **Dashboard**: Welcome screen with sign out functionality

### Navigation Rules

- First launch → Onboarding → Sign Up
- Returning user (no auth) → Sign In
- Authenticated user → Dashboard
- Sign out → Sign In

## Key Features

### Authentication (Mock)
- Client-side validation only
- 800ms simulated API delay
- Persistent sessions via AsyncStorage
- Form validation with error messages

### Onboarding
- Horizontal swipeable slides
- Pagination indicators
- Sets onboarding completion flag

### UI Components
- **PrimaryButton**: Loading states, variants, accessibility
- **TextField**: Validation, secure entry, focus states
- **OnboardingSlide**: Illustration, title, description

### Accessibility
- Screen reader support
- Semantic labels
- Keyboard navigation
- Focus management

## Development

### Running the App

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on web
npx expo start --web
```

### Build for Production

```bash
# Create production build
npx expo build

# Or use EAS Build (recommended)
npx eas build --platform all
```

## Important Notes

- **Mock Authentication**: All authentication is simulated - no backend required
- **AsyncStorage Keys**: 
  - `@auth_token`: User authentication token
  - `@has_onboarded`: Onboarding completion flag
- **Navigation**: Uses stack navigation with gesture controls disabled where appropriate
- **Keyboard Handling**: KeyboardAvoidingView implemented for form screens

## Future Enhancements

This app is designed to be easily extended with:
- Real backend authentication
- User profiles and settings
- Study group functionality  
- Chat and messaging
- Push notifications
- Social features

## Troubleshooting

If you encounter issues:

1. **Clear Metro cache**: `npx expo start --clear`
2. **Reset AsyncStorage**: Delete and reinstall the app
3. **Check dependencies**: Ensure all packages are properly installed
4. **Expo compatibility**: Verify Expo SDK version matches dependencies

## License

This project is for educational purposes and can be used as a starting point for learning apps.