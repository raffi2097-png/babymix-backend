import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { initAdMob, setNonPersonalizedAds } from "@/src/services/admob";

LogBox.ignoreAllLogs(true);

/**
 * Ask ATT (App Tracking Transparency) BEFORE initializing AdMob so that if the
 * user denies tracking, the SDK is configured to serve non-personalized ads.
 * Apple + Google policy compliance.
 */
async function bootAdMob() {
  if (Platform.OS === "web") return;

  let allowTracking = false;
  try {
    // Lazy require so this file bundles fine when the module is missing.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Tracking = require("expo-tracking-transparency");
    const current = await Tracking.getTrackingPermissionsAsync();
    let status = current.status;
    if (status === "undetermined" && Platform.OS === "ios") {
      const req = await Tracking.requestTrackingPermissionsAsync();
      status = req.status;
    }
    allowTracking = status === "granted";
  } catch {
    // module unavailable → treat as denied to stay compliant
    allowTracking = false;
  }

  setNonPersonalizedAds(!allowTracking);
  await initAdMob();
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
