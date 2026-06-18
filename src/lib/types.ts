export type Size = "RN" | "P" | "M" | "G";

export const SIZES: Size[] = ["RN", "P", "M", "G"];

export type Person = "papai" | "mamae";

export type Category =
  | "Roupas"
  | "Acessórios"
  | "Banho"
  | "Sono e Quarto"
  | "Higiene e Saúde"
  | "Alimentação"
  | "Passeio e Transporte"
  | "Maternidade";

export const CATEGORIES: Category[] = [
  "Roupas",
  "Acessórios",
  "Banho",
  "Sono e Quarto",
  "Higiene e Saúde",
  "Alimentação",
  "Passeio e Transporte",
  "Maternidade",
];

export const CATEGORY_ICON: Record<Category, string> = {
  Roupas: "👕",
  Acessórios: "🧦",
  Banho: "🛁",
  "Sono e Quarto": "🛏️",
  "Higiene e Saúde": "🧴",
  Alimentação: "🍼",
  "Passeio e Transporte": "🚼",
  Maternidade: "🎒",
};

export interface SizeBreakdown {
  RN?: number;
  P?: number;
  M?: number;
  G?: number;
}

export interface LayetteItem {
  id: string;
  category: Category;
  name: string;
  detail?: string;
  unit: string;
  /** Quantity needed for items with no size breakdown */
  qtyNeeded?: number;
  /** Quantity needed broken down by size, for clothing */
  sizes?: SizeBreakdown;
  estimatedPrice: number;
  realPrice?: number | null;
  purchased: boolean;
  purchasedBy?: Person | null;
  purchasedAt?: number | null;
  notes?: string;
  custom?: boolean;
  createdAt?: number;
  order?: number;
}

export interface AppSettings {
  dueDate: string;
  babyName?: string;
  currentWeek?: number;
  currentWeekAsOf?: string;
  budgetGoal?: number;
}

export function totalQty(item: LayetteItem): number {
  if (item.sizes) {
    return SIZES.reduce((sum, s) => sum + (item.sizes?.[s] ?? 0), 0);
  }
  return item.qtyNeeded ?? 1;
}

export function estimatedTotal(item: LayetteItem): number {
  return totalQty(item) * item.estimatedPrice;
}

export function realTotal(item: LayetteItem): number {
  if (!item.purchased) return 0;
  const price = item.realPrice ?? item.estimatedPrice;
  return totalQty(item) * price;
}
