import { NotificationFactory } from '../domain/factory';
import { Logger } from './logger';
import { type NotificationRequest } from '../domain/types';

export class NotificationCenter {
  private static instance: NotificationCenter | null = null;
  private readonly history: string[] = [];

  static getInstance() {
    if (!NotificationCenter.instance) {
      NotificationCenter.instance = new NotificationCenter();
    }

    return NotificationCenter.instance;
  }

  private constructor(private readonly logger = Logger.getInstance()) {}

  dispatch(request: NotificationRequest) {
    const transport = NotificationFactory.create(request.channel);
    const line = transport.deliver(request);
    this.history.push(line);
    this.logger.info(line);
    // Also emit to browser console for easier debugging during demo
    // (appears in DevTools → Console when running the dev server)
    // Keep this lightweight and non-blocking.
    // eslint-disable-next-line no-console
    console.log('[NotificationCenter]', line);
    return line;
  }

  clearHistory() {
    this.history.length = 0;
  }

  snapshot() {
    return [...this.history];
  }
}
