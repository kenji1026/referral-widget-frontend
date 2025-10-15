"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="container flex items-center justify-between h-16">
        <button
          className="md:hidden text-sm px-3 py-2 rounded-full hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu
        </button>

        <div className="flex-1 hidden md:flex items-center gap-6">
          <Link href="/collections" className="text-sm hover:opacity-70">
            Boutique
          </Link>
          <Link
            href="/collections?tag=nouvelles"
            className="text-sm hover:opacity-70"
          >
            Nouveautés
          </Link>
          <Link href="/about" className="text-sm hover:opacity-70">
            À propos
          </Link>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Céleste" width={28} height={28} />
          <span className="font-display text-xl tracking-tight">Céleste</span>
        </Link>

        <div className="flex-1 flex items-center justify-end gap-4">
          <Link
            href="/contact"
            className="text-sm hover:opacity-70 hidden md:inline"
          >
            Contact
          </Link>
          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Panier"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white"
        >
          <div className="container py-3 flex flex-col gap-2">
            <Link
              href="/collections"
              onClick={() => setOpen(false)}
              className="py-2"
            >
              Boutique
            </Link>
            <Link
              href="/collections?tag=nouvelles"
              onClick={() => setOpen(false)}
              className="py-2"
            >
              Nouveautés
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="py-2">
              À propos
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-2"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
