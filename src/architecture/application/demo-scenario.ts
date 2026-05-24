import { AnnouncementFactory } from '../domain/factory';
import { AnnouncementPublisher } from '../domain/publisher';
import { StudentObserver, TeacherObserver } from '../domain/observer';
import { Logger } from '../infrastructure/logger';
import { NotificationCenter } from '../infrastructure/notification-center';
import { type ScenarioSummary } from '../domain/types';

export interface DemoScenarioResult {
  summary: ScenarioSummary;
  logs: string[];
}

export function runCampusDemoScenario(): DemoScenarioResult {
  const logger = Logger.getInstance();
  const notificationCenter = NotificationCenter.getInstance();
  logger.clear();
  notificationCenter.clearHistory();

  const publisher = new AnnouncementPublisher(notificationCenter, logger);
  publisher.attach(new StudentObserver('Ayşe Demir', ['email', 'push']));
  publisher.attach(new StudentObserver('Zeynep Kaya', ['push']));
  publisher.attach(new TeacherObserver('Prof. Dr. Mehmet Öz', ['email', 'sms']));
  publisher.attach(new TeacherObserver('Dr. Elif Yıldız', ['email']));

  logger.info('Singleton: Logger ve NotificationCenter tek örnek olarak çalıştı.');
  logger.info(`Observer: ${publisher.getObserverCount()} kullanıcı abone edildi.`);

  const examAnnouncement = AnnouncementFactory.create('exam', {
    id: 'demo-exam',
    title: 'Final Sınav Takvimi',
    audience: 'Tüm öğrenciler',
    message: 'Final sınav takvimi yayımlandı. Sınav giriş bilgileri panelde görüntülenebilir.',
    createdBy: 'Admin',
  });

  const libraryAnnouncement = AnnouncementFactory.create('library', {
    id: 'demo-library',
    title: 'Kütüphane Uzatılmış Saatler',
    audience: 'Sınav haftasındaki tüm kullanıcılar',
    message: 'Kütüphane sınav haftası boyunca her gün 12.00’ye kadar açık kalacaktır.',
    createdBy: 'Admin',
  });

  publisher.publish(examAnnouncement);
  publisher.publish(libraryAnnouncement);

  return {
    summary: {
      observers: publisher.getObserverCount(),
      announcements: 2,
      notifications: notificationCenter.snapshot().length,
    },
    logs: logger.snapshot(),
  };
}
