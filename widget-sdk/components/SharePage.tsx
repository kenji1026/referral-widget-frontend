import React from "react";
import { getWidgetConfig } from "../config";
import { ProductInfo } from "../types/ProductInfo";
// If ShareDropDown does not exist, create a placeholder
import ShareDropDown from "./ShareDropdown";

interface SharePageProps {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const SharePage: React.FC<SharePageProps> = ({ onNext, onBack, showBack }) => {
  const { siteUrl, ownerRefCode, product } = getWidgetConfig();

  const referralUrl = `${siteUrl}/?ref=${encodeURIComponent(ownerRefCode)}`;

  return (
    <div className="flex flex-col items-center relative w-full px-2 sm:px-0 py-6 sm:py-5">
      {/* {showBack && onBack && (
        <button
          className="absolute left-0 top-0 text-blue-600 hover:underline text-sm"
          onClick={onBack}
        >
          &larr; Back
        </button>
      )} */}
      <h2 className="text-lg sm:text-2xl text-gray-700 font-bold mb-2 text-center">
        Share & Earn
      </h2>
      <p className="mb-6 text-gray-600 text-center text-base sm:text-lg">
        Share your referral link to earn rewards.
      </p>
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
      {/* Incentive Banner */}
      <div className="w-full bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 text-center text-sm font-medium mb-4">
        Earn $10 per referral – they get 10% off
      </div>
      {/* ShareDropDown */}
      <div className="w-full max-w-md mb-6">
        <ShareDropDown referralUrl={referralUrl} />
      </div>
      {/* Go to Dashboard Button */}
      <button
        className="px-6 py-3 rounded-3xl bg-green-600 text-white font-semibold text-base w-full max-w-md shadow hover:bg-green-700 transition mb-2"
        onClick={onNext}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default SharePage;
