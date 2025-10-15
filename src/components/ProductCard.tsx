import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <li className="group">
      <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <Link href={`products/${product.id}`} aria-label={product.title}>
          <div className="relative aspect-[3/4] bg-neutral-100">
            <img
              src={product.image.src}
              alt={product.image.alt}
              // fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              // priority={false}
            />
            {!product.available && (
              <span className="absolute left-2 bottom-2 rounded bg-neutral-900/90 px-2 py-1 text-xs font-medium text-white">
                Épuisé
              </span>
            )}
          </div>
        </Link>
        <div className="p-3">
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-1">
            <Link href={`products/${product.id}`} className="hover:underline">
              {product.title}
            </Link>
          </h3>
          <div className="mt-1 text-sm text-neutral-700">
            {currency.format(product.price)} EUR
          </div>
        </div>
      </div>
    </li>
  );
}
