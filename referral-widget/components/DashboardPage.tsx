import { useState, useEffect } from "react";
import { ChevronRight, Milk } from "lucide-react";
import { PageProps, Activity } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";
import { getWidgetConfig } from "../config";
import { dashboardApi } from "../api";

const DashboardPage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
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
    <div className="space-y-5">
      <AppHeader
        title="Earnings Dashboard"
        showBackButton={true}
        onBack={() => setCurrentPage("share")}
        onClose={onClose}
      />
      {loading && (
        <div className="w-full text-center text-gray-500 py-8">Loading...</div>
      )}
      {error && (
        <div className="w-full text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && dashboardData && (
        <>
          <section>
            <h2 className="text-sm font-semibold text-black text-center">
              tracking your referral rewards
            </h2>
            <div className="mt-4 bg-[#41eb5c] p-4 rounded-xl text-center space-y-3 shadow-lg">
              <p className="text-sm font-bold text-gray-700">Total Earnings</p>
              <p className="text-5xl font-bold text-gray-800">
                ${dashboardData.balance?.toFixed(2) ?? "0.00"}
              </p>
              <p className="text-sm font-bold text-gray-700">
                ${dashboardData.earned?.toFixed(2) ?? "0.00"}{" "}
                {"commission earned"}
              </p>
              {/* <p className="text-white text-xs">
                {dashboardData.lastSeen
                  ? `Last seen : ${dashboardData.lastSeen}`
                  : ""}
              </p> */}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-800 text-center mb-2">
              Recent Activity
            </h3>
            <div className="flex flex-row pl-3 pr-3">
              <div className="min-w-0 flex-1 font-bold text-gray-800">
                <p>30 day overview</p>
              </div>
              <div className="text-right font-bold text-gray-800">
                <p>Transactions</p>
              </div>
              <div className="">
                <ChevronRight
                  size={28}
                  className="-mr-2"
                  onClick={() => setCurrentPage("activity")}
                />
              </div>
            </div>
            <div className="mt-2">
              {dashboardData.activities &&
              dashboardData.activities.length > 0 ? (
                dashboardData.activities.map(
                  (activity: Activity, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 border-t-1 border-gray-300"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div
                        className={`rounded-full px-3 py-3 ${
                          activity.type === "Bonus commission"
                            ? "bg-[#40c351]"
                            : "bg-[#8ce900]"
                        }`}
                      >
                        <Milk size={14} />
                      </div>
                      <div className="min-w-0 flex-1 ml-3">
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-500">
                          {/* 1 transaction - {getLastSeen(activity.date)} */}1
                          transaction
                        </p>
                      </div>
                      <p className="w-20 text-right text-green-600 font-bold">
                        {activity.amount}
                      </p>
                      <div className="">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-gray-400 text-sm text-center">
                  No recent activity
                </div>
              )}
              <div className="flex items-center justify-between p-2 border-t-1 border-gray-300"></div>
            </div>
          </section>
          {/* Activity Details Modal */}
          {selectedActivity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10">
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
                {/* <div className="mb-2">
                  <span className="font-semibold text-gray-700">Product: </span>
                  <span className="text-gray-800">
                    {selectedActivity.product}
                  </span>
                </div> */}
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
      <button
        className="w-full py-3 rounded-4xl bg-[#41eb5c] hover:bg-green-400 text-gray-800 font-semibold"
        onClick={() => setCurrentPage("share")}
      >
        Share with more friends
      </button>
      <button
        className="w-full py-3 rounded-4xl bg-[#41eb5c] hover:bg-green-400 text-gray-800 font-semibold"
        onClick={() => setCurrentPage("claim")}
      >
        Claim your earnings
      </button>
      <AppHooter />
    </div>
  );
};

export default DashboardPage;
