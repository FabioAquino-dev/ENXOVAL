"use client";

import { useMemo, useState } from "react";
import { useEnxoval } from "@/lib/useEnxoval";
import { usePerson } from "@/lib/usePerson";
import { CATEGORIES, CATEGORY_ICON, Category } from "@/lib/types";
import PersonGate from "@/components/PersonGate";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import FilterBar from "@/components/FilterBar";
import CategorySection from "@/components/CategorySection";
import AddItemForm from "@/components/AddItemForm";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const { items, settings, loading, synced, togglePurchased, updateItem, addCustomItem, removeItem, updateSettings } =
    useEnxoval();
  const { person, setPerson } = usePerson();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "Todas">("Todas");
  const [hidePurchased, setHidePurchased] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [forceGate, setForceGate] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (activeCategory !== "Todas" && it.category !== activeCategory) return false;
      if (hidePurchased && it.purchased) return false;
      if (search && !`${it.name} ${it.detail ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [items, activeCategory, hidePurchased, search]);

  if (!person || forceGate) {
    return (
      <PersonGate
        onSelect={(p) => {
          setPerson(p);
          setForceGate(false);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-blue-50/40 pb-24">
      <Header
        babyName={settings.babyName}
        dueDate={settings.dueDate}
        person={person}
        synced={synced}
        onOpenSettings={() => setShowSettings(true)}
      />

      <Dashboard items={items} />

      <FilterBar
        search={search}
        onSearch={setSearch}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        hidePurchased={hidePurchased}
        onHidePurchased={setHidePurchased}
      />

      {loading ? (
        <p className="px-4 py-8 text-center text-sm text-blue-700/60">
          Carregando enxoval...
        </p>
      ) : filtered.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-blue-700/60">
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
              person={person}
              onToggle={(id, purchased) => togglePurchased(id, purchased, person)}
              onUpdate={updateItem}
              onDelete={removeItem}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg active:scale-95"
        aria-label="Adicionar item"
      >
        +
      </button>

      {showAdd && (
        <AddItemForm onClose={() => setShowAdd(false)} onAdd={addCustomItem} />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          person={person}
          onClose={() => setShowSettings(false)}
          onSave={updateSettings}
          onChangePerson={() => {
            setShowSettings(false);
            setForceGate(true);
          }}
        />
      )}
    </div>
  );
}
