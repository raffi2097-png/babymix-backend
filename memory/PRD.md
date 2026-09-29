# BabyMix — PRD

## Descrizione
App mobile (Expo) in italiano che, a partire da due foto di genitori (papà + mamma), genera un ritratto realistico del possibile figlio (età 2-5 anni) usando Gemini Nano Banana (`gemini-3.1-flash-image-preview`) tramite la Emergent Universal Key.

## Flusso utente
1. Welcome ("Crea la vostra magia") → tap "Inizia"
2. Upload: carica foto papà + foto mamma dalla galleria, seleziona genere (Maschio / Femmina / Sorprendimi) → tap "Genera"
3. Generating: schermata animata "La cicogna è in viaggio…" mentre il backend chiama Gemini
4. Result: mostra il bimbo generato, con azioni Condividi / Riprova / Ricomincia da capo

## Stack
- Frontend: Expo 57 + expo-router (stack), expo-image, expo-image-picker, expo-linear-gradient, react-native-reanimated, @react-native-vector-icons/ionicons
- Backend: FastAPI + emergentintegrations `LlmChat` (gemini image gen, modalities=["image","text"])
- Nessuna persistenza (one-shot, senza history né auth)

## API
- `GET /api/` → status
- `POST /api/generate-baby` body `{ father_image_base64, mother_image_base64, gender: "male"|"female"|"random" }` → `{ image_base64, mime_type }`

## Design
Personality "4 Tactile / Playful LIGHT", palette pastello rosa/viola (`#D198E5`, `#FFB7C5`, `#FFF9FA`), corners molto arrotondati, shadow morbide.

## Note
- Prompt Gemini forzato a rispettare probabilità genetiche reali (occhi marroni dominanti, capelli scuri dominanti, mix pelle e tratti facciali plausibile).
- Immagini gestite come base64 in memoria (`/app/frontend/src/store.ts`), non salvate.
- L'utente deve concedere permesso galleria; expo-image-picker chiede il permesso a runtime.
