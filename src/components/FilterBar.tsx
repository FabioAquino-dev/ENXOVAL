"use client";

import { CATEGORIES, CATEGORY_ICON, Category, Role } from "@/lib/types";

export default function FilterBar({
  search,
  onSearch,
  activeCategory,
  onCategory,
  hidePurchased,
  onHidePurchased,
  role,
}: {
  search: string;
  onSearch: (v: string) => void;
  activeCategory: Category | "Todas";
  onCategory: (c: Category | "Todas") => void;
  hidePurchased: boolean;
  onHidePurchased: (v: boolean) => void;
  role: Role;
}) {
  return (
    <div className="px-4 py-2">
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar item..."
        className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm"
      />
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip
          label="Todas"
          active={activeCategory === "Todas"}
          onClick={() => onCategory("Todas")}
        />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={`${CATEGORY_ICON[c]} ${c}`}
            active={activeCategory === c}
            onClick={() => onCategory(c)}
          />
        ))}
      </div>
      <label className="mt-1 flex items-center gap-2 text-xs text-blue-800/90">
        <input
          type="checkbox"
          checked={hidePurchased}
          onChange={(e) => onHidePurchased(e.target.checked)}
          className="accent-blue-600"
        />
        {role === "convidado" ? "Ocultar itens já garantidos" : "Ocultar itens já comprados"}
      </label>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white text-blue-700 border border-blue-200"
      }`}
    >
      {label}
    </button>
  );
}
