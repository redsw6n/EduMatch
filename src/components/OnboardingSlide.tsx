import React from 'react';
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProp {
  title: string;
  description: string;
  illustration?: string;
  image?: ImageSourcePropType;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  customContent?: React.ReactNode;
  showRedBox?: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProp> = ({
  title,
  description,
  illustration = '🎓',
  image,
  backgroundColor = 'white',
  titleColor = '#2A71D0',
  descriptionColor = '#6B7280',
  customContent,
  showRedBox = false,
}) => {
  return (
    <View style={[styles.slide, { backgroundColor }]}>
      {/* Red placeholder box - positioned exactly as in Figma */}
      {showRedBox && (
        <View style={styles.redBox} />
      )}
      
      {/* Image container for onboarding images */}
      {image && !showRedBox && (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.onboardingImage} resizeMode="cover" />
        </View>
      )}
      
      {/* Custom content or illustration */}
      {!showRedBox && !image && (
        <View style={styles.illustrationContainer}>
          {customContent ? (
            customContent
          ) : (
            <Text style={styles.illustration}>{illustration}</Text>
          )}
        </View>
      )}
      
      {/* Title - positioned exactly as in Figma */}
      <Text style={[styles.title, { color: titleColor }]}>
        {title}
      </Text>
      
      {/* Description - positioned exactly as in Figma */}
      <Text style={[styles.description, { color: descriptionColor }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    height: '100%',
    position: 'relative',
  },
  // Red box positioned to not overlap with text - reduced height for proper spacing
  redBox: {
    position: 'absolute',
    width: 390,
    height: 450,
    left: 0,
    top: 0,
    backgroundColor: '#FF0606',
  },
  // Title positioned higher for better spacing
  title: {
    position: 'absolute',
    left: 43.5,
    top: 500,
    right: 43.5, // For proper text wrapping
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  // Description positioned higher for better spacing
  description: {
    position: 'absolute',
    width: 340,
    left: 25,
    top: 550,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 24,
  },
  // Keep these for non-Figma screens
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    fontSize: 120,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    maxWidth: 300,
    maxHeight: 300,
  },
  // New styles for onboarding images
  imageContainer: {
    position: 'absolute',
    width: 390,
    height: 450,
    left: 0,
    top: 0,
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
