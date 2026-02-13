import { useState, useEffect, useCallback } from 'react';

export type NotificationType = 'status_change' | 'document_request' | 'interview' | 'offer' | 'message' | 'action_required' | 'reminder';

export interface UserNotification {
  id: string;
  applicationId: string;
  courseName: string;
  universityName: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  isActionRequired: boolean;
  actionLabel?: string;
  actionRoute?: string;
  createdAt: string;
}

const STORAGE_KEY = 'user_notifications';

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const loadNotifications = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(STORAGE_KEY + '_version');
    if (stored && version === '1') {
      setNotifications(JSON.parse(stored));
    } else {
      const initial = generateInitialNotifications();
      setNotifications(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEY + '_version', '1');
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const save = (data: UserNotification[]) => {
    setNotifications(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const markAsRead = (id: string) => {
    save(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    save(notifications.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (notification: Omit<UserNotification, 'id' | 'createdAt'>) => {
    const newNotification: UserNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    save([newNotification, ...notifications]);
    return newNotification;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequired = notifications.filter(n => n.isActionRequired && !n.isRead);

  return {
    notifications,
    unreadCount,
    actionRequired,
    markAsRead,
    markAllRead,
    addNotification,
    refresh: loadNotifications,
  };
};

const generateInitialNotifications = (): UserNotification[] => [
  {
    id: 'notif_1',
    applicationId: 'APP-004',
    courseName: 'Engineering Exchange Program',
    universityName: 'Harvard University',
    type: 'offer',
    title: '🎉 Congratulations! You have been accepted!',
    message: 'Your application for the Engineering Exchange Program at Harvard University has been accepted. Your offer letter is now available for download.',
    isRead: false,
    isActionRequired: true,
    actionLabel: 'View Offer Letter',
    actionRoute: '/user/applications/APP-004',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'notif_2',
    applicationId: 'APP-005',
    courseName: 'MS in Computer Science',
    universityName: 'Harvard University',
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'Your interview for MS in Computer Science has been scheduled for Feb 25, 2024 at 2:00 PM via Zoom. Please prepare accordingly.',
    isRead: false,
    isActionRequired: true,
    actionLabel: 'View Interview Details',
    actionRoute: '/user/applications/APP-005',
    createdAt: '2024-02-20T09:00:00Z',
  },
  {
    id: 'notif_3',
    applicationId: 'APP-001',
    courseName: 'MBA in International Business',
    universityName: 'Harvard University',
    type: 'status_change',
    title: 'Application Shortlisted',
    message: 'Your application for MBA in International Business has been shortlisted. You may be contacted for the next stage.',
    isRead: false,
    isActionRequired: false,
    createdAt: '2024-01-16T14:00:00Z',
  },
  {
    id: 'notif_4',
    applicationId: 'APP-002',
    courseName: 'MS in Computer Science',
    universityName: 'Harvard University',
    type: 'document_request',
    title: 'Additional Documents Required',
    message: 'The admissions office requires your official English proficiency certificate (TOEFL/IELTS). Please upload it within 7 days.',
    isRead: false,
    isActionRequired: true,
    actionLabel: 'Upload Documents',
    actionRoute: '/user/applications/APP-002',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'notif_5',
    applicationId: 'APP-006',
    courseName: 'Data Science Certificate',
    universityName: 'MIT',
    type: 'status_change',
    title: 'Application Shortlisted',
    message: 'Your application for Data Science Certificate at MIT has been shortlisted for further review.',
    isRead: true,
    isActionRequired: false,
    createdAt: '2024-03-05T16:00:00Z',
  },
  {
    id: 'notif_6',
    applicationId: 'APP-007',
    courseName: 'MBA in International Business',
    universityName: 'Harvard University',
    type: 'status_change',
    title: 'Application Update',
    message: 'Unfortunately, your application for MBA in International Business was not selected this cycle. You may re-apply in the next intake.',
    isRead: true,
    isActionRequired: false,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'notif_7',
    applicationId: 'APP-003',
    courseName: 'MBA in International Business',
    universityName: 'Harvard University',
    type: 'message',
    title: 'Application Received',
    message: 'Your application has been received and is being processed. You will be notified once the review begins.',
    isRead: true,
    isActionRequired: false,
    createdAt: '2024-01-16T08:00:00Z',
  },
  {
    id: 'notif_8',
    applicationId: 'APP-004',
    courseName: 'Engineering Exchange Program',
    universityName: 'Harvard University',
    type: 'action_required',
    title: 'Accept Your Offer by March 1st',
    message: 'Please confirm your enrollment for the Engineering Exchange Program. The deadline to accept is March 1, 2024.',
    isRead: false,
    isActionRequired: true,
    actionLabel: 'Accept Offer',
    actionRoute: '/user/applications/APP-004',
    createdAt: '2024-02-16T08:00:00Z',
  },
];
