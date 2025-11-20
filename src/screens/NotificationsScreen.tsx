import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle,
  GraduationCap,
  Heart,
  Info,
  MessageCircle
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useNotifications, type Notification, type NotificationType } from '../context/NotificationsContext';
import { useThemedColors } from '../hooks/useThemedColors';

// ---------------- Helper Functions ----------------
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'application':
      return <GraduationCap size={20} color="#2A71D0" />;
    case 'message':
      return <MessageCircle size={20} color="#10B981" />;
    case 'system':
      return <Info size={20} color="#F59E0B" />;
    case 'match':
      return <Heart size={20} color="#EF4444" />;
    case 'reminder':
      return <Bell size={20} color="#8B5CF6" />;
    default:
      return <Bell size={20} color="#6B7280" />;
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case 'application':
      return '#EBF8FF';
    case 'message':
      return '#F0FDF4';
    case 'system':
      return '#FFFBEB';
    case 'match':
      return '#FEF2F2';
    case 'reminder':
      return '#FAF5FF';
    default:
      return '#F9FAFB';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

// ---------------- Components ----------------
const NotificationCard = ({ 
  notification, 
  onPress, 
  onMarkAsRead,
  styles
}: { 
  notification: Notification; 
  onPress: () => void;
  onMarkAsRead: () => void;
  styles: any;
}) => (
  <TouchableOpacity style={styles.notificationCard} onPress={onPress}>
    <View style={styles.notificationHeader}>
      <View style={[styles.notificationIcon, { backgroundColor: getTypeColor(notification.type) }]}>
        {getNotificationIcon(notification.type)}
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationTitleRow}>
          <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
        <Text style={[styles.notificationMessage, !notification.isRead && styles.unreadMessage]}>
          {notification.message}
        </Text>
      </View>
      {!notification.isRead && (
        <TouchableOpacity 
          style={styles.markReadButton} 
          onPress={(e) => {
            e.stopPropagation();
            onMarkAsRead();
          }}
        >
          <Check size={16} color="#10B981" />
        </TouchableOpacity>
      )}
    </View>
    {!notification.isRead && <View style={styles.unreadIndicator} />}
  </TouchableOpacity>
);

// ---------------- Main Component ----------------
export default function NotificationsScreen() {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Hide navigation header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read when tapped
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'application':
        // Navigate to applications screen
        break;
      case 'match':
        // Navigate to matches screen
        break;
      case 'message':
        // Navigate to messages
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#2A71D0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.markAllText}>Mark All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {unreadCount > 0 && (
          <View style={styles.unreadSection}>
            <Text style={styles.sectionTitle}>New ({unreadCount})</Text>
            {notifications
              .filter(n => !n.isRead)
              .map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  styles={styles}
                />
              ))}
          </View>
        )}

        {notifications.some(n => n.isRead) && (
          <View style={styles.readSection}>
            <Text style={styles.sectionTitle}>Earlier</Text>
            {notifications
              .filter(n => n.isRead)
              .map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  styles={styles}
                />
              ))}
          </View>
        )}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No notifications yet</Text>
            <Text style={styles.emptyStateMessage}>
              You'll see important updates and messages here
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// ---------------- Styles ----------------
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#10B981",
  },

  scrollView: {
    flex: 1,
  },
  unreadSection: {
    marginTop: 16,
  },
  readSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  notificationCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: colors.text,
    fontWeight: "700",
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#9CA3AF",
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  unreadMessage: {
    color: colors.textSecondary,
  },
  markReadButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#2A71D0",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "Arimo",
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    fontFamily: "Arimo",
    fontWeight: "400",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },

  bottomSpacing: {
    height: 24,
  },
});