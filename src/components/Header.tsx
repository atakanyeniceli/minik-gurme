import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabyProfile, FoodTrial, ThemeMode } from '../types';
import { calculateAge } from '../utils/storage';
import { getThemeColors } from '../theme/colors';
import {
  Calendar,
  ShieldAlert,
  FileText,
  CheckCircle2,
  Clock,
  Lock,
  Sun,
  Moon,
} from 'lucide-react-native';

interface HeaderProps {
  profile: BabyProfile;
  trials: FoodTrial[];
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  onOpenProfile: () => void;
  onOpenDoctorSummary: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  trials,
  theme,
  onToggleTheme,
  onOpenProfile,
  onOpenDoctorSummary,
  onOpenPrivacy,
}) => {
  const colors = getThemeColors(theme);
  const age = calculateAge(profile.birthDate);

  const approvedSafeCount = trials.filter((t) => t.approvedSafe).length;
  const inProgressCount = trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length;
  const reactionCount = trials.filter((t) => t.reaction !== 'none').length;

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Top Row: Avatar, Baby Name & Age + Theme Toggle */}
      <View style={styles.topRow}>
        <View style={styles.profileGroup}>
          <TouchableOpacity
            onPress={onOpenProfile}
            activeOpacity={0.75}
            style={[
              styles.avatarBtn,
              {
                backgroundColor: colors.amberBg,
                borderColor: colors.amberBorder,
              },
            ]}
          >
            <Text style={styles.avatarText}>{profile.avatar || '👶'}</Text>
          </TouchableOpacity>

          <View style={styles.nameColumn}>
            <View style={styles.titleRow}>
              <Text style={[styles.babyName, { color: colors.text }]} numberOfLines={1}>
                {profile.name || 'Minik Gurme'}
              </Text>
              <View
                style={[
                  styles.journalBadge,
                  {
                    backgroundColor: colors.emeraldBg,
                    borderColor: colors.emeraldBorder,
                  },
                ]}
              >
                <Text style={[styles.journalBadgeText, { color: colors.emeraldText }]}>
                  Ek Gıda Günlüğü
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.agePill,
                  { backgroundColor: colors.amberBg },
                ]}
              >
                <Calendar size={12} color={colors.amberText} />
                <Text style={[styles.agePillText, { color: colors.amberText }]}>
                  {age.months} Ay {age.days} Günlük
                </Text>
              </View>

              <TouchableOpacity onPress={onOpenProfile} activeOpacity={0.7}>
                <Text style={[styles.editProfileLink, { color: colors.textSecondary }]}>
                  Profili Düzenle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Theme Switcher */}
        <View
          style={[
            styles.themeToggleGroup,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => onToggleTheme('light')}
            style={[
              styles.themeBtn,
              theme === 'light' && { backgroundColor: '#FFFFFF' },
            ]}
            activeOpacity={0.8}
          >
            <Sun size={14} color={theme === 'light' ? '#D97706' : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onToggleTheme('dark')}
            style={[
              styles.themeBtn,
              theme === 'dark' && { backgroundColor: '#1C1917' },
            ]}
            activeOpacity={0.8}
          >
            <Moon size={14} color={theme === 'dark' ? '#FCD34D' : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row: Stats Pills & Action Buttons */}
      <View style={styles.bottomRow}>
        {/* Stats Pills */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statPill,
              {
                backgroundColor: colors.emeraldBg,
                borderColor: colors.emeraldBorder,
              },
            ]}
          >
            <CheckCircle2 size={13} color={colors.emeraldPrimary} />
            <Text style={[styles.statCount, { color: colors.emeraldText }]}>
              {approvedSafeCount} Güvenli
            </Text>
          </View>

          <View
            style={[
              styles.statPill,
              {
                backgroundColor: colors.amberBg,
                borderColor: colors.amberBorder,
              },
            ]}
          >
            <Clock size={13} color={colors.amberPrimary} />
            <Text style={[styles.statCount, { color: colors.amberText }]}>
              {inProgressCount} Deneniyor
            </Text>
          </View>

          {reactionCount > 0 && (
            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: colors.roseBg,
                  borderColor: colors.roseBorder,
                },
              ]}
            >
              <ShieldAlert size={13} color={colors.rosePrimary} />
              <Text style={[styles.statCount, { color: colors.roseText }]}>
                {reactionCount} Reaksiyon
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions: Doktor Raporu & Gizlilik */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onOpenDoctorSummary}
            activeOpacity={0.75}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
              },
            ]}
          >
            <FileText size={13} color={colors.textSecondary} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Rapor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenPrivacy}
            activeOpacity={0.75}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.emeraldBg,
                borderColor: colors.emeraldBorder,
              },
            ]}
          >
            <Lock size={13} color={colors.emeraldPrimary} />
            <Text style={[styles.actionBtnText, { color: colors.emeraldText }]}>Gizlilik</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 23,
  },
  nameColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  babyName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  journalBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  journalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  agePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  agePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  editProfileLink: {
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  themeToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 11,
    borderWidth: 1,
  },
  themeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
