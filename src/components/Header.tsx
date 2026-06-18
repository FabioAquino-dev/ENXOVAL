"use client";

import { Person } from "@/lib/types";
import { countdown } from "@/lib/format";

export default function Header({
  babyName,
  dueDate,
  person,
  synced,
  onOpenSettings,
}: {
  babyName?: string;
  dueDate: string;
  person: Person | null;
  synced: boolean;
  onOpenSettings: () => void;
}) {
  const cd = countdown(dueDate);

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-blue-50/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-blue-950">
            Enxoval{babyName ? ` do ${babyName}` : " do nosso menino"} 👶
          </h1>
          <p className="text-xs text-blue-800/90">
            {cd.isPast
              ? "O bebê já pode ter chegado! 🎉"
              : `Faltam ~${cd.weeks} semanas (${cd.days} dias) para a data prevista`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${synced ? "bg-emerald-500" : "bg-amber-500"}`}
            title={synced ? "Sincronizado" : "Sem sincronização"}
          />
          <button
            onClick={onOpenSettings}
            className="rounded-full bg-white p-2 text-blue-700 shadow-sm"
            aria-label="Configurações"
          >
            ⚙️
          </button>
        </div>
      </div>
      {person && (
        <div className="mt-1 text-[11px] text-blue-700/80">
          Você é {person === "papai" ? "👨 Papai" : "👩 Mamãe"}
        </div>
      )}
    </header>
  );
}
