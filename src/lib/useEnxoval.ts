"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, ensureAuth, isFirebaseConfigured } from "./firebase";
import { AppSettings, LayetteItem, Person } from "./types";
import { buildDefaultItems } from "./defaultItems";

const ITEMS_COLLECTION = "items";
const SETTINGS_DOC = "meta/settings";
const SEED_FLAG_DOC = "meta/seed";

const DEFAULT_SETTINGS: AppSettings = {
  dueDate: "2026-09-16",
  babyName: "",
  budgetGoal: 0,
};

async function seedIfEmpty() {
  const firestore = db;
  if (!firestore) return;
  const flagRef = doc(firestore, SEED_FLAG_DOC);
  await runTransaction(firestore, async (tx) => {
    const flagSnap = await tx.get(flagRef);
    if (flagSnap.exists()) return;
    tx.set(flagRef, { seededAt: Date.now() });
    for (const item of buildDefaultItems()) {
      const ref = doc(firestore, ITEMS_COLLECTION, item.id);
      tx.set(ref, item);
    }
  });
}

export function useEnxoval() {
  const [items, setItems] = useState<LayetteItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(isFirebaseConfigured);

  useEffect(() => {
    const firestore = db;
    if (!firestore) {
      // No Firebase configured: fall back to a local-only default list.
      /* eslint-disable react-hooks/set-state-in-effect */
      setItems(buildDefaultItems());
      setLoading(false);
      setSynced(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let unsubItems = () => {};
    let unsubSettings = () => {};
    let cancelled = false;

    ensureAuth()
      .then(() => {
        if (cancelled) return;

        seedIfEmpty().catch((err) => console.error("seed error", err));

        const itemsQuery = query(collection(firestore, ITEMS_COLLECTION), orderBy("order"));
        unsubItems = onSnapshot(
          itemsQuery,
          (snap) => {
            setItems(
              snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LayetteItem),
            );
            setLoading(false);
            setSynced(true);
          },
          (err) => {
            console.error("items sync error", err);
            setSynced(false);
            setLoading(false);
          },
        );

        unsubSettings = onSnapshot(
          doc(firestore, SETTINGS_DOC),
          (snap) => {
            if (snap.exists()) {
              setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as AppSettings) });
            } else {
              setDoc(doc(firestore, SETTINGS_DOC), DEFAULT_SETTINGS).catch(console.error);
            }
          },
          (err) => console.error("settings sync error", err),
        );
      })
      .catch((err) => {
        console.error("auth error", err);
        setSynced(false);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      unsubItems();
      unsubSettings();
    };
  }, []);

  const updateItem = useCallback(
    async (id: string, partial: Partial<LayetteItem>) => {
      if (!db) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...partial } : it)),
        );
        return;
      }
      await updateDoc(doc(db, ITEMS_COLLECTION, id), partial);
    },
    [],
  );

  const togglePurchased = useCallback(
    async (id: string, purchased: boolean, person: Person | null) => {
      await updateItem(id, {
        purchased,
        purchasedBy: purchased ? person : null,
        purchasedAt: purchased ? Date.now() : null,
      });
    },
    [updateItem],
  );

  const addCustomItem = useCallback(
    async (partial: Omit<LayetteItem, "id" | "purchased" | "custom">) => {
      const newItem: LayetteItem = {
        ...partial,
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        purchased: false,
        custom: true,
        createdAt: Date.now(),
      };
      if (!db) {
        setItems((prev) => [...prev, newItem]);
        return;
      }
      await setDoc(doc(db, ITEMS_COLLECTION, newItem.id), newItem);
    },
    [],
  );

  const removeItem = useCallback(async (id: string) => {
    if (!db) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      return;
    }
    await deleteDoc(doc(db, ITEMS_COLLECTION, id));
  }, []);

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    if (!db) {
      setSettings((prev) => ({ ...prev, ...partial }));
      return;
    }
    await setDoc(doc(db, SETTINGS_DOC), partial, { merge: true });
  }, []);

  return {
    items,
    settings,
    loading,
    synced,
    updateItem,
    togglePurchased,
    addCustomItem,
    removeItem,
    updateSettings,
  };
}
