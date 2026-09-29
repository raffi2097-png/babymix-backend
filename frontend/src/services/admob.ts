// Google AdMob Rewarded Video integration.
//
// The Expo preview and Expo Go DO NOT include the native `react-native-google-mobile-ads`
// module. To keep the app runnable in these environments we lazy-import the SDK
// inside a try/catch and fall back to a purely UI simulation when it's missing.
//
// Full ads run only after: Publish → Deploy → Generate iOS/Android build.

import { Platform } from "react-native";

export const ADMOB_CONFIG = {
  // iOS App ID provided by the user (goes into Info.plist GADApplicationIdentifier via the config plugin).
  iosAppId: "ca-app-pub-9867075377824700~3097681401",

  // ⚠️ Android App ID not yet provided by the user — using Google's official
  // Android test App ID. Replace once the real one is created in AdMob.
  androidAppId: "ca-app-pub-3940256099942544~3347511713",

  // ⚠️ iOS Rewarded Ad Unit ID not yet provided by the user (they supplied the
  // App ID again). Falls back to Google's official iOS Rewarded test unit.
  iosRewardedAdUnitId: "ca-app-pub-3940256099942544/1712485313",

  // Android Rewarded Ad Unit ID provided by the user.
  androidRewardedAdUnitId: "ca-app-pub-9867075377824700/7900164526",

  simulatedDurationSec: 30, // used only when the native SDK is unavailable (Expo Go / web)
};

export type RewardedAdResult = { earnedReward: boolean; error?: string };

let nonPersonalized = false;

/**
 * Called by the ATT flow. When the user denies tracking, AdMob requests must
 * be flagged `requestNonPersonalizedAdsOnly=true` (Apple + Google policy).
 */
export function setNonPersonalizedAds(v: boolean) {
  nonPersonalized = v;
}

// Best-effort dynamic import so the module is not required at bundle time in
// environments where it isn't installed natively.
function loadSdk():
  | null
  | {
      RewardedAd: any;
      RewardedAdEventType: any;
      AdEventType: any;
      TestIds: any;
      mobileAds: any;
    } {
  if (Platform.OS === "web") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-google-mobile-ads");
    return {
      RewardedAd: mod.RewardedAd,
      RewardedAdEventType: mod.RewardedAdEventType,
      AdEventType: mod.AdEventType,
      TestIds: mod.TestIds,
      mobileAds: mod.default ?? mod.mobileAds,
    };
  } catch {
    return null; // native module absent (Expo Go)
  }
}

const sdk = loadSdk();

export function isAdMobAvailable(): boolean {
  return sdk !== null;
}

export async function initAdMob(): Promise<void> {
  if (!sdk) return;
  try {
    await sdk.mobileAds().initialize();
  } catch {
    // swallow — initialization can be retried when we actually show an ad
  }
}

function getAdUnitId(): string | null {
  if (!sdk) return null;
  if (__DEV__) return sdk.TestIds.REWARDED;
  return Platform.OS === "ios"
    ? ADMOB_CONFIG.iosRewardedAdUnitId
    : ADMOB_CONFIG.androidRewardedAdUnitId;
}

/**
 * Loads and shows a Google AdMob Rewarded Ad, resolving true only when the
 * user earns the reward. Resolves with `earnedReward:false` (and an error) if
 * the native module is unavailable — the caller should then fall back to the
 * simulated timer UI.
 */
export async function showRewardedAd(): Promise<RewardedAdResult> {
  if (!sdk) {
    return { earnedReward: false, error: "native_sdk_unavailable" };
  }

  const adUnitId = getAdUnitId();
  if (!adUnitId) {
    return { earnedReward: false, error: "no_ad_unit_id" };
  }

  return new Promise<RewardedAdResult>((resolve) => {
    let settled = false;
    let earned = false;
    const rewarded = sdk.RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: nonPersonalized,
    });

    const cleanup = () => {
      try {
        unsubLoaded?.();
        unsubEarned?.();
        unsubClosed?.();
        unsubError?.();
      } catch {}
    };

    const finish = (result: RewardedAdResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const unsubLoaded = rewarded.addAdEventListener(sdk.RewardedAdEventType.LOADED, () => {
      try {
        rewarded.show();
      } catch (e: any) {
        finish({ earnedReward: false, error: e?.message ?? "show_failed" });
      }
    });

    const unsubEarned = rewarded.addAdEventListener(sdk.RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });

    const unsubClosed = rewarded.addAdEventListener(sdk.AdEventType.CLOSED, () => {
      finish({ earnedReward: earned, error: earned ? undefined : "closed_before_reward" });
    });

    const unsubError = rewarded.addAdEventListener(sdk.AdEventType.ERROR, (err: any) => {
      finish({ earnedReward: false, error: err?.message ?? "ad_error" });
    });

    try {
      rewarded.load();
    } catch (e: any) {
      finish({ earnedReward: false, error: e?.message ?? "load_failed" });
    }
  });
}
