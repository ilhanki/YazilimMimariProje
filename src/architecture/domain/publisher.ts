import { Logger } from '../infrastructure/logger';
import { NotificationCenter } from '../infrastructure/notification-center';
import { type CampusAnnouncement } from './announcement';
import { type AnnouncementObserver } from './observer';

export class AnnouncementPublisher {
  private readonly observers: AnnouncementObserver[] = [];

  constructor(private readonly notificationCenter = NotificationCenter.getInstance(), private readonly logger = Logger.getInstance()) {}

  attach(observer: AnnouncementObserver) {
    this.observers.push(observer);
  }

  publish(announcement: CampusAnnouncement) {
    const logs: string[] = [];
    const header = `Publisher: ${announcement.label} yayınlandı -> ${announcement.title}`;
    this.logger.info(header);
    logs.push(header);

    this.observers
      .filter((observer) => observer.supports(announcement))
      .forEach((observer) => {
        const messages = observer.update(announcement);
        messages.forEach((request) => {
          logs.push(this.notificationCenter.dispatch(request));
        });
      });

    return logs;
  }

  getObserverCount() {
    return this.observers.length;
  }
}
