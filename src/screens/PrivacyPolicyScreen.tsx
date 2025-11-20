import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedColors } from '../hooks/useThemedColors';

interface PrivacyPolicyScreenProps {
  navigation: any;
  route?: {
    params?: {
      onAgree?: () => void;
    };
  };
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const { onAgree } = route?.params || {};
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const thumbPosition = useRef(new Animated.Value(0)).current;

  // Hide navigation header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Handle scroll position changes
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const maxScrollY = contentSize.height - layoutMeasurement.height;
    
    setScrollPosition(scrollY);
    setContentHeight(contentSize.height);
    setScrollViewHeight(layoutMeasurement.height);

    // Update thumb position
    if (maxScrollY > 0) {
      const thumbY = (scrollY / maxScrollY) * (532 - 112.38); // Track height - thumb height
      Animated.timing(thumbPosition, {
        toValue: thumbY,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  // Pan responder for scrollbar thumb
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const trackHeight = 532 - 112.38; // Available track space
      const newThumbY = Math.max(0, Math.min(trackHeight, gestureState.dy + scrollPosition / (contentHeight - scrollViewHeight) * trackHeight));
      
      thumbPosition.setValue(newThumbY);
      
      // Calculate corresponding scroll position
      const scrollRatio = newThumbY / trackHeight;
      const newScrollY = scrollRatio * (contentHeight - scrollViewHeight);
      
      scrollViewRef.current?.scrollTo({
        y: newScrollY,
        animated: false,
      });
    },
  });

  const handleAgree = () => {
    if (onAgree) {
      onAgree(); // Call the callback to check the checkbox
    }
    navigation.goBack(); // Go back to SignUp screen
  };

  return (
    <View style={styles.container}>
      {/* Dark background */}
      <View style={styles.darkBackground} />
      
      {/* Back button */}
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 14 }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <ChevronLeft size={24} color={colors.textInverse} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Privacy Policy</Text>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Scrollbar */}
        <View style={styles.scrollbarTrack}>
          <Animated.View 
            style={[
              styles.scrollbarThumb,
              {
                transform: [{ translateY: thumbPosition }]
              }
            ]}
            {...panResponder.panHandlers}
          />
        </View>

        {/* Content sections */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width, height) => setContentHeight(height)}
          onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
        >
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Data Collection</Text>
            <Text style={styles.sectionContent}>
              We collect information you provide directly to us, such as when you create an account, 
              fill out a form, or contact us. This may include your name, email address, and other 
              personal information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Information Usage</Text>
            <Text style={styles.sectionContent}>
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, send communications, and comply with legal obligations.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Data Protection</Text>
            <Text style={styles.sectionContent}>
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Third Party Services</Text>
            <Text style={styles.sectionContent}>
              We may use third-party services that collect, monitor and analyze user data 
              to improve our service quality and user experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Contact Information</Text>
            <Text style={styles.sectionContent}>
              If you have any questions about this Privacy Policy, please contact us through 
              our support channels or email us directly.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Agree Button */}
      <TouchableOpacity
        style={styles.agreeButton}
        onPress={handleAgree}
        accessibilityLabel="Agree to privacy policy"
        accessibilityRole="button"
      >
        <Text style={styles.agreeButtonText}>Agree</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkBackground: {
    position: 'absolute',
    width: 390,
    height: 844,
    left: 0,
    top: 0,
    backgroundColor: colors.backgroundSecondary,
  },
  backButton: {
    position: 'absolute',
    left: 23,
    width: 52,
    height: 52,
    backgroundColor: 'rgba(217, 217, 217, 0.20)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    width: 304,
    height: 50.54,
    left: 43,
    top: 108,
    textAlign: 'center',
    color: colors.textInverse,
    fontSize: 40,
    fontFamily: 'Inter',
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    left: 25,
    top: 180,
    width: 340,
    height: 556,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  scrollbarTrack: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 6,
    height: 532,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  scrollbarThumb: {
    width: 6,
    height: 112.38,
    backgroundColor: colors.textSecondary,
    borderRadius: 4,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
  },
  agreeButton: {
    position: 'absolute',
    left: 25,
    top: 756,
    width: 340,
    padding: 16,
    backgroundColor: '#2A71D0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreeButtonText: {
    textAlign: 'center',
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 20,
  },
});