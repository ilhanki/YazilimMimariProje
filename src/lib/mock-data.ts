import {
  type Announcement,
  type AnnouncementCategory,
  type CampusNotification,
  type ServerLoadPoint,
  type TrendPoint,
  type User,
} from './types';

const now = new Date();
const hoursAgo = (value: number) => new Date(now.getTime() - value * 60 * 60 * 1000).toISOString();
const daysAgo = (value: number) => new Date(now.getTime() - value * 24 * 60 * 60 * 1000).toISOString();

export const categoryLabels: Record<AnnouncementCategory, string> = {
  exam: 'Sınav Duyurusu',
  event: 'Etkinlik Duyurusu',
  cafeteria: 'Yemekhane Duyurusu',
  library: 'Kütüphane Duyurusu',
};

export const categoryPills: Record<AnnouncementCategory, string> = {
  exam: 'Sınav',
  event: 'Seminer',
  cafeteria: 'Yemekhane',
  library: 'Kütüphane',
};

export const channelLabels = {
  email: 'E-posta',
  sms: 'SMS',
  push: 'Push',
} as const;

export const notificationChannelLabels = {
  email: 'E-posta',
  sms: 'SMS',
  push: 'Push Bildirimi',
} as const;

export const statusLabels = {
  delivered: 'İletildi',
  sent: 'Gönderildi',
  opened: 'Açıldı',
  queued: 'Sırada',
} as const;

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ahmet Yılmaz',
    role: 'Student',
    avatarSeed: 'ahmet-yilmaz',
    department: 'Bilgisayar Mühendisliği',
    // No contact info provided in demo — preferences should default to disabled
    preferences: { email: false, sms: false, push: true },
  },
  {
    id: 'user-2',
    name: 'Zeynep Kaya',
    role: 'Student',
    avatarSeed: 'zeynep-kaya',
    department: 'Endüstri Mühendisliği',
    // No email/phone provided — ensure toggles are off by default
    preferences: { email: false, sms: false, push: false },
  },
  {
    id: 'user-3',
    name: 'Prof. Dr. Mehmet Öz',
    role: 'Faculty',
    avatarSeed: 'mehmet-oz',
    department: 'Rektörlük / Akademik Kurul',
    email: 'mehmet.oz@univ.edu',
    phone: '05051234567',
    preferences: { email: true, sms: true, push: true },
  },
  {
    id: 'user-4',
    name: 'Ayşe Demir',
    role: 'Student',
    avatarSeed: 'ayse-demir',
    department: 'İşletme',
    email: 'ayse.demir@gmail.com',
    phone: '05059876543',
    preferences: { email: true, sms: true, push: true },
  },
];

export const announcements: Announcement[] = [
  {
    id: 'announce-1',
    title: 'Final Sınav Takvimi',
    category: 'exam',
    audience: 'Tüm öğrenciler',
    audienceScope: 'all-students',
    audienceUserIds: [],
    channel: 'email',
    message:
      '2024-2025 bahar dönemi final sınav takvimi yayımlandı. Sınav giriş bilgileri öğrenci panelinde görüntülenebilir.',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    recipientCount: 1820,
    views: 2400,
    deliveries: 12400,
    successRate: 98,
  },
  {
    id: 'announce-2',
    title: 'AI Semineri',
    category: 'event',
    audience: 'Mühendislik Fakültesi',
    audienceScope: 'all-faculty',
    audienceUserIds: [],
    channel: 'push',
    message:
      'Yapay zeka ve üretken sistemler üzerine çevrim içi seminer, bu akşam saat 19.00’da gerçekleştirilecektir.',
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
    recipientCount: 148,
    views: 1800,
    deliveries: 8560,
    successRate: 96,
  },
  {
    id: 'announce-3',
    title: 'Yeni Yemekhane Menüsü',
    category: 'cafeteria',
    audience: 'Kampüs genelinde',
    audienceScope: 'campus-wide',
    audienceUserIds: [],
    channel: 'sms',
    message:
      'Haftalık menü güncellendi. Öğle yemeğinde sebze çorbası, tavuk soté ve mevsim salatası yer alıyor.',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
    recipientCount: 2847,
    views: 1200,
    deliveries: 6450,
    successRate: 97,
  },
  {
    id: 'announce-4',
    title: 'Kütüphane Uzatılmış Saatler',
    category: 'library',
    audience: 'Sınav haftasındaki tüm kullanıcılar',
    audienceScope: 'selected-users',
    audienceUserIds: ['user-1', 'user-2', 'user-4'],
    channel: 'email',
    message:
      'Kütüphane sınav haftası boyunca her gün 12.00’ye kadar açık kalacaktır. Sessiz çalışma alanı artırılmıştır.',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    recipientCount: 3,
    views: 3100,
    deliveries: 15000,
    successRate: 99,
  },
];

export const notifications: CampusNotification[] = [
  {
    id: 'notif-1',
    channel: 'email',
    status: 'sent',
    title: 'E-posta 2.847 kullanıcıya gönderildi',
    subtitle: 'Final Sınav Takvimi güncellemesi',
    timestamp: hoursAgo(2),
    count: 2847,
  },
  {
    id: 'notif-2',
    channel: 'sms',
    status: 'delivered',
    title: 'SMS 1.234 kullanıcıya teslim edildi',
    subtitle: 'Kütüphane çalışma saatleri hatırlatması',
    timestamp: hoursAgo(5),
    count: 1234,
  },
  {
    id: 'notif-3',
    channel: 'push',
    status: 'sent',
    title: 'Push bildirimi gönderildi',
    subtitle: 'AI Semineri için kayıt yönlendirmesi',
    timestamp: hoursAgo(8),
    count: 0,
  },
  {
    id: 'notif-4',
    channel: 'email',
    status: 'opened',
    title: 'E-posta 567 kullanıcıya gönderildi',
    subtitle: 'Yemekhane menüsü bilgilendirmesi',
    timestamp: hoursAgo(12),
    count: 567,
  },
  {
    id: 'notif-5',
    channel: 'push',
    status: 'delivered',
    title: 'Tüm bildirimler başarıyla iletildi',
    subtitle: 'Sistem sağlığı kontrolü tamamlandı',
    timestamp: hoursAgo(15),
    count: 0,
  },
];

const baseTrendData: Record<string, TrendPoint[]> = {
  '7d': [
    { label: 'Pzt', delivered: 1800, opened: 800, engagement: 24 },
    { label: 'Sal', delivered: 3600, opened: 2100, engagement: 41 },
    { label: 'Çar', delivered: 2800, opened: 1500, engagement: 33 },
    { label: 'Per', delivered: 4000, opened: 2600, engagement: 49 },
    { label: 'Cum', delivered: 2900, opened: 2100, engagement: 38 },
    { label: 'Cmt', delivered: 3200, opened: 1700, engagement: 35 },
    { label: 'Paz', delivered: 4600, opened: 3200, engagement: 57 },
  ],
  '14d': [
    { label: '1', delivered: 1700, opened: 700, engagement: 21 },
    { label: '2', delivered: 2200, opened: 900, engagement: 23 },
    { label: '3', delivered: 2600, opened: 1200, engagement: 29 },
    { label: '4', delivered: 3800, opened: 1800, engagement: 37 },
    { label: '5', delivered: 3000, opened: 1600, engagement: 30 },
    { label: '6', delivered: 3300, opened: 2100, engagement: 40 },
    { label: '7', delivered: 4200, opened: 2500, engagement: 46 },
    { label: '8', delivered: 2800, opened: 1400, engagement: 31 },
    { label: '9', delivered: 3700, opened: 2200, engagement: 43 },
    { label: '10', delivered: 3500, opened: 1900, engagement: 41 },
    { label: '11', delivered: 4500, opened: 2800, engagement: 52 },
    { label: '12', delivered: 3100, opened: 1700, engagement: 36 },
    { label: '13', delivered: 3900, opened: 2400, engagement: 44 },
    { label: '14', delivered: 4700, opened: 3100, engagement: 58 },
  ],
  '30d': Array.from({ length: 10 }).map((_, index) => ({
    label: `${index + 1}`,
    delivered: 2300 + index * 180,
    opened: 1000 + index * 160,
    engagement: 24 + index * 3,
  })),
};

const baseServerLoadData: Record<string, ServerLoadPoint[]> = {
  '7d': [
    { label: 'Pzt', value: 19 },
    { label: 'Sal', value: 24 },
    { label: 'Çar', value: 26 },
    { label: 'Per', value: 22 },
    { label: 'Cum', value: 28 },
    { label: 'Cmt', value: 21 },
    { label: 'Paz', value: 23 },
  ],
  '14d': [
    { label: '1', value: 18 },
    { label: '2', value: 20 },
    { label: '3', value: 22 },
    { label: '4', value: 27 },
    { label: '5', value: 24 },
    { label: '6', value: 23 },
    { label: '7', value: 29 },
    { label: '8', value: 24 },
    { label: '9', value: 25 },
    { label: '10', value: 21 },
    { label: '11', value: 27 },
    { label: '12', value: 23 },
    { label: '13', value: 28 },
    { label: '14', value: 26 },
  ],
  '30d': Array.from({ length: 10 }).map((_, index) => ({
    label: `${index + 1}`,
    value: 18 + (index % 5) * 2 + index,
  })),
};

export function getTrendData(range: '7d' | '14d' | '30d') {
  return baseTrendData[range];
}

export function getServerLoadData(range: '7d' | '14d' | '30d') {
  return baseServerLoadData[range];
}

export function getSuccessRate(range: '7d' | '14d' | '30d') {
  if (range === '7d') {
    return 98.7;
  }

  if (range === '14d') {
    return 97.9;
  }

  return 97.4;
}

export function getRangeLabel(range: '7d' | '14d' | '30d') {
  if (range === '7d') {
    return 'Son 7 Gün';
  }

  if (range === '14d') {
    return 'Son 14 Gün';
  }

  return 'Son 30 Gün';
}
