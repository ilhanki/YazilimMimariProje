import { type AnnouncementKind, type AnnouncementPayload } from './types';

abstract class BaseAnnouncement {
  constructor(protected readonly payload: AnnouncementPayload) {}

  abstract readonly kind: AnnouncementKind;
  abstract readonly label: string;

  get id() {
    return this.payload.id;
  }

  get title() {
    return this.payload.title;
  }

  get audience() {
    return this.payload.audience;
  }

  get message() {
    return this.payload.message;
  }

  get createdBy() {
    return this.payload.createdBy;
  }
}

export class ExamAnnouncement extends BaseAnnouncement {
  readonly kind = 'exam' as const;
  readonly label = 'Sınav Duyurusu';
}

export class EventAnnouncement extends BaseAnnouncement {
  readonly kind = 'event' as const;
  readonly label = 'Etkinlik Duyurusu';
}

export class FoodMenuAnnouncement extends BaseAnnouncement {
  readonly kind = 'food' as const;
  readonly label = 'Yemekhane Duyurusu';
}

export class LibraryAnnouncement extends BaseAnnouncement {
  readonly kind = 'library' as const;
  readonly label = 'Kütüphane Duyurusu';
}

export type CampusAnnouncement = ExamAnnouncement | EventAnnouncement | FoodMenuAnnouncement | LibraryAnnouncement;
