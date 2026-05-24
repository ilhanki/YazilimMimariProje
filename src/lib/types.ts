export type ThemeMode = 'dark' | 'light';

export type NavigationKey =
  | 'dashboard'
  | 'announcements'
  | 'notifications'
  | 'users'
  | 'analytics'
  | 'settings';

export type UserRole = 'Student' | 'Faculty' | 'Admin';

export type NotificationChannel = 'email' | 'sms' | 'push';
export type AnnouncementCategory = 'exam' | 'event' | 'cafeteria' | 'library';
export type DeliveryStatus = 'delivered' | 'sent' | 'opened' | 'queued';
export type AudienceScope = 'campus-wide' | 'all-students' | 'all-faculty' | 'selected-users';

export type PreferenceState = Record<NotificationChannel, boolean>;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  avatarSeed: string;
  department?: string;
  email?: string;
  phone?: string;
  preferences: PreferenceState;
}

export interface UserFormValues {
  name: string;
  role: UserRole;
  department: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  emailAddress?: string;
  phone?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  audience: string;
  audienceScope: AudienceScope;
  audienceUserIds: string[];
  channel: NotificationChannel;
  message: string;
  createdAt: string;
  updatedAt: string;
  recipientCount: number;
  views: number;
  deliveries: number;
  successRate: number;
}

export interface CampusNotification {
  id: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  title: string;
  subtitle: string;
  timestamp: string;
  count: number;
}

export interface TrendPoint {
  label: string;
  delivered: number;
  opened: number;
  engagement: number;
}

export interface ServerLoadPoint {
  label: string;
  value: number;
}

export interface AnnouncementFormValues {
  title: string;
  category: AnnouncementCategory;
  audienceScope: AudienceScope;
  audienceUserIds: string[];
  channel: NotificationChannel;
  message: string;
}
