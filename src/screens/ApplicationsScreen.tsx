import { useNavigation } from '@react-navigation/native';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Application, useApplications } from '../context/ApplicationsContext';
import { useThemedColors } from '../hooks/useThemedColors';

// Types
type FilterStatus = 'all' | 'submitted' | 'completed';

const ApplicationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { applications } = useApplications();
  const colors = useThemedColors();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Create styles with theme colors
  const styles = createStyles(colors);

  const getStatusConfig = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280',
          icon: Clock,
          label: 'Submitted',
        };
      case 'in-review':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#FFB800',
          icon: AlertCircle,
          label: 'In Review',
        };
      case 'accepted':
        return {
          backgroundColor: '#D1FAE5',
          textColor: '#2ECC71',
          icon: CheckCircle,
          label: 'Accepted',
        };
      case 'rejected':
        return {
          backgroundColor: '#FEE2E2',
          textColor: '#EF4444',
          icon: AlertCircle,
          label: 'Rejected',
        };
    }
  };

  const getFilteredApplications = () => {
    if (activeFilter === 'all') return applications;
    if (activeFilter === 'completed') {
      return applications.filter(app => app.status === 'accepted' || app.status === 'rejected');
    }
    if (activeFilter === 'submitted') {
      return applications.filter(app => app.status === 'submitted' || app.status === 'in-review');
    }
    return applications.filter(app => app.status === activeFilter);
  };

  const FilterButton: React.FC<{ 
    title: string; 
    filter: FilterStatus; 
    isActive: boolean; 
    onPress: () => void 
  }> = ({ title, filter, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && styles.filterButtonActive
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${title}`}
    >
      <Text style={[
        styles.filterButtonText,
        isActive && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <View style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}>
        <IconComponent size={12} color={config.textColor} />
        <Text style={[styles.statusText, { color: config.textColor }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  const ApplicationCard: React.FC<{ application: Application }> = ({ application }) => {
    const isAccepted = application.status === 'accepted';

    const handleViewTimeline = () => {
      navigation.navigate('ApplicationTimeline', {
        applicationData: {
          id: `APP-2024-${application.id.padStart(3, '0')}`,
          universityName: application.universityName,
          program: application.program,
          campus: 'Main Campus',
          startTerm: 'A.Y 2024-2025',
          status: application.status,
        }
      });
    };

    return (
      <View style={styles.applicationCard}>
        <View style={styles.cardContent}>
          <View style={styles.universityLogoContainer}>
            <Image 
              source={require('../../assets/images/logomark.png')}
              style={styles.universityLogoImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.applicationInfo}>
            <View style={styles.headerRow}>
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{application.universityName}</Text>
                <Text style={styles.programName}>{application.program}</Text>
              </View>
              
              <View style={styles.statusRow}>
                <StatusBadge status={application.status} />
              </View>
            </View>

            <View style={styles.datesRow}>
              {application.submittedDate && (
                <View style={styles.dateItem}>
                  <Text style={styles.dateText}>
                    Submitted: {application.submittedDate}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              {isAccepted ? (
                <TouchableOpacity 
                  style={styles.acceptedButton}
                  accessibilityRole="button"
                  accessibilityLabel="View acceptance letter"
                >
                  <Text style={styles.acceptedButtonText}>VIEW ACCEPTANCE LETTER</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.timelineButton}
                  onPress={handleViewTimeline}
                  accessibilityRole="button"
                  accessibilityLabel="View timeline"
                >
                  <Text style={styles.timelineButtonText}>VIEW TIMELINE</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Applications</Text>
          <Text style={styles.subtitle}>Track your college application progress</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FilterButton
            title="All"
            filter="all"
            isActive={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterButton
            title="Submitted"
            filter="submitted"
            isActive={activeFilter === 'submitted'}
            onPress={() => setActiveFilter('submitted')}
          />
          <FilterButton
            title="Completed"
            filter="completed"
            isActive={activeFilter === 'completed'}
            onPress={() => setActiveFilter('completed')}
          />
        </View>

        {/* Applications List */}
        <View style={styles.applicationsList}>
          {getFilteredApplications().map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40, // Safe area padding
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter',
    lineHeight: 25.6,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 3,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FFB800',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Arimo',
    lineHeight: 20,
  },
  filterButtonTextActive: {
    color: '#000000',
  },
  applicationsList: {
    paddingHorizontal: 16,
    gap: 24,
  },
  applicationCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.primaryOrange,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
  },
  universityLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  universityLogoImage: {
    width: 40,
    height: 40,
  },
  applicationInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Arimo',
    lineHeight: 24,
    marginBottom: 4,
  },
  programName: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Arimo',
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Arimo',
    lineHeight: 16,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Arimo',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timelineButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1.26,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.35,
    lineHeight: 20,
  },
  acceptedButton: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  acceptedButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.35,
    lineHeight: 20,
  },
});

export default ApplicationsScreen;