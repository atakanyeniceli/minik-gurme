import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  FoodTrial,
  FoodCategory,
  ReactionStatus,
  EnjoymentLevel,
  ThemeMode,
} from '../types';
import { formatTurkishDate, getTodayDateString } from '../utils/storage';
import { getThemeColors } from '../theme/colors';
import {
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Trash2,
  HelpCircle,
  Clock,
  Check,
  X,
} from 'lucide-react-native';

interface ThreeDayTrackerProps {
  trials: FoodTrial[];
  onSaveTrials: (trials: FoodTrial[]) => void;
  onOpenSafetyGuide: () => void;
  theme: ThemeMode;
}

export const REACTION_LABELS: Record<
  ReactionStatus,
  { label: string; textColor: string; bgColor: string; borderColor: string; icon: string }
> = {
  none: {
    label: 'Reaksiyon Yok (Güvenli)',
    textColor: '#047857',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: '🟢',
  },
  rash: {
    label: 'Kızarıklık / Döküntü',
    textColor: '#BE123C',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    icon: '🔴',
  },
  digestive: {
    label: 'Sindirim / Gaz Sorunu',
    textColor: '#92400E',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: '🟡',
  },
  rejected: {
    label: 'Israrla Reddetti',
    textColor: '#7E22CE',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    icon: '🟣',
  },
  vomiting: {
    label: 'Kusma',
    textColor: '#C2410C',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    icon: '🟠',
  },
  swelling: {
    label: 'Şişlik (Doktora Başvurun!)',
    textColor: '#991B1B',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    icon: '🚨',
  },
};

export const ENJOYMENT_CONFIG: Record<EnjoymentLevel, { emoji: string; label: string }> = {
  1: { emoji: '🤢', label: '1 - Hiç Sevmedi' },
  2: { emoji: '😣', label: '2 - Zorlandı' },
  3: { emoji: '😐', label: '3 - Alışıyor / Nötr' },
  4: { emoji: '😊', label: '4 - Sevdi' },
  5: { emoji: '😍', label: '5 - Bayıldı!' },
};

const CATEGORY_NAMES: Record<FoodCategory, { name: string; icon: string }> = {
  sebze: { name: 'Sebze', icon: '🥕' },
  meyve: { name: 'Meyve', icon: '🍎' },
  sut_urunleri: { name: 'Yoğurt & Peynir', icon: '🥣' },
  protein: { name: 'Protein', icon: '🍳' },
  tahil: { name: 'Tahıl & Baklagil', icon: '🌾' },
  yag_tohum: { name: 'Sağlıklı Yağ', icon: '🥑' },
};

const STARTER_PRESETS: { name: string; cat: FoodCategory }[] = [
  { name: 'Havuç', cat: 'sebze' },
  { name: 'Balkabağı', cat: 'sebze' },
  { name: 'Yeşil Kabak', cat: 'sebze' },
  { name: 'Tatlı Patates', cat: 'sebze' },
  { name: 'Avokado', cat: 'yag_tohum' },
  { name: 'Yumurta Sarısı', cat: 'protein' },
  { name: 'Ev Yoğurdu', cat: 'sut_urunleri' },
  { name: 'Elma Püresi', cat: 'meyve' },
  { name: 'Armut', cat: 'meyve' },
  { name: 'Yulaf Lapası', cat: 'tahil' },
];

export const ThreeDayTracker: React.FC<ThreeDayTrackerProps> = ({
  trials,
  onSaveTrials,
  onOpenSafetyGuide,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'approved' | 'reaction'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [celebrationFood, setCelebrationFood] = useState<string | null>(null);

  // New trial form state
  const [newFoodName, setNewFoodName] = useState('');
  const [newCategory, setNewCategory] = useState<FoodCategory>('sebze');
  const [newStartDate, setNewStartDate] = useState(getTodayDateString());
  const [newNotes, setNewNotes] = useState('');

  // Handle day checkbox toggle
  const handleToggleDay = (trialId: string, dayNum: 1 | 2 | 3) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore on unsupported platforms
    }

    const updated = trials.map((t) => {
      if (t.id !== trialId) return t;

      const dayKey = `day${dayNum}` as 'day1' | 'day2' | 'day3';
      const currentDay = t[dayKey];
      const nextCompleted = !currentDay.completed;

      const updatedTrial: FoodTrial = {
        ...t,
        [dayKey]: {
          ...currentDay,
          completed: nextCompleted,
          date: nextCompleted ? currentDay.date || getTodayDateString() : currentDay.date,
        },
      };

      const isDay1Done = dayNum === 1 ? nextCompleted : t.day1.completed;
      const isDay2Done = dayNum === 2 ? nextCompleted : t.day2.completed;
      const isDay3Done = dayNum === 3 ? nextCompleted : t.day3.completed;

      if (isDay1Done && isDay2Done && isDay3Done && t.reaction === 'none') {
        updatedTrial.approvedSafe = true;
        if (!t.approvedSafe) {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {
            // ignore
          }
          setCelebrationFood(t.foodName);
          setTimeout(() => setCelebrationFood(null), 3500);
        }
      } else {
        updatedTrial.approvedSafe = false;
      }

      return updatedTrial;
    });

    onSaveTrials(updated);
  };

  // Update reaction status
  const handleReactionChange = (trialId: string, reaction: ReactionStatus) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    const updated = trials.map((t) => {
      if (t.id !== trialId) return t;
      const isAllDone = t.day1.completed && t.day2.completed && t.day3.completed;
      return {
        ...t,
        reaction,
        approvedSafe: isAllDone && reaction === 'none',
      };
    });
    onSaveTrials(updated);
  };

  // Update enjoyment rating
  const handleEnjoymentChange = (trialId: string, enjoyment: EnjoymentLevel) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    const updated = trials.map((t) => (t.id === trialId ? { ...t, enjoyment } : t));
    onSaveTrials(updated);
  };

  // Update notes
  const handleUpdateNotes = (trialId: string, notes: string) => {
    const updated = trials.map((t) => (t.id === trialId ? { ...t, notes } : t));
    onSaveTrials(updated);
  };

  // Delete trial
  const handleDeleteTrial = (trialId: string, foodName: string) => {
    Alert.alert(
      'Kaydı Sil',
      `"${foodName}" besin deneme kaydını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onSaveTrials(trials.filter((t) => t.id !== trialId)),
        },
      ]
    );
  };

  // Add new food trial
  const handleAddTrialSubmit = () => {
    if (!newFoodName.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen besin adını girin.');
      return;
    }

    const newTrial: FoodTrial = {
      id: 'trial-' + Date.now(),
      foodName: newFoodName.trim(),
      category: newCategory,
      startDate: newStartDate || getTodayDateString(),
      day1: {
        completed: false,
        date: newStartDate || getTodayDateString(),
        amountNote: '1 çay kaşığı tadım',
      },
      day2: { completed: false, date: '', amountNote: '1 tatlı kaşığı' },
      day3: { completed: false, date: '', amountNote: '1 yemek kaşığı' },
      reaction: 'none',
      enjoyment: 3,
      approvedSafe: false,
      notes: newNotes.trim(),
      createdAt: Date.now(),
    };

    onSaveTrials([newTrial, ...trials]);
    setNewFoodName('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const filteredTrials = trials.filter((t) => {
    const matchesSearch =
      t.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'in_progress') {
      return !t.approvedSafe && t.reaction === 'none';
    }
    if (statusFilter === 'approved') {
      return t.approvedSafe;
    }
    if (statusFilter === 'reaction') {
      return t.reaction !== 'none';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Celebratory Banner when 3-day rule completes */}
      {celebrationFood && (
        <View style={styles.celebrationBanner}>
          <Text style={styles.celebrationTitle}>🎉 Harika! {celebrationFood} 3 Gün Kuralını Tamamladı!</Text>
          <Text style={styles.celebrationSub}>
            Reaksiyon gözlenmediği için güvenli besinler listenize eklendi.
          </Text>
        </View>
      )}

      {/* Top Banner / Explanation of 3 Day Rule */}
      <View
        style={[
          styles.infoBanner,
          {
            backgroundColor: colors.amberBg,
            borderColor: colors.amberBorder,
          },
        ]}
      >
        <View style={styles.infoBannerHeader}>
          <Text style={styles.sparkleIcon}>✨</Text>
          <Text style={[styles.infoBannerTitle, { color: colors.text }]}>
            3 Gün Kuralı Nasıl Çalışır?
          </Text>
          <View style={styles.goldRuleBadge}>
            <Text style={styles.goldRuleBadgeText}>Altın Kural</Text>
          </View>
        </View>

        <Text style={[styles.infoBannerDesc, { color: colors.textSecondary }]}>
          Bebeğinizi yeni bir besinle tanıştırırken 3 gün üst üste sadece o besini tek başına verin.
          Bebek yedikçe 1. Gün, 2. Gün ve 3. Gün kutucuklarını işaretleyin. Alerjik döküntü veya
          sindirim reaksiyonu olmadığını gözlemledikten sonra besin güvenle onaylanır.
        </Text>

        <View style={styles.bannerButtonsRow}>
          <TouchableOpacity
            onPress={onOpenSafetyGuide}
            activeOpacity={0.75}
            style={[
              styles.guideButton,
              {
                backgroundColor: theme === 'dark' ? '#3F2B13' : '#FEF3C7',
                borderColor: colors.amberBorder,
              },
            ]}
          >
            <HelpCircle size={15} color={colors.amberText} />
            <Text style={[styles.guideButtonText, { color: colors.amberText }]}>
              Alerji Rehberi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsAddModalOpen(true)}
            activeOpacity={0.8}
            style={styles.addFoodButton}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addFoodButtonText}>Yeni Besin Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Search size={16} color={colors.textMuted} />
        <TextInput
          placeholder="Besin adı veya not ara (örn: Havuç, Avokado)..."
          placeholderTextColor={colors.textMuted}
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} activeOpacity={0.7}>
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterPillsScroll}
      >
        <TouchableOpacity
          onPress={() => setStatusFilter('all')}
          style={[
            styles.filterPill,
            statusFilter === 'all'
              ? { backgroundColor: '#292524', borderColor: '#292524' }
              : { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.filterPillText,
              { color: statusFilter === 'all' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Tümü ({trials.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('in_progress')}
          style={[
            styles.filterPill,
            statusFilter === 'in_progress'
              ? { backgroundColor: '#D97706', borderColor: '#D97706' }
              : { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Clock size={12} color={statusFilter === 'in_progress' ? '#FFFFFF' : colors.textSecondary} />
          <Text
            style={[
              styles.filterPillText,
              { color: statusFilter === 'in_progress' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Deneniyor ({trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('approved')}
          style={[
            styles.filterPill,
            statusFilter === 'approved'
              ? { backgroundColor: '#059669', borderColor: '#059669' }
              : { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <CheckCircle2
            size={12}
            color={statusFilter === 'approved' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterPillText,
              { color: statusFilter === 'approved' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Güvenli ({trials.filter((t) => t.approvedSafe).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('reaction')}
          style={[
            styles.filterPill,
            statusFilter === 'reaction'
              ? { backgroundColor: '#E11D48', borderColor: '#E11D48' }
              : { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <AlertTriangle
            size={12}
            color={statusFilter === 'reaction' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterPillText,
              { color: statusFilter === 'reaction' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Reaksiyon ({trials.filter((t) => t.reaction !== 'none').length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Trials Card List */}
      {filteredTrials.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.emptyIcon}>🥣</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Kayıtlı Besin Bulunamadı</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {searchTerm
              ? `"${searchTerm}" aramasına uygun besin bulunamadı.`
              : 'Henüz deneme tablonuzda besin yok. Bebeğinizin ilk tadımı için yeni bir besin ekleyin!'}
          </Text>
          <TouchableOpacity
            onPress={() => setIsAddModalOpen(true)}
            style={styles.addFoodButton}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.addFoodButtonText}>Yeni Besin Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardsColumn}>
          {filteredTrials.map((trial) => {
            const catInfo = CATEGORY_NAMES[trial.category] || { name: 'Gıda', icon: '🍽️' };
            const enjoymentInfo = ENJOYMENT_CONFIG[trial.enjoyment];

            return (
              <View
                key={trial.id}
                style={[
                  styles.trialCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: trial.approvedSafe
                      ? colors.emeraldBorder
                      : trial.reaction !== 'none'
                      ? colors.roseBorder
                      : colors.border,
                  },
                ]}
              >
                {/* Card Top Header */}
                <View style={styles.cardTopRow}>
                  <View style={styles.foodIdentity}>
                    <View
                      style={[
                        styles.foodIconBox,
                        { backgroundColor: colors.surfaceAlt },
                      ]}
                    >
                      <Text style={styles.foodEmoji}>{catInfo.icon}</Text>
                    </View>

                    <View style={styles.foodTitleWrap}>
                      <View style={styles.foodNameRow}>
                        <Text style={[styles.foodNameText, { color: colors.text }]}>
                          {trial.foodName}
                        </Text>
                        {trial.approvedSafe && (
                          <View
                            style={[
                              styles.safeBadge,
                              { backgroundColor: colors.emeraldBg },
                            ]}
                          >
                            <Text style={[styles.safeBadgeText, { color: colors.emeraldText }]}>
                              Güvenli ✅
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.foodSubRow}>
                        <Text style={[styles.foodSubText, { color: colors.textMuted }]}>
                          {catInfo.name}
                        </Text>
                        <Text style={{ color: colors.textMuted }}>•</Text>
                        <View style={styles.dateRow}>
                          <Calendar size={11} color={colors.textMuted} />
                          <Text style={[styles.foodSubText, { color: colors.textMuted }]}>
                            {formatTurkishDate(trial.startDate)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteTrial(trial.id, trial.foodName)}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* 3-Day Rule Checkboxes */}
                <View style={styles.sectionBlock}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    3 GÜN KURALI İLERLEMESİ (YEDİKÇE İŞARETLEYİN):
                  </Text>
                  <View style={styles.daysGrid}>
                    {([1, 2, 3] as const).map((dayNum) => {
                      const dayRecord = trial[`day${dayNum}` as 'day1' | 'day2' | 'day3'];
                      const isDone = dayRecord.completed;
                      const isThirdAndDone = dayNum === 3 && isDone;

                      return (
                        <TouchableOpacity
                          key={dayNum}
                          onPress={() => handleToggleDay(trial.id, dayNum)}
                          activeOpacity={0.75}
                          style={[
                            styles.dayButton,
                            isThirdAndDone
                              ? { backgroundColor: '#10B981', borderColor: '#059669' }
                              : isDone
                              ? {
                                  backgroundColor: colors.emeraldBg,
                                  borderColor: colors.emeraldBorder,
                                }
                              : {
                                  backgroundColor: colors.surfaceAlt,
                                  borderColor: colors.border,
                                },
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayButtonLabel,
                              {
                                color: isThirdAndDone
                                  ? '#FFFFFF'
                                  : isDone
                                  ? colors.emeraldText
                                  : colors.textSecondary,
                              },
                            ]}
                          >
                            {dayNum}. Gün
                          </Text>
                          <View
                            style={[
                              styles.checkboxSquare,
                              isThirdAndDone
                                ? { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }
                                : isDone
                                ? { backgroundColor: '#059669', borderColor: '#059669' }
                                : { backgroundColor: colors.surface, borderColor: colors.textMuted },
                            ]}
                          >
                            {isDone && (
                              <Check
                                size={14}
                                strokeWidth={3}
                                color={isThirdAndDone ? '#059669' : '#FFFFFF'}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Reaction Selector Pills */}
                <View style={styles.sectionBlock}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    REAKSİYON / ALERJİ DURUMU:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.reactionPillsRow}
                  >
                    {(Object.keys(REACTION_LABELS) as ReactionStatus[]).map((statusKey) => {
                      const rInfo = REACTION_LABELS[statusKey];
                      const isSelected = trial.reaction === statusKey;
                      return (
                        <TouchableOpacity
                          key={statusKey}
                          onPress={() => handleReactionChange(trial.id, statusKey)}
                          activeOpacity={0.75}
                          style={[
                            styles.reactionOptionPill,
                            isSelected
                              ? {
                                  backgroundColor: rInfo.bgColor,
                                  borderColor: rInfo.textColor,
                                  borderWidth: 1.5,
                                }
                              : {
                                  backgroundColor: colors.surfaceAlt,
                                  borderColor: colors.border,
                                  borderWidth: 1,
                                },
                          ]}
                        >
                          <Text style={styles.reactionEmoji}>{rInfo.icon}</Text>
                          <Text
                            style={[
                              styles.reactionOptionText,
                              {
                                color: isSelected ? rInfo.textColor : colors.textSecondary,
                                fontWeight: isSelected ? '700' : '500',
                              },
                            ]}
                          >
                            {rInfo.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Enjoyment Rating (1-5 Emoji) */}
                <View style={styles.enjoymentRow}>
                  <View>
                    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                      BEBEĞİN BEĞENME DURUMU:
                    </Text>
                    <Text style={[styles.enjoymentCurrentLabel, { color: colors.textSecondary }]}>
                      {enjoymentInfo.label}
                    </Text>
                  </View>

                  <View style={styles.emojiButtonsRow}>
                    {([1, 2, 3, 4, 5] as EnjoymentLevel[]).map((level) => {
                      const conf = ENJOYMENT_CONFIG[level];
                      const isSelected = trial.enjoyment === level;
                      return (
                        <TouchableOpacity
                          key={level}
                          onPress={() => handleEnjoymentChange(trial.id, level)}
                          activeOpacity={0.75}
                          style={[
                            styles.emojiBtn,
                            isSelected && {
                              backgroundColor: colors.amberBg,
                              borderColor: colors.amberBorder,
                              borderWidth: 1,
                              transform: [{ scale: 1.12 }],
                            },
                            !isSelected && { opacity: 0.45 },
                          ]}
                        >
                          <Text style={styles.emojiBtnText}>{conf.emoji}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Notes Input */}
                <TextInput
                  value={trial.notes || ''}
                  onChangeText={(txt) => handleUpdateNotes(trial.id, txt)}
                  placeholder="Kısa not (miktar, dışkı veya tepki)..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.noteInput,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      )}

      {/* Add New Food Trial Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
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
              <View style={styles.modalTitleGroup}>
                <Text style={styles.modalEmoji}>🥣</Text>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Yeni Besin Denemesi Başlat
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    3 gün boyunca takip edilecek yeni gıdayı ekleyin.
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Starter Presets */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Popüler Başlangıç Besinlerinden Hızlıca Seçin:
              </Text>
              <View style={styles.presetGrid}>
                {STARTER_PRESETS.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                      setNewFoodName(item.name);
                      setNewCategory(item.cat);
                    }}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor:
                          newFoodName === item.name ? colors.amberBg : colors.surfaceAlt,
                        borderColor:
                          newFoodName === item.name ? colors.amberBorder : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color:
                            newFoodName === item.name ? colors.amberText : colors.textSecondary,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Food Name */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                Besin Adı *
              </Text>
              <TextInput
                placeholder="Örn: Havuç, Avokado, Yumurta Sarısı..."
                placeholderTextColor={colors.textMuted}
                value={newFoodName}
                onChangeText={setNewFoodName}
                style={[
                  styles.textInputField,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              {/* Category Picker */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                Kategori
              </Text>
              <View style={styles.categoryPickerGrid}>
                {(Object.keys(CATEGORY_NAMES) as FoodCategory[]).map((catKey) => {
                  const cInfo = CATEGORY_NAMES[catKey];
                  const isSelected = newCategory === catKey;
                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => setNewCategory(catKey)}
                      style={[
                        styles.categoryOption,
                        {
                          backgroundColor: isSelected ? colors.amberBg : colors.surfaceAlt,
                          borderColor: isSelected ? colors.amberPrimary : colors.border,
                        },
                      ]}
                    >
                      <Text style={styles.categoryOptionIcon}>{cInfo.icon}</Text>
                      <Text
                        style={[
                          styles.categoryOptionText,
                          { color: isSelected ? colors.amberText : colors.text },
                        ]}
                      >
                        {cInfo.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Start Date */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                Başlangıç Tarihi (YYYY-AA-GG)
              </Text>
              <TextInput
                placeholder="2026-11-08"
                placeholderTextColor={colors.textMuted}
                value={newStartDate}
                onChangeText={setNewStartDate}
                style={[
                  styles.textInputField,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              {/* Notes */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                Başlangıç Notu (İsteğe bağlı)
              </Text>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Örn: Sabah 10:00'da buharda çatalla ezilerek 1 çay kaşığı verildi..."
                placeholderTextColor={colors.textMuted}
                value={newNotes}
                onChangeText={setNewNotes}
                style={[
                  styles.textInputField,
                  styles.multilineField,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  onPress={() => setIsAddModalOpen(false)}
                  style={[styles.cancelBtn, { backgroundColor: colors.surfaceAlt }]}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleAddTrialSubmit} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>Listeye Ekle ve Başlat</Text>
                </TouchableOpacity>
              </View>
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
  celebrationBanner: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 16,
    gap: 2,
  },
  celebrationTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  celebrationSub: {
    color: '#D1FAE5',
    fontSize: 12,
  },
  infoBanner: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  infoBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  sparkleIcon: {
    fontSize: 18,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  goldRuleBadge: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  goldRuleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78350F',
  },
  infoBannerDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  bannerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  guideButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  addFoodButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  searchContainer: {
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
  filterPillsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardsColumn: {
    gap: 12,
  },
  trialCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  foodIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  foodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodEmoji: {
    fontSize: 22,
  },
  foodTitleWrap: {
    flex: 1,
  },
  foodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  foodNameText: {
    fontSize: 16,
    fontWeight: '800',
  },
  safeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  safeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  foodSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  foodSubText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  deleteBtn: {
    padding: 6,
  },
  sectionBlock: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dayButtonLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxSquare: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionPillsRow: {
    gap: 6,
    paddingVertical: 2,
  },
  reactionOptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 11,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionOptionText: {
    fontSize: 11.5,
  },
  enjoymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  enjoymentCurrentLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  emojiButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emojiBtn: {
    padding: 6,
    borderRadius: 10,
  },
  emojiBtnText: {
    fontSize: 21,
  },
  noteInput: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 11,
    borderWidth: 1,
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
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalEmoji: {
    fontSize: 26,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
  },
  modalScroll: {
    marginTop: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textInputField: {
    fontSize: 13.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  multilineField: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  categoryPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
    borderWidth: 1,
  },
  categoryOptionIcon: {
    fontSize: 15,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
