import Ionicons from "@react-native-vector-icons/ionicons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePremiumState } from "@/src/services/premium";
import { babyStore, type Gender } from "@/src/store";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

type ParentKind = "father" | "mother";

export default function UploadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();

  const [fatherUri, setFatherUri] = useState<string | null>(babyStore.get().fatherImageUri);
  const [motherUri, setMotherUri] = useState<string | null>(babyStore.get().motherImageUri);
  const [gender, setGender] = useState<Gender>(babyStore.get().gender);
  const [error, setError] = useState<string | null>(null);
  const premium = usePremiumState();

  const pickImage = async (kind: ParentKind) => {
    setError(null);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setError("Consenti l'accesso alla galleria per continuare");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const asset = res.assets[0];
      const b64 = asset.base64 ?? null;
      if (!b64) {
        setError("Impossibile leggere l'immagine, riprova");
        return;
      }
      if (kind === "father") {
        setFatherUri(asset.uri);
        babyStore.setFather(asset.uri, b64);
      } else {
        setMotherUri(asset.uri);
        babyStore.setMother(asset.uri, b64);
      }
    } catch (e: any) {
      setError(e?.message ?? "Errore imprevisto");
    }
  };

  const canGenerate = !!fatherUri && !!motherUri;

  const onGenerate = () => {
    if (!canGenerate) {
      setError("Carica entrambe le foto per continuare");
      return;
    }
    babyStore.setGender(gender);
    if (premium.isPremium) {
      router.push("/generating");
    } else {
      router.push("/rewarded-ad");
    }
  };

  return (
    <View style={styles.root} testID="upload-screen">
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} testID="back-button">
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>I genitori</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Carica una foto ben visibile del volto di entrambi i genitori.
          Migliore è la foto, più bello sarà il risultato.
        </Text>

        <View style={styles.parentsRow}>
          <ParentCard
            testID="father-card"
            label="Papà"
            iconName="man"
            uri={fatherUri}
            onPress={() => pickImage("father")}
          />
          <ParentCard
            testID="mother-card"
            label="Mamma"
            iconName="woman"
            uri={motherUri}
            onPress={() => pickImage("mother")}
          />
        </View>

        <Text style={styles.sectionTitle}>Genere del bimbo</Text>
        <View style={styles.segmented} testID="gender-segmented">
          <SegmentBtn
            testID="gender-male"
            label="Maschio"
            active={gender === "male"}
            onPress={() => setGender("male")}
          />
          <SegmentBtn
            testID="gender-female"
            label="Femmina"
            active={gender === "female"}
            onPress={() => setGender("female")}
          />
          <SegmentBtn
            testID="gender-random"
            label="Sorprendimi"
            active={gender === "random"}
            onPress={() => setGender("random")}
          />
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={18} color={colors.onBrandTertiary} />
          <Text style={styles.infoText}>
            Il bimbo generato avrà tra i 2 e i 5 anni e mescolerà tratti di entrambi.
          </Text>
        </View>

        {error ? (
          <Text style={styles.errorText} testID="upload-error">
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          onPress={onGenerate}
          disabled={!canGenerate}
          style={({ pressed }) => [
            styles.cta,
            !canGenerate && styles.ctaDisabled,
            pressed && canGenerate && { transform: [{ scale: 0.97 }] },
          ]}
          testID="generate-button"
        >
          <Ionicons name="sparkles" size={20} color={colors.onBrandPrimary} />
          <Text style={styles.ctaText}>
            {premium.isPremium ? "Genera" : "Genera (guarda annuncio)"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ParentCard({
  label,
  iconName,
  uri,
  onPress,
  testID,
}: {
  label: string;
  iconName: string;
  uri: string | null;
  onPress: () => void;
  testID: string;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable style={styles.parentCard} onPress={onPress} testID={testID}>
      {uri ? (
        <Image source={{ uri }} style={styles.parentImage} contentFit="cover" />
      ) : (
        <View style={styles.parentEmpty}>
          <View style={styles.parentIconWrap}>
            <Ionicons name={iconName as any} size={26} color={colors.onBrandTertiary} />
          </View>
          <Ionicons name="camera" size={16} color={colors.muted} style={{ marginTop: 6 }} />
        </View>
      )}
      <View style={styles.parentBadge}>
        <Text style={styles.parentBadgeText}>{label}</Text>
      </View>
    </Pressable>
  );
}

function SegmentBtn({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segBtn, active && styles.segBtnActive]}
      testID={testID}
    >
      <Text style={[styles.segLabel, active && styles.segLabelActive]}>{label}</Text>
    </Pressable>
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
  intro: { fontSize: 15, color: colors.muted, lineHeight: 22, marginBottom: spacing.xl },
  parentsRow: { flexDirection: "row", gap: spacing.md },
  parentCard: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    overflow: "hidden",
    shadowColor: "#3D1C2A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  parentImage: { width: "100%", height: "100%" },
  parentEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSecondary,
  },
  parentIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  parentBadge: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.surfaceInverse,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  parentBadgeText: { color: colors.onSurfaceInverse, fontSize: 12, fontWeight: "700" },
  sectionTitle: {
    marginTop: spacing.xl,
    fontSize: 16,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segBtnActive: {
    backgroundColor: colors.brandPrimary,
  },
  segLabel: { color: colors.onSurface, fontSize: 13, fontWeight: "700" },
  segLabelActive: { color: colors.onBrandPrimary },
  infoRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    backgroundColor: colors.brandTertiary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoText: { flex: 1, color: colors.onBrandTertiary, fontSize: 13, lineHeight: 19 },
  errorText: {
    marginTop: spacing.lg,
    color: colors.error,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "rgba(255,249,250,0.9)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cta: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaDisabled: { backgroundColor: colors.borderStrong, shadowOpacity: 0 },
  ctaText: { color: colors.onBrandPrimary, fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
}));
