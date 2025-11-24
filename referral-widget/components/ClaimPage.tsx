import { useState, useEffect } from "react";
import { PageProps } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";

const ClaimPage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
  useEffect(() => {}, []);

  const handleStartClaim = async () => {};

  return (
    <div className="space-y-6">
      <AppHeader
        title="Claim Earnings"
        showBackButton={true}
        onBack={() => setCurrentPage("dashboard")}
        onClose={onClose}
      />
      <section className="text-center space-y-4 p-4">
        <p className="text-lg text-black">
          Provide your email to start the
          <br /> withdrawal process of your earnings
        </p>
      </section>

      <section className="text-center space-y-4 p-4">
        <input
          id="username"
          name="username"
          type="text"
          className="px-4 py-2 rounded-xl border border-[#41eb5c] w-full text-base focus:outline-none focus:ring-1 focus:ring-[#41eb5c] text-black mt-2 mb-4"
          placeholder="Enter your email here"
        />
        <button
          onClick={handleStartClaim}
          className="w-full px-6 py-4 bg-[#41eb5c] text-gray-800 rounded-full font-medium shadow-md hover:bg-green-600 transition-colors"
        >
          Submit Email
        </button>
      </section>
      <AppHooter />
    </div>
  );
};

export default ClaimPage;
