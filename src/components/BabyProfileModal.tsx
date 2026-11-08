import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';
import { BabyProfile, DailyMealPlan, FoodTrial, ThemeMode } from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_TRIALS,
  INITIAL_MEALS,
} from '../utils/storage';
import { getThemeColors } from '../theme/colors';
import { X, RefreshCw, Share2, Check } from 'lucide-react-native';

interface BabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onUpdateProfile: (newProfile: BabyProfile) => void;
  trials: FoodTrial[];
  meals: Record<string, DailyMealPlan>;
  onResetAllData: (p: BabyProfile, t: FoodTrial[], m: Record<string, DailyMealPlan>) => void;
  theme: ThemeMode;
}

const AVATAR_OPTIONS = ['👶', '👧', '🧒', '🐥', '🐻', '🍓', '🥑', '🍼', '🍎', '🥕'];

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  trials,
  meals,
  onResetAllData,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [allergiesNote, setAllergiesNote] = useState(profile.allergiesNote || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setBirthDate(profile.birthDate);
      setAvatar(profile.avatar);
      setAllergiesNote(profile.allergiesNote || '');
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    const updated: BabyProfile = {
      name: name.trim() || 'Minik Gurme',
      birthDate: birthDate.trim() || INITIAL_PROFILE.birthDate,
      avatar,
      allergiesNote: allergiesNote.trim(),
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 550);
  };

  const handleReset = () => {
    Alert.alert(
      'Örnek Verilere Sıfırla',
      'Tüm veriler sıfırlanıp başlangıç örnek verilerine dönecektir. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => {
            onResetAllData(INITIAL_PROFILE, INITIAL_TRIALS, INITIAL_MEALS);
            onClose();
          },
        },
      ]
    );
  };

  const handleShareBackup = async () => {
    const backupData = {
      profile,
      trials,
      meals,
      exportedAt: new Date().toISOString(),
    };
    try {
      await Share.share({
        title: `Minik Gurme Yedek (${new Date().toISOString().split('T')[0]})`,
        message: JSON.stringify(backupData, null, 2),
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
              <Text style={styles.headerEmoji}>🧸</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Bebeğin Profilini Düzenle
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  İsim, doğum tarihi ve avatarı kişiselleştirin.
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Avatar Picker */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Avatar Seçimi:</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((em) => {
                const isSelected = avatar === em;
                return (
                  <TouchableOpacity
                    key={em}
                    onPress={() => setAvatar(em)}
                    style={[
                      styles.avatarBtn,
                      isSelected
                        ? {
                            backgroundColor: colors.amberBg,
                            borderColor: colors.amberPrimary,
                            borderWidth: 1.5,
                          }
                        : {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.border,
                            borderWidth: 1,
                          },
                    ]}
                  >
                    <Text style={styles.avatarEmoji}>{em}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Baby Name */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
              Bebeğin Adı:
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Örn: Can, Zeynep..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            {/* Birth Date */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
              Doğum Tarihi (YYYY-AA-GG):
            </Text>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="2026-04-15"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            {/* Allergies Note */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
              Aile Alerji Özgeçmişi & Özel Notlar:
            </Text>
            <TextInput
              multiline
              numberOfLines={2}
              value={allergiesNote}
              onChangeText={setAllergiesNote}
              placeholder="Örn: Anne süt alerjisi, polen hassasiyeti..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                styles.multiline,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            {/* Save Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceAlt }]}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Kapat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                {savedSuccess ? (
                  <>
                    <Check size={15} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>Kaydedildi!</Text>
                  </>
                ) : (
                  <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Backup & Reset Section */}
            <View style={[styles.dataSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionCaps, { color: colors.textMuted }]}>
                VERİ YEDEKLEME & SIFIRLAMA
              </Text>
              <View style={styles.backupButtonsRow}>
                <TouchableOpacity
                  onPress={handleShareBackup}
                  style={[
                    styles.backupBtn,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Share2 size={14} color={colors.text} />
                  <Text style={[styles.backupBtnText, { color: colors.text }]}>
                    Yedeği Paylaş (JSON)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReset}
                  style={[
                    styles.backupBtn,
                    { backgroundColor: colors.roseBg, borderColor: colors.roseBorder },
                  ]}
                >
                  <RefreshCw size={14} color={colors.rosePrimary} />
                  <Text style={[styles.backupBtnText, { color: colors.roseText }]}>
                    Örnek Verilere Sıfırla
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.privacyNote,
                  {
                    backgroundColor: colors.emeraldBg,
                    borderColor: colors.emeraldBorder,
                  },
                ]}
              >
                <Text style={styles.lockEmoji}>🔒</Text>
                <Text style={[styles.privacyNoteText, { color: colors.emeraldText }]}>
                  Gizlilik Güvencesi: Bebeğinize ait veriler %100 telefonunuzun yerel hafızasında
                  saklanır, asla buluta gönderilmez.
                </Text>
              </View>
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
  headerEmoji: {
    fontSize: 26,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  scroll: {
    marginTop: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  input: {
    fontSize: 13.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  multiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
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
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  dataSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 10,
    marginBottom: 14,
  },
  sectionCaps: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  backupButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  backupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
  },
  backupBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  lockEmoji: {
    fontSize: 16,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
  },
});
