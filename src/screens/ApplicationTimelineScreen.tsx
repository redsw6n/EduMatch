import { AlertCircle, ArrowLeft, CheckCircle, Info } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedColors } from '../hooks/useThemedColors';

interface TimelineStepData {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface ApplicationTimelineScreenProps {
  navigation: any;
  route: any;
}

const ApplicationTimelineScreen: React.FC<ApplicationTimelineScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const insets = useSafeAreaInsets();
  const colors = useThemedColors();
  const styles = createStyles(colors);
  
  // This would come from route params or API
  const applicationData = route?.params?.applicationData || {
    id: 'APP-2024-001',
    universityName: 'Southwestern University PHINMA',
    program: 'Information Technology',
    campus: 'Urgello Campus',
    startTerm: 'A.Y 2024-2025',
    status: 'in-review'
  };

  const getTimelineSteps = (applicationStatus: string): TimelineStepData[] => {
    const baseSteps: TimelineStepData[] = [
      {
        id: '1',
        title: 'Application Submitted',
        description: 'Your application has been received',
        date: '2025-10-10 • 2:30 PM',
        status: 'completed',
      },
    ];

    if (applicationStatus === 'submitted') {
      // For submitted status, only show the first step as completed
      return [
        ...baseSteps,
        {
          id: '2',
          title: 'Academic Review',
          description: 'Academic committee evaluation',
          status: 'pending',
        },
        {
          id: '3',
          title: 'Interview (if required)',
          description: 'Interview invitation will be sent if needed',
          status: 'pending',
        },
        {
          id: '4',
          title: 'Final Decision',
          description: 'Admission decision notification',
          status: 'pending',
        },
      ];
    }

    if (applicationStatus === 'in-review') {
      // For in-review status, show progression through the review process
      return [
        ...baseSteps,
        {
          id: '2',
          title: 'Academic Review',
          description: 'Academic committee evaluation in progress',
          date: '2025-10-13 • 9:00 AM',
          status: 'in-progress',
        },
        {
          id: '3',
          title: 'Interview (if required)',
          description: 'Interview invitation will be sent if needed',
          status: 'pending',
        },
        {
          id: '4',
          title: 'Final Decision',
          description: 'Admission decision notification',
          status: 'pending',
        },
      ];
    }

    if (applicationStatus === 'accepted') {
      // For accepted status, show all steps completed
      return [
        ...baseSteps,
        {
          id: '2',
          title: 'Academic Review',
          description: 'Academic committee evaluation completed',
          date: '2025-10-13 • 9:00 AM',
          status: 'completed',
        },
        {
          id: '3',
          title: 'Interview (if required)',
          description: 'Interview completed successfully',
          date: '2025-10-14 • 2:00 PM',
          status: 'completed',
        },
        {
          id: '4',
          title: 'Final Decision',
          description: 'Congratulations! You have been accepted',
          date: '2025-10-15 • 11:00 AM',
          status: 'completed',
        },
      ];
    }

    if (applicationStatus === 'rejected') {
      // For rejected status, show steps up to final decision
      return [
        ...baseSteps,
        {
          id: '2',
          title: 'Academic Review',
          description: 'Academic committee evaluation completed',
          date: '2025-10-13 • 9:00 AM',
          status: 'completed',
        },
        {
          id: '3',
          title: 'Interview (if required)',
          description: 'Interview completed',
          date: '2025-10-14 • 2:00 PM',
          status: 'completed',
        },
        {
          id: '4',
          title: 'Final Decision',
          description: 'Application was not successful this time',
          date: '2025-10-15 • 11:00 AM',
          status: 'completed',
        },
      ];
    }

    // Default case - return basic timeline
    return baseSteps;
  };

  const timelineSteps = getTimelineSteps(applicationData.status);

  const getStatusConfig = (status: 'completed' | 'in-progress' | 'pending') => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: '#2ECC71',
          iconColor: '#2ECC71',
          textColor: 'white',
          label: 'Completed',
          icon: CheckCircle,
          lineColor: '#2ECC71',
        };
      case 'in-progress':
        return {
          backgroundColor: '#FFB800',
          iconColor: '#FFB800',
          textColor: 'white',
          label: 'In Progress',
          icon: AlertCircle,
          lineColor: '#F3F4F6',
        };
      case 'pending':
        return {
          backgroundColor: 'transparent',
          iconColor: '#6B7280',
          textColor: '#6B7280',
          label: 'Pending',
          icon: null,
          lineColor: '#F3F4F6',
        };
    }
  };

  const getApplicationStatusConfig = (status: string) => {
    switch (status) {
      case 'in-review':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#FFB800',
          label: 'In Review',
        };
      case 'accepted':
        return {
          backgroundColor: '#D1FAE5',
          textColor: '#2ECC71',
          label: 'Accepted',
        };
      case 'submitted':
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280',
          label: 'Submitted',
        };
      case 'rejected':
        return {
          backgroundColor: '#FEE2E2',
          textColor: '#EF4444',
          label: 'Rejected',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280',
          label: 'Submitted',
        };
    }
  };

  const TimelineStep: React.FC<{ 
    step: TimelineStepData; 
    isLast: boolean;
  }> = ({ step, isLast }) => {
    const config = getStatusConfig(step.status);
    const IconComponent = config.icon;

    return (
      <View style={styles.timelineStep}>
        <View style={styles.timelineIconContainer}>
          {step.status === 'pending' ? (
            <View style={[styles.pendingIcon, { borderColor: config.iconColor }]} />
          ) : (
            <View style={[styles.completedIcon, { backgroundColor: config.iconColor }]}>
              {IconComponent && (
                <IconComponent size={12} color="white" />
              )}
            </View>
          )}
          {!isLast && (
            <View style={[styles.timelineLine, { backgroundColor: config.lineColor }]} />
          )}
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineTitleContainer}>
              <Text style={styles.timelineTitle}>{step.title}</Text>
            </View>
            {step.date && (
              <View style={styles.timelineDateContainer}>
                <Text style={styles.timelineDate}>{step.date}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.timelineDescription}>{step.description}</Text>
          
          {step.status !== 'pending' && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: config.backgroundColor }
            ]}>
              {step.status === 'completed' && (
                <CheckCircle size={12} color="white" />
              )}
              {step.status === 'in-progress' && (
                <AlertCircle size={12} color="white" />
              )}
              <Text style={[styles.statusText, { color: config.textColor }]}>
                {config.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const statusConfig = getApplicationStatusConfig(applicationData.status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={16} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Application Timeline</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Application Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.universityName}>{applicationData.universityName}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Program</Text>
              <Text style={styles.infoValue}>{applicationData.program}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Campus</Text>
              <Text style={styles.infoValue}>{applicationData.campus}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Start Term</Text>
              <Text style={styles.infoValue}>{applicationData.startTerm}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[
                styles.applicationStatusBadge, 
                { backgroundColor: statusConfig.backgroundColor }
              ]}>
                <Text style={[
                  styles.applicationStatusText, 
                  { color: statusConfig.textColor }
                ]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineCardTitle}>Application Progress</Text>
          
          <View style={styles.timelineContainer}>
            {timelineSteps.map((step, index) => (
              <TimelineStep 
                key={step.id} 
                step={step} 
                isLast={index === timelineSteps.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Important Information Card */}
        <View style={styles.infoNoticeCard}>
          <View style={styles.infoNoticeHeader}>
            <Info size={13} color="#FFB800" />
            <Text style={styles.infoNoticeTitle}>Important Information</Text>
          </View>
          
          <View style={styles.infoNoticeContent}>
            <Text style={styles.infoNoticeItem}>
              • Decision notifications will be sent via email and EduMatch app
            </Text>
            <Text style={styles.infoNoticeItem}>
              • Check your spam folder regularly for communications
            </Text>
            <Text style={styles.infoNoticeItem}>
              • Some programs may require additional interviews
            </Text>
            <Text style={styles.infoNoticeItem}>
              • Timeline may vary based on application volume
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#2A71D0',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
    lineHeight: 28,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
    opacity: 0.9,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    lineHeight: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Arimo',
    lineHeight: 20,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Arimo',
    lineHeight: 24,
  },
  applicationStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  applicationStatusText: {
    fontSize: 12,
    fontFamily: 'Arimo',
    lineHeight: 16,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 24,
  },
  timelineCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    lineHeight: 16,
    marginBottom: 30,
  },
  timelineContainer: {
    flex: 1,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  timelineIconContainer: {
    width: 20,
    alignItems: 'center',
  },
  completedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.26,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineTitleContainer: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    lineHeight: 24,
  },
  timelineDateContainer: {
    marginLeft: 16,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Arimo',
    lineHeight: 16,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Arimo',
    lineHeight: 16,
  },
  infoNoticeCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  infoNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  infoNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    lineHeight: 24,
  },
  infoNoticeContent: {
    gap: 4,
  },
  infoNoticeItem: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    lineHeight: 20,
  },
});

export default ApplicationTimelineScreen;