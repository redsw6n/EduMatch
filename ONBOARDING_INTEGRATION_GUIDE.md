# Onboarding Screen Figma Integration Guide

## Overview
I've enhanced your onboarding screen to be fully flexible and ready for your Figma designs. Here's how to integrate your 3 UI screens:

## What's Been Enhanced

### 1. OnboardingSlide Component
- ✅ **Image Support**: Can now display custom images instead of emojis
- ✅ **Custom Backgrounds**: Each slide can have different background colors
- ✅ **Custom Text Colors**: Title and description colors can be customized per slide
- ✅ **Custom Content**: Ability to render completely custom React components
- ✅ **Responsive**: Automatically adapts to different screen sizes

### 2. OnboardingScreen Navigation
- ✅ **Skip Button**: Added a skip button in the top-right corner
- ✅ **Next Button**: Shows "Next" for first 2 slides, "Get Started" for the last slide
- ✅ **Enhanced Navigation**: Better scroll handling and progression
- ✅ **Pagination Dots**: Visual indicators for current slide position

## How to Integrate Your Figma Designs

### Step 1: Export Assets from Figma
1. Export your illustrations/images as PNG or SVG files
2. Place them in `assets/images/` folder with descriptive names:
   ```
   assets/images/
   ├── onboarding-1.png
   ├── onboarding-2.png
   └── onboarding-3.png
   ```

### Step 2: Update the Onboarding Data
In `src/screens/OnboardingScreen.tsx`, modify the `onboardingData` array:

```tsx
const onboardingData = [
  {
    id: '1',
    title: 'Your Figma Title 1',
    description: 'Your Figma description 1',
    image: require('../../assets/images/onboarding-1.png'),
    backgroundColor: '#F8F9FA', // Optional: from your Figma design
    titleColor: '#1A1A1A',      // Optional: custom title color
    descriptionColor: '#6B7280', // Optional: custom description color
  },
  {
    id: '2',
    title: 'Your Figma Title 2',
    description: 'Your Figma description 2',
    image: require('../../assets/images/onboarding-2.png'),
    backgroundColor: '#E3F2FD',
    titleColor: '#2563EB',
    descriptionColor: '#64748B',
  },
  {
    id: '3',
    title: 'Your Figma Title 3',
    description: 'Your Figma description 3',
    image: require('../../assets/images/onboarding-3.png'),
    backgroundColor: '#F3E5F5',
    titleColor: '#7C3AED',
    descriptionColor: '#64748B',
  },
];
```

### Step 3: Update the renderSlide Function
Uncomment the additional props in the `renderSlide` function:

```tsx
const renderSlide = ({ item }: { item: typeof onboardingData[0] }) => (
  <OnboardingSlide
    title={item.title}
    description={item.description}
    image={item.image}
    backgroundColor={item.backgroundColor}
    titleColor={item.titleColor}
    descriptionColor={item.descriptionColor}
  />
);
```

### Step 4: Custom Components (Advanced)
If your Figma designs have complex layouts, you can create custom components:

1. Create custom components in `src/components/onboarding/`:
   ```tsx
   // CustomSlide1.tsx
   export const CustomSlide1 = () => (
     <View style={styles.customLayout}>
       {/* Your custom Figma design implementation */}
     </View>
   );
   ```

2. Use them in the onboarding data:
   ```tsx
   {
     id: '1',
     title: '',
     description: '',
     customContent: <CustomSlide1 />
   }
   ```

## Color & Typography Integration

### Colors
Update `src/theme/colors.ts` to match your Figma color palette:
```tsx
export const colors = {
  primary: '#YourPrimaryColor',
  secondary: '#YourSecondaryColor',
  background: '#YourBackgroundColor',
  // ... add more colors from your design system
};
```

### Typography
Update `src/theme/typography.ts` to match your Figma fonts:
```tsx
export const typography = {
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};
```

## Responsive Design Considerations

The enhanced slide component automatically handles:
- **Image sizing**: Images scale to 80% of screen width, max 300px
- **Text scaling**: Typography scales with device size
- **Layout adaptation**: Slides adjust to different screen ratios

## Animation Options (Optional)

You can add custom animations by:
1. Installing `react-native-reanimated`
2. Adding transition animations between slides
3. Creating entrance animations for content

## Testing Your Integration

1. **Run the app**: `npm start` or `yarn start`
2. **Test navigation**: Ensure all slides display correctly
3. **Test responsiveness**: Try different device sizes
4. **Test skip functionality**: Verify skip button works
5. **Test progression**: Check Next/Get Started buttons

## Common Issues & Solutions

### Image Not Displaying
- ✅ Check file path is correct
- ✅ Ensure image file exists in assets folder
- ✅ Try using `.png` format instead of `.jpg`

### Layout Issues
- ✅ Check image dimensions aren't too large
- ✅ Verify backgroundColor is a valid hex color
- ✅ Ensure text content isn't too long

### TypeScript Errors
- ✅ Add image properties to the interface
- ✅ Import Image component if using custom layouts

## Next Steps

1. **Export your Figma assets**
2. **Update the onboarding data with your content**
3. **Test on device/simulator**
4. **Fine-tune colors and spacing**
5. **Add any custom animations**

Need help with any specific aspect of the integration? Let me know!