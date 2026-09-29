import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { babyStore } from "@/src/store";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1651546904620-9a9bc628a1e4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB0YWtpbmclMjBzZWxmaWV8ZW58MHx8fHwxNzkwNjY3NTQyfDA&ixlib=rb-4.1.0&q=85";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();

  const onStart = () => {
    babyStore.reset();
    router.push("/upload");
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
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: spacing["3xl"] + 80 }]}
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
      </ScrollView>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.97 }] }]}
          testID="start-button"
        >
          <Text style={styles.ctaText}>Inizia</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onBrandPrimary} />
        </Pressable>
      </View>
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
  heroWrap: { height: 380, width: "100%" },
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
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.onSurface,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
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
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "rgba(255,249,250,0.85)",
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
}));
