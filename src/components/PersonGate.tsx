"use client";

import { Person } from "@/lib/types";

export default function PersonGate({
  onSelect,
}: {
  onSelect: (p: Person) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mb-2 text-4xl">👶</div>
        <h1 className="mb-1 text-lg font-bold text-blue-950">
          Enxoval do nosso menino
        </h1>
        <p className="mb-6 text-sm text-blue-700/70">
          Quem é você? Isso ajuda a saber quem marcou ou comprou cada item.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect("papai")}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            👨 Sou o Papai
          </button>
          <button
            onClick={() => onSelect("mamae")}
            className="rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 active:scale-[0.98]"
          >
            👩 Sou a Mamãe
          </button>
        </div>
      </div>
    </div>
  );
}
