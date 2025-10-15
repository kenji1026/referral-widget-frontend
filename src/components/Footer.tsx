import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-[#c5a48f] border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter teaser */}
        {/* <div className="mt-12 border-b border-neutral-200 p-6 mb-12">
          <h2 className="text-xl font-medium text-center">
            Subscribe to our emails
          </h2>
          <p className="mt-1 text-sm text-neutral-600 text-center">
            Subscribe to our mailing list for insider news, product launches,
            and more.
          </p>
          <form className="mt-4 flex w-full max-w-lg mx-auto justify-center">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-l-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
            <button
              type="button"
              className="rounded-r-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Subscribe
            </button>
          </form>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-white">
          <div>
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/pages/about-us" className="hover:text-neutral-900">
                  Notre Histoire
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/mentions-legales"
                  className="hover:text-neutral-900"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/pages/faqs" className="hover:text-neutral-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/livraisons-retours"
                  className="hover:text-neutral-900"
                >
                  Livraisons & Retours
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="hover:text-neutral-900">
                  Une question?
                </Link>
              </li>
              <li>
                <Link href="/pages/cgv" className="hover:text-neutral-900">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 text-white">
            <h2 className="text-lg font-semibold">Subscribe to our emails</h2>
            <form className="mt-4 flex w-full max-w-lg">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-l-md border border-neutral-300 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
              <button
                type="button"
                className="rounded-r-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} Céleste Paris
        </div>
      </div>
    </footer>
  );
}
