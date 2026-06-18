"use client";

import { useEffect, useState } from "react";
import { Person } from "./types";

const KEY = "enxoval.person";

export function usePerson() {
  const [person, setPersonState] = useState<Person | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "papai" || stored === "mamae") {
      // One-time read of browser-only storage on mount; cannot run during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPersonState(stored);
    }
  }, []);

  const setPerson = (p: Person) => {
    window.localStorage.setItem(KEY, p);
    setPersonState(p);
  };

  return { person, setPerson };
}
