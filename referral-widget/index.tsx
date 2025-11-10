import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ReferralWidgetProps } from "./types";
import AuthPage from "./components/AuthPage";
import SharePage from "./components/SharePage";
import RewardPage from "./components/RewardPage";
import DashboardPage from "./components/DashboardPage";
import ClaimPage from "./components/ClaimPage";
import ActivityPage from "./components/ActivityPage";
import { setWidgetConfig } from "./config";

const ReferralWidget: React.FC<ReferralWidgetProps> = ({
  refCode,
  siteUrl,
  apiUrl,
  open,
  brand,
  product,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState("auth");

  useEffect(() => {
    if (!open) {
      return;
    }
    setWidgetConfig({ siteUrl, apiUrl, refCode, brand, product });

    setCurrentPage("auth"); // Reset to auth page when opened

    // Optional: prevent background scroll when modal is open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [apiUrl, refCode, brand, product, open]);

  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage setCurrentPage={setCurrentPage} onClose={onClose} />;
      case "reward":
        return <RewardPage setCurrentPage={setCurrentPage} onClose={onClose} />;
      case "share":
        return <SharePage setCurrentPage={setCurrentPage} onClose={onClose} />;
      case "dashboard":
        return (
          <DashboardPage setCurrentPage={setCurrentPage} onClose={onClose} />
        );
      case "activity":
        return (
          <ActivityPage setCurrentPage={setCurrentPage} onClose={onClose} />
        );
      case "claim":
        return <ClaimPage setCurrentPage={setCurrentPage} onClose={onClose} />;
      default:
        return <AuthPage setCurrentPage={setCurrentPage} onClose={onClose} />;
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen flex items-end md:items-center justify-center font-sans bg-black/40">
      <div
        // className="w-full mx-auto max-w-sm px-4 space-y-6 min-w-3 p-4 md:p-6 bg-white shadow-lg rounded-xl my-8"
        className="w-full md:max-w-md bg-white shadow-lg rounded-t-2xl md:rounded-xl px-4 py-4 md:p-6 max-h-[100svh] md:max-h-[calc(100vh-4rem)] overflow-y-auto md:my-8"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
        }}
      >
        {renderPage()}
      </div>
    </div>
    // <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
    //   {/* Sheet/Modal container */}
    //   <div
    //     role="dialog"
    //     aria-modal="true"
    //     className="w-full md:max-w-sm md:my-8 bg-white shadow-lg rounded-t-2xl md:rounded-xl px-4 py-4 md:p-6 space-y-6"
    //     // style={{
    //     //   // Respect safe areas on iOS when used as bottom sheet
    //     //   paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
    //     // }}
    //   >
    //     {renderPage()}
    //   </div>
    // </div>
  );
};

export default ReferralWidget;
