"use client";

import { useState } from "react";
import { LayetteItem, Role, SIZES, estimatedTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import GiftConfirmModal from "./GiftConfirmModal";

const PURCHASED_LABEL: Record<string, string> = {
  papai: "Comprado pelo Papai",
  mamae: "Comprado pela Mamãe",
};

export default function ItemRow({
  item,
  role,
  guestName,
  onToggle,
  onUpdate,
  onDelete,
  onMarkGifted,
  onUndoGift,
  onGiftConfirmed,
}: {
  item: LayetteItem;
  role: Role;
  guestName?: string;
  onToggle: (purchased: boolean) => void;
  onUpdate: (partial: Partial<LayetteItem>) => void;
  onDelete: () => void;
  onMarkGifted: (guestName?: string) => Promise<void> | void;
  onUndoGift: () => void;
  onGiftConfirmed?: () => void;
}) {
  const [notesOpen, setNotesOpen] = useState(Boolean(item.notes));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showGiftConfirm, setShowGiftConfirm] = useState(false);
  const qty = totalQty(item);

  if (role === "convidado") {
    return (
      <>
        <div
          className={`rounded-xl border p-3.5 transition ${
            item.gifted
              ? "border-emerald-200 bg-emerald-50/70"
              : item.purchased
                ? "border-blue-100 bg-blue-50/40"
                : "border-blue-100 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-blue-950">{item.name}</p>
          {item.detail && <p className="text-xs text-blue-700/80">{item.detail}</p>}
          <p className="mt-1 text-[11px] text-blue-700/80">
            {qty}× {item.unit} · ≈ {formatBRL(estimatedTotal(item))}
          </p>

          {item.gifted ? (
            <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <span>🎁</span>
              <span>
                {item.giftedByName ? `Presenteado por ${item.giftedByName}` : "Presente recebido"}
              </span>
            </div>
          ) : item.purchased ? (
            <div className="mt-2 text-sm font-medium text-blue-700">
              ✓ Já garantido pela família
            </div>
          ) : (
            <button
              onClick={() => setShowGiftConfirm(true)}
              className="mt-2.5 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              🎁 Vou presentear
            </button>
          )}
        </div>

        {showGiftConfirm && (
          <GiftConfirmModal
            itemName={item.name}
            defaultGuestName={guestName}
            onClose={() => setShowGiftConfirm(false)}
            onConfirm={async (name) => {
              await onMarkGifted(name);
              setShowGiftConfirm(false);
              onGiftConfirmed?.();
            }}
          />
        )}
      </>
    );
  }

  // Papai / Mamãe — once gifted, editing is collapsed behind an undo action
  // so the list doesn't show stale price/quantity fields for a received item.
  if (item.gifted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-blue-950">{item.name}</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <span>🎁</span>
              <span>
                {item.giftedByName ? `Presenteado por ${item.giftedByName}` : "Presente recebido"}
              </span>
            </div>
          </div>
          <button
            onClick={onUndoGift}
            className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs text-blue-600 shadow-sm"
          >
            Desfazer
          </button>
        </div>
      </div>
    );
  }

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
          aria-label={`Marcar ${item.name} como comprado`}
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
            {confirmDelete ? (
              <span className="flex shrink-0 items-center gap-1">
                <button
                  onClick={onDelete}
                  className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-medium text-white"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600"
                >
                  Cancelar
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="shrink-0 text-xs text-blue-400 hover:text-red-500"
                aria-label="Remover item"
              >
                ✕
              </button>
            )}
          </div>
          {item.detail && (
            <p className="text-xs text-blue-700/80">{item.detail}</p>
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

          <div className="mt-1 flex items-center justify-between text-[11px] text-blue-700/80">
            <span>
              {qty}× · subtotal {formatBRL(estimatedTotal(item))}
            </span>
            {item.purchased && (
              <span className="font-medium text-emerald-700">
                ✓ {item.purchasedBy ? PURCHASED_LABEL[item.purchasedBy] : "Comprado"}
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
              className="mt-1 text-[11px] text-blue-500 hover:text-blue-600"
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
      <span className="text-[10px] uppercase tracking-wide text-blue-500">
        {label}
      </span>
      <div className="flex items-center rounded border border-blue-200 bg-white px-1.5">
        <span className="text-xs text-blue-500">R$</span>
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
