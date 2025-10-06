"use client";

import { useMemo, useState } from "react";
import Filters, { FiltersState } from "@/components/Filters";
import ProductGrid from "@/components/ProductGrid";
import { products as seed } from "@/lib/products";

const metadata = {
  title: "New collection – Céleste Paris",
  description:
    "Céleste Paris - New collection. Explore comfy body, sweatshirt, pants and more.",
};

export default function Home() {
  const [filters, setFilters] = useState<FiltersState>({
    availability: "all",
    priceMin: undefined,
    priceMax: undefined,
    sort: "featured",
  });

  const counts = useMemo(() => {
    const inStock = seed.filter((p) => p.available).length;
    const outOfStock = seed.length - inStock;
    const maxPrice = Math.max(...seed.map((p) => p.price));
    return { total: seed.length, inStock, outOfStock, maxPrice };
  }, []);

  const filtered = useMemo(() => {
    let list = [...seed];

    // Availability
    if (filters.availability === "in") {
      list = list.filter((p) => p.available);
    } else if (filters.availability === "out") {
      list = list.filter((p) => !p.available);
    }

    // Price range
    if (typeof filters.priceMin === "number") {
      list = list.filter((p) => p.price >= filters.priceMin!);
    }
    if (typeof filters.priceMax === "number") {
      list = list.filter((p) => p.price <= filters.priceMax!);
    }

    // Sort
    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "featured":
      default:
        // keep seed order
        break;
    }

    return list;
  }, [filters]);

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
              New collection
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              <span className="sr-only">Collection: </span>
              Découvrez notre nouvelle sélection de pièces.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
          {/* Top controls for mobile: sort-only quick access */}
          <div className="md:hidden mb-4">
            <div className="flex items-center justify-end">
              <div className="text-sm text-neutral-600">
                {filtered.length} produits
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* <Filters value={filters} onChange={setFilters} counts={counts} /> */}

            <div className="flex-1 min-w-0">
              {/* Sorting (desktop visible) */}
              <div className="hidden md:flex items-center justify-between mb-4">
                <div className="text-sm text-neutral-600">
                  {filtered.length} produits
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor="SortBy" className="text-sm text-neutral-700">
                    Trier par:
                  </label>
                  <select
                    id="SortBy"
                    className="rounded-md border border-neutral-300 px-2 py-2 text-sm"
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        sort: e.target.value as typeof f.sort,
                      }))
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

              <div className="relative">
                <ProductGrid products={filtered} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
