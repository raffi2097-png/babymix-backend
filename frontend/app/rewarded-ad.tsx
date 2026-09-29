import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
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

import { ADMOB_CONFIG } from "@/src/services/admob";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const AD_DURATION = ADMOB_CONFIG.simulatedDurationSec;

export default function RewardedAdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const [remaining, setRemaining] = useState(AD_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulse = useSharedValue(0);
  const shine = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
    shine.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.linear }), -1, false);
  }, [pulse, shine]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => router.replace("/generating"), 250);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  const progress = 1 - remaining / AD_DURATION;

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.06 }],
    opacity: 0.9 + pulse.value * 0.1,
  }));

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -200 + shine.value * 500 }],
  }));

  const onUpgrade = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.replace("/paywall");
  };

  return (
    <View style={styles.root} testID="rewarded-ad-screen">
      <LinearGradient
        colors={["#33163E", "#5C2B80", "#33163E"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.adTag} testID="ad-tag">
          <Text style={styles.adTagText}>ANNUNCIO</Text>
        </View>
        <View style={styles.counter} testID="ad-counter">
          <Ionicons name="time" size={14} color="#FFF" />
          <Text style={styles.counterText}>{remaining}s</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.videoFrame, pulseStyle]}>
          <LinearGradient
            colors={["#FFB7C5", "#D198E5", "#F3E8FF"]}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.shine, shineStyle]}>
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.6)", "transparent"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <View style={styles.videoContent}>
            <View style={styles.playIcon}>
              <Ionicons name="videocam" size={44} color="#5C2B80" />
            </View>
            <Text style={styles.videoTitle}>Video pubblicitario</Text>
            <Text style={styles.videoSub}>
              Guarda per sbloccare la generazione gratuita
            </Text>
          </View>
        </Animated.View>

        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {remaining > 0 ? `Ancora ${remaining} secondi…` : "Ricompensa sbloccata! ✨"}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable onPress={onUpgrade} style={styles.upgradeBtn} testID="rewarded-upgrade">
          <Ionicons name="star" size={16} color="#33163E" />
          <Text style={styles.upgradeText}>Salta per sempre con Premium</Text>
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  adTag: {
    backgroundColor: "#FFB7C5",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  adTagText: { color: "#4A1525", fontWeight: "800", fontSize: 11, letterSpacing: 1 },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  counterText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  videoFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  shine: { position: "absolute", top: 0, bottom: 0, width: 200 },
  videoContent: { alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.xl },
  playIcon: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoTitle: { color: "#33163E", fontSize: 18, fontWeight: "800", textAlign: "center" },
  videoSub: { color: "#4A1525", fontSize: 13, fontWeight: "600", textAlign: "center" },
  progressWrap: { marginTop: spacing.xl, alignSelf: "stretch", gap: spacing.sm },
  progressBg: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFB7C5",
    borderRadius: radius.pill,
  },
  progressLabel: { color: "#FFF", fontSize: 13, fontWeight: "700", textAlign: "center" },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "#FFF",
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  upgradeText: { color: "#33163E", fontWeight: "800", fontSize: 14 },
}));
