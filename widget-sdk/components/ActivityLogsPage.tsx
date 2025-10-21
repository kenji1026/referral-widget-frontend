import React, { useEffect, useState } from "react";
import { fetchReferralEvents } from "../utils/api/referral";
import { Activity } from "../types";

interface ActivityLogsPageProps {
  onBack?: () => void;
  showBack?: boolean;
}

const ActivityLogsPage: React.FC<ActivityLogsPageProps> = ({
  onBack,
  showBack,
}) => {
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
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-6 pb-8 px-2 sm:px-0 gap-y-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-2 text-center mt-6 sm:mt-2">
        Activity Logs
      </h2>
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
        <div className="w-full bg-white rounded-xl shadow px-4 py-4 mb-2">
          {activities.map((activity, idx) => (
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
                  {activity.date || "-"}
                </div>
              </div>
              <span className="text-green-600 text-sm font-semibold">
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg border-2 border-green-200 shadow-lg p-6 w-full max-w-xs mx-auto relative">
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
              <span className="text-gray-800">{selectedActivity.product}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Earned: </span>
              <span className="text-green-600">{selectedActivity.amount}</span>
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
      <button
        className="w-full py-3 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base max-w-md shadow mt-4"
        onClick={onBack}
      >
        Go to Dashboard
      </button>
      {/* </div> */}
    </div>
  );
};

export default ActivityLogsPage;
