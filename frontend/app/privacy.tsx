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
        <Text style={styles.updated}>Ultimo aggiornamento: 29/09/2026</Text>
        <Text style={styles.intro}>
          Questa applicazione è disponibile su dispositivi iOS e Android e utilizza
          Google AdMob per la pubblicità, Apple In-App Purchase per gli abbonamenti
          e un servizio di intelligenza artificiale esterno (NanoBanana) per la
          generazione dei contenuti.
        </Text>

        <Section title="1. Informazioni generali">
          L'app consente agli utenti di caricare immagini per generare contenuti
          visivi tramite intelligenza artificiale.{"\n\n"}
          L'utilizzo dell'app è anonimo e non richiede la creazione di un account.
        </Section>

        <Section title="2. Dati raccolti">
          L'app non raccoglie direttamente dati personali identificativi come nome,
          email o contatti.{"\n\n"}
          Possono essere raccolti automaticamente dati tecnici e identificatori
          pubblicitari, tra cui:{"\n"}
          • Advertising Identifier (IDFA su iOS){"\n"}
          • Identificatore pubblicitario Android (AAID){"\n"}
          • Dati di utilizzo anonimi
        </Section>

        <Section title="3. Immagini caricate dagli utenti">
          Gli utenti possono caricare immagini per la generazione di contenuti
          tramite AI.{"\n\n"}
          Le immagini vengono utilizzate esclusivamente per elaborare la richiesta
          dell'utente.{"\n\n"}
          Le immagini non vengono utilizzate per identificazione personale.{"\n\n"}
          Le immagini non vengono salvate sui nostri server e vengono eliminate
          immediatamente dopo l'elaborazione.{"\n\n"}
          Le immagini possono essere inviate temporaneamente al servizio esterno
          di intelligenza artificiale (NanoBanana) per la generazione del risultato.
        </Section>

        <Section title="4. Servizio di intelligenza artificiale (NanoBanana)">
          L'app utilizza un servizio di intelligenza artificiale esterno chiamato
          NanoBanana.{"\n\n"}
          Questo servizio elabora temporaneamente i dati necessari per generare
          il risultato richiesto dall'utente.
        </Section>

        <Section title="5. Google AdMob">
          L'app utilizza Google AdMob (Google LLC) su dispositivi iOS e Android
          per la pubblicità.{"\n\n"}
          Google può utilizzare identificatori pubblicitari per fornire annunci
          personalizzati o non personalizzati.{"\n\n"}
          Privacy Google: https://policies.google.com/privacy
        </Section>

        <Section title="6. App Tracking Transparency (iOS)">
          Su dispositivi iOS, l'app richiede il consenso dell'utente tramite il
          sistema Apple App Tracking Transparency (ATT).{"\n\n"}
          L'utente può accettare o rifiutare il tracciamento in qualsiasi momento.{"\n\n"}
          Se l'utente rifiuta, gli annunci saranno non personalizzati.
        </Section>

        <Section title="7. Pubblicità con ricompensa">
          L'app può mostrare annunci con ricompensa (rewarded ads).{"\n\n"}
          L'utente può scegliere di guardare un annuncio per ottenere premi o
          sbloccare funzionalità.
        </Section>

        <Section title="8. Abbonamenti e acquisti in-app">
          L'app offre abbonamenti e acquisti in-app tramite Apple In-App Purchase.{"\n\n"}
          Apple gestisce tutti i pagamenti in modo sicuro. Non abbiamo accesso
          ai dati di pagamento.{"\n\n"}
          Gli abbonamenti possono essere gestiti dall'utente tramite App Store.
        </Section>

        <Section title="9. Servizi di terze parti">
          L'app utilizza servizi di terze parti per pubblicità, analisi e
          generazione dei contenuti.{"\n\n"}
          Questi servizi includono Google AdMob e il servizio di intelligenza
          artificiale NanoBanana.{"\n\n"}
          Ogni servizio è regolato dalla propria privacy policy.
        </Section>

        <Section title="10. Conservazione dei dati">
          Non conserviamo immagini o dati personali sui nostri server oltre il
          tempo strettamente necessario all'elaborazione.{"\n\n"}
          I dati pubblicitari sono gestiti da Google secondo le proprie politiche.
        </Section>

        <Section title="11. Sicurezza">
          Adottiamo misure tecniche ragionevoli per proteggere i dati durante
          l'elaborazione.
        </Section>

        <Section title="12. Diritti dell'utente">
          L'utente può rifiutare il tracciamento tramite il popup ATT o le
          impostazioni del dispositivo.{"\n\n"}
          L'utente può gestire la pubblicità personalizzata nelle impostazioni
          Google.
        </Section>

        <Section title="13. Compatibilità piattaforme">
          Questa applicazione è disponibile su dispositivi iOS e Android. Il
          trattamento dei dati segue le politiche di entrambe le piattaforme.
        </Section>

        <Section title="14. Contatti">
          Per qualsiasi domanda sulla privacy: raffi2097@gmail.com
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
  updated: { color: colors.muted, fontSize: 12, marginBottom: spacing.md },
  intro: { fontSize: 14, color: colors.onSurfaceSecondary, lineHeight: 21, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.onSurface, marginBottom: spacing.xs },
  sectionBody: { fontSize: 14, color: colors.onSurfaceSecondary, lineHeight: 21 },
}));
