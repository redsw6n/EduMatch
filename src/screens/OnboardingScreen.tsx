import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingSlide } from '../components/OnboardingSlide';
import { PrimaryButton } from '../components/PrimaryButton';
import { setOnboardingCompleted } from '../context/AuthContext';
import { useThemedColors } from '../hooks/useThemedColors';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

// Figma design data - Screen 1
const onboardingData = [
  {
    id: '1',
    title: 'Find the right college, faster',
    description: 'EduMatch connects you with schools that truly fit your goals, interests, and budget. No more endless searching or guessing.',
    backgroundColor: 'white',
    titleColor: '#2A71D0',
    descriptionColor: '#6B7280',
    showRedBox: false,
    image: require('../../assets/images/students-on-stairs.jpg'),
  },
  {
    id: '2',
    title: 'All the info, all in one place',
    description: 'Compare programs, tuition, scholarships, and campus life with ease. EduMatch gives you reliable, updated details so you can make smarter choices.',
    backgroundColor: 'white',
    titleColor: '#2A71D0', 
    descriptionColor: '#6B7280',
    showRedBox: false,
    image: require('../../assets/images/students_laptops.png'),
  },
  {
    id: '3',
    title: 'Turn matches into opportunities',
    description: 'Once you find the right school, streamline your application and connect directly.',
    backgroundColor: 'white',
    titleColor: '#2A71D0',
    descriptionColor: '#6B7280',
    showRedBox: false,
    image: require('../../assets/images/graduate.png'),
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await setOnboardingCompleted();
      navigation.replace('SignUp');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      navigation.replace('SignUp');
    }
  };

  const renderSlide = ({ item }: { item: typeof onboardingData[0] }) => (
    <OnboardingSlide
      title={item.title}
      description={item.description}
      backgroundColor={item.backgroundColor}
      titleColor={item.titleColor}
      descriptionColor={item.descriptionColor}
      showRedBox={item.showRedBox}
      image={item.image}
    />
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDotPress(index)}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button - hide on last screen */}
      {currentIndex !== 2 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        
        {/* Get Started button - only show on 3rd page */}
        {currentIndex === 2 && (
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Get Started"
              onPress={handleGetStarted}
              accessibilityLabel="Get Started with EduMatch"
            />
          </View>
        )}
        
        {renderPaginationDots()}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 36,
    right: 25,
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: '#4C4C4C',
    borderRadius: 13,
    width: 72,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: colors.textInverse,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  content: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: '#4C4C4C',
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 32,
    right: 32,
    justifyContent: 'center',
  },
});
