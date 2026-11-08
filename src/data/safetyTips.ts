export interface SafetyCardItem {
  id: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
  shortSummary: string;
  keyPoints: string[];
  doAndDonts: {
    dos: string[];
    donts: string[];
  };
  emergencyNote?: string;
}

export const SAFETY_CARDS: SafetyCardItem[] = [
  {
    id: 'prohibited-foods',
    title: '1 Yaş Altı Kesinlikle Yasaklı Gıdalar',
    badge: 'Hayati Önemli',
    badgeBg: '#FFE4E6',
    badgeText: '#BE123C',
    badgeBorder: '#FECDD3',
    icon: '🚫',
    shortSummary: 'Bebeklerin böbrekleri, sindirim sistemi ve bağışıklığı henüz olgunlaşmadığı için bu besinler 1 yaşına kadar KESİNLİKLE verilmemelidir.',
    keyPoints: [
      'Bal: Clostridium botulinum bakterisi sporları içerir. 1 yaş altı bebeklerin bağırsak florası bunu engelleyemez ve ölümcül "Bebek Botulizmi"ne yol açabilir.',
      'İnek Sütü (Direkt İçecek Olarak): Yüksek protein ve mineral yükü böbrekleri yorar, bağırsakta gizli mikrokanamalara ve ağır demir eksikliğine neden olur. (Yoğurt ve peynir mayalandığı için verilebilir).',
      'Tuz: Bebeğin minik böbrekleri tuzu süzemez, böbrek yetmezliği riski oluşturur. 1 yaşına kadar yemeklere sıfır tuz eklenmelidir.',
      'Şeker & Yapay Tatlandırıcılar: Doğal damak tadını bozar, obezite ve diş çürüğü riskini tetikler.',
      'Patlıcan: İçeriğinde doğal nikotin bulunur ve hiçbir besleyici değeri yoktur, sindirimi çok ağırdır.',
      'Kabuklu Deniz Ürünleri & Dip Balıkları: Midye, karides, kılıç, mezgit harici dip balıkları ağır metal (cıva) ve yüksek alerji riski taşır.',
      'Çiğ veya Az Pişmiş Yumurta / Et: Salmonella ve ölümcül gıda zehirlenmesi riski taşır. Yumurta her zaman tam katı pişirilmelidir.',
      'Bakla: Bazı bebeklerde genetik "Favizm" (akut kan hücresi yıkımı) hastalığına neden olabilir.',
    ],
    doAndDonts: {
      dos: [
        'Ailenin yemeğinden bebeğe ayırırken tuzu ve salçayı eklemeden ÖNCE bebeğin porsiyonunu ayırın.',
        'Tatlandırmak için muz, elma püresi, buharda armut veya balkabağı gibi doğal meyveleri kullanın.',
      ],
      donts: [
        'Büyüklerin "Bir çay kaşığı baldan bir şey olmaz" ısrarlarına ASLA taviz vermeyin.',
        'Marketten alınan hazır paketli bisküvi ve şekerli bebek ürünlerini tercih etmeyin.',
      ],
    },
    emergencyNote: 'Eğer bebeğiniz kazara bal tükettiyse ve kabızlık, halsizlik, emmede zayıflık veya gevşeklik fark ederseniz derhal acil servise başvurun.',
  },

  {
    id: 'trunk-support-sitting',
    title: 'Gövde Destekli Oturma & Ek Gıdaya Hazır Oluş',
    badge: 'Gelişimsel Kriter',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    badgeBorder: '#FDE68A',
    icon: '🪑',
    shortSummary: 'Ek gıdaya başlamak için takvimden ziyade bebeğin nörolojik ve fiziksel hazır oluş belirtileri esastır.',
    keyPoints: [
      'Dik Oturabilme: Mama sandalyesinde sırtı dik durabilmeli, başını ve boynunu titremeden tam kontrol edebilmelidir.',
      'Dil İtme Refleksinin Kaybolması: Bebekler doğuştan yabancı maddeleri dilleriyle dışarı iter. Bu refleks zayıflamadan kaşıkla besleme zordur ve aspirasyon riski taşır.',
      'Yiyeceklere İlgi Gösterme: Ebeveynler yemek yerken dikkatle izleme, uzanma, ağzını şapırdatma belirtileri görülmelidir.',
      'El-Göz-Ağız Koordinasyonu: Bir nesneyi tutup doğrudan ağzına götürebilme becerisi gelişmiş olmalıdır.',
    ],
    doAndDonts: {
      dos: [
        'Besleme esnasında bebeği mutlaka mama sandalyesinde 90 derece dik açıyla oturtun.',
        'Ayaklarının altında destek (ayak basamağı) olmasını sağlayın; bu çiğneme kaslarını destekler.',
      ],
      donts: [
        'Bebeği ana kucağında, pusetinde veya yarı yatar pozisyonda ASLA beslemeyin (boğulma riskidir!).',
        'Bebek oturmaya henüz hazır değilken sadece 6 ayı doldu diye zorla ağzına kaşık sokmayın.',
      ],
    },
  },

  {
    id: 'choking-vs-gagging',
    title: 'Boğulma Tehlikesi & Güvenli Sunum Kıvamı',
    badge: 'Güvenlik Protokolü',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    badgeBorder: '#FECACA',
    icon: '⚠️',
    shortSummary: 'Öğürme (Gagging) hayat kurtaran doğal bir reflekstir, Boğulma (Choking) ise sessizdir ve acil müdahale gerektirir.',
    keyPoints: [
      'Öğürme (Gagging - Gürültülüdür): Bebek öğürür, yüzü kızarır, öksürür ve diliyle besini öne iter. Bu, boğulmayı engelleyen bir savunma mekanizmasıdır. PANİK YAPMAYIN, araya girmeyin.',
      'Boğulma (Choking - Sessizdir): Hava yolu tamamen tıkanmıştır. Bebek ses çıkaramaz, öksüremez, gözleri büyür ve dudakları morarmaya başlar. DERHAL BEBEK HEIMLICH MANEVRASI UYGULANMALIDIR.',
      'Yuvarlak Gıdalar Şekil Değiştirmeli: Çeri domates, üzüm, zeytin, yaban mersini ASLA bütün verilmez. Daima boyuna 4 parçaya kesilmelidir.',
      'Sert Çiğ Gıdalar: Havuç ve sert elma çiğ halde boğulmanın 1 numaralı sebebidir. Mutlaka buharda parmakla ezilebilecek yumuşaklığa getirilmelidir.',
      'Kuruyemişler: Fındık, fıstık, ceviz 4-5 yaşına kadar BÜTÜN verilmez. Sadece kahve değirmeninde çekilmiş un/toz halinde yemeklere karıştırılır.',
    ],
    doAndDonts: {
      dos: [
        'Besini iki parmağınızın arasına alıp hafifçe sıktığınızda eziliyorsa bebeğinize sunun.',
        'Bebeğiniz yemek yerken daima 1 kol mesafesinde göz temasında kalın.',
      ],
      donts: [
        'Bebek öğürdüğünde paniğe kapılıp parmağınızı ağzına sokarak besini arkaya itmeyin.',
        'Bebek yürürken, emeklerken veya araba koltuğunda seyahat ederken eline yiyecek vermeyin.',
      ],
    },
    emergencyNote: 'Boğulma anında: Bebeği kolunuzun üzerine yüzüstü yatırıp başı aşağıda olacak şekilde kürek kemiklerinin arasına 5 kez süpürür tarzda vurun.',
  },

  {
    id: 'main-food-milk',
    title: 'Ana Besin: Anne Sütü / Formül Mama Önceliği',
    badge: 'Beslenme Prensibi',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
    badgeBorder: '#A7F3D0',
    icon: '🍼',
    shortSummary: '1 yaşına kadar ek gıdanın asıl amacı karın doyurmak değil; tat, doku tanıma ve çiğneme kaslarını geliştirmektir.',
    keyPoints: [
      '6 - 9 Ay Arası: Günlük besin ihtiyacının %80-90\'ı anne sütü veya formül mamadan karşılanır. Ek gıda sadece günde 1-2 çay kaşığı tadım ile başlar.',
      '9 - 12 Ay Arası: İhtiyacın yaklaşık %60-70\'i anne sütü/mama, %30-40\'ı ek gıdalardır.',
      'Besleme Zamanlaması: Ek gıdayı bebek açlıktan ağlarken vermeyin; huysuzlaşır ve reddeder. Anne sütü/mama emzirmesinden 45-60 dakika sonra, ne çok tok ne çok açken teklif edin.',
      'Bebek Yemediğinde: Israrcı olmayın, zorlamayın. Bir besini kabul etmesi bazen 10-15 kez farklı günlerde görmesini gerektirir.',
    ],
    doAndDonts: {
      dos: [
        'Bebeğin doyma sinyallerine (kafasını çevirme, ağzını kapatma, eliyle itme) saygı gösterin.',
        'Yemek masasında aileyle birlikte oturmasını sağlayarak model olun.',
      ],
      donts: [
        '"Hepsini bitirsin" diye arkasından kaşıkla kovalamayın veya dikkatini dağıtmak için telefon/ekran açmayın.',
        'Ek gıdayı biberonun içine katarak içirmeyin; kaşıkla ve oturarak yemelidir.',
      ],
    },
  },

  {
    id: 'allergy-action-plan',
    title: 'Alerji Reaksiyonu Anında Ne Yapılmalı?',
    badge: 'Acil Eylem Planı',
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    badgeBorder: '#E9D5FF',
    icon: '🩺',
    shortSummary: 'Yeni bir besin tattırdığınızda ortaya çıkabilecek alerjik reaksiyon basamakları ve yapılması gerekenler.',
    keyPoints: [
      'Hafif / Orta Reaksiyonlar: Ağız çevresinde kızarıklık, hafif döküntü, pişik, hafif gaz sancısı veya dışkıda sümüksü kıvam.',
      'Ağır / Acil Reaksiyonlar (Anafilaksi): Dudaklarda, dilde veya yüzde şişme, nefes alıp verirken hırıltı veya ötme, fışkırır tarzda kusma, aniden soluklaşma veya baygınlık.',
      'Yeni Besini Sabah Verin kuralı: Olası reaksiyonları gündüz görebilmek ve gece uykusuna denk getirmemek için yeni besinler daima sabah veya öğlen 12.00 civarında verilmelidir.',
    ],
    doAndDonts: {
      dos: [
        'Reaksiyon oluşursa şüpheli besini vermeyi DERHAL kesin.',
        'Oluşan döküntünün veya şişliğin cep telefonuyla net bir fotoğrafını çekin (doktora göstermek için paha biçilemezdir).',
        'Tarihi, saati ve miktarı bu uygulamadaki "Reaksiyon / Alerji Durumu" alanına not edin.',
      ],
      donts: [
        'Doktora danışmadan bebeğe kafanıza göre antihistaminik alerji şurubu içirmeyin.',
        'Aynı anda 2 yeni besini birden vermeyin; reaksiyon olursa hangisinden kaynaklandığını bilemezsiniz.',
      ],
    },
    emergencyNote: 'Eğer nefes darlığı, dudak/dil şişmesi veya bilinç kaybı görülürülürse saniye kaybetmeden 112 Acil Çağrı Merkezini arayın!',
  },

  {
    id: 'three-day-rule-guide',
    title: '3 Gün Kuralı Nasıl Eksiksiz Uygulanır?',
    badge: 'Metodoloji',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    badgeBorder: '#BAE6FD',
    icon: '🗓️',
    shortSummary: 'Besin alerjilerini ve sindirim toleransını güvenle tespit etmenin altın standardıdır.',
    keyPoints: [
      'Tek Besin Prensibi: Denenen süre boyunca daha önce hiç tatmadığı BAŞKA YENİ BİR BESİN verilmez. Sadece daha önce denenmiş güvenli besinler yanına eşlik edebilir.',
      '1. Gün (Tadım): Sabah saatlerinde sadece 1 çay kaşığı verilir. Gün boyu cilt, solunum ve kaka takip edilir.',
      '2. Gün (Miktar Artırma): Reaksiyon yoksa 1 tatlı kaşığı kadar verilir.',
      '3. Gün (Porsiyon): Yine sorun yoksa 1 yemek kaşığı kadar verilir. 3. günün sonunda da reaksiyon görülmediyse besin artık "GÜVENLİ" kabul edilir ve listenize yeşil onay ile eklenir!',
      'Farklı Dokular: Her besini önce tek başına tattırmak, bebeğin o besinin has lezzetini tanımasını sağlar.',
    ],
    doAndDonts: {
      dos: [
        'Her günün kutucuğunu bebeğiniz yedikçe uygulamadan işaretleyin.',
        'Alerji geçmişi olan ailelerin yumurta sarısı, balık, kuruyemiş tozu gibi yüksek alerjenleri doktor kontrolünde denemesi önerilir.',
      ],
      donts: [
        'Aynı anda havuç + patates + kabak üçlüsünü ilk kez bir arada kaynatıp denemeyin.',
        'Aşı günlerinde yeni besin denemeyin; aşının ateşi veya huysuzluğu besin reaksiyonuyla karışabilir.',
      ],
    },
  },
  {
    id: 'privacy-and-data-security',
    title: 'Veri Gizliliği ve Bebeğinizin Mahremiyeti (%100 Cihaz İçi)',
    badge: 'Gizlilik Güvencesi',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    badgeBorder: '#A7F3D0',
    icon: '🔒',
    shortSummary: 'Bebeğinizin isim, alerji ve besin kayıtları hiçbir uzak sunucuya aktarılmaz; yalnızca telefonunuzda yerel saklanır.',
    keyPoints: [
      'Sıfır Bulut Transferi: Sağlık ve beslenme verileri doğrudan cihazınızın kendi güvenli yerel hafızasında (AsyncStorage) saklanır.',
      'Sıfır İzleyici / Çerezsiz: Uygulamada reklam, kullanıcı izleme veya Google Analytics kodları bulunmaz.',
      'Tam Veri Kontrolü: Dilediğiniz an tek tıkla verilerinizi JSON formatında yedekleyebilir veya cihazdan kalıcı olarak silebilirsiniz.',
      'Çevrimdışı Çalışma: Uygulama internet bağlantısına ihtiyaç duymadan tam kapasiteyle çalışır.',
    ],
    doAndDonts: {
      dos: [
        'Telefon değiştirirken "Profili Düzenle" veya "Gizlilik" menüsünden JSON yedeğinizi paylaşmayı/kaydetmeyi unutmayın.',
        'Doktor kontrolüne giderken "Doktor Raporu" butonunu kullanarak özetinizi paylaşabilir veya kopyalayabilirsiniz.',
      ],
      donts: [
        'Bebeğinize ait sağlık ve alerji kayıtlarını güvenilmeyen üçüncü taraf web sitelerine veya uygulamalara girmeyin.',
      ],
    },
  },
];
