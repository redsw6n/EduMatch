import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedStatusBar } from './src/components/ThemedStatusBar';
import { ApplicationsProvider } from './src/context/ApplicationsContext';
import { AuthProvider } from './src/context/AuthContext';
import { ConversationsProvider } from './src/context/ConversationsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { ProfileCompletionProvider } from './src/context/ProfileCompletionContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <ProfileCompletionProvider>
            <FavoritesProvider>
              <ApplicationsProvider>
                <NotificationsProvider>
                  <ConversationsProvider>
                    <ThemedStatusBar />
                    <AppNavigator />
                  </ConversationsProvider>
                </NotificationsProvider>
              </ApplicationsProvider>
            </FavoritesProvider>
          </ProfileCompletionProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
