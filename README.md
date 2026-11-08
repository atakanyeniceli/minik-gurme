# Minik Gurme — Bebek Ek Gıda & Menü Takibi (React Native / Expo)

Bebekler için **3 Gün Kuralı** alerji takibi, **Ay Ay Güvenli Gıda Rehberi**, **Günlük Menü Planlayıcı** ve **Kritik Güvenlik Bilgi Kartları** içeren, %100 cihaz içi (offline-first) çalışan **React Native (Expo)** mobil uygulaması.

## Özellikler

- **3 Gün Kuralı & Alerji Takibi**: Yeni besinleri 1. Gün, 2. Gün ve 3. Gün onay kutularıyla takip edin, olası reaksiyonları (`Kızarıklık`, `Sindirim/Gaz`, `Kusma`, `Şişlik`) ve bebeğin beğenme derecesini (1–5 emoji) kaydedin.
- **Ay Ay Güvenli Gıda Rehberi**: 6. aydan 12+ aya kadar sebze, meyve, yoğurt/peynir, protein, tahıl ve sağlıklı yağları inceleyin; geleneksel püre ve BLW (parmak gıda) ipuçlarını görün ve tek dokunuşla 3 Gün Kuralı tablosuna ekleyin.
- **Günlük Menü Planlayıcı**: Sabah, Öğle, Akşam ve Ara Öğün menülerini planlayın, hazır bebek tariflerinden seçin, tüketim oranını (`Tümü Bitti`, `Yarısı Yendi`, `2-3 Kaşık`), günlük su tüketimini (ml) ve anne sütü/mama seanslarını kaydedin.
- **Kritik Uyarılar & Güvenlik Rehberi**: 1 yaş altı yasaklı gıdalar (bal, inek sütü, tuz vb.), öğürme vs. boğulma (Gagging vs. Choking), dik oturma kriterleri ve tek dokunuşla **112 Acil Çağrı** bağlantısı.
- **Doktor / Pediatrist Raporu**: Muayene öncesi güvenli besinleri, reaksiyon gösteren gıdaları ve devam eden denemeleri tek tıkla kopyalayın veya WhatsApp / PDF olarak paylaşın.
- **%100 Cihaz İçi Gizlilik (`AsyncStorage`)**: Tüm veriler yalnızca telefonunuzda saklanır, uzak sunuculara gönderilmez. JSON formatında yedek paylaşma ve kalıcı veri silme desteği mevcuttur.
- **Açık / Koyu Tema**: Göz yormayan gece modu ve sıcak gündüz teması.

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Expo geliştirme sunucusunu başlatın (Expo Go ile QR okutarak telefonunuzda açabilirsiniz)
npx expo start

# Android emülatör / cihazda çalıştırmak için
npm run android

# iOS simülatörde çalıştırmak için
npm run ios
```
