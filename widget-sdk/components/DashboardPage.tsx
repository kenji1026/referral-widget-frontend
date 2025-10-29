import React, { useEffect, useState } from "react";
import { getWidgetConfig } from "../config";
import { dashboardApi } from "../utils/api";
import { Activity } from "../types";
import ShareDropdown from "./ShareDropdown";

interface DashboardPageProps {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  onNext,
  onBack,
  showBack,
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const { siteUrl, ownerRefCode } = getWidgetConfig();

  const referralUrl = `${siteUrl}/?ref=${encodeURIComponent(ownerRefCode)}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    dashboardApi
      .fetchDashboardInfo()
      .then((data) => {
        if (isMounted) setDashboardData(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load dashboard info");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const getLastSeen = (date: string | Date) => {
    const now = new Date();
    const last = typeof date === "string" ? new Date(date) : date;
    const diffMs = now.getTime() - last.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "Just Now";
    }
    if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-6 pb-8 px-2 sm:px-0 gap-y-4">
      <h3 className="text-xl font-semibold text-gray-700 text-center mb-1">
        Earnings Dashboard
      </h3>
      <p className="mb-2 text-gray-600 text-center">
        Track your referral rewards
      </p>
      {loading && (
        <div className="w-full text-center text-gray-500 py-8">Loading...</div>
      )}
      {error && (
        <div className="w-full text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && dashboardData && (
        <>
          {/* Earnings Card */}
          <div className="w-full bg-green-500 rounded-xl shadow flex flex-col items-center px-4 py-5 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white mb-2">
              <span className="text-green-500 text-2xl font-bold">$</span>
            </div>
            <div className="text-white text-sm font-medium mb-1">
              Total Earnings
            </div>
            <div className="text-white text-3xl font-bold mb-1">
              ${dashboardData.balance?.toFixed(2) ?? "0.00"}
            </div>
            <div className="text-white text-xs mb-1">
              ${dashboardData.earned?.toFixed(2) ?? "0.00"}{" "}
              {"commission earned:"}
            </div>
            <div className="text-white text-xs">
              {dashboardData.lastSeen
                ? `Last seen : ${dashboardData.lastSeen}`
                : ""}
            </div>
          </div>
          {/* Recent Activity */}
          <h4 className="text-lg font-semibold text-gray-700">
            Recent Activity
          </h4>
          <div className="w-full bg-white rounded-xl shadow px-4 py-4 mb-2">
            {dashboardData.activities && dashboardData.activities.length > 0 ? (
              dashboardData.activities.map(
                (activity: Activity, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div>
                      <div className="text-gray-700 text-sm font-semibold">
                        {activity.type}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {activity.product || "-"} : {getLastSeen(activity.date)}
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-semibold">
                      {activity.amount}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-gray-400 text-sm text-center">
                No recent activity
              </div>
            )}
          </div>

          {/* Activity Details Modal */}
          {selectedActivity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-10">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs border-2 border-green-200 mx-auto relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => setSelectedActivity(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h5 className="text-lg text-gray-600 font-bold mb-4 text-center">
                  Activity Details
                </h5>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Type: </span>
                  <span className="text-gray-800">{selectedActivity.type}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Product: </span>
                  <span className="text-gray-800">
                    {selectedActivity.product}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Earned: </span>
                  <span className="text-green-600">
                    {selectedActivity.amount}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Chain: </span>
                  <span className="text-green-600">
                    {selectedActivity.type.startsWith("Bonus")
                      ? "add_whitelist()"
                      : "create_referral()"}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Date: </span>
                  <span className="text-gray-800">
                    {selectedActivity.date || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Controls */}
      <button
        className="w-full py-2 rounded-3xl bg-green-300 hover:bg-green-400 text-white font-semibold"
        onClick={onNext}
      >
        More Activity Logs
      </button>
      <button
        className="w-full py-2 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        onClick={onBack}
      >
        Share Product
      </button>
      <div className="w-full flex flex-col gap-3 mb-2">
        <button className="w-full py-3 rounded-3xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold">
          Withdraw Earnings
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
