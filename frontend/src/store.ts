// Simple in-memory store for baby generation flow.
// Base64 images are large; using params/AsyncStorage is impractical.

type Gender = "male" | "female" | "random";

type Store = {
  fatherImageBase64: string | null;
  fatherImageUri: string | null;
  motherImageBase64: string | null;
  motherImageUri: string | null;
  gender: Gender;
  resultImageBase64: string | null;
  resultMimeType: string;
};

const store: Store = {
  fatherImageBase64: null,
  fatherImageUri: null,
  motherImageBase64: null,
  motherImageUri: null,
  gender: "random",
  resultImageBase64: null,
  resultMimeType: "image/png",
};

export const babyStore = {
  get: () => store,
  setFather(uri: string | null, base64: string | null) {
    store.fatherImageUri = uri;
    store.fatherImageBase64 = base64;
  },
  setMother(uri: string | null, base64: string | null) {
    store.motherImageUri = uri;
    store.motherImageBase64 = base64;
  },
  setGender(g: Gender) {
    store.gender = g;
  },
  setResult(base64: string | null, mime: string = "image/png") {
    store.resultImageBase64 = base64;
    store.resultMimeType = mime;
  },
  reset() {
    store.fatherImageBase64 = null;
    store.fatherImageUri = null;
    store.motherImageBase64 = null;
    store.motherImageUri = null;
    store.gender = "random";
    store.resultImageBase64 = null;
  },
};

export type { Gender };
