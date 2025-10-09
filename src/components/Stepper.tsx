import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepCircle,
                currentStep > step.id && styles.stepCompleted,
                currentStep === step.id && styles.stepActive,
              ]}
            >
              {currentStep > step.id ? (
                <Check size={16} color={colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep === step.id && styles.stepNumberActive,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step.id && styles.stepLineCompleted,
                ]}
              />
            )}
          </View>
          <View style={styles.stepInfo}>
            <Text
              style={[
                styles.stepTitle,
                currentStep === step.id && styles.stepTitleActive,
              ]}
            >
              {step.title}
            </Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: colors.success,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.backgroundSecondary,
    marginLeft: 8,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  stepInfo: {
    marginLeft: 40,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  stepTitleActive: {
    color: colors.text,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});