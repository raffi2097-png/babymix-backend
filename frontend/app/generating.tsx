import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { babyStore } from "@/src/store";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function GeneratingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const abortedRef = useRef(false);

  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse, spin]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.08 }],
    opacity: 0.85 + pulse.value * 0.15,
  }));

  useEffect(() => {
    const run = async () => {
      const s = babyStore.get();
      if (!s.fatherImageBase64 || !s.motherImageBase64) {
        setError("Foto mancanti. Torna indietro.");
        return;
      }
      try {
        const resp = await fetch(`${BACKEND_URL}/api/generate-baby`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            father_image_base64: s.fatherImageBase64,
            mother_image_base64: s.motherImageBase64,
            gender: s.gender,
          }),
        });
        if (abortedRef.current) return;
        if (!resp.ok) {
          const detail = await resp.text().catch(() => "");
          setError(`Generazione fallita. ${resp.status}. ${detail.slice(0, 120)}`);
          return;
        }
        const data = await resp.json();
        if (!data?.image_base64) {
          setError("Nessuna immagine ricevuta");
          return;
        }
        babyStore.setResult(data.image_base64, data.mime_type ?? "image/png");
        if (!abortedRef.current) router.replace("/result");
      } catch (e: any) {
        if (!abortedRef.current) setError(e?.message ?? "Errore di rete");
      }
    };
    run();
    return () => {
      abortedRef.current = true;
    };
  }, [router]);

  return (
    <View style={styles.root} testID="generating-screen">
      <View style={styles.centerWrap}>
        {!error ? (
          <>
            <View style={styles.orbitWrap}>
              <Animated.View style={[styles.orbitOuter, spinStyle]}>
                <View style={[styles.orbitDot, { top: 0, left: "50%", marginLeft: -8, backgroundColor: colors.brandSecondary }]} />
                <View style={[styles.orbitDot, { bottom: 0, left: "50%", marginLeft: -8, backgroundColor: colors.brandPrimary }]} />
                <View style={[styles.orbitDot, { left: 0, top: "50%", marginTop: -8, backgroundColor: colors.brand }]} />
                <View style={[styles.orbitDot, { right: 0, top: "50%", marginTop: -8, backgroundColor: colors.brandSecondary }]} />
              </Animated.View>
              <Animated.View style={[styles.core, pulseStyle]}>
                <Ionicons name="heart" size={44} color={colors.onBrandPrimary} />
              </Animated.View>
            </View>
            <Text style={styles.title} testID="generating-title">
              La cicogna è in viaggio…
            </Text>
            <Text style={styles.subtitle}>
              Stiamo mescolando con cura i tratti di mamma e papà.
              Ci vorrà solo qualche istante ✨
            </Text>
          </>
        ) : (
          <>
            <View style={styles.errIcon}>
              <Ionicons name="alert" size={36} color={colors.onError} />
            </View>
            <Text style={styles.title} testID="generating-error">
              Qualcosa è andato storto
            </Text>
            <Text style={styles.subtitle}>{error}</Text>
            <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.lg }]}>
              <Pressable
                onPress={() => router.replace("/upload")}
                style={styles.retryBtn}
                testID="retry-button"
              >
                <Text style={styles.retryText}>Riprova</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surfaceTertiary },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  orbitWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  orbitOuter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderStyle: "dashed",
  },
  orbitDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: radius.pill,
  },
  core: {
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  errIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  actions: {
    marginTop: spacing.xl,
    alignSelf: "stretch",
    paddingHorizontal: spacing.xl,
  },
  retryBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  retryText: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 16 },
}));
