import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { initAdMob, requestUmpConsent, setNonPersonalizedAds } from "@/src/services/admob";

LogBox.ignoreAllLogs(true);

type BootStage = "att" | "consent" | "init" | "done";

/**
 * Boot order (compliance): ATT (iOS) → UMP GDPR → AdMob init.
 * The rest of the app is NOT rendered until this pipeline finishes so the
 * user cannot interact before responding to the GDPR consent form.
 */
async function runBoot(onStage: (s: BootStage) => void) {
  if (Platform.OS === "web") {
    onStage("done");
    return;
  }

  // 1) ATT — iOS App Tracking Transparency
  onStage("att");
  let attGranted = false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Tracking = require("expo-tracking-transparency");
    const current = await Tracking.getTrackingPermissionsAsync();
    let status = current.status;
    if (status === "undetermined" && Platform.OS === "ios") {
      const req = await Tracking.requestTrackingPermissionsAsync();
      status = req.status;
    }
    attGranted = status === "granted";
  } catch {
    attGranted = false;
  }

  // 2) UMP — Google User Messaging Platform (GDPR consent form)
  onStage("consent");
  const ump = await requestUmpConsent();

  // 3) Personalization requires BOTH ATT (iOS) and GDPR "selectPersonalisedAds"
  const personalized = attGranted && ump.personalized;
  setNonPersonalizedAds(!personalized);

  // 4) Init AdMob only if the GDPR flow allows ad requests
  onStage("init");
  if (ump.canRequestAds) {
    await initAdMob();
  }

  onStage("done");
}

function BootSplash({ stage }: { stage: BootStage }) {
  const label =
    stage === "att"
      ? "Preparazione tracciamento…"
      : stage === "consent"
        ? "Caricamento consenso pubblicitario…"
        : "Ottimizzazione annunci…";

  return (
    <View style={splashStyles.root} testID="boot-splash">
      <LinearGradient
        colors={["#FFF9FA", "#F3E8FF", "#FFF9FA"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={splashStyles.iconWrap}>
        <Ionicons name="heart" size={44} color="#FFFFFF" />
      </View>
      <Text style={splashStyles.title}>BabyMix</Text>
      <View style={splashStyles.loaderRow}>
        <ActivityIndicator color="#D198E5" />
        <Text style={splashStyles.subtitle}>{label}</Text>
      </View>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#D198E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D198E5",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    marginBottom: 24,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#3D1C2A", letterSpacing: -0.5, marginBottom: 40 },
  loaderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  subtitle: { color: "#8D7A84", fontSize: 14, fontWeight: "600" },
});

export default function RootLayout() {
  const [stage, setStage] = useState<BootStage>(Platform.OS === "web" ? "done" : "att");

  useEffect(() => {
    runBoot(setStage);
  }, []);

  const booted = stage === "done";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {booted ? (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FFF9FA" } }} />
        ) : (
          <BootSplash stage={stage} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
