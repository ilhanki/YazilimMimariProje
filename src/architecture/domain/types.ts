export type AnnouncementKind = 'exam' | 'event' | 'food' | 'library';

export type NotificationChannelKind = 'email' | 'sms' | 'push';

export interface AnnouncementPayload {
  id: string;
  title: string;
  audience: string;
  message: string;
  createdBy: string;
}

export interface NotificationRequest {
  recipient: string;
  channel: NotificationChannelKind;
  message: string;
  sourceAnnouncement: string;
}

export interface ScenarioSummary {
  observers: number;
  announcements: number;
  notifications: number;
}
