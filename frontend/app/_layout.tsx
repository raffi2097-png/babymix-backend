import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { initAdMob } from "@/src/services/admob";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  useEffect(() => {
    // Best-effort AdMob init at app startup. No-op in Expo Go / web.
    initAdMob();
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
