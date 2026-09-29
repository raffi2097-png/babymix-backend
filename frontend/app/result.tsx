import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { babyStore } from "@/src/store";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();

  const s = babyStore.get();
  const dataUri = s.resultImageBase64
    ? `data:${s.resultMimeType};base64,${s.resultImageBase64}`
    : null;

  const onShare = async () => {
    if (!dataUri) return;
    try {
      await Share.share({
        message: "Guarda come potrebbe essere nostro figlio, generato con BabyMix! ✨",
        url: Platform.OS === "ios" ? dataUri : undefined,
      });
    } catch {}
  };

  const onRegenerate = () => {
    router.replace("/generating");
  };

  const onRestart = () => {
    babyStore.reset();
    router.replace("/");
  };

  return (
    <View style={styles.root} testID="result-screen">
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={onRestart} style={styles.backBtn} testID="home-button">
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Il vostro bimbo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          {dataUri ? (
            <Image
              source={{ uri: dataUri }}
              style={styles.heroImage}
              contentFit="cover"
              testID="result-image"
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="image" size={48} color={colors.muted} />
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(61,28,42,0.55)"]}
            style={styles.heroGradient}
          />
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={12} color={colors.onBrandPrimary} />
            <Text style={styles.heroBadgeText}>AI • BabyMix</Text>
          </View>
        </View>

        <Text style={styles.title}>Ecco la magia! ✨</Text>
        <Text style={styles.subtitle}>
          Un mix realistico dei tratti di mamma e papà, con un pizzico di sorpresa.
        </Text>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionSecondary} onPress={onRegenerate} testID="regenerate-button">
            <Ionicons name="refresh" size={18} color={colors.onBrandSecondary} />
            <Text style={styles.actionSecondaryText}>Riprova</Text>
          </Pressable>
          <Pressable style={styles.actionPrimary} onPress={onShare} testID="share-button">
            <Ionicons name="share-social" size={18} color={colors.onBrandPrimary} />
            <Text style={styles.actionPrimaryText}>Condividi</Text>
          </Pressable>
        </View>

        <Pressable style={styles.ghostBtn} onPress={onRestart} testID="new-button">
          <Text style={styles.ghostText}>Ricomincia da capo</Text>
        </Pressable>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={16} color={colors.muted} />
          <Text style={styles.disclaimerText}>
            L'immagine è una stima generata da AI, non una previsione reale.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: colors.onSurface },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  heroCard: {
    width: "100%",
    aspectRatio: 0.9,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroImage: { width: "100%", height: "100%" },
  heroPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceTertiary },
  heroGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 120 },
  heroBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  heroBadgeText: { color: colors.onBrandPrimary, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: {
    marginTop: spacing.xl,
    fontSize: 26,
    fontWeight: "800",
    color: colors.onSurface,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  actionsRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    gap: spacing.md,
  },
  actionSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSecondary,
  },
  actionSecondaryText: { color: colors.onBrandSecondary, fontWeight: "800", fontSize: 15 },
  actionPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  actionPrimaryText: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 15 },
  ghostBtn: {
    marginTop: spacing.md,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  ghostText: { color: colors.onSurface, fontWeight: "700", fontSize: 14 },
  disclaimer: {
    marginTop: spacing.xl,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  disclaimerText: { flex: 1, color: colors.onSurfaceTertiary, fontSize: 12, lineHeight: 18 },
}));
