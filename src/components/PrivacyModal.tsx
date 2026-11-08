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
import { BabyProfile, DailyMealPlan, FoodTrial, ThemeMode } from '../types';
import { getThemeColors } from '../theme/colors';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Trash2,
  Share2,
  AlertTriangle,
  X,
} from 'lucide-react-native';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  trials: FoodTrial[];
  meals: Record<string, DailyMealPlan>;
  onClearAllData: () => void;
  theme: ThemeMode;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  profile,
  trials,
  meals,
  onClearAllData,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExportData = async () => {
    const fullBackup = {
      app: 'Minik Gurme - Bebek Ek Gıda & Menü Takibi',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      privacyNotice:
        'Bu dosya yalnızca kullanıcının kendi cihazında oluşturulmuş yerel verileri içerir.',
      profile,
      trials,
      meals,
    };

    try {
      await Share.share({
        title: `Minik Gurme Gizlilik Yedeği (${new Date().toISOString().split('T')[0]})`,
        message: JSON.stringify(fullBackup, null, 2),
      });
    } catch {
      // ignore
    }
  };

  const handleExecuteClear = () => {
    onClearAllData();
    setConfirmClear(false);
    onClose();
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
              <View style={[styles.iconBox, { backgroundColor: colors.emeraldBg }]}>
                <ShieldCheck size={22} color={colors.emeraldPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Gizlilik ve Veri Güvenliği
                  </Text>
                  <View
                    style={[
                      styles.onDeviceBadge,
                      {
                        backgroundColor: colors.emeraldBg,
                        borderColor: colors.emeraldBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.onDeviceBadgeText, { color: colors.emeraldText }]}>
                      %100 Cihaz İçi
                    </Text>
                  </View>
                </View>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Bebeğinizin sağlığı ve mahremiyeti bizim için en yüksek önceliktir.
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Highlight Banner */}
            <View
              style={[
                styles.highlightBox,
                {
                  backgroundColor: colors.emeraldBg,
                  borderColor: colors.emeraldBorder,
                },
              ]}
            >
              <Lock size={18} color={colors.emeraldPrimary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.highlightTitle, { color: colors.text }]}>
                  Sıfır Bulut İletimi • Tamamen Yerel ve Gizli
                </Text>
                <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                  Minik Gurme uygulamasına girdiğiniz bebeğinizin adı, doğum tarihi, alerji
                  belirtileri, tadım notları ve günlük öğün kayıtları kesinlikle hiçbir uzak
                  sunucuya veya üçüncü taraf şirketlere gönderilmez.
                </Text>
              </View>
            </View>

            {/* 4 Pillars */}
            <View style={styles.pillarsColumn}>
              <View
                style={[
                  styles.pillarCard,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <View style={styles.pillarHeader}>
                  <Database size={15} color={colors.emeraldPrimary} />
                  <Text style={[styles.pillarTitle, { color: colors.text }]}>
                    1. Yerel Depolama (AsyncStorage)
                  </Text>
                </View>
                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                  Tüm veriler yalnızca kullandığınız telefonun güvenli yerel hafızasında saklanır.
                </Text>
              </View>

              <View
                style={[
                  styles.pillarCard,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <View style={styles.pillarHeader}>
                  <EyeOff size={15} color={colors.emeraldPrimary} />
                  <Text style={[styles.pillarTitle, { color: colors.text }]}>
                    2. Sıfır Reklam ve Sıfır İzleyici
                  </Text>
                </View>
                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                  Uygulamada hiçbir reklam kütüphanesi, izleme kodu veya kullanıcı profilleme aracı
                  yer almaz.
                </Text>
              </View>

              <View
                style={[
                  styles.pillarCard,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <View style={styles.pillarHeader}>
                  <Share2 size={15} color={colors.emeraldPrimary} />
                  <Text style={[styles.pillarTitle, { color: colors.text }]}>
                    3. Veri Taşınabilirliği (Yedek Alma)
                  </Text>
                </View>
                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                  Girdiğiniz tüm besin ve alerji verileri size aittir. Dilediğiniz an tek dokunuşla
                  JSON formatında dışa aktarabilirsiniz.
                </Text>
              </View>

              <View
                style={[
                  styles.pillarCard,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <View style={styles.pillarHeader}>
                  <Trash2 size={15} color={colors.emeraldPrimary} />
                  <Text style={[styles.pillarTitle, { color: colors.text }]}>
                    4. Unutulma Hakkı (Tam Silme)
                  </Text>
                </View>
                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                  Cihazınızda saklanan tüm bebek profili, gıda deneme kayıtları ve günlük menüleri
                  tek tuşla kalıcı olarak temizleyebilirsiniz.
                </Text>
              </View>
            </View>

            {/* Medical Disclaimer */}
            <View
              style={[
                styles.disclaimerBox,
                {
                  backgroundColor: colors.amberBg,
                  borderColor: colors.amberBorder,
                },
              ]}
            >
              <View style={styles.pillarHeader}>
                <AlertTriangle size={15} color={colors.amberPrimary} />
                <Text style={[styles.pillarTitle, { color: colors.amberText }]}>
                  Tıbbi ve Sağlık Sorumluluk Reddi Beyanı
                </Text>
              </View>
              <Text style={[styles.pillarDesc, { color: colors.amberText }]}>
                Minik Gurme uygulaması, ebeveynlerin bebeklerinin ek gıda sürecini düzenli takip
                edebilmeleri amacıyla tasarlanmış bir bilgilendirme ve kayıt aracıdır; hekim
                tavsiyesi yerine geçmez. Akut alerjik reaksiyonlarda derhal 112 Acil Çağrı
                Merkezine başvurunuz.
              </Text>
            </View>

            {/* Stored Data Summary */}
            <View
              style={[
                styles.storedDataBox,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.storedDataTitle, { color: colors.text }]}>
                Cihazınızda Kayıtlı Olan Veriler ({trials.length} Besin •{' '}
                {Object.keys(meals).length} Günlük Menü)
              </Text>
              <View style={styles.storedPillsRow}>
                <Text style={[styles.storedMetaItem, { color: colors.textSecondary }]}>
                  Bebek: {profile.name}
                </Text>
                <Text style={[styles.storedMetaItem, { color: colors.textSecondary }]}>
                  • Güvenli: {trials.filter((t) => t.approvedSafe).length}
                </Text>
                <Text style={[styles.storedMetaItem, { color: colors.textSecondary }]}>
                  • Reaksiyon: {trials.filter((t) => t.reaction !== 'none').length}
                </Text>
              </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.actionsColumn}>
              <View style={styles.topButtonsRow}>
                <TouchableOpacity
                  onPress={handleExportData}
                  style={[
                    styles.exportBtn,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Share2 size={15} color={colors.text} />
                  <Text style={[styles.exportBtnText, { color: colors.text }]}>
                    Verilerimi Paylaş (JSON)
                  </Text>
                </TouchableOpacity>

                {!confirmClear ? (
                  <TouchableOpacity
                    onPress={() => setConfirmClear(true)}
                    style={[
                      styles.clearBtn,
                      { backgroundColor: colors.roseBg, borderColor: colors.roseBorder },
                    ]}
                  >
                    <Trash2 size={15} color={colors.rosePrimary} />
                    <Text style={[styles.clearBtnText, { color: colors.roseText }]}>
                      Tüm Verileri Temizle
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleExecuteClear} style={styles.confirmClearBtn}>
                    <Text style={styles.confirmClearBtnText}>Evet, Kalıcı Olarak Sil</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
                <Text style={styles.doneBtnText}>Anladım & Kapat</Text>
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
    maxHeight: '92%',
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
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  onDeviceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  onDeviceBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  scroll: {
    marginTop: 14,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  pillarsColumn: {
    gap: 8,
    marginBottom: 12,
  },
  pillarCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  pillarDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  disclaimerBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
    marginBottom: 12,
  },
  storedDataBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
    marginBottom: 14,
  },
  storedDataTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  storedPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  storedMetaItem: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  actionsColumn: {
    gap: 10,
    marginBottom: 14,
  },
  topButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  clearBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  confirmClearBtn: {
    flex: 1,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
  },
  confirmClearBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  doneBtn: {
    backgroundColor: '#292524',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
