"use client";

import { useState } from "react";
import { Category, LayetteItem, Person, estimatedTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import ItemRow from "./ItemRow";

export default function CategorySection({
  category,
  icon,
  items,
  person,
  onToggle,
  onUpdate,
  onDelete,
}: {
  category: Category;
  icon: string;
  items: LayetteItem[];
  person: Person | null;
  onToggle: (id: string, purchased: boolean) => void;
  onUpdate: (id: string, partial: Partial<LayetteItem>) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, it) => sum + totalQty(it), 0);
  const purchasedItems = items
    .filter((it) => it.purchased)
    .reduce((sum, it) => sum + totalQty(it), 0);
  const subtotal = items.reduce((sum, it) => sum + estimatedTotal(it), 0);
  const done = totalItems > 0 && purchasedItems === totalItems;

  return (
    <section className="px-4 py-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg bg-blue-100/60 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-blue-950">
          <span>{icon}</span>
          {category}
          {done && <span className="text-emerald-600">✓</span>}
        </span>
        <span className="flex items-center gap-2 text-xs text-blue-800/90">
          {purchasedItems}/{totalItems} · {formatBRL(subtotal)}
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </span>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              person={person}
              onToggle={(p) => onToggle(item.id, p)}
              onUpdate={(partial) => onUpdate(item.id, partial)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
