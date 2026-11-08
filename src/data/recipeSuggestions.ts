export interface RecipeTemplate {
  id: string;
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  monthRange: string;
  ingredients: string[];
  instructions: string;
  prepTime: string;
}

export const RECIPE_SUGGESTIONS: RecipeTemplate[] = [
  // Kahvaltı (Breakfast)
  {
    id: 'b1',
    title: 'Avokadolu Yumurta Sarısı Ezmesi',
    mealType: 'breakfast',
    monthRange: '7.+ Ay',
    prepTime: '5 dk',
    ingredients: ['1/2 adet tam haşlanmış yumurta sarısı', '1/4 olgun avokado', '1 çay kaşığı sızma zeytinyağı', '1 tatlı kaşığı anne sütü veya su'],
    instructions: 'Yumurta sarısı ve olgun avokadoyu çatalla pürüzsüz kıvama gelene kadar ezin. Zeytinyağı ile kıvam verip taze servis edin.',
  },
  {
    id: 'b2',
    title: 'Bebek Loru ve Armutlu Yulaf Lapası',
    mealType: 'breakfast',
    monthRange: '7.+ Ay',
    prepTime: '8 dk',
    ingredients: ['1 yemek kaşığı ince öğütülmüş yulaf ezmesi', '1 çay bardağı su', '1 tatlı kaşığı tuzsuz bebek loru', '1/4 buharda ezilmiş tatlı armut'],
    instructions: 'Yulafı suyla kısık ateşte 5 dakika pişirip lapa yapın. Ilıyınca içine taze bebek loru ve armut püresini ekleyip karıştırın.',
  },
  {
    id: 'b3',
    title: 'Muzlu & İrmikli İlk Kahvaltım',
    mealType: 'breakfast',
    monthRange: '6.+ Ay',
    prepTime: '7 dk',
    ingredients: ['1 tatlı kaşığı bebek irmiği', '1 çay bardağı su', '1/3 olgun muz', '1 çay kaşığı zeytinyağı'],
    instructions: 'İrmiği suyla şişene kadar pişirin. Ocaktan alıp ılıyınca ezilmiş muz ve zeytinyağını katıp karıştırın.',
  },

  // Öğle (Lunch)
  {
    id: 'l1',
    title: 'Balkabaklı & Kuzu Kıymalı Sebze Püresi',
    mealType: 'lunch',
    monthRange: '7.+ Ay',
    prepTime: '15 dk',
    ingredients: ['1 dilim balkabağı', '1 küçük patates', '1 tatlı kaşığı çift çekim kuzu kıyma', '1 tatlı kaşığı zeytinyağı'],
    instructions: 'Kıymayı ve küp doğranmış sebzeleri buharda veya az suda yumuşayana dek haşlayın. Çatalla ezip zeytinyağı ekleyerek servis yapın.',
  },
  {
    id: 'l2',
    title: 'Havuçlu & Kabaklı İlk Çorbam',
    mealType: 'lunch',
    monthRange: '6.+ Ay',
    prepTime: '12 dk',
    ingredients: ['1 küçük havuç', '1/2 taze kabak', '1 tatlı kaşığı pirinç', '1 çay kaşığı sızma zeytinyağı'],
    instructions: 'Sebzeleri pirinçle birlikte az suda haşlayın. Çatalla ezin, üzerine zeytinyağı gezdirin.',
  },
  {
    id: 'l3',
    title: 'Sebzeli Kırmızı Mercimek Çorbası',
    mealType: 'lunch',
    monthRange: '8.+ Ay',
    prepTime: '20 dk',
    ingredients: ['1 yemek kaşığı kırmızı mercimek', '1/4 soğan (haşlama için)', '1/2 havuç', '1 tatlı kaşığı bebek irmiği', '1 tatlı kaşığı zeytinyağı'],
    instructions: 'Mercimek ve sebzeleri iyice yumuşayana dek haşlayın. Soğanı içinden çıkarın, kalan kısmı çatalla ezin. Zeytinyağı ekleyin.',
  },

  // Akşam (Dinner)
  {
    id: 'd1',
    title: 'Buharda Brokoli ve Tatlı Patates Şöleni',
    mealType: 'dinner',
    monthRange: '7.+ Ay',
    prepTime: '12 dk',
    ingredients: ['2 minik çiçek brokoli', '1/2 tatlı patates', '1 tatlı kaşığı zeytinyağı', '1 yemek kaşığı ev yoğurdu'],
    instructions: 'Sebzeleri buharda lokum kıvamında pişirin. Çatalla ezip yanında oda sıcaklığında 1 kaşık ev yoğurduyla sunun.',
  },
  {
    id: 'd2',
    title: 'Yumuşacık Somonlu Bezelye Ezmesi',
    mealType: 'dinner',
    monthRange: '8.+ Ay',
    prepTime: '15 dk',
    ingredients: ['30g kılçıksız taze somon fileto', '1 yemek kaşığı taze bezelye (kabuğu soyulmuş)', '1/4 patates', '1 çay kaşığı zeytinyağı'],
    instructions: 'Somon ve sebzeleri buharda pişirin. Somonun kılçıksız olduğundan emin olup didikleyin, ezilmiş sebzelerle harmanlayın.',
  },
  {
    id: 'd3',
    title: 'Tavuklu & Havuçlu Şehriye Çorbası',
    mealType: 'dinner',
    monthRange: '8.+ Ay',
    prepTime: '18 dk',
    ingredients: ['1 parça organik tavuk but eti', '1 yemek kaşığı tel şehriye', '1 küçük havuç rendesi', '1 tatlı kaşığı zeytinyağı'],
    instructions: 'Tavuğu haşlayıp didikleyin. Kendi suyunda havuç ve şehriyeyi pişirin, tavukla birleştirip ılık servis edin.',
  },

  // Ara Öğün (Snack)
  {
    id: 's1',
    title: 'Ev Yoğurtlu Cam Rende Elma',
    mealType: 'snack',
    monthRange: '6.+ Ay',
    prepTime: '3 dk',
    ingredients: ['2 yemek kaşığı taze ev yoğurdu', '1/2 tatlı elma (cam rendeden geçirilmiş)'],
    instructions: 'Elmayı cam rendede rendeleyip taze yoğurdun üzerine ekleyin.',
  },
  {
    id: 's2',
    title: 'Avokado & Muzlu Puding',
    mealType: 'snack',
    monthRange: '7.+ Ay',
    prepTime: '3 dk',
    ingredients: ['1/4 olgun avokado', '1/2 olgun muz'],
    instructions: 'İkisini çatalla krema kıvamına gelene kadar pürüzsüz ezin. Doğal, lezzetli ve besleyici!',
  },
];
