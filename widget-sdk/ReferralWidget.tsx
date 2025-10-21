import React, { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage";
import RewardPage from "./components/RewardPage";
import SharePage from "./components/SharePage";
import DashboardPage from "./components/DashboardPage";
import ActivityLogsPage from "./components/ActivityLogsPage";
import { setWidgetConfig } from "./config";
import { DialogPage } from "./types";
import { ProductInfo } from "./types/ProductInfo";

export interface ReferralWidgetProps {
  refCode: string | null;
  siteUrl: string;
  apiUrl: string;
  open: boolean;
  brand: string;
  product: ProductInfo | null;
  onClose: () => void;
}

const ReferralWidget: React.FC<ReferralWidgetProps> = ({
  refCode,
  siteUrl,
  apiUrl,
  open,
  brand,
  product,
  onClose,
}) => {
  const [page, setPage] = useState<DialogPage>("auth");
  const headLine = refCode
    ? "Claim your 10% off and start earning!"
    : "Authenticate and get $1 credit";

  useEffect(() => {
    setWidgetConfig({ siteUrl, apiUrl, refCode, brand, product });
    if (open) setPage("auth"); // Reset to auth page when opened
  }, [apiUrl, refCode, brand, product, open]);

  // console.log({ open });

  if (!open) {
    return null;
  }

  // Back navigation logic
  const getBack = () => {
    switch (page) {
      case "reward":
        return () => setPage("auth");
      case "share":
        return () => setPage("reward");
      case "dashboard":
        return () => setPage("share");
      case "activity-logs":
        return () => setPage("dashboard");
      default:
        return undefined;
    }
  };
  const showBack = page !== "auth";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full h-full sm:w-[360px] sm:h-[600px] max-h-screen p-2 sm:p-6 relative overflow-y-auto flex flex-col">
        <button
          className="z-10 absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl sm:text-xl"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
        {page === "auth" && (
          <AuthPage
            headline={headLine}
            onNext={() => (refCode ? setPage("reward") : setPage("share"))}
            showBack={false}
          />
        )}
        {page === "reward" && (
          <RewardPage
            onNext={() => setPage("dashboard")}
            onBack={getBack()}
            showBack={false}
          />
        )}
        {page === "share" && (
          <SharePage
            onNext={() => setPage("dashboard")}
            onBack={getBack()}
            showBack={false}
          />
        )}
        {page === "dashboard" && (
          <DashboardPage
            onNext={() => setPage("activity-logs")}
            onBack={getBack()}
            showBack={false}
          />
        )}
        {page === "activity-logs" && (
          <ActivityLogsPage onBack={getBack()} showBack={showBack} />
        )}
      </div>
    </div>
  );
};

export default ReferralWidget;
