import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

export const app = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = app ? getFirestore(app) : null;
export const auth: Auth | null = app ? getAuth(app) : null;

if (typeof window !== "undefined" && db) {
  enableIndexedDbPersistence(db).catch(() => {
    // Multiple tabs open or unsupported browser — app still works online.
  });
}

/**
 * Signs the device in anonymously so Firestore security rules can require
 * `request.auth != null` instead of being world-readable/writable — the
 * project id and API key are necessarily public once deployed.
 */
export function ensureAuth(): Promise<void> {
  const a = auth;
  if (!a) return Promise.resolve();
  if (a.currentUser) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      a,
      (user) => {
        if (user) {
          unsubscribe();
          resolve();
        }
      },
      (err) => {
        unsubscribe();
        reject(err);
      },
    );
    signInAnonymously(a).catch((err) => {
      unsubscribe();
      reject(err);
    });
  });
}
