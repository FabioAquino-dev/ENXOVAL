"use client";

import { useState } from "react";
import { Category, LayetteItem, Role, estimatedTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import ItemRow from "./ItemRow";

export default function CategorySection({
  category,
  icon,
  items,
  role,
  guestName,
  onToggle,
  onUpdate,
  onDelete,
  onMarkGifted,
  onUndoGift,
  onGiftConfirmed,
}: {
  category: Category;
  icon: string;
  items: LayetteItem[];
  role: Role;
  guestName?: string;
  onToggle: (id: string, purchased: boolean) => void;
  onUpdate: (id: string, partial: Partial<LayetteItem>) => void;
  onDelete: (id: string) => void;
  onMarkGifted: (id: string, guestName?: string) => Promise<void> | void;
  onUndoGift: (id: string) => void;
  onGiftConfirmed?: () => void;
}) {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, it) => sum + totalQty(it), 0);
  const obtainedItems = items
    .filter((it) => it.purchased || it.gifted)
    .reduce((sum, it) => sum + totalQty(it), 0);
  const subtotal = items.reduce((sum, it) => sum + estimatedTotal(it), 0);
  const done = totalItems > 0 && obtainedItems === totalItems;

  return (
    <section className="px-4 py-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg bg-cream-100 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-moss-950">
          <span>{icon}</span>
          {category}
          {done && <span className="text-emerald-600">✓</span>}
        </span>
        <span className="flex items-center gap-2 text-xs text-brown-600">
          {obtainedItems}/{totalItems}
          {role !== "convidado" && <> · {formatBRL(subtotal)}</>}
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </span>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              role={role}
              guestName={guestName}
              onToggle={(p) => onToggle(item.id, p)}
              onUpdate={(partial) => onUpdate(item.id, partial)}
              onDelete={() => onDelete(item.id)}
              onMarkGifted={(name) => onMarkGifted(item.id, name)}
              onUndoGift={() => onUndoGift(item.id)}
              onGiftConfirmed={onGiftConfirmed}
            />
          ))}
        </div>
      )}
    </section>
  );
}
