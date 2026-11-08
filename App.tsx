import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { ActiveTab, BabyProfile, DailyMealPlan, FoodTrial, ThemeMode } from './src/types';
import {
  INITIAL_PROFILE,
  INITIAL_TRIALS,
  INITIAL_MEALS,
  loadBabyProfile,
  saveBabyProfile,
  loadFoodTrials,
  saveFoodTrials,
  loadDailyMeals,
  saveDailyMeals,
  calculateAge,
  loadThemeMode,
  saveThemeMode,
  clearAllStorage,
} from './src/utils/storage';
import { getThemeColors } from './src/theme/colors';
import { Header } from './src/components/Header';
import { ThreeDayTracker } from './src/components/ThreeDayTracker';
import { FoodGuide } from './src/components/FoodGuide';
import { MealPlanner } from './src/components/MealPlanner';
import { SafetyCards } from './src/components/SafetyCards';
import { DoctorSummaryModal } from './src/components/DoctorSummaryModal';
import { BabyProfileModal } from './src/components/BabyProfileModal';
import { PrivacyModal } from './src/components/PrivacyModal';
import {
  CalendarCheck2,
  BookOpen,
  CalendarDays,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react-native';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [profile, setProfile] = useState<BabyProfile>(INITIAL_PROFILE);
  const [trials, setTrials] = useState<FoodTrial[]>(INITIAL_TRIALS);
  const [meals, setMeals] = useState<Record<string, DailyMealPlan>>(INITIAL_MEALS);

  // Modals
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Load persisted state from AsyncStorage on startup
  useEffect(() => {
    let mounted = true;
    async function initStorage() {
      const [loadedTheme, loadedProfile, loadedTrials, loadedMeals] = await Promise.all([
        loadThemeMode(),
        loadBabyProfile(),
        loadFoodTrials(),
        loadDailyMeals(),
      ]);
      if (mounted) {
        setTheme(loadedTheme);
        setProfile(loadedProfile);
        setTrials(loadedTrials);
        setMeals(loadedMeals);
        setIsLoaded(true);
      }
    }
    initStorage();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveThemeMode(newTheme);
  };

  const handleUpdateProfile = (newProfile: BabyProfile) => {
    setProfile(newProfile);
    saveBabyProfile(newProfile);
  };

  const handleUpdateTrials = (newTrials: FoodTrial[]) => {
    setTrials(newTrials);
    saveFoodTrials(newTrials);
  };

  const handleUpdateMeals = (newMeals: Record<string, DailyMealPlan>) => {
    setMeals(newMeals);
    saveDailyMeals(newMeals);
  };

  const handleResetAllData = (
    p: BabyProfile,
    t: FoodTrial[],
    m: Record<string, DailyMealPlan>
  ) => {
    setProfile(p);
    setTrials(t);
    setMeals(m);
    saveBabyProfile(p);
    saveFoodTrials(t);
    saveDailyMeals(m);
  };

  const handleClearAllData = async () => {
    await clearAllStorage();
    const blankProfile: BabyProfile = {
      name: 'Bebeğim',
      birthDate: new Date().toISOString().split('T')[0],
      avatar: '👶',
      allergiesNote: '',
    };
    setProfile(blankProfile);
    setTrials([]);
    setMeals({});
    saveBabyProfile(blankProfile);
    saveFoodTrials([]);
    saveDailyMeals({});
  };

  const handleAddTrialFromGuide = (newTrial: FoodTrial) => {
    const exists = trials.some(
      (t) => t.foodName.toLowerCase().trim() === newTrial.foodName.toLowerCase().trim()
    );
    if (!exists) {
      handleUpdateTrials([newTrial, ...trials]);
    }
  };

  const colors = getThemeColors(theme);
  const age = calculateAge(profile.birthDate);
  const inProgressBadge = trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length;

  const TABS = [
    {
      id: 'tracker' as ActiveTab,
      shortLabel: '3 Gün Takibi',
      icon: CalendarCheck2,
      badge: inProgressBadge,
    },
    {
      id: 'guide' as ActiveTab,
      shortLabel: 'Gıda Rehberi',
      icon: BookOpen,
    },
    {
      id: 'planner' as ActiveTab,
      shortLabel: 'Menü Planı',
      icon: CalendarDays,
    },
    {
      id: 'safety' as ActiveTab,
      shortLabel: 'Güvenlik',
      icon: ShieldAlert,
    },
  ];

  const handleSwitchTab = (tabId: ActiveTab) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setActiveTab(tabId);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeRoot, { backgroundColor: colors.surface }]}
      >
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

        <View style={[styles.appBody, { backgroundColor: colors.background }]}>
          {/* Top Native Header */}
          <Header
            profile={profile}
            trials={trials}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />

          {!isLoaded ? (
            <View style={styles.loadingCenter}>
              <ActivityIndicator size="large" color="#D97706" />
            </View>
          ) : (
            <ScrollView
              style={styles.mainScroll}
              contentContainerStyle={styles.mainScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {activeTab === 'tracker' && (
                <ThreeDayTracker
                  trials={trials}
                  onSaveTrials={handleUpdateTrials}
                  onOpenSafetyGuide={() => setActiveTab('safety')}
                  theme={theme}
                />
              )}

              {activeTab === 'guide' && (
                <FoodGuide
                  trials={trials}
                  onAddTrialFromGuide={handleAddTrialFromGuide}
                  onNavigateToTracker={() => setActiveTab('tracker')}
                  babyCurrentMonths={age.months}
                  theme={theme}
                />
              )}

              {activeTab === 'planner' && (
                <MealPlanner
                  meals={meals}
                  onSaveMeals={handleUpdateMeals}
                  theme={theme}
                />
              )}

              {activeTab === 'safety' && <SafetyCards theme={theme} />}

              {/* Footer with Privacy & KVKK Commitment */}
              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.footerLinksRow}>
                  <TouchableOpacity
                    onPress={() => setIsPrivacyOpen(true)}
                    style={styles.privacyFooterLink}
                  >
                    <ShieldCheck size={14} color={colors.emeraldPrimary} />
                    <Text style={[styles.privacyFooterLinkText, { color: colors.text }]}>
                      Gizlilik & Veri Güvenliği (%100 Cihaz İçi)
                    </Text>
                  </TouchableOpacity>

                  <Text style={{ color: colors.textMuted }}>•</Text>

                  <TouchableOpacity onPress={() => setIsDoctorSummaryOpen(true)}>
                    <Text style={[styles.footerSubLink, { color: colors.textSecondary }]}>
                      Doktor Raporu
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.footerDisclaimer, { color: colors.textMuted }]}>
                  Minik Gurme — Bebeğinize ait tüm sağlık ve beslenme kayıtları yalnızca kendi
                  telefonunuzda saklanır, uzak sunuculara veya üçüncü taraflara aktarılmaz.
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Bottom Tab Navigation Bar */}
          <SafeAreaView
            edges={['bottom']}
            style={[
              styles.bottomNavWrapper,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View style={styles.bottomNavRow}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => handleSwitchTab(tab.id)}
                    activeOpacity={0.75}
                    style={[
                      styles.tabItem,
                      isActive && { backgroundColor: colors.amberBg },
                    ]}
                  >
                    <View style={styles.iconWithBadge}>
                      <Icon
                        size={20}
                        color={isActive ? colors.amberPrimary : colors.textMuted}
                      />
                      {typeof tab.badge === 'number' && tab.badge > 0 && (
                        <View style={styles.badgeBubble}>
                          <Text style={styles.badgeBubbleText}>{tab.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isActive ? colors.amberText : colors.textSecondary,
                          fontWeight: isActive ? '800' : '600',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {tab.shortLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </View>

        {/* Modals */}
        <DoctorSummaryModal
          isOpen={isDoctorSummaryOpen}
          onClose={() => setIsDoctorSummaryOpen(false)}
          profile={profile}
          trials={trials}
          theme={theme}
        />

        <BabyProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          trials={trials}
          meals={meals}
          onResetAllData={handleResetAllData}
          theme={theme}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          profile={profile}
          trials={trials}
          meals={meals}
          onClearAllData={handleClearAllData}
          theme={theme}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
  },
  appBody: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    padding: 14,
    paddingBottom: 28,
  },
  footer: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  privacyFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  privacyFooterLinkText: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footerSubLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerDisclaimer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  bottomNavWrapper: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 3,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badgeBubble: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#D97706',
    minWidth: 15,
    height: 15,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeBubbleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10.5,
  },
});
