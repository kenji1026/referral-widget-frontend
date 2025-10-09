"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Product, ProductVariant } from "@/types";
import { products } from "@/lib/products";
import { GiftIcon } from "lucide-react";
import ReferralWidget from "../../../../referral-widget";

type ProductDetailsProps = {
  product: Product;
};

function formatPrice(amountMinor: number, currency: string) {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function classNames(...arr: Array<string | false | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

  return (
    <section aria-label="Product media gallery" className="relative">
      {/* Desktop: stacked grid; Mobile: slider */}
      <div className="hidden">
        {images.map((src, idx) => (
          <div
            key={src}
            className="relative w-full overflow-hidden rounded-lg bg-neutral-100"
          >
            <img
              src={src}
              alt={`${title} image ${idx + 1}`}
              className="h-auto w-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 605px, 100vw"
            />
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="relative overflow-hidden rounded-lg bg-neutral-100">
          <img
            src={images[current]}
            alt={`${title} image ${current + 1}`}
            className="h-auto w-full object-cover"
            loading="eager"
            sizes="100vw"
          />
        </div>

        <div className="mt-3 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Previous image"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]"
            onClick={goPrev}
          >
            Prev
          </button>
          <div className="text-sm text-neutral-600">
            {current + 1} / {total}
          </div>
          <button
            type="button"
            aria-label="Next image"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]"
            onClick={goNext}
          >
            Next
          </button>
        </div>

        {/* Thumbnails */}
        <div className="mt-3 flex justify-center gap-2 overflow-x-auto md:overflow-visible">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={classNames(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                current === idx ? "border-neutral-900" : "border-neutral-200"
              )}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 block text-sm font-medium text-neutral-800">
        Taille
      </legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          return (
            <label key={v.id} className="cursor-pointer">
              <input
                type="radio"
                name="size"
                className="peer sr-only"
                value={v.id}
                checked={isSelected}
                onChange={() => onSelect(v.id)}
                aria-checked={isSelected}
                aria-label={`Size ${v.title}${
                  v.available ? "" : " (sold out)"
                }`}
              />
              <span
                className={classNames(
                  "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm",
                  v.available
                    ? "text-neutral-900"
                    : "text-neutral-400 line-through",
                  isSelected
                    ? "border-neutral-900"
                    : "border-neutral-300 hover:border-neutral-500"
                )}
              >
                {v.title}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function QuantityInput({
  quantity,
  setQuantity,
  title,
}: {
  quantity: number;
  setQuantity: (n: number) => void;
  title: string;
}) {
  const dec = () => setQuantity(Math.max(1, quantity - 1));
  const inc = () => setQuantity(quantity + 1);

  return (
    <div className="mt-6">
      <label
        htmlFor="quantity"
        className="mb-2 block text-sm font-medium text-neutral-800"
      >
        Quantité
      </label>
      <div className="inline-flex items-stretch overflow-hidden rounded-md border border-neutral-300">
        <button
          type="button"
          onClick={dec}
          className="px-3 py-2 text-neutral-700 hover:bg-neutral-50"
          aria-label={`Reduce quantity of ${title}`}
        >
          −
        </button>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value) || 1))
          }
          className="w-16 appearance-none border-x border-neutral-300 text-center outline-none"
        />
        <button
          type="button"
          onClick={inc}
          className="px-3 py-2 text-neutral-700 hover:bg-neutral-50"
          aria-label={`Increase quantity of ${title}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // ignore cancel
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback noop
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]"
      >
        Share
      </button>
      <span
        role="status"
        aria-live="polite"
        className={classNames(
          "ml-2 text-sm text-emerald-600 transition-opacity",
          copied ? "opacity-100" : "opacity-0"
        )}
      >
        Copied!
      </span>
    </div>
  );
}

function AccordionSection({ title, html }: { title: string; html?: string }) {
  if (!html) return null;
  return (
    <details className="rounded-lg border border-neutral-200 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-medium text-neutral-900">
        <span>{title}</span>
        <svg
          className="h-4 w-4 flex-none text-neutral-500"
          viewBox="0 0 10 6"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
            fill="currentColor"
          />
        </svg>
      </summary>
      <div
        className="mt-3 prose prose-sm max-w-none text-neutral-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </details>
  );
}

export default function ProductDetails() {
  const params = useParams();

  const [refCode, setRefCode] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetRefCode, setWidgetRefCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  useEffect(() => {
    const idRaw = params.id || 0;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw || "0";
    setProduct(products.find((v) => v.id === id) || null);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setRefCode(ref);
      }
    }
  }, []);

  const selectedVariant = useMemo(
    () =>
      product?.variants?.find((v) => v.id === selectedVariantId) ??
      product?.variants[0],
    [product?.variants, selectedVariantId]
  );

  const isSoldOut = !selectedVariant?.available;

  function onAddToCart() {
    // Replace with your cart API call when available.
    // Example:
    // await addToCart({ variantId: selectedVariant.id, quantity });
    console.log("Add to cart", {
      variantId: selectedVariant?.id,
      quantity,
    });
    // alert("Added to cart (demo)");
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top Referral Banner */}
      {refCode && (
        <button
          className="w-full bg-[#528800] hover:bg-[#538502] text-white text-center py-2 font-semibold text-lg shadow-sm cursor-pointer focus:outline-none"
          onClick={() => {
            setWidgetRefCode(refCode);
            setShowWidget(true);
          }}
          aria-label="Claim your 10% off"
        >
          Claim your 10% off
        </button>
      )}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!product && (
            <h1 className="text-2xl text-gray-500 font-bold mb-4 text-center">
              Loading ...
            </h1>
          )}
          {product && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 py-6">
              <div>
                <ProductGallery images={product.images} title={product.title} />
              </div>

              <div className="lg:sticky lg:top-24">
                <p className="text-sm text-neutral-500">{product.brand}</p>

                <h1 className="mt-1 text-2xl font-semibold text-neutral-900 md:text-3xl">
                  {product.title}
                </h1>

                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl font-semibold text-neutral-900"
                      role="status"
                      aria-live="polite"
                    >
                      {formatPrice(
                        selectedVariant?.price ?? 0,
                        product.currency
                      )}
                    </span>
                    {selectedVariant?.compareAtPrice &&
                    selectedVariant.compareAtPrice >
                      (selectedVariant.price ?? 0) ? (
                      <>
                        <s className="text-neutral-500">
                          {formatPrice(
                            selectedVariant.compareAtPrice,
                            product.currency
                          )}
                        </s>
                        <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                          Vente
                        </span>
                      </>
                    ) : null}
                    {!selectedVariant?.available && (
                      <span className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                        Épuisé
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Taxes incluses.
                  </p>
                </div>

                <VariantSelector
                  variants={product.variants}
                  selectedId={selectedVariantId}
                  onSelect={setSelectedVariantId}
                />

                <QuantityInput
                  quantity={quantity}
                  setQuantity={setQuantity}
                  title={product.title}
                />

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={onAddToCart}
                    disabled={isSoldOut}
                    className={classNames(
                      "inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-base font-medium transition border-2 border-[#c5a48f]",
                      isSoldOut
                        ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                        : " text-[#c5a48f] hover:bg-neutral-200 active:scale-[0.99]"
                    )}
                  >
                    Ajouter au panier
                  </button>

                  {/* Accelerated checkout placeholder */}
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#ffc439] px-4 py-3 text-base font-medium text-neutral-800 hover:bg-amber-400 active:scale-[0.99]"
                  >
                    <span className="space-x-2">Buy it now</span>
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxcHgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMDEgMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHhtbG5zPSJodHRwOiYjeDJGOyYjeDJGO3d3dy53My5vcmcmI3gyRjsyMDAwJiN4MkY7c3ZnIj48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDEyLjIzNyAyLjggTCA0LjQzNyAyLjggQyAzLjkzNyAyLjggMy40MzcgMy4yIDMuMzM3IDMuNyBMIDAuMjM3IDIzLjcgQyAwLjEzNyAyNC4xIDAuNDM3IDI0LjQgMC44MzcgMjQuNCBMIDQuNTM3IDI0LjQgQyA1LjAzNyAyNC40IDUuNTM3IDI0IDUuNjM3IDIzLjUgTCA2LjQzNyAxOC4xIEMgNi41MzcgMTcuNiA2LjkzNyAxNy4yIDcuNTM3IDE3LjIgTCAxMC4wMzcgMTcuMiBDIDE1LjEzNyAxNy4yIDE4LjEzNyAxNC43IDE4LjkzNyA5LjggQyAxOS4yMzcgNy43IDE4LjkzNyA2IDE3LjkzNyA0LjggQyAxNi44MzcgMy41IDE0LjgzNyAyLjggMTIuMjM3IDIuOCBaIE0gMTMuMTM3IDEwLjEgQyAxMi43MzcgMTIuOSAxMC41MzcgMTIuOSA4LjUzNyAxMi45IEwgNy4zMzcgMTIuOSBMIDguMTM3IDcuNyBDIDguMTM3IDcuNCA4LjQzNyA3LjIgOC43MzcgNy4yIEwgOS4yMzcgNy4yIEMgMTAuNjM3IDcuMiAxMS45MzcgNy4yIDEyLjYzNyA4IEMgMTMuMTM3IDguNCAxMy4zMzcgOS4xIDEzLjEzNyAxMC4xIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDM1LjQzNyAxMCBMIDMxLjczNyAxMCBDIDMxLjQzNyAxMCAzMS4xMzcgMTAuMiAzMS4xMzcgMTAuNSBMIDMwLjkzNyAxMS41IEwgMzAuNjM3IDExLjEgQyAyOS44MzcgOS45IDI4LjAzNyA5LjUgMjYuMjM3IDkuNSBDIDIyLjEzNyA5LjUgMTguNjM3IDEyLjYgMTcuOTM3IDE3IEMgMTcuNTM3IDE5LjIgMTguMDM3IDIxLjMgMTkuMzM3IDIyLjcgQyAyMC40MzcgMjQgMjIuMTM3IDI0LjYgMjQuMDM3IDI0LjYgQyAyNy4zMzcgMjQuNiAyOS4yMzcgMjIuNSAyOS4yMzcgMjIuNSBMIDI5LjAzNyAyMy41IEMgMjguOTM3IDIzLjkgMjkuMjM3IDI0LjMgMjkuNjM3IDI0LjMgTCAzMy4wMzcgMjQuMyBDIDMzLjUzNyAyNC4zIDM0LjAzNyAyMy45IDM0LjEzNyAyMy40IEwgMzYuMTM3IDEwLjYgQyAzNi4yMzcgMTAuNCAzNS44MzcgMTAgMzUuNDM3IDEwIFogTSAzMC4zMzcgMTcuMiBDIDI5LjkzNyAxOS4zIDI4LjMzNyAyMC44IDI2LjEzNyAyMC44IEMgMjUuMDM3IDIwLjggMjQuMjM3IDIwLjUgMjMuNjM3IDE5LjggQyAyMy4wMzcgMTkuMSAyMi44MzcgMTguMiAyMy4wMzcgMTcuMiBDIDIzLjMzNyAxNS4xIDI1LjEzNyAxMy42IDI3LjIzNyAxMy42IEMgMjguMzM3IDEzLjYgMjkuMTM3IDE0IDI5LjczNyAxNC42IEMgMzAuMjM3IDE1LjMgMzAuNDM3IDE2LjIgMzAuMzM3IDE3LjIgWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDMwODciIGQ9Ik0gNTUuMzM3IDEwIEwgNTEuNjM3IDEwIEMgNTEuMjM3IDEwIDUwLjkzNyAxMC4yIDUwLjczNyAxMC41IEwgNDUuNTM3IDE4LjEgTCA0My4zMzcgMTAuOCBDIDQzLjIzNyAxMC4zIDQyLjczNyAxMCA0Mi4zMzcgMTAgTCAzOC42MzcgMTAgQyAzOC4yMzcgMTAgMzcuODM3IDEwLjQgMzguMDM3IDEwLjkgTCA0Mi4xMzcgMjMgTCAzOC4yMzcgMjguNCBDIDM3LjkzNyAyOC44IDM4LjIzNyAyOS40IDM4LjczNyAyOS40IEwgNDIuNDM3IDI5LjQgQyA0Mi44MzcgMjkuNCA0My4xMzcgMjkuMiA0My4zMzcgMjguOSBMIDU1LjgzNyAxMC45IEMgNTYuMTM3IDEwLjYgNTUuODM3IDEwIDU1LjMzNyAxMCBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA2Ny43MzcgMi44IEwgNTkuOTM3IDIuOCBDIDU5LjQzNyAyLjggNTguOTM3IDMuMiA1OC44MzcgMy43IEwgNTUuNzM3IDIzLjYgQyA1NS42MzcgMjQgNTUuOTM3IDI0LjMgNTYuMzM3IDI0LjMgTCA2MC4zMzcgMjQuMyBDIDYwLjczNyAyNC4zIDYxLjAzNyAyNCA2MS4wMzcgMjMuNyBMIDYxLjkzNyAxOCBDIDYyLjAzNyAxNy41IDYyLjQzNyAxNy4xIDYzLjAzNyAxNy4xIEwgNjUuNTM3IDE3LjEgQyA3MC42MzcgMTcuMSA3My42MzcgMTQuNiA3NC40MzcgOS43IEMgNzQuNzM3IDcuNiA3NC40MzcgNS45IDczLjQzNyA0LjcgQyA3Mi4yMzcgMy41IDcwLjMzNyAyLjggNjcuNzM3IDIuOCBaIE0gNjguNjM3IDEwLjEgQyA2OC4yMzcgMTIuOSA2Ni4wMzcgMTIuOSA2NC4wMzcgMTIuOSBMIDYyLjgzNyAxMi45IEwgNjMuNjM3IDcuNyBDIDYzLjYzNyA3LjQgNjMuOTM3IDcuMiA2NC4yMzcgNy4yIEwgNjQuNzM3IDcuMiBDIDY2LjEzNyA3LjIgNjcuNDM3IDcuMiA2OC4xMzcgOCBDIDY4LjYzNyA4LjQgNjguNzM3IDkuMSA2OC42MzcgMTAuMSBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5MC45MzcgMTAgTCA4Ny4yMzcgMTAgQyA4Ni45MzcgMTAgODYuNjM3IDEwLjIgODYuNjM3IDEwLjUgTCA4Ni40MzcgMTEuNSBMIDg2LjEzNyAxMS4xIEMgODUuMzM3IDkuOSA4My41MzcgOS41IDgxLjczNyA5LjUgQyA3Ny42MzcgOS41IDc0LjEzNyAxMi42IDczLjQzNyAxNyBDIDczLjAzNyAxOS4yIDczLjUzNyAyMS4zIDc0LjgzNyAyMi43IEMgNzUuOTM3IDI0IDc3LjYzNyAyNC42IDc5LjUzNyAyNC42IEMgODIuODM3IDI0LjYgODQuNzM3IDIyLjUgODQuNzM3IDIyLjUgTCA4NC41MzcgMjMuNSBDIDg0LjQzNyAyMy45IDg0LjczNyAyNC4zIDg1LjEzNyAyNC4zIEwgODguNTM3IDI0LjMgQyA4OS4wMzcgMjQuMyA4OS41MzcgMjMuOSA4OS42MzcgMjMuNCBMIDkxLjYzNyAxMC42IEMgOTEuNjM3IDEwLjQgOTEuMzM3IDEwIDkwLjkzNyAxMCBaIE0gODUuNzM3IDE3LjIgQyA4NS4zMzcgMTkuMyA4My43MzcgMjAuOCA4MS41MzcgMjAuOCBDIDgwLjQzNyAyMC44IDc5LjYzNyAyMC41IDc5LjAzNyAxOS44IEMgNzguNDM3IDE5LjEgNzguMjM3IDE4LjIgNzguNDM3IDE3LjIgQyA3OC43MzcgMTUuMSA4MC41MzcgMTMuNiA4Mi42MzcgMTMuNiBDIDgzLjczNyAxMy42IDg0LjUzNyAxNCA4NS4xMzcgMTQuNiBDIDg1LjczNyAxNS4zIDg1LjkzNyAxNi4yIDg1LjczNyAxNy4yIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDA5Y2RlIiBkPSJNIDk1LjMzNyAzLjMgTCA5Mi4xMzcgMjMuNiBDIDkyLjAzNyAyNCA5Mi4zMzcgMjQuMyA5Mi43MzcgMjQuMyBMIDk1LjkzNyAyNC4zIEMgOTYuNDM3IDI0LjMgOTYuOTM3IDIzLjkgOTcuMDM3IDIzLjQgTCAxMDAuMjM3IDMuNSBDIDEwMC4zMzcgMy4xIDEwMC4wMzcgMi44IDk5LjYzNyAyLjggTCA5Ni4wMzcgMi44IEMgOTUuNjM3IDIuOCA5NS40MzcgMyA5NS4zMzcgMy4zIFoiPjwvcGF0aD48L3N2Zz4"
                      data-v-05318f48=""
                      alt=""
                      role="presentation"
                      className="paypal-logo paypal-logo-paypal paypal-logo-color-blue"
                    ></img>
                  </button>
                </div>

                <ShareButton url={"product.url"} />

                <div className="mt-8 space-y-4">
                  {product.descriptionHtml ? (
                    <div
                      className="prose prose-sm max-w-none text-neutral-800"
                      dangerouslySetInnerHTML={{
                        __html: product.descriptionHtml,
                      }}
                    />
                  ) : null}

                  <AccordionSection
                    title="Materials"
                    html={product.materials}
                  />
                  <AccordionSection
                    title="Dimensions"
                    html={product.dimensions}
                  />
                  <AccordionSection
                    title="Care information"
                    html={product.care}
                  />

                  {/* <a
                    href={"product.url"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline underline-offset-4 hover:opacity-80"
                  >
                    Afficher tous les détails
                    <svg
                      viewBox="0 0 14 10"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                        fill="currentColor"
                      />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating CTA */}
      <button
        className="fixed z-30 bottom-30 right-10 flex items-center gap-2 bg-[#528800] hover:bg-[#416a01] text-white font-semibold px-5 py-5 rounded-full shadow-lg transition-all text-base sm:text-lg focus:outline-none"
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
        onClick={() => {
          setWidgetRefCode(null);
          setShowWidget(true);
        }}
        aria-label="Earn While You Shop"
      >
        <GiftIcon size={42} />
        <span className="sm:inline">
          Claim Your Gift <br />
          €35.00 EUR
        </span>
      </button>
      <ReferralWidget
        open={showWidget}
        onClose={() => setShowWidget(false)}
        refCode={widgetRefCode}
        siteUrl={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/products/${product?.id}`}
        apiUrl={
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"
        }
        brand="celeste"
        product={{ id: product?.id || "", name: product?.title || "" }}
      />
    </div>
  );
}
