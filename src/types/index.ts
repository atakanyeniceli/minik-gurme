export type FoodCategory =
  | 'sebze'
  | 'meyve'
  | 'sut_urunleri'
  | 'protein'
  | 'tahil'
  | 'yag_tohum';

export type ReactionStatus =
  | 'none'       // Reaksiyon Yok (Güvenli)
  | 'rash'       // Kızarıklık / Döküntü
  | 'digestive'  // Sindirim / Gaz Sorunu / İshal / Kabızlık
  | 'rejected'   // Israrla Reddetti / Tükürdü
  | 'vomiting'   // Kusma
  | 'swelling';  // Şişlik (Dudak, Göz vb.)

export type EnjoymentLevel = 1 | 2 | 3 | 4 | 5;

export interface TrialDayRecord {
  completed: boolean;
  date: string; // YYYY-MM-DD
  amountNote?: string; // örn: "1 çay kaşığı", "Yarım kavanoz"
  reactionNote?: string;
}

export interface FoodTrial {
  id: string;
  foodName: string;
  category: FoodCategory;
  startDate: string; // YYYY-MM-DD
  day1: TrialDayRecord;
  day2: TrialDayRecord;
  day3: TrialDayRecord;
  reaction: ReactionStatus;
  reactionDetails?: string;
  enjoyment: EnjoymentLevel;
  approvedSafe: boolean; // 3 gün sorunsuz tamamlandı
  notes?: string;
  createdAt: number;
}

export interface GuideFood {
  id: string;
  name: string;
  category: FoodCategory;
  minMonth: 6 | 7 | 8 | 9 | 12;
  icon: string;
  allergyRisk: 'low' | 'medium' | 'high';
  season?: string;
  preparationTip?: string;
  blwTip?: string;
  benefits: string;
  isProhibitedBefore1Year?: boolean;
  warningNote?: string;
}

export type MealConsumptionRate = 'full' | 'half' | 'few_bites' | 'none';

export interface MealItem {
  menu: string;
  eaten: boolean;
  consumptionRate: MealConsumptionRate;
  notes: string;
}

export interface DailyMealPlan {
  date: string; // YYYY-MM-DD
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack: MealItem;
  waterIntakeMl: number;
  breastmilkOrFormulaCount: number;
  generalNotes?: string;
}

export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  avatar: string;
  allergiesNote?: string;
}

export type ActiveTab = 'tracker' | 'guide' | 'planner' | 'safety';

export type ThemeMode = 'light' | 'dark';
