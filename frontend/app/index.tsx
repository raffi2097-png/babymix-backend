import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import ConsentGate from "@/src/components/consent-gate";
import { showPrivacyOptionsForm } from "@/src/services/admob";
import { usePremiumState } from "@/src/services/premium";
import { babyStore } from "@/src/store";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1651546904620-9a9bc628a1e4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB0YWtpbmclMjBzZWxmaWV8ZW58MHx8fHwxNzkwNjY3NTQyfDA&ixlib=rb-4.1.0&q=85";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const premium = usePremiumState();
  const [consentModal, setConsentModal] = useState<null | "unavailable" | "error">(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  const onStart = () => {
    babyStore.reset();
    router.push("/upload");
  };

  const onManageConsent = async () => {
    const res = await showPrivacyOptionsForm();
    if (!res.ok) {
      if (res.error === "native_sdk_unavailable") {
        setConsentModal("unavailable");
      } else {
        setConsentError(res.error ?? "Errore imprevisto");
        setConsentModal("error");
      }
    }
  };

  return (
    <View style={styles.root} testID="welcome-screen">
      <View style={styles.heroWrap}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.hero} contentFit="cover" />
        <LinearGradient
          colors={["rgba(255,249,250,0)", "rgba(255,249,250,0.6)", "#FFF9FA"]}
          style={styles.heroScrim}
        />
        <View style={[styles.badge, { top: insets.top + spacing.lg }]} testID="welcome-badge">
          <Ionicons name="heart" size={14} color={colors.brandSecondary} />
          <Text style={styles.badgeText}>BabyMix</Text>
        </View>
        {premium.isPremium ? (
          <View style={[styles.premiumBadge, { top: insets.top + spacing.lg }]} testID="premium-badge">
            <Ionicons name="star" size={12} color={colors.onBrandPrimary} />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 220 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} testID="welcome-title">
          Crea la vostra magia
        </Text>
        <Text style={styles.subtitle}>
          Carica due foto e scopri come potrebbe essere il vostro futuro bimbo,
          in modo realistico e tenerissimo.
        </Text>

        <View style={styles.featureRow}>
          <Feature icon="images" label="Due foto" />
          <Feature icon="sparkles" label="AI magica" />
          <Feature icon="happy" label="Realistico" />
        </View>

        {!premium.isPremium ? (
          <Pressable
            onPress={() => router.push("/paywall")}
            style={({ pressed }) => [styles.premiumCta, pressed && { transform: [{ scale: 0.98 }] }]}
            testID="premium-cta"
          >
            <LinearGradient
              colors={[colors.brandPrimary, colors.brandSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumIconWrap}>
                <Ionicons name="star" size={20} color={colors.onBrandPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>Passa a Premium</Text>
                <Text style={styles.premiumSub}>Rimuovi Pubblicità · HD · illimitato</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.onBrandPrimary} />
            </LinearGradient>
          </Pressable>
        ) : (
          <View style={styles.premiumActive} testID="premium-active-card">
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.premiumActiveText}>
              Sei Premium — generazioni illimitate senza pubblicità.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.97 }] }]}
          testID="start-button"
        >
          <Text style={styles.ctaText}>Inizia</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onBrandPrimary} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/privacy")}
          style={styles.footerLink}
          testID="privacy-link"
        >
          <Text style={styles.footerLinkText}>Privacy Policy · Termini</Text>
        </Pressable>
        <Pressable
          onPress={onManageConsent}
          style={({ pressed }) => [styles.footerLink, pressed && { opacity: 0.6 }]}
          hitSlop={12}
          testID="manage-consent-link"
        >
          <Text style={styles.footerLinkText}>Gestisci consenso pubblicitario</Text>
        </Pressable>
      </View>

      <ConsentGate />

      <Modal
        visible={consentModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConsentModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet} testID="consent-info-modal">
            <View style={styles.modalIcon}>
              <Ionicons
                name={consentModal === "unavailable" ? "information-circle" : "alert"}
                size={26}
                color={colors.onBrandPrimary}
              />
            </View>
            <Text style={styles.modalTitle}>
              {consentModal === "unavailable"
                ? "Disponibile nell'app installata"
                : "Impossibile aprire il consenso"}
            </Text>
            <Text style={styles.modalBody}>
              {consentModal === "unavailable"
                ? "Il popup GDPR di Google si apre sulla build iOS/Android reale. Nell'anteprima web e in Expo Go la SDK AdMob non è caricata, quindi il pulsante non fa nulla di visibile — funzionerà appena installi la build nativa."
                : (consentError ?? "")}
            </Text>
            <Pressable
              onPress={() => setConsentModal(null)}
              style={styles.modalCta}
              testID="consent-info-close"
            >
              <Text style={styles.modalCtaText}>Ho capito</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Feature({ icon, label }: { icon: string; label: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon as any} size={20} color={colors.onBrandTertiary} />
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  heroWrap: { height: 340, width: "100%" },
  hero: { width: "100%", height: "100%" },
  heroScrim: { position: "absolute", left: 0, right: 0, bottom: 0, top: 0 },
  badge: {
    position: "absolute",
    left: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  badgeText: { color: colors.onSurface, fontWeight: "700", fontSize: 13, letterSpacing: 0.5 },
  premiumBadge: {
    position: "absolute",
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  premiumBadgeText: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 11, letterSpacing: 0.5 },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.onSurface,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  featureRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  feature: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  featureLabel: { color: colors.onSurface, fontSize: 13, fontWeight: "600" },
  premiumCta: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    overflow: "hidden",
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  premiumIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTitle: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 16 },
  premiumSub: { color: colors.onBrandPrimary, opacity: 0.85, fontSize: 12, marginTop: 2 },
  premiumActive: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  premiumActiveText: { flex: 1, color: colors.onSurface, fontWeight: "700", fontSize: 14 },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "rgba(255,249,250,0.9)",
    zIndex: 10,
    elevation: 10,
  },
  cta: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaText: { color: colors.onBrandPrimary, fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
  footerLink: { alignItems: "center", paddingVertical: spacing.sm + 2 },
  footerLinkText: { color: colors.muted, fontSize: 12, textDecorationLine: "underline" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(61,28,42,0.55)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalSheet: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  modalIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  modalBody: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalCta: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },
  modalCtaText: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 14 },
}));
