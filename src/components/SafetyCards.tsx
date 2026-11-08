import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { SAFETY_CARDS } from '../data/safetyTips';
import { ThemeMode } from '../types';
import { getThemeColors } from '../theme/colors';
import {
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

interface SafetyCardsProps {
  theme: ThemeMode;
}

export const SafetyCards: React.FC<SafetyCardsProps> = ({ theme }) => {
  const colors = getThemeColors(theme);
  const [expandedCardId, setExpandedCardId] = useState<string | null>('prohibited-foods');

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleCall112 = () => {
    Linking.openURL('tel:112').catch(() => {});
  };

  return (
    <View style={styles.container}>
      {/* Top Hero Banner */}
      <View
        style={[
          styles.heroBanner,
          {
            backgroundColor: colors.roseBg,
            borderColor: colors.roseBorder,
          },
        ]}
      >
        <View style={styles.heroTitleRow}>
          <Text style={styles.shieldEmoji}>🛡️</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Kritik Uyarılar & Bebek Güvenlik Rehberi
          </Text>
        </View>

        <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>
          Bebeğinizin sağlığı ve güvenliği için her ebeveynin mutlaka bilmesi gereken hayati
          kurallar. 1 yaş altı yasakları, boğulma önleme, oturma kriterleri ve acil alerji
          müdahale protokolü aşağıdadır.
        </Text>

        {/* Emergency 112 Call Button */}
        <TouchableOpacity
          onPress={handleCall112}
          activeOpacity={0.8}
          style={[
            styles.emergencyCallCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.roseBorder,
            },
          ]}
        >
          <View style={styles.phoneIconCircle}>
            <PhoneCall size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.emergencyLabel, { color: colors.rosePrimary }]}>
              ACİL DURUM (SOLUNUM / ŞİŞLİK)
            </Text>
            <Text style={[styles.emergencyPhoneText, { color: colors.text }]}>
              112 Acil Çağrı Merkezini Ara
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Accordion Safety Cards */}
      <View style={styles.cardsColumn}>
        {SAFETY_CARDS.map((card) => {
          const isExpanded = expandedCardId === card.id;

          return (
            <View
              key={card.id}
              style={[
                styles.cardContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: isExpanded ? colors.amberPrimary : colors.border,
                  borderWidth: isExpanded ? 1.5 : 1,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleExpand(card.id)}
                activeOpacity={0.75}
                style={styles.cardHeader}
              >
                <View style={styles.cardHeaderLeft}>
                  <View
                    style={[
                      styles.cardIconWrap,
                      { backgroundColor: colors.surfaceAlt },
                    ]}
                  >
                    <Text style={styles.cardEmoji}>{card.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTitleWrap}>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>
                        {card.title}
                      </Text>
                      <View
                        style={[
                          styles.badgePill,
                          {
                            backgroundColor: card.badgeBg,
                            borderColor: card.badgeBorder,
                          },
                        ]}
                      >
                        <Text style={[styles.badgePillText, { color: card.badgeText }]}>
                          {card.badge}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[styles.cardSummary, { color: colors.textSecondary }]}
                      numberOfLines={isExpanded ? undefined : 2}
                    >
                      {card.shortSummary}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.chevronBox,
                    { backgroundColor: colors.surfaceAlt },
                  ]}
                >
                  {isExpanded ? (
                    <ChevronUp size={16} color={colors.textSecondary} />
                  ) : (
                    <ChevronDown size={16} color={colors.textSecondary} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Expanded Details */}
              {isExpanded && (
                <View style={[styles.expandedContent, { borderTopColor: colors.borderSubtle }]}>
                  {card.emergencyNote && (
                    <View
                      style={[
                        styles.emergencyNoteBox,
                        {
                          backgroundColor: colors.roseBg,
                          borderColor: colors.roseBorder,
                        },
                      ]}
                    >
                      <AlertTriangle size={16} color={colors.rosePrimary} style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.emergencyNoteTitle, { color: colors.roseText }]}>
                          Önemli Güvenlik Notu:
                        </Text>
                        <Text style={[styles.emergencyNoteBody, { color: colors.roseText }]}>
                          {card.emergencyNote}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Key Points */}
                  <View style={styles.keyPointsBlock}>
                    <Text style={[styles.sectionSmallTitle, { color: colors.textMuted }]}>
                      TEMEL KURALLAR & TIBBİ NEDENLERİ:
                    </Text>
                    {card.keyPoints.map((point, idx) => {
                      const parts = point.split(':');
                      const hasColon = parts.length > 1;
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.pointItem,
                            {
                              backgroundColor: colors.surfaceAlt,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.bulletDot} />
                          <Text style={[styles.pointText, { color: colors.textSecondary }]}>
                            {hasColon ? (
                              <>
                                <Text style={[styles.pointBold, { color: colors.text }]}>
                                  {parts[0]}:
                                </Text>
                                {parts.slice(1).join(':')}
                              </>
                            ) : (
                              point
                            )}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Do's and Don'ts */}
                  <View style={styles.doDontColumn}>
                    <View
                      style={[
                        styles.doBox,
                        {
                          backgroundColor: colors.emeraldBg,
                          borderColor: colors.emeraldBorder,
                        },
                      ]}
                    >
                      <View style={styles.doHeader}>
                        <CheckCircle2 size={15} color={colors.emeraldPrimary} />
                        <Text style={[styles.doHeaderText, { color: colors.emeraldText }]}>
                          YAPILMASI GEREKENLER
                        </Text>
                      </View>
                      {card.doAndDonts.dos.map((item, i) => (
                        <View key={i} style={styles.listRow}>
                          <Text style={[styles.checkSymbol, { color: colors.emeraldPrimary }]}>
                            ✓
                          </Text>
                          <Text style={[styles.listRowText, { color: colors.text }]}>{item}</Text>
                        </View>
                      ))}
                    </View>

                    <View
                      style={[
                        styles.dontBox,
                        {
                          backgroundColor: colors.roseBg,
                          borderColor: colors.roseBorder,
                        },
                      ]}
                    >
                      <View style={styles.doHeader}>
                        <XCircle size={15} color={colors.rosePrimary} />
                        <Text style={[styles.doHeaderText, { color: colors.roseText }]}>
                          UZAK DURULMASI GEREKENLER
                        </Text>
                      </View>
                      {card.doAndDonts.donts.map((item, i) => (
                        <View key={i} style={styles.listRow}>
                          <Text style={[styles.checkSymbol, { color: colors.rosePrimary }]}>
                            ✕
                          </Text>
                          <Text style={[styles.listRowText, { color: colors.text }]}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Golden Summary Cheat Sheet */}
      <View
        style={[
          styles.summaryCheatCard,
          {
            backgroundColor: colors.amberBg,
            borderColor: colors.amberBorder,
          },
        ]}
      >
        <Text style={[styles.summaryCheatTitle, { color: colors.text }]}>
          💡 Bebek Beslenmesinde Altın Özet
        </Text>

        <View
          style={[
            styles.cheatItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cheatItemTitle, { color: colors.text }]}>
            🍯 1 Yaş Öncesi Sıfır Bal
          </Text>
          <Text style={[styles.cheatItemDesc, { color: colors.textSecondary }]}>
            Botulizm zehirlenmesine karşı 1 yaşına kadar tek bir damla dahi verilmez.
          </Text>
        </View>

        <View
          style={[
            styles.cheatItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cheatItemTitle, { color: colors.text }]}>
            🍇 Üzüm ve Çeri 4'e Bölünür
          </Text>
          <Text style={[styles.cheatItemDesc, { color: colors.textSecondary }]}>
            Boğulmayı önlemek için nefes borusunu tıkayabilecek yuvarlak gıdalar boyuna kesilir.
          </Text>
        </View>

        <View
          style={[
            styles.cheatItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cheatItemTitle, { color: colors.text }]}>
            🍼 Anne Sütü/Mama Ana Gıdadır
          </Text>
          <Text style={[styles.cheatItemDesc, { color: colors.textSecondary }]}>
            1 yaşına kadar ek gıda tadım ve damak zevki içindir; doymak için değil.
          </Text>
        </View>
      </View>
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
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shieldEmoji: {
    fontSize: 22,
  },
  heroTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    flex: 1,
  },
  heroDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  emergencyCallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 2,
  },
  phoneIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  emergencyPhoneText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  cardsColumn: {
    gap: 10,
  },
  cardContainer: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardSummary: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  chevronBox: {
    padding: 6,
    borderRadius: 10,
  },
  expandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  emergencyNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 13,
    borderWidth: 1,
  },
  emergencyNoteTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  emergencyNoteBody: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  keyPointsBlock: {
    gap: 7,
  },
  sectionSmallTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#D97706',
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  pointBold: {
    fontWeight: '800',
  },
  doDontColumn: {
    gap: 10,
  },
  doBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  dontBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  doHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  doHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  checkSymbol: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  listRowText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  summaryCheatCard: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    gap: 9,
  },
  summaryCheatTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  cheatItem: {
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
  },
  cheatItemTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  cheatItemDesc: {
    fontSize: 12,
    lineHeight: 16.5,
  },
});
