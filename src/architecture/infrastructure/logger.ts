export class Logger {
  private static instance: Logger | null = null;
  private readonly entries: string[] = [];

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  info(message: string) {
    this.entries.push(message);
    return message;
  }

  clear() {
    this.entries.length = 0;
  }

  snapshot() {
    return [...this.entries];
  }
}
