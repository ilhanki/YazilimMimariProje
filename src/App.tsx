import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  CircleAlert,
  CircleGauge,
  Edit3,
  EllipsisVertical,
  ExternalLink,
  FilePlus2,
  Globe,
  GraduationCap,
  Hash,
  LayoutDashboard,
  LineChart,
  LogOut,
  Mail,
  Menu,
  Mic,
  MoonStar,
  PenLine,
  Search,
  Settings,
  Share2,
  Sparkles,
  SunMedium,
  Trash2,
  University,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart as ReLineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Divider,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  ToastProvider,
  useToast,
} from './components/ui';
import {
  announcements as initialAnnouncements,
  categoryLabels,
  categoryPills,
  getRangeLabel,
  getServerLoadData,
  getSuccessRate,
  getTrendData,
  notificationChannelLabels,
  notifications as initialNotifications,
  users as initialUsers,
} from './lib/mock-data';
import {
  type Announcement,
  type AnnouncementCategory,
  type AnnouncementFormValues,
  type AudienceScope,
  type CampusNotification,
  type NavigationKey,
  type NotificationChannel,
  type UserFormValues,
  type ThemeMode,
  type User,
} from './lib/types';
import { cn, formatNumber, formatTimeAgo, getInitials, getThemeClass, normalizeText } from './lib/utils';

type SearchResult = {
  id: string;
  type: 'user' | 'announcement' | 'notification';
  label: string;
  description: string;
};

const navItems: Array<{ key: NavigationKey; label: string; icon: React.ReactNode }> = [
  { key: 'dashboard', label: 'Gösterge Paneli', icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: 'announcements', label: 'Duyurular', icon: <FilePlus2 className="h-4 w-4" /> },
  { key: 'notifications', label: 'Bildirimler', icon: <Bell className="h-4 w-4" /> },
  { key: 'users', label: 'Kullanıcılar', icon: <Users className="h-4 w-4" /> },
  { key: 'analytics', label: 'Analitik', icon: <LineChart className="h-4 w-4" /> },
  { key: 'settings', label: 'Ayarlar', icon: <Settings className="h-4 w-4" /> },
];

const categoryOptions: AnnouncementCategory[] = ['exam', 'event', 'cafeteria', 'library'];
const notificationChannelOptions: Array<'all' | NotificationChannel> = ['all', 'email', 'sms', 'push'];
const notificationStatusOptions: Array<'all' | CampusNotification['status']> = ['all', 'sent', 'delivered', 'opened', 'queued'];
const timeRangeOptions: Array<'7d' | '14d' | '30d'> = ['7d', '14d', '30d'];
const audienceScopeOptions: AudienceScope[] = ['campus-wide', 'all-students', 'all-faculty', 'selected-users'];

const audienceScopeLabels: Record<AudienceScope, string> = {
  'campus-wide': 'Kampüs geneli',
  'all-students': 'Tüm öğrenciler',
  'all-faculty': 'Tüm akademik personel',
  'selected-users': 'Seçili kullanıcılar',
};

const audienceScopeDescriptions: Record<AudienceScope, string> = {
  'campus-wide': 'Kampüsteki tüm hesaplara gönderilir.',
  'all-students': 'Yalnızca öğrenci hesapları seçilir.',
  'all-faculty': 'Yalnızca akademik personel seçilir.',
  'selected-users': 'Belirli kullanıcılar tek tek seçilir.',
};

const userRoleOptions: Array<{ value: UserFormValues['role']; label: string }> = [
  { value: 'Student', label: 'Öğrenci' },
  { value: 'Faculty', label: 'Akademisyen' },
  { value: 'Admin', label: 'Yönetici' },
];

const navSectionMap: Record<NavigationKey, string> = {
  dashboard: 'dashboard-section',
  announcements: 'announcement-section',
  notifications: 'notification-section',
  users: 'preferences-section',
  analytics: 'analytics-section',
  settings: 'settings-section',
};

function App() {
  return (
    <ToastProvider>
      <DashboardApp />
    </ToastProvider>
  );
}

function maskPhone(phone?: string) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return phone;
  const first = digits.slice(0, 4);
  const last = digits.slice(-4);
  return `${first}•••${last}`;
}

function DashboardApp() {
  const { pushToast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = window.localStorage.getItem('smart-campus-theme');
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState<NavigationKey>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [announcementFilter, setAnnouncementFilter] = useState<'all' | AnnouncementCategory>('all');
  const [notificationChannelFilter, setNotificationChannelFilter] = useState<'all' | NotificationChannel>('all');
  const [notificationStatusFilter, setNotificationStatusFilter] = useState<'all' | CampusNotification['status']>('all');
  const [range, setRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notifications] = useState(initialNotifications);
  const [detailAnnouncement, setDetailAnnouncement] = useState<Announcement | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const announcementSectionId = 'announcement-section';
  const notificationSectionId = 'notification-section';
  const analyticsSectionId = 'analytics-section';
  const preferencesSectionId = 'preferences-section';

  const scrollToSection = (sectionId: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setCreateUserOpen(true);
  };

  const handleNavChange = (key: NavigationKey) => {
    setActiveNav(key);
    setSidebarOpen(false);
    scrollToSection(navSectionMap[key]);
  };

  useEffect(() => {
    window.localStorage.setItem('smart-campus-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(getThemeClass(theme === 'light'));
  }, [theme]);

  const trendData = useMemo(() => getTrendData(range), [range]);
  const serverLoadData = useMemo(() => getServerLoadData(range), [range]);
  const successRate = useMemo(() => getSuccessRate(range), [range]);
  const rangeLabel = useMemo(() => getRangeLabel(range), [range]);

  const totalUsers = users.length;
  const activeNotifications = notifications.filter((item) => item.status !== 'opened').length;
  const todayAnnouncements = announcements.filter((announcement) => {
    const createdAt = new Date(announcement.createdAt);
    const now = new Date();
    return (
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    );
  }).length;
  const averageSuccessRate = announcements.length
    ? Math.round(announcements.reduce((total, item) => total + item.successRate, 0) / announcements.length)
    : 0;

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => announcementFilter === 'all' || announcement.category === announcementFilter);
  }, [announcementFilter, announcements]);

  const filteredUsers = useMemo(() => {
    return users;
  }, [users]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesChannel = notificationChannelFilter === 'all' || notification.channel === notificationChannelFilter;
      const matchesStatus = notificationStatusFilter === 'all' || notification.status === notificationStatusFilter;
      return matchesChannel && matchesStatus;
    });
  }, [notificationChannelFilter, notificationStatusFilter, notifications]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = normalizeText(searchTerm.trim());
    if (!query) return [];

    const userResults = users
      .filter((user) =>
        [user.name, user.department ?? '', user.role === 'Student' ? 'Öğrenci' : user.role === 'Faculty' ? 'Akademisyen' : 'Yönetici'].some((value) =>
          normalizeText(value).includes(query),
        ),
      )
      .map((user) => ({
        id: `user-${user.id}`,
        type: 'user' as const,
        label: user.name,
        description: user.department ?? 'Kullanıcı',
      }));

    const announcementResults = announcements
      .filter((announcement) =>
        [announcement.title, announcement.message, announcement.audience, categoryLabels[announcement.category]].some((value) =>
          normalizeText(value).includes(query),
        ),
      )
      .map((announcement) => ({
        id: `announcement-${announcement.id}`,
        type: 'announcement' as const,
        label: announcement.title,
        description: categoryLabels[announcement.category],
      }));

    const notificationResults = notifications
      .filter((notification) => normalizeText(notification.title + notification.subtitle).includes(query))
      .map((notification) => ({
        id: `notification-${notification.id}`,
        type: 'notification' as const,
        label: notification.title,
        description: notification.subtitle,
      }));

    return [...userResults, ...announcementResults, ...notificationResults].slice(0, 8);
  }, [announcements, notifications, searchTerm, users]);

  // Show unread count across all notifications (not filtered) so badges reflect real totals
  const unreadNotificationCount = notifications.filter((item) => item.status !== 'opened').length;

  const resolveAudience = (scope: AudienceScope, selectedUserIds: string[]) => {
    if (scope === 'campus-wide') {
      return { label: 'Kampüs geneli', count: users.length };
    }

    if (scope === 'all-students') {
      const count = users.filter((user) => user.role === 'Student').length;
      return { label: 'Tüm öğrenciler', count };
    }

    if (scope === 'all-faculty') {
      const count = users.filter((user) => user.role === 'Faculty').length;
      return { label: 'Tüm akademik personel', count };
    }

    const selectedUsers = users.filter((user) => selectedUserIds.includes(user.id));
    return {
      label: selectedUsers.length ? selectedUsers.map((user) => user.name).join(', ') : 'Seçili kullanıcılar',
      count: selectedUsers.length,
    };
  };

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: totalUsers,
      delta: '+12,5%',
      deltaLabel: 'geçen aya göre',
      icon: <Users className="h-5 w-5" />,
      accent: 'from-sky-500/30 to-indigo-500/10',
      lineColor: '#4f86ff',
      data: [6, 8, 7, 10, 8, 9, 12],
    },
    {
      title: 'Aktif Bildirim',
      value: activeNotifications,
      delta: '+8,2%',
      deltaLabel: 'dünden beri',
      icon: <Bell className="h-5 w-5" />,
      accent: 'from-violet-500/30 to-indigo-500/10',
      lineColor: '#8b5cf6',
      data: [4, 5, 5, 8, 6, 7, 9],
    },
    {
      title: 'Bugünkü Duyuru',
      value: todayAnnouncements,
      delta: '+15,3%',
      deltaLabel: 'dünden beri',
      icon: <University className="h-5 w-5" />,
      accent: 'from-emerald-500/25 to-indigo-500/10',
      lineColor: '#34d399',
      data: [3, 4, 4, 5, 4, 5, 6],
    },
    {
      title: 'Teslim Başarı Oranı',
      value: averageSuccessRate,
      delta: '+2,1%',
      deltaLabel: 'son duyurulara göre',
      icon: <CircleGauge className="h-5 w-5" />,
      accent: 'from-amber-500/25 to-indigo-500/10',
      lineColor: '#f59e0b',
      data: [90, 92, 95, 93, 96, 98, 99],
    },
  ];

  const handleThemeToggle = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    // Disable light theme in demo: show warning and do not switch
    if (nextTheme === 'light') {
      pushToast({
        title: 'Açık tema devre dışı',
        description: 'Açık tema bu demo sürümünde devre dışıdır.',
        variant: 'warning',
      });
      return;
    }

    setTheme(nextTheme);
    pushToast({ title: 'Koyu tema etkinleştirildi', description: 'Panel görünümü koyu moda ayarlandı.' });
  };

  const handleCategoryClick = (category: AnnouncementCategory) => {
    setAnnouncementFilter(category);
    setActiveNav('announcements');
    scrollToSection(announcementSectionId);
  };

  const handleOpenAnnouncements = () => {
    setAnnouncementFilter('all');
    setActiveNav('announcements');
    scrollToSection(announcementSectionId);
  };

  const handleOpenNotifications = () => {
    setNotificationChannelFilter('all');
    setNotificationStatusFilter('all');
    setActiveNav('notifications');
    scrollToSection(notificationSectionId);
  };

  const handleOpenUsers = () => {
    setActiveNav('users');
    scrollToSection(preferencesSectionId);
  };

  const handleOpenAnalytics = () => {
    setActiveNav('analytics');
    scrollToSection(analyticsSectionId);
  };

  const handleSupportCenter = () => {
    setActiveNav('settings');
    pushToast({ title: 'Destek merkezi açıldı', description: 'Yardım talebiniz için yönetici paneline yönlendirildiniz.', variant: 'success' });
    scrollToSection(preferencesSectionId);
  };

  const handleBellClick = () => {
    handleOpenNotifications();
    pushToast({ title: 'Bildirimler görüntüleniyor', description: 'Aktif bildirim akışına odaklanıldı.' });
  };

  const handleProfileAction = (action: 'profile' | 'settings' | 'logout') => {
    if (action === 'profile') {
      setActiveNav('users');
      handleOpenUsers();
      pushToast({ title: 'Profil sayfası seçildi', description: 'Kullanıcı bilgileri bölümüne geçildi.' });
      return;
    }

    if (action === 'settings') {
      setActiveNav('settings');
      pushToast({ title: 'Ayarlar sayfası seçildi', description: 'Sistem yapılandırma alanına geçildi.' });
      return;
    }

    pushToast({ title: 'Çıkış işlemi hazır', description: 'Bu proje demo olduğu için oturum kapatma yalnızca bilgilendirme amaçlıdır.', variant: 'warning' });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSearchTerm(value);
  };

  const handleSearchSubmit = () => {
    const firstResult = searchResults[0];
    if (!firstResult) {
      pushToast({ title: 'Sonuç bulunamadı', description: 'Arama kriterine uygun kayıt yok.', variant: 'warning' });
      return;
    }

    handleSearchResultSelect(firstResult);
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    setSearchFocused(false);
    if (result.type === 'user') {
      setActiveNav('users');
      scrollToSection(preferencesSectionId);
      return;
    }

    if (result.type === 'announcement') {
      setActiveNav('announcements');
      scrollToSection(announcementSectionId);
      return;
    }

    setActiveNav('notifications');
    scrollToSection(notificationSectionId);
  };

  // In-app delete confirmation flows
  const [pendingDeleteAnnouncementId, setPendingDeleteAnnouncementId] = useState<string | null>(null);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const requestDeleteAnnouncement = (id: string) => {
    setPendingDeleteAnnouncementId(id);
  };

  const performDeleteAnnouncement = () => {
    const id = pendingDeleteAnnouncementId;
    if (!id) return;
    setAnnouncements((current) => current.filter((announcement) => announcement.id !== id));
    if (detailAnnouncement?.id === id) {
      setDetailAnnouncement(null);
      setDetailDialogOpen(false);
    }
    setPendingDeleteAnnouncementId(null);
    pushToast({ title: 'Duyuru silindi', description: 'Kayıt yerel durumdan kaldırıldı.', variant: 'warning' });
  };

  const requestDeleteUser = (id: string) => {
    setPendingDeleteUserId(id);
  };

  const performDeleteUser = () => {
    const userId = pendingDeleteUserId;
    if (!userId) return;
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    setUsers((current) => current.filter((u) => u.id !== userId));
    setAnnouncements((current) => current.map((a) => ({ ...a, audienceUserIds: a.audienceUserIds?.filter((id) => id !== userId) ?? [] })));
    setPendingDeleteUserId(null);
    pushToast({ title: 'Kullanıcı silindi', description: `${target.name} listeden kaldırıldı.`, variant: 'destructive' });
  };

  const cancelPendingDelete = () => {
    setPendingDeleteAnnouncementId(null);
    setPendingDeleteUserId(null);
  };

  const handleSaveAnnouncement = (values: AnnouncementFormValues) => {
    const isEditing = Boolean(editingAnnouncement);
    if (values.audienceScope === 'selected-users' && values.audienceUserIds.length === 0) {
      pushToast({ title: 'Hedef kitle seçilmedi', description: 'Seçili kullanıcılar için en az bir kişi seçmelisiniz.', variant: 'warning' });
      return;
    }

    const audience = resolveAudience(values.audienceScope, values.audienceUserIds);
    const timestamp = new Date().toISOString();
    const channelEfficiency: Record<NotificationChannel, number> = {
      email: 0.97,
      sms: 0.94,
      push: 0.91,
    };
    const openRate: Record<NotificationChannel, number> = {
      email: 0.68,
      sms: 0.22,
      push: 0.43,
    };
    const recipientCount = audience.count;
    const deliveries = Math.max(1, Math.round(recipientCount * channelEfficiency[values.channel]));
    const views = Math.max(1, Math.round(deliveries * openRate[values.channel]));
    const successRateValue = recipientCount > 0 ? Math.min(99.9, Math.round((deliveries / recipientCount) * 1000) / 10) : 0;
    const nextAnnouncement: Announcement = {
      id: editingAnnouncement?.id ?? `announce-${Date.now()}`,
      title: values.title,
      category: values.category,
      audience: audience.label,
      audienceScope: values.audienceScope,
      audienceUserIds: values.audienceUserIds,
      channel: values.channel,
      message: values.message,
      createdAt: editingAnnouncement?.createdAt ?? timestamp,
      updatedAt: timestamp,
      recipientCount,
      views,
      deliveries,
      successRate: successRateValue,
    };

    setAnnouncements((current) => {
      const exists = current.some((announcement) => announcement.id === nextAnnouncement.id);
      if (exists) {
        return current.map((announcement) => (announcement.id === nextAnnouncement.id ? nextAnnouncement : announcement));
      }

      return [nextAnnouncement, ...current];
    });

    setEditingAnnouncement(null);
    setCreateOpen(false);
    setDetailAnnouncement(nextAnnouncement);
    setDetailDialogOpen(true);
    pushToast({
      title: isEditing ? 'Duyuru güncellendi' : 'Yeni duyuru oluşturuldu',
      description: `${nextAnnouncement.title} kaydedildi ve listeye eklendi.`,
      variant: 'success',
    });
  };

  const handleSaveUser = (values: UserFormValues) => {
    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: values.name,
        role: values.role,
        avatarSeed: values.name,
        department: values.department,
        email: values.email ? values.emailAddress ?? undefined : undefined,
        phone: values.sms ? values.phone ?? undefined : undefined,
        preferences: {
          email: values.email,
          sms: values.sms,
          push: values.push,
        },
      };

      setUsers((current) => current.map((u) => (u.id === editingUser.id ? updated : u)));
      setEditingUser(null);
      setCreateUserOpen(false);
      pushToast({ title: 'Kullanıcı güncellendi', description: `${updated.name} bilgileri güncellendi.`, variant: 'success' });
      return;
    }

    const nextUser: User = {
      id: `user-${Date.now()}`,
      name: values.name,
      role: values.role,
      avatarSeed: values.name,
      department: values.department,
      email: values.email ? values.emailAddress ?? undefined : undefined,
      phone: values.sms ? values.phone ?? undefined : undefined,
      preferences: {
        email: values.email,
        sms: values.sms,
        push: values.push,
      },
    };

    setUsers((current) => [nextUser, ...current]);
    setCreateUserOpen(false);
    pushToast({ title: 'Yeni kişi eklendi', description: `${nextUser.name} kullanıcı listesine eklendi.`, variant: 'success' });
  };

  const handleTogglePreference = (userId: string, channel: NotificationChannel, nextValue: boolean) => {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== userId) return user;

        // Prevent enabling a channel if the user has no contact info
        if (nextValue) {
          if (channel === 'email' && !user.email) {
            pushToast({ title: 'E-posta mevcut değil', description: `${user.name} için e-posta adresi yok.`, variant: 'warning' });
            return user;
          }

          if (channel === 'sms' && !user.phone) {
            pushToast({ title: 'Telefon numarası mevcut değil', description: `${user.name} için telefon numarası yok.`, variant: 'warning' });
            return user;
          }
        }

        return {
          ...user,
          preferences: {
            ...user.preferences,
            [channel]: nextValue,
          },
        };
      }),
    );
  };

  const handleDeleteUser = (userId: string) => {
    requestDeleteUser(userId);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setCreateOpen(true);
  };

  const emptyState = filteredAnnouncements.length === 0 ? 'Arama veya filtreye uygun duyuru bulunamadı.' : null;
  const userEmptyState = users.length === 0 ? 'Sistemde kayıtlı kullanıcı bulunamadı.' : null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.04] dark:opacity-[0.08]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_32%)]" />

      <div className="relative flex min-h-screen w-full">
        <Sidebar
          activeNav={activeNav}
          collapsed={sidebarCollapsed}
          open={sidebarOpen}
          notificationsCount={unreadNotificationCount}
          onCollapseToggle={() => setSidebarCollapsed((current) => !current)}
          onNavChange={handleNavChange}
          onCloseMobile={() => setSidebarOpen(false)}
          onSupportClick={handleSupportCenter}
        />

        <div className={cn('flex min-w-0 flex-1 flex-col transition-[margin] duration-300', sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72')}>
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            theme={theme}
            onThemeToggle={handleThemeToggle}
            unreadCount={unreadNotificationCount}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            searchResults={searchResults}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            onSearchResultSelect={handleSearchResultSelect}
            onBellClick={handleBellClick}
            onProfileAction={handleProfileAction}
          />

          <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div id={navSectionMap.dashboard} className="space-y-6">
                <HeroBanner onCreateAnnouncement={() => setCreateOpen(true)} onViewAnalytics={handleOpenAnalytics} />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card, index) => (
                    <StatCard key={card.title} index={index} {...card} />
                  ))}
                </section>

                <Card id={announcementSectionId}>
                  <CardHeader className="flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Son Duyurular</CardTitle>
                      <CardDescription>Filtre, arama ve kategori etkileşimleriyle dinamik duyuru listesi</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={announcementFilter === 'all' ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => setAnnouncementFilter('all')}>
                        Tümü
                      </Badge>
                      {categoryOptions.map((category) => (
                        <Badge
                          key={category}
                          variant={announcementFilter === category ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {categoryPills[category]}
                        </Badge>
                      ))}
                      <Button
                        size="sm"
                        className="ml-auto"
                        onClick={() => {
                          setEditingAnnouncement(null);
                          setCreateOpen(true);
                        }}
                      >
                        <PenLine className="h-4 w-4" />
                        Yeni Duyuru
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {emptyState ? (
                      <EmptyBlock title="Duyuru bulunamadı" description={emptyState} />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                          {filteredAnnouncements.map((announcement, index) => (
                            <motion.div
                              key={announcement.id}
                              layout
                              initial={{ opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.28, delay: index * 0.03 }}
                            >
                              <AnnouncementCard
                                announcement={announcement}
                                onClick={() => {
                                  setDetailAnnouncement(announcement);
                                  setDetailDialogOpen(true);
                                }}
                                onEdit={() => openEditDialog(announcement)}
                                onDelete={() => requestDeleteAnnouncement(announcement.id)}
                                onCategoryClick={() => handleCategoryClick(announcement.category)}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div id={analyticsSectionId}>
                    <AnalyticsCard range={range} setRange={setRange} trendData={trendData} successRate={successRate} rangeLabel={rangeLabel} serverLoadData={serverLoadData} />
                  </div>
                  <div className="space-y-6">
                    <StatusCard loadData={serverLoadData} />
                    <SupportCard onSupportClick={handleSupportCenter} />
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div id={notificationSectionId}>
                  <NotificationPanel
                    notifications={filteredNotifications}
                    channelFilter={notificationChannelFilter}
                    statusFilter={notificationStatusFilter}
                    setChannelFilter={setNotificationChannelFilter}
                    setStatusFilter={setNotificationStatusFilter}
                    onViewAll={handleOpenNotifications}
                  />
                </div>

                <div id={preferencesSectionId}>
                  <UserPreferencesPanel
                    users={filteredUsers}
                    onTogglePreference={handleTogglePreference}
                    emptyState={userEmptyState}
                    onViewAll={handleOpenUsers}
                    onCreateUser={() => setCreateUserOpen(true)}
                    onEditUser={openEditUser}
                    onDeleteUser={requestDeleteUser}
                  />
                </div>

                <div id={navSectionMap.settings} />
              </aside>
            </div>
          </main>
        </div>
      </div>

      <AnnouncementDialog
        open={createOpen}
        setOpen={setCreateOpen}
        announcement={editingAnnouncement}
        onSave={handleSaveAnnouncement}
        availableUsers={users}
        onOpenChange={(next) => {
          setCreateOpen(next);
          if (!next) {
            setEditingAnnouncement(null);
          }
        }}
      />

      <AnnouncementDetailDialog
        announcement={detailAnnouncement}
        open={detailDialogOpen}
        onOpenChange={(next) => {
          setDetailDialogOpen(next);
          if (!next) {
            setDetailAnnouncement(null);
          }
        }}
        onEdit={() => {
          if (detailAnnouncement) {
            openEditDialog(detailAnnouncement);
          }
        }}
        onDelete={() => {
          if (detailAnnouncement) {
            requestDeleteAnnouncement(detailAnnouncement.id);
          }
        }}
      />

      <UserDialog open={createUserOpen} onOpenChange={(next) => {
        setCreateUserOpen(next);
        if (!next) setEditingUser(null);
      }} onSave={handleSaveUser} editingUser={editingUser} />

      <DeleteConfirmDialog
        open={Boolean(pendingDeleteAnnouncementId)}
        title="Duyuruyu sil"
        description="Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Duyuruyu Sil"
        confirmVariant="destructive"
        onConfirm={performDeleteAnnouncement}
        onCancel={cancelPendingDelete}
      />

      <DeleteConfirmDialog
        open={Boolean(pendingDeleteUserId)}
        title="Kullanıcıyı sil"
        description="Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Kullanıcıyı Sil"
        confirmVariant="destructive"
        onConfirm={performDeleteUser}
        onCancel={cancelPendingDelete}
      />
    </div>
  );
}

function Sidebar({
  activeNav,
  collapsed,
  open,
  notificationsCount,
  onNavChange,
  onCollapseToggle,
  onCloseMobile,
  onSupportClick,
}: {
  activeNav: NavigationKey;
  collapsed: boolean;
  open: boolean;
  notificationsCount: number;
  onNavChange: (key: NavigationKey) => void;
  onCollapseToggle: () => void;
  onCloseMobile: () => void;
  onSupportClick: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Yan menüyü kapat"
        onClick={onCloseMobile}
        className={cn('fixed inset-0 z-30 bg-slate-950/60 transition-opacity lg:hidden', open ? 'opacity-100' : 'pointer-events-none opacity-0')}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[var(--sidebar)]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-72',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className={cn('flex items-center justify-between gap-3 border-b border-white/10 p-4', collapsed && 'lg:justify-center')}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-on-accent shadow-[0_12px_30px_rgba(99,102,241,0.35)]">
              <p className="truncate text-xs text-slate-400">Bildirim ve Duyuru Sistemi</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onCollapseToggle}>
            <ChevronsUpDown className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavChange(item.key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition-all duration-200',
                  active ? 'bg-gradient-to-r from-indigo-500/90 to-violet-500/80 text-on-accent shadow-[0_16px_30px_rgba(99,102,241,0.2)]' : 'text-slate-300 hover:bg-white/8 hover:text-[var(--foreground)]',
                  collapsed && 'lg:justify-center lg:px-0',
                )}
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/6">
                  {item.icon}
                  {item.key === 'notifications' ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-on-accent">
                      {notificationsCount}
                    </span>
                  ) : null}
                </span>
                <span className={cn('font-medium transition-all duration-200', collapsed && 'lg:hidden')}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-3 p-4">
          <Card className="bg-[var(--card-strong)]">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <p className={cn('text-sm font-semibold text-[var(--foreground)]', collapsed && 'lg:hidden')}>Sistem Durumu</p>
                <Badge variant="success" className={cn(collapsed && 'lg:hidden')}>
                  Çevrimiçi
                </Badge>
              </div>
              <div className={cn('space-y-1.5', collapsed && 'lg:hidden')}>
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.75)]" />
                  Tüm sistemler çevrimiçi
                </div>
                <div className="text-xs text-slate-400">Sunucu yükü %23 seviyesinde.</div>
              </div>
              <MiniSparkline values={[17, 21, 19, 24, 22, 25, 23]} color="#4f86ff" collapsed={collapsed} />
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-strong)]">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-indigo-200">
                  <Mic className="h-4 w-4" />
                </div>
                <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
                    <p className="text-on-accent text-sm font-semibold">Yardıma mı ihtiyacınız var?</p>
                  <p className="text-xs text-slate-400">Destek ile iletişime geçin</p>
                </div>
              </div>
              <Button variant="outline" className={cn('w-full justify-between', collapsed && 'lg:hidden')} onClick={onSupportClick}>
                Destek Merkezi
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  onMenuClick,
  theme,
  onThemeToggle,
  unreadCount,
  profileOpen,
  setProfileOpen,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchResults,
  searchFocused,
  setSearchFocused,
  onSearchResultSelect,
  onBellClick,
  onProfileAction,
}: {
  onMenuClick: () => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  unreadCount: number;
  profileOpen: boolean;
  setProfileOpen: (value: boolean) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchResults: SearchResult[];
  searchFocused: boolean;
  setSearchFocused: (value: boolean) => void;
  onSearchResultSelect: (result: SearchResult) => void;
  onBellClick: () => void;
  onProfileAction: (action: 'profile' | 'settings' | 'logout') => void;
}) {
  const showSearchResults = searchFocused && searchValue.trim().length > 0;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[color:var(--background)]/80 backdrop-blur-2xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>

        <div className="relative max-w-3xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-11"
            placeholder="Duyuru, kullanıcı veya bildirim ara..."
            value={searchValue}
            onMouseDown={() => setSearchFocused(true)}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSearchSubmit();
              }
            }}
          />
          {showSearchResults ? (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[22px] border border-white/10 bg-[var(--card)] shadow-[0_24px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
              <div className="border-b border-white/8 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                Sonuçlar
              </div>
              <div className="max-h-72 overflow-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white/8"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onSearchResultSelect(result)}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">{result.label}</p>
                        <p className="truncate text-xs text-slate-400">
                          {result.type === 'user' ? 'Kullanıcı' : result.type === 'announcement' ? 'Duyuru' : 'Bildirim'} · {result.description}
                        </p>
                      </div>
                      <span className="ml-3 shrink-0 text-xs text-slate-500">Git</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-slate-400">Eşleşme bulunamadı.</div>
                )}
              </div>
            </div>
          ) : null}
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-xl border border-white/10 bg-white/6 px-2 py-1 text-[10px] text-slate-300 md:flex">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.75)]" />
            Çevrimiçi
          </div>
          <Button variant="glass" size="icon" onClick={onThemeToggle} aria-label="Tema değiştir">
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          <Button variant="glass" size="icon" className="relative" onClick={onBellClick}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-on-accent">
                {unreadCount}
              </span>
            ) : null}
          </Button>
          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-2 py-1.5 pr-3 text-left transition hover:bg-white/8">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/9.x/thumbs/svg?seed=Admin" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Admin</p>
                  <p className="text-xs text-slate-400">Sistem Yöneticisi</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12}>
              <DropdownMenuLabel>Yönetici Hesabı</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onProfileAction('profile')}>
                <Users className="h-4 w-4 text-slate-400" />
                Profilim
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onProfileAction('settings')}>
                <Settings className="h-4 w-4 text-slate-400" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onProfileAction('logout')}>
                <LogOut className="h-4 w-4 text-slate-400" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function HeroBanner({ onCreateAnnouncement, onViewAnalytics }: { onCreateAnnouncement: () => void; onViewAnalytics: () => void }) {
  return (
    <Card className="overflow-hidden border-white/10">
      <CardContent className="relative grid gap-8 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:p-8">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
            Sistem çevrimiçi ve normal şekilde çalışıyor
          </div>
          <div className="space-y-2">
            <p className="text-on-accent text-sm text-slate-300/80">Tek panelde duyurular, bildirimler ve performans yönetimi</p>
            <h1 className="text-on-accent max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              Akıllı Kampüs Sistemine Hoş Geldiniz
            </h1>
            <p className="text-on-accent max-w-2xl text-sm leading-7 text-slate-300/80 sm:text-base">
              Duyuruları yönetin, hedef kitleleri seçin, çok kanallı bildirimler gönderin ve teslim başarısını gerçek zamanlı olarak izleyin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={onCreateAnnouncement}>
              <Sparkles className="h-4 w-4" />
              Yeni Duyuru Oluştur
            </Button>
            <Button variant="outline" onClick={onViewAnalytics}>Kampüs Akışını Görüntüle</Button>
          </div>
        </div>

        <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.22),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
          <div className="absolute left-8 top-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.18)] animate-floaty">
            <Mail className="h-7 w-7" />
          </div>
          <div className="absolute right-8 top-14 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200 shadow-[0_0_30px_rgba(167,139,250,0.22)] animate-floaty" style={{ animationDelay: '0.8s' }}>
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="absolute right-12 bottom-16 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,0.18)] animate-floaty" style={{ animationDelay: '1.4s' }}>
            <Share2 className="h-7 w-7" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(99,102,241,0.28),rgba(99,102,241,0.05)_60%,transparent_70%)] blur-0" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-indigo-500/30 to-violet-500/20 shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-floaty">
              <Bell className="h-10 w-10 text-on-accent" />
              <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-on-accent shadow-[0_0_20px_rgba(255,255,255,0.18)] animate-pulseSoft">
                <CircleAlert className="h-4 w-4" />
              </span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs text-[var(--foreground)] shadow-glow backdrop-blur-xl">
              Canlı bildirim akışı ve teslim telemetrisi
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon,
  accent,
  lineColor,
  data,
  index,
}: {
  title: string;
  value: number;
  delta: string;
  deltaLabel: string;
  icon: React.ReactNode;
  accent: string;
  lineColor: string;
  data: number[];
  index: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
      <Card className="group overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
        <CardContent className="space-y-4 p-4">
          <div className={cn('flex items-start justify-between rounded-[24px] bg-gradient-to-br p-4', accent)}>
            <div>
              <p className="text-sm text-slate-300/80">{title}</p>
              <div className="mt-2 flex items-end gap-2">
                <h3 className="text-3xl font-semibold tracking-tight text-on-accent">
                  {title.includes('Oranı') ? `${value.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : formatNumber(value)}
                </h3>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-on-accent">{icon}</div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span>▲</span>
              <span>{delta}</span>
            </div>
            <span>{deltaLabel}</span>
          </div>
          <MiniSparkline values={data} color={lineColor} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnnouncementCard({
  announcement,
  onClick,
  onEdit,
  onDelete,
  onCategoryClick,
}: {
  announcement: Announcement;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCategoryClick: () => void;
}) {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
      <CardContent className="flex h-full flex-col gap-4 p-4" style={{ color: 'var(--foreground)' }}>
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onClick} className="flex-1 text-left" style={{ color: 'inherit' }}>
            <div className="flex items-center gap-2">
              <Badge className="cursor-pointer" onClick={(event) => {
                event.stopPropagation();
                onCategoryClick();
              }}>
                {categoryPills[announcement.category]}
              </Badge>
              <span className="text-xs text-slate-400">{formatTimeAgo(announcement.createdAt)}</span>
            </div>
            <h4 className="mt-3 text-base font-semibold text-[var(--foreground)] transition group-hover:text-indigo-600">{announcement.title}</h4>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="rounded-xl p-2 text-slate-400 transition hover:bg-white/8 hover:text-[var(--foreground)]">
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Duyuru İşlemleri</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onEdit}>
                <Edit3 className="h-4 w-4 text-slate-400" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onClick}>
                <ExternalLink className="h-4 w-4 text-slate-400" />
                Ayrıntıları Aç
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onDelete} className="text-rose-200 focus:bg-rose-500/15">
                <Trash2 className="h-4 w-4 text-rose-300" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-300/80">{announcement.message}</p>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
          <MetricPill icon={<Globe className="h-3.5 w-3.5" />} label={`${formatNumber(announcement.views)}`} helper="görüntüleme" />
          <MetricPill icon={<SendIcon channel={announcement.channel} />} label={`${formatNumber(announcement.deliveries)}`} helper="teslim" />
          <MetricPill icon={<CheckCircle2 className="h-3.5 w-3.5" />} label={`${announcement.successRate}%`} helper="başarı" />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricPill({ icon, label, helper }: { icon: React.ReactNode; label: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <span className="font-semibold text-[var(--foreground)]">{label}</span>
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{helper}</div>
    </div>
  );
}

function SendIcon({ channel }: { channel: NotificationChannel }) {
  if (channel === 'email') {
    return <Mail className="h-3.5 w-3.5" />;
  }

  if (channel === 'sms') {
    return <Hash className="h-3.5 w-3.5" />;
  }

  return <Globe className="h-3.5 w-3.5" />;
}

function MiniSparkline({ values, color, collapsed }: { values: number[]; color: string; collapsed?: boolean }) {
  const width = 120;
  const height = 38;
  const padding = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={cn('w-full', collapsed && 'lg:max-w-[120px]')}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full overflow-visible">
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <polygon fill={`url(#spark-${color.replace('#', '')})`} points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} />
      </svg>
    </div>
  );
}

function NotificationPanel({
  notifications,
  channelFilter,
  statusFilter,
  setChannelFilter,
  setStatusFilter,
  onViewAll,
}: {
  notifications: CampusNotification[];
  channelFilter: 'all' | NotificationChannel;
  statusFilter: 'all' | CampusNotification['status'];
  setChannelFilter: (value: 'all' | NotificationChannel) => void;
  setStatusFilter: (value: 'all' | CampusNotification['status']) => void;
  onViewAll: () => void;
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Bildirim Aktivitesi</CardTitle>
            <CardDescription>Kanala ve duruma göre filtrelenebilir canlı akış</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Tümünü Gör
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as 'all' | NotificationChannel)}
            className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
          >
            <option value="all">Tüm Kanallar</option>
            <option value="email">E-posta</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | CampusNotification['status'])}
            className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="sent">Gönderildi</option>
            <option value="delivered">İletildi</option>
            <option value="opened">Açıldı</option>
            <option value="queued">Sırada</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <EmptyBlock title="Kayıt yok" description="Seçili filtreler için eşleşen bildirim bulunamadı." />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="flex gap-3"
              >
                <NotificationBadge channel={notification.channel} status={notification.status} />
                <div className="min-w-0 flex-1 border-b border-white/8 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{notification.subtitle}</p>
                    </div>
                    <span className="whitespace-nowrap text-[11px] text-slate-500">{formatTimeAgo(notification.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationBadge({ channel, status }: { channel: NotificationChannel; status: CampusNotification['status'] }) {
  const channelStyles: Record<NotificationChannel, string> = {
    email: 'bg-emerald-500/20 text-emerald-200',
    sms: 'bg-violet-500/20 text-violet-200',
    push: 'bg-sky-500/20 text-sky-200',
  };

  const statusLabelsLocal: Record<CampusNotification['status'], string> = {
    delivered: 'İletildi',
    sent: 'Gönderildi',
    opened: 'Açıldı',
    queued: 'Sırada',
  };

  return (
    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', channelStyles[channel])}>
      {channel === 'email' ? <Mail className="h-4 w-4" /> : channel === 'sms' ? <MessageIcon /> : <Share2 className="h-4 w-4" />}
      <span className="sr-only">{statusLabelsLocal[status]}</span>
    </div>
  );
}

function MessageIcon() {
  return <Hash className="h-4 w-4" />;
}

function UserPreferencesPanel({
  users,
  onTogglePreference,
  emptyState,
  onViewAll,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}: {
  users: User[];
  onTogglePreference: (userId: string, channel: NotificationChannel, nextValue: boolean) => void;
  emptyState: string | null;
  onViewAll: () => void;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Kullanıcı Tercihleri</CardTitle>
            <CardDescription>Bildirim kanalı ayarları anlık olarak kaydedilir</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              Tümünü Gör
            </Button>
            <Button size="sm" onClick={onCreateUser}>
              <Users className="h-4 w-4" />
              Yeni Kişi Ekle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {emptyState ? (
          <EmptyBlock title="Kullanıcı bulunamadı" description={emptyState} />
        ) : (
          users.map((user) => (
            <div key={user.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_14px_30px_rgba(2,6,23,0.12)] transition hover:border-white/15 hover:bg-white/7">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.avatarSeed)}`} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
                    <Badge variant="secondary">{user.role === 'Student' ? 'Öğrenci' : user.role === 'Faculty' ? 'Akademisyen' : 'Yönetici'}</Badge>
                  </div>
                  <p className="truncate text-xs text-slate-400">{user.department}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PreferenceToggle
                  label={notificationChannelLabels.email}
                  checked={user.preferences.email}
                  onCheckedChange={(nextValue) => onTogglePreference(user.id, 'email', nextValue)}
                  disabled={!user.email}
                />

                <PreferenceToggle
                  label={notificationChannelLabels.sms}
                  checked={user.preferences.sms}
                  onCheckedChange={(nextValue) => onTogglePreference(user.id, 'sms', nextValue)}
                  disabled={!user.phone}
                />

                <PreferenceToggle
                  label={notificationChannelLabels.push}
                  checked={user.preferences.push}
                  onCheckedChange={(nextValue) => onTogglePreference(user.id, 'push', nextValue)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onEditUser(user)}>
                  <PenLine className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteUser(user.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function PreferenceToggle({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border px-3 py-3 bg-[var(--surface)] shadow-inner transition',
        disabled ? 'border-rose-300/80' : 'border-white/10 hover:border-white/15',
      )}
    >
      <div className="min-w-0 text-left">
        <div className={cn('truncate text-xs font-medium leading-5', disabled ? 'text-rose-300' : 'text-slate-200')}>
          {label}
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500">{checked ? 'Etkin' : 'Pasif'}</div>
      </div>
      <div className="flex items-center justify-start">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(disabled ? 'bg-rose-200 data-[state=checked]:bg-rose-500/80' : '')}
        />
      </div>
    </div>
  );
}

function AnalyticsCard({
  range,
  setRange,
  trendData,
  successRate,
  rangeLabel,
  serverLoadData,
}: {
  range: '7d' | '14d' | '30d';
  setRange: (value: '7d' | '14d' | '30d') => void;
  trendData: ReturnType<typeof getTrendData>;
  successRate: number;
  rangeLabel: string;
  serverLoadData: ReturnType<typeof getServerLoadData>;
}) {
  const delivered = trendData.reduce((total, point) => total + point.delivered, 0);
  const opened = trendData.reduce((total, point) => total + point.opened, 0);
  const donutData = [
    { name: 'Başarı', value: successRate },
    { name: 'Kalan', value: 100 - successRate },
  ];

  return (
    <Card className="overflow-hidden xl:col-span-1">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Dağıtım ve Etkileşim Analitiği</CardTitle>
          <CardDescription>Seçilen dönem için teslim ve açılma trendleri</CardDescription>
        </div>
        <Select value={range} onValueChange={(value) => setRange(value as '7d' | '14d' | '30d')}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Son 7 Gün</SelectItem>
            <SelectItem value="14d">Son 14 Gün</SelectItem>
            <SelectItem value="30d">Son 30 Gün</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="h-[300px] rounded-[26px] border border-white/10 bg-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={trendData}>
                <defs>
                  <linearGradient id="deliveredGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#4f86ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="openedGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(148,163,184,0.55)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.55)" tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 16, 31, 0.96)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18,
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Line type="monotone" dataKey="delivered" name="Teslim" stroke="url(#deliveredGradient)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="opened" name="Açılan" stroke="url(#openedGradient)" strokeWidth={3} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
              <div className="mx-auto flex h-40 w-40 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={72} startAngle={90} endAngle={-270} paddingAngle={2}>
                      {donutData.map((entry, index) => (
                        <Cell key={entry.name} fill={index === 0 ? '#6366f1' : '#1e293b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-3xl font-semibold text-[var(--foreground)]">{successRate.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</div>
                  <div className="text-xs text-slate-400">Başarı Oranı</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <SummaryMetric label="Teslim" value={formatNumber(delivered)} accent="text-sky-300" />
              <SummaryMetric label="Açılan" value={formatNumber(opened)} accent="text-violet-300" />
            </div>
          </div>
        </div>

        <Divider />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Dönem Özeti</p>
            <p className="mt-2 text-sm leading-6 text-slate-300/80">
              {rangeLabel} bazında gönderimler artış gösterdi. Teslim oranı istikrarlı kalırken açılma oranı özellikle akademik duyurularda yükseldi.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Sunucu Yükü</p>
            <div className="mt-3 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverLoadData}>
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#loadGradient)" />
                  <defs>
                    <linearGradient id="loadGradient" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#4f86ff" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', accent)}>{value}</div>
    </div>
  );
}

function StatusCard({ loadData }: { loadData: ReturnType<typeof getServerLoadData> }) {
  const load = Math.round(loadData.reduce((total, point) => total + point.value, 0) / loadData.length);
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Sistem Durumu</p>
            <p className="mt-1 text-xs text-slate-400">Tüm sistemler çevrimiçi</p>
          </div>
          <Badge variant="success">Kararlı</Badge>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Sunucu Yükü</span>
            <span className="font-semibold text-[var(--foreground)]">%{load}</span>
          </div>
          <div className="mt-3 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={loadData}>
                <Line type="monotone" dataKey="value" stroke="#4f86ff" strokeWidth={2.5} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportCard({ onSupportClick }: { onSupportClick: () => void }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">Yardıma mı ihtiyacınız var?</p>
          <p className="text-sm text-slate-400">Destek ile iletişime geçin</p>
        </div>
        <Button size="icon" variant="glass" onClick={onSupportClick}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function AnnouncementDialog({
  open,
  setOpen,
  announcement,
  onSave,
  onOpenChange,
  availableUsers,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  announcement: Announcement | null;
  onSave: (values: AnnouncementFormValues) => void;
  onOpenChange: (value: boolean) => void;
  availableUsers: User[];
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('exam');
  const [audienceScope, setAudienceScope] = useState<AudienceScope>('campus-wide');
  const [audienceUserIds, setAudienceUserIds] = useState<string[]>([]);
  const [channel, setChannel] = useState<NotificationChannel>('email');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setCategory(announcement.category);
      setAudienceScope(announcement.audienceScope);
      setAudienceUserIds(announcement.audienceUserIds);
      setChannel(announcement.channel);
      setMessage(announcement.message);
    } else if (open) {
      setTitle('');
      setCategory('exam');
      setAudienceScope('campus-wide');
      setAudienceUserIds([]);
      setChannel('email');
      setMessage('');
    }
  }, [announcement, open]);

  const toggleAudienceUser = (userId: string) => {
    setAudienceUserIds((current) => (current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ title, category, audienceScope, audienceUserIds, channel, message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle>{announcement ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}</DialogTitle>
            <DialogDescription>Türkçe içerik, hedef kitle ve kanal bilgilerini girin.</DialogDescription>
          </div>
          <DialogClose onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Duyuru Başlığı">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Örn. Ara sınav programı" required />
              </Field>
              <Field label="Duyuru Türü">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as AnnouncementCategory)}
                  className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
                >
                  <option value="exam">Sınav Duyurusu</option>
                  <option value="event">Etkinlik Duyurusu</option>
                  <option value="cafeteria">Yemekhane Duyurusu</option>
                  <option value="library">Kütüphane Duyurusu</option>
                </select>
              </Field>
            </div>

            <Field label="Hedef Kitle">
              <select
                value={audienceScope}
                onChange={(event) => setAudienceScope(event.target.value as AudienceScope)}
                className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
              >
                {audienceScopeOptions.map((scope) => (
                  <option key={scope} value={scope}>
                    {audienceScopeLabels[scope]}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">{audienceScopeDescriptions[audienceScope]}</p>
              {audienceScope === 'selected-users' ? (
                <div className="grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto pr-2">
                  {availableUsers.map((user) => {
                    const checked = audienceUserIds.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleAudienceUser(user.id)}
                        className={cn(
                          'flex items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition',
                          checked ? 'border-indigo-400/40 bg-indigo-500/15 text-[var(--foreground)]' : 'border-white/10 bg-white/5 text-[var(--foreground)] hover:bg-white/8',
                        )}
                      >
                        <span className="truncate">{user.name}</span>
                        <span className="ml-3 text-[11px] text-slate-400">{user.role === 'Student' ? 'Öğrenci' : user.role === 'Faculty' ? 'Akademisyen' : 'Yönetici'}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Bildirim Kanalı">
                <select
                  value={channel}
                  onChange={(event) => setChannel(event.target.value as NotificationChannel)}
                  className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
                >
                  <option value="email">E-posta</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Bildirimi</option>
                </select>
              </Field>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--foreground)]">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Seçim Özeti</div>
                <div className="mt-2 font-semibold">{audienceScopeLabels[audienceScope]}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {audienceScope === 'selected-users' ? `${audienceUserIds.length} kişi seçildi` : 'Otomatik alıcı hesaplaması yapılacak.'}
                </div>
              </div>
            </div>

            <Field label="Mesaj">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Duyuru içeriğini Türkçe olarak girin..."
                rows={5}
                className="min-h-[140px] w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
                required
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit">{announcement ? 'Güncellemeyi Kaydet' : 'Duyuruyu Yayınla'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserDialog({
  open,
  onOpenChange,
  onSave,
  editingUser,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSave: (values: UserFormValues) => void;
  editingUser?: User | null;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserFormValues['role']>('Student');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const { pushToast } = useToast();

  useEffect(() => {
    if (open) {
      if (editingUser) {
        setName(editingUser.name ?? '');
        setRole(editingUser.role ?? 'Student');
        setDepartment(editingUser.department ?? '');
        setEmail(Boolean(editingUser.preferences?.email));
        setSms(Boolean(editingUser.preferences?.sms));
        setPush(Boolean(editingUser.preferences?.push));
        setEmailAddress(editingUser.email ?? '');
        setPhone(editingUser.phone ?? '');
      } else {
        setName('');
        setRole('Student');
        setDepartment('');
        setEmail(false);
        setSms(false);
        setPush(true);
        setEmailAddress('');
        setPhone('');
      }
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^0\d{10}$/; // e.g. 05055055055

    let hasError = false;
    setEmailError(null);
    setPhoneError(null);

    if (email && emailAddress && !emailRegex.test(emailAddress)) {
      setEmailError('Geçersiz e-posta adresi. Örn: isim@gmail.com');
      hasError = true;
    }

    if (sms && phone && !phoneRegex.test(phone)) {
      setPhoneError('Telefon 0 ile başlayıp 11 haneli olmalıdır (ör. 05055055055)');
      hasError = true;
    }

    if (hasError) return;

    onSave({ name, role, department, email, sms, push, emailAddress, phone });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle>Yeni Kişi Ekle</DialogTitle>
            <DialogDescription>Duyuru hedeflerine dahil edilecek yeni kullanıcıyı tanımlayın.</DialogDescription>
          </div>
          <DialogClose>
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Ad Soyad">
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Örn. Ece Aydın" required />
              </Field>
              <Field label="Rol">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserFormValues['role'])}
                  className="h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-400/40 focus:bg-white/8"
                >
                  {userRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Bölüm / Birim">
              <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Örn. Bilgisayar Mühendisliği" required />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="E-posta Adresi">
                  <Input value={emailAddress} onChange={(e) => { const v = e.target.value; setEmailAddress(v); setEmailError(null); setEmail(Boolean(v.trim())); }} placeholder="ornek@ornek.com" />
                  {emailError ? <p className="mt-1 text-xs text-rose-400">{emailError}</p> : null}
                </Field>
              <Field label="Telefon">
                <Input
                  value={phone}
                  inputMode="numeric"
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(null); }}
                  placeholder="05055055055"
                />
                {phoneError ? <p className="mt-1 text-xs text-rose-400">{phoneError}</p> : null}
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <PreferenceToggle label="E-posta" checked={email} onCheckedChange={setEmail} disabled={!emailAddress} />
              <PreferenceToggle label="SMS" checked={sms} onCheckedChange={setSms} disabled={!phone} />
              <PreferenceToggle label="Push" checked={push} onCheckedChange={setPush} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Kişiyi Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'glass';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="w-[min(92vw,520px)]">
        <DialogHeader>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <DialogClose>
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm leading-6 text-slate-200">
            Silme işlemi geri alınamaz. İlgili kayıt panelden kaldırılacaktır.
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Vazgeç
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementDetailDialog({
  announcement,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,760px)]">
        <DialogHeader>
          <div>
            <DialogTitle>Duyuru Ayrıntıları</DialogTitle>
            <DialogDescription>{announcement ? formatTimeAgo(announcement.createdAt) : ''}</DialogDescription>
          </div>
          <DialogClose>
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        {announcement ? (
          <DialogBody>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{categoryPills[announcement.category]}</Badge>
              <Badge variant="secondary">{notificationChannelLabels[announcement.channel]}</Badge>
              <Badge variant="success">%{announcement.successRate} başarı</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-[var(--foreground)]">{announcement.title}</h3>
              <p className="text-sm text-slate-400">{announcement.audience}</p>
            </div>
            <p className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[var(--foreground)]">{announcement.message}</p>
            <div className="grid gap-3 sm:grid-cols-4">
              <SummaryMetric label="Alıcı" value={formatNumber(announcement.recipientCount)} accent="text-sky-300" />
              <SummaryMetric label="Görüntüleme" value={formatNumber(announcement.views)} accent="text-violet-300" />
              <SummaryMetric label="Teslim" value={formatNumber(announcement.deliveries)} accent="text-amber-300" />
              <SummaryMetric label="Başarı" value={`${announcement.successRate.toLocaleString('tr-TR')}%`} accent="text-emerald-300" />
            </div>
          </DialogBody>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
          <Button onClick={onEdit}>
            <Edit3 className="h-4 w-4" />
            Düzenle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[26px] border border-dashed border-white/12 bg-white/5 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-slate-300">
        <CircleAlert className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

export default App;
