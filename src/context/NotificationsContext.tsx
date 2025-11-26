import React, { createContext, ReactNode, useContext, useState } from 'react';

// ---------------- Types ----------------
export type NotificationType = 'application' | 'message' | 'system' | 'match' | 'reminder';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionData?: any;
};

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// ---------------- Context ----------------
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// ---------------- Mock Data ----------------
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'Application Update',
    message: 'Your application to Southwestern University PHINMA has been reviewed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: '2',
    type: 'match',
    title: 'Program Match Found',
    message: 'Your profile matches perfectly with SWU PHINMA programs!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
  },
  {
    id: '3',
    type: 'message',
    title: 'Message from Admissions',
    message: 'Southwestern University PHINMA sent you a message about your application',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Application Deadline',
    message: 'Reminder: Your application to Southwestern University PHINMA is due in 3 days',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Completion',
    message: 'Complete your academic background to get better program matches at SWU PHINMA',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
  },
];

// ---------------- Provider ----------------
export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const addNotification = (newNotification: Omit<Notification, 'id'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(), // Simple ID generation
    };

    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// ---------------- Hook ----------------
export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};