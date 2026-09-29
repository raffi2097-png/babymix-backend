// Placeholder for Stripe / In-App Purchase billing.
// Ready to be swapped with real Stripe checkout or expo-in-app-purchases.
//
// Future integration options:
//   A. Stripe (web checkout via WebView):
//      - Backend: POST /api/create-checkout-session (Stripe test key already in env)
//      - Frontend: open Stripe URL in `expo-web-browser`, poll session on return.
//   B. Native IAP (App Store / Play Store):
//      - yarn expo install react-native-iap (or expo-in-app-purchases)
//      - Configure products in App Store Connect / Google Play Console:
//          plan_weekly  → 2.99 €/week, 3-day free trial
//          plan_monthly → 7.99 €/month
//      - Call requestSubscription(productId), verify receipt on backend.
//
// For now `purchase()` simulates a successful transaction after a short delay
// and flips the local premium flag.

import { premiumStore } from "@/src/services/premium";

export type PlanId = "weekly" | "monthly";

export type Plan = {
  id: PlanId;
  title: string;
  price: string;
  cadence: string;
  trial?: string;
  productId: string; // to be filled from store console
  stripePriceId: string; // to be filled from Stripe dashboard
};

export const PLANS: Plan[] = [
  {
    id: "weekly",
    title: "Settimanale",
    price: "2,99 €",
    cadence: "a settimana",
    trial: "3 giorni di prova gratuita",
    productId: "com.emergent.babygenerator.premium.weekly",
    stripePriceId: "price_weekly_placeholder",
  },
  {
    id: "monthly",
    title: "Mensile",
    price: "7,99 €",
    cadence: "al mese",
    productId: "com.emergent.babygenerator.premium.monthly",
    stripePriceId: "price_monthly_placeholder",
  },
];

export type PurchaseResult = { success: boolean; planId?: PlanId; error?: string };

// Simulated purchase — replace with Stripe / IAP call.
export async function purchase(planId: PlanId): Promise<PurchaseResult> {
  await new Promise((r) => setTimeout(r, 1200));
  await premiumStore.setPremium(true, planId);
  return { success: true, planId };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  // Real IAP: iterate through owned subscriptions; Stripe: query customer.
  const state = await premiumStore.load();
  return { success: state.isPremium };
}
