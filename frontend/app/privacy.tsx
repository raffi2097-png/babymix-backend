import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.root} testID="privacy-screen">
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} testID="privacy-back">
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="1. Introduzione">
          BabyMix rispetta la tua privacy. Questa policy spiega quali dati raccogliamo,
          come li usiamo e quali sono i tuoi diritti.
        </Section>
        <Section title="2. Foto caricate">
          Le foto dei genitori vengono inviate al nostro servizio AI (Gemini) solo per
          generare l'immagine del figlio. Non vengono conservate sui nostri server dopo
          la generazione né usate per addestrare modelli.
        </Section>
        <Section title="3. Pubblicità (utenti Free)">
          Mostriamo video pubblicitari premiati tramite Google AdMob. AdMob può usare
          identificatori pubblicitari per personalizzare gli annunci. Puoi rimuovere
          le pubblicità in qualsiasi momento passando a BabyMix Premium.
        </Section>
        <Section title="4. Acquisti">
          Gli abbonamenti (Settimanale 2,99 € · Mensile 7,99 €) sono gestiti tramite
          App Store, Google Play o Stripe. Non tratteniamo mai i dati della tua carta.
        </Section>
        <Section title="5. Dati non personali">
          Raccogliamo dati aggregati anonimi (numero di generazioni, crash) per
          migliorare il servizio.
        </Section>
        <Section title="6. I tuoi diritti">
          Puoi richiedere la cancellazione dei tuoi dati scrivendo a
          privacy@babymix.app.
        </Section>
        <Section title="7. Modifiche">
          Ci riserviamo di aggiornare questa policy. Le modifiche saranno pubblicate
          in questa pagina.
        </Section>

        <Text style={styles.updated}>Ultimo aggiornamento: maggio 2026</Text>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: colors.onSurface },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.onSurface, marginBottom: spacing.xs },
  sectionBody: { fontSize: 14, color: colors.onSurfaceSecondary, lineHeight: 21 },
  updated: { marginTop: spacing.lg, color: colors.muted, fontSize: 12, textAlign: "center" },
}));
