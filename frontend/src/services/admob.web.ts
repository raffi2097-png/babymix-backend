// Web/Expo Go stub for the AdMob service.
// Metro picks this file automatically on `platform=web` thanks to the `.web.ts`
// extension, so `react-native-google-mobile-ads` (native-only) is never
// imported in a web bundle.

export const ADMOB_CONFIG = {
  iosAppId: "ca-app-pub-9867075377824700~3097681401",
  androidAppId: "ca-app-pub-3940256099942544~3347511713",
  iosRewardedAdUnitId: "ca-app-pub-3940256099942544/1712485313",
  androidRewardedAdUnitId: "ca-app-pub-9867075377824700/7900164526",
  simulatedDurationSec: 30,
};

export type RewardedAdResult = { earnedReward: boolean; error?: string };

export function setNonPersonalizedAds(_v: boolean): void {
  return;
}

export type UmpResult = {
  canRequestAds: boolean;
  personalized: boolean;
  privacyOptionsRequired: boolean;
  error?: string;
};

export async function requestUmpConsent(): Promise<UmpResult> {
  return {
    canRequestAds: true,
    personalized: false,
    privacyOptionsRequired: false,
    error: "native_sdk_unavailable",
  };
}

export async function showPrivacyOptionsForm(): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: "native_sdk_unavailable" };
}

export function isAdMobAvailable(): boolean {
  return false;
}

export async function initAdMob(): Promise<void> {
  return;
}

export async function showRewardedAd(): Promise<RewardedAdResult> {
  return { earnedReward: false, error: "native_sdk_unavailable" };
}
