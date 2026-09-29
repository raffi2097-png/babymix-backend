# BabyMix — PRD

## Descrizione
App mobile Expo (italiano) che genera il possibile figlio (2-5 anni) da due foto dei genitori, usando Gemini Nano Banana (`gemini-3.1-flash-image-preview`) via Emergent Universal Key.

## Flusso utente (v2 con monetizzazione)
1. **Primo avvio → Consent modal** ("Prima di iniziare · Accetto") — blocca l'app finché l'utente non acconsente al trattamento foto + dati pubblicitari. Se apre "Leggi la Privacy Policy" e torna indietro senza accettare, il modal si riapre automaticamente (`useFocusEffect`).
2. **Welcome** — hero coppia, titolo "Crea la vostra magia", card "Passa a Premium (Rimuovi Pubblicità)" gradient, CTA "Inizia", footer Privacy Policy · Termini.
3. **Upload** — carica papà + mamma, seleziona genere M/F/Sorprendimi. CTA:
   - Free: "Genera (guarda annuncio)" → `/rewarded-ad` (30s countdown) → `/generating`
   - Premium: "Genera" → direttamente a `/generating`
4. **Rewarded Ad** (`/rewarded-ad`) — placeholder 30 secondi con countdown, animazione, tag "ANNUNCIO", pulsante "Salta per sempre con Premium".
5. **Generating** → chiama `POST /api/generate-baby`.
6. **Result** — mostra immagine, azioni Condividi/Riprova/Ricomincia.

## Paywall (`/paywall`)
- Piano **Settimanale** 2,99 € — 3 giorni di prova gratuita
- Piano **Mensile** 7,99 €
- Vantaggi: Zero pubblicità · Illimitate · HD · Accesso prioritario
- Bottone acquisto simulato (1,2s) → flip a Premium
- Ripristina acquisti

## AdMob reale (Rewarded Video)
- Package: `react-native-google-mobile-ads@17.2.0`
- Config plugin in `app.json` con:
  - iOS App ID: `ca-app-pub-9867075377824700~3097681401` (utente) → `Info.plist GADApplicationIdentifier` iniettato automaticamente dal plugin
  - Android App ID: `ca-app-pub-3940256099942544~3347511713` (test Google, da sostituire)
  - Android Rewarded Ad Unit ID: `ca-app-pub-9867075377824700/7900164526` (utente)
  - iOS Rewarded Ad Unit ID: test Google `ca-app-pub-3940256099942544/1712485313` (da sostituire con quello reale con `/`)
- `src/services/admob.ts` chiama `RewardedAd.createForAdRequest → load → show → EARNED_REWARD`
- `src/services/admob.web.ts` shim automatico per web/Expo Go (Metro seleziona il file `.web.ts`)
- `_layout.tsx` chiama `initAdMob()` all'avvio (`mobileAds().initialize()`)
- Se la SDK nativa non è disponibile (Expo Go / anteprima web) resta il countdown simulato di 30s → generation
- La vera Rewarded Video funziona SOLO su build nativa (Publish → Generate iOS build)
- `src/services/payments.ts` — `PLANS`, `purchase()`, `restorePurchases()` simulati. Commenti con istruzioni per Stripe checkout (backend) o `react-native-iap`.
- `src/services/premium.ts` — persistenza consenso + premium via AsyncStorage.

## Stack
- Frontend: Expo 57, expo-router, expo-image, expo-image-picker, expo-linear-gradient, react-native-reanimated, @react-native-vector-icons/ionicons, @react-native-async-storage/async-storage
- Backend: FastAPI + emergentintegrations `LlmChat` (Gemini)

## API
- `GET /api/` → status
- `POST /api/generate-baby` `{father_image_base64, mother_image_base64, gender}` → `{image_base64, mime_type}`

## Design
Personality "4 Tactile / Playful LIGHT", palette pastello rosa/viola, tokens in `src/theme.ts`.
