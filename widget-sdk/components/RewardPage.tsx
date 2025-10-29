import React, { useEffect, useState } from "react";
import { getWidgetConfig } from "../config";
import { checkReferral, registReferral } from "../utils/api/referral";

interface RewardPageProps {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const AnimatedCheckmark = () => (
  <div className="flex flex-col items-center justify-center my-8">
    <svg
      className="w-20 h-20 text-green-500 animate-pop"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      viewBox="0 0 48 48"
    >
      <circle
        className="stroke-current text-green-200"
        cx="24"
        cy="24"
        r="22"
        strokeWidth="4"
        fill="white"
      />
      <path
        className="stroke-current text-green-500"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M14 26l7 7 13-13"
      />
    </svg>
    <style>{`
      .animate-pop {
        animation: pop 0.5s cubic-bezier(.36,1.56,.64,1) both;
      }
      @keyframes pop {
        0% { transform: scale(0.5); opacity: 0; }
        80% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
      }
    `}</style>
  </div>
);

const RewardPage: React.FC<RewardPageProps> = ({
  onNext,
  onBack,
  showBack,
}) => {
  const [registered, setRegistered] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const ret = await checkReferral();
      if (isMounted) {
        setRegistered(ret.registered);

        if (ret.registered) {
          setError("The referral has already been registered.");
          setShowCheck(true);
          setTimeout(() => {
            setShowCheck(false);
            onNext();
          }, 1500);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await registReferral();

      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
        onNext();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "InvalidStateError") {
          setError(err.message);
        }
      } else {
        setError("Failed to refer product");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get product info from widget config
  const { product } = getWidgetConfig();
  console.log({ registered });
  return (
    <div className="flex flex-col items-center relative w-full px-2 sm:px-0 mt-8">
      {showBack && onBack && (
        <button
          className="absolute left-0 top-0 text-blue-600 hover:underline text-sm"
          onClick={handleConfirm}
        >
          &larr; Back
        </button>
      )}
      <h3 className="text-lg sm:text-xl text-gray-700 font-semibold mb-6 text-center">
        10% off awarded
      </h3>
      {/* Product Card */}
      {product && (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto flex flex-col items-center overflow-hidden mb-8">
          <div className="w-full h-40 bg-pink-100 overflow-hidden">
            {" "}
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="max-w-xl w-full text-center mt-4">
            <h3 className="text-lg sm:text-xl text-gray-700 font-bold mb-4">
              {product.name}
            </h3>
          </div>
          {product.price !== undefined && (
            <div className="text-green-600 font-bold text-sm mb-4">
              ${product.price.toFixed(2)}
            </div>
          )}
          {product.description && (
            <div className="text-gray-500 text-xs text-center mb-4">
              {product.description}
            </div>
          )}
        </div>
      )}
      {showCheck ? (
        <AnimatedCheckmark />
      ) : (
        !registered && (
          <button
            className="px-6 py-3 rounded-3xl bg-green-600 text-white font-semibold text-base w-full shadow hover:bg-green-700 transition disabled:opacity-60"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirmation"}
          </button>
        )
      )}
      {error && (
        <div className="text-red-500 text-xs mb-2 text-center mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default RewardPage;
