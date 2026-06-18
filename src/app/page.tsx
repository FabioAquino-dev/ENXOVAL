"use client";

import { useEffect, useMemo, useState } from "react";
import { useEnxoval } from "@/lib/useEnxoval";
import { useAccess } from "@/lib/access";
import { CATEGORIES, CATEGORY_ICON, Category } from "@/lib/types";
import AccessGate from "@/components/AccessGate";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import FilterBar from "@/components/FilterBar";
import CategorySection from "@/components/CategorySection";
import AddItemForm from "@/components/AddItemForm";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const { role, guestName, grantAccess, clearAccess } = useAccess();
  const {
    items,
    settings,
    loading,
    synced,
    togglePurchased,
    toggleSizePurchased,
    setAllSizesPurchased,
    updateItem,
    addCustomItem,
    removeItem,
    updateSettings,
    markGifted,
    undoGift,
    resetQuantitiesToDefault,
  } = useEnxoval(role);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "Todas">("Todas");
  const [hidePurchased, setHidePurchased] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [thanksMessage, setThanksMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!thanksMessage) return;
    const t = setTimeout(() => setThanksMessage(null), 4000);
    return () => clearTimeout(t);
  }, [thanksMessage]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (activeCategory !== "Todas" && it.category !== activeCategory) return false;
      if (hidePurchased && (it.purchased || it.gifted)) return false;
      if (search && !`${it.name} ${it.detail ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [items, activeCategory, hidePurchased, search]);

  if (!role) {
    return <AccessGate onComplete={(r, name) => grantAccess(r, name)} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 pb-24">
      <Header
        dueDate={settings.dueDate}
        role={role}
        synced={synced}
        onOpenSettings={() => setShowSettings(true)}
      />

      <Dashboard items={items} role={role} />

      <FilterBar
        search={search}
        onSearch={setSearch}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        hidePurchased={hidePurchased}
        onHidePurchased={setHidePurchased}
        role={role}
      />

      {thanksMessage && (
        <div className="px-4 pb-2">
          <div className="rounded-xl bg-moss-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md">
            {thanksMessage}
          </div>
        </div>
      )}

      {loading ? (
        <p className="px-4 py-8 text-center text-sm text-brown-600">
          Carregando enxoval...
        </p>
      ) : filtered.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-brown-600">
          Nenhum item encontrado.
        </p>
      ) : (
        <div className="flex flex-col">
          {CATEGORIES.map((cat) => (
            <CategorySection
              key={cat}
              category={cat}
              icon={CATEGORY_ICON[cat]}
              items={filtered.filter((it) => it.category === cat)}
              role={role}
              guestName={guestName}
              onToggle={(id, purchased) => {
                const person = role === "convidado" ? null : role;
                const item = items.find((it) => it.id === id);
                if (item?.sizes) {
                  setAllSizesPurchased(id, purchased, person);
                } else {
                  togglePurchased(id, purchased, person);
                }
              }}
              onToggleSize={(id, size, purchased) =>
                toggleSizePurchased(id, size, purchased, role === "convidado" ? null : role)
              }
              onUpdate={updateItem}
              onDelete={removeItem}
              onMarkGifted={markGifted}
              onUndoGift={undoGift}
              onGiftConfirmed={() =>
                setThanksMessage("Obrigado! Esse item foi marcado como presente para o Timóteo. 🎁")
              }
            />
          ))}
        </div>
      )}

      {role !== "convidado" && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-moss-600 text-2xl text-white shadow-lg active:scale-95"
          aria-label="Adicionar item"
        >
          +
        </button>
      )}

      {showAdd && role !== "convidado" && (
        <AddItemForm onClose={() => setShowAdd(false)} onAdd={addCustomItem} />
      )}

      {showSettings && role !== "convidado" && (
        <SettingsPanel
          settings={settings}
          role={role}
          onClose={() => setShowSettings(false)}
          onSave={updateSettings}
          onChangeRole={() => {
            setShowSettings(false);
            clearAccess();
          }}
          onResetQuantities={resetQuantitiesToDefault}
        />
      )}
    </div>
  );
}
