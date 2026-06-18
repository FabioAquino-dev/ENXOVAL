"use client";

import { useState } from "react";
import { CATEGORIES, Category, LayetteItem } from "@/lib/types";
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
  const [unit, setUnit] = useState("unidade");
  const [qtyNeeded, setQtyNeeded] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      category,
      name: name.trim(),
      detail: detail.trim() || undefined,
      unit,
      qtyNeeded,
      estimatedPrice,
      order: Date.now(),
    });
    onClose();
  };

  return (
    <Modal title="Adicionar item" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="Categoria">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
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
        <div className="grid grid-cols-3 gap-2">
          <Field label="Qtd">
            <input
              type="number"
              min={1}
              value={qtyNeeded}
              onChange={(e) => setQtyNeeded(Number(e.target.value))}
              className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
            />
          </Field>
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
