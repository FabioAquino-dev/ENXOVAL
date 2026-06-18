"use client";

import { useEffect, useState } from "react";
import { Role } from "./types";

/** Shared access code for the family list — also used to derive the Firestore family path. */
export const ACCESS_CODE = "TIMOTEO2026";

/** Fixed Firestore family id, derived from the access code. */
export const FAMILY_ID = ACCESS_CODE.toLowerCase();

const KEY = "enxoval.access";

interface StoredAccess {
  role: Role;
  guestName?: string;
}

export function isValidAccessCode(code: string): boolean {
  return code.trim().toUpperCase() === ACCESS_CODE;
}

export function useAccess() {
  const [role, setRoleState] = useState<Role | null>(null);
  const [guestName, setGuestNameState] = useState<string | undefined>(undefined);

  useEffect(() => {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as StoredAccess;
      if (stored.role === "papai" || stored.role === "mamae" || stored.role === "convidado") {
        // One-time read of browser-only storage on mount; cannot run during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRoleState(stored.role);
        setGuestNameState(stored.guestName);
      }
    } catch {
      window.localStorage.removeItem(KEY);
    }
  }, []);

  /** Call only after the access code has been validated. */
  const grantAccess = (r: Role, name?: string) => {
    const stored: StoredAccess = { role: r, guestName: name };
    window.localStorage.setItem(KEY, JSON.stringify(stored));
    setRoleState(r);
    setGuestNameState(name);
  };

  const setGuestName = (name: string) => {
    setGuestNameState(name);
    const raw = window.localStorage.getItem(KEY);
    const stored: StoredAccess = raw ? JSON.parse(raw) : { role };
    window.localStorage.setItem(KEY, JSON.stringify({ ...stored, guestName: name }));
  };

  const clearAccess = () => {
    window.localStorage.removeItem(KEY);
    setRoleState(null);
    setGuestNameState(undefined);
  };

  return { role, guestName, grantAccess, setGuestName, clearAccess };
}
