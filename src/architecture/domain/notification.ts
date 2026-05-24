import { type NotificationChannelKind, type NotificationRequest } from './types';

export interface NotificationTransport {
  readonly channel: NotificationChannelKind;
  deliver(request: NotificationRequest): string;
}

abstract class BaseNotification implements NotificationTransport {
  abstract readonly channel: NotificationChannelKind;

  deliver(request: NotificationRequest) {
    return `${this.channel.toUpperCase()} => ${request.recipient}: ${request.message}`;
  }
}

export class EmailNotification extends BaseNotification {
  readonly channel = 'email' as const;
}

export class SmsNotification extends BaseNotification {
  readonly channel = 'sms' as const;
}

export class PushNotification extends BaseNotification {
  readonly channel = 'push' as const;
}
