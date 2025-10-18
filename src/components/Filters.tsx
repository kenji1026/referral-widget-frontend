"use client";

import { useState } from "react";

export type Availability = "all" | "in" | "out";
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "title-asc"
  | "title-desc";

export type FiltersState = {
  availability: Availability;
  priceMin?: number;
  priceMax?: number;
  sort: SortOption;
};

type Props = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  counts: {
    total: number;
    inStock: number;
    outOfStock: number;
    maxPrice: number;
  };
};

export default function Filters({ value, onChange, counts }: Props) {
  const [openMobile, setOpenMobile] = useState(false);

  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">
          Disponibilité
        </h3>
        <div className="mt-2 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="all"
              checked={value.availability === "all"}
              onChange={() => onChange({ ...value, availability: "all" })}
            />
            <span>Tout ({counts.total})</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="in"
              checked={value.availability === "in"}
              onChange={() => onChange({ ...value, availability: "in" })}
            />
            <span>En stock ({counts.inStock})</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="out"
              checked={value.availability === "out"}
              onChange={() => onChange({ ...value, availability: "out" })}
            />
            <span>Épuisé ({counts.outOfStock})</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900">Prix</h3>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="flex items-center rounded-md border border-neutral-300 px-2 py-1">
            <span className="text-neutral-500 mr-1">€</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              className="w-full outline-none text-sm"
              placeholder="Min"
              value={value.priceMin ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  priceMin:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex items-center rounded-md border border-neutral-300 px-2 py-1">
            <span className="text-neutral-500 mr-1">€</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              className="w-full outline-none text-sm"
              placeholder={String(counts.maxPrice)}
              value={value.priceMax ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  priceMax:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900">Trier par</h3>
        <select
          className="mt-2 w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
          value={value.sort}
          onChange={(e) =>
            onChange({ ...value, sort: e.target.value as SortOption })
          }
        >
          <option value="featured">En vedette</option>
          <option value="price-asc">Prix: faible à élevé</option>
          <option value="price-desc">Prix: élevé à faible</option>
          <option value="title-asc">Alphabétique, de A à Z</option>
          <option value="title-desc">Alphabétique, de Z à A</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 sticky top-20">
          {content}
        </div>
      </aside>

      {/* Mobile */}
      <div className="md:hidden">
        <button
          type="button"
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"
          onClick={() => setOpenMobile(true)}
          aria-expanded={openMobile}
          aria-controls="mobile-filters"
        >
          Filtrer et trier
        </button>

        {openMobile && (
          <div
            id="mobile-filters"
            className="fixed inset-0 z-40 bg-black/40"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpenMobile(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">Filtrer et trier</h2>
                  <button
                    type="button"
                    className="text-sm text-neutral-600"
                    onClick={() => setOpenMobile(false)}
                  >
                    Fermer
                  </button>
                </div>
                {content}
                <button
                  type="button"
                  className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                  onClick={() => setOpenMobile(false)}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
