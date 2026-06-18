"use client";

import { useState } from "react";
import { AppSettings, Role } from "@/lib/types";
import Modal from "./Modal";

const ROLE_LABEL: Record<Role, string> = {
  papai: "Papai",
  mamae: "Mamãe",
  convidado: "Convidado",
};

export default function SettingsPanel({
  settings,
  role,
  onClose,
  onSave,
  onChangeRole,
  onResetQuantities,
}: {
  settings: AppSettings;
  role: Role;
  onClose: () => void;
  onSave: (partial: Partial<AppSettings>) => void;
  onChangeRole: () => void;
  onResetQuantities: () => Promise<void> | void;
}) {
  const [babyName, setBabyName] = useState(settings.babyName ?? "");
  const [dueDate, setDueDate] = useState(settings.dueDate);
  const [budgetGoal, setBudgetGoal] = useState(settings.budgetGoal ?? 0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const save = () => {
    onSave({ babyName, dueDate, budgetGoal });
    onClose();
  };

  const confirmAndReset = async () => {
    await onResetQuantities();
    setConfirmReset(false);
    setResetDone(true);
  };

  return (
    <Modal title="Configurações" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="Nome do bebê (opcional)">
          <input
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            placeholder="Ainda sem nome?"
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          />
        </Field>
        <Field label="Data prevista do parto">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          />
        </Field>
        <Field label="Meta de orçamento (opcional)">
          <input
            type="number"
            min={0}
            value={budgetGoal}
            onChange={(e) => setBudgetGoal(Number(e.target.value))}
            className="w-full rounded border border-cream-200 px-2 py-2 text-sm"
          />
        </Field>
        <button
          onClick={save}
          className="mt-2 rounded-xl bg-moss-600 px-4 py-3 font-semibold text-white active:scale-[0.98]"
        >
          Salvar
        </button>

        <div className="mt-2 rounded-xl border border-cream-200 bg-cream-50/60 p-3">
          <p className="mb-2 text-xs font-medium text-brown-600">
            Restaurar as quantidades sugeridas originais de cada item (tamanhos RN/P/M/G e
            unidades). Não muda preços, compras ou presentes já marcados.
          </p>
          {resetDone ? (
            <p className="text-sm font-medium text-moss-700">
              ✓ Quantidades restauradas para o padrão sugerido.
            </p>
          ) : confirmReset ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-moss-900">
                Tem certeza? Isso vai sobrescrever as quantidades de todos os itens da lista
                padrão pelo valor original sugerido.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmAndReset}
                  className="flex-1 rounded-xl bg-moss-600 px-3 py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
                >
                  Restaurar quantidades
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="rounded-xl border border-cream-200 px-3 py-2.5 text-sm text-moss-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full rounded-xl border border-moss-300 bg-white px-3 py-2.5 text-sm font-semibold text-moss-700"
            >
              🔄 Restaurar quantidades sugeridas
            </button>
          )}
        </div>

        <button
          onClick={onChangeRole}
          className="rounded-xl border border-cream-200 px-4 py-2 text-sm text-moss-700"
        >
          Trocar identidade ({ROLE_LABEL[role]})
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
