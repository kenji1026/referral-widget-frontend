import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">
            Élégance sans effort
          </h1>
          <p className="mt-4 text-gray-600">
            Des silhouettes épurées, des tissus nobles, conçus pour la vie
            moderne.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/collections"
              className="px-6 py-3 rounded-full bg-black text-white hover:bg-black/90"
            >
              Découvrir
            </Link>
            <Link
              href="/collections?tag=nouvelles"
              className="px-6 py-3 rounded-full border border-black hover:bg-black/5"
            >
              Nouveautés
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-soft">
          <img
            src="https://www.celeste-paris.fr/cdn/shop/files/2Y6A5907_-20mo-20mpx.jpg"
            alt="Collection Céleste"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
