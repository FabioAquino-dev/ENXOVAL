"use client";

import { useState } from "react";
import { Role } from "@/lib/types";
import { isValidAccessCode } from "@/lib/access";

type Step = "role" | "code" | "guestName";

export default function AccessGate({
  onComplete,
}: {
  onComplete: (role: Role, guestName?: string) => void;
}) {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");

  const chooseRole = (r: Role) => {
    setRole(r);
    setError("");
    setCode("");
    setStep("code");
  };

  const confirmCode = () => {
    if (!isValidAccessCode(code)) {
      setError("Código incorreto. Confira com o Papai ou a Mamãe e tente de novo.");
      return;
    }
    if (role === "convidado") {
      setStep("guestName");
      return;
    }
    if (role) onComplete(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-moss-950/80 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mb-2 text-4xl">🐣</div>
        <h1 className="mb-1 text-lg font-bold text-moss-950">Enxoval do Timóteo Aquino Santos</h1>

        {step === "role" && (
          <>
            <p className="mb-1 text-sm text-brown-600">🌾 Lista compartilhada do nosso pequeno</p>
            <p className="mb-6 text-sm text-brown-600">Quem é você?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => chooseRole("papai")}
                className="rounded-xl bg-moss-700 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-moss-800 active:scale-[0.98]"
              >
                👨 Sou Papai
              </button>
              <button
                onClick={() => chooseRole("mamae")}
                className="rounded-xl bg-moss-400 px-4 py-3.5 text-base font-semibold text-moss-950 transition hover:bg-moss-500 active:scale-[0.98]"
              >
                👩 Sou Mamãe
              </button>
              <button
                onClick={() => chooseRole("convidado")}
                className="rounded-xl border-2 border-moss-300 bg-moss-50 px-4 py-3.5 text-base font-semibold text-moss-800 transition hover:bg-moss-100 active:scale-[0.98]"
              >
                🎁 Vou presentear
              </button>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <p className="mb-1 text-sm text-brown-600">
              Digite o código da lista do Timóteo:
            </p>
            <p className="mb-4 text-xs text-brown-500">
              Peça o código para quem te convidou, se não souber.
            </p>
            <input
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && confirmCode()}
              placeholder="Código da lista"
              className="w-full rounded-xl border border-cream-200 px-3 py-3 text-center text-base tracking-wide outline-none focus:border-moss-500"
            />
            {error && (
              <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={confirmCode}
                className="rounded-xl bg-moss-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-moss-700 active:scale-[0.98]"
              >
                Entrar
              </button>
              <button
                onClick={() => setStep("role")}
                className="rounded-xl px-4 py-2 text-sm text-moss-600"
              >
                ← Voltar
              </button>
            </div>
          </>
        )}

        {step === "guestName" && (
          <>
            <p className="mb-1 text-sm text-brown-600">
              Quer dizer quem está presenteando? (opcional)
            </p>
            <p className="mb-4 text-xs text-brown-500">
              Ex: Vovó, Tia Ana — ou deixe em branco.
            </p>
            <input
              autoFocus
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onComplete("convidado", guestName)}
              placeholder="Seu nome (opcional)"
              className="w-full rounded-xl border border-cream-200 px-3 py-3 text-center text-base outline-none focus:border-moss-500"
            />
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => onComplete("convidado", guestName)}
                className="rounded-xl bg-moss-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-moss-700 active:scale-[0.98]"
              >
                🎁 Ver presentes para o Timóteo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
