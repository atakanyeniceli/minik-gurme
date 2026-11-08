import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { DailyMealPlan, MealConsumptionRate, MealItem, ThemeMode } from '../types';
import { formatTurkishDate, getTodayDateString } from '../utils/storage';
import { RECIPE_SUGGESTIONS, RecipeTemplate } from '../data/recipeSuggestions';
import { getThemeColors } from '../theme/colors';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  SunMedium,
  Sun,
  Moon,
  Apple,
  Droplet,
  Heart,
  BookOpen,
  X,
} from 'lucide-react-native';

interface MealPlannerProps {
  meals: Record<string, DailyMealPlan>;
  onSaveMeals: (meals: Record<string, DailyMealPlan>) => void;
  theme: ThemeMode;
}

const DEFAULT_EMPTY_MEAL: MealItem = {
  menu: '',
  eaten: false,
  consumptionRate: 'none',
  notes: '',
};

export const MealPlanner: React.FC<MealPlannerProps> = ({ meals, onSaveMeals, theme }) => {
  const colors = getThemeColors(theme);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeRecipeModalMeal, setActiveRecipeModalMeal] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | null
  >(null);

  const currentPlan: DailyMealPlan = meals[selectedDate] || {
    date: selectedDate,
    breakfast: { ...DEFAULT_EMPTY_MEAL },
    lunch: { ...DEFAULT_EMPTY_MEAL },
    dinner: { ...DEFAULT_EMPTY_MEAL },
    snack: { ...DEFAULT_EMPTY_MEAL },
    waterIntakeMl: 0,
    breastmilkOrFormulaCount: 0,
    generalNotes: '',
  };

  const handleShiftDate = (days: number) => {
    const parts = selectedDate.split('-');
    const d = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleUpdateMealItem = (
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    field: keyof MealItem,
    value: any
  ) => {
    if (field === 'eaten' || field === 'consumptionRate') {
      try {
        Haptics.selectionAsync();
      } catch {
        // ignore
      }
    }

    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      [mealType]: {
        ...currentPlan[mealType],
        [field]: value,
      },
    };

    if (field === 'eaten' && value === true && currentPlan[mealType].consumptionRate === 'none') {
      updatedPlan[mealType].consumptionRate = 'full';
    } else if (field === 'eaten' && value === false) {
      updatedPlan[mealType].consumptionRate = 'none';
    }

    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  const handleUpdateCounter = (
    field: 'waterIntakeMl' | 'breastmilkOrFormulaCount',
    delta: number
  ) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      [field]: Math.max(0, (currentPlan[field] || 0) + delta),
    };
    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  const handleUpdateGeneralNotes = (notes: string) => {
    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      generalNotes: notes,
    };
    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  const handleApplyRecipe = (recipe: RecipeTemplate) => {
    if (!activeRecipeModalMeal) return;

    const formattedMenu = `${recipe.title}\nMalzemeler: ${recipe.ingredients.join(', ')}\nHazırlık: ${recipe.instructions}`;
    handleUpdateMealItem(activeRecipeModalMeal, 'menu', formattedMenu);
    setActiveRecipeModalMeal(null);
  };

  const isToday = selectedDate === getTodayDateString();

  const renderMainMealCard = (
    mealKey: 'breakfast' | 'lunch' | 'dinner',
    title: string,
    subtitle: string,
    accentColor: string,
    accentBg: string,
    IconComp: any,
    menuPlaceholder: string,
    notePlaceholder: string
  ) => {
    const meal = currentPlan[mealKey];

    return (
      <View
        key={mealKey}
        style={[
          styles.mealCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.mealCardHeader, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.mealTitleLeft}>
            <View style={[styles.mealIconBox, { backgroundColor: accentBg }]}>
              <IconComp size={16} color={accentColor} />
            </View>
            <View>
              <Text style={[styles.mealTitleText, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.mealSubtitleText, { color: colors.textMuted }]}>{subtitle}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleUpdateMealItem(mealKey, 'eaten', !meal.eaten)}
            activeOpacity={0.75}
            style={[
              styles.eatenToggleBtn,
              meal.eaten
                ? { backgroundColor: '#10B981', borderColor: '#059669' }
                : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            {meal.eaten ? (
              <>
                <CheckSquare size={14} color="#FFFFFF" />
                <Text style={[styles.eatenToggleText, { color: '#FFFFFF' }]}>Yendi ☑</Text>
              </>
            ) : (
              <>
                <Square size={14} color={colors.textMuted} />
                <Text style={[styles.eatenToggleText, { color: colors.textSecondary }]}>
                  Yendi mi? ☐
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Menu & Recipe Link */}
        <View style={styles.fieldSection}>
          <View style={styles.labelWithAction}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Hazırlanacak Menü & Tarif:
            </Text>
            <TouchableOpacity
              onPress={() => setActiveRecipeModalMeal(mealKey)}
              style={styles.recipeSuggestLink}
            >
              <BookOpen size={12} color={accentColor} />
              <Text style={[styles.recipeSuggestText, { color: accentColor }]}>
                Tarif Önerisi
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            multiline
            numberOfLines={3}
            placeholder={menuPlaceholder}
            placeholderTextColor={colors.textMuted}
            value={meal.menu}
            onChangeText={(txt) => handleUpdateMealItem(mealKey, 'menu', txt)}
            style={[
              styles.menuTextarea,
              {
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
        </View>

        {/* Consumption Rate if eaten */}
        {meal.eaten && (
          <View style={styles.fieldSection}>
            <Text style={[styles.smallCapsLabel, { color: colors.textMuted }]}>
              NE KADARINI TÜKETTİ?
            </Text>
            <View style={styles.consumptionGrid}>
              {(
                [
                  { id: 'full', label: '🟢 Tümü Bitti', bg: '#D1FAE5', text: '#065F46' },
                  { id: 'half', label: '🟡 Yarısı Yendi', bg: '#FEF3C7', text: '#92400E' },
                  { id: 'few_bites', label: '🟠 2-3 Kaşık', bg: '#FFEDD5', text: '#9A3412' },
                ] as { id: MealConsumptionRate; label: string; bg: string; text: string }[]
              ).map((rate) => {
                const isSelected = meal.consumptionRate === rate.id;
                return (
                  <TouchableOpacity
                    key={rate.id}
                    onPress={() => handleUpdateMealItem(mealKey, 'consumptionRate', rate.id)}
                    style={[
                      styles.consumptionBtn,
                      isSelected
                        ? { backgroundColor: rate.bg, borderColor: rate.text }
                        : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.consumptionBtnText,
                        { color: isSelected ? rate.text : colors.textSecondary },
                      ]}
                    >
                      {rate.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Yenilmeyen / Kalan Miktar veya Tepki Notu:
          </Text>
          <TextInput
            placeholder={notePlaceholder}
            placeholderTextColor={colors.textMuted}
            value={meal.notes}
            onChangeText={(txt) => handleUpdateMealItem(mealKey, 'notes', txt)}
            style={[
              styles.singleLineInput,
              {
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Date Navigator Card */}
      <View
        style={[
          styles.dateHeaderCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.dateSelectorRow}>
          <TouchableOpacity
            onPress={() => handleShiftDate(-1)}
            style={[
              styles.arrowBtn,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <ChevronLeft size={18} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.dateCenterWrap}>
            <CalendarIcon size={16} color="#D97706" />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatTurkishDate(selectedDate)}
            </Text>
            {isToday && (
              <View style={[styles.todayBadge, { backgroundColor: colors.amberBg }]}>
                <Text style={[styles.todayBadgeText, { color: colors.amberText }]}>Bugün</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => handleShiftDate(1)}
            style={[
              styles.arrowBtn,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <ChevronRight size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {!isToday && (
          <TouchableOpacity
            onPress={() => setSelectedDate(getTodayDateString())}
            style={[styles.goToTodayBtn, { backgroundColor: colors.amberBg }]}
          >
            <Text style={[styles.goToTodayBtnText, { color: colors.amberText }]}>
              Bugüne Dön ({formatTurkishDate(getTodayDateString())})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main 3 Meals */}
      {renderMainMealCard(
        'breakfast',
        'Sabah',
        'Kahvaltı / İlk Öğün',
        '#B45309',
        '#FEF3C7',
        SunMedium,
        'Örn: 1/4 tam haşlanmış yumurta sarısı + 1 tatlı kaşığı bebek loru + zeytinyağı ezmesi...',
        'Örn: 2 kaşık bıraktı, biraz yere döktü...'
      )}

      {renderMainMealCard(
        'lunch',
        'Öğle',
        'Sebze & Püre / Çorba',
        '#0F766E',
        '#CCFBF1',
        Sun,
        'Örn: Buharda pişmiş tatlı patates ve kabak püresi + 1 ceviz kuzu kıyma...',
        'Örn: Kıymayı başta istemedi, püreyle karıştırınca yedi...'
      )}

      {renderMainMealCard(
        'dinner',
        'Akşam',
        'Hafif / Tok Tutan Öğün',
        '#4338CA',
        '#E0E7FF',
        Moon,
        'Örn: Anne sütlü irmik lapası veya buharda havuç-brokoli püresi...',
        'Örn: Uykusu geldiği için yarım bıraktı...'
      )}

      {/* Snack (Ara Öğün) Card */}
      <View
        style={[
          styles.helperCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.helperHeader, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.helperTitleRow}>
            <Apple size={16} color="#059669" />
            <Text style={[styles.helperTitle, { color: colors.text }]}>
              Ara Öğün (İsteğe Bağlı)
            </Text>
          </View>

          <View style={styles.snackRightActions}>
            <TouchableOpacity
              onPress={() => setActiveRecipeModalMeal('snack')}
              style={styles.recipeSuggestLink}
            >
              <BookOpen size={12} color="#059669" />
              <Text style={[styles.recipeSuggestText, { color: '#059669' }]}>Tarif</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleUpdateMealItem('snack', 'eaten', !currentPlan.snack.eaten)
              }
              style={[
                styles.smallEatenBtn,
                currentPlan.snack.eaten
                  ? { backgroundColor: '#10B981', borderColor: '#059669' }
                  : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.smallEatenBtnText,
                  { color: currentPlan.snack.eaten ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {currentPlan.snack.eaten ? 'Yendi ☑' : 'Yendi mi? ☐'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          placeholder="Örn: Cam rende elma + 2 kaşık ev yoğurdu..."
          placeholderTextColor={colors.textMuted}
          value={currentPlan.snack.menu}
          onChangeText={(txt) => handleUpdateMealItem('snack', 'menu', txt)}
          style={[
            styles.singleLineInput,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />

        <TextInput
          placeholder="Tüketim notu..."
          placeholderTextColor={colors.textMuted}
          value={currentPlan.snack.notes}
          onChangeText={(txt) => handleUpdateMealItem('snack', 'notes', txt)}
          style={[
            styles.singleLineInput,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      </View>

      {/* Water Intake Counter Card */}
      <View
        style={[
          styles.helperCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.helperHeader, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.helperTitleRow}>
            <Droplet size={16} color="#0284C7" />
            <Text style={[styles.helperTitle, { color: colors.text }]}>Günlük Su Tüketimi</Text>
          </View>
          <View style={styles.waterCountBadge}>
            <Text style={styles.waterCountText}>{currentPlan.waterIntakeMl || 0} ml</Text>
          </View>
        </View>

        <Text style={[styles.helperDesc, { color: colors.textSecondary }]}>
          Ek gıdayla birlikte böbreklerin rahatlaması için her öğün sonrası birkaç yudum kaynatılıp
          ılıtılmış su teklif edin.
        </Text>

        <View style={styles.counterRow}>
          <TouchableOpacity
            onPress={() => handleUpdateCounter('waterIntakeMl', -30)}
            style={[styles.counterMinusBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={[styles.counterMinusText, { color: colors.textSecondary }]}>-30 ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUpdateCounter('waterIntakeMl', 30)}
            style={styles.waterPlus30Btn}
          >
            <Text style={styles.waterPlusText}>+30 ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUpdateCounter('waterIntakeMl', 60)}
            style={styles.waterPlus60Btn}
          >
            <Text style={styles.waterPlusText}>+60 ml</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Breastmilk / Formula Counter Card */}
      <View
        style={[
          styles.helperCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.helperHeader, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.helperTitleRow}>
            <Heart size={16} color="#E11D48" />
            <Text style={[styles.helperTitle, { color: colors.text }]}>
              Anne Sütü / Mama Seansı
            </Text>
          </View>
          <View
            style={[
              styles.milkCountBadge,
              { backgroundColor: colors.roseBg, borderColor: colors.roseBorder },
            ]}
          >
            <Text style={[styles.milkCountText, { color: colors.roseText }]}>
              {currentPlan.breastmilkOrFormulaCount || 0} Kez
            </Text>
          </View>
        </View>

        <Text style={[styles.helperDesc, { color: colors.textSecondary }]}>
          1 yaşına kadar ana besin anne sütü / formül mamadır. Ek gıda seanslarını emzirmeden 45-60
          dk sonra yapın.
        </Text>

        <View style={styles.counterRow}>
          <TouchableOpacity
            onPress={() => handleUpdateCounter('breastmilkOrFormulaCount', -1)}
            style={[styles.counterMinusBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={[styles.counterMinusText, { color: colors.textSecondary }]}>
              -1 Seans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUpdateCounter('breastmilkOrFormulaCount', 1)}
            style={[
              styles.milkPlusBtn,
              { backgroundColor: colors.roseBg, borderColor: colors.roseBorder },
            ]}
          >
            <Text style={[styles.milkPlusText, { color: colors.roseText }]}>
              +1 Seans Emzirme / Mama
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* General Notes of the Day */}
      <View
        style={[
          styles.helperCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.smallCapsLabel, { color: colors.textMuted }]}>
          GÜNÜN GENEL NOTU (BEBEĞİN İŞTAHI, KEYFİ, UYKUSU VEYA KAKA DURUMU):
        </Text>
        <TextInput
          multiline
          numberOfLines={2}
          value={currentPlan.generalNotes || ''}
          placeholder="Örn: Bugün diş çıkardığı için biraz iştahsızdı ama suyunu güzel içti..."
          placeholderTextColor={colors.textMuted}
          onChangeText={handleUpdateGeneralNotes}
          style={[
            styles.menuTextarea,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      </View>

      {/* Recipe Suggestions Modal */}
      <Modal
        visible={!!activeRecipeModalMeal}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveRecipeModalMeal(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.chefEmoji}>👩‍🍳</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Örnek Bebek Menüsü & Tarif Seçin
                  </Text>
                  <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                    Seçtiğiniz tarif doğrudan günün planına aktarılacaktır.
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setActiveRecipeModalMeal(null)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.recipeScroll} showsVerticalScrollIndicator={false}>
              {RECIPE_SUGGESTIONS.filter(
                (r) => r.mealType === activeRecipeModalMeal || activeRecipeModalMeal === 'snack'
              ).map((recipe) => (
                <View
                  key={recipe.id}
                  style={[
                    styles.recipeCard,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.recipeTopRow}>
                    <Text style={[styles.recipeTitle, { color: colors.text }]}>
                      {recipe.title}
                    </Text>
                    <View style={[styles.recipeMetaBadge, { backgroundColor: colors.amberBg }]}>
                      <Text style={[styles.recipeMetaText, { color: colors.amberText }]}>
                        {recipe.monthRange} • {recipe.prepTime}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIngredients, { color: colors.textSecondary }]}>
                    Malzemeler: {recipe.ingredients.join(', ')}
                  </Text>
                  <Text style={[styles.recipeInstructions, { color: colors.textMuted }]}>
                    Hazırlık: {recipe.instructions}
                  </Text>

                  <View style={styles.recipeBottomRow}>
                    <TouchableOpacity
                      onPress={() => handleApplyRecipe(recipe)}
                      style={styles.applyRecipeBtn}
                    >
                      <Text style={styles.applyRecipeBtnText}>Bu Menüyü Ekle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  dateHeaderCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCenterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '800',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  goToTodayBtn: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  goToTodayBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mealCard: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  mealTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTitleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  mealSubtitleText: {
    fontSize: 11,
    fontWeight: '500',
  },
  eatenToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 11,
    borderWidth: 1,
  },
  eatenToggleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  fieldSection: {
    gap: 6,
  },
  labelWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  recipeSuggestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeSuggestText: {
    fontSize: 11.5,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  menuTextarea: {
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  smallCapsLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  consumptionGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  consumptionBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  consumptionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  singleLineInput: {
    fontSize: 12.5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
  },
  helperCard: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  helperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  helperTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helperTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  snackRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallEatenBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
  },
  smallEatenBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  helperDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  waterCountBadge: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  waterCountText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '800',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  counterMinusBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  counterMinusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  waterPlus30Btn: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  waterPlus60Btn: {
    flex: 1,
    backgroundColor: '#BAE6FD',
    borderColor: '#7DD3FC',
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  waterPlusText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '800',
  },
  milkCountBadge: {
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  milkCountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  milkPlusBtn: {
    flex: 1.5,
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  milkPlusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 10, 9, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  chefEmoji: {
    fontSize: 26,
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
  },
  recipeScroll: {
    marginTop: 14,
  },
  recipeCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginBottom: 10,
  },
  recipeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  recipeMetaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  recipeMetaText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  recipeIngredients: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeInstructions: {
    fontSize: 12,
    lineHeight: 17,
  },
  recipeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  applyRecipeBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyRecipeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
