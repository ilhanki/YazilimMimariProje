import { type CampusAnnouncement } from './announcement';
import { type NotificationChannelKind, type NotificationRequest } from './types';

export interface AnnouncementObserver {
  readonly name: string;
  readonly roleLabel: string;
  readonly preferredChannels: NotificationChannelKind[];
  supports(announcement: CampusAnnouncement): boolean;
  update(announcement: CampusAnnouncement): NotificationRequest[];
}

abstract class BaseObserver implements AnnouncementObserver {
  constructor(
    public readonly name: string,
    public readonly roleLabel: string,
    public readonly preferredChannels: NotificationChannelKind[],
  ) {}

  supports(_announcement: CampusAnnouncement) {
    return true;
  }

  update(announcement: CampusAnnouncement) {
    return this.preferredChannels.map((channel) => {
      const message = `${this.roleLabel} ${this.name}, "${announcement.title}" duyurusu için bilgilendirildi.`;
      return {
        recipient: this.name,
        channel,
        message,
        sourceAnnouncement: announcement.title,
      } satisfies NotificationRequest;
    });
  }
}

export class StudentObserver extends BaseObserver {
  constructor(name: string, preferredChannels: NotificationChannelKind[]) {
    super(name, 'Öğrenci', preferredChannels);
  }
}

export class TeacherObserver extends BaseObserver {
  constructor(name: string, preferredChannels: NotificationChannelKind[]) {
    super(name, 'Öğretmen', preferredChannels);
  }
}
