"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="w-full bg-[#EFECEC] border-b border-neutral-200">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-32 flex items-center justify-center">
        <button
          type="button"
          aria-label="Open menu"
          className="absolute inset-y-0 left-4 sm:left-6 lg:left-8 md:hidden flex items-center justify-center"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-neutral-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link href="/" className="text-2xl font-serif tracking-tight">
          <Image
            src="https://www.celeste-paris.fr/cdn/shop/files/Celeste_Paris_Valise_Logo_HD_Positif.png?v=1614290596&width=500"
            alt="Céleste"
            width={150}
            height={106}
          />
        </Link>
        <div className="absolute inset-y-0 right-4 sm:right-6 lg:right-8 flex items-center gap-4">
          <Link
            href=""
            aria-label="Search"
            className="text-neutral-700 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.1-4.4a7.5 7.5 0 1 1-15.001 0 7.5 7.5 0 0 1 15.001 0Z"
              />
            </svg>
          </Link>
          <Link
            href=""
            aria-label="Cart"
            className="text-neutral-700 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h1.386c.318 0 .6.2.707.498l.533 1.498M7.5 14.25h8.927a1 1 0 0 0 .966-.741l1.857-6.967a.75.75 0 0 0-.725-.942H6.376M7.5 14.25l-2.124-6.006M7.5 14.25l-.75 2.25h10.5M9 20.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm7.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="hidden md:flex mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 items-center justify-center">
        <nav className="hidden md:flex gap-6 text-sm text-neutral-700">
          <Link className="hover:text-neutral-900" href="/">
            Home
          </Link>
          <Link className="hover:text-neutral-900" href="/">
            Eshop
          </Link>
          <Link className="hover:text-neutral-900" href="/">
            About us
          </Link>
          <Link className="hover:text-neutral-900" href="/">
            Look Book
          </Link>
          <Link className="hover:text-neutral-900" href="/">
            Journal
          </Link>
        </nav>
      </div>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-[#EFECEC] shadow-xl transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
            <button
              type="button"
              aria-label="Close menu"
              className="p-2 text-neutral-700 hover:text-neutral-900"
              onClick={() => setMobileOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-3 text-sm text-neutral-800">
            <Link
              className="hover:text-neutral-900"
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              className="hover:text-neutral-900"
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Eshop
            </Link>
            <Link
              className="hover:text-neutral-900"
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              About us
            </Link>
            <Link
              className="hover:text-neutral-900"
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Look Book
            </Link>
            <Link
              className="hover:text-neutral-900"
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Journal
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}
