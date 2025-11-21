import { useState, useEffect } from "react";
import { ChevronRight, Milk } from "lucide-react";
import { PageProps, Activity } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";
import { getWidgetConfig } from "../config";
import { fetchReferralEvents } from "../api/referral";

const ActivityPage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchReferralEvents()
      .then((data) => {
        if (isMounted) setActivities(data.activities || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load activities");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <AppHeader
        title="Activities"
        showBackButton={true}
        onBack={() => setCurrentPage("dashboard")}
        onClose={onClose}
      />
      <section>
        <h2 className="text-sm font-semibold text-black text-center">
          tracking your activities
        </h2>
      </section>

      {loading && (
        <div className="w-full text-center text-gray-500 py-8">Loading...</div>
      )}
      {error && (
        <div className="w-full text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && activities.length === 0 && (
        <div className="text-gray-400 text-sm text-center">
          No activity logs
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <>
          <section>
            <div className="mt-2">
              {activities.map((activity: Activity, idx: number) => (
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
                    <p className="font-medium truncate">{activity.type}</p>
                    <p className="text-sm text-gray-500">
                      {/* 1 transaction - {getLastSeen(activity.date)} */}1
                      transaction
                    </p>
                  </div>
                  <p className="text-right text-green-600 font-bold">
                    {activity.amount}
                  </p>
                  <div className="">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-2 border-t-1 border-gray-300"></div>
            </div>
          </section>
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
      <AppHooter />
    </div>
  );
};

export default ActivityPage;
