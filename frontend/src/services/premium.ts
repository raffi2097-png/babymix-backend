import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const K_CONSENT = "babymix.consent.v1";
const K_PREMIUM = "babymix.premium.v1";
const K_PLAN = "babymix.plan.v1";

type State = {
  hasConsent: boolean;
  isPremium: boolean;
  planId: string | null;
  loaded: boolean;
};

type Listener = (s: State) => void;

const state: State = { hasConsent: false, isPremium: false, planId: null, loaded: false };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l({ ...state }));
}

async function ensureLoaded() {
  if (state.loaded) return;
  const [c, p, pl] = await Promise.all([
    AsyncStorage.getItem(K_CONSENT),
    AsyncStorage.getItem(K_PREMIUM),
    AsyncStorage.getItem(K_PLAN),
  ]);
  state.hasConsent = c === "1";
  state.isPremium = p === "1";
  state.planId = pl;
  state.loaded = true;
  emit();
}

export const premiumStore = {
  async load(): Promise<State> {
    await ensureLoaded();
    return { ...state };
  },
  async setConsent(v: boolean) {
    state.hasConsent = v;
    await AsyncStorage.setItem(K_CONSENT, v ? "1" : "0");
    emit();
  },
  async setPremium(v: boolean, planId?: string | null) {
    state.isPremium = v;
    state.planId = planId ?? state.planId ?? null;
    await AsyncStorage.multiSet([
      [K_PREMIUM, v ? "1" : "0"],
      [K_PLAN, state.planId ?? ""],
    ]);
    emit();
  },
  get() {
    return { ...state };
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function usePremiumState(): State {
  const [s, setS] = useState<State>(state);
  useEffect(() => {
    let mounted = true;
    premiumStore.load().then((snap) => {
      if (mounted) setS(snap);
    });
    const unsub = premiumStore.subscribe((snap) => {
      if (mounted) setS(snap);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);
  return s;
}
