# Akıllı Kampüs Duyuru ve Bildirim Yönetim Sistemi

Bu proje, BİL 3204 Yazılım Mimari ve Tasarımı final ödevi için hazırlanmış tek sayfalı bir kampüs yönetim arayüzüdür.

## Mimari

Proje katmanlı olacak şekilde düzenlenmiştir:

- `src/architecture/domain` - domain modelleri, factory tarafından üretilen nesneler ve observer sözleşmeleri
- `src/architecture/application` - örnek senaryoyu çalıştıran iş akışı
- `src/architecture/infrastructure` - Singleton servisler ve bildirim kayıtları
- `src/components/ui` - yeniden kullanılabilir arayüz bileşenleri
- `src/App.tsx` - presentation layer

## Zorunlu Tasarım Desenleri

### Observer Pattern

`AnnouncementPublisher` yeni bir duyuru yayınladığında `StudentObserver` ve `TeacherObserver` otomatik olarak bilgilendirilir.

### Factory Pattern

`AnnouncementFactory` uygun duyuru nesnesini, `NotificationFactory` ise uygun bildirim kanalını üretir.

### Singleton Pattern

`Logger` ve `NotificationCenter` sistem genelinde tek örnek olarak çalışır.

## Çalışan Senaryo

Uygulamadaki mimari demo, şu akışı görünür hale getirir:

1. Kullanıcılar abone edilir.
2. Yönetici sınav duyurusu oluşturur.
3. Factory uygun duyuru nesnesini üretir.
4. Observer kullanıcıları bilgilendirir.
5. NotificationFactory e-posta, SMS ve push bildirimlerini üretir.
6. Logger ve NotificationCenter çıktıları kaydeder.

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim derlemesi için:

```bash
npm run build
```
