"use client";

import { useState } from "react";

function formatMoney(n?: number | null): string {
  return n !== undefined && n !== null ? String(n).replace(".", ",") : "";
}

function parseMoney(s: string): number {
  const normalized = s.replace(",", ".").replace(/[^0-9.]/g, "");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Plain text input with a manual comma/dot parser instead of
 * `<input type="number">`. On several Android keyboards (pt-BR layout),
 * typing the comma decimal key into a number input gets silently
 * rejected — the field just won't take cents. Committing on blur (not
 * every keystroke) also avoids re-formatting the value out from under
 * the user while they're still typing.
 */
export default function MoneyInput({
  value,
  placeholder,
  onCommit,
  className,
}: {
  value?: number | null;
  placeholder?: string;
  onCommit: (n: number) => void;
  className?: string;
}) {
  const [text, setText] = useState(formatMoney(value));
  const [prevValue, setPrevValue] = useState(value);

  // Resync the displayed text when `value` changes from outside (e.g. a
  // Firestore update) — done during render per React's guidance, instead
  // of an effect, so it doesn't cost an extra render pass.
  if (value !== prevValue) {
    setPrevValue(value);
    setText(formatMoney(value));
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onCommit(parseMoney(text))}
      className={className}
    />
  );
}
