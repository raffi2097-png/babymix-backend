import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PLANS, purchase, restorePurchases, type PlanId } from "@/src/services/payments";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const BENEFITS = [
  { icon: "close-circle", label: "Zero pubblicità (nessun video d'attesa)" },
  { icon: "flash", label: "Generazioni ultra-veloci e illimitate" },
  { icon: "sparkles", label: "Immagini del figlio in Alta Definizione (HD)" },
  { icon: "star", label: "Accesso prioritario alle nuove funzioni" },
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const [selected, setSelected] = useState<PlanId>("weekly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await purchase(selected);
      if (res.success) {
        router.replace("/");
      } else {
        setError(res.error ?? "Acquisto non riuscito");
      }
    } catch (e: any) {
      setError(e?.message ?? "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async () => {
    setLoading(true);
    try {
      const res = await restorePurchases();
      if (res.success) router.replace("/");
      else setError("Nessun acquisto trovato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root} testID="paywall-screen">
      <LinearGradient
        colors={[colors.surfaceTertiary, colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} testID="paywall-close">
          <Ionicons name="close" size={22} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.crown}>
          <Ionicons name="star" size={32} color={colors.onBrandPrimary} />
        </View>
        <Text style={styles.title}>BabyMix Premium</Text>
        <Text style={styles.subtitle}>
          Sblocca la magia senza limiti né pubblicità.
        </Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.label} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon as any} size={18} color={colors.onBrandPrimary} />
              </View>
              <Text style={styles.benefitText}>{b.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Scegli il tuo piano</Text>
        <View style={styles.plans}>
          {PLANS.map((p) => {
            const active = selected === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelected(p.id)}
                style={[styles.plan, active && styles.planActive]}
                testID={`plan-${p.id}`}
              >
                <View style={styles.planLeft}>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planTitle}>{p.title}</Text>
                    {p.trial ? <Text style={styles.planTrial}>{p.trial}</Text> : null}
                  </View>
                </View>
                <View style={styles.planRight}>
                  <Text style={styles.planPrice}>{p.price}</Text>
                  <Text style={styles.planCadence}>{p.cadence}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <Text style={styles.errorText} testID="paywall-error">{error}</Text>
        ) : null}

        <Text style={styles.legal}>
          L'abbonamento si rinnova automaticamente. Puoi disdire in ogni momento
          dalle impostazioni del tuo account store.
        </Text>
      </ScrollView>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={onPurchase}
          disabled={loading}
          style={({ pressed }) => [
            styles.cta,
            pressed && !loading && { transform: [{ scale: 0.97 }] },
            loading && styles.ctaLoading,
          ]}
          testID="paywall-purchase"
        >
          {loading ? (
            <ActivityIndicator color={colors.onBrandPrimary} />
          ) : (
            <>
              <Ionicons name="lock-open" size={20} color={colors.onBrandPrimary} />
              <Text style={styles.ctaText}>
                {selected === "weekly" ? "Inizia prova gratuita" : "Passa a Premium"}
              </Text>
            </>
          )}
        </Pressable>
        <Pressable onPress={onRestore} style={styles.restoreBtn} testID="paywall-restore">
          <Text style={styles.restoreText}>Ripristina acquisti</Text>
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, alignItems: "stretch" },
  crown: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  benefits: {
    marginTop: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  benefit: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: { flex: 1, color: colors.onSurface, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: 16,
    fontWeight: "800",
    color: colors.onSurface,
  },
  plans: { gap: spacing.md },
  plan: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  planActive: { borderColor: colors.brandPrimary, backgroundColor: colors.brandTertiary },
  planLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: colors.brandPrimary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
  },
  planTitle: { color: colors.onSurface, fontSize: 15, fontWeight: "800" },
  planTrial: { color: colors.brandPrimary, fontSize: 12, fontWeight: "700", marginTop: 2 },
  planRight: { alignItems: "flex-end" },
  planPrice: { color: colors.onSurface, fontSize: 18, fontWeight: "800" },
  planCadence: { color: colors.muted, fontSize: 11, marginTop: 2 },
  errorText: {
    marginTop: spacing.md,
    color: colors.error,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 13,
  },
  legal: {
    marginTop: spacing.xl,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "rgba(255,249,250,0.95)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
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
  ctaLoading: { opacity: 0.85 },
  ctaText: { color: colors.onBrandPrimary, fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
  restoreBtn: { alignItems: "center", paddingVertical: spacing.md },
  restoreText: { color: colors.muted, fontSize: 12, textDecorationLine: "underline" },
}));
