export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function countdown(dueDateStr: string): {
  days: number;
  weeks: number;
  remDays: number;
  isPast: boolean;
} {
  const due = new Date(`${dueDateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = due.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const isPast = days < 0;
  const abs = Math.abs(days);
  return {
    days: abs,
    weeks: Math.floor(abs / 7),
    remDays: abs % 7,
    isPast,
  };
}
