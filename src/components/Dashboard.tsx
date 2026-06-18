"use client";

import { LayetteItem, estimatedTotal, realTotal, totalQty } from "@/lib/types";
import { formatBRL } from "@/lib/format";

export default function Dashboard({ items }: { items: LayetteItem[] }) {
  const totalItems = items.reduce((sum, it) => sum + totalQty(it), 0);
  const purchasedItems = items
    .filter((it) => it.purchased)
    .reduce((sum, it) => sum + totalQty(it), 0);
  const pct = totalItems ? Math.round((purchasedItems / totalItems) * 100) : 0;

  const estimated = items.reduce((sum, it) => sum + estimatedTotal(it), 0);
  const real = items.reduce((sum, it) => sum + realTotal(it), 0);
  const diff = real - items
    .filter((it) => it.purchased)
    .reduce((sum, it) => sum + estimatedTotal(it), 0);

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-3">
      <Card label="Progresso" value={`${pct}%`} sub={`${purchasedItems} de ${totalItems} itens`}>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>
      <Card label="Estimado (mercado)" value={formatBRL(estimated)} sub="total sugerido" />
      <Card label="Gasto real" value={formatBRL(real)} sub="já comprado" />
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
    <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
      <div className="text-xs font-medium text-blue-800/90">{label}</div>
      <div className={`text-xl font-bold text-blue-950 ${accent ?? ""}`}>{value}</div>
      {sub && <div className="text-[11px] text-blue-700/80">{sub}</div>}
      {children}
    </div>
  );
}
