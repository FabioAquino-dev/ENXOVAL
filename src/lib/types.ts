export type Size = "RN" | "P" | "M" | "G";

export const SIZES: Size[] = ["RN", "P", "M", "G"];

export type Person = "papai" | "mamae";

/** Who is currently using the app: parent (full access) or guest (gift-only). */
export type Role = Person | "convidado";

export type ItemStatus = "pending" | "purchased" | "gifted";

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
  /** Which sizes (with qty > 0 in `sizes`) have already been bought — lets you buy RN now and P/M/G later. */
  sizesPurchased?: Partial<Record<Size, boolean>>;
  estimatedPrice: number;
  realPrice?: number | null;
  purchased: boolean;
  purchasedBy?: Person | null;
  purchasedAt?: number | null;
  /** True once a guest has marked this item as gifted to the baby. */
  gifted?: boolean;
  giftedByRole?: "convidado" | null;
  giftedByName?: string | null;
  giftedAt?: number | null;
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

export function isSizePurchased(item: LayetteItem, size: Size): boolean {
  return Boolean(item.sizesPurchased?.[size]);
}

/** Quantity actually obtained so far — partial for sized items where only some sizes are bought. */
export function purchasedQty(item: LayetteItem): number {
  if (item.gifted) return totalQty(item);
  if (!item.sizes) return item.purchased ? totalQty(item) : 0;
  return SIZES.reduce((sum, s) => {
    const needed = item.sizes?.[s] ?? 0;
    if (needed <= 0) return sum;
    return sum + (isSizePurchased(item, s) ? needed : 0);
  }, 0);
}

/**
 * What the subtotal should show right now: the real price once you've
 * typed one in, even before the item is checked as purchased — otherwise
 * filling "Preço real" early has no visible effect until you mark it bought.
 */
export function displayTotal(item: LayetteItem): number {
  return totalQty(item) * (item.realPrice ?? item.estimatedPrice);
}

export function realTotal(item: LayetteItem): number {
  if (!item.purchased) return 0;
  const price = item.realPrice ?? item.estimatedPrice;
  return totalQty(item) * price;
}

/**
 * Derived rather than stored: `gifted` and `purchased` are mutually
 * exclusive in the UI, so computing status from them avoids a third
 * field that could drift out of sync.
 */
export function itemStatus(item: LayetteItem): ItemStatus {
  if (item.gifted) return "gifted";
  if (item.purchased) return "purchased";
  return "pending";
}
