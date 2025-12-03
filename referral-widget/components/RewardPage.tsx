import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { PageProps } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";
import { checkReferral, registReferral } from "../api/referral";

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

const RewardPage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
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
            setCurrentPage("dashboard");
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
        setCurrentPage("dashboard");
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

  return (
    <div className="space-y-6">
      <AppHeader
        title="10% off award"
        showBackButton={true}
        onBack={() => setCurrentPage("dashboard")}
        onClose={onClose}
      />
      <section className="text-center space-y-4 mb-10">
        <div className="inline-flex">
          <Gift size={72} className="text-[#88e2bb]" />
        </div>
        {/* <h2 className="text-2xl font-bold text-gray-800">
          Claim your 10% Off!
        </h2> */}
        <p className="text-lg text-black">
          Claim your 10% off and
          <br /> start earning
        </p>
      </section>

      <section className="text-center space-y-4">
        {showCheck ? (
          <AnimatedCheckmark />
        ) : (
          !registered && (
            <button
              className="px-6 py-3 rounded-3xl bg-[#41eb5c] text-gray-800 font-semibold text-base w-full shadow hover:bg-green-400 transition disabled:opacity-60"
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
      </section>
      <AppHooter />
    </div>
  );
};

export default RewardPage;
