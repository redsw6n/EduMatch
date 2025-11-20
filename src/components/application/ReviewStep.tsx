import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { FormData } from '../../types/applicationTypes';

interface ReviewStepProps {
  formData: FormData;
  schoolData?: {
    name: string;
    location?: string;
  };
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  schoolData,
}) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.reviewFormContainer}>
      <Text style={styles.reviewFormTitle}>Submit</Text>
      
      <View style={styles.reviewContent}>
        {/* Success Icon */}
        <View style={styles.reviewIconContainer}>
          <CheckCircle size={40} color={colors.textInverse} strokeWidth={3.33} />
        </View>

        {/* Review Header */}
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Review Your Application</Text>
          <Text style={styles.reviewSubtitle}>
            Please review all information before submitting your application.
          </Text>
        </View>

        {/* Review Summary Card */}
        <View style={styles.reviewSummaryCard}>
          {/* Personal Information Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Personal Information</Text>
            <View style={styles.reviewSectionContent}>
              {formData.personalInfo.firstName && formData.personalInfo.lastName ? (
                <Text style={styles.reviewItem}>
                  • {formData.personalInfo.firstName} {formData.personalInfo.lastName}
                </Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• Name: ✗ Missing</Text>
              )}
              
              {formData.personalInfo.email ? (
                <Text style={styles.reviewItem}>• {formData.personalInfo.email}</Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• Email: ✗ Missing</Text>
              )}
              
              {formData.personalInfo.phone ? (
                <Text style={styles.reviewItem}>• {formData.personalInfo.phone}</Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• Phone: ✗ Missing</Text>
              )}
              
              {formData.personalInfo.dateOfBirth ? (
                <Text style={styles.reviewItem}>• Born: {formData.personalInfo.dateOfBirth}</Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• Date of Birth: ✗ Missing</Text>
              )}
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Documents</Text>
            <View style={styles.reviewSectionContent}>
              <Text style={[
                styles.reviewItem,
                !formData.documents.birthCertificate.uploaded && styles.reviewItemMissing
              ]}>
                Birth Certificate: {formData.documents.birthCertificate.uploaded ? 
                  `✓ ${formData.documents.birthCertificate.fileName}` : 
                  '✗ Missing'
                }
              </Text>
              
              <Text style={[
                styles.reviewItem,
                !formData.documents.transcript.uploaded && styles.reviewItemMissing
              ]}>
                Transcript: {formData.documents.transcript.uploaded ? 
                  `✓ ${formData.documents.transcript.fileName}` : 
                  '✗ Missing'
                }
              </Text>
              
              <Text style={[
                styles.reviewItem,
                !formData.documents.studentId.uploaded && styles.reviewItemMissing
              ]}>
                Student ID: {formData.documents.studentId.uploaded ? 
                  `✓ ${formData.documents.studentId.fileName}` : 
                  '✗ Missing'
                }
              </Text>
            </View>
          </View>

          {/* Program Choice Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Program</Text>
            <View style={styles.reviewSectionContent}>
              {formData.programChoice.firstChoice ? (
                <Text style={styles.reviewItem}>
                  • 1st Choice: {formData.programChoice.firstChoice}
                </Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• 1st Choice: ✗ Missing</Text>
              )}
              
              {formData.programChoice.secondChoice ? (
                <Text style={styles.reviewItem}>
                  • 2nd Choice: {formData.programChoice.secondChoice}
                </Text>
              ) : (
                <Text style={styles.reviewItemMissing}>• 2nd Choice: ✗ Missing</Text>
              )}
              
              {formData.programChoice.preferredCampus && (
                <Text style={styles.reviewItem}>
                  • Campus: {formData.programChoice.preferredCampus}
                </Text>
              )}
              
              {formData.programChoice.academicGoals && (
                <Text style={styles.reviewItem} numberOfLines={3}>
                  • Goals: {formData.programChoice.academicGoals}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* School Information */}
        {schoolData && (
          <View style={styles.schoolInfoCard}>
            <Text style={styles.schoolInfoTitle}>Applying to:</Text>
            <Text style={styles.schoolInfoName}>{schoolData.name}</Text>
            {schoolData.location && (
              <Text style={styles.schoolInfoLocation}>{schoolData.location}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  reviewFormContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 30,
  },
  reviewContent: {
    alignItems: 'center',
  },
  reviewIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.success,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  reviewHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25.6,
    paddingHorizontal: 16,
  },
  reviewSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  reviewSection: {
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 14,
    marginBottom: 14,
  },
  reviewSectionContent: {
    gap: 4,
  },
  reviewItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reviewItemMissing: {
    fontSize: 14,
    color: colors.error,
    lineHeight: 20,
  },
  schoolInfoCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  schoolInfoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  schoolInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  schoolInfoLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});