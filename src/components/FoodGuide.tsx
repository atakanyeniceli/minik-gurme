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
import { FoodTrial, GuideFood, ThemeMode } from '../types';
import { FOOD_CATEGORIES, FOOD_GUIDE_ITEMS, MONTH_TABS } from '../data/foodGuideData';
import { getTodayDateString } from '../utils/storage';
import { getThemeColors } from '../theme/colors';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  ShieldAlert,
  X,
} from 'lucide-react-native';

interface FoodGuideProps {
  trials: FoodTrial[];
  onAddTrialFromGuide: (newTrial: FoodTrial) => void;
  onNavigateToTracker: () => void;
  babyCurrentMonths: number;
  theme: ThemeMode;
}

export const FoodGuide: React.FC<FoodGuideProps> = ({
  trials,
  onAddTrialFromGuide,
  onNavigateToTracker,
  babyCurrentMonths,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFoodDetail, setActiveFoodDetail] = useState<GuideFood | null>(null);

  const getTrialStatusForFood = (foodName: string) => {
    const existing = trials.find(
      (t) => t.foodName.toLowerCase().trim() === foodName.toLowerCase().trim()
    );
    return existing || null;
  };

  const filteredFoods = FOOD_GUIDE_ITEMS.filter((food) => {
    if (selectedMonth !== 'all') {
      const monthNum = parseInt(selectedMonth, 10);
      if (food.minMonth !== monthNum) return false;
    }

    if (selectedCategory !== 'all' && food.category !== selectedCategory) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = food.name.toLowerCase().includes(q);
      const matchBen = food.benefits.toLowerCase().includes(q);
      const matchPrep = food.preparationTip ? food.preparationTip.toLowerCase().includes(q) : false;
      if (!matchName && !matchBen && !matchPrep) return false;
    }

    return true;
  });

  const handleQuickAddToTrial = (food: GuideFood) => {
    const newTrial: FoodTrial = {
      id: 'trial-' + Date.now(),
      foodName: food.name,
      category: food.category,
      startDate: getTodayDateString(),
      day1: { completed: false, date: getTodayDateString(), amountNote: '1 çay kaşığı tadım' },
      day2: { completed: false, date: '', amountNote: '1 tatlı kaşığı' },
      day3: { completed: false, date: '', amountNote: '1 yemek kaşığı' },
      reaction: 'none',
      enjoyment: 3,
      approvedSafe: false,
      notes: food.preparationTip ? `Hazırlık: ${food.preparationTip.slice(0, 70)}...` : '',
      createdAt: Date.now(),
    };

    onAddTrialFromGuide(newTrial);
    onNavigateToTracker();
  };

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View
        style={[
          styles.heroBanner,
          {
            backgroundColor: colors.emeraldBg,
            borderColor: colors.emeraldBorder,
          },
        ]}
      >
        <View style={styles.heroHeaderRow}>
          <Text style={styles.heroEmoji}>🥗</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Ay Ay Güvenli Gıda Rehberi
          </Text>
          <View
            style={[
              styles.pediatricBadge,
              { borderColor: colors.emeraldBorder },
            ]}
          >
            <Text style={[styles.pediatricBadgeText, { color: colors.emeraldText }]}>
              Pediatri Uyumlu
            </Text>
          </View>
        </View>

        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Bebeğinizin ayına uygun sebze, meyve, yoğurt/peynir ve proteinleri keşfedin. Tek
          dokunuşla "3 Gün Kuralına Ekle" butonunu kullanarak tadım takvimini başlatın.
        </Text>

        <View
          style={[
            styles.babyMonthBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.emeraldBorder,
            },
          ]}
        >
          <View style={styles.babyMonthLeft}>
            <Text style={[styles.babyMonthLabel, { color: colors.emeraldText }]}>
              Bebeğinizin Ayı:
            </Text>
            <View style={styles.babyMonthBadge}>
              <Text style={styles.babyMonthBadgeText}>{babyCurrentMonths}. Ay</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              const clamped =
                babyCurrentMonths >= 12
                  ? '12'
                  : babyCurrentMonths >= 9
                  ? '9'
                  : String(Math.max(6, babyCurrentMonths));
              setSelectedMonth(clamped);
            }}
          >
            <Text style={[styles.filterNowLink, { color: colors.emeraldPrimary }]}>
              Ayına Göre Filtrele →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalTabs}
      >
        {MONTH_TABS.map((tab) => {
          const isActive = selectedMonth === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setSelectedMonth(tab.id)}
              activeOpacity={0.8}
              style={[
                styles.monthTab,
                isActive
                  ? { backgroundColor: '#059669', borderColor: '#059669' }
                  : { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.monthTabText,
                  { color: isActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalTabs}
      >
        {FOOD_CATEGORIES.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
              style={[
                styles.catPill,
                isCatActive
                  ? { backgroundColor: '#292524', borderColor: '#292524' }
                  : { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={styles.catEmoji}>{cat.icon}</Text>
              <Text
                style={[
                  styles.catPillText,
                  { color: isCatActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search Input */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Search size={16} color={colors.textMuted} />
        <TextInput
          placeholder="Besin veya fayda ara..."
          placeholderTextColor={colors.textMuted}
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Food Cards List */}
      {filteredFoods.length === 0 ? (
        <View
          style={[
            styles.emptyBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Arama kriterlerinize uygun besin bulunamadı.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedMonth('all');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            <Text style={[styles.clearFiltersLink, { color: colors.emeraldPrimary }]}>
              Filtreleri Temizle
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardsColumn}>
          {filteredFoods.map((food) => {
            const existingTrial = getTrialStatusForFood(food.name);
            const isSafe = existingTrial?.approvedSafe;
            const hasReaction = existingTrial && existingTrial.reaction !== 'none';
            const inProgress = existingTrial && !isSafe && !hasReaction;

            const riskBg =
              food.allergyRisk === 'high'
                ? colors.roseBg
                : food.allergyRisk === 'medium'
                ? colors.amberBg
                : colors.emeraldBg;
            const riskBorder =
              food.allergyRisk === 'high'
                ? colors.roseBorder
                : food.allergyRisk === 'medium'
                ? colors.amberBorder
                : colors.emeraldBorder;
            const riskText =
              food.allergyRisk === 'high'
                ? colors.roseText
                : food.allergyRisk === 'medium'
                ? colors.amberText
                : colors.emeraldText;

            return (
              <View
                key={food.id}
                style={[
                  styles.foodCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Top Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.foodLeftInfo}>
                    <View
                      style={[
                        styles.foodIconWrap,
                        { backgroundColor: colors.surfaceAlt },
                      ]}
                    >
                      <Text style={styles.foodIconText}>{food.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.foodTitleLine}>
                        <Text style={[styles.foodTitle, { color: colors.text }]}>
                          {food.name}
                        </Text>
                        {food.minMonth === 12 && (
                          <View
                            style={[
                              styles.age12Badge,
                              { backgroundColor: colors.roseBg },
                            ]}
                          >
                            <Text style={[styles.age12BadgeText, { color: colors.roseText }]}>
                              12+ Ay
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.minMonthSubtitle, { color: colors.textMuted }]}>
                        {food.minMonth}. Aydan itibaren
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.allergyRiskBadge,
                      { backgroundColor: riskBg, borderColor: riskBorder },
                    ]}
                  >
                    <Text style={[styles.allergyRiskText, { color: riskText }]}>
                      {food.allergyRisk === 'high'
                        ? 'Yüksek Alerjen'
                        : food.allergyRisk === 'medium'
                        ? 'Orta Risk'
                        : 'Düşük Risk'}
                    </Text>
                  </View>
                </View>

                {/* Warning if any */}
                {food.warningNote && (
                  <View
                    style={[
                      styles.warningBox,
                      {
                        backgroundColor: colors.roseBg,
                        borderColor: colors.roseBorder,
                      },
                    ]}
                  >
                    <AlertCircle size={14} color={colors.rosePrimary} style={{ marginTop: 1 }} />
                    <Text style={[styles.warningText, { color: colors.roseText }]}>
                      {food.warningNote}
                    </Text>
                  </View>
                )}

                {/* Benefits */}
                <Text
                  style={[styles.benefitsText, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {food.benefits}
                </Text>

                {/* Preparation snippet */}
                {food.preparationTip && (
                  <View
                    style={[
                      styles.prepBox,
                      { backgroundColor: colors.surfaceAlt },
                    ]}
                  >
                    <Text style={[styles.prepTitle, { color: colors.text }]}>
                      🥄 Sunum / Hazırlama:
                    </Text>
                    <Text
                      style={[styles.prepDesc, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {food.preparationTip}
                    </Text>
                  </View>
                )}

                {/* Bottom Status & Action Buttons */}
                <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
                  {isSafe ? (
                    <View
                      style={[
                        styles.statusChip,
                        { backgroundColor: colors.emeraldBg, borderColor: colors.emeraldBorder },
                      ]}
                    >
                      <CheckCircle2 size={13} color={colors.emeraldPrimary} />
                      <Text style={[styles.statusChipText, { color: colors.emeraldText }]}>
                        Güvenli ✅
                      </Text>
                    </View>
                  ) : hasReaction ? (
                    <View
                      style={[
                        styles.statusChip,
                        { backgroundColor: colors.roseBg, borderColor: colors.roseBorder },
                      ]}
                    >
                      <ShieldAlert size={13} color={colors.rosePrimary} />
                      <Text style={[styles.statusChipText, { color: colors.roseText }]}>
                        Reaksiyon ⚠️
                      </Text>
                    </View>
                  ) : inProgress ? (
                    <View
                      style={[
                        styles.statusChip,
                        { backgroundColor: colors.amberBg, borderColor: colors.amberBorder },
                      ]}
                    >
                      <Clock size={13} color={colors.amberPrimary} />
                      <Text style={[styles.statusChipText, { color: colors.amberText }]}>
                        Deneniyor ⏳
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.untriedText, { color: colors.textMuted }]}>
                      Henüz denenmedi
                    </Text>
                  )}

                  <View style={styles.footerButtons}>
                    <TouchableOpacity
                      onPress={() => setActiveFoodDetail(food)}
                      style={[styles.detailBtn, { backgroundColor: colors.surfaceAlt }]}
                    >
                      <Text style={[styles.detailBtnText, { color: colors.textSecondary }]}>
                        Detay
                      </Text>
                    </TouchableOpacity>

                    {!existingTrial && (
                      <TouchableOpacity
                        onPress={() => handleQuickAddToTrial(food)}
                        style={styles.tryBtn}
                      >
                        <Plus size={14} color="#FFFFFF" />
                        <Text style={styles.tryBtnText}>Dene</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Food Detail Modal */}
      <Modal
        visible={!!activeFoodDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveFoodDetail(null)}
      >
        <View style={styles.modalOverlay}>
          {activeFoodDetail && (
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
                  <View
                    style={[
                      styles.foodIconWrap,
                      { backgroundColor: colors.surfaceAlt },
                    ]}
                  >
                    <Text style={styles.foodIconText}>{activeFoodDetail.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {activeFoodDetail.name}
                    </Text>
                    <Text style={[styles.minMonthSubtitle, { color: colors.textSecondary }]}>
                      {activeFoodDetail.minMonth}. Aydan İtibaren Uygun
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveFoodDetail(null)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {activeFoodDetail.warningNote && (
                  <View
                    style={[
                      styles.warningBox,
                      {
                        backgroundColor: colors.roseBg,
                        borderColor: colors.roseBorder,
                        marginBottom: 14,
                      },
                    ]}
                  >
                    <AlertCircle size={16} color={colors.rosePrimary} />
                    <Text style={[styles.warningText, { color: colors.roseText }]}>
                      {activeFoodDetail.warningNote}
                    </Text>
                  </View>
                )}

                <Text style={[styles.modalSectionTitle, { color: colors.textMuted }]}>
                  FAYDALARI & BESİN DEĞERİ
                </Text>
                <View
                  style={[
                    styles.modalInfoCard,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.modalInfoText, { color: colors.text }]}>
                    {activeFoodDetail.benefits}
                  </Text>
                </View>

                {activeFoodDetail.preparationTip && (
                  <>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.textMuted, marginTop: 14 },
                      ]}
                    >
                      GELENEKSEL PÜRE / ÇATALLA EZME YÖNTEMİ
                    </Text>
                    <View
                      style={[
                        styles.modalInfoCard,
                        { backgroundColor: colors.amberBg, borderColor: colors.amberBorder },
                      ]}
                    >
                      <Text style={[styles.modalInfoText, { color: colors.text }]}>
                        {activeFoodDetail.preparationTip}
                      </Text>
                    </View>
                  </>
                )}

                {activeFoodDetail.blwTip && (
                  <>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.emeraldText, marginTop: 14 },
                      ]}
                    >
                      👶 BLW (PARMAK GIDA) ÖNERİSİ
                    </Text>
                    <View
                      style={[
                        styles.modalInfoCard,
                        {
                          backgroundColor: colors.emeraldBg,
                          borderColor: colors.emeraldBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.modalInfoText, { color: colors.text }]}>
                        {activeFoodDetail.blwTip}
                      </Text>
                    </View>
                  </>
                )}

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    onPress={() => setActiveFoodDetail(null)}
                    style={[styles.closeModalBtn, { backgroundColor: colors.surfaceAlt }]}
                  >
                    <Text style={[styles.closeModalBtnText, { color: colors.textSecondary }]}>
                      Kapat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const item = activeFoodDetail;
                      setActiveFoodDetail(null);
                      handleQuickAddToTrial(item);
                    }}
                    style={styles.addToTrackerModalBtn}
                  >
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.addToTrackerModalBtnText}>
                      3 Gün Kuralı Tablosuna Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  heroBanner: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroEmoji: {
    fontSize: 18,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pediatricBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  pediatricBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  babyMonthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  babyMonthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  babyMonthLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  babyMonthBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  babyMonthBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  filterNowLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  horizontalTabs: {
    gap: 8,
    paddingVertical: 2,
  },
  monthTab: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  monthTabText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  catEmoji: {
    fontSize: 14,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  clearFiltersLink: {
    fontSize: 12.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  cardsColumn: {
    gap: 12,
  },
  foodCard: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  foodLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  foodIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodIconText: {
    fontSize: 24,
  },
  foodTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  foodTitle: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  age12Badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  age12BadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  minMonthSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
  allergyRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  allergyRiskText: {
    fontSize: 10,
    fontWeight: '800',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
  },
  benefitsText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  prepBox: {
    padding: 10,
    borderRadius: 12,
    gap: 3,
  },
  prepTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  prepDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  untriedText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailBtn: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  tryBtnText: {
    color: '#FFFFFF',
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
    maxHeight: '88%',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    marginTop: 14,
  },
  modalSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  modalInfoCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  modalInfoText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  closeModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  closeModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  addToTrackerModalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  addToTrackerModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
