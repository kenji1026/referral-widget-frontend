import { useState, useEffect } from "react";
import { Share2, Link, Mail } from "lucide-react";
import { PageProps } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";
import { getWidgetConfig } from "../config";
import { dashboardApi } from "../api";

const SharePage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
  const { siteUrl, ownerRefCode, product } = getWidgetConfig();
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const referralUrl = `${siteUrl}/?ref=${encodeURIComponent(ownerRefCode)}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    dashboardApi
      .fetchDashboardInfo()
      .then((data) => {
        if (isMounted) setWalletBalance(data.balance?.toFixed(2) ?? "0.00");
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

  function showToast(message: string, duration = 1500) {
    setToast({ visible: true, message });
    window.setTimeout(
      () => setToast({ visible: false, message: "" }),
      duration
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      showToast("Link copied!");
    } catch (e) {}
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Check this out! Use my referral link: ${referralUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="relative space-y-6">
      {/* Top-center toast within the widget */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 transition-opacity duration-200 ${
          toast.visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast.visible && (
          <div className="pointer-events-auto rounded-full bg-black/85 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {toast.message}
          </div>
        )}
      </div>
      <AppHeader
        title="Share and Earn"
        showBackButton={true}
        onBack={() => setCurrentPage("home")}
        onClose={onClose}
      />
      <section>
        <div className="mt-4 bg-[#41eb5c] p-6 rounded-xl text-center space-y-4 shadow-lg">
          <p className="text-sm text-gray-700">Wallet Balance</p>
          <p className="text-5xl text-gray-800 font-bold mb-2">
            ${walletBalance}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-600 text-center mt-10">
          Share
        </h3>
        <div className="w-full flex flex-row justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center">
            <button
              className="rounded-full px-5 py-5 bg-[#40c351] hover:bg-green-600 transition-colors"
              onClick={handleWhatsApp}
            >
              <svg
                fill="white"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 30.667 30.667"
              >
                <g>
                  <path
                    d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017
		c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382
		c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076
		c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427
		c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437
		c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536
		c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609
		c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611
		c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787
		c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739
		C23.307,19.268,23.307,18.533,23.214,18.38z"
                  />
                </g>
              </svg>
            </button>
            <p className="text-sm text-gray-800 mt-2">Whatsapp</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <button
              className="rounded-full px-5 py-5 text-white bg-[#4a4a4a] hover:bg-gray-700 transition-colors"
              onClick={handleCopy}
            >
              <Link />
            </button>
            <p className="text-sm text-gray-800 mt-2">Copy Link</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <button className="rounded-full px-5 py-5 text-white bg-[#239bce] hover:bg-[#1386b8] transition-colors">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.1117 4.49449C23.4296 2.94472 21.9074 1.65683 20.4317 2.227L2.3425 9.21601C0.694517 9.85273 0.621087 12.1572 2.22518 12.8975L6.1645 14.7157L8.03849 21.2746C8.13583 21.6153 8.40618 21.8791 8.74917 21.968C9.09216 22.0568 9.45658 21.9576 9.70712 21.707L12.5938 18.8203L16.6375 21.8531C17.8113 22.7334 19.5019 22.0922 19.7967 20.6549L23.1117 4.49449ZM3.0633 11.0816L21.1525 4.0926L17.8375 20.2531L13.1 16.6999C12.7019 16.4013 12.1448 16.4409 11.7929 16.7928L10.5565 18.0292L10.928 15.9861L18.2071 8.70703C18.5614 8.35278 18.5988 7.79106 18.2947 7.39293C17.9906 6.99479 17.4389 6.88312 17.0039 7.13168L6.95124 12.876L3.0633 11.0816ZM8.17695 14.4791L8.78333 16.6015L9.01614 15.321C9.05253 15.1209 9.14908 14.9366 9.29291 14.7928L11.5128 12.573L8.17695 14.4791Z"
                  fill="white"
                />
              </svg>
            </button>
            <p className="text-sm text-gray-800 mt-2">Telegram</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <button className="rounded-full px-5 py-5 text-white bg-[#4a4a4a] hover:bg-gray-700 transition-colors">
              <Mail />
            </button>
            <p className="text-sm text-gray-800 mt-2">Email</p>
          </div>
        </div>
        <button
          className="px-6 py-3 rounded-3xl bg-[#41eb5c] text-gray-800 font-semibold text-base w-full max-w-md shadow hover:bg-green-400 transition mt-2"
          onClick={() => setCurrentPage("dashboard")}
        >
          Go to Dashboard
        </button>
      </section>
      <AppHooter />
    </div>
  );
};

export default SharePage;
