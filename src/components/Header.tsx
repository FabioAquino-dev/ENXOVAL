"use client";

import { Role } from "@/lib/types";
import { countdown } from "@/lib/format";

const ROLE_LABEL: Record<Role, string> = {
  papai: "👨 Papai",
  mamae: "👩 Mamãe",
  convidado: "🎁 Convidado",
};

export default function Header({
  dueDate,
  role,
  synced,
  onOpenSettings,
}: {
  dueDate: string;
  role: Role;
  synced: boolean;
  onOpenSettings: () => void;
}) {
  const cd = countdown(dueDate);

  return (
    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-moss-950">🐣 Enxoval do Timóteo Aquino Santos</h1>
          <p className="text-xs text-brown-600">
            {cd.isPast
              ? "O bebê já pode ter chegado! 🎉"
              : `Faltam ~${cd.weeks} semanas (${cd.days} dias) para a data prevista`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${synced ? "bg-moss-600" : "bg-amber-500"}`}
            title={synced ? "Sincronizado" : "Sem sincronização"}
          />
          {role !== "convidado" && (
            <button
              onClick={onOpenSettings}
              className="rounded-full bg-white p-2 text-moss-700 shadow-sm"
              aria-label="Configurações"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
      <div className="mt-1 text-[11px] text-brown-600">Você é {ROLE_LABEL[role]}</div>
    </header>
  );
}
