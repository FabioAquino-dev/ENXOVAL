"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, ensureAuth, isFirebaseConfigured } from "./firebase";
import { FAMILY_ID } from "./access";
import { AppSettings, LayetteItem, Person, Role } from "./types";
import { buildDefaultItems } from "./defaultItems";

const FAMILY_ITEMS_PATH = `families/${FAMILY_ID}/items`;
const FAMILY_SETTINGS_DOC = `families/${FAMILY_ID}/settings/main`;
const FAMILY_INIT_FLAG_DOC = `families/${FAMILY_ID}/meta/init`;

// Pre-existing top-level paths used before the family/list structure was
// introduced. Kept read-only so any real data already synced there gets
// copied into the family path once, instead of silently orphaned.
const LEGACY_ITEMS_COLLECTION = "items";
const LEGACY_SETTINGS_DOC = "meta/settings";

const DEFAULT_SETTINGS: AppSettings = {
  dueDate: "2026-09-16",
  babyName: "Timóteo",
  budgetGoal: 0,
};

async function initFamilyData() {
  const firestore = db;
  if (!firestore) return;

  const initRef = doc(firestore, FAMILY_INIT_FLAG_DOC);
  const initSnap = await getDoc(initRef);
  if (initSnap.exists()) return;

  const [legacyItemsSnap, legacySettingsSnap] = await Promise.all([
    getDocs(collection(firestore, LEGACY_ITEMS_COLLECTION)).catch(() => null),
    getDoc(doc(firestore, LEGACY_SETTINGS_DOC)).catch(() => null),
  ]);

  const batch = writeBatch(firestore);
  let migratedFromLegacy = 0;

  if (legacyItemsSnap && !legacyItemsSnap.empty) {
    legacyItemsSnap.docs.forEach((d) => {
      batch.set(doc(firestore, FAMILY_ITEMS_PATH, d.id), d.data());
      migratedFromLegacy += 1;
    });
    if (legacySettingsSnap?.exists()) {
      batch.set(doc(firestore, FAMILY_SETTINGS_DOC), legacySettingsSnap.data(), {
        merge: true,
      });
    }
  } else {
    buildDefaultItems().forEach((item) => {
      batch.set(doc(firestore, FAMILY_ITEMS_PATH, item.id), item);
    });
  }

  batch.set(initRef, { initializedAt: Date.now(), migratedFromLegacy });
  await batch.commit();
}

export function useEnxoval(role: Role | null) {
  const [items, setItems] = useState<LayetteItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(isFirebaseConfigured);

  const isGuest = role === "convidado";

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

        initFamilyData().catch((err) => console.error("family init error", err));

        const itemsQuery = query(
          collection(firestore, FAMILY_ITEMS_PATH),
          orderBy("order"),
        );
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
          doc(firestore, FAMILY_SETTINGS_DOC),
          (snap) => {
            if (snap.exists()) {
              setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as AppSettings) });
            } else {
              setDoc(doc(firestore, FAMILY_SETTINGS_DOC), DEFAULT_SETTINGS).catch(
                console.error,
              );
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

  /** Guests can only mark gifts — every other mutation is a no-op for them. */
  const guardEditable = useCallback(() => {
    if (isGuest) {
      console.warn("Ação bloqueada: convidados não podem editar a lista.");
      return false;
    }
    return true;
  }, [isGuest]);

  const updateItem = useCallback(
    async (id: string, partial: Partial<LayetteItem>) => {
      if (!guardEditable()) return;
      if (!db) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...partial } : it)),
        );
        return;
      }
      await updateDoc(doc(db, FAMILY_ITEMS_PATH, id), partial);
    },
    [guardEditable],
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

  /** The only mutation guests are allowed to perform. */
  const markGifted = useCallback(
    async (id: string, giftedByName?: string) => {
      if (role !== "convidado") {
        console.warn("markGifted é exclusivo do modo convidado.");
        return;
      }
      const current = items.find((it) => it.id === id);
      if (current?.purchased || current?.gifted) return;

      const partial: Partial<LayetteItem> = {
        gifted: true,
        giftedByRole: "convidado",
        giftedByName: giftedByName?.trim() || null,
        giftedAt: Date.now(),
      };
      if (!db) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...partial } : it)),
        );
        return;
      }
      await updateDoc(doc(db, FAMILY_ITEMS_PATH, id), partial);
    },
    [role, items],
  );

  /** Only Papai/Mamãe can undo a gift mark (e.g. if it was a mistake). */
  const undoGift = useCallback(
    async (id: string) => {
      if (!guardEditable()) return;
      const partial: Partial<LayetteItem> = {
        gifted: false,
        giftedByRole: null,
        giftedByName: null,
        giftedAt: null,
      };
      if (!db) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...partial } : it)),
        );
        return;
      }
      await updateDoc(doc(db, FAMILY_ITEMS_PATH, id), partial);
    },
    [guardEditable],
  );

  const addCustomItem = useCallback(
    async (partial: Omit<LayetteItem, "id" | "purchased" | "custom">) => {
      if (!guardEditable()) return;
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
      await setDoc(doc(db, FAMILY_ITEMS_PATH, newItem.id), newItem);
    },
    [guardEditable],
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (!guardEditable()) return;
      if (!db) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        return;
      }
      await deleteDoc(doc(db, FAMILY_ITEMS_PATH, id));
    },
    [guardEditable],
  );

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      if (!guardEditable()) return;
      if (!db) {
        setSettings((prev) => ({ ...prev, ...partial }));
        return;
      }
      await setDoc(doc(db, FAMILY_SETTINGS_DOC), partial, { merge: true });
    },
    [guardEditable],
  );

  return {
    items,
    settings,
    loading,
    synced,
    updateItem,
    togglePurchased,
    markGifted,
    undoGift,
    addCustomItem,
    removeItem,
    updateSettings,
  };
}
