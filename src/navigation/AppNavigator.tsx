import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useThemedColors } from '../hooks/useThemedColors';
import AIChatbotScreen from '../screens/AIChatbotScreen';
import ApplicationTimelineScreen from '../screens/ApplicationTimelineScreen';
import ApplyScreen from '../screens/ApplyScreen';
import CareerGuidanceScreen from '../screens/CareerGuidanceScreen';
import ConversationsListScreen from '../screens/ConversationsListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import SchoolProfileScreen from '../screens/SchoolProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SplashScreen } from '../screens/SplashScreen';
import SupportScreen from '../screens/SupportScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  UpdatePassword: {
    token?: string;
  };
  PrivacyPolicy: {
    onAgree?: () => void;
  };
  Home: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  ConversationsList: undefined;
  Messages: {
    schoolData?: {
      id: string;
      name: string;
      location: string;
    };
  };
  SchoolProfile: {
    schoolId?: string;
    schoolData?: any;
  };
  Apply: {
    schoolData?: any;
  };
  ApplicationTimeline: {
    applicationData?: any;
  };
  CareerGuidance: undefined;
  Support: undefined;
  AIChatbot: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const themeColors = useThemedColors();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: themeColors.background,
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: 'Sign In',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: 'Sign Up',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            title: 'Forgot Password',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePasswordScreen}
          options={{
            title: 'Update Password',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{
            title: 'Privacy Policy',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SchoolProfile"
          component={SchoolProfileScreen}
          options={{
            title: 'University Profile',
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Apply"
          component={ApplyScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ApplicationTimeline"
          component={ApplicationTimelineScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="CareerGuidance"
          component={CareerGuidanceScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{
            title: 'Support',
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ConversationsList"
          component={ConversationsListScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="AIChatbot"
          component={AIChatbotScreen}
          options={{
            headerShown: false,
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
