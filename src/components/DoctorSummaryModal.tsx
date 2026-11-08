import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Share,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BabyProfile, FoodTrial, ThemeMode } from '../types';
import { calculateAge, formatTurkishDate } from '../utils/storage';
import { REACTION_LABELS, ENJOYMENT_CONFIG } from './ThreeDayTracker';
import { getThemeColors } from '../theme/colors';
import {
  FileText,
  Copy,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Share2,
} from 'lucide-react-native';

interface DoctorSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  trials: FoodTrial[];
  theme: ThemeMode;
}

export const DoctorSummaryModal: React.FC<DoctorSummaryModalProps> = ({
  isOpen,
  onClose,
  profile,
  trials,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const [copied, setCopied] = useState(false);

  const age = calculateAge(profile.birthDate);
  const safeFoods = trials.filter((t) => t.approvedSafe);
  const reactionFoods = trials.filter((t) => t.reaction !== 'none');
  const inProgressFoods = trials.filter((t) => !t.approvedSafe && t.reaction === 'none');

  const generatePlainTextReport = () => {
    let text = `📋 EK GIDA VE ALERJİ TAKİP RAPORU\n`;
    text += `Bebek: ${profile.name}\n`;
    text += `Yaş: ${age.months} Ay ${age.days} Günlük (Doğum: ${formatTurkishDate(profile.birthDate)})\n`;
    if (profile.allergiesNote) {
      text += `Aile Alerji Notu: ${profile.allergiesNote}\n`;
    }
    text += `Rapor Tarihi: ${formatTurkishDate(new Date().toISOString().split('T')[0])}\n\n`;

    text += `✅ 3 GÜN KURALINI TAMAMLAYAN GÜVENLİ BESİNLER (${safeFoods.length}):\n`;
    if (safeFoods.length === 0) {
      text += `- Henüz tamamlanan yok\n`;
    } else {
      safeFoods.forEach((f) => {
        text += `- ${f.foodName} (${formatTurkishDate(f.startDate)}) | Beğenme: ${ENJOYMENT_CONFIG[f.enjoyment].emoji}\n`;
      });
    }

    text += `\n⚠️ REAKSİYON / ALERJİ GÖRÜLEN BESİNLER (${reactionFoods.length}):\n`;
    if (reactionFoods.length === 0) {
      text += `- Kayıtlı alerjik reaksiyon yok.\n`;
    } else {
      reactionFoods.forEach((f) => {
        text += `- ${f.foodName} | Reaksiyon: ${REACTION_LABELS[f.reaction].label} | Tarih: ${formatTurkishDate(f.startDate)}\n  Not: ${f.notes || 'Detay girilmedi'}\n`;
      });
    }

    text += `\n⏳ ŞU AN DENENMEKTE OLANLAR (${inProgressFoods.length}):\n`;
    inProgressFoods.forEach((f) => {
      const d1 = f.day1.completed ? '1.G:✓' : '1.G:✗';
      const d2 = f.day2.completed ? '2.G:✓' : '2.G:✗';
      const d3 = f.day3.completed ? '3.G:✓' : '3.G:✗';
      text += `- ${f.foodName} [${d1} ${d2} ${d3}] (Başlangıç: ${formatTurkishDate(f.startDate)})\n`;
    });

    return text;
  };

  const handleCopy = async () => {
    const report = generatePlainTextReport();
    await Clipboard.setStringAsync(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    const report = generatePlainTextReport();
    try {
      await Share.share({
        title: `${profile.name} - Ek Gıda & Alerji Raporu`,
        message: report,
      });
    } catch {
      // ignore
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.amberBg }]}>
                <FileText size={20} color={colors.amberPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Pediatrist / Doktor Ek Gıda Özeti
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Aylık doktor kontrolünde paylaşabileceğiniz besin ve alerji geçmişi.
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.reportCard,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Baby Meta */}
              <View style={[styles.babyMetaRow, { borderBottomColor: colors.border }]}>
                <View style={styles.babyIdentityRow}>
                  <Text style={styles.avatarEmoji}>{profile.avatar}</Text>
                  <Text style={[styles.babyName, { color: colors.text }]}>{profile.name}</Text>
                  <View style={[styles.ageBadge, { backgroundColor: colors.emeraldBg }]}>
                    <Text style={[styles.ageBadgeText, { color: colors.emeraldText }]}>
                      {age.months} Ay {age.days} Günlük
                    </Text>
                  </View>
                </View>
                <Text style={[styles.metaSmall, { color: colors.textSecondary }]}>
                  Doğum Tarihi: {formatTurkishDate(profile.birthDate)}
                </Text>
              </View>

              {!!profile.allergiesNote && (
                <View
                  style={[
                    styles.allergyHistoryBox,
                    {
                      backgroundColor: colors.amberBg,
                      borderColor: colors.amberBorder,
                    },
                  ]}
                >
                  <Text style={[styles.allergyHistoryText, { color: colors.amberText }]}>
                    Aile Alerji Özgeçmişi: {profile.allergiesNote}
                  </Text>
                </View>
              )}

              {/* Section 1: Reactions */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <AlertTriangle size={15} color={colors.rosePrimary} />
                  <Text style={[styles.sectionHeaderTitle, { color: colors.roseText }]}>
                    GÖZLENEN REAKSİYON VE ALERJİLER ({reactionFoods.length})
                  </Text>
                </View>

                {reactionFoods.length === 0 ? (
                  <View
                    style={[
                      styles.emptyItemBox,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.emptyItemText, { color: colors.textSecondary }]}>
                      Hiçbir besinde döküntü veya sindirim reaksiyonu gözlenmedi.
                    </Text>
                  </View>
                ) : (
                  reactionFoods.map((f) => (
                    <View
                      key={f.id}
                      style={[
                        styles.reactionItemCard,
                        { backgroundColor: colors.surface, borderColor: colors.roseBorder },
                      ]}
                    >
                      <View style={styles.reactionItemTop}>
                        <Text style={[styles.reactionFoodName, { color: colors.text }]}>
                          {f.foodName}
                        </Text>
                        <Text style={[styles.reactionStatusLabel, { color: colors.rosePrimary }]}>
                          {REACTION_LABELS[f.reaction].label}
                        </Text>
                      </View>
                      <Text style={[styles.metaSmall, { color: colors.textMuted }]}>
                        Tarih: {formatTurkishDate(f.startDate)}
                      </Text>
                      {!!f.notes && (
                        <Text style={[styles.reactionNoteText, { color: colors.textSecondary }]}>
                          {f.notes}
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </View>

              {/* Section 2: Approved Safe Foods */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <CheckCircle2 size={15} color={colors.emeraldPrimary} />
                  <Text style={[styles.sectionHeaderTitle, { color: colors.emeraldText }]}>
                    3 GÜNÜ TAMAMLAYAN GÜVENLİ BESİNLER ({safeFoods.length})
                  </Text>
                </View>

                {safeFoods.length === 0 ? (
                  <View
                    style={[
                      styles.emptyItemBox,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.emptyItemText, { color: colors.textSecondary }]}>
                      Henüz 3 günü tamamlanan besin yok.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.safeChipsWrap}>
                    {safeFoods.map((f) => (
                      <View
                        key={f.id}
                        style={[
                          styles.safeChip,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.emeraldBorder,
                          },
                        ]}
                      >
                        <Text style={[styles.safeChipName, { color: colors.text }]}>
                          {f.foodName}
                        </Text>
                        <Text>{ENJOYMENT_CONFIG[f.enjoyment].emoji}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Section 3: In Progress */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeaderTitle, { color: colors.amberText }]}>
                  ⏳ DENENMEKTE OLAN BESİNLER ({inProgressFoods.length})
                </Text>
                {inProgressFoods.map((f) => (
                  <View
                    key={f.id}
                    style={[
                      styles.inProgressRow,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.inProgressName, { color: colors.text }]}>
                      {f.foodName}
                    </Text>
                    <Text style={[styles.inProgressStatus, { color: colors.textSecondary }]}>
                      {f.day3.completed
                        ? '3. gün tamamlandı'
                        : f.day2.completed
                        ? '2. gün tamamlandı'
                        : f.day1.completed
                        ? '1. gün tamamlandı'
                        : 'Başlatıldı'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActionsRow}>
              <TouchableOpacity
                onPress={handleCopy}
                style={[
                  styles.copyBtn,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                {copied ? (
                  <>
                    <Check size={16} color={colors.emeraldPrimary} />
                    <Text style={[styles.copyBtnText, { color: colors.emeraldText }]}>
                      Kopyalandı!
                    </Text>
                  </>
                ) : (
                  <>
                    <Copy size={16} color={colors.text} />
                    <Text style={[styles.copyBtnText, { color: colors.text }]}>Metin Kopyala</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                <Share2 size={16} color="#FFFFFF" />
                <Text style={styles.shareBtnText}>Raporu Paylaş (WhatsApp / PDF)</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 10, 9, 0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11.5,
  },
  scroll: {
    marginTop: 14,
  },
  reportCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  babyMetaRow: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 4,
  },
  babyIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  babyName: {
    fontSize: 17,
    fontWeight: '800',
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  metaSmall: {
    fontSize: 11.5,
  },
  allergyHistoryBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  allergyHistoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyItemBox: {
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyItemText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  reactionItemCard: {
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  reactionItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionFoodName: {
    fontSize: 13,
    fontWeight: '800',
  },
  reactionStatusLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  reactionNoteText: {
    fontSize: 12,
    marginTop: 2,
  },
  safeChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  safeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 11,
    borderWidth: 1,
  },
  safeChipName: {
    fontSize: 12,
    fontWeight: '700',
  },
  inProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 11,
    borderWidth: 1,
  },
  inProgressName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  inProgressStatus: {
    fontSize: 11.5,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 12,
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  shareBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
