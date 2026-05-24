# Akıllı Kampüs Duyuru ve Bildirim Yönetim Sistemi - Video Anlatım Rehberi

Bu dosya, final ödevi videosunu çekerken hangi sırayla ilerlemeniz gerektiğini ve ekranda neleri göstermeniz gerektiğini anlatır.

## 1. Video Başlangıcı

Kısaca şunları söyleyin:

- Projenin adı: Akıllı Kampüs Duyuru ve Bildirim Yönetim Sistemi
- Ders adı: BİL 3204 Yazılım Mimari ve Tasarımı
- Amaç: Katmanlı mimari, Observer, Factory ve Singleton desenlerini kullanarak çalışan bir kampüs duyuru sistemi göstermek

## 2. Proje Klasör Yapısı

Videoda kısa süreliğine dosya yapısını gösterin:

- `src/App.tsx` -> arayüz ve ana akış
- `src/architecture/domain` -> domain sınıfları ve desenler
- `src/architecture/application` -> örnek senaryo
- `src/architecture/infrastructure` -> Singleton servisler
- `README.md` -> proje açıklaması

Burada özellikle şunu belirtin:

- `Presentation Layer` arayüz tarafıdır
- `Domain Layer` iş kurallarını ve nesneleri içerir
- `Application Layer` örnek senaryoyu çalıştırır
- `Infrastructure Layer` tek örnek servisleri yönetir

## 3. Kullanıcı Ekleme Aşaması

Ekranda kullanıcılar bölümünü açın.

Anlatırken şunları söyleyin:

1. Sisteme birkaç kullanıcı eklendi.
2. Öğrenci ve öğretmen gibi farklı kullanıcı tipleri bulunuyor.
3. Kullanıcıların e-posta, SMS ve push bildirim tercihleri ayrı ayrı tutuluyor.

Gösterilecek örnekler:

- Ayşe Demir
- Mehmet Öz
- Zeynep Kaya
- Ahmet Yılmaz

## 4. Bildirim Tercihleri

Bu bölümde kullanıcıların tercihlerini gösterin.

Anlatım:

- E-posta, SMS ve push tercihleri kullanıcı bazında yönetiliyor.
- E-posta adresi veya telefon numarası yoksa ilgili tercih açılmıyor.
- Bu, sistemin veri doğrulaması yaptığını gösteriyor.

## 5. Yeni Duyuru Oluşturma

Yeni duyuru butonuna basın ve örnek bir sınav duyurusu oluşturun.

Önerilen örnek metin:

- Başlık: Final Sınav Takvimi
- Tür: Sınav Duyurusu
- Hedef kitle: Tüm öğrenciler veya seçili kullanıcılar
- Kanal: E-posta veya Push
- Mesaj: Final sınav takvimi yayımlandı.

Burada şu cümleyi kurun:

- Yönetici yeni bir sınav duyurusu oluşturuyor.

## 6. Factory Pattern Açıklaması

Bu noktada kısa ve net bir açıklama yapın:

- Factory, uygun duyuru nesnesini oluşturur.
- Aynı yapı bildirim kanalı için de kullanılır.
- Böylece nesne oluşturma mantığı tek yerde toplanır.

Örnek söylem:

- `AnnouncementFactory` sınav duyurusu gibi uygun nesneyi üretir.
- `NotificationFactory` e-posta, SMS veya push bildirimi üretir.

## 7. Duyuru Yayınlama

Duyuruyu kaydedin ve sonucu gösterin.

Burada anlatın:

1. Duyuru yayınlanır.
2. Sistem hedef kitlenin kullanıcılarını bulur.
3. Duyuru ilgili gözlemcilere iletilir.

## 8. Observer Pattern Açıklaması

Videoda açıkça söyleyin:

- Observer yapısı ile ilgili kullanıcılar bilgilendirilir.
- Öğrenci ve öğretmen gözlemciler duyuruyu otomatik alır.
- Yeni bir duyuru yayınlandığında manuel tek tek bildirim göndermek gerekmez.

Kısa örnek:

- `StudentObserver` öğrenciyi temsil eder.
- `TeacherObserver` öğretmeni temsil eder.

## 9. Bildirim Kanalları

Bu bölümde bildirimin nasıl üretildiğini anlatın:

- Factory uygun bildirim kanalını üretir.
- E-posta, SMS ve push bildirimi desteklenir.
- Gerçek servis kullanılmasa da konsol ve arayüz üzerinde gösterim yapılır.

Kullanabileceğiniz cümle:

- Bildirim konsolda gösterilir ve aynı zamanda arayüzde log olarak izlenebilir.

## 10. Singleton Pattern

Kısa şekilde açıklayın:

- `Logger` ve `NotificationCenter` sistem genelinde tek örnek olarak çalışır.
- Bu sayede log ve bildirim yönetimi merkezi hale gelir.

## 11. Çalışan Örnek Senaryo

İsterseniz bunu ekranda bir kez akıcı şekilde özetleyin:

1. Sisteme birkaç kullanıcı eklenir.
2. Kullanıcıların bildirim tercihleri belirlenir.
3. Yönetici yeni bir sınav duyurusu oluşturur.
4. Factory uygun duyuru nesnesini üretir.
5. Duyuru yayınlanır.
6. Observer yapısı ile ilgili kullanıcılar bilgilendirilir.
7. Factory uygun bildirim kanalını üretir.
8. Bildirim konsolda gösterilir.

## 12. Video Kapanışı

Kapanışta şu özet yeterlidir:

- Proje katmanlı mimari ile hazırlandı.
- Observer, Factory ve Singleton desenleri uygulandı.
- Gerçek hayata yakın bir kampüs duyuru-bildirim sistemi oluşturuldu.
- Sistem çalışan örnek senaryo ile test edildi.

## 13. Kısa Konuşma Metni

İsterseniz birebir şöyle söyleyebilirsiniz:

> Bu projede üniversite kampüsü için duyuru ve bildirim yönetim sistemi geliştirdim. Presentation, Domain, Application ve Infrastructure katmanlarını ayırdım. Observer Pattern ile kullanıcıları duyurulara abone ettim. Factory Pattern ile duyuru ve bildirim nesnelerini merkezi olarak ürettim. Singleton Pattern ile Logger ve NotificationCenter servislerini tek örnek halinde yönettim. Sistem içinde kullanıcı ekleme, tercih belirleme, duyuru oluşturma ve bildirim gösterme akışları çalışıyor.

## 14. Video Çekim Sırası

En pratik akış şu şekilde olabilir:

1. Proje ve amaç anlatımı
2. Klasör yapısı
3. Kullanıcılar bölümü
4. Bildirim tercihleri
5. Yeni duyuru oluşturma
6. Factory açıklaması
7. Duyuru yayınlama
8. Observer açıklaması
9. Bildirimler bölümü
10. Singleton açıklaması
11. Kısa özet ve kapanış

## 15. Son Kontrol Listesi

Videoyu çekmeden önce şunları kontrol edin:

- Sayfa açılıyor mu
- Kullanıcılar bölümü görünüyor mu
- Duyuru oluşturma çalışıyor mu
- Bildirim sayacı doğru mu
- Arama kutusu çalışıyor mu
- Duyuru ve kullanıcı silme onayı düzgün mü
- Tasarım koyu modda tutarlı mı
