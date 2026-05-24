import { EventAnnouncement, ExamAnnouncement, FoodMenuAnnouncement, LibraryAnnouncement, type CampusAnnouncement } from './announcement';
import { EmailNotification, PushNotification, SmsNotification, type NotificationTransport } from './notification';
import { type AnnouncementKind, type AnnouncementPayload, type NotificationChannelKind } from './types';

export class AnnouncementFactory {
  static create(kind: AnnouncementKind, payload: AnnouncementPayload): CampusAnnouncement {
    switch (kind) {
      case 'exam':
        return new ExamAnnouncement(payload);
      case 'event':
        return new EventAnnouncement(payload);
      case 'food':
        return new FoodMenuAnnouncement(payload);
      case 'library':
        return new LibraryAnnouncement(payload);
      default: {
        const exhaustiveCheck: never = kind;
        return exhaustiveCheck;
      }
    }
  }
}

export class NotificationFactory {
  static create(channel: NotificationChannelKind): NotificationTransport {
    switch (channel) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SmsNotification();
      case 'push':
        return new PushNotification();
      default: {
        const exhaustiveCheck: never = channel;
        return exhaustiveCheck;
      }
    }
  }
}
