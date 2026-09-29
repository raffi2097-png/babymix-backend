// Placeholder module for Google AdMob Rewarded Video integration.
// Ready to be swapped with `react-native-google-mobile-ads` in the future.
//
// Future integration steps (do NOT implement yet, only wired UI):
//   1. yarn expo install react-native-google-mobile-ads
//   2. app.json plugin config with Android + iOS app IDs from AdMob console
//   3. Replace `showRewardedAd()` body with:
//        import mobileAds, { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";
//        const adUnitId = __DEV__ ? TestIds.REWARDED : "ca-app-pub-XXXX/YYYY";
//        const rewarded = RewardedAd.createForAdRequest(adUnitId);
//        Await load event, call rewarded.show(), resolve on EARNED_REWARD.
//
// For now this simulates a 30-second Rewarded Video via the /rewarded-ad screen.

export const ADMOB_CONFIG = {
  androidAppId: "ca-app-pub-0000000000000000~0000000000",
  iosAppId: "ca-app-pub-0000000000000000~0000000000",
  rewardedAdUnitId: "ca-app-pub-0000000000000000/0000000000",
  simulatedDurationSec: 30,
};

export async function initAdMob(): Promise<void> {
  // no-op placeholder; real init: await mobileAds().initialize();
  return;
}

// Placeholder that resolves with `earnedReward=true` once the simulated video
// has been fully watched. In production replace with the real SDK.
export type RewardedAdResult = { earnedReward: boolean };

export async function showRewardedAd(): Promise<RewardedAdResult> {
  // The actual "watch" is handled by the /rewarded-ad screen. This function
  // stays for API parity with the future SDK swap.
  return { earnedReward: true };
}
