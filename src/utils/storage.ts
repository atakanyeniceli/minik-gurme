import AsyncStorage from '@react-native-async-storage/async-storage';
import { BabyProfile, DailyMealPlan, FoodTrial, ThemeMode } from '../types';

export const STORAGE_KEYS = {
  PROFILE: 'ekgida_baby_profile_v1',
  TRIALS: 'ekgida_food_trials_v1',
  MEALS: 'ekgida_daily_meals_v1',
  THEME: 'ekgida_theme_mode_v1',
};

// Calculate realistic dates for initial seed data
const getPastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const INITIAL_PROFILE: BabyProfile = {
  name: 'Can Bebek',
  birthDate: getPastDate(205), // approx ~6.8 months old
  avatar: '👶',
  allergiesNote: 'Ailede polen alerjisi var. Yumurta ve fıstık dikkatle denenecek.',
};

export const INITIAL_TRIALS: FoodTrial[] = [
  {
    id: 'trial-havuc',
    foodName: 'Havuç',
    category: 'sebze',
    startDate: getPastDate(12),
    day1: { completed: true, date: getPastDate(12), amountNote: '1 çay kaşığı buharda püre' },
    day2: { completed: true, date: getPastDate(11), amountNote: '1 tatlı kaşığı püre' },
    day3: { completed: true, date: getPastDate(10), amountNote: '1 yemek kaşığı' },
    reaction: 'none',
    enjoyment: 5,
    approvedSafe: true,
    notes: 'Çok sevdi, tatlı tadı hoşuna gitti. Gaz veya döküntü olmadı.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: 'trial-kabak',
    foodName: 'Yeşil Kabak',
    category: 'sebze',
    startDate: getPastDate(8),
    day1: { completed: true, date: getPastDate(8), amountNote: '1 çay kaşığı haşlanmış ezme' },
    day2: { completed: true, date: getPastDate(7), amountNote: '1 tatlı kaşığı zeytinyağlı' },
    day3: { completed: true, date: getPastDate(6), amountNote: '1 yemek kaşığı' },
    reaction: 'none',
    enjoyment: 4,
    approvedSafe: true,
    notes: 'Başta yüzünü buruşturdu ama sonra alıştı.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: 'trial-avokado',
    foodName: 'Avokado',
    category: 'yag_tohum',
    startDate: getPastDate(2),
    day1: { completed: true, date: getPastDate(2), amountNote: '1 çay kaşığı çatalla ezilmiş' },
    day2: { completed: true, date: getPastDate(1), amountNote: '1 tatlı kaşığı' },
    day3: { completed: false, date: getTodayDateString(), amountNote: 'Bugün 1 yemek kaşığı verilecek' },
    reaction: 'none',
    enjoyment: 5,
    approvedSafe: false,
    notes: 'Kıvamını çok sevdi, ipeksi dokusu hoşuna gitti. Bugün 3. gün.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'trial-yumurta-sarisi',
    foodName: 'Yumurta Sarısı',
    category: 'protein',
    startDate: getTodayDateString(),
    day1: { completed: false, date: getTodayDateString(), amountNote: '1/8 çay kaşığı kadar az' },
    day2: { completed: false, date: '', amountNote: '1/4 sarı' },
    day3: { completed: false, date: '', amountNote: '1/2 sarı' },
    reaction: 'none',
    enjoyment: 3,
    approvedSafe: false,
    notes: 'Yüksek alerjen olduğu için sabah 10:00\'da başlanacak.',
    createdAt: Date.now(),
  },
];

export const INITIAL_MEALS: Record<string, DailyMealPlan> = {
  [getTodayDateString()]: {
    date: getTodayDateString(),
    breakfast: {
      menu: '1/4 Avokado ezmesi + 1 çay kaşığı zeytinyağı (3. gün tadımı)',
      eaten: true,
      consumptionRate: 'full',
      notes: 'Keyifle yedi, tabağın hepsini bitirdi.',
    },
    lunch: {
      menu: 'Buharda haşlanmış ezilmiş havuç & kabak püresi',
      eaten: false,
      consumptionRate: 'none',
      notes: 'Öğle uykusundan sonra hazırlanacak.',
    },
    dinner: {
      menu: 'Bebek irmiği ve az anne sütü ile hazırlanmış ılık lapa',
      eaten: false,
      consumptionRate: 'none',
      notes: 'Akşam 18:30 civarı planlandı.',
    },
    snack: {
      menu: 'Taze rendelenmiş çeyrek elma',
      eaten: false,
      consumptionRate: 'none',
      notes: '',
    },
    waterIntakeMl: 60,
    breastmilkOrFormulaCount: 4,
    generalNotes: 'Bugün neşesi yerinde, diş kaşıyıcısını bol bol ısırıyor.',
  },
};

// Native AsyncStorage operations
export async function loadBabyProfile(): Promise<BabyProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return INITIAL_PROFILE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILE;
  }
}

export async function saveBabyProfile(profile: BabyProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export async function loadFoodTrials(): Promise<FoodTrial[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRIALS);
    if (!raw) return INITIAL_TRIALS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRIALS;
  }
}

export async function saveFoodTrials(trials: FoodTrial[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRIALS, JSON.stringify(trials));
  } catch (e) {
    console.error('Failed to save food trials', e);
  }
}

export async function loadDailyMeals(): Promise<Record<string, DailyMealPlan>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) return INITIAL_MEALS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEALS;
  }
}

export async function saveDailyMeals(meals: Record<string, DailyMealPlan>): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (e) {
    console.error('Failed to save meals', e);
  }
}

export async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'dark' || raw === 'light') return raw;
    return 'light';
  } catch {
    return 'light';
  }
}

export async function saveThemeMode(theme: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.TRIALS,
      STORAGE_KEYS.MEALS,
    ]);
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
}

// Age calculator helper
export function calculateAge(birthDateStr: string): { months: number; days: number; totalDays: number } {
  if (!birthDateStr) return { months: 6, days: 0, totalDays: 180 };
  const birth = new Date(birthDateStr);
  const now = new Date();

  if (isNaN(birth.getTime())) return { months: 6, days: 0, totalDays: 180 };

  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  return {
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays,
  };
}

const TURKISH_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export function formatTurkishDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (month >= 0 && month < 12 && !isNaN(day) && !isNaN(year)) {
        return `${day} ${TURKISH_MONTHS[month]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
