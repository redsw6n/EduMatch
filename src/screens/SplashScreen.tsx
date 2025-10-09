import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAppStorage, useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { hydrateFromStorage } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start the animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for animation to complete (800ms) plus additional delay
        await new Promise(resolve => setTimeout(resolve, 1400));
        
        // TEMPORARY: Uncomment the line below to reset app (remove after testing)
        await clearAppStorage();
        
        const { hasOnboarded, authToken } = await hydrateFromStorage();

        if (!hasOnboarded) {
          navigation.replace('Onboarding');
        } else if (authToken) {
          navigation.replace('Home');
        } else {
          navigation.replace('SignIn');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        // Fallback to sign in screen
        navigation.replace('SignIn');
      }
    };

    initializeApp();
  }, [navigation, hydrateFromStorage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image 
            source={require('../../assets/images/splash-icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
