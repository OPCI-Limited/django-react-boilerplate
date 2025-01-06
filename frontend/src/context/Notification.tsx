import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '../interfaces/notification.model';
import { notificationService } from '../services/notification.service';
import { useAuth } from './AuthContext';

interface NotificationsContextValue {
  notifications: Notification[];
  fetchUnreadNotifications: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loadingUserData } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    const data = await notificationService.getNotifications();
    // console.log(data);
    // setNotifications(data);
  };

  const fetchUnreadNotifications = async () => {
    if (!isAuthenticated) return;
    const data = await notificationService.getUnreadNotifications();
    // console.log(data);
    setNotifications(data);
  };

  const markAsRead = async (notificationId: number) => {
    await notificationService.markNotificationAsRead(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  useEffect(() => {
    fetchUnreadNotifications();
    // fetchNotifications();
  }, [isAuthenticated, loadingUserData]);

  return (
    <NotificationsContext.Provider value={{ notifications, fetchUnreadNotifications, fetchNotifications, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
