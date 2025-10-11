"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
// import { ReferralWidget } from "../../../../widget-sdk";
import ReferralWidget from "../../../../referral-widget";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

export default function ProductDetailPage() {
  const params = useParams();

  const [refCode, setRefCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetRefCode, setWidgetRefCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse referral code from URL
  useEffect(() => {
    const idRaw = params.id || 0;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw || "0";

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setRefCode(ref);
      }
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setProduct(data);
        }
        setLoading(false);
      });
  }, []);

  // if (!loading && !product) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center">
  //       <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
  //       <Link href="/" className="text-blue-600 underline">
  //         Back to Home
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex flex-col items-center py-6 relative">
        <div className="flex items-center gap-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#111" />
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              fill="#fff"
              fontSize="16"
              fontWeight="bold"
              dy=".3em"
            >
              SH
            </text>
          </svg>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            StyleHub
          </span>
        </div>
        <span className="absolute right-4 bottom-0 text-xs text-gray-400 select-none">
          powered by 6degrees
        </span>
      </header>
      {/* Top Referral Banner */}
      {refCode && (
        <button
          className="w-full bg-green-300 text-green-800 text-center py-2 font-medium text-sm shadow-sm cursor-pointer hover:bg-green-200 focus:outline-none"
          onClick={() => {
            setWidgetRefCode(refCode);
            setShowWidget(true);
          }}
          aria-label="Claim your 10% off"
        >
          Claim your 10% off
        </button>
      )}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {loading && (
          <div className="text-center text-xl text-gray-500">Loading...</div>
        )}
        {!loading && !product && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl text-gray-500 font-bold mb-4">
              Product Not Found
            </h1>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-3xl hover:bg-gray-200 text-base font-medium"
            >
              Back to Home
            </Link>
          </div>
        )}
        {!loading && product && (
          <div className="max-w-xl w-full text-center mt-8">
            <h3 className="text-2xl sm:text-4xl text-gray-700 font-bold mb-4">
              {product.name}
            </h3>
          </div>
        )}
        {!loading && product && (
          <div className="max-w-xl w-full mt-6 flex flex-col items-center">
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto flex flex-col items-center overflow-hidden">
              <div className="w-full h-50 bg-pink-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-full flex flex-col p-6 items-center">
                <div className="text-gray-700 text-base mb-4 text-center">
                  {product.description}
                </div>
                <div className="flex flex-row items-center justify-between w-full gap-x-4">
                  <div className="text-green-600 font-semibold text-2xl">
                    ${product.price}.00
                  </div>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-3xl hover:bg-green-700 text-base font-medium">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Earn While You Shop Card */}
            <div className="w-full max-w-md bg-green-600 rounded-lg shadow flex flex-col items-center p-6 mt-8 mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white mb-3">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path
                    d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-white text-lg font-semibold mb-1 text-center">
                Earn While You Shop
              </div>
              <div className="text-green-100 text-sm mb-4 text-center">
                Get rewarded for sharing products with friends
              </div>
              <button
                className="px-6 py-2 bg-white text-green-600 rounded-3xl font-semibold hover:bg-green-50 transition"
                onClick={() => {
                  setWidgetRefCode(null);
                  setShowWidget(true);
                }}
              >
                Start Earning
              </button>
            </div>

            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-3xl hover:bg-gray-200 text-base font-medium"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>
      {/* Referral Widget Modal */}
      {/* <ReferralWidget
        open={showWidget}
        onClose={() => setShowWidget(false)}
        refCode={widgetRefCode}
        siteUrl={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/product/${product?.id}`}
        apiUrl={
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"
        }
        brand="StyleHub"
        product={product}
      /> */}
      <ReferralWidget
        open={showWidget}
        onClose={() => setShowWidget(false)}
        refCode={widgetRefCode}
        siteUrl={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/product/${product?.id}`}
        apiUrl={
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"
        }
        brand="StyleHub"
        product={product}
      />
      {/* Standard Page Footer */}
      <footer className="w-full bg-gray-100 py-6 mt-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Home
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link
            href="/developer-reference"
            className="text-blue-600 hover:underline font-medium"
          >
            Developer Reference
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>
            &copy; {new Date().getFullYear()} StyleHub. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
