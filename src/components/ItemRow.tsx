"use client";

import { useState } from "react";
import { LayetteItem, Person, SIZES, estimatedTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";

export default function ItemRow({
  item,
  person,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: LayetteItem;
  person: Person | null;
  onToggle: (purchased: boolean) => void;
  onUpdate: (partial: Partial<LayetteItem>) => void;
  onDelete: () => void;
}) {
  const [notesOpen, setNotesOpen] = useState(Boolean(item.notes));
  const qty = totalQty(item);

  return (
    <div
      className={`rounded-xl border p-3 transition ${
        item.purchased
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-blue-100 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-semibold ${
                item.purchased ? "text-emerald-800 line-through" : "text-blue-950"
              }`}
            >
              {item.name}
            </p>
            <button
              onClick={onDelete}
              className="shrink-0 text-xs text-blue-300 hover:text-red-500"
              aria-label="Remover item"
            >
              ✕
            </button>
          </div>
          {item.detail && (
            <p className="text-xs text-blue-700/60">{item.detail}</p>
          )}

          {item.sizes ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIZES.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700"
                >
                  {s}
                  <input
                    type="number"
                    min={0}
                    value={item.sizes?.[s] ?? 0}
                    onChange={(e) =>
                      onUpdate({
                        sizes: { ...item.sizes, [s]: Number(e.target.value) },
                      })
                    }
                    className="w-9 rounded border border-blue-200 bg-white px-1 text-center"
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-700">
              <span>Qtd:</span>
              <input
                type="number"
                min={0}
                value={item.qtyNeeded ?? 1}
                onChange={(e) => onUpdate({ qtyNeeded: Number(e.target.value) })}
                className="w-12 rounded border border-blue-200 bg-blue-50 px-1 text-center"
              />
              <span>{item.unit}</span>
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            <PriceField
              label="Estimado"
              value={item.estimatedPrice}
              onChange={(v) => onUpdate({ estimatedPrice: v })}
            />
            <PriceField
              label="Real"
              value={item.realPrice ?? undefined}
              placeholder={item.estimatedPrice.toFixed(2)}
              onChange={(v) => onUpdate({ realPrice: v })}
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-blue-700/60">
            <span>
              {qty}× · subtotal {formatBRL(estimatedTotal(item))}
            </span>
            {item.purchased && (
              <span className="font-medium text-emerald-700">
                ✓ {item.purchasedBy === "papai" ? "Papai" : item.purchasedBy === "mamae" ? "Mamãe" : person ? (person === "papai" ? "Papai" : "Mamãe") : "comprado"}
              </span>
            )}
          </div>

          {notesOpen ? (
            <input
              type="text"
              value={item.notes ?? ""}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Observação ou link da loja"
              className="mt-2 w-full rounded border border-blue-200 bg-blue-50/50 px-2 py-1 text-xs"
              onBlur={() => {
                if (!item.notes) setNotesOpen(false);
              }}
            />
          ) : (
            <button
              onClick={() => setNotesOpen(true)}
              className="mt-1 text-[11px] text-blue-400 hover:text-blue-600"
            >
              + observação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: number;
  placeholder?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wide text-blue-400">
        {label}
      </span>
      <div className="flex items-center rounded border border-blue-200 bg-white px-1.5">
        <span className="text-xs text-blue-400">R$</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full min-w-0 px-1 py-1 text-sm outline-none"
        />
      </div>
    </label>
  );
}
