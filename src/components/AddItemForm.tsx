"use client";

import { useState } from "react";
import { CATEGORIES, Category, LayetteItem, SIZES, Size, SizeBreakdown } from "@/lib/types";
import Modal from "./Modal";

export default function AddItemForm({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Omit<LayetteItem, "id" | "purchased" | "custom">) => void;
}) {
  const [category, setCategory] = useState<Category>("Roupas");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [hasSizes, setHasSizes] = useState(true);
  const [unit, setUnit] = useState("peça");
  const [qtyNeeded, setQtyNeeded] = useState(1);
  const [sizes, setSizes] = useState<SizeBreakdown>({ RN: 0, P: 0, M: 0, G: 0 });
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const onCategoryChange = (c: Category) => {
    setCategory(c);
    setHasSizes(c === "Roupas");
    setUnit(c === "Roupas" ? "peça" : "unidade");
  };

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      category,
      name: name.trim(),
      detail: detail.trim() || undefined,
      unit,
      estimatedPrice,
      order: Date.now(),
      ...(hasSizes ? { sizes } : { qtyNeeded }),
    });
    onClose();
  };

  return (
    <Modal title="Adicionar item" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="Categoria">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as Category)}
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nome do item">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Almofada de amamentação"
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          />
        </Field>
        <Field label="Detalhe (opcional)">
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Ex: cor, marca, especificação"
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          />
        </Field>

        <label className="flex items-center gap-2 text-xs font-medium text-brown-600">
          <input
            type="checkbox"
            checked={hasSizes}
            onChange={(e) => setHasSizes(e.target.checked)}
            className="accent-moss-600"
          />
          Esse item varia por tamanho do bebê (RN/P/M/G)
        </label>

        {hasSizes ? (
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s: Size) => (
              <label
                key={s}
                className="flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs text-brown-700"
              >
                {s}
                <input
                  type="number"
                  min={0}
                  value={sizes[s] ?? 0}
                  onChange={(e) =>
                    setSizes((prev) => ({ ...prev, [s]: Number(e.target.value) }))
                  }
                  className="w-12 rounded border border-cream-200 bg-white px-1 py-0.5 text-center"
                />
              </label>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2">
          {!hasSizes && (
            <Field label="Qtd">
              <input
                type="number"
                min={1}
                value={qtyNeeded}
                onChange={(e) => setQtyNeeded(Number(e.target.value))}
                className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
              />
            </Field>
          )}
          <Field label="Unidade">
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
            />
          </Field>
          <Field label="Preço est.">
            <input
              type="number"
              min={0}
              step="0.01"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(Number(e.target.value))}
              className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
            />
          </Field>
        </div>
        <button
          onClick={submit}
          className="mt-2 rounded-xl bg-moss-600 px-4 py-3 font-semibold text-white active:scale-[0.98]"
        >
          Adicionar
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-brown-600">
        {label}
      </span>
      {children}
    </label>
  );
}
