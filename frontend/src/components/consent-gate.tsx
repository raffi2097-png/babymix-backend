import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { premiumStore, usePremiumState } from "@/src/services/premium";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function ConsentGate() {
  const state = usePremiumState();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.loaded && !state.hasConsent) setVisible(true);
    else setVisible(false);
  }, [state.loaded, state.hasConsent]);

  // Re-open the gate whenever this screen regains focus (e.g. after visiting
  // /privacy) if the user still hasn't accepted.
  useFocusEffect(
    useCallback(() => {
      if (state.loaded && !state.hasConsent) setVisible(true);
    }, [state.loaded, state.hasConsent]),
  );

  const accept = async () => {
    await premiumStore.setConsent(true);
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
      testID="consent-modal"
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark" size={28} color={colors.onBrandPrimary} />
          </View>
          <Text style={styles.title}>Prima di iniziare</Text>
          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.body}>
              Per usare BabyMix devi acconsentire a:
            </Text>
            <Bullet text="Trattamento delle foto caricate: le tue foto vengono inviate al nostro servizio AI solo per generare l'immagine e non vengono conservate." />
            <Bullet text="Uso di dati pubblicitari: per gli utenti Free mostriamo video pubblicitari premiati (Rewarded Video) prima della generazione." />
            <Bullet text="Cookie e identificatori pubblicitari (AdMob) per personalizzare gli annunci." />
            <Text style={[styles.body, { marginTop: spacing.md }]}>
              Puoi rimuovere le pubblicità in qualsiasi momento passando a Premium.
            </Text>
          </ScrollView>

          <Pressable onPress={accept} style={styles.acceptBtn} testID="consent-accept">
            <Text style={styles.acceptText}>Accetto</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setVisible(false);
              setTimeout(() => router.push("/privacy"), 0);
            }}
            style={styles.linkBtn}
            testID="consent-privacy-link"
          >
            <Text style={styles.linkText}>Leggi la Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Bullet({ text }: { text: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.bullet}>
      <Ionicons name="checkmark" size={16} color={colors.brandPrimary} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(61,28,42,0.55)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  iconWrap: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  body: { fontSize: 14, color: colors.onSurfaceSecondary, lineHeight: 20 },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bulletText: { flex: 1, color: colors.onSurface, fontSize: 13, lineHeight: 19 },
  acceptBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  acceptText: { color: colors.onBrandPrimary, fontWeight: "800", fontSize: 16 },
  linkBtn: { alignItems: "center", paddingVertical: spacing.sm, marginTop: spacing.xs },
  linkText: { color: colors.muted, fontSize: 12, textDecorationLine: "underline" },
}));
