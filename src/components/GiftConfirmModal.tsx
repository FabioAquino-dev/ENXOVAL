"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function GiftConfirmModal({
  itemName,
  defaultGuestName,
  onConfirm,
  onClose,
}: {
  itemName: string;
  defaultGuestName?: string;
  onConfirm: (guestName?: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(defaultGuestName ?? "");

  return (
    <Modal title="Confirmar presente" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-blue-900">
          Confirmar que você vai presentear/comprou <strong>{itemName}</strong> para o
          Timóteo?
        </p>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-blue-800/90">
            Nome de quem presenteou (opcional)
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Vovó, Tia Ana"
            className="w-full rounded border border-blue-200 px-3 py-2.5 text-sm"
          />
        </label>
        <button
          onClick={() => onConfirm(name)}
          className="rounded-xl bg-emerald-500 px-4 py-3.5 text-base font-semibold text-white active:scale-[0.98]"
        >
          🎁 Confirmar presente
        </button>
        <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-blue-600">
          Cancelar
        </button>
      </div>
    </Modal>
  );
}
