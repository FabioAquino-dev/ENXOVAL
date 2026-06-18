"use client";

import { LayetteItem, Role, estimatedTotal, realTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";

export default function Dashboard({
  items,
  role,
}: {
  items: LayetteItem[];
  role: Role;
}) {
  if (role === "convidado") {
    const pending = items.filter((it) => !it.purchased && !it.gifted).length;
    const gifted = items.filter((it) => it.gifted).length;
    return (
      <div className="px-4 py-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
          <p className="text-base font-bold text-emerald-900">
            🎁 Escolha um presente para o Timóteo
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            {pending} {pending === 1 ? "item disponível" : "itens disponíveis"}
            {gifted > 0 && ` · ${gifted} já presenteado${gifted === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((sum, it) => sum + totalQty(it), 0);
  const obtainedItems = items
    .filter((it) => it.purchased || it.gifted)
    .reduce((sum, it) => sum + totalQty(it), 0);
  const pct = totalItems ? Math.round((obtainedItems / totalItems) * 100) : 0;

  const estimated = items.reduce((sum, it) => sum + estimatedTotal(it), 0);
  const real = items.reduce((sum, it) => sum + realTotal(it), 0);
  const giftedValue = items
    .filter((it) => it.gifted)
    .reduce((sum, it) => sum + estimatedTotal(it), 0);
  const diff =
    real -
    items.filter((it) => it.purchased).reduce((sum, it) => sum + estimatedTotal(it), 0);

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-3">
      <Card label="Progresso" value={`${pct}%`} sub={`${obtainedItems} de ${totalItems} itens`}>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-moss-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>
      <Card label="Estimado (mercado)" value={formatBRL(estimated)} sub="total sugerido" />
      <Card label="Gasto real" value={formatBRL(real)} sub="já comprado" />
      <Card label="Presenteado" value={formatBRL(giftedValue)} sub="recebido de presente" accent="text-emerald-600" />
      <Card
        label="Diferença"
        value={formatBRL(Math.abs(diff))}
        sub={diff <= 0 ? "abaixo do estimado" : "acima do estimado"}
        accent={diff <= 0 ? "text-emerald-600" : "text-red-600"}
      />
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  accent,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 shadow-sm">
      <div className="text-xs font-medium text-brown-600">{label}</div>
      <div className={`text-xl font-bold text-moss-950 ${accent ?? ""}`}>{value}</div>
      {sub && <div className="text-[11px] text-brown-500">{sub}</div>}
      {children}
    </div>
  );
}
