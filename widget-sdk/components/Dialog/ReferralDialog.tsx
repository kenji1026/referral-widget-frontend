import React, { useState } from "react";
import AuthPage from "../AuthPage";
import RewardPage from "../RewardPage";
import SharePage from "../SharePage";
import DashboardPage from "../DashboardPage";
import ActivityLogsPage from "../ActivityLogsPage";
import { DialogPage } from "../../types";

interface ReferralDialogProps {
  open: boolean;
  onClose: () => void;
}

const ReferralDialog: React.FC<ReferralDialogProps> = ({ open, onClose }) => {
  const [page, setPage] = useState<DialogPage>("auth");

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-full sm:max-w-md p-2 sm:p-6 relative max-h-screen overflow-y-auto flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl sm:text-xl"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
        {page === "auth" && (
          <AuthPage onNext={() => setPage("reward")} showBack={false} />
        )}
        {page === "reward" && (
          <RewardPage
            onNext={() => setPage("share")}
            onBack={getBack()}
            showBack={showBack}
          />
        )}
        {page === "share" && (
          <SharePage
            onNext={() => setPage("dashboard")}
            onBack={getBack()}
            showBack={showBack}
          />
        )}
        {page === "dashboard" && (
          <DashboardPage
            onNext={() => setPage("activity-logs")}
            onBack={getBack()}
            showBack={showBack}
          />
        )}
        {page === "activity-logs" && (
          <ActivityLogsPage onBack={getBack()} showBack={showBack} />
        )}
      </div>
    </div>
  );
};

export default ReferralDialog;
