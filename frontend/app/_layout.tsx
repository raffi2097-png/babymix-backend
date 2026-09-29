import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { initAdMob, requestUmpConsent, setNonPersonalizedAds } from "@/src/services/admob";

LogBox.ignoreAllLogs(true);

/**
 * Boot order (compliance): ATT (iOS) → UMP GDPR → AdMob init.
 *
 * ATT gates iOS IDFA access; UMP gates EU GDPR consent and tells us whether
 * to serve personalized or non-personalized ads. AdMob is initialised ONLY
 * after both steps so no ad request is fired without valid consent state.
 */
async function bootAdMob() {
  if (Platform.OS === "web") return;

  // 1) ATT — iOS App Tracking Transparency
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

  // 2) UMP — Google User Messaging Platform (GDPR)
  const ump = await requestUmpConsent();

  // 3) Decide personalization: needs BOTH ATT (iOS) and GDPR "selectPersonalisedAds"
  const personalized = attGranted && ump.personalized;
  setNonPersonalizedAds(!personalized);

  // 4) Init AdMob only if GDPR allows ad requests
  if (ump.canRequestAds) {
    await initAdMob();
  }
}

export default function RootLayout() {
  useEffect(() => {
    bootAdMob();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FFF9FA" } }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
